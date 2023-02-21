import View from './View.js';

class ShoppingList extends View {
  _parentElement = document.querySelector('.shopping-list__list');

  _message = '';
  _errorMessage = 'Find a nice recipe and add it to the shopping list :)';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    const markup = this._data
      .map(item => {
        return `
        <li class="shopping-list__item">
          ${
            item.quantity
              ? `<span class="shopping-list__item--amount">${item.quantity} ${item.unit}</span>`
              : ''
          }
          <span class="shopping-list__item--description">${
            item.description
          }</span>
        </li>
      `;
      })
      .join('');

    return markup;
  }
}

export default new ShoppingList();
