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

let recipesRemaining = [];

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
  retrieveFilters(recipesArray);
  recipesRemaining = recipesArray;
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

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Algorithme de recherche 2 (boucle forEach et Filter):++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//+++++++++++++++++++++++
// Recherche principale++
//+++++++++++++++++++++++

// implementation Primary Search
userMainSearch.addEventListener("input", compareDatasMainSearch);

function compareDatasMainSearch(event) {
  const value = event.target.value.toLowerCase(); // valeur type by User in lower case(toLowerCase)

  recipesRemaining = [];

  if (value.length >= 3) {
    mainTags.innerText = "";
    recipesHTML.innerHTML = "";

    recipesArray.filter((recipe) => {
      const includeInName = recipe.name.toLowerCase().includes(value);
      const includeInDescription = recipe.description
        .toLowerCase()
        .includes(value);
      let includeInIngredient = false;
      for (let i = 0; i < recipe.ingredients.length; i++) {
        const currentIngredientName =
          recipe.ingredients[i].ingredient.toLowerCase();
        if (currentIngredientName.includes(value)) {
          includeInIngredient = true; // if true ingredient type by user include
          break; // Loop ending
        }
      }

      if (includeInName || includeInIngredient || includeInDescription) {
        recipesHTML.innerHTML += constructArticleHTML(recipe);
        recipesRemaining.push(recipe);
        retrieveFilters(recipesRemaining);
      }
    });
    mainTags.innerText =
      0 >= recipesRemaining.length
        ? ` Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc.`
        : "";
  } else if (value.length === 0) {
    recipesHTML.innerHTML = "";
    recipesArray.forEach((recipe) => {
      recipesHTML.innerHTML += constructArticleHTML(recipe);
      recipesRemaining.push(recipe);
      retrieveFilters(recipesRemaining);
    });
  }
}

//+++++++++++++++++++++++
// Recherche secondaire++
//+++++++++++++++++++++++

// Function retrieve filters
function retrieveFilters(element) {
  filterIngredients = [];
  filterDevices = [];
  filterUstensils = [];
  separateUstensils = [];

  element.forEach((elt) => {
    filterDevices.push(elt.appliance);
    filterUstensils.push(elt.ustensils);
    elt.ingredients.forEach((ingredient) =>
      filterIngredients.push(ingredient.ingredient)
    );
  });

  // Loop forEach: concatenation elements on one array
  filterUstensils.forEach(
    (ust) => (separateUstensils = separateUstensils.concat(ust))
  );

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
          id: listTags.length + 1,
        });
        constructMainTagsHtml(listTags);
        filterByTag(listTags);
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
            <span class="far fa-times-circle tags__icon"  onClick="removeTag('${tag.id}')"></span>
          </div>
        `;
  });
}

// Function remove Tags
function removeTag(tagId) {
  listTags = listTags.filter((currentTag) => {
    return currentTag.id != tagId;
  });
  constructMainTagsHtml(listTags);
  filterByTag(listTags);
}

// Function Filter by tag (Update)
function filterByTag(tagList) {
  let newRecipesArray = [];
  recipesHTML.innerHTML = "";
  recipesRemaining = [...recipesArray];
  if (tagList.length === 0) {
    recipesRemaining.forEach((currentRecipe) => {
      recipesHTML.innerHTML += constructArticleHTML(currentRecipe);
    });
  } else {
    tagList.filter((currentTag) => {
      newRecipesArray = [];
      recipesHTML.innerHTML = "";

      recipesRemaining.filter((currentRecipe) => {
        if (
          currentTag.type === "ingredients" &&
          currentRecipe.ingredients.find((ingredient) => {
            return currentTag.value === ingredient.ingredient;
          })
        ) {
          newRecipesArray.push(currentRecipe);
          recipesHTML.innerHTML += constructArticleHTML(currentRecipe);
        } else if (
          currentTag.type === "devices" &&
          currentRecipe.appliance === currentTag.value
        ) {
          newRecipesArray.push(currentRecipe);
          recipesHTML.innerHTML += constructArticleHTML(currentRecipe);
        } else if (
          currentTag.type === "ustensils" &&
          currentRecipe.ustensils.includes(currentTag.value)
        ) {
          newRecipesArray.push(currentRecipe);
          recipesHTML.innerHTML += constructArticleHTML(currentRecipe);
        }

        recipesRemaining = newRecipesArray;
      });
    });
  }
  retrieveFilters(recipesRemaining);
}

// Function remove Filter tag (Update)
function removeFilterTag(currentFilterTag) {
  let currentTagsArray = [];

  currentFilterTag.filter((currentTag) => {
    if (listTags.includes(currentTag)) {
      currentTagsArray.push(currentTag);
      currentTagsArray.splice(currentTagsArray.indexOf(currentTag, 1));
    }
    recipesRemaining = currentTagsArray;
  });
  retrieveFilters(listTags);
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
    /* console.log(e); */
    if (e.target.className !== "secondary__search") {
      type.classList.remove("isVisible");
    }
  });
  inputIngredients.addEventListener("click", () => {
    if (
      ustDiv.classList.contains("isVisible") ||
      devDiv.classList.contains("isVisible")
    ) {
      ustDiv.classList.remove("isVisible");
      devDiv.classList.remove("isVisible");
    }
  });
  inputDevices.addEventListener("click", () => {
    if (
      ustDiv.classList.contains("isVisible") ||
      ingDiv.classList.contains("isVisible")
    ) {
      ustDiv.classList.remove("isVisible");
      ingDiv.classList.remove("isVisible");
    }
  });
  inputUstensils.addEventListener("click", () => {
    if (
      devDiv.classList.contains("isVisible") ||
      ingDiv.classList.contains("isVisible")
    ) {
      devDiv.classList.remove("isVisible");
      ingDiv.classList.remove("isVisible");
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
