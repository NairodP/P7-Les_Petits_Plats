import { recipes } from "../data/recette.js";

const filters = document.querySelector("#filters");
const filtersInputs = document.querySelectorAll(".input-container input");

export function placeholders() {
  const placeholders = [];

  for (let i = 0; i < filtersInputs.length; i++) {
    // Ajout d'un écouteur d'événement pour le clic sur l'input
    filtersInputs[i].addEventListener("click", function () {
      this.placeholder = "";
    });

    // Ajout d'un écouteur d'événement pour la perte de focus sur l'input
    filtersInputs[i].addEventListener("blur", function () {
      if (this.value === "") {
        this.placeholder = placeholders[i];
      }
    });

    // Stockage du placeholder initial dans un tableau
    placeholders.push(filtersInputs[i].placeholder);
  }

  // console.log(placeholders);
}
placeholders();

export function getInputsValues() {
  const filtersInputs = document.querySelectorAll(".input-container input");
  const values = [];

  Array.from(filtersInputs).forEach((input, index) => {
    values.push(input.value);
    input.addEventListener("input", () => {
      values[index] = input.value;
      console.log("Inputs values:", values);
    });
  });

  return values;
}
getInputsValues();

// function chevronRotate() {
//   const chevrons = document.querySelectorAll(".rotation");
//   chevrons.forEach((chevron) => {
//     chevron.addEventListener("click", () => {
//       chevron.classList.toggle("clicked");
//     });
//   });
// }

function chevronRotate() {
  const chevrons = document.querySelectorAll(".rotation");

  chevrons.forEach((chevron) => {
    chevron.addEventListener("click", () => {
      const list = document.querySelector(`.${chevron.dataset.list}`);

      if (chevron.classList.contains("clicked")) {
        chevron.classList.remove("clicked");
        list.style.display = "none";
      } else {
        chevron.classList.add("clicked");
        list.style.display = "block";
      }
    });
  });
}

// Fonction pour récupérer tous les ingrédients d'une recette
function getRecipeIngredients(recipe) {
  return recipe.ingredients.map((ingredient) => {
    let ingredientsName = ingredient.ingredient.toLowerCase();
    ingredientsName = ingredientsName.trim();
    return ingredientsName;
  });
}

// Fonction pour récupérer tous les ustensiles d'une recette
function getRecipeUstensils(recipe) {
  return recipe.ustensils.map((ustensil) => {
    let ustensilName = ustensil.toLowerCase();
    ustensilName = ustensilName.trim();
    return ustensilName;
  });
}

// Fonction pour récupérer toutes les appareils d'une recette
function getRecipeAppliances(recipe) {
  return [recipe.appliance.toLowerCase().trim()];
}

// Fonction pour mettre les mots au singulier
function singularize(ingredientName) {
  const exceptions = [
    "ananas",
    "paris",
    "coulis",
    "pelées",
    "cerises",
    "jus",
    "pois",
    "bois",
    "maïs",
    "roux",
    "noix",
    "glaçons",
    "olives",
    "pennes",
    "tagliatelles",
    "spaghettis",
  ];

  const words = ingredientName.split(" ");
  const lastWord = words[words.length - 1]; // récupère le dernier mot

  if (exceptions.includes(lastWord)) {
    return ingredientName;
  } else if (lastWord.endsWith("s") || lastWord.endsWith("x")) {
    words[words.length - 1] = lastWord.slice(0, -1);
    return words.join(" ");
  } else {
    return ingredientName;
  }
}

// Fonction pour éliminer les doublons et trier les mots
function getUniqueAndSortedWords(words) {
  const setWords = new Set(words);
  const uniqueWords = [...setWords];
  uniqueWords.sort();
  return uniqueWords;
}

function getAllIngredients() {
  const allIngredients = [];

  recipes.forEach((recipe) => {
    allIngredients.push(...getRecipeIngredients(recipe));
  });

  const singularIngredients = allIngredients.map((ingredient) =>
    singularize(ingredient)
  );
  const uniqueIngredients = getUniqueAndSortedWords(singularIngredients);

  // console.log(uniqueIngredients);
  return uniqueIngredients;
}

function getAllUstensils() {
  const allUstensils = [];

  recipes.forEach((recipe) => {
    allUstensils.push(...getRecipeUstensils(recipe));
  });

  const singularUstensils = allUstensils.map((ustensil) =>
    singularize(ustensil)
  );
  const uniqueUstensils = getUniqueAndSortedWords(singularUstensils);

  // console.log(uniqueUstensils);
  return uniqueUstensils;
}

function getAllAppliances() {
  const allAppliances = [];

  recipes.forEach((recipe) => {
    allAppliances.push(...getRecipeAppliances(recipe));
  });

  const singularAppliances = allAppliances.map((appliance) =>
    singularize(appliance)
  );
  const uniqueAppliances = getUniqueAndSortedWords(singularAppliances);

  // console.log(uniqueAppliances);
  return uniqueAppliances;
}

//////////

function displayIngredientsList() {
  const ingredientsList = document.querySelector(".ingredients-list");
  const uniqueIngredients = getAllIngredients().slice(0, 30); // récupérer les 30 premiers éléments

  uniqueIngredients.forEach((ingredient) => {
    const li = document.createElement("li");
    li.innerHTML = ingredient;
    ingredientsList.appendChild(li);
  });
}


function displayUstensilsList() {
  const ustensilsList = document.querySelector(".ustensiles-list");
  const uniqueUstensils = getAllUstensils().slice(0, 30); // récupérer les 30 premiers éléments

  uniqueUstensils.forEach((ustensil) => {
    const li = document.createElement("li");
    li.innerHTML = ustensil;
    ustensilsList.appendChild(li);
  });
}

function displayAppliancesList() {
  const appliancesList = document.querySelector(".appareils-list");
  const uniqueAppliances = getAllAppliances().slice(0, 30); // récupérer les 30 premiers éléments

  uniqueAppliances.forEach((appliance) => {
    const li = document.createElement("li");
    li.innerHTML = appliance;
    appliancesList.appendChild(li);
  });
}

//////////

export const ingredientsDisp = document.querySelector(
  "[data-input='ingredients']"
);
ingredientsDisp.addEventListener("click", () => {
  console.log("ingredients");
  displayIngredientsList();
  chevronRotate();
});

export const ustensilesDisp = document.querySelector(
  "[data-input='ustensiles']"
);
ustensilesDisp.addEventListener("click", () => {
  console.log("ustensiles");
  displayUstensilsList();
  chevronRotate();
});

export const appareilsDisp = document.querySelector("[data-input='appareils']");
appareilsDisp.addEventListener("click", () => {
  console.log("appareils");
  displayAppliancesList();
  chevronRotate();
});
