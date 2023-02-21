import View from './View.js';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _btnAdd = document.querySelector('.btn__add-ingredient');
  _ingredientsEl = this._parentElement
    .getElementsByTagName('div')[1]
    .querySelector('.upload__column');

  _message = 'Your recipe is successfully uploaded :)';
  _ingredientsNum = 6;

  constructor() {
    super();
    this._addHandlerOpenWindow();
    this._addHandlerCloseWindow();
    this._addHandlerAddIngredient();
  }

  toggleWindow() {
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }

  _addHandlerOpenWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerCloseWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener(
      'submit',
      function (e) {
        e.preventDefault();

        const dataArr = [...new FormData(this._parentElement)];
        const data = Object.fromEntries(dataArr);
        data.ingredientsNum = this._ingredientsNum;

        handler(data);
      }.bind(this)
    );
  }

  _addHandlerAddIngredient() {
    this._btnAdd.addEventListener('click', this.renderAddIngredient.bind(this));

    // {
    // e.preventDefault();
    // console.log('clicked');
    // this.just;
    // };
  }

  renderAddIngredient() {
    // console.log(this._ingredientsNum);
    // const ingNum = this._ingredientsNum + 1;
    // console.log(ingNum);

    this._ingredientsNum++;

    const markup = `
      <label>Ingredient ${this._ingredientsNum}</label>
      <div class="ingredient">
        <input
          value=""
          type="number"
          name="ingredient-${this._ingredientsNum}--quantity"
          placeholder="Qty."
        />
        <input
          value=""
          type="text"
          name="ingredient-${this._ingredientsNum}--unit"
          placeholder="Unit"
        />
        <input
          value=""
          type="text"
          name="ingredient-${this._ingredientsNum}--description"
          placeholder="Desc."
        />
      </div>
    `;

    this._ingredientsEl.insertAdjacentHTML('beforeend', markup);
  }
}

export default new AddRecipeView();
