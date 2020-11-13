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

let paymentFixedTop = document.querySelector(".fixed-top");
let paymentContainer = document.querySelector(".payment-container");

setPayment();

function setPayment() {
  let payment = document.querySelectorAll(".payment");

  let principalAndInterest = setPrincipalAndInterest();
  let propertyTaxes = setPropertyTaxes();
  let homeInsurance = setHomeInsurance();
  let HOA = setHOA();
  let mortgageInsuranceAndOther = setMortgageInsuranceAndOther();

  payment[0].innerText = "$" + (principalAndInterest + propertyTaxes + homeInsurance + HOA + mortgageInsuranceAndOther);
  payment[1].innerText = payment[0].innerText;
}

function setPrincipalAndInterest() {
  let principalAndInterest = document.querySelector(".principal-and-interest");
  let months = 30 * 12;
  let monthlyInterest = numberInterestRate.value / 100 / 12;
  let monthlyPayment = monthlyInterest == 0 ? 0 : Math.floor(numberHomePrice.value * monthlyInterest * Math.pow(1 + monthlyInterest, months) / (Math.pow(1 + monthlyInterest, 360) - 1));
  principalAndInterest.innerText = "$" + monthlyPayment;
  
  return monthlyPayment;
}

function setPropertyTaxes() {
  let propertyTaxes = document.querySelector(".property-taxes");
  let propertyTaxesValue = Math.ceil(numberHomePrice.value / 100 * numberPropertyTax.value / 12);
  propertyTaxes.innerText = "$" + propertyTaxesValue.toString();

  return propertyTaxesValue;
}

function setHomeInsurance() {
  let homeInsurance = document.querySelector(".home-insurance");
  let homeInsuranceValue = Math.ceil(numberHomeInsurance.value / 12);
  homeInsurance.innerText = "$" + homeInsuranceValue.toString();

  return homeInsuranceValue;
}

function setHOA() {
  let HOA = document.querySelector(".HOA");
  let HOAValue = parseFloat(numberHOA.value);
  HOA.innerText = "$" + HOAValue.toString();

  return HOAValue;
}

function setMortgageInsuranceAndOther() {
  let mortgageInsuranceAndOther = document.querySelector(".mortgage-insurance-and-other");
  let mortgageInsuranceAndOtherValue = parseFloat(numberOtherPayments.value);
  mortgageInsuranceAndOther.innerText = "$" + mortgageInsuranceAndOtherValue.toString();

  return mortgageInsuranceAndOtherValue;
}

rangeHomePrice.addEventListener("input", () => { 
  copyValue(numberHomePrice, rangeHomePrice);
  calculateDownPaymentPercentage(percentageDownPayment, numberHomePrice, numberDownPayment);
  setPayment();
});
rangeDownPayment.addEventListener("input", () => { 
  copyValue(numberDownPayment, rangeDownPayment); 
  calculateDownPaymentPercentage(percentageDownPayment, numberHomePrice, numberDownPayment);
  setPayment();
});
rangeInterestRate.addEventListener("input", () => { 
  copyValue(numberInterestRate, rangeInterestRate);
  setPayment();
});
rangePropertyTax.addEventListener("input", () => { 
  copyValue(numberPropertyTax, rangePropertyTax);
  setPayment();
});
rangeHomeInsurance.addEventListener("input", () => { 
  copyValue(numberHomeInsurance, rangeHomeInsurance);
  setPayment();
});
rangeHOA.addEventListener("input", () => { 
  copyValue(numberHOA, rangeHOA);
  setPayment();
});
rangeOtherPayments.addEventListener("input", () => { 
  copyValue(numberOtherPayments, rangeOtherPayments);
  setPayment();
});

function copyValue(textInput, rangeInput) {
  textInput.value = rangeInput.value;
}

function calculateDownPaymentPercentage(percentageDownPayment, homePrice, downPayment) {
  percentageDownPayment.value = Math.floor(downPayment.value * 100 / homePrice.value);
}

window.onscroll = () => {
  if (paymentContainer.getBoundingClientRect().top <= 0) {
    paymentFixedTop.classList.remove("invisible");
  } else {
    paymentFixedTop.classList.add("invisible");
  }
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