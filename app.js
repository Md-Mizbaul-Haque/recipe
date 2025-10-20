const inputBox = document.querySelector(".input-box");
const inputButton = document.querySelector(".inputBtn");
const recipeContainer = document.querySelector(".recipe-container");
const defaultMessage = document.querySelector(".defaultMessage");
const defaultIcon=document.querySelector(".defaultIcon")

let currentMeals = [];

// fetch recipe from api

async function fetchRecipe(query) {
  recipeContainer.innerHTML = ``;
  defaultMessage.innerText = `Fetching recipes....`;
  defaultIcon.style.display="none"

  try {
    const data = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    );
    const response = await data.json();

    if (!response.meals) {
      defaultMessage.innerText = `No recipe found `;
      return;
    }

    currentMeals = response.meals;
    defaultMessage.innerText = ``;

    response.meals.forEach((meal) => {
      console.log(meal);
      const recipeDiv = document.createElement("div");
      recipeDiv.classList.add("recipe");
      recipeDiv.innerHTML = `
        <img src="${meal.strMealThumb}">
        <h3>${meal.strMeal}</h3>
        <p><strong>Area:</strong> ${meal.strArea}</p>
        <p><strong>Category:</strong>${meal.strCategory}</p>
        <div class="buttonsDiv">
        <button class="detailsBtn">View recipe</button>
        ${meal.strYoutube ? `<button class="videoBtn">Video</button>` : ""}
        </div>
        
    
        `;
      recipeContainer.appendChild(recipeDiv);
    });
  } catch (error) {
    defaultMessage.innerText = `Error to fetch data !`;
  }
}

// handle input

inputButton.addEventListener("click", (e) => {
  e.preventDefault();
  const inputValue = inputBox.value.trim();
  if (inputValue) fetchRecipe(inputValue);
});

// lightbox functionality

const lightBox = document.querySelector(".lightbox");
const lightBoxImg = lightBox.querySelector("img");

// recipe details functionality

const recipeModal = document.querySelector(".recipeModal");
const recipeModalContent = document.querySelector(".recipeModalContent");
const closeBtn = document.querySelector(".closeBtn");
const recipeTitle = document.querySelector(".recipeTitle");
const recipeInstructions = document.querySelector(".recipeInstructions");

recipeContainer.addEventListener("click", (e) => {
  // open full image
  if (e.target.tagName === "IMG" && e.target.closest(".recipe")) {
    lightBox.style.display = "flex";
    lightBoxImg.src = e.target.src;
  }

  // open recipe details

  if (e.target.classList.contains("detailsBtn")) {
    const card = e.target.closest(".recipe");
    const mealName = card.querySelector("h3").textContent.trim();
    const meal = currentMeals.find((m) => m.strMeal === mealName);
    if (meal) {
      console.log(meal);
      recipeModal.style.display = "flex";
      recipeTitle.textContent = meal.strMeal;
      recipeInstructions.textContent = meal.strInstructions;
    }
  }

  if(e.target.classList.contains("videoBtn")){
    const card = e.target.closest(".recipe")
    const mealName = card.querySelector("h3").textContent.trim()
    const meal = currentMeals.find((m)=> m.strMeal === mealName)
    if(meal){
      window.open(meal.strYoutube ,"_blank")
    }
  }
});

// img close property

lightBox.addEventListener("click", () => {
  lightBox.style.display = "none";
  lightBoxImg.src = "";
});

// close recipe modal

closeBtn.addEventListener("click", () => {
  recipeModal.style.display = "none";
});
