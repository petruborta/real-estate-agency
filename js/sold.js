/*=====================================
bindings
=====================================*/
const soldHousesContainer = document.querySelector(".sold-houses-container");
let soldHouses = [];

/*=====================================
event listeners
=====================================*/
if (searchButton) { 
  searchButton.onclick = () => { 
    makeCall(soldHouses, soldHousesContainer, createHouseFromSoldHouseData, "sold", "sold_date");
  } 
}

/*=====================================
search form functions
=====================================*/
function createHouseFromSoldHouseData(houseData) {  
  return new House(
    houseData.property_id,
    houseData.rdc_web_url,
    houseData.address,
    houseData.price,
    houseData.baths,
    houseData.beds,
    houseData.building_size,
    houseData.photos[0].href
  );
}