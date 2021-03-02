import { DISPATCH_REALTOR_API_REQUESTS_API_ENDPOINT as lambdaEndpoint } from "./keys.js";

export class House {
  constructor(property_id, rdc_web_url, address, price, baths, beds, building_size, thumbnail) {
    var _property_id = property_id;
    var _rdc_web_url = rdc_web_url;
    var _address = address;
    var _price = price;
    var _baths = baths;
    var _beds = beds;
    var _building_size = building_size;
    var _thumbnail = thumbnail;

    this.getPropertyID = function() { 
      return _property_id; 
    };

    this.getRedWebURL = function() { 
      return _rdc_web_url; 
    };

    this.getAddress = function() { 
      return _address; 
    };

    this.getPrice = function() { 
      return _price; 
    };

    this.getBaths = function() { 
      return _baths; 
    };

    this.getBeds = function() { 
      return _beds; 
    };

    this.getBuildingSize = function() { 
      return _building_size; 
    };

    this.getThumbnail = function() { 
      return _thumbnail; 
    };
  }
}

/*=====================================
bindings
=====================================*/
const topCities = [
  {
    "city_name": "New York City",
    "state_code": "NY"
  },
  {
    "city_name": "Los Angeles",
    "state_code": "CA"
  },
  {
    "city_name": "Chicago",
    "state_code": "IL"
  },
  {
    "city_name": "Houstan",
    "state_code": "TX"
  },
  {
    "city_name": "Phoenix",
    "state_code": "AZ"
  },
  {
    "city_name": "Philadelphia",
    "state_code": "PA"
  },
  {
    "city_name": "San Antonio",
    "state_code": "TX"
  },
  {
    "city_name": "San Diego",
    "state_code": "CA"
  },
  {
    "city_name": "Dallas",
    "state_code": "TX"
  },
  {
    "city_name": "San Jose",
    "state_code": "CA"
  },
]

let clickedOnHeart = false;
let limit, minPrice, maxPrice, city, stateCode;
export let favoriteHouses = JSON.parse(localStorage.getItem("favoriteHouses") || "[]");

let featuredHousesPerSlide, slides, slidesToRight, factor;
let featuredHouses = [];

const inputLocation = document.getElementById("location");
const selectMinPrice = document.getElementById("min-price");
const selectMaxPrice = document.getElementById("max-price");
const searchButton = document.querySelector(".search-houses-btn");
let housesForSale = [];

const previousHouseButton = document.querySelector(".prev-house");
const nextHouseButton = document.querySelector(".next-house");

const featuredHousesContainer = document.querySelector(".featured-houses-container");
const slideshowElements = document.querySelector(".slideshow-elements");

const loadingContainer = document.querySelector(".loading");

const searchResultsContainer = document.querySelector(".search-results-container");
const housesForSaleContainer = document.querySelector(".houses-for-sale-container");
const showMoreButton = document.querySelector(".show-more-btn");
const showAllButton = document.querySelector(".show-all-btn");

function initiateBindings() {
  if (document.title == "Buy Home") {
    let n = Math.floor(Math.random() * 10);

    limit = 6;
    minPrice = 1;
    maxPrice = 10000000;
    city = topCities[n]["city_name"];
    stateCode = topCities[n]["state_code"];

    const params = {
      realtorEndpoint: "featured-houses",
      minPrice: minPrice.toString(),
      maxPrice: maxPrice.toString(),
      city: city.replaceAll(" ", "%20"),
      limit: limit.toString(),
      stateCode
    };
    
    dispatchLambdaRequest(lambdaEndpoint, params, getFeaturedHouses);
    makeVisible(loadingContainer);
  }

  limit = 50;
}

initiateBindings();

function dispatchLambdaRequest(url, params, callback, ...args) {
  const data = null;
  const xhr = new XMLHttpRequest();
  url += formatParams(params);

  xhr.open("GET", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.addEventListener("load", function () {
    if (xhr.status < 400) {
      callback(JSON.parse(xhr.responseText), args);
    } else {
      console.log("Request failed: " + xhr.responseText);
    }
  });
  
  xhr.send(data);
}

function formatParams(params) {
  return "?" + Object
    .keys(params)
    .map(function(key) {
      return key + "=" + encodeURIComponent(params[key])
    })
    .join("&");
}

/*=====================================
event listeners
=====================================*/
if (searchButton) { 
  searchButton.onclick = () => { 
    let location = inputLocation.value.replaceAll(" ", "%20");
    location = location.replaceAll(",", "%2C");
    const params = {
      realtorEndpoint: "city-and-state-code",
      location
    };
    makeCall(params, housesForSale, housesForSaleContainer, createHouseFromHouseForSaleData, "for-sale", "relevance");
  };
}

if (previousHouseButton) { previousHouseButton.onclick = slideLeft; }
if (nextHouseButton) { nextHouseButton.onclick = slideRight; }

if (showMoreButton) { showMoreButton.onclick = showMoreHouses; }
if (showAllButton) { showAllButton.onclick = showAllHouses; }

if (document.title === "Buy Home") {
  window.addEventListener("resize", updateSlideshowBindings);
}

function updateSlideshowBindings() {
  featuredHousesPerSlide = getFeaturedHousesPerSlide();
  slides = featuredHouses.length / featuredHousesPerSlide;
  slidesToRight = slides - 1;
  factor = window.innerWidth < 1024 ? 1 : 0.5;

  slideshowElements.style.transform = "translateX(0)";
  makeInvisible(previousHouseButton);
  makeVisible(nextHouseButton);
}

function getFeaturedHousesPerSlide() {
  if (window.innerWidth < 576) {
    return 1;
  }
  if (window.innerWidth < 768) {
    return 2;
  }
  if (window.innerWidth < 1024) {
    return 3;
  }
  
  return 4;
}

/*=====================================
search form functions
=====================================*/
export function makeCall(params, houses, container, houseType, action, sort) {
  if (!inputLocation.value) {
    alert("Please introduce lacation.");
    return;
  }

  if (selectMinPrice.selectedIndex == 0) {
    alert("Please select a minimum price.");
    return;
  }

  if (selectMaxPrice.selectedIndex == 0) {
    alert("Please select a maximum price.");
    return;
  }

  processPriceRange();
  if (minPrice >= maxPrice) {
    alert("Please select a valid price range.");
    selectMinPrice.selectedIndex = 0;
    selectMaxPrice.selectedIndex = 0;
    return;
  }

  clearData(houses, container);
  dispatchLambdaRequest(lambdaEndpoint, params, getCityAndStateCode, listHouses, houses, container, houseType, action, sort);
  makeVisible(loadingContainer);
  scrollTo(loadingContainer);
  makeInvisible(searchResultsContainer);
}

function clearData(houses, container) {
  city = "";
  stateCode = "";
  houses = [];
  container.innerHTML = "";
}

function processPriceRange() {
  minPrice = getSelectedOptionNumericValue(selectMinPrice);
  maxPrice = getSelectedOptionNumericValue(selectMaxPrice);
}

function getSelectedOptionNumericValue(select) {
  let value = select.options[select.selectedIndex].text;

  value = value.slice(1, value.length);
  if (value.charAt(value.length - 1) == "k") {
    value = value.slice(0, -1);
    value = parseFloat(value) * 1000;
  } else if (value.charAt(value.length - 1) == "M") {
    value = value.slice(0, -1);
    value = parseFloat(value) * 1000000;
  } else {
    value = parseFloat(value);
  }

  return value;
}

function getCityAndStateCode(response, args) {
  if (response.autocomplete.length > 0) {
    city = response.autocomplete[0]["city"];
    stateCode = response.autocomplete[0]["state_code"];

    const [callback, houses, container, houseType, action, sort] = args;
    const params = {
      realtorEndpoint: "houses-for-sale",
      action,
      minPrice: minPrice.toString(),
      sort,
      maxPrice: maxPrice.toString(),
      city: city.replaceAll(" ", "%20"),
      limit: limit.toString(),
      stateCode
    };

    dispatchLambdaRequest(lambdaEndpoint, params, callback, houseType, houses, container);
  } else {
    city = "the specified location";
    addHousesToContainer(houses, container);
    disableShowMoreAndShowAllButtons(true);
    makeVisible(searchResultsContainer);
    scrollTo(searchResultsContainer);
    resetForm();
  }
}

function extractDataOfInterest(response, houses, houseType) {
  response.properties.forEach(houseData => {
    houses.push(houseType(houseData));
  });
}

function createHouseFromHouseForSaleData(houseData) {
  return new House(
    houseData.property_id,
    houseData.rdc_web_url,
    houseData.address,
    houseData.price,
    houseData.baths,
    houseData.beds,
    houseData.building_size,
    houseData.thumbnail
  );
}

function resetForm() {
  inputLocation.value = "";
  selectMinPrice.selectedIndex = 0;
  selectMaxPrice.selectedIndex = 0;
}

/*=====================================
featured houses slideshow functions
=====================================*/
function getFeaturedHouses(response) {
  extractDataOfInterest(response, featuredHouses, createHouseFromHouseForSaleData);
  if (featuredHouses.length === 0) {
    initiateBindings();
  }
  
  updateSlideshowBindings();
  setFeaturedHousesContaierTitle();
  addFeaturedHousesToContainer();
  makeInvisible(loadingContainer);
  makeVisible(featuredHousesContainer);
}
  
function setFeaturedHousesContaierTitle() {
  document.querySelector(".featured-houses-container-title").innerText = "Featured houses in " + city + ", " + stateCode;
}

function addFeaturedHousesToContainer() {
  featuredHouses.forEach(houseData => {
    let newHouse = addHouseToContainer(slideshowElements, houseData, featuredHouses, true);
    isFavoriteHouse(favoriteHouses, newHouse.id);
  });
}

function slideLeft() {
  slidesToRight += 1;
  slideshowElements.style.transform = `translateX(calc(-100% * ${factor * (slides - slidesToRight - 1)})`;

  if (atFirstSlide()) {
    makeInvisible(previousHouseButton);
  }
  if (!atLastSlide()) {
    makeVisible(nextHouseButton);
  }
}

function slideRight() {
  slideshowElements.style.transform = `translateX(calc(-100% * ${factor * (slides - slidesToRight)}))`;
  slidesToRight -= 1;
  
  if (!atFirstSlide()) {
    makeVisible(previousHouseButton);
  }
  if (atLastSlide()) {
    makeInvisible(nextHouseButton);
  }
}

function atFirstSlide() {
  return slidesToRight + 1 == slides;
}

function atLastSlide() {
  return slidesToRight <= 0;
}

export function makeInvisible(element) {
  element.classList.add("invisible");
}

export function makeVisible(element) {
  element.classList.remove("invisible");
}

/*=====================================
search results functions
=====================================*/
function listHouses(response, args) {
  const [houseType, houses, container] = args;
  extractDataOfInterest(response, houses, houseType);
  addHousesToContainer(houses, container);
  disableShowMoreAndShowAllButtons(false);
  makeInvisible(loadingContainer);
  makeVisible(searchResultsContainer);
  scrollTo(searchResultsContainer);
}

function addHousesToContainer(houses, container) {
  if (houses.length == 0) {
    document.querySelector(".span-location").innerText = city;
    makeVisible(document.querySelector(".no-results-message"));
    makeInvisible(document.querySelector(".horizontal-scroll-instruction"));
    return;
  }

  let visibleHouses = 0;

  makeInvisible(document.querySelector(".no-results-message"));
  makeVisible(document.querySelector(".horizontal-scroll-instruction"));

  houses.forEach(houseData => {
    let newHouse = addHouseToContainer(container, houseData, houses);
    
    isFavoriteHouse(favoriteHouses, newHouse.id);
    
    if (visibleHouses >= 10) {
      makeInvisible(newHouse);
    }

    visibleHouses++;
  });
}

function showMoreHouses() {
  let housesToDisplay = (featuredHousesPerSlide + 1) * 2;
  let invisibleHouses = document.querySelectorAll(".house.invisible");

  if (invisibleHouses.length < housesToDisplay) {
    housesToDisplay = invisibleHouses.length;
  }
  if (invisibleHouses.length > 0) {
    for (let i = 0; i < housesToDisplay; ++i) {
      makeVisible(invisibleHouses[i]);
    }

    scrollTo(invisibleHouses[0]);
  } else {
    disableShowMoreAndShowAllButtons(true);
  }
}

function showAllHouses() {
  let invisibleHouses = document.querySelectorAll(".house.invisible");

  invisibleHouses.forEach(house => {
    makeVisible(house);
  });

  scrollTo(invisibleHouses[0]);
  disableShowMoreAndShowAllButtons(true);
}

function disableShowMoreAndShowAllButtons(value) {
  showMoreButton.disabled = value;
  showAllButton.disabled = value;

  if (value) {
    showMoreButton.classList.add("disabled");
    showAllButton.classList.add("disabled");
  } else {
    showMoreButton.classList.remove("disabled");
    showAllButton.classList.remove("disabled");
  }
}

function scrollTo(element) {
  element.scrollIntoView({ 
    behavior: 'smooth' 
  }); 
}

/*=====================================
house element functions
=====================================*/
export function addHouseToContainer(container, houseData, houses, featured = false) {
  let newHouse = createHouseElement(houses, featured);
  newHouse.id = houseData.getPropertyID();

  setHouseImage(newHouse, houseData);
  setHouseDescription(newHouse, houseData);
  viewHouseInNewTabOnClick(newHouse, houseData);

  container.append(newHouse);

  return newHouse;
}

function createHouseElement(houses, featured) {
  let house = document.createElement("div");
  house.classList.add("house");

  if (featured) {
    house.classList.add("featured-house");
  }

  house.append(createFavoriteElement(houses));
  house.append(createHouseImageElement());
  house.append(createHouseDescriptionElement());

  return house;
}



function createFavoriteElement(houses) {
  let favorite = document.createElement("div");
  let emptyHeart = createEmptyHeartElement();
  let filledHeart = createFilledHeartElement();
  favorite.classList.add("favorite");

  favorite.append(emptyHeart);
  favorite.append(filledHeart);

  emptyHeart.addEventListener("click", () => { addHouseToFavorites(houses, emptyHeart); });
  emptyHeart.addEventListener("click", () => { makeInvisible(emptyHeart); });
  emptyHeart.addEventListener("click", () => { makeVisible(emptyHeart.nextElementSibling); });

  filledHeart.addEventListener("click", () => { removeHouseFromFavorites(filledHeart); });
  filledHeart.addEventListener("click", () => { makeInvisible(filledHeart); });
  filledHeart.addEventListener("click", () => { makeVisible(filledHeart.previousElementSibling); });

  return favorite;
}

function createEmptyHeartElement() {
  let emptyHeart = document.createElement("i");
  emptyHeart.classList.add("far", "fa-heart");

  return emptyHeart;
}

function createFilledHeartElement() {
  let filledHeart = document.createElement("i");
  filledHeart.classList.add("fas", "fa-heart", "invisible");

  return filledHeart;
}

function createHouseImageElement() {
  let houseImage = document.createElement("div");
  houseImage.classList.add("house-img");

  return houseImage;
}



function createHouseDescriptionElement() {
  let houseDescriptionContainer = document.createElement("div");
  let houseDescription = document.createElement("div");
  houseDescriptionContainer.classList.add("house-description-container");
  houseDescription.classList.add("house-description");

  houseDescription.append(createPriceElement());
  houseDescription.append(createBedsBathsAreaElement());
  houseDescription.append(createLineNeighborhoodPostcodeElement());
  houseDescription.append(createCityCountyStateCodeElement());
  houseDescriptionContainer.append(houseDescription);

  return houseDescriptionContainer;
}

function createPriceElement() {
  let price = document.createElement("span");
  price.classList.add("price");
  price.innerHTML = "&#36;";

  return price;
}

function createBedsBathsAreaElement() {
  let bedsBathsArea = document.createElement("span");
  bedsBathsArea.classList.add("beds-baths-area");
  
  bedsBathsArea.append(createBedIcon());
  bedsBathsArea.append(createBathIcon());
  bedsBathsArea.append(createRulerIcon());

  return bedsBathsArea;
}

function createBedIcon() {
  let bed = document.createElement("i");
  bed.classList.add("fas", "fa-bed");
  bed.innerText = " Beds";

  return bed;
}

function createBathIcon() {
  let bath = document.createElement("i");
  bath.classList.add("fas", "fa-bath");
  bath.innerText = " Baths";

  return bath;
}

function createRulerIcon() {
  let ruler = document.createElement("i");
  ruler.classList.add("fas", "fa-ruler-combined");

  return ruler;
}

function createLineNeighborhoodPostcodeElement() {
  let lineNeighborhoodPostcode = document.createElement("span");
  lineNeighborhoodPostcode.classList.add("line-neighborhood-postcode");

  return lineNeighborhoodPostcode;
}

function createCityCountyStateCodeElement() {
  let cityCountyStateCode = document.createElement("span");
  cityCountyStateCode.classList.add("city-county-state-code");

  return cityCountyStateCode;
}



function setHouseImage(house, houseData) {
  let houseImage = house.childNodes[1];

  if (houseData.getThumbnail() != undefined) {
    houseImage.style.backgroundImage = `url(${houseData.getThumbnail()})`;
  }
}



function setHouseDescription(houseElement, houseData) {
  let houseDescriptionContainer = houseElement.childNodes[2];
  
  let houseDescription = houseDescriptionContainer.childNodes[0];
  
  let price = houseDescription.childNodes[0];
  let bedsBathsArea = houseDescription.childNodes[1];
  let lineNeighborhoodPostcode = houseDescription.childNodes[2];
  let cityCountyStateCode = houseDescription.childNodes[3];

  price.innerHTML += houseData.getPrice();

  bedsBathsArea.childNodes[0].innerText = ` ${houseData.getBeds()} ${bedsBathsArea.childNodes[0].innerText}`;
  bedsBathsArea.childNodes[1].innerText = ` ${houseData.getBaths()} ${bedsBathsArea.childNodes[1].innerText}`;
  bedsBathsArea.childNodes[2].innerText = ` ${houseData.getBuildingSize().size} Sq. Ft.`;
  
  let address = houseData.getAddress();
  lineNeighborhoodPostcode.innerText = `${address.line}, ${address.neighborhood_name}, ${address.postal_code}`;
  cityCountyStateCode.innerText = `${address.city}, ${address.county}, ${address.state_code}`;
}



function viewHouseInNewTabOnClick(house, houseData) {
  house.onclick = function() {
    if (!clickedOnHeart) {
      window.open(houseData.getRedWebURL()); 
    } else {
      clickedOnHeart = false;
    }
  }
}

function addHouseToFavorites(houses, emptyHeartElement) {
  let favoriteElement = emptyHeartElement.parentNode;
  let houseElement = favoriteElement.parentNode;
  let favoriteHouse;

  favoriteHouse = getHouseData(houses, houseElement.id);

  favoriteHouses.push(favoriteHouse);

  updateLocalStorage("favoriteHouses", favoriteHouses);
  clickedOnHeart = true;
}

function removeHouseFromFavorites(filledHeartElement) {
  let favoriteElement = filledHeartElement.parentNode;
  let houseElement = favoriteElement.parentNode;

  for (let i = 0; i < favoriteHouses.length; ++i) {
    if (favoriteHouses[i].property_id == houseElement.id) {
      favoriteHouses.splice(i, 1);
      if (document.title == "Favorite houses") {
        houseElement.remove();
      }
      break;
    }
  }

  updateLocalStorage("favoriteHouses", favoriteHouses);
  clickedOnHeart = true;
}

function getHouseData(houses, houseID) {
  for (let i = 0; i < houses.length; ++i) {
    if (houses[i].getPropertyID() == houseID) {
      return {
        property_id: houses[i].getPropertyID(),
        rdc_web_url: houses[i].getRedWebURL(),
        address: houses[i].getAddress(),
        price: houses[i].getPrice(),
        baths: houses[i].getBaths(),
        beds: houses[i].getBeds(),
        building_size: houses[i].getBuildingSize(),
        thumbnail: houses[i].getThumbnail()
      };
    }
  }
}

function isFavoriteHouse(houses, houseID) {
  for (let i = 0; i < houses.length; ++i) {
    if (houses[i].property_id == houseID) {
      let favoriteElement = document.getElementById(houseID).childNodes[0];
      let emptyHeartElement = favoriteElement.childNodes[0];
      let filledHeartElement = favoriteElement.childNodes[1];

      makeInvisible(emptyHeartElement);
      makeVisible(filledHeartElement);
      break;
    }
  }
}

function updateLocalStorage(bindingName, binding) {
  localStorage.setItem(bindingName, JSON.stringify(binding));
}
