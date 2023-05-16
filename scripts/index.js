import { recipes } from "../data/recette.js";
import { displayResults } from "./card.js";
import {
  placeholders,
  populateDropdown,
  handleDropdowns,
  filteredRecipes,
  selectedItems,
} from "./filters.js";

// Attend que le document HTML soit chargé
document.addEventListener("DOMContentLoaded", () => {
  placeholders();
  handleDropdowns();
  populateDropdown();
  performSearch();
  infosContainer.style.display = "none"; // Masquer infosContainer
});

document.addEventListener("selectedItemsUpdated", performSearch);

// Récupération de l'input
const searchInput = document.querySelector("#search");

// Récupération de l'élément conteneur de la suggestion
const infosContainer = document.querySelector("#infos-container");

searchInput.addEventListener("input", performSearch);

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

function displayAllRecipes() {
  const allResults = [...recipes];
  displayResults(allResults);
}

function displaySuggestion(message) {
  // Effacement du contenu précédent
  infosContainer.innerHTML = "";

  // Création de l'élément de l'icône/image
  const warningImg = document.createElement("img");
  warningImg.src = "assets/img/warning.svg";
  warningImg.alt = "Icon Warning";
  // Appliquez les classes CSS ou les attributs nécessaires à votre icône/image

  // Création du paragraphe avec le message de la suggestion
  const paragraph = document.createElement("p");
  paragraph.textContent = message;

  // Ajout de l'icône/image et du paragraphe à la suggestion
  infosContainer.appendChild(warningImg);
  infosContainer.appendChild(paragraph);

  // Affichage de la suggestion
  infosContainer.style.display = "flex";
}

function hideSuggestion() {
  // Masquage de la suggestion
  infosContainer.style.display = "none";
}

function hideResults() {
  const recettesContainer = document.getElementById("recettes");
  recettesContainer.innerHTML = "";
}

// effectue une recherche en filtrant les recettes en fonction d'un mot-clé et des éléments sélectionnés, puis affiche les résultats
function performSearch() {
  const keyword = searchInput.value.trim();

  if (selectedItems.length > 0) {
    // Filtrer les recettes filtrées avec searchInput
    const filteredResults = filteredRecipes.filter((recipe) => {
      // Vérifier si le nom ou la description de la recette contient le mot clé
      if (
        recipe.name.toLowerCase().includes(keyword.toLowerCase()) ||
        recipe.description.toLowerCase().includes(keyword.toLowerCase())
      ) {
        return true;
      }

      // Vérifier si un des ingrédients de la recette contient le mot clé
      for (let j = 0; j < recipe.ingredients.length; j++) {
        const ingredient = recipe.ingredients[j];
        if (
          ingredient.ingredient.toLowerCase().startsWith(keyword.toLowerCase())
        ) {
          return true;
        }
      }

      return false;
    });

    if (filteredResults.length === 0 && keyword.length < 3) {
      displaySuggestion(
        "Aucun résultat... Vous pouvez écrire Tomate, Chocolat, Mixer, Passoire, etc..."
      );
    } else {
      hideSuggestion();
    }

    displayResults(filteredResults);
  } else {
    if (keyword.length < 3) {
      hideResults();
      displayAllRecipes(); // Afficher toutes les recettes
      displaySuggestion(
        "Vous devez saisir au moins 3 lettres ou utiliser un filtre pour lancer la recherche."
      );
      return;
    }

    // Effectuer la recherche sur toutes les recettes
    const results = searchRecipes(keyword);
    console.log(results);

    if (results.length === 0) {
      displaySuggestion(
        "Aucun résultat... Vous pouvez écrire Tomate, Chocolat, Mixer, Passoire, etc..."
      );
    } else {
      hideSuggestion();
    }

    displayResults(results);
  }
}
