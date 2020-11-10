let advancedCalculator = document.querySelector(".advanced-calculator-container");
let showAdvancedCalculatorButton = document.querySelector(".show-advanced-calculator");
let hideAdvancedCalculatorButton = document.querySelector(".hide-advanced-calculator");

advancedCalculator.style.height = "0px";

window.onresize = () => {
  if (advancedCalculator.style.height != "0px") {
    window.innerWidth < 576 ?
      advancedCalculator.style.height = "300px" :
      advancedCalculator.style.height = "240px";
  }
};

showAdvancedCalculatorButton.onclick = function() {
  window.innerWidth < 576 ? 
    advancedCalculator.style.height = "300px" :
    advancedCalculator.style.height = "240px";
  makeVisible(hideAdvancedCalculatorButton);
  makeInvisible(this);
};

hideAdvancedCalculatorButton.onclick = function() {
  advancedCalculator.style.height = "0";
  makeVisible(showAdvancedCalculatorButton);
  makeInvisible(this);
};


function makeVisible(element) {
  element.classList.remove("invisible");
}

function makeInvisible(element) {
  element.classList.add("invisible");
}