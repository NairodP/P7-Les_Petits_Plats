import { recipes } from "../data/recette.js";
import { displayResults } from "./card.js";
import {
  placeholders,
  populateDropdown,
  handleDropdowns,
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
            ingredient.ingredient.toLowerCase().startsWith(keyword.toLowerCase())
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

// Ajout d'un événement d'écoute pour la recherche
searchInput.addEventListener("input", function () {
  const keyword = this.value.trim();
  // trim supprime les espaces
  if (keyword.length < 3) {
    console.log("Saisir au moins 3 caractères pour lancer la recherche");
  } else {
    const results = searchRecipes(keyword);
    // Affichage des résultats dans la console
    console.log(results);
    displayResults(results);
  }
});