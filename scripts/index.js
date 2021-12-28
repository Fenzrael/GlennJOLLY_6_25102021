"use strict";
// Global Variables
const params = new URLSearchParams(document.location.search.substring(1));
const main = document.getElementById("main");
const mainTags = document.querySelector(".main__tags");
const recipesHTML = document.getElementById("recipes");

// Variables catch input
const userMainSearch = document.querySelector(".main__search");
const ingredientsSearch = document.getElementById("ingredients");
const devicesSearch = document.getElementById("devices");
const ustensilsSearch = document.getElementById("ustensils");
const secondaryList = document.querySelector(".secondary__list");
const secondaryIcon = document.querySelector(".secondary__icon");

// Variables catch tag

const listDevice = document.querySelector(".list__devices");
const listIngredient = document.querySelector(".list__ingredients");
const listUstensil = document.querySelector(".list__ustensils");

const inputIngredients = document.querySelector(".input__ingredients");
const inputUstensils = document.querySelector(".input__ustensils");
const inputDevices = document.querySelector(".input__devices");

const ingDiv = document.getElementById("ingredientDiv");
const ustDiv = document.getElementById("ustensilDiv");
const devDiv = document.getElementById("deviceDiv");

const tagsIngredients = document.querySelector(".tags__ingredients");
const tagsDevices = document.querySelector(".tags__devices");
const tagsUstensils = document.querySelector(".tags__ustensils");
const tagsIcon = document.querySelector(".tags__icon");

let listTags = [];

// Variables Storage temporary elements for filter tags
let filterDevices = [];
let filterUstensils = [];
let filterIngredients = [];

let uniqueFilterDevices, uniqueFilterIngredients, uniqueFilterUstensils;
let separateUstensils = [];

//Import all Datas of recipes.json
let recipesArray = [];
console.log(recipesArray);
//Temporary Variable
let recipesData = [];
let datasLowerCase;

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
  retrieveDatas(recipesArray);
  retrieveFilters(recipesArray);
};

// Creation Card Recipes
function constructMediaHtml() {
  recipesHTML.innerHTML = "";
  recipesDisplay().then(() => {
    recipesArray.forEach((recipe) => {
      recipesHTML.innerHTML += constructArticleHTML(recipe);
    });
  });
}
constructMediaHtml();
// function creation Article(Recipe Card) create because forEach constructMediaHtml
// do bug loop "for" for search main
function constructArticleHTML(recipe) {
  return `<article class="recipes__card card">
  <img class="card__image" src="./assets/img/imgRecipes/${
    recipe.image
  }" alt="image"/>
  <h2 class="card__title">${
    recipe.name
  }<span class="far fa-clock card__time"> <strong class="boldText">${
    recipe.time
  } min</strong></span></h2>
  
  <aside class="card__ingredients">
    <ul class="ing">${ingredientsConstructHtml(recipe.ingredients)} 
    </ul>
    </aside>
  <aside class="card__description">${recipe.description}</aside>
</article>
`;
}

// Map ingredients
const ingredientsConstructHtml = function (ingredients) {
  return ingredients
    .map((currentIngredient) => {
      if (currentIngredient.quantity == undefined) {
        return `<li class="ing__ingredient">${currentIngredient.ingredient} </li>`;
      } else if (currentIngredient.unit == undefined) {
        return `<li class="ing__ingredient">${currentIngredient.ingredient} : <strong>${currentIngredient.quantity}</strong></li>`;
      } else {
        return `<li class="ing__ingredient">${currentIngredient.ingredient} : <strong>${currentIngredient.quantity} ${currentIngredient.unit}.</strong></li>`;
      }
    })
    .join(""); // .join("") enleve les virgules parasites de l'objet
};

// Function change placeholder when window size 426px
function changePlaceholderInputMainSearch() {
  if ("matchMedia in window") {
    if (window.matchMedia("(min-width: 426px)").matches) {
      userMainSearch.setAttribute(
        "placeholder",
        "Rechercher un ingrédient, appareil, ustensiles ou une recette"
      );
    } else {
      userMainSearch.setAttribute("placeholder", "Rechercher");
    }
  }
}

window.addEventListener("resize", changePlaceholderInputMainSearch);

//++++++++++++++++++++++++++++++++++++++++++
// Algorithme de recherche 1 (boucle for):++
//++++++++++++++++++++++++++++++++++++++++++

//+++++++++++++++++++++++
// Recherche principale++
//+++++++++++++++++++++++

// Creation Variables storage: (titles, ingredients, descriptions) of recipes

let titlesArray = [];
let ingredientsArray = [];
let descriptionsArray = [];

// Filling Variables storage
function retrieveDatas(element) {
  for (let i = 0; i < element.length; i++) {
    titlesArray.push(element[i].name.toLowerCase());
    element[i].ingredients.forEach((ingredient) =>
      ingredientsArray.push(ingredient.ingredient.toLowerCase())
    );
    descriptionsArray.push(element[i].description.toLowerCase());
  }
  datasLowerCase = titlesArray.concat(ingredientsArray, descriptionsArray);
  return true;
}

// implementation Primary Search
userMainSearch.addEventListener("input", compareDatasMainSearch);

function compareDatasMainSearch(event) {
  const value = event.target.value.toLowerCase(); // valeur type by User in lower case(toLowerCase)

  if (value.length >= 3) {
    recipesHTML.innerHTML = "";
    for (let i = 0; i < recipesArray.length; i++) {
      const recipe = recipesArray[i];
      const includeInName = recipe.name.toLowerCase().includes(value); // includes (methode native Js verifiant si c'est inclut)
      const includeInDescription = recipe.description
        .toLowerCase()
        .includes(value);

      // initialize at false(0 ingredient)
      let includeInIngredient = false;

      for (let i = 0; i < recipe.ingredients.length; i++) {
        const currentIngredientName =
          recipe.ingredients[i].ingredient.toLowerCase();
        if (currentIngredientName.includes(value)) {
          compareDatasSecondarySearch(value);
          includeInIngredient = true; // if true ingredient type by user include
          break; // Loop ending
        }
      }

      if (includeInName || includeInIngredient || includeInDescription) {
        recipesHTML.innerHTML += constructArticleHTML(recipe);
      }

      // if (datasLowerCase[i].includes(event.target.value.toLowerCase())) {
      //   datasTypeByUser.push(datasLowerCase[i]);
      //   recipesHTML.innerHTML += constructMediaHtml(datasTypeByUser);
      // }
    }
  }
}
// constructMediaHtml(datasComparison);

//+++++++++++++++++++++++
// Recherche secondaire++
//+++++++++++++++++++++++

// Function retrieve filters
function retrieveFilters(element) {
  for (let i = 0; i < element.length; i++) {
    filterDevices.push(element[i].appliance);
    filterUstensils.push(element[i].ustensils);
    element[i].ingredients.forEach((ingredient) =>
      filterIngredients.push(ingredient.ingredient)
    );
  }
  // Loop for: concatenation elements on one array
  for (let i = 0; i < filterUstensils.length; i++) {
    separateUstensils = separateUstensils.concat(filterUstensils[i]);
  }

  // Variables without duplicates elements
  uniqueFilterDevices = new Set([...filterDevices]);
  uniqueFilterUstensils = new Set([...separateUstensils]);
  uniqueFilterIngredients = new Set([...filterIngredients]);

  liTags(uniqueFilterDevices, "devices");
  liTags(uniqueFilterIngredients, "ingredients");
  liTags(uniqueFilterUstensils, "ustensils");
}

// Creation List Elements for secondary Search
function liTags(element, type) {
  const elementCible = document.querySelector(`.list__${type}`);

  elementCible.innerHTML = "";

  element.forEach((elt) => {
    // Creation List
    const li = document.createElement("li");
    const liAdd = li.classList;
    liAdd.add(`li__${type}`);
    liAdd.add("element");
    li.textContent = elt;
    elementCible.appendChild(li);
    // Creation Tags
    li.addEventListener("click", (event) => {
      if (!listTags.find((tag) => event.target.innerText == tag.value)) {
        listTags.push({
          value: event.target.innerText,
          type,
        });
        constructMainTagsHtml(listTags);
      }
    });
  });
}

// Function construction Tags
function constructMainTagsHtml(list) {
  mainTags.innerHTML = "";
  list.forEach((tag) => {
    mainTags.innerHTML += `
          <div class="tags__${tag.type}">
            ${tag.value}
            <span class="far fa-times-circle tags__icon" onClick="removeTag('${tag.value}')"></span>
          </div>
        `;
  });
}

// Function remove Tags
function removeTag(tagLabel) {
  listTags = listTags.filter((currentTag) => {
    return currentTag.value != tagLabel;
  });
  constructMainTagsHtml(listTags);
}

// Element Secondary Search appear
function displayDivElements(input, type) {
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === "Escape") {
      type.classList.remove("isVisible");
    }
  });
  input.addEventListener("click", (e) => {
    type.classList.add("isVisible");
  });
  window.addEventListener("click", (e) => {
    if (e.target.className !== "secondary__search") {
      type.classList.remove("isVisible");
    }
  });
}
displayDivElements(inputIngredients, ingDiv);
displayDivElements(inputUstensils, ustDiv);
displayDivElements(inputDevices, devDiv);

// Implementation Secondary Search
ingredientsSearch.addEventListener("input", (event) => {
  compareDatasIngredientSearch(event.target.value.toLowerCase());
});
devicesSearch.addEventListener("input", (event) => {
  compareDatasDeviceSearch(event.target.value.toLowerCase());
});
ustensilsSearch.addEventListener("input", (event) => {
  compareDatasUstensilSearch(event.target.value.toLowerCase());
});

// Function search Ingredients
function compareDatasIngredientSearch(value) {
  let currentSearchIngredient = [];

  for (const ingredient of uniqueFilterIngredients) {
    const includeInIngredients = ingredient.toLowerCase().includes(value);

    if (includeInIngredients) {
      currentSearchIngredient.push(ingredient);
    }
  }

  liTags(currentSearchIngredient, "ingredients");
}

// Function search Devices
function compareDatasDeviceSearch(value) {
  let currentSearchDevice = [];

  for (const device of uniqueFilterDevices) {
    const includeInDevice = device.toLowerCase().includes(value);

    if (includeInDevice) {
      currentSearchDevice.push(device);
    }
  }

  liTags(currentSearchDevice, "devices");
}

// Function search Ustensils
function compareDatasUstensilSearch(value) {
  let currentSearchUstensil = [];

  for (const ustensil of uniqueFilterUstensils) {
    const includeInUstensil = ustensil.toLowerCase().includes(value);

    if (includeInUstensil) {
      currentSearchUstensil.push(ustensil);
    }
  }

  liTags(currentSearchUstensil, "ustensils");
}

//+++++++++++++++
// Instructions++
//+++++++++++++++

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
