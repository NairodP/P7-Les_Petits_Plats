import {
  listenLiClick
} from "./filters.js";

const appliedFilters = document.querySelector('#appliedFilters');

export function removeTagFilterOnClick() {
  // Sélectionne tous les éléments img ayant la classe .tag-filter
  const tagFilterImages = document.querySelectorAll('.tag-filter img');

  // Parcours tous les éléments de classe .tag-filter img
  tagFilterImages.forEach(tagFilterImage => {
    // Ajoute un gestionnaire d'événement 'click'
    tagFilterImage.addEventListener('click', () => {
      // Récupère l'élément parent .tag-filter de l'image et le supprime
      tagFilterImage.closest('.tag-filter').remove();
    });
  });
}