import change from "./d3chart.js";

const defaultValues = {
  homePrice: 200000,
  downPayment: 40000,
  percentageDownPaymentDefault: 20,
  percentageDownPaymentFHA: 3.5,
  percentageDownPaymentVA: 0,
  interestRate30years: 3.62,
  interestRate20years: 3.36,
  interestRate15years: 3.11,
  interestRate10years: 3.33,
  propertyTax: 1,
  homeInsurance: 900,
  HOA: 0,
  otherPayments: 0
};
let loanYears = 30;
let mortgageInsurance = 0;

const advancedCalculator = document.querySelector(".advanced-calculator-container");

const showAdvancedCalculatorButton = document.querySelector(".show-advanced-calculator");
const hideAdvancedCalculatorButton = document.querySelector(".hide-advanced-calculator");

const rangeInputs = {
  homePrice: document.getElementById("range-home-price"),
  percentageDownPayment: document.getElementById("range-percentage-down-payment"),
  interestRate: document.getElementById("range-interest-rate"),
  propertyTax: document.getElementById("range-property-tax"),
  homeInsurance: document.getElementById("range-home-insurance"),
  HOA: document.getElementById("range-HOA"),
  otherPayments: document.getElementById("range-other-payments")
};

const textInputs = {
  homePrice: document.getElementById("number-home-price"),
  downPayment: document.getElementById("number-down-payment"),
  percentageDownPayment: document.getElementById("number-percentage-down-payment"),
  interestRate: document.getElementById("number-interest-rate"),
  propertyTax: document.getElementById("number-property-tax"),
  homeInsurance: document.getElementById("number-home-insurance"),
  HOA: document.getElementById("number-HOA"),
  otherPayments: document.getElementById("number-other-payments")
};

const selectLoanType = document.getElementById("loan-type");

const paymentFixedTop = document.querySelector(".fixed-top");
const paymentContainer = document.querySelector(".payment-container");

addEventListenersToRangeInputs();
addEventListenersToTextInputs();
selectLoanType.addEventListener("change", onChangeLoanType);

setPayment();

function setPayment() {
  let principalAndInterest = setPrincipalAndInterest();
  let propertyTaxes = setPropertyTaxes();
  let homeInsurance = setHomeInsurance();
  let HOA = setHOA();
  let mortgageInsuranceAndOther = setMortgageInsuranceAndOther();

  let payment = document.querySelectorAll(".payment");
  payment[0].innerText = "$" + (principalAndInterest + propertyTaxes + homeInsurance + HOA + mortgageInsuranceAndOther);
  payment[1].innerText = payment[0].innerText;
  
  let legend = document.getElementsByClassName("legend");
  Array.from(legend).map(text => text.remove());

  let dataset = [
    { label: "Principal & interest", value: principalAndInterest }, 
    { label: "Property taxes", value: propertyTaxes }, 
    { label: "Home insurance", value: homeInsurance },
    { label: "HOA", value: HOA },
    { label: "Mortgage insurance & other", value: mortgageInsuranceAndOther }
  ];

  change(dataset);
}

function setPrincipalAndInterest() {
  const { homePrice, downPayment, interestRate } = textInputs;
  let months = loanYears * 12;
  let monthlyInterest = interestRate.value / 100 / 12;
  let monthlyPayment = monthlyInterest == 0 ? 0 : Math.floor((homePrice.value - downPayment.value) * monthlyInterest * Math.pow(1 + monthlyInterest, months) / (Math.pow(1 + monthlyInterest, months) - 1));
  
  let principalAndInterest = document.querySelector(".principal-and-interest");
  principalAndInterest.innerText = "$" + monthlyPayment;
  
  return monthlyPayment;
}

function setPropertyTaxes() {
  const { homePrice, propertyTax } = textInputs;
  let propertyTaxesValue = Math.ceil(homePrice.value / 100 * propertyTax.value / 12);

  let propertyTaxes = document.querySelector(".property-taxes");
  propertyTaxes.innerText = "$" + propertyTaxesValue.toString();

  return propertyTaxesValue;
}

function setHomeInsurance() {
  let homeInsuranceValue = Math.ceil(textInputs.homeInsurance.value / 12);

  let homeInsurance = document.querySelector(".home-insurance");
  homeInsurance.innerText = "$" + homeInsuranceValue.toString();

  return homeInsuranceValue;
}

function setHOA() {
  let HOAValue = parseInt(textInputs.HOA.value);

  let HOA = document.querySelector(".HOA");
  HOA.innerText = "$" + HOAValue.toString();

  return HOAValue;
}

function setMortgageInsuranceAndOther() {
  const { homePrice, downPayment, otherPayments } = textInputs;
  let monthlyMortgageInsurance =  mortgageInsurance === 0 ? 0 : Math.floor((homePrice.value - downPayment.value) / 100 * mortgageInsurance / 12);
  let mortgageInsuranceAndOtherValue = monthlyMortgageInsurance + parseInt(otherPayments.value);

  let mortgageInsuranceAndOther = document.querySelector(".mortgage-insurance-and-other");
  mortgageInsuranceAndOther.innerText = "$" + mortgageInsuranceAndOtherValue.toString();

  return mortgageInsuranceAndOtherValue;
}

function addEventListenersToRangeInputs() {
  for (let input in rangeInputs) {
    if (input === "homePrice" || input === "percentageDownPayment") {
      rangeInputs[input].addEventListener("input", () => { 
        applyChanges(input, false, () => calculateDownPayment(textInputs));
      });

      continue;
    }

    rangeInputs[input].addEventListener("input", () => { 
      applyChanges(input);
    });
  }
}

function addEventListenersToTextInputs() {
  for (let input in textInputs) {
    if (input === "homePrice" || input === "percentageDownPayment") {
      textInputs[input].addEventListener("input", (event) => {
        hasValidValue(event);
        applyChanges(input, true, () => calculateDownPayment(textInputs));
      });

      continue;
    } else if (input === "downPayment") {
      textInputs[input].addEventListener("input", (event) => {
        hasValidValue(event);
        calculateDownPaymentPercentage(textInputs, rangeInputs.percentageDownPayment);
        setMortgageInsurance(textInputs, selectLoanType);
        setPayment();
      });

      continue;
    }

    textInputs[input].addEventListener("input", (event) => {
      hasValidValue(event);
      applyChanges(input, true);
    });
  }
}

function hasValidValue(event) {
  let { name: property, value } = event.target;
  property = convertProperty(property);
  const greaterThanOrEqualToZero = isGreaterThanOrEqualToZero(value);

  if (!greaterThanOrEqualToZero) { 
    setDefaultValue(property);
    return;
  }

  isLowerThanOrEqualToMax(property, value);
}

function convertProperty(property) {
  const words = property.split("-").slice(1);
  let [first, ...rest] = words;
  rest = rest.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join("");

  return first + rest;
}

function isGreaterThanOrEqualToZero(value) {
  const regExp = new RegExp("^(0|[1-9][0-9]*|([1-9][0-9]?)\.[0-9]{0,5})$");
  return regExp.test(value);
}

function setDefaultValue(property) {
  let propertyCopy = property;
  const loanType = selectLoanType.value;

  if (property === "interestRate") {
    propertyCopy += getInterestRateSuffix(loanType);
  } else if (property === "percentageDownPayment") {
    propertyCopy += getPercentageDownPaymentSuffix(loanType);
  }

  textInputs[property].value = defaultValues[propertyCopy];
}

function getInterestRateSuffix(loanType) {
  return loanType.slice(-3) + "ears";
}

function getPercentageDownPaymentSuffix(loanType) {
  return loanType.slice(0, loanType.length - 3).toUpperCase() || "Default";
}


function isLowerThanOrEqualToMax(property, value) {
  const { homePrice, downPayment } = textInputs;

  switch(property) {
    case "downPayment":
      if (parseInt(value) > homePrice.value) downPayment.value = homePrice.value;
      break;
    case "percentageDownPayment":
    case "interestRate":
    case "propertyTax":
      if (value > 100) textInputs[property].value = 100;
  }
}

function onChangeLoanType(event) {
  const { value: loanType } = event.target;

  changePercentageDownPayment(loanType);
  calculateDownPayment(textInputs);
  changeInterestRate(loanType);

  applyChanges("percentageDownPayment", true);
  applyChanges("interestRate", true);
}

function changePercentageDownPayment(loanType) {
  const { percentageDownPayment } = textInputs;
  const { percentageDownPaymentDefault, percentageDownPaymentFHA, percentageDownPaymentVA } = defaultValues;

  switch(loanType) {
    case "30y": 
    case "20y":
    case "15y":
    case "10y":
      setProperty(percentageDownPayment, percentageDownPaymentDefault); 
      break;
    case "fha30y":
    case "fha15y":
      setProperty(percentageDownPayment, percentageDownPaymentFHA); 
      break;
    case "va30y": 
    case "va15y":
      setProperty(percentageDownPayment, percentageDownPaymentVA);
  }
}

function changeInterestRate(loanType) {
  const { interestRate } = textInputs;
  const { interestRate30years, interestRate20years, interestRate15years, interestRate10years } = defaultValues;

  switch(loanType) {
    case "30y":
    case "fha30y":
    case "va30y":
      loanYears = 30;
      setProperty(interestRate, interestRate30years);
      break;
    case "20y":
      loanYears = 20;
      setProperty(interestRate, interestRate20years);
      break;
    case "15y":
    case "fha15y":
    case "va15y":
      loanYears = 15;
      setProperty(interestRate, interestRate15years);
      break;
    case "10y":
      loanYears = 10;
      setProperty(interestRate, interestRate10years);
  }
}

function applyChanges(inputName, reverse = false, func = null) {
  reverse
    ? copyValue(textInputs[inputName], rangeInputs[inputName])
    : copyValue(rangeInputs[inputName], textInputs[inputName]);

  if (func !== null) {
    func();
  }

  setMortgageInsurance(textInputs, selectLoanType);
  setPayment();
}

function copyValue(inputFrom, inputTo) {
  inputTo.value = parseFloat(inputFrom.value);
}

function calculateDownPayment({ percentageDownPayment, homePrice, downPayment }) {
  let amount = Math.floor(homePrice.value / 100 * percentageDownPayment.value);
  setProperty(downPayment, amount);
}

function calculateDownPaymentPercentage({ downPayment, homePrice, percentageDownPayment }, rangePercentageDownPayment) {
  let percentage = Math.floor(downPayment.value / (homePrice.value / 100));
  setProperty(rangePercentageDownPayment, percentage);
  setProperty(percentageDownPayment, percentage);
}

function setMortgageInsurance({ percentageDownPayment }, selectLoanType) {
  percentageDownPayment.value < 20 && !loanIsOfTypeVA(selectLoanType) 
    ? mortgageInsurance = 1 
    : mortgageInsurance = 0;
}

function loanIsOfTypeVA(selectLoanType) {
  let loanType = selectLoanType.value;
  return loanType === "va30y" || loanType === "va15y";
}

function setProperty(property, newValue) {
  property.value = newValue;
}

window.onscroll = () => {
  if (paymentContainer.getBoundingClientRect().top <= 0) {
    paymentFixedTop.classList.remove("invisible");
  } else {
    paymentFixedTop.classList.add("invisible");
  }
};

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
  setTimeout(() => {
    advancedCalculator.style.overflow = "visible";
  }, 300);
};

hideAdvancedCalculatorButton.onclick = function() {
  advancedCalculator.style.height = "0px";
  makeVisible(showAdvancedCalculatorButton);
  makeInvisible(this);
  advancedCalculator.style.overflow = "hidden";
};

function makeVisible(element) {
  element.classList.remove("invisible");
}

function makeInvisible(element) {
  element.classList.add("invisible");
}
