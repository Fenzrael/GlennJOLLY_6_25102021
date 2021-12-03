"use strict";

const params = new URLSearchParams(document.location.search.substring(1));
const main = document.getElementById("main");

const recipesHTML = document.getElementById("recipes");
const userMainSearch = document.querySelector(".main__search");

//Import all Datas of recipes.json
const recipesArray = [];
console.log(recipesArray);
let recipesData = [];

//Import data of recipes.json

const recipesInfo = async () => {
  return fetch("./data/recipes.json")
    .then((res) => res.json())
    .then((data) => {
      return data;
    });
};

const recipesDisplay = async () => {
  recipesData = await recipesInfo();
  recipesData.recipes.forEach((recipe) => {
    recipesArray.push(recipe);
  });
};

function constructMediaHtml() {
  recipesHTML.innerHTML = "";
  recipesDisplay().then(() => {
    recipesArray.forEach((recipe) => {
      recipesHTML.innerHTML += `
            <article class="recipes__card card">
                <img class="card__image" src="./assets/img/imgRecipes/${
                  recipe.image
                }" alt="image"/>
                <h2 class="card__title">${
                  recipe.name
                }<span class="far fa-clock card__time"> ${
        recipe.time
      } min</span></h2>
                
                <aside class="card__ingredients">
                  <ul class="ing">${ingredientsConstructHtml(
                    recipe.ingredients
                  )}
                  </ul>
                  </aside>
                <aside class="card__description">${recipe.description}</aside>
            </article>
      `;
    });
  });
}
constructMediaHtml();

const ingredientsConstructHtml = function (ingredients) {
  return ingredients.map((currentIngredient) => {
    if (currentIngredient.quantity == undefined) {
      return `<li class="ing__ingredient">${currentIngredient.ingredient} </li>`;
    } else if (currentIngredient.unit == undefined) {
      return `<li class="ing__ingredient">${currentIngredient.ingredient} : ${currentIngredient.quantity}</li>`;
    } else {
      return `<li class="ing__ingredient">${currentIngredient.ingredient} : ${currentIngredient.quantity}${currentIngredient.unit}`;
    }
  });
};

// Algorithme de recherche 1 (boucle for):
