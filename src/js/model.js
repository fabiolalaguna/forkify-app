import { async } from 'regenerator-runtime';
import { API_URL } from './config.js';
import { RESULTS_PER_PAGE } from './config.js';
import { API_KEY } from './config.js';
//Not anymore because we did a refactorizing in helpers with Ajax
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RESULTS_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
    /** The && operator returns the first falsy value, or the last one (if the first one is truthy). In this case 
    recipe.key && {key: recipe.key} we ask "Does the recipe.key exists"? If so, return this object {key: recipe.key}. So, we're really destructuring this object {key: recipe.key} in another object 
    const recipe = {
      id: 'some id',
      ...{ key: 'some key' }
    };
    And, destructuring will just add the "key" property to the recipe object.
    const recipe = {
      id: 'some id',
      key: 'some key'
    };*/
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);
    // const data = await getJSON(`${API_URL}${id}`);

    // const res = await fetch(`${API_URL}/${id}`);
    // const data = await res.json();
    // console.log(data);

    // if (!res.ok) throw new Error(`${data.message} ${res.status}`);

    state.recipe = createRecipeObject(data);

    // Code before refactorizing
    // const { recipe } = data.data;
    // state.recipe = {
    //   id: recipe.id,
    //   title: recipe.title,
    //   publisher: recipe.publisher,
    //   sourceUrl: recipe.source_url,
    //   image: recipe.image_url,
    //   servings: recipe.servings,
    //   cookingTime: recipe.cooking_time,
    //   ingredients: recipe.ingredients,
    // };

    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }

    // console.log(state.recipe);
  } catch (error) {
    // alert(error);
    // console.error(`${error}`);
    throw error;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
    // const data = await getJSON(`${API_URL}?search=${query}`);
    // console.log(data);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });

    state.search.page = 1;
    // console.log(state.search.results);
  } catch (error) {
    console.error(`${error}`);
    throw error;
  }
};
// loadSearchResults('pasta');

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; // esto sera 0

  const end = page * state.search.resultsPerPage; // 9

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  // llegar al state, en particular a los ingredientes de la receta y cambiar al cantidad en cada ingrediente.

  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // formula para calcular la cantidad de nuevos ingredientes:
    // newQuantity = oldQty * newServings / oldServings
  });

  // actualizando en el state
  state.recipe.servings = newServings;
};

const persistBookmark = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) {
    // Estamos estableciendo una nueva propiedad en el objeto receta
    state.recipe.bookmarked = true;
  }

  persistBookmark();
};

export const deleteBookmark = function (id) {
  // Delete bookmarked
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) {
    // Estamos estableciendo una nueva propiedad en el objeto receta
    state.recipe.bookmarked = false;
  }

  persistBookmark();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();
// console.log(state.bookmarks);

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks()

/////////////////
// Hara una solicitud a la API y reibira los datos para una nueva receta(newrecipe),
export const uploadRecipe = async function (newRecipe) {
  try {
    // 1) TOmara los datos de entrada
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArray = ing[1].split(',').map(el => el.trim());
        // const ingArray = ing[1].replaceAll(' ', '').split(',');

        if (ingArray.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format.'
          );

        // Destructuring
        const [quantity, unit, description] = ingArray;
        // const [quantity, unit, description] = ing[1]
        //   .replaceAll(' ', '')
        //   .split(',');
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    // state.recipe = createRecipeObject(data);

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    // const data = await sendJSON(`${API_URL}?key=${API_KEY}`, recipe);

    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
};
