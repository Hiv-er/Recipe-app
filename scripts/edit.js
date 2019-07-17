const titleElement = document.querySelector('.recipe-title');
const stepsElement = document.querySelector('.recipe-steps');
const addRecipeButtonElement = document.querySelector('.add-recipe');
const saveRecipeButtonElement = document.querySelector('.save-recipe');
const deleteRecipeButtonElement = document.querySelector('.delete-recipe');
const addIngredientButtonElement = document.querySelector('.add-ingredient-button');
const ingredientInputElement = document.querySelector('.add-ingredient-input');

const recipes = loadRecipes();
let ingredients = [];
const recipeId = location.hash.substring(1);

const recipe = recipes.find((item) => item.id === recipeId);

if (recipe !== undefined) {
    titleElement.value = recipe.title;
    stepsElement.value = recipe.steps;
    addRecipeButtonElement.classList.remove('btn-display');
    deleteRecipeButtonElement.classList.add('btn-display');
    saveRecipeButtonElement.classList.add('btn-display');
    ingredients = recipe.ingredients;
    renderIngredients(ingredients);
}



addRecipeButtonElement.addEventListener('click', (e) => {
    e.preventDefault();

    if (validateFields(titleElement, stepsElement)) {
        recipes.push({
            id: recipeId,
            title: titleElement.value,
            steps: stepsElement.value,
            ingredients
        });
        saveRecipes(recipes);
        location.assign(`/index.html`)
    }
});

saveRecipeButtonElement.addEventListener('click', (e) => {
    e.preventDefault();

    if (validateFields(titleElement, stepsElement)) {
        recipe.title = titleElement.value;
        recipe.steps = stepsElement.value;
        saveRecipes(recipes);
        location.assign(`/index.html`)
    }
});

deleteRecipeButtonElement.addEventListener('click', (e) => {
    e.preventDefault();
    removeRecipe(recipeId);
    saveRecipes(recipes);
    location.assign(`/index.html`)
});

addIngredientButtonElement.addEventListener('click', (e) => {
    e.preventDefault();
    const ingredient = ingredientInputElement.value.trim();

    if (ingredient.length > 0) {
        ingredients.push({
            ingredientTitle: ingredient,
            inStock: false
        });
        ingredientInputElement.value = '';
        renderIngredients(ingredients);
    }
});



