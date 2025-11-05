const unitWidget = document.getElementById("unit-widget");
const tenWidget = document.getElementById("ten-widget");
const unitNumberTab = document.querySelector("#unit-widget .number-tab");
const tenNumberTab = document.querySelector("#ten-widget .number-tab");
tenNumberTab.style.color = "transparent";
const unitSquaresContainer = document.querySelector(
  "#unit-widget .squares-container"
);
const tenSquaresContainer = document.querySelector(
  "#ten-widget .squares-container"
);
const unitInnerCard = document.querySelector("#unit-widget .inner-card");

const unitTextDisplay = document.querySelector("#unit-widget .text-display");
const tenTextDisplay = document.querySelector("#ten-widget .text-display");
tenTextDisplay.style.color = "transparent";
const plusBtn = document.getElementById("plus-btn");
const minusBtn = document.getElementById("minus-btn");
const arrowContainer = document.querySelector("#unit-widget .arrowContainer");
const leftDir = arrowContainer.querySelector(".left-dir");
const rightDir = arrowContainer.querySelector(".right-dir");
const boxContainer = document.querySelector("#box-container");

// --- State ---
let unitCount = 9,
  maxCount = 10,
  minCount = 0,
  tenCount = 0;
let isNumberTextUp = false;

function addUnits(n) {
  for (let i = 0; i < n; i++) {
    const square = document.createElement("div");
    square.style.visibility = "hidden";
    square.className = "count-square";
    unitSquaresContainer.appendChild(square);
    unitCount++;
  }
}
function renderTens(n) {
  tenNumberTab.textContent = tenCount;
  tenTextDisplay.textContent =
    numberToText[tenCount] + (tenCount === 1 ? tags.ten : tags.tens);
  const blocks = document.querySelectorAll(".unit-box");
  if (n == 0) {
    blocks.forEach((block) => {
      block.style.visibility = "hidden";
    });
  } else if (n == 2) {
    blocks.forEach((block) => {
      block.style.visibility = "visible";
    });
  } else if (n == 1) {
    Array.from(blocks)
      .slice(0, 10)
      .forEach((block) => {
        block.style.visibility = "visible";
      });
    Array.from(blocks)
      .slice(10)
      .forEach((block) => {
        block.style.visibility = "hidden";
      });
  }
}
function render() {
  unitNumberTab.textContent = unitCount < 10 ? unitCount : "X";
  unitTextDisplay.textContent =
    numberToText[unitCount] + (unitCount === 1 ? tags.one : tags.ones);
  unitSquaresContainer.innerHTML = "";
  for (let i = 0; i < unitCount; i++) {
    const square = document.createElement("div");
    square.className = "count-square";
    unitSquaresContainer.appendChild(square);
  }
}

plusBtn.addEventListener("click", () => {
  playAudio("click");
  if (unitCount < maxCount) {
    unitCount++;
    render();
    if (unitCount === maxCount) whenHits10();
    if (isNumberTextUp) {
      if (unitCount === maxCount) {
        showComment("you_expert");
        showDirArrow("left");
        plusBtn.style.pointerEvents = "none";
        minusBtn.style.pointerEvents = "none";
        plusBtn.classList.remove("pulse-highlight");
        nextButton.disabled = true;
      } else {
        showNumberText(tenCount * 10 + unitCount);
      }
    }
  }
});

minusBtn.addEventListener("click", () => {
  playAudio("click");
  if (unitCount > minCount) {
    unitCount--;
    render();
    if (isNumberTextUp) {
      showNumberText(tenCount * 10 + unitCount);
    }
    if (unitCount === maxCount - 1) reverse10();
  }
});

render();

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
  units = Array.from(units);
  const tenBar = document.querySelectorAll(".ten-bar")[tenCount];
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
function animateUnitsToTensUnnatural() {
  let units = document.querySelectorAll(".count-square");
  units = Array.from(units).slice(10);
  const tenBar = document.querySelectorAll(".ten-bar")[tenCount];
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
  let units = document.querySelectorAll(".count-square");
  const tenBar = document.querySelectorAll(".ten-bar")[tenCount];
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
function animateTensToUnitsUnnatural() {
  addUnits(10);
  let units = document.querySelectorAll(".count-square");
  units = Array.from(units).slice(10);
  const tenBar = document.querySelectorAll(".ten-bar")[tenCount];
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
  wiggle(false);
  showDirArrow(false);
  unitNumberTab.classList.remove("outlined");
  unitNumberTab.textContent = 0;
  unitTextDisplay.textContent = numberToText[0] + tags.ones;
  await animateUnitsToTens();
  unitCount -= 10;
  tenCount++;
  tenNumberTab.textContent = tenCount;
  tenNumberTab.style.color = "white";
  tenTextDisplay.textContent =
    numberToText[tenCount] + (tenCount === 1 ? tags.ten : tags.tens);
  tenTextDisplay.style.color = "white";
}

async function tensToUnitsWrapper() {
  showDirArrow(false);
  tenCount--;
  tenNumberTab.textContent = tenCount;
  tenTextDisplay.textContent =
    numberToText[tenCount] + (tenCount === 1 ? tags.ten : tags.tens);
  await animateTensToUnits();
  wiggle(true);
  unitCount += 10;
  unitNumberTab.classList.add("outlined");
  unitNumberTab.textContent = "X";
  unitTextDisplay.textContent = numberToText[unitCount] + tags.ones;
}
leftDir.onclick = onLeftDirClick1;
rightDir.onclick = onRightDirClick;
leftDir.addEventListener("click", () => {
  playAudio("click");
  // prevButton.disabled = true;
});
rightDir.addEventListener("click", () => {
  playAudio("click");
  // prevButton.disabled = true;
});
async function onLeftDirClick1() {
  await unitsToTensWrapper();
  isNumberTextUp = true;
  updateInstructions("increase");
  showComment("rod");
  plusBtn.style.pointerEvents = "auto";
  minusBtn.style.pointerEvents = "auto";
  plusBtn.classList.add("pulse-highlight");
  leftDir.onclick = onLeftDirClick2;
}
async function onLeftDirClick2() {
  await unitsToTensWrapper();
  showStatement(-1);
  setCavePose("Normal");
  showNumberText(tenCount * 10 + unitCount);
  nextButton.disabled = false;
  leftDir.onclick = onLeftDirClick3;
}
async function onLeftDirClick3() {
  showDirArrow(false);
  unitNumberTab.textContent = "X";
  unitTextDisplay.textContent = numberToText[10] + tags.ones;
  await animateUnitsToTensUnnatural();
  for (let i = 0; i < 10; i++) {
    unitSquaresContainer.lastElementChild.remove();
  }
  unitCount -= 10;
  tenCount++;
  tenNumberTab.textContent = tenCount;
  tenTextDisplay.textContent = numberToText[tenCount] + tags.ten;
  leftDir.onclick = onLeftDirClick4;
  showDirArrow("left");
  updateInstructions("one_more_click");
  setCavePose("Normal");
}
async function onLeftDirClick4() {
  await unitsToTensWrapper();
  updateInstructions("finally");
  setCavePose("Happy");
  prevButton.disabled = true;
}
async function onRightDirClick() {
  showStatement(-1);
  await tensToUnitsWrapper();
  updateInstructions("one_more_rod");
  showDirArrow("right");
  rightDir.onclick = onRightDirClick2;
}
async function onRightDirClick2() {
  showDirArrow(false);
  tenCount--;
  tenNumberTab.textContent = tenCount;
  tenTextDisplay.textContent = numberToText[tenCount] + tags.tens;
  await animateTensToUnitsUnnatural();
  showComment("twenty_ones");
  updateInstructions("next");
  unitNumberTab.classList.add("outlined");
  unitNumberTab.textContent = "X";
  unitTextDisplay.textContent = numberToText[unitCount] + tags.ones;
  nextButton.disabled = false;
}

function showDirArrow(name) {
  if (name === "left") {
    leftDir.style.display = "flex";
    rightDir.style.display = "none";
  } else if (name === "right") {
    leftDir.style.display = "none";
    rightDir.style.display = "flex";
  } else {
    leftDir.style.display = "none";
    rightDir.style.display = "none";
  }
}
