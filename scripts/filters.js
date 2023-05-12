import { recipes } from "../data/recette.js"; // Importation des données de recette

const selectedItems = [];
let filteredRecipes;
const tagFilterContainer = document.querySelector("#tag-filter-container");

// Récupérer les ingrédients, les ustensiles et les appareils de toutes les recettes
const allIngredients = new Set();
const allUstensils = new Set();
const allAppliances = new Set();

recipes.forEach((recipe) => {
  recipe.ingredients.forEach((ingredient) => {
    allIngredients.add(singularize(ingredient.ingredient.toLowerCase().trim()));
  });
  recipe.ustensils.forEach((ustensil) => {
    allUstensils.add(ustensil.toLowerCase().trim());
  });
  allAppliances.add(recipe.appliance.toLowerCase().trim());
});

// Fonction pour afficher les placeholders dans les inputs
export function placeholders() {
  const filtersInputs = document.querySelectorAll(".dropdown input");
  const placeholders = [];
  // Fonction pour réinitialiser les autres inputs
  function resetOtherInputs(index) {
    filtersInputs.forEach((input, i) => {
      if (i !== index) {
        input.value = "";
        input.placeholder = placeholders[i];
      }
    });
  }
  for (let i = 0; i < filtersInputs.length; i++) {
    // Stockage du placeholder initial dans un tableau
    placeholders.push(filtersInputs[i].placeholder);
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
    // Ajout d'un écouteur d'événement pour la saisie dans l'input
    filtersInputs[i].addEventListener("input", function () {
      // Réinitialisation des autres inputs
      resetOtherInputs(i);
    });
  }
}

// Fonction pour gérer les menus déroulants
export function handleDropdowns() {
  // Écouteur d'événement pour les clics sur la page
  document.addEventListener("click", (e) => {
    // Vérifie si l'élément cliqué est un bouton de menu déroulant
    const isDropdownButton = e.target.matches("[data-dropdown-button]");

    // Si l'élément cliqué est un bouton de menu déroulant ou s'il est contenu dans un menu déroulant,
    // on arrête l'exécution du code et on sort de la fonction
    if (!isDropdownButton && e.target.closest("[data-dropdown]") !== null) {
      return;
    }

    const dropdowns = document.querySelectorAll("[data-dropdown]");
    const dropdownButtons = document.querySelectorAll("[data-dropdown-button]");

    let currentDropdown;
    let currentChevron;

    // Si l'élément cliqué est un bouton de menu déroulant
    if (isDropdownButton) {
      // Récupère l'élément du menu déroulant correspondant au bouton cliqué
      currentDropdown = e.target.closest("[data-dropdown]");
      // Récupère l'élément chevron (icône) du bouton cliqué
      currentChevron = e.target.closest("[data-dropdown-button]");

      // Ajoute ou supprime la classe "active" pour afficher ou masquer le menu déroulant
      currentDropdown.classList.toggle("active");
      // Ajoute ou supprime la classe "rotation" pour faire pivoter l'icône du bouton
      currentChevron.classList.toggle("rotation");
    }

    // Parcourt tous les menus déroulants actifs, sauf celui correspondant au bouton cliqué,
    // pour les masquer et réinitialiser l'état des icônes
    for (let i = 0; i < dropdowns.length; i++) {
      const dropdown = dropdowns[i];
      const dropdownButton = dropdownButtons[i];

      if (currentDropdown !== undefined && dropdown === currentDropdown) {
        continue;
      }

      dropdown.classList.remove("active");
      dropdownButton.classList.remove("rotation");
    }
  });

  // Écouteur d'événement pour la focus sur les inputs
  const inputs = document.querySelectorAll(
    "input[type='text'][id='ingredients'], input[type='text'][id='appareils'], input[type='text'][id='ustensiles']"
  );
  inputs.forEach((input) => {
    input.addEventListener("focus", (e) => {
      const dropdowns = document.querySelectorAll("[data-dropdown]");
      const dropdownButtons = document.querySelectorAll(
        "[data-dropdown-button]"
      );

      const inputParent = input.closest("[data-dropdown]");

      // Parcourt tous les menus déroulants
      for (let i = 0; i < dropdowns.length; i++) {
        const dropdown = dropdowns[i];
        const dropdownButton = dropdownButtons[i];

        if (inputParent !== null && dropdown === inputParent) {
          // Si l'input qui a pris le focus est enfant du menu déroulant
          continue;
        }

        dropdown.classList.remove("active");
        dropdownButton.classList.remove("rotation");
      }
    });
  });
}

// Mettre les mots au singulier
function singularize(word) {
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
  const words = word.split(" ");
  const lastWord = words[words.length - 1]; // récupère le dernier mot

  if (exceptions.includes(lastWord)) {
    return word;
  } else if (lastWord.endsWith("s") || lastWord.endsWith("x")) {
    words[words.length - 1] = lastWord.slice(0, -1);
    return words.join(" ");
  } else {
    return word;
  }
}

// Fonction pour filtrer et trier une liste de mots
function filterAndSortWords(words, inputValue) {
  const inputWords = inputValue.toLowerCase().split(" ");

  const filteredWords = words.filter((word) => {
    const wordsArray = word.toLowerCase().split(" ");
    return inputWords.every((inputWord) =>
      wordsArray.some((word) => word.startsWith(inputWord))
    );
  });

  if (inputValue === "") {
    filteredWords.sort();
  }

  return filteredWords.slice(0, 30);
}

// Fonction pour filtrer et trier une liste de mots
function getFilteredItems(inputSelector, itemList, listSelector) {
  // Récupère l'élément d'entrée en utilisant un sélecteur CSS
  const input = document.querySelector(inputSelector);
  // Crée une copie triée de la liste d'éléments
  let filteredItems = [...itemList].sort();

  // Ajoute un écouteur d'événement pour l'événement "input" sur l'élément d'entrée
  input.addEventListener("input", function () {
    // Obtient la valeur de l'entrée, en supprimant les espaces et en la convertissant en minuscules
    const inputValue = input.value.trim().toLowerCase();
    // Obtient les noms des éléments sélectionnés, en les convertissant en minuscules
    const selectedNames = selectedItems.map((item) => item.name.toLowerCase());

    // Filtrer les éléments en utilisant la fonction filterAndSortWords et exclure les noms sélectionnés
    filteredItems = filterAndSortWords([...itemList], inputValue).filter(
      (item) => !selectedNames.includes(item.toLowerCase())
    );

    // Récupère l'élément de liste en utilisant un sélecteur CSS
    const list = document.querySelector(listSelector);
    list.innerHTML = "";

    // Mettre à jour la liste déroulante même si elle est déjà déroulée
    if (filteredItems.length === 0 && inputValue !== "") {
      // Crée un élément li avec un attribut personnalisé pour indiquer l'absence de correspondance
      const li = document.createElement("li");
      li.setAttribute("data-no-match", "true");

      // Crée un élément span pour afficher le message d'absence de correspondance
      const span = document.createElement("span");
      span.textContent = "Aucun élément ne correspond à votre recherche...";
      li.appendChild(span);

      // Ajoute l'élément li à la liste
      list.appendChild(li);
    } else {
      // Ajoute chaque élément filtré à la liste en créant des éléments li
      filteredItems.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        list.appendChild(li);
      });
    }

    listenLiClick(); // Ajout du gestionnaire d'événement pour les nouveaux éléments de la liste
  });

  // Renvoie les 30 premiers éléments filtrés
  return filteredItems.slice(0, 30);
}

// Utilise getFilteredItems
function getFilteredIngredients() {
  return getFilteredItems("#ingredients", allIngredients, ".ingredients-list");
}

// Utilise getFilteredItems
function getFilteredUstensils() {
  return getFilteredItems("#ustensiles", allUstensils, ".ustensiles-list");
}

// Utilise getFilteredItems
function getFilteredAppliances() {
  return getFilteredItems("#appareils", allAppliances, ".appareils-list");
}

// Fonction pour remplir les listes déroulantes
export function populateDropdown() {
  // Sélectionne tous les boutons de liste déroulante
  const dropdownButtons = document.querySelectorAll("[data-dropdown-button]");

  // Parcourt chaque bouton de liste déroulante
  dropdownButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Obtient le parent direct du bouton (le div conteneur)
      const parentDiv = button.parentNode.parentNode;
      // Sélectionne la liste ul à l'intérieur du div conteneur
      const list = parentDiv.querySelector("ul");

      // Obtient l'ID de l'élément d'entrée associé au div conteneur
      const inputId = parentDiv.querySelector("input").id;
      // Obtient la valeur de l'élément d'entrée et la convertit en minuscules sans espaces inutiles
      const inputValue = document
        .querySelector(`#${inputId}`)
        .value.trim()
        .toLowerCase();

      let items = [];
      let filteredItems = [];

      // Vérifie quelle classe est présente sur la liste pour déterminer le type d'éléments à filtrer
      if (list.classList.contains("ingredients-list")) {
        items = getFilteredIngredients(); // Appelle la fonction getFilteredIngredients pour obtenir les ingrédients filtrés
      } else if (list.classList.contains("appareils-list")) {
        items = getFilteredAppliances(); // Appelle la fonction getFilteredAppliances pour obtenir les appareils filtrés
      } else if (list.classList.contains("ustensiles-list")) {
        items = getFilteredUstensils(); // Appelle la fonction getFilteredUstensils pour obtenir les ustensiles filtrés
      }

      // Filtre et trie les éléments en fonction de la valeur d'entrée
      filteredItems = filterAndSortWords(items, inputValue);

      // Efface le contenu de la liste
      list.innerHTML = "";

      // Vérifie s'il n'y a aucun élément filtré et que la valeur d'entrée n'est pas vide
      if (filteredItems.length === 0 && inputValue !== "") {
        // Crée un élément li pour afficher le message "Aucun élément ne correspond à votre recherche..."
        const li = document.createElement("li");
        li.setAttribute("data-no-match", "true");

        const span = document.createElement("span");
        span.textContent = "Aucun élément ne correspond à votre recherche...";
        li.appendChild(span);

        list.appendChild(li);
      } else {
        // Parcourt les éléments filtrés et crée un élément li pour chaque élément
        filteredItems.forEach((item) => {
          const li = document.createElement("li");
          li.textContent = item;
          list.appendChild(li);
        });
      }
    });
  });

  listenLiClick(); // Ajoute le gestionnaire d'événement aux éléments de la liste
}

// Gère les clics sur les éléments de la liste déroulante et met à jour les sélections
function listenLiClick() {
  // Sélectionne tous les menus déroulants
  const dropdownMenus = document.querySelectorAll(".dropdown-menu");

  // Parcourt chaque menu déroulant
  dropdownMenus.forEach((menu) => {
    menu.addEventListener("click", (event) => {
      // Obtient l'élément li le plus proche à partir de l'événement click
      const li = event.target.closest("li");

      if (li) {
        // Vérifie si l'élément parent (ul) existe
        if (li.parentNode) {
          // Crée un objet représentant l'élément sélectionné avec son nom et le type de liste
          const selectedItem = {
            name: li.textContent.trim(),
            listType: li.parentNode.classList.value
              .replace("dropdown-menu", "")
              .trim(),
          };

          // Vérifie si l'élément sélectionné n'existe pas déjà dans le tableau selectedItems
          const exists = selectedItems.some(
            (item) =>
              item.name === selectedItem.name &&
              item.listType === selectedItem.listType
          );

          if (!exists) {
            // Ajoute l'élément sélectionné au tableau selectedItems
            selectedItems.push(selectedItem);
            console.log("Liste d'élément(s) sélectionné(s) :");
            console.log(selectedItems);

            // Crée un tag pour afficher l'élément sélectionné
            createTag(selectedItem);

            // Supprime l'élément sélectionné de la liste déroulante
            li.remove();

            // Appelle la fonction sortRecipes pour mettre à jour les recettes filtrées en fonction des éléments sélectionnés
            filteredRecipes = sortRecipes();
            console.log("Liste des recettes correspondantes :");
            console.log(filteredRecipes);

            // Déclenche un événement personnalisé "selectedItemsUpdated" pour notifier les autres composants de la mise à jour des éléments sélectionnés
            document.dispatchEvent(new Event("selectedItemsUpdated"));
          }
        }
      }
    });
  });
}

// Filtrer les recettes en fonction des éléments sélectionnés.
function sortRecipes() {
  // Récupère les noms des éléments sélectionnés en les mettant en minuscules et en supprimant les espaces inutiles
  const selectedItemsNames = selectedItems.map((item) =>
    item.name.toLowerCase().trim()
  );

  if (selectedItems.length === 0) {
    // Si aucun élément n'est sélectionné, toutes les recettes sont considérées comme filtrées
    filteredRecipes = recipes;
  } else {
    // Sinon, on filtre les recettes en fonction des éléments sélectionnés
    filteredRecipes = recipes.filter((recipe) => {
      // Obtient les noms des ingrédients, ustensiles et appareils de chaque recette
      const ingredients = recipe.ingredients.map((ingredient) =>
        ingredient.ingredient.toLowerCase().trim()
      );
      const ustensils = recipe.ustensils.map((ustensil) =>
        ustensil.toLowerCase().trim()
      );
      const appliances = [recipe.appliance.toLowerCase().trim()];

      // Vérifie si tous les éléments sélectionnés sont inclus dans la recette
      const isIncluded = selectedItemsNames.every((item) => {
        // Formate le nom de l'élément sélectionné en supprimant les "s" ou "x" à la fin pour prendre en compte les pluriels
        const singularItem = item.replace(/s$|x$/gi, "");
        const pluralItem = singularItem + "s";

        // Vérifie si l'élément sélectionné est inclus dans les ingrédients, ustensiles ou appareils de la recette
        return (
          ingredients.includes(item) ||
          ingredients.includes(singularItem) ||
          ingredients.includes(pluralItem) ||
          ustensils.includes(item) ||
          ustensils.includes(singularItem) ||
          ustensils.includes(pluralItem) ||
          appliances.includes(item) ||
          appliances.includes(singularItem) ||
          appliances.includes(pluralItem)
        );
      });

      return isIncluded;
    });
  }

  return filteredRecipes; // Retourne les recettes filtrées
}

// Supprime un élément de la liste des filtres sélectionnés, met à jour les recettes filtrées, et restaure l'élément supprimé dans la liste déroulante
function removeTagFilterOnClick() {
  tagFilterContainer.addEventListener("click", (event) => {
    const tagFilterImage = event.target.closest(".tag-filter img");

    if (tagFilterImage) {
      const tagFilter = tagFilterImage.closest(".tag-filter");
      const tagName = tagFilter.getAttribute("data-name");

      tagFilter.remove();

      // Supprimer l'élément correspondant de selectedItems
      const index = selectedItems.findIndex((item) => item.name === tagName);
      if (index !== -1) {
        selectedItems.splice(index, 1);
      }

      if (selectedItems.length === 0) {
        filteredRecipes = recipes;
        console.log("liste d'item sélectionné(s) :");
        console.log(selectedItems);
        console.log("liste des recettes qui matchent :");
        console.log(filteredRecipes);
      } else {
        filteredRecipes = sortRecipes();
        console.log("liste d'item sélectionné(s) :");
        console.log(selectedItems);
        console.log("liste des recettes qui matchent :");
        console.log(filteredRecipes);
      }

      document.dispatchEvent(new Event("selectedItemsUpdated"));
    }
  });
}

// Crée et ajoute un tag filtrant avec le nom de l'élément sélectionné
function createTag(selectedItem) {
  // Créer un élément div pour le tag filtrant
  const tagFilter = document.createElement("div");
  tagFilter.className = "tag-filter";

  // Créer un élément span pour afficher le nom de l'élément sélectionné
  const span = document.createElement("span");
  span.textContent = selectedItem.name;

  // Créer un élément img pour afficher l'icône de suppression du filtre
  const img = document.createElement("img");
  img.src = "assets/img/cross-circle.svg";
  img.alt = `Supprimer le filtre ${selectedItem.name}`;

  // Ajouter le contenu (span et img) à l'élément du tag filtrant
  tagFilter.append(span, img);

  // Stocker le nom de l'élément dans l'attribut data-name
  tagFilter.setAttribute("data-name", selectedItem.name);

  // Déterminer la couleur de fond du tag en fonction de sa catégorie
  if (selectedItem.listType.includes("ingredients")) {
    tagFilter.style.backgroundColor = "#286bff"; // Couleur pour les ingrédients
  } else if (selectedItem.listType.includes("appareils")) {
    tagFilter.style.backgroundColor = "#00ad4e"; // Couleur pour les appareils
  } else if (selectedItem.listType.includes("ustensiles")) {
    tagFilter.style.backgroundColor = "#fc4e3d"; // Couleur pour les ustensiles
  }

  // Ajouter un gestionnaire d'événement pour supprimer le tag
  tagFilter.addEventListener("click", () => {
    removeTagFilterOnClick(selectedItem.name);
  });

  // Ajouter le tag filtrant au conteneur des tags filtrants
  tagFilterContainer.append(tagFilter);
}

export { filteredRecipes, selectedItems };