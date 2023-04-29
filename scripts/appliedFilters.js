const appliedFilters = document.querySelector('#appliedFilters');

export function getTagFilterText() {
  // Sélectionne tous les éléments ayant la classe .tag-filter
  const tagFilters = document.querySelectorAll('.tag-filter');
  // Tableau qui stockera le contenu textuel des spans
  const tagFilterText = [];

  // Parcours tous les éléments de classe .tag-filter
  tagFilters.forEach(tagFilter => {
    // Récupère l'élément span contenu dans chaque élément .tag-filter
    const span = tagFilter.querySelector('span');
    // Récupère le contenu textuel du span et l'ajoute au tableau
    tagFilterText.push(span.textContent);
  });

  console.log(tagFilterText);
  // Retourne le tableau contenant le contenu textuel de tous les spans
  return tagFilterText;
}

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