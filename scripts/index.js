// import { recipes } from "../data/recette.js";
// import { displayResults } from "./card.js";
// import {
//   placeholders,
//   populateDropdown,
//   handleDropdowns,
//   filteredRecipes,
// } from "./filters.js";

// // Attend que le document HTML soit chargé
// document.addEventListener("DOMContentLoaded", () => {
//   placeholders();
//   handleDropdowns();
//   populateDropdown();
// });

// // Fonction de recherche par mot clé
// function searchRecipes(keyword) {
//   const results = [];

//   // Vérifie si le mot-clé a au moins 3 caractères
//   if (keyword.length >= 3) {
//     // Boucle à travers chaque recette
//     for (let i = 0; i < recipes.length; i++) {
//       const recipe = recipes[i];
//       // Vérifie si le nom ou la description de la recette contient le mot clé
//       if (
//         recipe.name.toLowerCase().includes(keyword.toLowerCase()) ||
//         recipe.description.toLowerCase().includes(keyword.toLowerCase())
//       ) {
//         results.push(recipe);
//       } else {
//         // Vérifie si un des ingrédients de la recette contient le mot clé
//         for (let j = 0; j < recipe.ingredients.length; j++) {
//           const ingredient = recipe.ingredients[j];
//           if (
//             ingredient.ingredient.toLowerCase().startsWith(keyword.toLowerCase())
//           ) {
//             results.push(recipe);
//             break;
//           }
//         }
//       }
//     }
//   }
//   return results;
// }

// // Récupération de l'input
// const searchInput = document.querySelector("#search");

// // Ajout d'un événement d'écoute pour la recherche
// searchInput.addEventListener("input", function () {
//   const keyword = this.value.trim();

//   if (filteredRecipes.length === 0) {
//     // Effectuer la recherche sur toutes les recettes
//     if (keyword.length < 3) {
//       console.log("Saisir au moins 3 caractères pour lancer la recherche");
//     } else {
//       const results = searchRecipes(keyword);
//       console.log(results);
//       displayResults(results);
//     }
//   } else {
//     // Effectuer la recherche sur les recettes filtrées
//     if (keyword.length < 3) {
//       console.log("Saisir au moins 3 caractères pour lancer la recherche");
//     } else {
//       const results = searchRecipes(keyword);
//       const filteredResults = filteredRecipes.filter((recipe) =>
//         results.includes(recipe)
//       );
//       console.log(filteredResults);
//       displayResults(filteredResults);
//     }
//   }
// });

import { recipes } from "../data/recette.js";
import { displayResults } from "./card.js";
import {
  placeholders,
  populateDropdown,
  handleDropdowns,
  filteredRecipes,
} from "./filters.js";

// Attend que le document HTML soit chargé
document.addEventListener("DOMContentLoaded", () => {
  placeholders();
  handleDropdowns();
  populateDropdown();
});

// Fonction de recherche par mot clé
function searchRecipes(keyword) {
  const results = [];

  // Vérifie si le mot-clé a au moins 3 caractères
  if (keyword.length >= 3) {
    // Boucle à travers chaque recette
    for (let i = 0; i < recipes.length; i++) {
      const recipe = recipes[i];
      // Vérifie si le nom ou la description de la recette contient le mot clé
      if (
        recipe.name.toLowerCase().includes(keyword.toLowerCase()) ||
        recipe.description.toLowerCase().includes(keyword.toLowerCase())
      ) {
        results.push(recipe);
      } else {
        // Vérifie si un des ingrédients de la recette contient le mot clé
        for (let j = 0; j < recipe.ingredients.length; j++) {
          const ingredient = recipe.ingredients[j];
          if (
            ingredient.ingredient
              .toLowerCase()
              .startsWith(keyword.toLowerCase())
          ) {
            results.push(recipe);
            break;
          }
        }
      }
    }
  }
  return results;
}

// Récupération de l'input
const searchInput = document.querySelector("#search");

// Récupération de l'élément conteneur de la suggestion
const suggestionContainer = document.querySelector("#results-container");

function displaySuggestion(message) {
  // Création du paragraphe avec le message de la suggestion
  const paragraph = document.createElement("p");
  paragraph.textContent = message;

  // Effacement du contenu précédent
  suggestionContainer.innerHTML = "";

  // Ajout du paragraphe à la suggestion
  suggestionContainer.appendChild(paragraph);

  // Affichage de la suggestion
  suggestionContainer.style.display = "block";
}

function hideSuggestion() {
  // Masquage de la suggestion
  suggestionContainer.style.display = "none";
}

// Ajout d'un événement d'écoute pour la recherche
searchInput.addEventListener("input", function () {
  const keyword = this.value.trim();

  if (!filteredRecipes || filteredRecipes.length === 0) {
    // Effectuer la recherche sur toutes les recettes
    if (keyword.length < 3) {
      console.log("Saisir au moins 3 caractères pour lancer la recherche");
      displaySuggestion("Vous devez saisir au moins 3 lettres pour lancer la recherche ou utiliser un filtre.");
    } else {
      const results = searchRecipes(keyword);
      console.log(results);

      if (results.length === 0) {
        displaySuggestion("Aucun résultat... Vous pouvez écrire Tomate, Chocolat, Mixer, Passoire, etc...");
      } else {
        hideSuggestion();
      }

      displayResults(results);
    }
  } else {
    // Effectuer la recherche sur les recettes filtrées
    if (keyword.length < 3) {
      console.log("Saisir au moins 3 caractères pour lancer la recherche");
      displaySuggestion("Vous devez saisir au moins 3 lettres pour lancer la recherche ou utiliser un filtre.");
    } else {
      const results = searchRecipes(keyword);
      const filteredResults = filteredRecipes.filter((recipe) => results.includes(recipe));
      console.log(filteredResults);

      if (filteredResults.length === 0) {
        displaySuggestion("Aucun résultat... Vous pouvez écrire Tomate, Chocolat, Mixer, Passoire, etc...");
      } else {
        hideSuggestion();
      }

      displayResults(filteredResults);
    }
  }
});