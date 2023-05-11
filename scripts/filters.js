import { recipes } from "../data/recette.js";

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
  const inputs = document.querySelectorAll("input[type='text'][id='ingredients'], input[type='text'][id='appareils'], input[type='text'][id='ustensiles']");
  inputs.forEach((input) => {
    input.addEventListener("focus", (e) => {
      const dropdowns = document.querySelectorAll("[data-dropdown]");
      const dropdownButtons = document.querySelectorAll("[data-dropdown-button]");

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

////////

// Fonction pour filtrer et trier une liste de mots
function filterAndSortWords(words, inputValue) {
  const inputWords = inputValue.toLowerCase().split(" ");

  const filteredWords = words.filter((word) => {
    const wordsArray = word.toLowerCase().split(" ");
    return inputWords.every((inputWord) => {
      return wordsArray.some((word) => word.startsWith(inputWord));
    });
  });

  if (inputValue === "") {
    filteredWords.sort();
  }

  return filteredWords.slice(0, 30);
}

function getFilteredItems(inputSelector, itemList, listSelector) {
  const input = document.querySelector(inputSelector);
  let filteredItems = [...itemList].sort();

  input.addEventListener("input", function () {
    const inputValue = input.value.trim().toLowerCase();
    filteredItems = filterAndSortWords([...itemList], inputValue);
    const list = document.querySelector(listSelector);
    list.innerHTML = "";
    filteredItems.slice(0, 30).forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      list.appendChild(li);
    });
  });

  return filteredItems.slice(0, 30);
}

function getFilteredIngredients() {
  return getFilteredItems("#ingredients", allIngredients, ".ingredients-list");
}

function getFilteredUstensils() {
  return getFilteredItems("#ustensiles", allUstensils, ".ustensiles-list");
}

function getFilteredAppliances() {
  return getFilteredItems("#appareils", allAppliances, ".appareils-list");
}

export function populateDropdown() {
  const dropdownButtons = document.querySelectorAll("[data-dropdown-button]");

  dropdownButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const parentDiv = button.parentNode.parentNode;
      const list = parentDiv.querySelector("ul");

      const inputId = parentDiv.querySelector("input").id;
      const inputValue = document
        .querySelector(`#${inputId}`)
        .value.trim()
        .toLowerCase();

      let items = [];
      let filteredItems = [];

      if (list.classList.contains("ingredients-list")) {
        items = getFilteredIngredients();
      } else if (list.classList.contains("appareils-list")) {
        items = getFilteredAppliances();
      } else if (list.classList.contains("ustensiles-list")) {
        items = getFilteredUstensils();
      }

      filteredItems = filterAndSortWords(items, inputValue);

      list.innerHTML = "";

      if (filteredItems.length === 0 && inputValue !== "") {
        const li = document.createElement("li");
        li.setAttribute("data-no-match", "true");

        const span = document.createElement("span");
        span.textContent = "Aucun élément ne correspond à votre recherche...";
        li.appendChild(span);

        list.appendChild(li);
      } else {
        filteredItems.forEach((item) => {
          const li = document.createElement("li");
          li.textContent = item;
          list.appendChild(li);
        });
      }

      listenLiClick();
    });
  });
}

// export function populateDropdown() {
//   const dropdownButtons = document.querySelectorAll("[data-dropdown-button]");

//   dropdownButtons.forEach((button) => {
//     button.addEventListener("click", () => {
//       const parentDiv = button.parentNode.parentNode;
//       const list = parentDiv.querySelector("ul");

//       if (list.classList.contains("ingredients-list")) {
//         const input = document.querySelector("#ingredients");
//         const inputValue = input.value.trim().toLowerCase();
//         const ingredients = getFilteredIngredients();
//         const filteredIngredients = filterAndSortWords(ingredients, inputValue);

//         list.innerHTML = "";

//         if (filteredIngredients.length === 0 && inputValue !== "") {
//           const li = document.createElement("li");
//           li.setAttribute("data-no-match", "true");

//           const span = document.createElement("span");
//           span.textContent = "Aucun élément ne correspond à votre recherche...";
//           li.appendChild(span);

//           list.appendChild(li);
//         } else {
//           filteredIngredients.forEach((ingredient) => {
//             const li = document.createElement("li");
//             li.textContent = ingredient;
//             list.appendChild(li);
//           });
//         }
//       } else if (list.classList.contains("appareils-list")) {
//         const input = document.querySelector("#appareils");
//         const inputValue = input.value.trim().toLowerCase();
//         const appliances = getFilteredAppliances();
//         const filteredAppliances = filterAndSortWords(appliances, inputValue);

//         list.innerHTML = "";

//         if (filteredAppliances.length === 0 && inputValue !== "") {
//           const li = document.createElement("li");
//           li.setAttribute("data-no-match", "true");

//           const span = document.createElement("span");
//           span.textContent = "Aucun élément ne correspond à votre recherche...";
//           li.appendChild(span);

//           list.appendChild(li);
//         } else {
//           filteredAppliances.forEach((appliance) => {
//             const li = document.createElement("li");
//             li.textContent = appliance;
//             list.appendChild(li);
//           });
//         }
//       } else if (list.classList.contains("ustensiles-list")) {
//         const input = document.querySelector("#ustensiles");
//         const inputValue = input.value.trim().toLowerCase();
//         const ustensils = getFilteredUstensils();
//         const filteredUstensils = filterAndSortWords(ustensils, inputValue);

//         list.innerHTML = "";

//         if (filteredUstensils.length === 0 && inputValue !== "") {
//           const li = document.createElement("li");
//           li.setAttribute("data-no-match", "true");

//           const span = document.createElement("span");
//           span.textContent = "Aucun élément ne correspond à votre recherche...";
//           li.appendChild(span);

//           list.appendChild(li);
//         } else {
//           filteredUstensils.forEach((ustensil) => {
//             const li = document.createElement("li");
//             li.textContent = ustensil;
//             list.appendChild(li);
//           });
//         }
//       }
//       listenLiClick();
//     });
//   });
// }

const selectedItems = [];
let filteredRecipes;

function listenLiClick() {
  const liElements = document.querySelectorAll(".dropdown-menu li");

  liElements.forEach((li) => {
    li.addEventListener("click", () => {
      const selectedItem = {
        name: li.textContent.trim(),
        listType: li.parentNode.classList.value
          .replace("dropdown-menu", "")
          .trim(),
      };

      // Vérification si l'élément n'existe pas déjà dans le tableau
      const exists = selectedItems.some(
        (item) =>
          item.name === selectedItem.name &&
          item.listType === selectedItem.listType
      );
      if (!exists) {
        selectedItems.push(selectedItem);
        console.log("liste d'item sélectionné(s) :");
        console.log(selectedItems);
        createTag(selectedItem);

        // Appeler triRecettes et transmettre le tableau selectedItems mis à jour
        filteredRecipes = triRecettes();
        console.log("liste des recettes qui matchent :");
        console.log(filteredRecipes);
      }
    });
  });
}

function triRecettes() {
  const selectedItemsNames = selectedItems.map((item) =>
    item.name.toLowerCase().trim()
  );

  if (selectedItems.length === 0) {
    filteredRecipes = recipes;
  } else {
    filteredRecipes = recipes.filter((recipe) => {
      const ingredients = recipe.ingredients.map((ingredient) =>
        ingredient.ingredient.toLowerCase().trim()
      );
      const ustensils = recipe.ustensils.map((ustensil) =>
        ustensil.toLowerCase().trim()
      );
      const appliances = [recipe.appliance.toLowerCase().trim()];

      const isIncluded = selectedItemsNames.every((item) => {
        const singularItem = item.replace(/s$|x$/gi, "");
        const pluralItem = singularItem + "s";
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
  return filteredRecipes;
}

const tagFilterContainer = document.querySelector("#tag-filter-container");
// let isRemoveTagFilterInitialized = true;

function removeTagFilterOnClick() {
  tagFilterContainer.addEventListener("click", (event) => {
    const tagFilterImage = event.target.closest(".tag-filter img");

    if (tagFilterImage) {
      const tagFilter = tagFilterImage.closest(".tag-filter");
      const tagName = tagFilter.getAttribute("data-name");

      tagFilter.remove();

      // Supprimer l'élément correspondant de selectedItems
      selectedItems.splice(
        selectedItems.findIndex((item) => item.name === tagName),
        1
      );

      if (selectedItems.length === 0) {
        filteredRecipes = recipes;
        console.log(filteredRecipes);
      } else {
        filteredRecipes = triRecettes();
        console.log(filteredRecipes);
      }
    }
  });
}

function createTag(selectedItem) {
  const tagFilter = document.createElement("div");
  tagFilter.className = "tag-filter";

  const span = document.createElement("span");
  span.textContent = selectedItem.name;

  const img = document.createElement("img");
  img.src = "assets/img/cross-circle.svg";
  img.alt = `Supprimer le filtre ${selectedItem.name}`;

  tagFilter.append(span, img);
  tagFilter.setAttribute("data-name", selectedItem.name);

  if (selectedItem.listType.includes("ingredients")) {
    tagFilter.style.backgroundColor = "#286bff";
  } else if (selectedItem.listType.includes("appareils")) {
    tagFilter.style.backgroundColor = "#00ad4e";
  } else if (selectedItem.listType.includes("ustensiles")) {
    tagFilter.style.backgroundColor = "#fc4e3d";
  }

  // Ajout du gestionnaire d'événement pour supprimer le tag
  tagFilter.addEventListener("click", () => {
    removeTagFilterOnClick(tagFilter);
  });

  tagFilterContainer.append(tagFilter);
}
