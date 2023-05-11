// Fonction de recherche par mot clé
function searchRecipes(keyword) {
  const results = recipes.filter(recipe => 
    recipe.name.toLowerCase().includes(keyword.toLowerCase()) ||
    recipe.description.toLowerCase().includes(keyword.toLowerCase()) ||
    recipe.ingredients.some(ingredient => 
      ingredient.ingredient.toLowerCase().includes(keyword.toLowerCase())
    )
  );
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