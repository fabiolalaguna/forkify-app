import View from './view.js';
// import icons from 'url:./img/icons.svg'; //Parcel v2
import icons from 'url:../../img/icons.svg';
// import

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _closeBtn = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this.addHandlerHideWindow();
  }
  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerHideWindow() {
    this._closeBtn.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();

      const dataArray = [...new FormData(this)];
      const data = Object.fromEntries(dataArray);
      console.log(data);
      handler(data);
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
