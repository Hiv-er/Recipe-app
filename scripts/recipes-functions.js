const loadRecipes = function () {
    const recipesJSON = localStorage.getItem('recipes');

    if (recipesJSON !== null) {
        return JSON.parse(recipesJSON);
    } else {
        return [];
    }
};

const saveRecipes = (recipes) => localStorage.setItem('recipes', JSON.stringify(recipes));

const removeRecipe = function (recipeId) {
    const recipeIndex = recipes.findIndex((recipe) => recipe.id === recipeId);

    if (recipeIndex > -1) {
        recipes.splice(recipeIndex, 1);
    }
};

const removeIngredient = function (ingredientIndex) {
    ingredients.splice(ingredientIndex, 1);
};

const generateIngredientsText = function (recipe) {
    if (recipe.ingredients.every((ingredient) => ingredient.inStock === true)) {
        return 'You have all the ingredients';
    } else if (recipe.ingredients.some((ingredient) => ingredient.inStock === true)) {
        return 'You have some of the ingredients';
    } else {
        return 'You have none of the ingredients';
    }
};

const renderRecipes = function () {
    const filteredRecipes = recipes.filter((recipe, recipeIndex) => {
        const titleMatch = recipe.title.toLowerCase().includes(filters.searchText.toLowerCase())
        //check for pagination
        const minIndex = (filters.currentPage * filters.recipesOnPage) - filters.recipesOnPage;
        const maxIndex = filters.currentPage * filters.recipesOnPage;
        const numberMatch = recipeIndex >= minIndex && recipeIndex < maxIndex;

        return titleMatch && numberMatch;
    });

    document.querySelector('.recipes').innerHTML = '';

    if (filteredRecipes.length > 0) {
        filteredRecipes.forEach((recipe) => {
            document.querySelector('.recipes').appendChild(generateRecipeDOM(recipe));
        });
    } else {
        const text1Element = document.createElement('p');
        text1Element.textContent = 'Here will be your recipes';
        const text2Element = document.createElement('p');
        text2Element.textContent = 'Click the \'Add recipe\' button to add a recipe';
        document.querySelector('.recipes').appendChild(text1Element);
        document.querySelector('.recipes').appendChild(text2Element);
    }
};

const renderIngredients = function (ingredients) {
    document.querySelector('.ingredients-list').innerHTML = '';

    ingredients.forEach((ingredient, index) => {
        document.querySelector('.ingredients-list').appendChild(generateIngredientDOM(ingredient, index));
    })
};

const renderPagination = function () {
    generatePaginationDom();

    const paginationButtonsAmount = Math.ceil(recipes.length / filters.recipesOnPage);
    for (let i = 1; i <= paginationButtonsAmount; i++) {
        document.querySelector('.pagination-list').appendChild(generatePaginationItemDom(i));
    }
};

const generatePaginationDom = function () {
    const paginationElement = document.querySelector('.pagination-container');
    paginationElement.innerHTML = `
                    <ul class="pagination">
                        <li class="pagination-backward"><a><<</a></li>
                        <li>
                            <ul class="pagination-list">
                            </ul>
                        <li class="pagination-forward"><a>>></a></li>
                    </ul>
    `;

    document.querySelector('.pagination-backward').addEventListener('click', () => {
        if (paginationButtons[0].classList.contains('pagination-item-current')) {
            return;
        } else {
            const paginButtonsArray = Array.from(paginationButtons);
            const currentButtonIndex = paginButtonsArray.findIndex((button) => button.classList.contains('pagination-item-current'));
            paginButtonsArray[currentButtonIndex].classList.remove('pagination-item-current');
            paginButtonsArray[currentButtonIndex - 1].classList.add('pagination-item-current');
            filters.currentPage = +paginButtonsArray[currentButtonIndex - 1].innerText;
        }
        renderRecipes();
    });

    document.querySelector('.pagination-forward').addEventListener('click', () => {
        if (paginationButtons[paginationButtons.length - 1].classList.contains('pagination-item-current')) {
            return;
        } else {
            const paginButtonsArray = Array.from(paginationButtons);
            const currentButtonIndex = paginButtonsArray.findIndex((button) => button.classList.contains('pagination-item-current'));
            paginButtonsArray[currentButtonIndex].classList.remove('pagination-item-current');
            paginButtonsArray[currentButtonIndex + 1].classList.add('pagination-item-current');
            filters.currentPage = +paginButtonsArray[currentButtonIndex + 1].innerText;
        }
        renderRecipes();
    });
};

const generatePaginationItemDom = function (pageNumber) {
    const paginationElement = document.createElement('li');
    const paginationLinkElement = document.createElement('a');

    paginationLinkElement.textContent = pageNumber;
    paginationLinkElement.setAttribute('id', pageNumber);
    paginationLinkElement.classList.add('pagination-item');
    if (pageNumber === 1) {
        paginationLinkElement.classList.add('pagination-item-current');
    }
    paginationLinkElement.addEventListener('click', (e) => {
        filters.currentPage = +e.target.innerText;

        // const paginationButtons = document.querySelectorAll('.pagination-item');
        paginationButtons.forEach((button) => button.classList.remove('pagination-item-current'));

        e.target.classList.add('pagination-item-current');
        renderRecipes();
    });

    paginationElement.appendChild(paginationLinkElement);

    return paginationElement;
};

const generateRecipeDOM = function (recipe) {
    const recipeElement = document.createElement('a');
    const titleElement = document.createElement('p');
    const ingredientsElements = document.createElement('p');

    recipeElement.href = `/edit.html#${recipe.id}`;

    titleElement.textContent = recipe.title;
    titleElement.classList.add('recipe-title');
    recipeElement.appendChild(titleElement);

    ingredientsElements.textContent = generateIngredientsText(recipe);
    ingredientsElements.classList.add('recipe-ingredients');
    recipeElement.appendChild(ingredientsElements);

    return recipeElement;
};

const generateIngredientDOM = function (ingredient, index) {
    const ingredientContainerElement = document.createElement('li');
    const checkboxElement = document.createElement('input');
    const ingredientTitleElement = document.createElement('label');
    const removeIngredientButtonElement = document.createElement('button');

    checkboxElement.setAttribute('type', 'checkbox');
    checkboxElement.setAttribute('id', `ingredient-${index}`);
    checkboxElement.setAttribute('title', 'In stock');
    checkboxElement.checked = ingredient.inStock;
    checkboxElement.addEventListener('change', (e) => {
        ingredient.inStock = !ingredient.inStock;
        renderIngredients(ingredients);
    });
    ingredientContainerElement.appendChild(checkboxElement);

    ingredientTitleElement.setAttribute('for', `ingredient-${index}`);
    ingredientTitleElement.textContent = ingredient.ingredientTitle;
    ingredientContainerElement.appendChild(ingredientTitleElement);

    removeIngredientButtonElement.textContent = 'Remove';
    removeIngredientButtonElement.classList.add('button', 'btn-display');
    removeIngredientButtonElement.addEventListener('click', (e) => {
        removeIngredient(index);
        renderIngredients(ingredients);
    });
    ingredientContainerElement.appendChild(removeIngredientButtonElement);

    return ingredientContainerElement;
};

const showError = function (field, errorMessage) {
    field.classList.add('error');
    let msgElement = document.createElement('span');
    msgElement.classList.add('error-message');
    msgElement.innerHTML = errorMessage;
    field.parentNode.insertBefore(msgElement, field.nextElementSibling);
};

const resetError = function (field) {
    field.classList.remove('error');
    if (field.nextElementSibling && field.nextElementSibling.classList.contains('error-message')) {
        field.parentNode.removeChild(field.nextElementSibling);
    }
};

const validateFields = function (...fields) {
    let isValid = true;
    const errorMessage = 'Required field';

    for (let field of fields) {
        resetError(field);
        if (!field.value.trim()) {
            showError(field, errorMessage);
            isValid = false;
        }
    }

    return isValid;
};