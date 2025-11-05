const unitWidget = document.getElementById("unit-widget");
const tenWidget = document.getElementById("ten-widget");
const unitNumberTab = document.querySelector("#unit-widget .number-tab");
const tenNumberTab = document.querySelector("#ten-widget .number-tab");
const unitSquaresContainer = document.querySelector(
  "#unit-widget .squares-container"
);
const tenSquaresContainer = document.querySelector(
  "#ten-widget .squares-container"
);
const unitInnerCard = document.querySelector("#unit-widget .inner-card");
const unitTextDisplay = document.querySelector("#unit-widget .text-display");
const tenTextDisplay = document.querySelector("#ten-widget .text-display");
const unitsPlus = document.getElementById("units-plus");
const unitsMinus = document.getElementById("units-minus");
const tensPlus = document.getElementById("tens-plus");
const tensMinus = document.getElementById("tens-minus");
const leftDir = document.querySelector(".left-dir");
const rightDir = document.querySelector(".right-dir");
const boxContainer = document.querySelector("#box-container");
const submitButton = document.getElementById("submitButton");
const commentElement = document.querySelector(".comment");

document.querySelectorAll(".control-btn").forEach((button) => {
  button.addEventListener("click", () => {
    playSound("click");
  });
});
// --- State ---
let unitCount = 0,
  maxCount = 10,
  minCount = 0,
  tenCount = 0;
let isNumberTextUp = false;
function addUnit(visible = true) {
  const visibility = visible ? "visible" : "hidden";
  const square = document.createElement("div");
  square.className = "count-square";
  square.style.visibility = visibility;
  unitSquaresContainer.appendChild(square);
  unitCount++;
}
function popUnit() {
  unitSquaresContainer.lastElementChild.remove();
  unitCount--;
}

function addUnits(n, visible = true) {
  const visibility = visible ? "visible" : "hidden";
  for (let i = 0; i < n; i++) {
    const square = document.createElement("div");
    square.style.visibility = visibility;
    square.className = "count-square";
    unitSquaresContainer.appendChild(square);
    unitCount++;
  }
}
function removeUnits(n) {
  for (let i = 0; i < n; i++) {
    unitSquaresContainer.lastElementChild.remove();
    unitCount--;
  }
}
function appendTen(visibile = true) {
  const visibility = visibile ? "visible" : "hidden";
  if (tenCount === 10) return;
  const rod = document.createElement("div");
  rod.className = "ten-bar";
  rod.style.visibility = visibility;
  const unit = `<div class="unit-box"></div>`;
  rod.innerHTML = unit.repeat(10);
  tenSquaresContainer.appendChild(rod);
  tenCount++;
}
function popTen() {
  tenSquaresContainer.lastElementChild.remove();
  tenCount--;
}
function updateUnitTexts(n = unitCount) {
  unitNumberTab.textContent = n < 10 ? n : "X";
  unitTextDisplay.textContent =
    numberToText[n] + tags.ones;
}
function updateTenTexts(n = tenCount) {
  tenNumberTab.textContent = n;
  tenTextDisplay.textContent = numberToText[n] + (n === 1 ? tags.ten : tags.tens);
}

unitsPlus.addEventListener("click", () => {
  if (unitCount < 20) {
    cancelAttention();
    addUnit();
    updateUnitTexts();
  }
});

unitsMinus.addEventListener("click", () => {
  if (unitCount > 0) {
    cancelAttention();
    popUnit();
    updateUnitTexts();
  }
});
tensPlus.addEventListener("click", () => {
  if (tenCount < 10) {
    cancelAttention();
    appendTen();
    updateTenTexts();
  }
});
tensMinus.addEventListener("click", () => {
  if (tenCount > 0) {
    cancelAttention();
    popTen();
    updateTenTexts();
  }
});

function resetUnit() {
  unitCount = 0;
  updateUnitTexts();
  unitSquaresContainer.innerHTML = "";
}
function resetTen() {
  tenCount = 0;
  updateTenTexts();
  tenSquaresContainer.innerHTML = "";
}
resetTen();
resetUnit();

function animateCloneToTarget(
  sourceElement,
  targetElement,
  onStart,
  onComplete
) {
  const targetRect = targetElement.getBoundingClientRect();
  const clone = createClone(sourceElement);
  onStart?.();
  animateClone(clone, targetRect, onComplete);
}
function promiseWrapper(func, sourceEl, targetEl, onStart, onEnd) {
  return new Promise((resolve) => {
    func(
      sourceEl,
      targetEl,
      () => {
        onStart?.();
      },
      () => {
        onEnd?.();
        resolve();
      }
    );
  });
}
function createClone(sourceElement) {
  const clone = sourceElement.cloneNode(true);
  const styles = window.getComputedStyle(sourceElement);
  clone.id = "";
  const sourceRect = sourceElement.getBoundingClientRect();
  clone.style.position = "absolute";
  clone.style.margin = "0"; // Reset margins
  clone.style.boxSizing = "border-box"; // Consistent box model
  clone.style.zIndex = "50"; // Ensure it's on top during animation
  clone.style.backgroundColor = styles.backgroundColor;
  // Set initial size and position (relative to the document)
  clone.style.width = `${sourceRect.width}px`;
  clone.style.height = `${sourceRect.height}px`;
  clone.style.top = `${sourceRect.top + window.scrollY}px`;
  clone.style.left = `${sourceRect.left + window.scrollX}px`;
  clone.style.transitionProperty = "top, left, width, height";
  clone.style.transitionDuration = `500ms`;
  clone.style.transitionTimingFunction = "ease-in-out";
  document.body.appendChild(clone);
  return clone;
}

function animateClone(clone, targetRect, onComplete) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      clone.style.top = `${targetRect.top + window.scrollY}px`;
      clone.style.left = `${targetRect.left + window.scrollX}px`;
      clone.style.width = `${targetRect.width}px`;
      clone.style.height = `${targetRect.height}px`;
    });
  });

  // Clean up after the animation
  clone.addEventListener(
    "transitionend",
    function handleTransitionEnd() {
      clone.removeEventListener("transitionend", handleTransitionEnd);
      clone.parentNode.removeChild(clone);
      onComplete?.();
    },
    { once: true }
  );
}

function animateUnitsToTens() {
  let units = document.querySelectorAll(".count-square");
  const len = units.length;
  units = Array.from(units).slice(len - 10);
  appendTen(false);
  const tenBar = document.querySelectorAll(".ten-bar")[tenCount - 1];
  const tens = tenBar.querySelectorAll(".unit-box");
  const promisesList = units.map((src, index) => {
    const dest = tens[index];
    return promiseWrapper(
      animateCloneToTarget,
      src,
      dest,
      () => {
        src.style.visibility = "hidden";
      },
      () => {
        dest.style.visibility = "visible";
      }
    );
  });
  return Promise.all(promisesList);
}

function animateTensToUnits() {
  addUnits(10, false);
  let units = document.querySelectorAll(".count-square");
  const len = units.length;
  units = Array.from(units).slice(len - 10);
  const tenBar = document.querySelectorAll(".ten-bar")[tenCount - 1];
  let tens = tenBar.querySelectorAll(".unit-box");
  tens = Array.from(tens);
  const promisesList = tens.map((src, index) => {
    const dest = units[index];
    return promiseWrapper(
      animateCloneToTarget,
      src,
      dest,
      () => {
        src.style.visibility = "hidden";
      },
      () => {
        dest.style.visibility = "visible";
      }
    );
  });
  return Promise.all(promisesList);
}

async function unitsToTensWrapper() {
  updateUnitTexts(unitCount - 10);
  await animateUnitsToTens();
  updateTenTexts();
  removeUnits(10);
}

async function tensToUnitsWrapper() {
  updateTenTexts(tenCount - 1);
  await animateTensToUnits();
  updateUnitTexts();
  popTen();
}
leftDir.onclick = onLeftDirClick;
rightDir.onclick = onRightDirClick;

async function onLeftDirClick() {
  playSound("click");
  if (unitCount < 10 || tenCount >= 10) return;
  cancelAttention();

  wiggle(false);
  await unitsToTensWrapper();
}

async function onRightDirClick() {
  playSound("click");
  if (unitCount > 10 || tenCount < 1) return;
  cancelAttention();

  await tensToUnitsWrapper();
}

function showDirArrow(name) {
  if (name === "left") {
    leftDir.style.display = "flex";
  } else if (name === "right") {
    rightDir.style.display = "flex";
  } else {
    leftDir.style.display = "none";
    rightDir.style.display = "none";
  }
}
showDirArrow("left");
showDirArrow("right");
