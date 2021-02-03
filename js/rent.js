/*=====================================
bindings
=====================================*/
const housesForRentContainer = document.querySelector(".houses-for-rent-container");
let housesForRent = [];

/*=====================================
event listeners
=====================================*/
try {
  if (searchButton) { 
    searchButton.onclick = () => { 
      makeCall(housesForRent, housesForRentContainer, createHouseFromHouseForRentData, "for-rent", "relevance");
    } 
  }
} catch (error) {}

/*=====================================
search form functions
=====================================*/
function createHouseFromHouseForRentData(houseData) {
  let price, priceMin = houseData.community["price_min"], priceMax = houseData.community["price_max"];
  let baths, bathsMin = houseData.community["baths_min"], bathsMax = houseData.community["baths_max"];
  let beds, bedsMin = houseData.community["beds_min"], bedsMax = houseData.community["beds_max"];
  let building_size = {}, sizeMin = houseData.community["sqft_min"], sizeMax = houseData.community["sqft_max"];
  let thumbnail = houseData.photos[0].href;

  if (priceMin == priceMax) {
    price = `${priceMin}/month`;
  } else {
    price = `${priceMin} - ${priceMax}/month`;
  }
  
  if (bathsMin == bathsMax) {
    baths = ` ${bathsMin}`;
  } else {
    baths = ` ${bathsMin} - ${bathsMax}`;
  }

  if (bedsMin == bedsMax) {
    beds = ` ${bedsMin}`;
  } else {
    beds = ` ${bedsMin} - ${bedsMax}`;
  }
  
  if (sizeMin == sizeMax) {
    building_size.size = sizeMin;
  } else {
    building_size.size = `${sizeMin} - ${sizeMax}`;
  }

  building_size.units = "sqft";
  
  return new House(
    houseData.property_id,
    houseData.rdc_web_url,
    houseData.address,
    price,
    baths,
    beds,
    building_size,
    thumbnail
  );
}
