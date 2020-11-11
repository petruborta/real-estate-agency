let advancedCalculator = document.querySelector(".advanced-calculator-container");
advancedCalculator.style.height = "0px";

let showAdvancedCalculatorButton = document.querySelector(".show-advanced-calculator");
let hideAdvancedCalculatorButton = document.querySelector(".hide-advanced-calculator");

let rangeHomePrice = document.getElementById("range-home-price");
let rangeDownPayment = document.getElementById("range-down-payment");
let rangeInterestRate = document.getElementById("range-interest-rate");
let rangePropertyTax = document.getElementById("range-property-tax");
let rangeHomeInsurance = document.getElementById("range-home-insurance");
let rangeHOA = document.getElementById("range-HOA");
let rangeOtherPayments = document.getElementById("range-other-payments");

let numberHomePrice = document.getElementById("number-home-price");
let numberDownPayment = document.getElementById("number-down-payment");
let percentageDownPayment = document.getElementById("percentage-down-payment");
let numberInterestRate = document.getElementById("number-interest-rate");
let numberPropertyTax = document.getElementById("number-property-tax");
let numberHomeInsurance = document.getElementById("number-home-insurance");
let numberHOA = document.getElementById("number-HOA");
let numberOtherPayments = document.getElementById("number-other-payments");

rangeHomePrice.addEventListener("input", () => { 
  copyValue(numberHomePrice, rangeHomePrice);
  calculateDownPaymentPercentage(percentageDownPayment, numberHomePrice, numberDownPayment);
});

rangeDownPayment.addEventListener("input", () => { 
  copyValue(numberDownPayment, rangeDownPayment); 
  calculateDownPaymentPercentage(percentageDownPayment, numberHomePrice, numberDownPayment);
});


rangeInterestRate.oninput = () => { copyValue(numberInterestRate, rangeInterestRate); };
rangePropertyTax.oninput = () => { copyValue(numberPropertyTax, rangePropertyTax); };
rangeHomeInsurance.oninput = () => { copyValue(numberHomeInsurance, rangeHomeInsurance); };
rangeHOA.oninput = () => { copyValue(numberHOA, rangeHOA); };
rangeOtherPayments.oninput = () => { copyValue(numberOtherPayments, rangeOtherPayments); };

function copyValue(textInput, rangeInput) {
  textInput.value = rangeInput.value;
}

function calculateDownPaymentPercentage(percentageDownPayment, homePrice, downPayment) {
  percentageDownPayment.value = Math.floor(downPayment.value * 100 / homePrice.value);
}

window.onresize = () => {
  if (advancedCalculator.style.height != "0px") {
    window.innerWidth < 576 ?
      advancedCalculator.style.height = "30rem" :
      advancedCalculator.style.height = "24rem";
  }
};

showAdvancedCalculatorButton.onclick = function() {
  window.innerWidth < 576 ? 
    advancedCalculator.style.height = "30rem" :
    advancedCalculator.style.height = "24rem";
  makeVisible(hideAdvancedCalculatorButton);
  makeInvisible(this);
};

hideAdvancedCalculatorButton.onclick = function() {
  advancedCalculator.style.height = "0px";
  makeVisible(showAdvancedCalculatorButton);
  makeInvisible(this);
};


function makeVisible(element) {
  element.classList.remove("invisible");
}

function makeInvisible(element) {
  element.classList.add("invisible");
}