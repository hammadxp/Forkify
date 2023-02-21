import View from './View.js';

class SortView extends View {
  _parentElement = document.querySelector('.sort');
  _optionsElement = document.querySelector('.sort__options');

  addHandlerOption(handler) {
    this._optionsElement.addEventListener('change', function () {
      const option = this.value;

      handler(option);
    });
  }

  showSortOptions() {
    this._parentElement.classList.remove('hidden');
  }
}

export default new SortView();
