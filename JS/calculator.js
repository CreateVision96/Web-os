const calcDisplay = document.querySelector("#calcDisplay");

function pressCalc(val) {
  if (!calcDisplay) return;

  if (calcDisplay.value === "0" || calcDisplay.value === "Error") {
    calcDisplay.value = val === "." ? "0." : val;
  } else {
    calcDisplay.value += val;
  }
}

function backspaceCalc() {
  if (!calcDisplay) return;

  if (calcDisplay.value.length <= 1 || calcDisplay.value === "Error") {
    calcDisplay.value = "0";
  } else {
    calcDisplay.value = calcDisplay.value.slice(0, -1);
  }
}

function clearCalc() {
  if (calcDisplay) {
    calcDisplay.value = "0";
  }
}

function percentCalc() {
  if (!calcDisplay) return;

  const num = parseFloat(calcDisplay.value);

  if (!isNaN(num)) {
    calcDisplay.value = String(num / 100);
  }
}

function calculateResult() {
  if (!calcDisplay) return;

  const expression = calcDisplay.value;

  if (!/^[0-9+\-*/.]+$/.test(expression)) {
    calcDisplay.value = "Error";
    return;
  }

  try {
    const result = Function('"use strict"; return (' + expression + ")")();

    if (!isFinite(result)) {
      calcDisplay.value = "Error";
    } else {
      calcDisplay.value = String(result);
    }
  } catch (e) {
    calcDisplay.value = "Error";
  }
}
