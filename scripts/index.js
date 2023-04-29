import { recipes } from "../data/recette.js";
import {
  // displayRecipes,
  displayResults,
} from "./card.js";
import { placeholders, getInputsValues, ingredientsDisp, ustensilesDisp, appareilsDisp } from "./filters.js";
import { getTagFilterText, removeTagFilterOnClick } from "./appliedFilters.js";

// Attend que le document HTML soit chargé
document.addEventListener("DOMContentLoaded", () => {
  // Tableau de tous les filtres actifs
  getTagFilterText();

  // Appelle la fonction removeTagFilterOnClick
  removeTagFilterOnClick();
});

// Fonction de recherche par mot clé
function searchRecipes(keyword) {
  const results = [];
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
          ingredient.ingredient.toLowerCase().includes(keyword.toLowerCase())
        ) {
          results.push(recipe);
          break;
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
    // displayRecipes(results);
    displayResults(results);
  }
});

//////////


