import View from './View.js';
import icons from 'url:../../img/icons.svg';
import { Fraction } from 'fractional';

class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');

  _message = 'Start by searching for a recipe or an ingredient. Have fun!';
  _errorMessage = 'No recipes found for your query. Please try again!';

  ingNum = 0;

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
    window.addEventListener('hashchange', handler);
  }

  addHandlerHover() {
    this._parentElement.addEventListener('mouseover', function (e) {
      const ingredientEl = e.target.closest('.recipe__ingredient');

      if (!ingredientEl) return;

      const ingNum = ingredientEl.dataset.ingredientNum;
    });
  }

  addHandlerServings(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--update-servings');

      if (!btn) return;

      const updateServingsTo = +btn.dataset.updateServingsTo;
      if (updateServingsTo > 0) {
        handler(updateServingsTo);
      }
    });
  }

  addHandlerBookmark(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark');

      if (!btn) return;

      handler();
    });
  }

  addHandlerShoppingList(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--shopping-list');

      if (!btn) return;

      handler();
    });
  }

  _generateMarkup() {
    return `
    <figure class="recipe__fig">
      <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
      <h1 class="recipe__title">
        <span>${this._data.title}</span>
      </h1>
    </figure>

    <div class="recipe__details">
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-clock"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--minutes">${
          this._data.cookingTime
        }</span>
        <span class="recipe__info-text">minutes</span>
      </div>
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-users"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--people">${
          this._data.servings
        }</span>
        <span class="recipe__info-text">servings</span>

        <div class="recipe__info-buttons">
          <button class="btn--tiny btn--update-servings" data-update-servings-to=${
            this._data.servings - 1
          }>
            <svg>
              <use href="${icons}#icon-minus-circle"></use>
            </svg>
          </button>
          <button class="btn--tiny btn--update-servings" data-update-servings-to=${
            this._data.servings + 1
          }>
            <svg>
              <use href="${icons}#icon-plus-circle"></use>
            </svg>
          </button>
        </div>
      </div>

      <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
        <svg>
          <use href="${icons}#icon-user"></use>
        </svg>
      </div>
      <button class="btn--round btn--shopping-list">
        <svg class="">
          <use href="${icons}#icon-check"></use>
        </svg>
      </button>
      <button class="btn--round btn--bookmark">
        <svg class="">
          <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
        </svg>
      </button>

    </div>

    <div class="recipe__ingredients">
      <h2 class="heading--2">Recipe ingredients</h2>
      <ul class="recipe__ingredient-list">
        ${this._data.ingredients
          .map(ing => this._generateMarkupIngredient(ing))
          .join('')}
      </ul>

      ${/* this._generateMarkupTotalCalories() */ ''}
    </div>

    <div class="recipe__directions">
      <h2 class="heading--2">How to cook it</h2>
      <p class="recipe__directions-text">
        This recipe was carefully designed and tested by
        <span class="recipe__publisher">${
          this._data.publisher
        }</span>. Please check out
        directions at their website.
      </p>
      <a
        class="btn--small recipe__btn"
        href="${this._data.sourceUrl}"
        target="_blank"
      >
        <span>Directions</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </a>
    </div>
    `;
  }

  _generateMarkupIngredient(ing) {
    this.ingNum++;
    // console.log(this._data.ingredients[0]);

    return `
      <li class="recipe__ingredient" data-ingredient-num="${this.ingNum}">
        <svg class="recipe__icon">
          <use href="${icons}#icon-check"></use>
        </svg>
        <div class="recipe__quantity">${
          ing.quantity ? new Fraction(ing.quantity).toString() : ''
        }</div>
        <div class="recipe__description">
          <span class="recipe__unit">${ing.unit}</span>
          ${ing.description}
        
          ${/* this._generateMarkupPopup() */ ''}
        </div>
      </li>
    `;
  }

  _generateMarkupTotalCalories() {
    return `
      <span class="recipe__ingredients-calories">Total Calories: <b>${this._data.ingredients
        .map(ing => ing.nutrients.find(item => item.name === 'Calories').amount)
        .reduce((sum, calorie) => sum + calorie, 0)}</b> kcal</span>
    `;
  }

  _generateMarkupPopup() {
    return `
      <span class="recipe__ingredient-popup">${this._data.ingredients[
        this.ingNum - 1
      ].nutrients
        .map(item => `<p>${item.name}: ${item.amount}${item.unit}</p>`)
        .join('')}</span>
    `;
  }

  // _generateMarkupNutrients() {
  //   return `
  //     <div class="nutrients"></div>
  //   `;
  // }
}

export default new RecipeView();
