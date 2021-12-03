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

//++++++++++++++++++++++++++++++++++++++++++
// Algorithme de recherche 1 (boucle for):++
//++++++++++++++++++++++++++++++++++++++++++

//+++++++++++++++++++++++
// Recherche principale++
//+++++++++++++++++++++++

// Recherche par mots ou groupe de lettres dans le titre, les ingredients ou la description.

//Scénario nominal++
//++++++++++++++++++

// 1. Le cas d’utilisation commence lorsque l’utilisateur entre au moins 3 caractères dans la barre de recherche principale.

// 2. Le système recherche des recettes correspondant à l’entrée utilisateur dans : le titre de la recette, la liste des ingrédients de la recette, la description de la recette.

// 3. L’interface est actualisée avec les résultats de recherche.

// 4. Les champs de recherche avancée sont actualisés avec les informations ingrédients, ustensiles, appareil des différentes recettes restantes.

//5. L’utilisateur précise sa recherche grâce à l’un des champs : ingrédients, ustensiles, appareil.

// 6. Au fur et à mesure du remplissage les mots clés ne correspondant pas à la frappe dans le champ disparaissent. Par exemple, si l’utilisateur entre “coco” dans la liste d’ingrédients, seuls vont rester “noix de coco” et “lait de coco”.

// 7. L’utilisateur choisit un mot clé dans le champ.

// 8. Le mot clé apparaît sous forme de tag sous la recherche principale.

// 9. Les résultats de recherche sont actualisés, ainsi que les éléments disponibles dans les champs de recherche avancée.

// 10. L’utilisateur sélectionne une recette.

//Scénario alternatif A1: Aucune recette correspondante à la recherche++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// L'enchaînement A1 commence au point 3 du scénario nominal.

// 3. L’interface affiche « Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc.

//Scénario alternatif A2: L’utilisateur commence sa recherche par un tag++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//L'enchaînement A2 commence au point 1 du scénario nominal et reprend au point 9 du scénario nominal.

// 1. L’utilisateur commence la recherche par un tag.
// 2. Les résultats de recherche sont actualisés, ainsi que les éléments disponibles dans les champs de recherche avancée (9 du cas principal).

//Scénario alternatif A3: L’utilisateur ajoute d’autres tags pour la recherche avancée++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//L'enchaînement A3 commence au point 9 du scénario nominal. Cet enchaînement peut se répéter autant que nécessaire.

// 10. L’utilisateur précise sa recherche grâce à l’un des champs : ingrédients, ustensiles, appareil.

// 11. Au fur et à mesure du remplissage les mots clés ne correspondant pas à la frappe dans le champ disparaissent.

// 12. L’utilisateur choisit un mot clé dans le champ.

// 13. Le mot clé apparaît sous forme de tag sous la recherche principale.

// 14. Les résultats de recherche sont actualisés, ainsi que les éléments disponibles dans les champs de recherche avancée.

//+++++++++++++++++++
//Règles de gestion++
//+++++++++++++++++++

// Ces points doivent absolument être respectés durant le développement :

// 1. La recherche doit pouvoir se faire via le champ principal ou via les tags (ingrédients, ustensiles ou appareil).

// 2. La recherche principale se lance à partir de 3 caractères entrés par l’utilisateur dans la barre de recherche.

// 3. La recherche s’actualise pour chaque nouveau caractère entré.

// 4. La recherche principale affiche les premiers résultats le plus rapidement possible.

// 5. Les champs ingrédients, ustensiles et appareil de la recherche avancée proposent seulement les éléments restant dans les recettes présentes sur la page.

// 6. Les retours de recherche doivent être une intersection des résultats. Si l’on ajoute les tags “coco” et “chocolat” dans les ingrédients, on doit récupérer les recettes qui ont à la fois de la coco et du chocolat.

// 7. Comme pour le reste du site, le code HTML et CSS pour l’interface (avec ou sans Bootstrap) devra passer avec succès le validateur W3C.

// 8. Aucune librairie ne sera utilisée pour le JavaScript du moteur de recherche.

//+++++++++++++++++++++++
// Recherche secondaire++
//+++++++++++++++++++++++
