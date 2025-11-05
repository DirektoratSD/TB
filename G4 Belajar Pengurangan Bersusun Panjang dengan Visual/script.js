// Helper object to map classes back to a column index and tag name
const classToColData = {
  "hundred-visual": { index: 0, tag: "hundred" },
  "ten-visual": { index: 1, tag: "ten" },
  "unit-visual": { index: 2, tag: "unit" },
  "hundred-number": { index: 0, tag: "hundred" },
  "ten-number": { index: 1, tag: "ten" },
  "unit-number": { index: 2, tag: "unit" },
};

// --- GLOBAL STATE & CONSTANTS ---
const nextButton = document.querySelector(".next-button");
const problemStatement = document.querySelector(".problem-statement h1");
const questions = [
  { num1: 274, num2: 137 },
  { num1: 463, num2: 235 },
  { num1: 528, num2: 174 },
  { num1: 642, num2: 258 },
];
let u1,
  u2,
  t1,
  t2,
  h1,
  h2,
  u3,
  t3,
  h3,
  answer,
  u1_current,
  t1_current,
  h1_current;
let callbackAfterMcq = null;
let phase = 0,
  phaseTag = "-visual";
let filledMcqObject;
let current_number = [
    [0, 0, 0],
    [0, 0, 0],
  ],
  ans = [
    [0, 0, 0],
    [0, 0, 0],
  ],
  questionIndex = 0;

document
  .querySelectorAll(".stepper-btn")
  .forEach((button) =>
    button.addEventListener("click", () => playSound("click"))
  );

// --- UTILITY & HELPER FUNCTIONS ---
function playSound(name) {
  try {
    const file = `sound/${name}.mp3`;
    const audio = new Audio(file);
    audio.play();
  } catch (e) {
    console.error(e);
  }
}
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function updateHundredStacking(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  const children = container.children;
  const xOffset = -0.4,
    yOffset = -0.4;
  for (let i = 0; i < children.length; i++) {
    children[i].style.transform =
      i > 0
        ? `translate(${i * xOffset}vw, ${i * yOffset}vw)`
        : "translate(0, 0)";
  }
}
// Generic placeholder replacement function
function formatText(text, values) {
  if (!text) return "";
  return Object.entries(values).reduce(
    (acc, [key, value]) => acc.replace(new RegExp(`{{${key}}}`, "g"), value),
    text
  );
}

// --- BLOCK & UI MANIPULATION ---
function appendBlock(rowNum, tag) {
  const cell = document.querySelector(`.row-${rowNum} .${tag}-block`);
  if (!cell) return;
  cell.style.position = "relative";
  const element =
    rowNum === 1
      ? document.createElement("img")
      : document.createElement("div");
  if (rowNum === 1) element.src = `assets/${tag}.png`;
  else element.className = "dashed";
  if (tag === "hundred") element.style.position = "absolute";
  cell.appendChild(element);
  if (tag === "hundred") updateHundredStacking(`.row-${rowNum} .${tag}-block`);
}
function removeBlock(rowNum, tag) {
  const cell = document.querySelector(`.row-${rowNum} .${tag}-block`);
  if (cell && cell.lastElementChild) {
    cell.lastElementChild.remove();
    if (tag === "hundred")
      updateHundredStacking(`.row-${rowNum} .${tag}-block`);
  }
}
function setNumberDisplay(rowNum, tag, num) {
  const cell = document.querySelector(
    `.row-${rowNum}.${tag}-number .number-display`
  );
  if (!cell) return;
  let multiplier = tag === "hundred" ? 100 : tag === "ten" ? 10 : 1;
  cell.textContent = num * multiplier;
}
function setCornerBadge(rowNum, tag, num) {
  const cell = document.querySelector(
    `.row-${rowNum}.${tag}-visual .corner-badge`
  );
  if (!cell) return;
  cell.textContent = num;
}
function resetVisuals() {
  document
    .querySelectorAll(".hundred-block, .ten-block, .unit-block")
    .forEach((el) => {
      el.innerHTML = "";
      const overflow = el.parentNode.querySelector(
        ".unit-block-overflow, .ten-block-overflow"
      );
      if (overflow) overflow.remove();
    });
    document
    .querySelectorAll(".is-overflowing")
    .forEach((el) => {
      el.classList.remove("is-overflowing");
    });
}
function resetNumbers() {
  document
    .querySelectorAll(".corner-badge")
    .forEach((el) => (el.textContent = "0"));
  document
    .querySelectorAll(".hundred-number .number-display")
    .forEach((el) => (el.textContent = "000"));
  document
    .querySelectorAll(".ten-number .number-display")
    .forEach((el) => (el.textContent = "00"));
  document
    .querySelectorAll(".unit-number .number-display")
    .forEach((el) => (el.textContent = "0"));
  document
    .querySelectorAll(".row-3 .number-display, .row-3 .corner-badge")
    .forEach((el) => (el.textContent = ""));
}

// --- ANIMATION FUNCTIONS ---
function createClone(sourceElement) {
  const clone = sourceElement.cloneNode(true);
  clone.id = "";
  const sourceRect = sourceElement.getBoundingClientRect();
  Object.assign(clone.style, {
    position: "absolute",
    margin: "0",
    boxSizing: "border-box",
    zIndex: "50",
    width: `${sourceRect.width}px`,
    height: `${sourceRect.height}px`,
    top: `${sourceRect.top + window.scrollY}px`,
    left: `${sourceRect.left + window.scrollX}px`,
    transition: `all 800ms ease-in-out`,
  });
  document.body.appendChild(clone);
  return clone;
}
function animateClone(clone, targetRect, onComplete) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      Object.assign(clone.style, {
        top: `${targetRect.top + window.scrollY}px`,
        left: `${targetRect.left + window.scrollX}px`,
        width: `${targetRect.width}px`,
        height: `${targetRect.height}px`,
        opacity: "0.5",
      });
    });
  });
  clone.addEventListener(
    "transitionend",
    () => {
      if (clone.parentNode) clone.parentNode.removeChild(clone);
      onComplete?.();
    },
    { once: true }
  );
}
function promiseWrapper(func, sourceEl, targetEl, onStart, onEnd) {
  return new Promise((resolve) => {
    func(sourceEl, targetEl, onStart, () => {
      onEnd?.();
      resolve();
    });
  });
}
function animateCloneToTarget(
  sourceElement,
  targetElement,
  onStart,
  onComplete
) {
  const targetRect = targetElement.getBoundingClientRect();
  const clone = createClone(sourceElement);
  clone.style.transitionDuration = "500ms";
  onStart?.();
  animateClone(clone, targetRect, onComplete);
}

// --- WORKFLOW & LOGIC ---
function initializeBoard() {
  // Remove completion view class if it exists
  document
    .getElementById("overlayStatement")
    .classList.remove("completion-view");

  phase = questionIndex >= 2 ? 1 : 0;
  phaseTag = phase === 1 ? "-number" : "-visual";
  const problem = questions[questionIndex];
  [h1, t1, u1] = String(problem.num1).padStart(3, "0").split("").map(Number);
  [h2, t2, u2] = String(problem.num2).padStart(3, "0").split("").map(Number);
  answer = problem.num1 - problem.num2;
  [h3, t3, u3] = String(answer).padStart(3, "0").split("").map(Number);
  h1_current = h1;
  t1_current = t1;
  u1_current = u1;
  initializeTextContents();
  current_number = [
    [0, 0, 0],
    [0, 0, 0],
  ];
  ans = [
    [h1, t1, u1],
    [h2, t2, u2],
  ];
  const didUnitBorrow = u1 < u2;
  const t1_after_unit_lend = didUnitBorrow ? t1 - 1 : t1;

  // Create values for placeholder replacement
  const placeholderValues = {
    num1: problem.num1,
    num2: problem.num2,
    answer: answer,
    u1,
    u2,
    t1,
    t2,
    h1,
    h2,
    u3,
    t3,
    h3,
    u1_current,
    t1_current,
    h1_current,
    u1_after_borrow: u1 + 10,
    t1_after_borrow_u: t1 - 1,
    t1_after_borrow_h: t1_after_unit_lend + 10,
    h1_val: h1 * 100,
    h2_val: h2 * 100,
    h3_val: h3 * 100,
    t1_val: t1 * 10,
    t2_val: t2 * 10,
    t3_val: t3 * 10,
    u1_val: u1,
    u2_val: u2,
    u3_val: u3,
  };

  const stringifiedMcq = JSON.stringify(mcqObject);
  filledMcqObject = JSON.parse(formatText(stringifiedMcq, placeholderValues));

  resetVisuals();
  resetNumbers();
  document
    .querySelectorAll(".row-2 .grid-item-content, .row-2 .stepper")
    .forEach((el) => el.classList.add("row-hidden"));
  setupForRow1();
}

function handleNext() {
  playSound("click");
  questionIndex++;
  if (questionIndex >= questions.length) {
    showCompletionOverlay();
    return;
  }
  initializeBoard();
}

function handleStepperClick(event) {
  document
    .querySelectorAll(".glowing-stepper")
    .forEach((el) => el.classList.remove("glowing-stepper"));
  const button = event.target.closest(".stepper-btn");
  if (!button) return;
  const gridItem = button.closest(".grid-item");
  let rowNum, colData;
  gridItem.classList.forEach((cls) => {
    if (cls.startsWith("row-")) {
      rowNum = parseInt(cls.split("-")[1]);
    }
    if (classToColData[cls]) {
      colData = classToColData[cls];
    }
  });
  if (!rowNum || !colData) return;
  const rowIndex = rowNum - 1;
  const colIndex = colData.index;
  const tag = colData.tag;
  let currentValue = current_number[rowIndex][colIndex];
  const operation = button.classList.contains("plus") ? 1 : -1;
  const newValue = currentValue + operation;
  if (newValue >= 0 && newValue <= 9) {
    if (operation > 0) appendBlock(rowNum, tag);
    else removeBlock(rowNum, tag);
    current_number[rowIndex][colIndex] = newValue;
    setNumberDisplay(rowNum, tag, newValue);
    setCornerBadge(rowNum, tag, newValue);
  }
}

function set1() {
  if (checkRow(1)) {
    setHighlightColor("green");
    setCornerBadge(1, "hundred", h1);
    setCornerBadge(1, "ten", t1);
    setCornerBadge(1, "unit", u1);
    hideAllSteppers();
    nextButton.disabled = true;
    // Auto-progress to next step
    setTimeout(() => {
      promptForSecondNumber();
    }, 1200);
  }
}
function promptForSecondNumber() {
  const instructionImgSrc =
    phase === 0 ? texts.images.set_num_2 : texts.images.set_num_2_phase2;
  showOverlayStatement(
    texts.instructions.set1_correct,
    texts.images.char_excited,
    instructionImgSrc,
    setupForRow2
  );
}
function set2() {
  if (checkRow(2)) {
    setHighlightColor("green");
    setCornerBadge(2, "hundred", h2);
    setCornerBadge(2, "ten", t2);
    setCornerBadge(2, "unit", u2);
    hideAllSteppers();
    nextButton.disabled = true;
    // Auto-progress to next step
    setTimeout(() => {
      if (phase === 1) {
        setupPhase2AndStartMCQ();
      } else {
        loadMcqIn(0, startPhase1Subtraction);
      }
    }, 1200);
  }
}

function startPhase1Subtraction() {
  setHighlightColor("purple");
  highlightColumnBorder("unit");
  textHighlightColumn(2);
  nextButton.disabled = false;
  if (u1_current < u2) {
    updateInstructionText("borrow_tens_needed", {
      u2: u2,
      u1_current: u1_current,
    });
    setNextButtonText("check_answer");
    nextButton.onclick = () => loadMcqIn(3, prepareToBorrowFromTens);
  } else {
    updateInstructionText("units1");
    setNextButtonText("take_away_ones");
    nextButton.onclick = () => takeAwayUnits(true);
  }
}
function prepareToBorrowFromTens() {
  updateInstructionText("borrow_tens_needed", {
    u2: u2,
    u1_current: u1_current,
  });
  setNextButtonText("borrow_from_ten");
  nextButton.onclick = () => borrowFromTens(true);
  nextButton.disabled = false;
}

async function borrowFromTens(isPhase1) {
  nextButton.disabled = true;
  const tenBlockContainer = document.querySelector(".row-1 .ten-block");
  const lastTenBlock = Array.from(tenBlockContainer.children).find(
    (c) => c.tagName === "IMG"
  );
  if (!lastTenBlock) return;
  const clone = createClone(lastTenBlock);
  const unitContainer = document.querySelector(".row-1 .unit-block");
  const targetRect = unitContainer.getBoundingClientRect();
  lastTenBlock.remove();
  t1_current--;
  u1_current += 10;
  setCornerBadge(1, "ten", t1_current);
  setNumberDisplay(1, "ten", t1_current);
  await new Promise((resolve) => {
    animateClone(clone, targetRect, async () => {
      for (let i = 0; i < 10; i++) {
        appendBlock(1, "unit");
        playSound("click");
        await wait(30);
      }
      const allUnits = Array.from(unitContainer.children);
      const overflowUnits = allUnits.slice(10);
      const oldOverflow = unitContainer.parentNode.querySelector(
        ".unit-block-overflow"
      );
      if (oldOverflow) oldOverflow.remove();
      if (overflowUnits.length > 0) {
        const overflowContainer = document.createElement("div");
        Object.assign(overflowContainer, {
          className: "unit-block extra",
        });
        Object.assign(overflowContainer.style, {
          position: "absolute",
          transform: "translate(0vw, 0vw)",
          zIndex: "0",
        });
        unitContainer.classList.add("unit-block-overflow", "is-overflowing");
        overflowUnits.forEach((unit) => overflowContainer.appendChild(unit));
        unitContainer.parentNode.appendChild(overflowContainer);
      }
      setCornerBadge(1, "unit", u1_current);
      setNumberDisplay(1, "unit", u1_current);
      resolve();
    });
  });
  if (isPhase1) {
    updateInstructionText("units1");
    setNextButtonText("take_away_ones");
    nextButton.onclick = () => takeAwayUnits(true);
    nextButton.disabled = false;
  }
}

async function takeAwayUnits(isPhase1) {
  nextButton.disabled = true;
  updateInstructionText("units1");
  const sourceCubes = Array.from(
    document.querySelectorAll(
      ".row-1 .unit-block img, .row-1 .unit-block-overflow img"
    )
  );
  const targetPlaceholders = Array.from(
    document.querySelectorAll(".row-2 .unit-block .dashed")
  );
  for (let i = 0; i < u2; i++) {
    const source = sourceCubes[i];
    const target = targetPlaceholders[i];
    if (!source || !target) continue;
    await promiseWrapper(
      animateCloneToTarget,
      source,
      target,
      () => source.classList.add("transparent"),
      () => {
        const newImg = document.createElement("img");
        newImg.src = "assets/unit.png";
        target.replaceWith(newImg);
      }
    );
    playSound("swoosh");
    await wait(100);
  }
  if (isPhase1) {
    updateInstructionText("collect_ones");
    setNextButtonText("collect_ones");
    nextButton.disabled = false;
    nextButton.onclick = () => collectRemainingUnits(true);
  }
}

async function collectRemainingUnits(isPhase1) {
  nextButton.disabled = true;
  const remainingCubes = document.querySelectorAll(
    ".row-1 .unit-block img:not(.transparent), .row-1 .unit-block-overflow img:not(.transparent)"
  );
  if (!isPhase1) {
    popInNumber("unit", u3);
  }
  const resultContainer = document.querySelector(".row-3 .unit-block");
  for (const cube of remainingCubes) {
    const placeholder = document.createElement("div");
    placeholder.style.cssText = `width: ${cube.offsetWidth}px; height: ${cube.offsetHeight}px; visibility: hidden;`;
    resultContainer.appendChild(placeholder);
    await promiseWrapper(
      animateCloneToTarget,
      cube,
      placeholder,
      () => cube.classList.add("transparent"),
      () => {
        const newImg = document.createElement("img");
        newImg.src = "assets/unit.png";
        newImg.classList.add("appear");
        placeholder.replaceWith(newImg);
      }
    );
    playSound("swoosh");
  }
  const overflowUnitContainer = document.querySelector(
    ".row-1 .unit-block-overflow"
  );
  if (overflowUnitContainer)
    overflowUnitContainer.classList.remove("unit-block-overflow");
  if (isPhase1) {
    popInNumber("unit", u3);
  }
  setHighlightColor("green");
  await wait(500);
  updateInstructionText("click_next");
  if (isPhase1) {
    setNextButtonText("check_answer");
    nextButton.disabled = false;
    nextButton.onclick = () => loadMcqIn(1, processTens);
  }
}

function processTens() {
  setHighlightColor("purple");
  highlightColumnBorder("ten");
  textHighlightColumn(1);
  nextButton.disabled = false;
  if (t1_current < t2) {
    updateInstructionText("borrow_hundreds_needed", {
      t2: t2,
      t1_current: t1_current,
    });
    setNextButtonText("check_answer");
    nextButton.onclick = () => loadMcqIn(4, prepareToBorrowFromHundreds);
  } else {
    updateInstructionText("tens1");
    setNextButtonText("take_away_tens");
    nextButton.onclick = () => takeAwayTens(true);
  }
}
function prepareToBorrowFromHundreds() {
  updateInstructionText("borrow_hundreds_needed", {
    t2: t2,
    t1_current: t1_current,
  });
  setNextButtonText("borrow_from_hundred");
  nextButton.onclick = () => borrowFromHundreds(true);
  nextButton.disabled = false;
}
async function borrowFromHundreds(isPhase1) {
  nextButton.disabled = true;
  const hundredContainer = document.querySelector(".row-1 .hundred-block");
  const lastHundredBlock = hundredContainer.lastElementChild;
  if (!lastHundredBlock || lastHundredBlock.tagName !== "IMG") return;
  const clone = createClone(lastHundredBlock);
  const tenContainer = document.querySelector(".row-1 .ten-block");
  const targetRect = tenContainer.getBoundingClientRect();
  lastHundredBlock.remove();
  updateHundredStacking(".row-1 .hundred-block");
  h1_current--;
  t1_current += 10;
  setCornerBadge(1, "hundred", h1_current);
  setNumberDisplay(1, "hundred", h1_current);

  const tenPlaceholder = tenContainer.parentNode;
  tenPlaceholder.classList.add("wiggle");
  setTimeout(() => tenPlaceholder.classList.remove("wiggle"), 600);

  await new Promise((resolve) => {
    animateClone(clone, targetRect, async () => {
      for (let i = 0; i < 10; i++) {
        appendBlock(1, "ten");
        playSound("click");
        await wait(30);
      }
      const allTens = Array.from(tenContainer.children);
      const overflowTens = allTens.slice(9);
      const oldOverflow = tenContainer.parentNode.querySelector(
        ".ten-block-overflow"
      );
      if (oldOverflow) oldOverflow.remove();
      if (overflowTens.length > 0) {
        const overflowContainer = document.createElement("div");
        Object.assign(overflowContainer, {
          className: "ten-block extra",
        });
        Object.assign(overflowContainer.style, {
          position: "absolute",
          transform: "translate(0vw, 0vw)",
          zIndex: "0",
        });
        tenContainer.classList.add("ten-block-overflow", "is-overflowing");
        overflowTens.forEach((ten) => overflowContainer.appendChild(ten));
        tenContainer.parentNode.appendChild(overflowContainer);
      }
      setCornerBadge(1, "ten", t1_current);
      setNumberDisplay(1, "ten", t1_current);
      resolve();
    });
  });
  if (isPhase1) {
    updateInstructionText("tens1");
    setNextButtonText("take_away_tens");
    nextButton.onclick = () => takeAwayTens(true);
    nextButton.disabled = false;
  }
}

async function takeAwayTens(isPhase1) {
  nextButton.disabled = true;
  updateInstructionText("tens1");
  const sourceRods = Array.from(
    document.querySelectorAll(
      ".row-1 .ten-block img, .row-1 .ten-block-overflow img"
    )
  );
  const targetPlaceholders = Array.from(
    document.querySelectorAll(".row-2 .ten-block .dashed")
  );
  for (let i = 0; i < t2; i++) {
    const source = sourceRods[i];
    const target = targetPlaceholders[i];
    if (!source || !target) continue;
    await promiseWrapper(
      animateCloneToTarget,
      source,
      target,
      () => source.classList.add("transparent"),
      () => {
        const newImg = document.createElement("img");
        newImg.src = "assets/ten.png";
        target.replaceWith(newImg);
      }
    );
    playSound("swoosh");
    await wait(100);
  }
  if (isPhase1) {
    updateInstructionText("collect_tens");
    setNextButtonText("collect_tens");
    nextButton.disabled = false;
    nextButton.onclick = () => collectRemainingTens(true);
  }
}

async function collectRemainingTens(isPhase1) {
  nextButton.disabled = true;
  if (!isPhase1) {
    popInNumber("ten", t3);
  }
  const remainingRods = document.querySelectorAll(
    ".row-1 .ten-block img:not(.transparent), .row-1 .ten-block-overflow img:not(.transparent)"
  );
  const resultContainer = document.querySelector(".row-3 .ten-block");
  for (const rod of remainingRods) {
    const placeholder = document.createElement("div");
    placeholder.style.cssText = `width: ${rod.offsetWidth}px; height: ${rod.offsetHeight}px; visibility: hidden;`;
    resultContainer.appendChild(placeholder);
    await promiseWrapper(
      animateCloneToTarget,
      rod,
      placeholder,
      () => rod.classList.add("transparent"),
      () => {
        const newImg = document.createElement("img");
        newImg.src = "assets/ten.png";
        newImg.classList.add("appear");
        placeholder.replaceWith(newImg);
      }
    );
    playSound("swoosh");
  }
  const overflowTenContainer = document.querySelector(
    ".row-1 .ten-block-overflow"
  );
  if (overflowTenContainer)
    overflowTenContainer.classList.remove("ten-block-overflow");
  if (isPhase1) {
    popInNumber("ten", t3);
  }
  setHighlightColor("green");
  updateInstructionText("click_next");
  await wait(500);
  if (isPhase1) {
    setNextButtonText("check_answer");
    nextButton.disabled = false;
    nextButton.onclick = () => loadMcqIn(2, processHundreds);
  }
}

function processHundreds() {
  setHighlightColor("purple");
  highlightColumnBorder("hundred");
  textHighlightColumn(0);
  updateInstructionText("hundreds1");
  setNextButtonText("take_away_hundreds");
  nextButton.disabled = false;
  nextButton.onclick = () => takeAwayHundreds(true);
}

async function takeAwayHundreds(isPhase1) {
  nextButton.disabled = true;
  updateInstructionText("hundreds1");
  const sourceFlats = Array.from(
    document.querySelectorAll(".row-1 .hundred-block img")
  );
  const targetPlaceholders = Array.from(
    document.querySelectorAll(".row-2 .hundred-block .dashed")
  );
  for (let i = 0; i < h2; i++) {
    const source = sourceFlats[i];
    const target = targetPlaceholders[i];
    if (!source || !target) continue;
    await promiseWrapper(
      animateCloneToTarget,
      source,
      target,
      () => source.classList.add("transparent"),
      () => {
        const newImg = document.createElement("img");
        newImg.src = "assets/hundred.png";
        newImg.style.position = "absolute";
        target.replaceWith(newImg);
        updateHundredStacking(".row-2 .hundred-block");
      }
    );
    playSound("swoosh");
    await wait(100);
  }
  if (isPhase1) {
    updateInstructionText("collect_hundreds");
    setNextButtonText("collect_hundreds");
    nextButton.disabled = false;
    nextButton.onclick = () => collectRemainingHundreds(true);
  }
}

async function collectRemainingHundreds(isPhase1) {
  nextButton.disabled = true;
  if (!isPhase1) {
    popInNumber("hundred", h3);
  }
  const remainingFlats = document.querySelectorAll(
    ".row-1 .hundred-block img:not(.transparent)"
  );
  const resultContainer = document.querySelector(".row-3 .hundred-block");
  resultContainer.style.position = "relative";
  for (const flat of remainingFlats) {
    const placeholder = document.createElement("div");
    placeholder.style.cssText = `width: ${flat.offsetWidth}px; height: ${flat.offsetHeight}px; visibility: hidden; position: absolute;`;
    resultContainer.appendChild(placeholder);
    await promiseWrapper(
      animateCloneToTarget,
      flat,
      placeholder,
      () => flat.classList.add("transparent"),
      () => {
        const newImg = document.createElement("img");
        newImg.src = "assets/hundred.png";
        newImg.classList.add("appear");
        newImg.style.position = "absolute";
        placeholder.replaceWith(newImg);
        updateHundredStacking(".row-3 .hundred-block");
      }
    );
    playSound("swoosh");
  }
  if (isPhase1) {
    popInNumber("hundred", h3);
  }
  await wait(500);
  unhighlightColumn();
  highlightRow(3);
  setHighlightColor("green");
  showResult();
  nextButton.onclick = handleNext;
  setNextButtonText("next");
  updateInstructionText("click_next");
  nextButton.disabled = false;
  confettiBurst();
  playSound("confetti");
}

function setupPhase2AndStartMCQ() {
  resetVisuals();
  for (let row = 1; row <= 2; row++) {
    for (let col = 0; col < 3; col++) {
      const tag = col === 0 ? "hundred" : col === 1 ? "ten" : "unit";
      const count = ans[row - 1][col];
      for (let i = 0; i < count; i++) {
        appendBlock(row, tag);
      }
    }
  }
  processPhase2Units();
}

function processPhase2Units() {
  setHighlightColor("purple");
  highlightColumnBorder("unit");
  textHighlightColumn(2);
  nextButton.disabled = false;

  if (u1_current < u2) {
    updateInstructionText("borrow_tens_needed", {
      u2: u2,
      u1_current: u1_current,
    });
    setNextButtonText("check_answer");
    nextButton.onclick = () => loadMcqIn(3, prepareToBorrowFromTensPhase2);
  } else {
    updateInstructionText("units1");
    setNextButtonText("take_away_ones");
    nextButton.onclick = takeAwayUnitsPhase2;
  }
}

function prepareToBorrowFromTensPhase2() {
  updateInstructionText("borrow_tens_needed", {
    u2: u2,
    u1_current: u1_current,
  });
  setNextButtonText("borrow_from_ten");
  nextButton.onclick = () => borrowFromTensPhase2();
  nextButton.disabled = false;
}

async function borrowFromTensPhase2() {
  nextButton.disabled = true;
  await borrowFromTens(false);
  updateInstructionText("units1");
  setNextButtonText("take_away_ones");
  nextButton.disabled = false;
  nextButton.onclick = takeAwayUnitsPhase2;
}

async function takeAwayUnitsPhase2() {
  nextButton.disabled = true;
  await takeAwayUnits(false);
  loadMcqIn(8, collectRemainingUnitsPhase2);
}

async function collectRemainingUnitsPhase2() {
  nextButton.disabled = true;
  updateInstructionText("collect_ones");
  await collectRemainingUnits(false);
  setHighlightColor("green");
  await wait(500);
  processPhase2Tens();
}

function processPhase2Tens() {
  setHighlightColor("purple");
  highlightColumnBorder("ten");
  textHighlightColumn(1);
  nextButton.disabled = false;
  if (t1_current < t2) {
    updateInstructionText("borrow_hundreds_needed", {
      t2: t2,
      t1_current: t1_current,
    });
    setNextButtonText("check_answer");
    nextButton.onclick = () => loadMcqIn(4, prepareToBorrowFromHundredsPhase2);
  } else {
    updateInstructionText("tens1");
    setNextButtonText("take_away_tens");
    nextButton.onclick = takeAwayTensPhase2;
  }
}

function prepareToBorrowFromHundredsPhase2() {
  updateInstructionText("borrow_hundreds_needed", {
    t2: t2,
    t1_current: t1_current,
  });
  setNextButtonText("borrow_from_hundred");
  nextButton.onclick = () => borrowFromHundredsPhase2();
  nextButton.disabled = false;
}

async function borrowFromHundredsPhase2() {
  nextButton.disabled = true;
  await borrowFromHundreds(false);
  updateInstructionText("tens1");
  setNextButtonText("take_away_tens");
  nextButton.disabled = false;
  nextButton.onclick = takeAwayTensPhase2;
}

async function takeAwayTensPhase2() {
  nextButton.disabled = true;
  await takeAwayTens(false);
  loadMcqIn(9, collectRemainingTensPhase2);
}

async function collectRemainingTensPhase2() {
  nextButton.disabled = true;
  updateInstructionText("collect_tens");
  await collectRemainingTens(false);
  setHighlightColor("green");
  await wait(500);
  processPhase2Hundreds();
}

function processPhase2Hundreds() {
  setHighlightColor("purple");
  highlightColumnBorder("hundred");
  textHighlightColumn(0);
  updateInstructionText("hundreds1");
  setNextButtonText("take_away_hundreds");
  nextButton.disabled = false;
  nextButton.onclick = takeAwayHundredsPhase2;
}

async function takeAwayHundredsPhase2() {
  nextButton.disabled = true;
  await takeAwayHundreds(false);
  loadMcqIn(10, collectRemainingHundreds);
}

// --- UI & OTHER HELPERS ---
function checkRow(rowNum) {
  const userRow = current_number[rowNum - 1];
  const correctRow = ans[rowNum - 1];
  let isCorrect = true;
  for (let i = 0; i < 3; i++) {
    if (userRow[i] !== correctRow[i]) {
      isCorrect = false;
      const tag = i === 0 ? "hundred" : i === 1 ? "ten" : "unit";
      const selector =
        phase === 1
          ? `.row-${rowNum}.${tag}-number`
          : `.row-${rowNum}.${tag}-visual .block-placeholder`;
      const wrongElement = document.querySelector(selector);
      if (wrongElement) {
        wrongElement.classList.add("wiggle");
        setTimeout(() => wrongElement.classList.remove("wiggle"), 600);
      }
    }
  }
  playSound(isCorrect ? "correct" : "wrong");
  return isCorrect;
}

function popInNumber(tag, num) {
  const cell = document.querySelector(`.row-3.${tag}-number .number-display`);
  if (cell) {
    const keyframes = [
      { transform: "scale(0)", opacity: 0 },
      { transform: "scale(1.2)", opacity: 1, offset: 0.8 },
      { transform: "scale(1)", opacity: 1 },
    ];
    const timing = { duration: 400, easing: "ease-out" };
    cell.animate(keyframes, timing);
  }
  setNumberDisplay(3, tag, num);
  setCornerBadge(3, tag, num);
}

function updateInstructionText(key, values = {}) {
  const text = formatText(texts.instructions[key], values);
  document.querySelector(".instruction-text").textContent = text;
}

function initializeTextContents() {
  const visHeadings = document.querySelectorAll(
    ".visual-container .grid-heading"
  );
  visHeadings[0].textContent = texts.headings.hundreds;
  visHeadings[1].textContent = texts.headings.tens;
  visHeadings[2].textContent = texts.headings.ones;
  const numHeadings = document.querySelectorAll(
    ".number-container .grid-heading"
  );
  numHeadings[0].textContent = texts.headings.H;
  numHeadings[1].textContent = texts.headings.T;
  numHeadings[2].textContent = texts.headings.O;
  problemStatement.innerHTML = `<span>${h1}</span><span>${t1}</span><span>${u1}</span><span> - </span><span class="num2-span">${h2}</span><span class="num2-span">${t2}</span><span class="num2-span">${u2}</span><span class="hidden" id="answerInHeading"> = <span>${h3}</span><span>${t3}</span><span>${u3}</span></span>`;
}
function hideAllSteppers() {
  document
    .querySelectorAll(".stepper")
    .forEach((s) => (s.style.visibility = "hidden"));
}
function highlightRow(rowNum) {
  const containerSelector =
    phase === 0 ? ".visual-container" : ".number-container";

  const elements = document.querySelectorAll(
    `${containerSelector} .grid-item.row-${rowNum}`
  );
  if (elements.length === 0) return;

  const box = document.getElementById("highlight-box");
  box.style.display = "block";
  const firstRect = elements[0].getBoundingClientRect();
  const lastRect = elements[elements.length - 1].getBoundingClientRect();

  Object.assign(box.style, {
    left: `${firstRect.left - 4}px`,
    top: `${firstRect.top - 4}px`,
    width: `${lastRect.right - firstRect.left + 8}px`,
    height: `${lastRect.bottom - firstRect.top + 8}px`,
  });
}
function highlightColumnBorder(tag) {
  const className = `${tag}${phaseTag}`;
  const elements = document.querySelectorAll(`.${className}`);
  if (elements.length === 0) return;
  const box = document.getElementById("highlight-box");
  box.style.display = "block";
  const firstRect = elements[0].getBoundingClientRect();
  const lastRect = elements[elements.length - 1].getBoundingClientRect();
  Object.assign(box.style, {
    left: `${firstRect.left - 4}px`,
    top: `${firstRect.top - 4}px`,
    width: `${firstRect.width + 8}px`,
    height: `${lastRect.bottom - firstRect.top + 8}px`,
  });
}
function setHighlightColor(color) {
  const box = document.getElementById("highlight-box");
  box.classList.toggle("green-highlight", color === "green");
}
function unhighlightColumn() {
  document.getElementById("highlight-box").style.display = "none";
  textHighlightColumn(-1);
}
function colorizeProblemStatement() {
  const spans = problemStatement.querySelectorAll("h1 > span");
  const colors = ["orange", "blue", "pink"];
  spans.forEach((s) => s.classList.remove(...colors));
  spans[0].classList.add(colors[0]);
  spans[1].classList.add(colors[1]);
  spans[2].classList.add(colors[2]);
  spans[4].classList.add(colors[0]);
  spans[5].classList.add(colors[1]);
  spans[6].classList.add(colors[2]);
  if (
    !document.getElementById("answerInHeading").classList.contains("hidden")
  ) {
    const resultSpans = document
      .getElementById("answerInHeading")
      .querySelectorAll("span");
    resultSpans[0].classList.add(colors[0]);
    resultSpans[1].classList.add(colors[1]);
    resultSpans[2].classList.add(colors[2]);
  }
}
function textHighlightColumn(colNo) {
  colorizeProblemStatement();
  const spans = problemStatement.querySelectorAll("h1 > span");
  if (colNo < 0) {
    spans.forEach((s) => s.classList.remove("text-transparent"));
    return;
  }
  spans.forEach((s) => s.classList.add("text-transparent"));
  spans[colNo].classList.remove("text-transparent");
  spans[3].classList.remove("text-transparent"); // Keep minus sign visible
  spans[4 + colNo].classList.remove("text-transparent");
}
function textHighlightRow(rowNo) {
  colorizeProblemStatement();
  const spans = problemStatement.querySelectorAll("h1 > span");
  if (rowNo === 0) {
    spans[0].classList.remove("text-transparent");
    spans[1].classList.remove("text-transparent");
    spans[2].classList.remove("text-transparent");
    spans[4].classList.add("text-transparent");
    spans[5].classList.add("text-transparent");
    spans[6].classList.add("text-transparent");
    document
      .querySelectorAll(".row-2")
      .forEach((el) => el.classList.add("row-dimmed"));
    document
      .querySelectorAll(".row-1")
      .forEach((el) => el.classList.remove("row-dimmed"));
  } else if (rowNo === 1) {
    spans[0].classList.add("text-transparent");
    spans[1].classList.add("text-transparent");
    spans[2].classList.add("text-transparent");
    spans[4].classList.remove("text-transparent");
    spans[5].classList.remove("text-transparent");
    spans[6].classList.remove("text-transparent");
    document
      .querySelectorAll(".row-1")
      .forEach((el) => el.classList.add("row-dimmed"));
    document
      .querySelectorAll(".row-2")
      .forEach((el) => el.classList.remove("row-dimmed"));
  }
  spans[3].classList.remove("text-transparent");
}

function showOverlayStatement(text, charSrc, instructionImgSrc, callback) {
  const overlay = document.getElementById("fullscreenOverlay");
  const statementDiv = document.getElementById("overlayStatement");
  const mcq = document.getElementById("mcq");
  const charImg = document.getElementById("overlayCharacter");
  const textP = document.getElementById("overlayText");
  const instructionImg = document.getElementById("overlayInstructionImage");
  const okayBtn = document.getElementById("overlayOkayBtn");
  const startOverBtn = document.getElementById("startOverBtn");

  // Ensure correct buttons are shown/hidden
  okayBtn.classList.remove("hidden");
  startOverBtn.classList.add("hidden");
  charImg.style.display = "block";
  textP.style.display = "block";

  textP.textContent = text;
  charImg.src = charSrc || texts.images.char_normal;
  if (instructionImgSrc) {
    instructionImg.src = instructionImgSrc;
    instructionImg.style.display = "block";
  } else {
    instructionImg.style.display = "none";
  }
  mcq.style.display = "none";
  statementDiv.style.display = "flex";
  overlay.classList.add("show");

  // Set the Okay button text from the translation object
  okayBtn.textContent = texts.buttons.okay;

  const closeHandler = async () => {
    overlay.classList.remove("show");
    await wait(400);
    if (callback) callback();
    okayBtn.removeEventListener("click", closeHandler);
  };
  okayBtn.addEventListener("click", closeHandler);
}

function showCompletionOverlay() {
  const overlay = document.getElementById("fullscreenOverlay");
  const statementDiv = document.getElementById("overlayStatement");
  const mcq = document.getElementById("mcq");
  const charImg = document.getElementById("overlayCharacter");
  const textP = document.getElementById("overlayText");
  const instructionImg = document.getElementById("overlayInstructionImage");
  const okayBtn = document.getElementById("overlayOkayBtn");
  const startOverBtn = document.getElementById("startOverBtn");

  // Add a class for specific styling
  statementDiv.classList.add("completion-view");

  // Configure for completion screen
  okayBtn.classList.add("hidden");
  startOverBtn.classList.remove("hidden");
  instructionImg.style.display = "none";
  charImg.src = texts.images.char_excited;

  // Hide the character's text bubble for the final screen
  textP.style.display = "none";

  // The text and button are now in the right-side panel
  const rightPanel = document.querySelector(
    ".completion-view .overlay-image-panel"
  );
  rightPanel.innerHTML = `
        <p style="font-size: 2.8vw; font-weight: bold;">${texts.instructions.activity_complete}</p>
        <p style="font-size: 1.5vw;">${texts.instructions.start_over_prompt}</p>
        <button id="startOverBtn" class="btn btn-primary">${texts.buttons.start_over}</button>
    `;

  mcq.style.display = "none";
  statementDiv.style.display = "flex";
  overlay.classList.add("show");

  // Add event listener to the new button
  document.getElementById("startOverBtn").onclick = () => {
    window.location.reload();
  };
}

function setupForRow1() {
  updateInstructionText("set1");
  hideAllSteppers();
  unhighlightColumn();
  const containerSelector =
    phase === 0 ? ".visual-container" : ".number-container";
  const steppersToShow = document.querySelectorAll(
    `${containerSelector} .row-1 .stepper`
  );
  steppersToShow.forEach((s) => (s.style.visibility = "visible"));
  setNextButtonText("set1");
  nextButton.disabled = false;
  nextButton.onclick = set1;
  const instructionImgSrc =
    phase === 0 ? texts.images.set_num_1 : texts.images.set_num_1_phase2;
  showOverlayStatement(
    texts.instructions.set1,
    texts.images.char_normal,
    instructionImgSrc,
    async () => {
      await wait(200);
      highlightRow(1);
      setHighlightColor("purple");
      steppersToShow.forEach((s) => s.classList.add("glowing-stepper"));
      textHighlightRow(0);
    }
  );
}
function setupForRow2() {
  document
    .querySelectorAll(".row-2 .grid-item-content, .row-2 .stepper")
    .forEach((el) => el.classList.remove("row-hidden"));
  updateInstructionText("set2");
  hideAllSteppers();
  const containerSelector =
    phase === 0 ? ".visual-container" : ".number-container";
  const steppersToShow = document.querySelectorAll(
    `${containerSelector} .row-2 .stepper`
  );
  steppersToShow.forEach((s) => (s.style.visibility = "visible"));
  setNextButtonText("set2");
  nextButton.disabled = false;
  nextButton.onclick = set2;
  highlightRow(2);
  setHighlightColor("purple");
  textHighlightRow(1);
}

function setNextButtonText(tag) {
  nextButton.textContent = texts.buttons[tag];
}
function showResult() {
  document.getElementById("answerInHeading").classList.remove("hidden");
  colorizeProblemStatement();
  unhighlightColumn();
  textHighlightRow(-1); // Make all numbers solid
  highlightRow(3);
  setHighlightColor("green");
  updateInstructionText("result", {
    num1: h1 * 100 + t1 * 10 + u1,
    num2: h2 * 100 + t2 * 10 + u2,
    answer: answer,
  });
}
function toggleFullScreenOverlay(show) {
  const overlay = document.querySelector("#fullscreenOverlay");
  const mcq = document.querySelector("#mcq");
  const statement = document.getElementById("overlayStatement");
  if (show) {
    overlay.classList.add("show");
    mcq.style.display = "block";
    statement.style.display = "none";
  } else {
    overlay.classList.remove("show");
  }
}
async function loadMcqIn(mcqNo, callback) {
  await wait(200);
  toggleFullScreenOverlay(true);
  loadMcq(mcqNo);
  callbackAfterMcq = callback;
}
function generateMcqOptions(correctAnswer, multiplier = 1) {
  const correctValue = correctAnswer * multiplier;
  let options = new Set([correctValue]);
  let attempts = 0;

  while (options.size < 3 && attempts < 50) {
    let randomDigit = Math.floor(Math.random() * 10);
    let randomValue = randomDigit * multiplier;

    options.add(randomValue);
    attempts++;
  }
  while (options.size < 3) {
    let fallbackValue = (correctAnswer + options.size) * multiplier;
    if (options.has(fallbackValue)) {
      fallbackValue = Math.abs(correctAnswer - options.size) * multiplier;
    }
    options.add(fallbackValue);
  }

  return Array.from(options).sort(() => Math.random() - 0.5);
}

function loadMcq(index) {
  let q = { ...filledMcqObject.questions[index] };
  filledMcqObject.currentQuestionIndex = index;

  if (q.dynamic) {
    let correctAnswer;
    let multiplier = 1;
    const placeholderValues = {
      u1_current,
      u2,
      t1_current,
      t2,
      h1_current,
      h2,
      t1_current_val: t1_current * 10,
      t2_val: t2 * 10,
      h1_current_val: h1_current * 100,
      h2_val: h2 * 100,
    };

    switch (q.answerKey) {
      case "u3":
        correctAnswer = u3;
        multiplier = 1;
        break;
      case "t3":
        correctAnswer = t3;
        multiplier = 10;
        break;
      case "h3":
        correctAnswer = h3;
        multiplier = 100;
        break;
    }

    const correctValue = correctAnswer * multiplier;
    const generatedOptions = generateMcqOptions(correctAnswer, multiplier);
    q.options = generatedOptions;
    q.correctAnswer = generatedOptions.indexOf(correctValue);
    const originalTemplate = mcqObject.questions[index].question;
    mcqQuestionEl.textContent = formatText(originalTemplate, placeholderValues);
    filledMcqObject.questions[index] = q;
  } else {
    mcqQuestionEl.textContent = q.question;
  }

  mcqOptionsEl.innerHTML = "";
  q.options.forEach((opt) => {
    const div = document.createElement("div");
    div.className = "mcq-option";
    div.textContent = opt;
    mcqOptionsEl.appendChild(div);
  });

  mcqOptionsEl.classList.remove("answered");
}

function handleOptionClick(event) {
  const selectedOption = event.target.closest(".mcq-option");
  if (!selectedOption || mcqOptionsEl.classList.contains("answered")) return;
  const options = Array.from(mcqOptionsEl.children);
  const selectedIndex = options.indexOf(selectedOption);
  const correctIndex =
    filledMcqObject.questions[filledMcqObject.currentQuestionIndex]
      .correctAnswer;
  if (selectedIndex === correctIndex) {
    selectedOption.classList.add("correct");
    playSound("correct");
    mcqOptionsEl.classList.add("answered");
    setTimeout(() => {
      toggleFullScreenOverlay(false);
      if (callbackAfterMcq) {
        callbackAfterMcq();
        callbackAfterMcq = null;
      }
    }, 800);
  } else {
    selectedOption.classList.add("wrong");
    playSound("wrong");
  }
}

function confettiBurst() {
  if (typeof confetti !== "function") return;
  const end = Date.now() + 1000;
  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 360,
      origin: { x: 0.5, y: 0.5 },
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

const mcqQuestionEl = document.querySelector("#mcq-question");
const mcqOptionsEl = document.querySelector("#mcq-options");
mcqOptionsEl.addEventListener("click", handleOptionClick);
const gridContainer = document.querySelector(".grid-container");
gridContainer.addEventListener("click", handleStepperClick);

// --- INITIALIZE ---
// Setup marquee positioning based on logo width
function setupMarqueePosition() {
  const logo = document.getElementById("logo");
  const marquee = document.getElementById("marquee-container");
  if (logo && marquee) {
    const logoRect = logo.getBoundingClientRect();
    marquee.style.left = `${logoRect.right}px`;
    marquee.style.width = `calc(100vw - ${logoRect.right}px)`;
  }
}

// Setup marquee immediately when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setupMarqueePosition();
    initializeBoard();
  });
} else {
  // DOM is already ready
  setupMarqueePosition();
  initializeBoard();
}

window.addEventListener("resize", setupMarqueePosition);
