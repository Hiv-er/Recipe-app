const recipes = loadRecipes();

const filters = {
    searchText: '',
    currentPage: 1,
    recipesOnPage: 2
};

renderRecipes();

if (recipes.length > filters.recipesOnPage) {
    renderPagination();
}


const paginationButtons = document.querySelectorAll('.pagination-item');

// document.querySelector('.add-recipe').addEventListener('click', (e) => {
//     e.preventDefault();
//
//     location.assign(`/edit.html#${uuidv4()}`)
// });

document.querySelector('.search').addEventListener('input', (e) => {
    e.preventDefault();
    filters.searchText = e.target.value;
    renderRecipes(recipes, filters);
});







