import { makeCall, House } from "./buy.js";

/*=====================================
bindings
=====================================*/
const soldHousesContainer = document.querySelector(".sold-houses-container");
const searchButton = document.querySelector(".search-houses-btn");
let soldHouses = [];

/*=====================================
event listeners
=====================================*/
searchButton.onclick = () => { 
  makeCall(soldHouses, soldHousesContainer, createHouseFromSoldHouseData, "sold", "sold_date");
};

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
