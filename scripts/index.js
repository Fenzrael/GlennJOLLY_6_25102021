"use strict";

const params = new URLSearchParams(document.location.search.substring(1));
const main = document.getElementById("main");

const recipes = document.getElementById("recipes");
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
  recipes.innerHTML = "";
  recipesDisplay().then(() => {
    recipesArray.forEach((recipe) => {
      recipes.innerHTML += `
            <article class="recipes__card card">
                <img class="card__image" src="./assets/Img/cook.jpg" alt="image"/>
                <h2 class="card__title">${
                  recipe.name
                }<span class="far fa-clock card__time"> ${
        recipe.time
      } min</span></h2>
                
                <aside class="card__ingredients">${ingredientsConstructHtml(
                  recipe.ingredients
                )}</aside>
                <aside class="card__description">${recipe.description}</aside>
            </article>
      `;
    });
  });
}
constructMediaHtml();

const ingredientsConstructHtml = function (ingredients) {
  return ingredients.map((currentIngredient) => {
    return `<ul class="ingredientsElt">
              <li class="ingredientsElt__ingredient">${
                currentIngredient.ingredient ?? ""
              } : ${currentIngredient.quantity ?? ""} ${
      currentIngredient.unit ?? ""
    }
              </li>
            </ul>
    `;
  });
};
