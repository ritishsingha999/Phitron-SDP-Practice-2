const API_SEARCH = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
const API_CATEGORIES = "https://www.themealdb.com/api/json/v1/1/categories.php";

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const cardsContainer = document.getElementById("cards");
const modalOverlay = document.getElementById("modalOverlay");
const detailsModal = document.getElementById("detailsModal");
const modalTitle = document.getElementById("modalTitle");
const modalImage = document.getElementById("modalImage");
const modalCategory = document.getElementById("modalCategory");
const modalArea = document.getElementById("modalArea");
const modalInstructions = document.getElementById("modalInstructions");
const closeModal = document.getElementById("closeModal");

window.onload = () => {
    fetchDefaultItems();
};

function fetchDefaultItems() {
    fetch(API_CATEGORIES)
        .then(response => response.json())
        .then(data => {
            if (data.categories) {
                displayDefaultItems(data.categories);
            } else {
                cardsContainer.innerHTML = `<p>No items found.</p>`;
            }
        })
        .catch(error => console.error("Error fetching default items:", error));
}

function displayDefaultItems(categories) {
    cardsContainer.innerHTML = categories
        .slice(0, 8)
        .map(
            category => `
      <div class="card" data-category="${category.strCategory}">
        <img src="${category.strCategoryThumb}" alt="${category.strCategory}">
        <h3>${category.strCategory}</h3>
        <p>${category.strCategoryDescription.slice(0, 100)}...</p>
      </div>`
        )
        .join("");

    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        card.addEventListener("click", () => {
            const category = card.getAttribute("data-category");
            fetchMeals(category);
        });
    });
}

searchButton.addEventListener("click", () => {
    const query = searchInput.value.trim().toLowerCase();
    if (query) fetchMeals(query);
});

function fetchMeals(query) {
    fetch(`${API_SEARCH}${query}`)
        .then(response => response.json())
        .then(data => {
            if (data.meals) {
                displayMeals(data.meals);
            } else {
                cardsContainer.innerHTML = `<p>No meals found. Please try another search.</p>`;
            }
        })
        .catch(error => console.error("Error fetching meals:", error));
}

function displayMeals(meals) {
    cardsContainer.innerHTML = meals
        .map(
            meal => `
      <div class="card" data-id="${meal.idMeal}">
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <h3>${meal.strMeal}</h3>
        <p><strong>Category:</strong> ${meal.strCategory}</p>
      </div>`
        )
        .join("");

    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        card.addEventListener("click", () => {
            const mealId = card.getAttribute("data-id");
            fetchMealDetails(mealId);
        });
    });
}

function fetchMealDetails(id) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then(response => response.json())
        .then(data => {
            if (data.meals && data.meals.length > 0) {
                const meal = data.meals[0];
                showDetailsModal(meal);
            }
        })
        .catch(error => console.error("Error fetching meal details:", error));
}

function showDetailsModal(meal) {
    modalTitle.textContent = meal.strMeal;
    modalImage.src = meal.strMealThumb;
    modalCategory.textContent = `Category: ${meal.strCategory}`;
    modalArea.textContent = `Area: ${meal.strArea}`;
    modalInstructions.textContent = `Instructions: ${meal.strInstructions}`;
    modalOverlay.style.display = "block";
    detailsModal.style.display = "block";
}

closeModal.addEventListener("click", () => {
    modalOverlay.style.display = "none";
    detailsModal.style.display = "none";
});