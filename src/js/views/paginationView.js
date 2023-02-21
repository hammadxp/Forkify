import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');

      if (!btn) return;

      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currentPage = this._data.page;
    const totalPages = this._data.totalPages;

    // If page 1 + other pages
    if (currentPage === 1 && totalPages > 1) {
      return this._generateMarkupButtonNext(currentPage).concat(
        this._generateMarkupTotalPages()
      );
    }

    // If last page
    if (currentPage === totalPages && totalPages > 1) {
      return this._generateMarkupButtonPrev(currentPage).concat(
        this._generateMarkupTotalPages()
      );
    }

    // If any other page
    if (currentPage > 1 && currentPage < totalPages) {
      return this._generateMarkupButtonPrev(currentPage)
        .concat(this._generateMarkupButtonNext(currentPage))
        .concat(this._generateMarkupTotalPages());
    }

    // If page 1 + NO other pages
    if (currentPage === 1) {
      return this._generateMarkupTotalPages();
    }
  }

  _generateMarkupButtonPrev(currentPage) {
    return `
      <button class="btn--inline pagination__btn--prev" data-goto=${
        currentPage - 1
      }>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${currentPage - 1}</span>
      </button>
      `;
  }

  _generateMarkupButtonNext(currentPage) {
    return `
      <button class="btn--inline pagination__btn--next" data-goto="${
        currentPage + 1
      }">
        <span>Page ${currentPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
      `;
  }

  _generateMarkupTotalPages() {
    const totalPages = this._data.totalPages;

    return `
      <div class="pagination__total--container">
        <p class="pagination__total">Total Pages: ${totalPages}</p>
      </div>
    `;
  }
}

export default new PaginationView();
