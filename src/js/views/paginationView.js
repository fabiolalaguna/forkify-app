import View from './view.js';
// import icons from 'url:./img/icons.svg'; //Parcel v2
import icons from 'url:../../img/icons.svg';
// import

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');

      const goToPage = +btn.dataset.goto;

      if (!btn) return;

      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currentPage = this._data.page;
    // Necesitamos el numero de resultados, dividido por el numero de resultados por pagina
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // console.log(numPages);

    //////////////////////
    // If we are in page 1 and there other pages
    if (currentPage === 1 && numPages > 1) {
      //Entonces, si estamos actualmente en la página uno, que es esta this._data.page === 1
      // y hay otras páginas numPages > 1 Y eso básicamente significa que el número de páginas aquí es mayor que uno.
      return `
      <button data-goto="${
        currentPage + 1
      }" class="btn--inline pagination__btn--next">
        <span>${currentPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button> 
      `;
    }

    //////////////
    // Last page
    if (currentPage === numPages && numPages > 1) {
      //Si el numero de pagina actual es 6 y son 6 paginas en total, significa que estamos en la ultima pagina
      return `
      <button data-goto="${
        currentPage - 1
      }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>${currentPage - 1}</span>
      </button>
      `;
    }

    ///////////////
    // Other page
    if (currentPage < numPages) {
      return `
      <button data-goto="${
        currentPage - 1
      }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>${currentPage - 1}</span>
      </button>
      <button data-goto="${
        currentPage + 1
      }" class="btn--inline pagination__btn--next">
        <span>${currentPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button> 
      `;
    }

    ///////////
    // If we are in page 1 and there are NOT other pages
    return '';
  }

  // _generateMarkupBtns(prev, next) {
  //   const prevBtn = `
  //   <button class="btn--inline pagination__btn--prev">
  //     <svg class="search__icon">
  //       <use href="${icons}#icon-arrow-left"></use>
  //     </svg>
  //     <span>${currentPage - 1}</span>
  //   </button>`;

  //   const nextBtn = `
  //     <button class="btn--inline pagination__btn--next">
  //       <span>${currentPage + 1}</span>
  //       <svg class="search__icon">
  //         <use href="${icons}#icon-arrow-right"></use>
  //       </svg>
  //     </button>
  //   `;
  // }
}

export default new PaginationView();
