const calcState = {
  currentDisplay: "0",
  firstValue: null,
  awaitingSecondValue: false,
  currentOperator: null,
};

const handleDigit = (digit) => {
  const { currentDisplay, awaitingSecondValue } = calcState;

  if (awaitingSecondValue === true) {
    calcState.currentDisplay = digit;
    calcState.awaitingSecondValue = false;
  } else {
    calcState.currentDisplay =
      currentDisplay === "0" ? digit : currentDisplay + digit;
  }
};

const handleDecimal = (dot) => {
  if (calcState.awaitingSecondValue === true) {
    calcState.currentDisplay = "0.";
    calcState.awaitingSecondValue = false;
    return;
  }

  if (!calcState.currentDisplay.includes(dot)) {
    calcState.currentDisplay += dot;
  }
};

const processOperator = (nextOperator) => {
  const { firstValue, currentDisplay, currentOperator } = calcState;
  const inputValue = parseFloat(currentDisplay);

  if (currentOperator && calcState.awaitingSecondValue) {
    calcState.currentOperator = nextOperator;
    return;
  }

  if (firstValue == null && !isNaN(inputValue)) {
    calcState.firstValue = inputValue;
  } else if (currentOperator) {
    const result = operations[currentOperator](firstValue, inputValue);

    calcState.currentDisplay = String(result);
    calcState.firstValue = result;
  }

  calcState.awaitingSecondValue = true;
  calcState.currentOperator = nextOperator;
};

const operations = {
  "/": (firstValue, secondValue) => firstValue / secondValue,

  "*": (firstValue, secondValue) => firstValue * secondValue,

  "+": (firstValue, secondValue) => firstValue + secondValue,

  "-": (firstValue, secondValue) => firstValue - secondValue,

  "=": (firstValue, secondValue) => secondValue,
};

const clearCalculator = () => {
  calcState.currentDisplay = "0";
  calcState.firstValue = null;
  calcState.awaitingSecondValue = false;
  calcState.currentOperator = null;
};

const refreshDisplay = () => {
  const display = document.querySelector(".calculator-screen");
  display.value = calcState.currentDisplay;
};

refreshDisplay();

const keys = document.querySelector(".calculator-keys");
keys.addEventListener("click", (event) => {
  const { target } = event;
  if (!target.matches("button")) {
    return;
  }

  if (target.classList.contains("operator")) {
    processOperator(target.value);
    refreshDisplay();
    return;
  }

  if (target.classList.contains("decimal")) {
    handleDecimal(target.value);
    refreshDisplay();
    return;
  }

  if (target.classList.contains("all-clear")) {
    clearCalculator();
    refreshDisplay();
    return;
  }

  handleDigit(target.value);
  refreshDisplay();
});
