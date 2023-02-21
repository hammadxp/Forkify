import { API_URL, API_KEY, RESULTS_PER_PAGE } from './config.js';
import { AJAX } from './helpers.js';
import { async } from 'regenerator-runtime';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RESULTS_PER_PAGE,
    page: 1,
    sortBy: 'default',
  },
  bookmarks: [],
  shoppingList: [],
};

const createRecipeObject = function (data) {
  const recipe = data.data.recipe;

  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${API_KEY}`);

    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => state.recipe.id === bookmark.id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    console.log(state.recipe);
    // console.log('Recipe loaded!');

    // TEST

    // const data1 = JSON.stringify(state.recipe);
    // const data2 = JSON.parse(data1);
    // console.log(data1);
    // console.log(data2);
    // const raw = Object.assign(state.recipe.ingredients);
    // console.log(JSON.stringify(raw));
    // console.log(nutrients);
    // const raw = Object.assign(nutrients);
    // console.log(JSON.stringify(nutrients[0]));
    // const raw = Object.assign({}, ...state.recipe.ingredients);
    // console.log(JSON.stringify(raw));

    // const test = [
    //   [
    //     'Child Array 01',
    //     [
    //       {
    //         name: 'Child Array 02',
    //       },
    //       ['Child Array 03'],
    //     ],
    //     {
    //       name: 'Calories',
    //       amount: 1820,
    //       unit: 'kcal',
    //       percentOfDailyNeeds: 91,
    //     },
    //     { name: 'Fat', amount: 4.9, unit: 'g', percentOfDailyNeeds: 7.54 },
    //   ],
    //   { name: 'Sugar', amount: 1.35, unit: 'g', percentOfDailyNeeds: 1.5 },
    // ];
    // console.log(JSON.stringify(test));
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    const data = await AJAX(`${API_URL}/?search=${query}&key=${API_KEY}`);

    state.search.page = 1;
    state.search.query = query;
    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
    state.search.totalPages = Math.ceil(
      state.search.results.length / state.search.resultsPerPage
    );
    state.search.resultsOriginal = Array.from(state.search.results);
  } catch (err) {
    throw err;
  }
};

export const loadSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const loadNewServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;

  // console.log(newServings);
  // console.log(state.recipe);
};

const storeBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  if (recipe.id === state.recipe.id) {
    recipe.bookmarked = true;
  }

  state.bookmarks.push(recipe);

  storeBookmarks();
};

export const deleteBookmark = function (id) {
  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }

  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
  state.bookmarks.splice(index, 1);

  storeBookmarks();
};

export const uploadRecipe = async function (recipe) {
  try {
    // const ingredients = Object.entries(recipe)
    //   .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
    //   .map(ing => {
    //     const ingArr = ing[1].split(',').map(el => el.trim());

    //     if (ingArr.length !== 3)
    //       throw new Error('Wrong format of the ingredients!');

    //     const [quantity, unit, description] = ingArr;
    //     return { quantity, unit, description };
    //   });

    const getIngredients = function () {
      const ingredients = [];

      for (let ing = 1; ing < recipe.ingredientsNum + 1; ing++) {
        const ingArr = Object.entries(recipe)
          .filter(entry => entry[0].startsWith(`ingredient-${ing}`))
          .map(el => el[1].trim());

        const [quantity, unit, description] = ingArr;

        if (!quantity && !unit && !description) {
          // ignore ingredient
        } else {
          ingredients.push({
            quantity: quantity ? +quantity : null,
            unit,
            description,
          });
        }
      }

      return ingredients;
    };

    const ingredients = getIngredients();
    // console.log(ingredients);
    // return;

    const recipeToUpload = {
      title: recipe.title,
      publisher: recipe.publisher,
      source_url: recipe.sourceUrl,
      image_url: recipe.image,
      servings: +recipe.servings,
      cooking_time: +recipe.cookingTime,
      ingredients: ingredients,
    };

    console.log(recipeToUpload);

    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipeToUpload);
    state.recipe = createRecipeObject(data);

    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

export const sortResults = function (sortBy) {
  if (sortBy === 'default') {
    state.search.sortBy = 'default';
    state.search.results = state.search.resultsOriginal;
  }

  if (sortBy === 'title') {
    state.search.sortBy = 'title';
    state.search.results.sort((a, b) =>
      a.title > b.title ? 1 : b.title > a.title ? -1 : 0
    );
  }

  if (sortBy === 'publisher') {
    state.search.sortBy = 'publisher';
    state.search.results.sort((a, b) =>
      a.publisher > b.publisher ? 1 : b.publisher > a.publisher ? -1 : 0
    );
  }

  state.search.page = 1;

  console.log(state);
};

export const addToShoppingList = function () {
  const shoppingList = state.shoppingList;
  const ingredientsNew = state.recipe.ingredients;

  ingredientsNew.forEach(function (ingNew) {
    if (
      !shoppingList.some(
        ingOld =>
          ingOld.description.toLowerCase() === ingNew.description.toLowerCase()
      )
    ) {
      shoppingList.push(ingNew);
    } else {
      shoppingList.forEach(function (ingOld) {
        if (
          ingNew.description.toLowerCase() === ingOld.description.toLowerCase()
        ) {
          ingOld.quantity = ingNew.quantity + ingOld.quantity;
        }
      });
    }
  });

  state.shoppingList.sort((a, b) =>
    a.description > b.description ? 1 : b.description > a.description ? -1 : 0
  );

  localStorage.setItem('shoppingList', JSON.stringify(state.shoppingList));

  // console.log('Added to shopping list!');
  // console.log('To Add', ingredientsNew);
  // console.log('Shopping List', state.shoppingList);
};

export const spoonacular = async function () {
  try {
    for (let index = 0; index < state.recipe.ingredients.length; index++) {
      const ingredient = state.recipe.ingredients[index];

      const ingredientForInfo = {
        title: state.recipe.title,
        servings: state.recipe.servings,
        ingredients: [
          `${ingredient.quantity} ${ingredient.unit} ${ingredient.description}`,
        ],
      };

      const url = 'https://api.spoonacular.com/recipes/analyze';
      const apiKey = 'a3aedf10a104424ea00d9f5971276bf3';

      const data = await AJAX(
        `${url}?includeNutrition=true&apiKey=${apiKey}`,
        ingredientForInfo
      );

      ingredient.nutrients = data.nutrition.nutrients.filter(
        item =>
          item.name === 'Calories' ||
          item.name === 'Fat' ||
          item.name === 'Sugar' ||
          item.name === 'Protein'
      );
      // console.log('Recipe updated!');
    }
  } catch (err) {
    console.error(`!!! ${err}`);
  }
};

// 'x-api-key': 'a3aedf10a104424ea00d9f5971276bf3',

// const ingredients = {
//   title: 'Sausage Pasta',
//   servings: 4,
//   ingredients: ['1 pound spicy italian sausage'],
// };

export const spoonacularMini = function () {
  const nutrients = [
    [
      { name: 'Calories', amount: 1820, unit: 'kcal', percentOfDailyNeeds: 91 },
      { name: 'Fat', amount: 4.9, unit: 'g', percentOfDailyNeeds: 7.54 },
      { name: 'Sugar', amount: 1.35, unit: 'g', percentOfDailyNeeds: 1.5 },
      { name: 'Protein', amount: 51.65, unit: 'g', percentOfDailyNeeds: 103.3 },
    ],
    [
      {
        name: 'Calories',
        amount: 29.4,
        unit: 'kcal',
        percentOfDailyNeeds: 1.47,
      },
      { name: 'Fat', amount: 0.37, unit: 'g', percentOfDailyNeeds: 0.57 },
      { name: 'Sugar', amount: 4.36, unit: 'g', percentOfDailyNeeds: 4.85 },
      { name: 'Protein', amount: 1.47, unit: 'g', percentOfDailyNeeds: 2.94 },
    ],
  ];

  state.recipe.ingredients.forEach((ingredient, index) => {
    ingredient.nutrients = nutrients[index];
  });
};

const init = async function () {
  const storedBookmarks = localStorage.getItem('bookmarks');
  if (storedBookmarks) state.bookmarks = JSON.parse(storedBookmarks);

  // const storedShoppingList = localStorage.getItem('shoppingList');
  // if (storedShoppingList) state.shoppingList = JSON.parse(storedShoppingList);

  localStorage.removeItem('shoppingList');
  state.shoppingList = [];

  // console.log(state.bookmarks);
  // console.log(state.shoppingList);
};

init();
