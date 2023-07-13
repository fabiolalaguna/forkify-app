import { async } from 'regenerator-runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

// // import icons from '../img/icons.svg'; //Parcel v1
// import icons from 'url:../img/icons.svg'; //Parcel v2
// console.log(icons);
import 'core-js/stable'; // Polyfilling todo lo demas
import 'regenerator-runtime/runtime'; //Para polyfilling async/await

if (module.hot) {
  module.hot.accept();
}

// const recipeContainer = document.querySelector('.recipe');

// const timeout = function (s) {
//   return new Promise(function (_, reject) {
//     setTimeout(function () {
//       reject(new Error(`Request took too long! Timeout after ${s} second`));
//     }, s * 1000);
//   });
// };

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
// const renderSpinner = function (parentElement) {
//   const markup = `
//   <div class="spinner">
//     <svg>
//       <use href="${icons}#icon-loader"></use>
//     </svg>
//   </div>
//   `;
//   parentElement.innerHTML = '';
//   parentElement.insertAdjacentHTML('afterbegin', markup);
// };

const controlRecipes = async function () {
  try {
    // Hashchange recipe id
    const id = window.location.hash.slice(1);
    // console.log(id);
    if (!id) return;

    // -Mostrando el spinner antes de que cargue la receta
    recipeView.renderSpinner();

    // 0) Update results view to mark selected search result (Actualizando los resultados para mantener seleccionado/marcado el resultado de la busqueda actual)

    resultsView.update(model.getSearchResultsPage());

    // 1) Loading recipe
    await model.loadRecipe(id);
    // Destructuring from model.js to be able to use in markup
    // const { recipe } = model.state;

    /* Code before refactorizing
    // const res = await fetch(
    //   // `https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604691c37cdc054bd0bc`
    //   `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
    // );
    // const data = await res.json();
    // console.log(data);

    // if (!res.ok) throw new Error(`${data.message} ${res.status}`);

    // let { recipe } = data.data;

    // recipe = {
    //   id: recipe.id,
    //   title: recipe.title,
    //   publisher: recipe.publisher,
    //   sourceUrl: recipe.source_url,
    //   image: recipe.image_url,
    //   servings: recipe.servings,
    //   cookingTime: recipe.cooking_time,
    //   ingredients: recipe.ingredients,
    // };
    // console.log(recipe);

    */

    // 2) Rendering recipe
    recipeView.render(model.state.recipe);
    // controlServings();

    // 3) Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    /*  Code before refactorizing
    // const markup = `
    //   <figure class="recipe__fig">
    //     <img src="${recipe.image}" alt="Tomato" class="recipe__img" />
    //     <h1 class="recipe__title">
    //       <span>${recipe.title}</span>
    //     </h1>
    //   </figure>

    //   <div class="recipe__details">

    //     <div class="recipe__info">
    //       <svg class="recipe__info-icon">
    //         <use href="${icons}#icon-clock"></use>
    //       </svg>
    //       <span class="recipe__info-data recipe__info-data--minutes">${
    //         recipe.cookingTime
    //       }</span>
    //       <span class="recipe__info-text">minutes</span>
    //     </div>

    //     <div class="recipe__info">
    //       <svg class="recipe__info-icon">
    //         <use href="${icons}#icon-users"></use>
    //       </svg>
    //       <span class="recipe__info-data recipe__info-data--people">${
    //         recipe.servings
    //       }</span>
    //       <span class="recipe__info-text">servings</span>

    //       <div class="recipe__info-buttons">
    //         <button class="btn--tiny btn--increase-servings">
    //           <svg>
    //             <use href="${icons}#icon-minus-circle"></use>
    //           </svg>
    //         </button>
    //         <button class="btn--tiny btn--increase-servings">
    //           <svg>
    //             <use href="${icons}#icon-plus-circle"></use>
    //           </svg>
    //         </button>
    //       </div>
    //     </div>

    //     <div class="recipe__user-generated">
    //       <svg>
    //         <use href="${icons}#icon-user"></use>
    //       </svg>
    //     </div>
    //     <button class="btn--round">
    //       <svg class="">
    //         <use href="${icons}#icon-bookmark-fill"></use>
    //       </svg>
    //     </button>
    //   </div>

    //   <div class="recipe__ingredients">
    //     <h2 class="heading--2">Recipe ingredients</h2>
    //     <ul class="recipe__ingredient-list">
    //       ${recipe.ingredients
    //         .map(ing => {
    //           return `
    //         <li class="recipe__ingredient">
    //           <svg class="recipe__icon">
    //             <use href="${icons}#icon-check"></use>
    //           </svg>
    //           <div class="recipe__quantity">${ing.quantity}</div>
    //           <div class="recipe__description">
    //             <span class="recipe__unit">${ing.unit}</span>
    //             ${ing.description}
    //           </div>
    //         </li>
    //       `;
    //         })
    //         .join(' ')}
    //     </ul>
    //   </div>

    //   <div class="recipe__directions">
    //     <h2 class="heading--2">How to cook it</h2>
    //     <p class="recipe__directions-text">
    //       This recipe was carefully designed and tested by
    //       <span class="recipe__publisher">${
    //         recipe.publisher
    //       }</span>. Please check out
    //       directions at their website.
    //     </p>
    //     <a
    //       class="btn--small recipe__btn"
    //       href="http://thepioneerwoman.com/cooking/pasta-with-tomato-cream-sauce/"
    //       target="_blank"
    //     >
    //       <span>Directions</span>
    //       <svg class="search__icon">
    //         <use href="${icons}#icon-arrow-right"></use>
    //       </svg>
    //     </a>
    //   </div>
    // `;
    // recipeContainer.innerHTML = '';
    // recipeContainer.insertAdjacentHTML('afterbegin', markup);
  */
  } catch (error) {
    recipeView.renderError();
    console.log(error);
  }
};

const controlSearchRecipes = async function () {
  try {
    resultsView.renderSpinner();

    // 1. Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2. Load search results
    await model.loadSearchResults(query);

    // 3. Render results
    // console.log(model.state.search.results);
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage(1));

    // 4. REnder initial pagination
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};
// controlSearchRecipes();

const controlPagination = function (goToPage) {
  // console.log(goToPage);
  // 1. Render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 4. Render new pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // update the recipe servings (in state)
  model.updateServings(newServings);

  // update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add/remove bookmark

  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }

  // model.addBookmark(model.state.recipe);
  // console.log(model.state.recipe);
  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmark
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    // console.log(model.state.recipe);

    // Render new recipe added
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in the URL (history is the API of browser)
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // window.history.back() // para ir hacia atras

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
    //
  } catch (error) {
    console.error(error);
    addRecipeView.renderError(error.message);
  }
};
/////////////////////////// INIT
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);

  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);

  searchView.addHandlerSearch(controlSearchRecipes);
  paginationView.addHandlerClick(controlPagination);

  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
//Code before refactorizing

// hash change and load
// ['hashchange', 'load'].forEach(e => window.addEventListener(e, controlRecipes));
// window.addEventListener('hashchange', controlRecipes);
// window.addEventListener('load', controlRecipes);
