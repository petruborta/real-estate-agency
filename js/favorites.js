const favoriteHousesContainer = document.querySelector(".favorite-houses-container");
const noFavoriteHousesContainer = document.querySelector(".no-favorite-houses-container");

displayFavoriteHouses();

function displayFavoriteHouses() {
  if (showFavoriteHouses()) {
    addFavoriteHousesToContainer();
  }
}

function addFavoriteHousesToContainer() {
  favoriteHouses.forEach(houseData => {
    let house = new House(
      houseData.property_id,
      houseData.rdc_web_url,
      houseData.address,
      houseData.price,
      houseData.baths,
      houseData.beds,
      houseData.building_size,
      houseData.thumbnail
    );
    let newHouse = addHouseToContainer(favoriteHousesContainer, house);
    
    let favoriteElement = newHouse.childNodes[0];
    let emptyHeartElement = favoriteElement.childNodes[0];
    let filledHeartElement = favoriteElement.childNodes[1];

    makeInvisible(emptyHeartElement);
    makeVisible(filledHeartElement);

    filledHeartElement.addEventListener("click", showFavoriteHouses);
  });
}

function showFavoriteHouses() {
  if (thereAreFavoriteHouses()) {
    makeVisible(favoriteHousesContainer);
    makeInvisible(noFavoriteHousesContainer);
    return true;
  }

  makeVisible(noFavoriteHousesContainer);
  makeInvisible(favoriteHousesContainer);
  return false;
}

function thereAreFavoriteHouses() {
  return favoriteHouses.length > 0;
}