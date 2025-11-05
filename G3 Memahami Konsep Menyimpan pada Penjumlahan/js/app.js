// --- GLOBAL STATE & CONSTANTS ---
let currentStep = 0;
const MINUEND = 27;
const SUBTRAHEND = 15;
const [MINUEND_TENS, MINUEND_ONES] = String(MINUEND).split("").map(Number);
const [SUBTRAHEND_TENS, SUBTRAHEND_ONES] = String(SUBTRAHEND)
  .split("")
  .map(Number);
const [t1, u1] = String(MINUEND).split("").map(Number);
const [t2, u2] = String(SUBTRAHEND).split("").map(Number);
let rows = [];
let ftueTimeout;
const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
let unitsClone = null;

// --- DOM ELEMENT REFERENCES ---
const appContainer = document.querySelector(".app-container");
const appMain = document.querySelector(".app-main");
const tensBlocksColumn = document.getElementById("tens-blocks-column");
const onesBlocksColumn = document.getElementById("ones-blocks-column");
const tensNumbersColumn = document.getElementById("tens-numbers-column");
const onesNumbersColumn = document.getElementById("ones-numbers-column");
const blockSectionTemplate = document.getElementById("block-section-template");
const numberSectionTemplate = document.getElementById(
  "number-section-template"
);
const nextButton = document.querySelector(".next-button");
const contextP = document.querySelector("#context > p");
const characterImg = document.getElementById("character");
const handFtue = document.getElementById("hand-ftue");
const problemStatement = document.querySelector(".problem-statement h1");

// --- UTILITY & HELPER FUNCTIONS ---
function playSound(name) {
  const file = `sound/${name}.mp3`;
  const audio = new Audio(file);
  audio.play();
}
function initiateHeader() {
  const headers = document.querySelectorAll(
    "#subtraction-workspace .column-header"
  );

  // Safety check to ensure there are enough headers
  if (headers.length < 5) {
    console.error("Not enough column-header elements.");
    return;
  }

  // Fill the headers
  headers[0].textContent = tags.tens;
  headers[1].textContent = tags.ones;
  headers[2].textContent = ""; // Separator
  headers[3].textContent = tags.t;
  headers[4].textContent = tags.o;
}
initiateHeader();
function setJaxpose(poseKey) {
  characterImg.src = texts.ftue[poseKey];
}

function updateSpeechBubble(key) {
  contextP.innerHTML = texts.context_data[key];
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// --- FTUE FUNCTIONS ---
function showFtue(element, showHand = true) {
  if (!element) return;
  element.classList.add("ftue-highlight");
  if (showHand && handFtue) {
    handFtue.classList.remove("hand-animating");
    element.classList.remove("ftue-highlight");
    setTimeout(() => {
      const rect = element.getBoundingClientRect();
      handFtue.querySelector("img").src = texts.ftue.hand_cursor;
      handFtue.style.top = `${rect.top + rect.height / 2}px`;
      handFtue.style.left = `${rect.left + rect.width / 2}px`;
      handFtue.classList.add("hand-animating");
    }, 10);
  }
}

function hideFtue() {
  if (handFtue) handFtue.classList.remove("hand-animating");
  document
    .querySelectorAll(".ftue-highlight")
    .forEach((el) => el.classList.remove("ftue-highlight"));
}

// --- UI & ELEMENT CREATION ---
function createPlaceValueSection(column, type) {
  const template =
    type === "block" ? blockSectionTemplate : numberSectionTemplate;
  const clone = template.content.cloneNode(true);
  const element = clone.firstElementChild;
  column.appendChild(element);

  const section = {
    element,
    stepper: element.querySelector(".stepper"),
    plusButton: element.querySelector(".plus"),
    minusButton: element.querySelector(".minus"),
    count: 0,
  };

  if (type === "block") {
    section.blockContainer = element.querySelector(".blocks-grid");
    section.badge = element.querySelector(".corner-badge");
  } else {
    section.numberDisplay = element.querySelector(".number-display");
  }
  return section;
}

function createRow() {
  const isResultRow = rows.length === 2;
  const tensBlockSection = createPlaceValueSection(tensBlocksColumn, "block");
  const onesBlockSection = createPlaceValueSection(onesBlocksColumn, "block");
  const tensNumberSection = createPlaceValueSection(
    tensNumbersColumn,
    "number"
  );
  const onesNumberSection = createPlaceValueSection(
    onesNumbersColumn,
    "number"
  );

  if (isResultRow) {
    [
      tensBlockSection.element,
      onesBlockSection.element,
      tensNumberSection.element,
      onesNumberSection.element,
    ].forEach((el) => (el.style.marginTop = "2vh"));
  }

  tensBlockSection.blockContainer.classList.add("ten-block");
  onesBlockSection.blockContainer.classList.add("unit-block");
  tensNumberSection.numberDisplay.style.color = "var(--color-tens)";
  onesNumberSection.numberDisplay.style.color = "var(--color-ones)";

  const rowObject = {
    id: rows.length,
    tens: { ...tensBlockSection },
    ones: { ...onesBlockSection },
    tensNumber: { ...tensNumberSection },
    onesNumber: { ...onesNumberSection },
    updateVisuals(place, value, isPlaceholder = false) {
      const p = this[place];
      p.count = value;
      p.blockContainer.innerHTML = "";
      const blockTag = place === "tens" ? "ten" : "unit";
      const blockSrc = `assets/${blockTag}.png`;

      for (let i = 0; i < p.count; i++) {
        let block;
        if (isPlaceholder) {
          block = document.createElement("div");
          block.className = "dashed";
          block.classList.add(place === "tens" ? "dashed-rod" : "dashed-cube");
        } else {
          block = document.createElement("img");
          block.src = blockSrc;
        }
        p.blockContainer.appendChild(block);
      }
    },
    updateNumbers(place, value) {
      const p = this[place];
      const pNum = this[`${place}Number`];
      const displayValue = place === "tens" ? value * 10 : value;
      p.badge.textContent = value;
      pNum.numberDisplay.textContent = displayValue;
    },
  };
  rows.push(rowObject);
  return rowObject;
}

function addEqualsLine() {
  const line = document.createElement("div");
  line.className = "equals-line";
  appMain.appendChild(line);
  const parentRect = appMain.getBoundingClientRect();
  const firstElemRect = rows[2].tens.element.getBoundingClientRect();
  const lastElemRect = rows[2].onesNumber.element.getBoundingClientRect();
  line.style.top = `calc(${firstElemRect.top - parentRect.top}px - 3.5vw)`;
  line.style.left = `${firstElemRect.left - parentRect.left}px`;
  line.style.width = `${lastElemRect.right - firstElemRect.left}px`;
}

function addMinusSign(targetRow) {
  const minusBlock = document.createElement("div");
  minusBlock.textContent = "+";
  minusBlock.className = "minus-operator";
  appContainer.appendChild(minusBlock);
  const targetRect = targetRow.ones.element.getBoundingClientRect();
  const containerRect = appContainer.getBoundingClientRect();
  minusBlock.style.top = `${
    targetRect.top - containerRect.top + targetRect.height / 2
  }px`;
  const leftoffsetBlock =
    targetRect.left - containerRect.left + targetRect.width;
  minusBlock.style.left = `calc(${leftoffsetBlock}px + 1.3vw)`;
  const minusNumber = minusBlock.cloneNode(true);
  appContainer.appendChild(minusNumber);
  const targetNumRect = targetRow.onesNumber.element.getBoundingClientRect();
  minusNumber.style.top = `${
    targetNumRect.top - containerRect.top + targetNumRect.height / 2
  }px`;
  const leftOffset =
    targetNumRect.left - containerRect.left + targetNumRect.width;
  minusNumber.style.left = `calc(${leftOffset}px + 1.3vw)`;
}

// --- CORE INTERACTION LOGIC ---
function handleStepperClick(event) {
  const button = event.target.closest(".stepper-btn");
  if (!button || button.disabled) return;
  hideFtue();
  playSound("click");

  const blockSection = button.closest(".block-section");
  let foundRow, foundPlace;
  for (const r of rows) {
    if (r.tens.element === blockSection) {
      [foundRow, foundPlace] = [r, "tens"];
      break;
    }
    if (r.ones.element === blockSection) {
      [foundRow, foundPlace] = [r, "ones"];
      break;
    }
  }
  if (!foundRow) return;

  const p = foundRow[foundPlace];
  const isPlaceholder = false;
  p.count += button.classList.contains("plus") ? 1 : -1;
  p.count = Math.max(0, p.count);

  foundRow.updateVisuals(foundPlace, p.count, isPlaceholder);
  foundRow.updateNumbers(foundPlace, p.count);

  // Check if the number equals 37 and show special message
  const totalNumber = foundRow.tens.count * 10 + foundRow.ones.count;
  if (totalNumber === 37) {
    updateSpeechBubble("step_number_37");
    setNext("lanjut");
    nextButton.disabled = false;
    showFtue(nextButton, true);
  }

  if (
    currentStep === 3 &&
    foundRow.id === 0 &&
    foundPlace === "tens" &&
    p.count === MINUEND_TENS
  ) {
    setupStep1_ones();
  }
  if (
    currentStep === 3 &&
    foundRow.id === 0 &&
    foundPlace === "ones" &&
    p.count === MINUEND_ONES
  ) {
    completeStep1();
  }
  if (
    currentStep === 4 &&
    foundRow.id === 1 &&
    foundPlace === "tens" &&
    p.count === SUBTRAHEND_TENS
  ) {
    setupStep2_ones();
  }
  if (
    currentStep === 4 &&
    foundRow.id === 1 &&
    foundPlace === "ones" &&
    p.count === SUBTRAHEND_ONES
  ) {
    completeStep2();
  }
}

// --- ANIMATION FUNCTIONS ---
function createClone(sourceElement) {
  const clone = sourceElement.cloneNode(true);
  const sourceRect = sourceElement.getBoundingClientRect();
  Object.assign(clone.style, {
    position: "fixed",
    margin: "0",
    zIndex: "100",
    width: `${sourceRect.width}px`,
    height: `${sourceRect.height}px`,
    top: `${sourceRect.top}px`,
    left: `${sourceRect.left}px`,
    transition: "all 400ms ease-in-out",
  });
  document.body.appendChild(clone);
  return clone;
}

function animateCloneToTarget(source, target, onStart, onComplete) {
  const clone = createClone(source);
  playSound("swoosh");
  onStart?.();

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const targetRect = target.getBoundingClientRect();
      Object.assign(clone.style, {
        top: `${targetRect.top}px`,
        left: `${targetRect.left}px`,
        width: `${targetRect.width}px`,
        height: `${targetRect.height}px`,
        opacity: "0.5",
      });
    });
  });

  clone.addEventListener(
    "transitionend",
    () => {
      clone.remove();
      onComplete?.();
    },
    { once: true }
  );
}

// --- STEP-BY-STEP WORKFLOW ---
function advanceStep() {
  playSound("click");
  currentStep++;
  hideFtue();
  nextButton.disabled = true;

  switch (currentStep) {
    case 1:
      setupStep0_b();
      break;
    case 2:
      setupStep0_c();
      break;
    case 3:
      console.log("case 3");
      setupStep1_tens();
      break;
    case 4:
      console.log("case 4");
      setupStep2_tens();
      break;
    case 5:
      console.log("case 5");
      setupStep3();
      break;
    case 6:
      console.log("case 6");
      handleunits1();
      break;
    case 7:
      console.log("case 7");
      handleUnits2();
      break;
    case 8:
      handleTens();
      break;
    case 9:
      setupFinalStep();
      break;
    case 10:
      completion();
      break;
  }
}

function setupStep0_a() {
  updateSpeechBubble("step0_a");
  const row = createRow();
  showFtue(row.tens.element, false);
  showFtue(row.ones.element, false);
  showFtue(nextButton, true);
  nextButton.textContent = texts.buttons.next;
  nextButton.disabled = false;
}

function setupStep0_b() {
  updateSpeechBubble("step0_b");
  const row = rows[0];
  row.tens.stepper.style.visibility = "visible";
  row.ones.stepper.style.visibility = "visible";
  [
    row.tens.plusButton,
    row.tens.minusButton,
    row.ones.plusButton,
    row.ones.minusButton,
  ].forEach((b) => (b.disabled = true));
  showFtue(row.tens.stepper, false);
  showFtue(row.ones.stepper, false);
  showFtue(nextButton, true);
  nextButton.disabled = false;
}

function setupStep0_c() {
  updateSpeechBubble("step0_c");
  const row = rows[0];
  showFtue(row.tensNumber.element, false);
  showFtue(row.onesNumber.element, false);
  showFtue(nextButton, true);
  nextButton.textContent = texts.buttons.start_task;
  nextButton.disabled = false;
}

function setupStep1_tens() {
  problemStatement.innerHTML = `${MINUEND} + ${SUBTRAHEND}`;
  updateSpeechBubble("step1_tens");
  const row = rows[0];
  row.tens.plusButton.disabled = false;
  row.tens.minusButton.disabled = false;
  row.ones.plusButton.disabled = true;
  row.ones.minusButton.disabled = true;
  showFtue(row.tens.plusButton, true);
}

function setupStep1_ones() {
  updateSpeechBubble("step1_ones");
  const row = rows[0];
  row.tens.plusButton.disabled = true;
  row.tens.minusButton.disabled = true;
  row.ones.plusButton.disabled = false;
  row.ones.minusButton.disabled = false;
  showFtue(row.ones.plusButton, true);
}

function completeStep1() {
  setJaxpose("pose_happy");
  updateSpeechBubble("step1_complete");
  const row = rows[0];
  row.tens.stepper.style.visibility = "hidden";
  row.ones.stepper.style.visibility = "hidden";
  nextButton.disabled = false;
  showFtue(nextButton, true);
}

function setupStep2_tens() {
  setJaxpose("pose_normal");
  updateSpeechBubble("step2_tens");
  const row = createRow();
  row.tens.stepper.style.visibility = "visible";
  row.ones.stepper.style.visibility = "visible";
  row.tens.plusButton.disabled = false;
  row.tens.minusButton.disabled = false;
  row.ones.plusButton.disabled = true;
  row.ones.minusButton.disabled = true;
  showFtue(row.tens.plusButton, true);
}

function setupStep2_ones() {
  updateSpeechBubble("step2_ones");
  const row = rows[1];
  row.tens.plusButton.disabled = true;
  row.tens.minusButton.disabled = true;
  row.ones.plusButton.disabled = false;
  row.ones.minusButton.disabled = false;
  showFtue(row.ones.plusButton, true);
}

function completeStep2() {
  setJaxpose("pose_happy");
  updateSpeechBubble("step2_complete");
  const row = rows[1];
  row.tens.stepper.style.visibility = "hidden";
  row.ones.stepper.style.visibility = "hidden";
  nextButton.disabled = false;
  showFtue(nextButton, true);
}
function setNext(tag) {
  nextButton.textContent = texts.buttons[tag];
}
function setupStep3() {
  createRow();
  addEqualsLine();
  addMinusSign(rows[1]);
  nextButton.disabled = false;
  updateSpeechBubble("add_units1");
  setNext("add_unit");

  if (MINUEND_ONES < SUBTRAHEND_ONES) {
    updateSpeechBubble("step_borrow_intro");
    showFtue(rows[0].ones.element, false);
    nextButton.textContent = texts.buttons.borrow;
  }
  //  else {
  //   currentStep = 6;
  //   updateSpeechBubble("take_away_ones");
  //   nextButton.textContent = texts.buttons.take_away_ones;
  // }
  showFtue(nextButton, true);
}
const overlay = document.getElementById("activity-complete-overlay");
const startOverBtn = document.getElementById("start-over-btn");
const overlayTitle = document.getElementById("overlay-title");
const overlayMessage = document.getElementById("overlay-message");
const leftPanel = document.querySelector(".left-panel");

function showOverlay(titleTag, messageTag, buttonTag, cb) {
  leftPanel.style.visibility = "hidden";
  nextButton.style.visibility = "hidden";
  overlayTitle.innerHTML = texts.context_data[titleTag];
  overlayMessage.innerHTML = texts.context_data[messageTag];
  overlay.style.display = "flex";
  startOverBtn.textContent = texts.buttons[buttonTag];
  showFtue(startOverBtn, true);
  startOverBtn.onclick = () => {
    hideOverlay();
    
    cb?.();
  };
}

function hideOverlay() {
  leftPanel.style.visibility = "visible";
  nextButton.style.visibility = "visible";
  overlay.style.display = "none";
  hideFtue();
}

async function unitsTopToBottom(place = "ones") {
  const sourceBlockElements = rows[0][place].element;
  const remainingBlocks = Array.from(
    sourceBlockElements.querySelectorAll(".blocks-grid img:not(.transparent)")
  );
  let resultCount = 0;
  for (const sourceBlock of remainingBlocks) {
    const placeholder = document.createElement("div");
    placeholder.style.width = `${sourceBlock.offsetWidth}px`;
    placeholder.style.height = `${sourceBlock.offsetHeight}px`;
    placeholder.style.visibility = "hidden";
    rows[2][place].blockContainer.appendChild(placeholder);

    await new Promise((resolve) =>
      animateCloneToTarget(
        sourceBlock,
        placeholder,
        () => sourceBlock.classList.add("transparent"),
        () => {
          resultCount++;
          rows[2].updateVisuals(place, resultCount);
          rows[2].updateNumbers(place, resultCount);
          resolve();
        }
      )
    );
    await wait(150);
  }
}
async function unitsMiddleToBottom(place = "ones") {
  const sourceBlockElements = rows[1][place].element;
  const remainingBlocks = Array.from(
    sourceBlockElements.querySelectorAll(".blocks-grid img:not(.transparent)")
  );
  let resultCount = u1;
  const till = 10 - u1;
  for (const sourceBlock of remainingBlocks.slice(0, till)) {
    const placeholder = document.createElement("div");
    placeholder.style.width = `${sourceBlock.offsetWidth}px`;
    placeholder.style.height = `${sourceBlock.offsetHeight}px`;
    placeholder.style.visibility = "hidden";
    rows[2][place].blockContainer.appendChild(placeholder);

    await new Promise((resolve) =>
      animateCloneToTarget(
        sourceBlock,
        placeholder,
        () => sourceBlock.classList.add("transparent"),
        () => {
          resultCount++;
          rows[2].updateVisuals(place, resultCount);
          rows[2].updateNumbers(place, resultCount);
          resolve();
        }
      )
    );
    await wait(150);
  }
}
async function unitsMiddleToBottomAgain(place = "ones") {
  const sourceBlockElements = rows[1][place].element;
  const remainingBlocks = Array.from(
    sourceBlockElements.querySelectorAll(".blocks-grid img:not(.transparent)")
  );
  let resultCount = 0;

  for (const sourceBlock of remainingBlocks) {
    const placeholder = document.createElement("div");
    placeholder.style.width = `${sourceBlock.offsetWidth}px`;
    placeholder.style.height = `${sourceBlock.offsetHeight}px`;
    placeholder.style.visibility = "hidden";
    rows[2][place].blockContainer.appendChild(placeholder);

    await new Promise((resolve) =>
      animateCloneToTarget(
        sourceBlock,
        placeholder,
        () => sourceBlock.classList.add("transparent"),
        () => {
          resultCount++;
          rows[2].updateVisuals(place, resultCount);
          rows[2].updateNumbers(place, resultCount + 10);
          resolve();
        }
      )
    );
    await wait(150);
  }
}
async function tensTopToBottom(place = "tens") {
  const sourceBlockElements = rows[0][place].element;
  const remainingBlocks = Array.from(
    sourceBlockElements.querySelectorAll(".blocks-grid img:not(.transparent)")
  );
  let resultCount = 1;
  for (const sourceBlock of remainingBlocks) {
    const placeholder = document.createElement("div");
    placeholder.style.width = `${sourceBlock.offsetWidth}px`;
    placeholder.style.height = `${sourceBlock.offsetHeight}px`;
    placeholder.style.visibility = "hidden";
    rows[2][place].blockContainer.appendChild(placeholder);

    await new Promise((resolve) =>
      animateCloneToTarget(
        sourceBlock,
        placeholder,
        () => sourceBlock.classList.add("transparent"),
        () => {
          resultCount++;
          rows[2].updateVisuals(place, resultCount);
          rows[2].updateNumbers(place, resultCount);
          resolve();
        }
      )
    );
    await wait(150);
  }
}
async function tensMiddleToBottom(place = "tens") {
  const sourceBlockElements = rows[1][place].element;
  const remainingBlocks = Array.from(
    sourceBlockElements.querySelectorAll(".blocks-grid img:not(.transparent)")
  );
  let resultCount = 1 + t1;

  for (const sourceBlock of remainingBlocks) {
    const placeholder = document.createElement("div");
    placeholder.style.width = `${sourceBlock.offsetWidth}px`;
    placeholder.style.height = `${sourceBlock.offsetHeight}px`;
    placeholder.style.visibility = "hidden";
    rows[2][place].blockContainer.appendChild(placeholder);

    await new Promise((resolve) =>
      animateCloneToTarget(
        sourceBlock,
        placeholder,
        () => sourceBlock.classList.add("transparent"),
        () => {
          resultCount++;
          rows[2].updateVisuals(place, resultCount);
          rows[2].updateNumbers(place, resultCount);
          resolve();
        }
      )
    );
    await wait(150);
  }
}
async function handleunits1() {
  console.log("handleunits1");
  await unitsTopToBottom();
  await wait(200);
  await unitsMiddleToBottom();
  unitsClone = await cloneAndTranslateElement(rows[2]["ones"].blockContainer);
  await wait(200);
  await unitsMiddleToBottomAgain();
  nextButton.disabled = false;
  updateSpeechBubble("unit_overflow");
  setNext("unit_overflow");
  setJaxpose("pose_thinking");
  showFtue(nextButton, true);
}
async function handleUnits2() {
  const sourceBlockElements = rows[1]["tens"].element;
  const srcBlock = sourceBlockElements.querySelector(".blocks-grid img");
  const placeholder = document.createElement("div");
  placeholder.style.width = `${srcBlock.offsetWidth}px`;
  placeholder.style.height = `${srcBlock.offsetHeight}px`;
  placeholder.style.visibility = "hidden";
  rows[2]["tens"].blockContainer.appendChild(placeholder);
  const unitstack = createUnitStackOnTenRod(placeholder);

  rows[2].updateNumbers("ones", u1 + u2 - 10);
  await animateUnitsCloneToTen();
  unitstack.remove();
  rows[2].updateVisuals("tens", 1);
  rows[2].updateNumbers("tens", 1);
  // nextButton.disabled = false;
  updateSpeechBubble("after_overflow");
  setNext("add_ten");
  setJaxpose("pose_normal");
  setTimeout(() => {
    showOverlay(
      "overlay_carry_heading",
      "overlay_carry_message",
      "okay",
      ()=>{
        nextButton.disabled = false;
        showFtue(nextButton, true);
      }
    );
  }, 400);
}
async function handleTens() {
  await tensTopToBottom();
  await wait(200);
  await tensMiddleToBottom();
  nextButton.disabled = false;
  setNext("next");
  updateSpeechBubble("done");
  setJaxpose("pose_superHappy");
  showFtue(nextButton, true);
}

function setupFinalStep() {
  updateSpeechBubble("final_result");
  problemStatement.innerHTML = `<strong>${MINUEND} + ${SUBTRAHEND} = ${
    MINUEND + SUBTRAHEND
  }</strong>`;
  [rows[0], rows[1], rows[2]].forEach((row) => {
    row.tensNumber.element.classList.add("ftue-highlight");
    row.onesNumber.element.classList.add("ftue-highlight");
  });
  setJaxpose("pose_happy");
  // nextButton.style.visibility = "hidden";
  nextButton.disabled = false;
  showFtue(nextButton, true);
}
function completion(){
  showOverlay("overlay_final_heading", "overlay_final_message", "start_over",()=>{
    window.location.reload();
  });
}

// --- INITIALIZATION ---
function initializeApp() {
  setJaxpose("pose_normal");
  document
    .querySelectorAll(".minus-operator, .equals-line, .unit-block-overflow")
    .forEach((el) => el.remove());
  [
    tensBlocksColumn,
    onesBlocksColumn,
    tensNumbersColumn,
    onesNumbersColumn,
  ].forEach((col) => (col.innerHTML = ""));
  rows = [];
  currentStep = 0;
  nextButton.style.visibility = "visible";
  nextButton.onclick = advanceStep;
  appMain.removeEventListener("click", handleStepperClick);
  appMain.addEventListener("click", handleStepperClick);
  setupStep0_a();
}

initializeApp();

function cloneAndTranslateElement(sourceElement) {
  return new Promise((resolve) => {
    const clone = createClone(sourceElement);
    rows[2].updateVisuals("ones", 0);
    const cloneRect = clone.getBoundingClientRect();
    const originalRect = sourceElement.getBoundingClientRect();
    clone.style.top = `${originalRect.top + window.scrollY + rem}px`;
    clone.style.left = `${originalRect.left + window.scrollX - rem}px`;
    const computedStyle = window.getComputedStyle(sourceElement);

    // Copy layout-related styles to ensure the clone looks the same
    clone.style.display = computedStyle.display;
    clone.style.gap = computedStyle.gap;

    // For flex containers
    clone.style.flexDirection = computedStyle.flexDirection;
    clone.style.justifyContent = computedStyle.justifyContent;
    clone.style.alignItems = computedStyle.alignItems;

    // For grid containers (like the units-cell)
    clone.style.gridTemplateColumns = computedStyle.gridTemplateColumns;
    clone.style.gridAutoRows = computedStyle.gridAutoRows;
    clone.style.rowGap = computedStyle.rowGap;
    clone.style.columnGap = computedStyle.columnGap;
    clone.classList.add("wiggle");
    clone.classList.add("clone");
    resolve(clone);
  });
}

function createUnitStackOnTenRod(targ) {
  // 1. Find the target element: the first ten-rod in the third row.
  const targetElement = targ;

  // 2. Get its position and dimensions.
  const targetRect = targetElement.getBoundingClientRect();

  // 3. Create the main container div.
  const container = document.createElement("div");
  container.className = "unit-stack-container"; // For styling
  container.style.position = "absolute";
  container.style.top = `${targetRect.top + window.scrollY}px`;
  container.style.left = `${targetRect.left + window.scrollX}px`;
  container.style.width = `${targetRect.width}px`;
  container.style.height = `${targetRect.height}px`;
  container.style.display = "flex";
  container.style.flexDirection = "column";

  // 4. Create and append the 10 inner squares.
  for (let i = 0; i < 10; i++) {
    const square = document.createElement("div");
    square.className = "unit-in-stack"; // For styling
    container.appendChild(square);
  }

  // 5. Append the container to the body.
  document.body.appendChild(container);

  return container; // Return the container in case it needs to be manipulated further
}

async function animateUnitsCloneToTen() {
  unitsClone.classList.remove("wiggle");
  const topBlocks = unitsClone.querySelectorAll("img");
  const bottomBlocks = document.querySelectorAll(".unit-in-stack");
  const animationPromises = [];
  topBlocks.forEach((src, i) => {
    const dest = bottomBlocks[i];
    if (!dest) {
      console.error("No matching bottom block found for top block:", src);
      return;
    }
    const promise = promiseWrapper(
      animateCloneToTarget,
      src,
      dest,
      () => {
        // As soon as the animation starts, hide the source image in the clone.
        src.style.visibility = "hidden";
      },
      () => {
        // When this single animation is done, make the destination slot appear.
        // Make it look filled
      }
    );
    animationPromises.push(promise);
  });

  // 4. Use Promise.all() to wait for EVERY promise in the array to be resolved.
  await Promise.all(animationPromises);

  // 5. This code will only run after ALL animations are complete.
  // document.querySelector(".row-3 .ten-block img").classList.add("appear");
  unitsClone.remove();
  unitsClone = null;
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

// Position marquee from right edge of screen to right edge of logo
function positionMarquee() {
  const logo = document.querySelector('.tb-logo img');
  const marquee = document.querySelector('.marquee');
  const marqueeContent = document.querySelector('.marquee-content');
  
  if (logo && marquee && marqueeContent) {
    const logoRect = logo.getBoundingClientRect();
    const logoRightEdge = logoRect.right;
    const screenWidth = window.innerWidth;
    const marqueeWidth = screenWidth - logoRightEdge;
    
    // Position marquee from screen's right edge to logo's right edge
    marquee.style.width = marqueeWidth + 'px';
    marquee.style.right = '0';
    marquee.style.left = 'auto';
    
    // Calculate animation distance for one full cycle
    // Text starts at right edge of marquee and scrolls until it exits left edge
    const contentWidth = marqueeContent.scrollWidth;
    // Start position: left edge of text at right edge of marquee (just off-screen on right)
    // End position: right edge of text at left edge of marquee (completely exited on left)
    const startPosition = marqueeWidth; // pixels - positions left edge of text at right edge of marquee
    const endPosition = -contentWidth; // pixels - positions right edge of text at left edge of marquee
    const totalDistance = startPosition - endPosition; // Total distance to travel
    
    // Calculate animation duration based on distance (30px per second)
    const duration = Math.max(10, totalDistance / 30); // Minimum 10 seconds
    
    // Set CSS variables for animation
    marqueeContent.style.setProperty('--marquee-start', `${startPosition}px`);
    marqueeContent.style.setProperty('--marquee-end', `${endPosition}px`);
    
    // Set animation with calculated duration
    marqueeContent.style.animation = `none`;
    setTimeout(() => {
      marqueeContent.style.animation = `marquee-scroll ${duration}s linear infinite`;
    }, 10);
  }
}

// Initialize marquee position after DOM is ready and on resize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(positionMarquee, 100); // Small delay to ensure logo is rendered
  });
} else {
  setTimeout(positionMarquee, 100);
}

window.addEventListener('load', positionMarquee);
window.addEventListener('resize', positionMarquee);
