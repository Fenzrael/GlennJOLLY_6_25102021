"use strict";

const params = new URLSearchParams(document.location.search.substring(1));
const recipes = document.getElementById("recipes");
const userMainSearch = document.querySelector(".main__search");
console.log(userMainSearch);

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
                <aside class="card__ingredients">${ingredientsConstructHtml(
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

// Methode for , algo 1

// Decoupe Probleme: Afficher recettes par ingredients, appareils, ustensiles ou nom de recette dans barre de recherche ou description

// 1. Creer Arrays pour chaque categorie de recherche
// 1.1. Arrays pour recherche principale
let titlesElts = [];
let descriptionElts = [];

// 1.2. Arrays pour recherche secondaire
let devicesElts = [];
let ustensilsElts = [];

// 1.3. Array pour les deux recherches
let ingredientsElts = [];

// 2. Creer boucle for et pour chaque iterations localiser element taper par l'utilisateur et l'isoler
const isolateDatas = function () {
  userMainSearch.addEventListener("keydown", (e) => {
    if (e.value.length > 3) {
    }
  });
};
isolateDatas();
// 3. Supprimer Doublons

// 4. Rendre recettes avec les données recherchées

// 5. Supprimer données tapées dans les barres de recherches apres affichage des recettes
