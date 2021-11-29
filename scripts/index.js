"use strict";

const params = new URLSearchParams(document.location.search.substring(1));
const recipes = document.getElementById("recipes");

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
  recipes.innerHTML = "";
  recipesDisplay().then(() => {
    recipesArray.forEach((recipe) => {
      recipes.innerHTML += `
            <article class="recipes__card card">
                <img class="card__image" src="./assets/Img/cook.jpg" alt="image"/>
                <h2 class="card__title">${recipe.name}</h2>
                <span class="far fa-clock card__time">${recipe.time}</span>
                <aside class="card__ingredients ">${ingredientsConstructHtml(
                  recipe.ingredients
                )}</aside>
                <aside class=""card__description>${recipe.description}</aside>
            </article>
      `;
    });
  });
}
constructMediaHtml();

const ingredientsConstructHtml = function (ingredients) {
  return ingredients.map((currentIngredient) => {
    return `<ul class="">
              <li>${currentIngredient.ingredient ?? ""}</li>
              <li>${currentIngredient.quantity ?? ""}</li>
              <li>${currentIngredient.unit ?? ""}</li>
            </ul>
    `;
  });
};
