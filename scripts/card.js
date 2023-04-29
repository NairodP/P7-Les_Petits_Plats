export function displayResults(results) {
  const recettes = document.querySelector("#recettes");
  recettes.innerHTML = "";
  for (let i = 0; i < results.length; i++) {
    const result = results[i];

    const card = document.createElement("div");
    card.classList.add("card");

    const image = document.createElement("div");
    image.classList.add("card-image");
    card.appendChild(image);

    const content = document.createElement("div");
    content.classList.add("card-content");
    card.appendChild(content);

    const contentHeader = document.createElement("div");
    contentHeader.classList.add("card-contentHeader");
    content.appendChild(contentHeader);

    const contentMain = document.createElement("div");
    contentMain.classList.add("card-contentMain");
    content.appendChild(contentMain);

    const name = document.createElement("h2");
    name.classList.add("card-name");
    name.textContent = result.name;
    contentHeader.appendChild(name);

    const time = document.createElement("div");
    time.classList.add("card-time");
    contentHeader.appendChild(time);

    const clockIcon = document.createElement("img");
    clockIcon.classList.add("clock-icon");
    clockIcon.src = "assets/img/time.svg";
    time.appendChild(clockIcon);

    const timeText = document.createElement("span");
    timeText.classList.add("time-text");
    timeText.textContent = result.time + " " + "min";
    time.appendChild(timeText);

    const ingredients = document.createElement("ul");
    ingredients.classList.add("card-ingredients");
    contentMain.appendChild(ingredients);

    for (let j = 0; j < result.ingredients.length; j++) {
      const ingredient = result.ingredients[j];

      const ingredientItem = document.createElement("li");
      ingredientItem.classList.add("ingredient-item");

      const ingredientName = ingredient.ingredient;
      const unit = ingredient.unit === "grammes" ? "g" : ingredient.unit;
      const quantity = ingredient.quantity ? ": " + ingredient.quantity : "";

      let ingredientText = "<strong>" + ingredientName + "</strong>";
      if (quantity) {
        ingredientText += quantity;
      }
      if ((unit && unit === "g") || unit === "cl" || unit === "ml") {
        ingredientText += unit;
      } else if (unit) {
        ingredientText += " " + unit;
      }

      ingredientItem.innerHTML = ingredientText;
      ingredients.appendChild(ingredientItem);
    }

    const description = document.createElement("p");
    description.classList.add("card-description");
    description.textContent = result.description;
    contentMain.appendChild(description);

    recettes.appendChild(card);
  }
}
