import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import sortView from './views/sortView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import shoppingListView from './views/shoppingListView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_TIMEOUT_SEC } from './config.js';
import { async } from 'regenerator-runtime';

// This function will run when page loads, or when hash in URL changes

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return; // If no hash in URL, then don't load any recipe

    // Mark selected result

    resultsView.update(model.loadSearchResultsPage());

    // Mark selected bookmark

    if (model.state.bookmarks !== []) {
      bookmarksView.render(model.state.bookmarks);
    }

    // if (model.state.bookmarks.length !== 0) {
    //   bookmarksView.render(model.state.bookmarks);
    // }

    // START

    recipeView.renderSpinner();

    // Load recipe data from API + Store recipe data in 'State' object as 'recipe'

    await model.loadRecipe(id);

    // Spoonacular

    // await model.spoonacular();
    // model.spoonacularMini();
    // Promise.all([model.loadRecipe(id), model.spoonacular()]).then(console.log('done!'));
    // const delay = function (seconds) {
    //   return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    // };
    // await delay(6);

    // Get recipe data from 'State' object + Store recipe data in '#data' object in 'RecipeView' class + Render recipe data with '#data'

    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError(`${err} 🔥🔥🔥`);
    console.error(err);
  }
};

// This function will be called when the user clicks on search enter button

const controlSearchResults = async function () {
  try {
    // START

    resultsView.renderSpinner();

    // Get search query

    const query = searchView.getQuery();
    if (!query) return;

    // Load search results (create state.search.results -> array of objects, formatted)

    await model.loadSearchResults(query);

    // Render search results (from state.search.results -> array of objects)

    resultsView.render(model.loadSearchResultsPage()); // render method also updates this._data for all views, loadSearchResultsPage default to page 1

    // Render pagination buttons
    paginationView.render(model.state.search);

    // Show sort options
    sortView.showSortOptions();

    // Other
    // console.log(model.state.search.results);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // Render NEW search results
  resultsView.render(model.loadSearchResultsPage(goToPage));

  // Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  model.loadNewServings(newServings);

  recipeView.update(model.state.recipe);
};

const controlStoredBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlToggleBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  recipeView.update(model.state.recipe);

  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (recipe) {
  try {
    addRecipeView.renderSpinner();

    await model.uploadRecipe(recipe);

    addRecipeView.renderMessage();

    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_TIMEOUT_SEC * 1000);

    recipeView.render(model.state.recipe);

    bookmarksView.render(model.state.bookmarks);

    window.history.pushState(null, '', `#${model.state.recipe.id}`);
  } catch (err) {
    addRecipeView.renderError(err.message);
    console.error(`🔥 ${err.message}`);
  }
};

const constrolSort = function (sortBy) {
  model.sortResults(sortBy);

  resultsView.render(model.loadSearchResultsPage());
  paginationView.render(model.state.search);
};

const controlAddToShoppingList = function () {
  model.addToShoppingList();

  shoppingListView.render(model.state.shoppingList);
};

const controlStoredShoppingList = function () {
  shoppingListView.render(model.state.shoppingList);
};

// const controlNutrients = function (ingNum) {
//   console.log(model.state.recipe.ingredients[ingNum - 1].nutrients);
// };

const welcomeFeature = function () {
  console.log('Welcome to the app!');
};

const init = function () {
  bookmarksView.addHandlerRender(controlStoredBookmarks);
  shoppingListView.addHandlerRender(controlStoredShoppingList);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerHover();
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerBookmark(controlToggleBookmark);
  recipeView.addHandlerShoppingList(controlAddToShoppingList);
  searchView.addHandlerSearch(controlSearchResults);
  sortView.addHandlerOption(constrolSort);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  welcomeFeature();
};

init();
