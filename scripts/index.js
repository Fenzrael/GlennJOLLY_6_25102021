const params = new URLSearchParams(document.location.search.substring(1));
const recipes = document.getElementById("recipes");

//Import all Datas of recipes.json
const recipesArray = [];
console.log(recipesArray);
let recipesData = [];

//Import data of recipes.json

const recipesInfo = async () => {
  await fetch("./data/recipes.json")
    .then((res) => res.json())
    .then((data) => (recipesData = data));

  console.log(recipesData);
};

const recipesDisplay = async () => {
  await recipesInfo();

  recipesData.recipe.forEach((recipe) => {
    recipesArray.push(recipe);
  });
};

function constructMediaHtml() {
  recipes.innerHTML = "";
  recipesArray.forEach((recipe) => {
    recipes.innerHTML += `
        <figure class="recipes__card card">
            <img class="card__image" src="./assets/Img/cook.png" alt="image"/>
            <figcaption class="card__description">
                ${recipe.name}${recipe.time}${recipe.ingredients}${recipe.description}
            </figcaption>
        </figure>
        `;
  });
}

constructMediaHtml();
