import icons from 'url:../../img/icons.svg'; //Parcel v2

export default class View {
  _data;

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return this.renderError();
    }

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    // this._parentElement.innerHTML = '';
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    // if (!data || (Array.isArray(data) && data.length === 0)) {
    //   return this.renderError();
    // }

    this._data = data;
    const newMarkup = this._generateMarkup();

    // Se convertira en un objeto de nodos
    const newDOM = document.createRange().createContextualFragment(newMarkup);

    const newElements = Array.from(newDOM.querySelectorAll('*'));

    const currentElement = Array.from(
      this._parentElement.querySelectorAll('*')
    );

    newElements.forEach((newEl, i) => {
      const currEl = currentElement[i];
      // console.log(currentEle, newELe.isEqualNode(currentEle));

      // Updates changed text
      if (
        !newEl.isEqualNode(currEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        currEl.textContent = newEl.textContent;
      }

      // Update changed atributes
      if (!newEl.isEqualNode(currEl)) {
        // console.log(newEl.attributes);

        // Estamos reemplazando todos los attributos en el elemento actual por los atributos del nuevo element
        Array.from(newEl.attributes).forEach(attr => {
          currEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>
    `;
    // this._parentElement.innerHTML = '';
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smilee"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
