class HouseForSale {
  constructor(rdc_web_url, address, price, baths, beds, building_size, thumbnail) {
    var _rdc_web_url = rdc_web_url;
    var _address = address;
    var _price = price;
    var _baths = baths;
    var _beds = beds;
    var _building_size = building_size;
    var _thumbnail = thumbnail;

    this.getRedWebURL = function() { 
      return _rdc_web_url; 
    }

    this.getAddress = function() { 
      return _address; 
    }

    this.getPrice = function() { 
      return _price; 
    }

    this.getBaths = function() { 
      return _baths; 
    }

    this.getBeds = function() { 
      return _beds; 
    }

    this.getBuildingSize = function() { 
      return _building_size; 
    }

    this.getThumbnail = function() { 
      return _thumbnail; 
    }
  }
}

const LIMIT = 50;
let minPrice, maxPrice, city, stateCode;

const searchButton = document.querySelector(".search-houses-btn");
let housesForSale = [], resultsLimit = 50;

const featuredHouses = document.querySelectorAll(".featured-house").length;
let featuredHousesPerSlide, slides, slidesToRight, factor;

const previousHouseButton = document.querySelector(".prev-house");
const nextHouseButton = document.querySelector(".next-house");

const slideshowRect = document.querySelector(".slideshow-container").getBoundingClientRect();
const slideshowElements = document.querySelector(".slideshow-elements");
const slideshowElementsRect = slideshowElements.getBoundingClientRect();

const searchResultsContainer = document.querySelector(".search-results-container");
const housesForSaleContainer = document.querySelector(".houses-for-sale-container");
const showMoreButton = document.querySelector(".show-more-btn");
const showAllButton = document.querySelector(".show-all-btn");

updateSlideshowBindings();

window.onresize = () => {
  updateSlideshowBindings();
}

function updateSlideshowBindings() {
  featuredHousesPerSlide = getFeaturedHousesPerSlide();
  slides = featuredHouses / featuredHousesPerSlide;
  slidesToRight = slides - 1;
  factor = window.innerWidth < 1024 ? 1 : 0.5;

  slideshowElements.style.transform = "translateX(0)";
  previousHouseButton.classList.add("invisible");
  nextHouseButton.classList.remove("invisible");
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
searchButton.onclick = listHousesForSale;

function listHousesForSale() {
  var data = null;

  var xhr = new XMLHttpRequest();

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      extractDataOfInterest(this.responseText);
      addHousesToContainer();
      disableShowMoreAndShowAllButtons(false);
      makeVisible(searchResultsContainer);
      scrollToHousesForSale();
    }
  });

  xhr.open("GET", `https://realtor.p.rapidapi.com/properties/v2/list-for-sale?price_min=${minPrice}&sort=relevance&price_max=${maxPrice}&sqft_min=1&city=${city}&limit=${LIMIT}&offset=0&state_code=${stateCode}`);
  xhr.setRequestHeader("x-rapidapi-host", "realtor.p.rapidapi.com");
  xhr.setRequestHeader("x-rapidapi-key", "APIkey");

  xhr.send(data);
}

function extractDataOfInterest(responseText) {
  let response = JSON.parse(responseText);

  response.properties.forEach(house => {
    housesForSale.push(new HouseForSale(
      house.rdc_web_url,
      house.address,
      house.price,
      house.baths,
      house.beds,
      house.building_size,
      house.thumbnail
    ))
  });
}

function addHousesToContainer() {
  let visibleHouses = 0;

  if (housesForSale.length == 0) {
    document.querySelector(".location").innerText = location;
    makeVisible(document.querySelector(".no-results-message"));
    makeInvisible(document.querySelector(".horizontal-scroll-instruction"));
  } else {
    makeInvisible(document.querySelector(".no-results-message"));
    makeVisible(document.querySelector(".horizontal-scroll-instruction"));

    housesForSale.forEach(houseData => {
      let newHouse = createHouseElement();
      setHouseImage(newHouse, houseData);
      setHouseDescription(newHouse, houseData);
      viewHouseInNewTabOnClick(newHouse, houseData);
      
      if (visibleHouses >= 10) {
        newHouse.classList.add("invisible");
      }
  
      housesForSaleContainer.append(newHouse);
      visibleHouses++;
    });
  }
}



function createHouseElement() {
  let house = document.createElement("div");
  house.classList.add("house");

  house.append(createFavoriteElement());
  house.append(createHouseImageElement());
  house.append(createHouseDescriptionElement());

  return house;
}

function createFavoriteElement() {
  let favorite = document.createElement("div");
  favorite.classList.add("favorite");
  favorite.innerHTML = '<i class="far fa-heart"></i>';

  return favorite;
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
    houseImage.style.background = `url(${houseData.getThumbnail()})`;
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
    window.open(houseData.getRedWebURL());
  }
}



function scrollToHousesForSale() {
  searchResultsContainer.scrollIntoView({ 
    behavior: 'smooth' 
  });
}

/*=====================================
featured houses slideshow functions
=====================================*/
previousHouseButton.onclick = slideLeft;
nextHouseButton.onclick = slideRight;

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

function makeInvisible(element) {
  element.classList.add("invisible");
}

function makeVisible(element) {
  element.classList.remove("invisible");
}

/*=====================================
search results functions
=====================================*/
showMoreButton.onclick = showMoreHouses;
showAllButton.onclick = showAllHouses;

function showMoreHouses() {
  let invisibleHouses = document.querySelectorAll(".house.invisible");

  if (invisibleHouses.length < 10) {
    n = invisibleHouses.length;
  }
  if (invisibleHouses.length > 0) {
    for (let i = 0; i < 10; ++i) {
      invisibleHouses[i].classList.remove("invisible");
    }
  } else {
    disableShowMoreAndShowAllButtons(true);
  }
}

function showAllHouses() {
  let invisibleHouses = document.querySelectorAll(".house.invisible");

  invisibleHouses.forEach(house => {
    house.classList.remove("invisible");
  });

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