// --- GLOBAL STATE & CONSTANTS ---
let currentStep = 0;
const MINUEND = 32;
const SUBTRAHEND = 15;
const [MINUEND_TENS, MINUEND_ONES] = String(MINUEND).split("").map(Number);
const [SUBTRAHEND_TENS, SUBTRAHEND_ONES] = String(SUBTRAHEND)
  .split("")
  .map(Number);
let rows = [];

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
const contextContainer = document.getElementById("context");
const characterImg = document.getElementById("character");
const handFtue = document.getElementById("hand-ftue");
const problemStatement = document.querySelector(".problem-statement h1");
const OnesHeading = document.getElementById("head-ones");
const TensHeading = document.getElementById("head-tens");
const overlay = document.getElementById("activity-complete-overlay");
const startOverBtn = document.getElementById("start-over-btn");
const overlayTitle = document.getElementById("overlay-title");
const overlayMessage = document.getElementById("overlay-message");

// --- UTILITY & HELPER FUNCTIONS ---
function playSound(name) {
  const file = `sound/${name}.mp3`;
  const audio = new Audio(file);
  audio.play();
}
function setJaxpose(poseKey) {
  characterImg.src = texts.ftue[poseKey];
}
function updateSpeechBubble(key) {
  contextP.innerHTML = texts.context_data[key];
}
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function confettiBurst() {
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
// createPlaceValueSection, createRow, addEqualsLine, addMinusSign are unchanged from your original prompt
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
  minusBlock.textContent = "−";
  minusBlock.className = "minus-operator";
  appContainer.appendChild(minusBlock);
  const targetRect = targetRow.tens.element.getBoundingClientRect();
  const containerRect = appContainer.getBoundingClientRect();
  minusBlock.style.top = `${
    targetRect.top - containerRect.top + targetRect.height / 2
  }px`;
  minusBlock.style.left = `calc(${
    targetRect.left + containerRect.left + minusBlock.offsetWidth
  }px - 10vw)`;
  const minusNumber = minusBlock.cloneNode(true);
  appContainer.appendChild(minusNumber);
  const targetNumRect = targetRow.tensNumber.element.getBoundingClientRect();
  minusNumber.style.top = `${
    targetNumRect.top - containerRect.top + targetNumRect.height / 2
  }px`;
  minusNumber.style.left = `calc(${
    targetNumRect.right - containerRect.left + minusNumber.offsetWidth
  }px + 7vw)`;
}
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
    transition: "all 800ms ease-in-out",
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
  const isPlaceholder = foundRow.id === 1;
  p.count += button.classList.contains("plus") ? 1 : -1;
  p.count = Math.max(0, p.count);
  foundRow.updateVisuals(foundPlace, p.count, isPlaceholder);
  foundRow.updateNumbers(foundPlace, p.count);
  if (
    currentStep === 3 &&
    foundRow.id === 0 &&
    foundPlace === "tens" &&
    p.count === MINUEND_TENS
  ) {
    setupStep1_ones();
  } else if (
    currentStep === 3 &&
    foundRow.id === 0 &&
    foundPlace === "ones" &&
    p.count === MINUEND_ONES
  ) {
    completeStep1();
  } else if (
    currentStep === 4 &&
    foundRow.id === 1 &&
    foundPlace === "tens" &&
    p.count === SUBTRAHEND_TENS
  ) {
    setupStep2_ones();
  } else if (
    currentStep === 4 &&
    foundRow.id === 1 &&
    foundPlace === "ones" &&
    p.count === SUBTRAHEND_ONES
  ) {
    completeStep2();
  } else {
    showFtue(button, true);
  }
}

// --- STEP-BY-STEP WORKFLOW ---
function advanceStep() {
  hideFtue();
  currentStep++;
  nextButton.disabled = true;

  switch (currentStep) {
    case 1:
      setupStep0_b();
      break;
    case 2:
      setupStep0_c();
      break;
    case 3:
      setupStep1_tens();
      break;
    case 4:
      setupStep2_tens();
      break;
    case 5:
      setupStep3();
      break;
    case 6:
      handleBorrowAnimation();
      break;
    case 7:
      handleTakeAwayOnes();
      break;
    case 8:
      handleCollectRemainingOnes();
      break;
    case 9:
      handleTakeAwayTens();
      break;
    case 10:
      handleCollectRemainingTens();
      break;
    case 11:
      setupFinalStep();
      break;
    case 12:
      showCompletionOverlay();
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
  problemStatement.innerHTML = `${MINUEND} − ${SUBTRAHEND}`;
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
  updateSpeechBubble("step2_complete");
  const row = rows[1];
  row.tens.stepper.style.visibility = "hidden";
  row.ones.stepper.style.visibility = "hidden";
  row.updateVisuals("tens", SUBTRAHEND_TENS, true);
  row.updateVisuals("ones", SUBTRAHEND_ONES, true);
  nextButton.disabled = false;
  showFtue(nextButton, true);
}

function setupStep3() {
  createRow();
  addEqualsLine();
  addMinusSign(rows[1]);
  setJaxpose("pose_thinking");
  nextButton.disabled = false;
  if (MINUEND_ONES < SUBTRAHEND_ONES) {
    updateSpeechBubble("step_borrow_intro");
    nextButton.textContent = texts.buttons.borrow;
    currentStep = 5;
  } else {
    currentStep = 6;
    updateSpeechBubble("take_away_ones");
    nextButton.textContent = texts.buttons.take_away_ones;
  }
  showFtue(nextButton, true);
}

// --- UPDATED SECTION START ---

async function handleBorrowAnimation() {
  setJaxpose("pose_thinking"); 
  const minuend = rows[0];
  const sourceTenRod =
    minuend.tens.blockContainer.querySelector("img:last-child");
  if (!sourceTenRod) return;

  minuend.tensNumber.numberDisplay.innerHTML = `${(minuend.tens.count - 1) * 10}`;
  minuend.onesNumber.numberDisplay.innerHTML = `${minuend.ones.count + 10}`;
  minuend.tens.badge.innerHTML = `${minuend.tens.count - 1}`;
  minuend.ones.badge.innerHTML = `${minuend.ones.count + 10}`;

  const onesContainer = minuend.ones.blockContainer;
  const tempTarget = document.createElement("div");
  Object.assign(tempTarget.style, {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "1px",
    height: "1px",
    visibility: "hidden",
  });
  onesContainer.appendChild(tempTarget);

  await new Promise((resolve) => {
    animateCloneToTarget(
      sourceTenRod,
      tempTarget,
      () => minuend.updateVisuals("tens", minuend.tens.count - 1),
      async () => {
        tempTarget.remove();
        minuend.ones.count += 10;
        minuend.ones.blockContainer.innerHTML = "";
        for (let i = 0; i < minuend.ones.count; i++) {
          const block = document.createElement("img");
          block.src = "assets/unit.png";
          minuend.ones.blockContainer.appendChild(block);
          playSound("click");
          await wait(30);
        }
        const allUnits = Array.from(minuend.ones.blockContainer.children);
        const overflowUnits = allUnits.slice(10);
        if (overflowUnits.length > 0) {
          const overflowContainer = document.createElement("div");
          overflowContainer.className = "blocks-grid unit-block";
          overflowUnits.forEach((unit) => overflowContainer.appendChild(unit));
          minuend.ones.blockContainer.parentNode.appendChild(overflowContainer);
          minuend.ones.blockContainer.classList.add(
            "is-overflowing",
            "unit-block-overflow"
          );
        }
        resolve();
      }
    );
  });

  setJaxpose("pose_happy");
  updateSpeechBubble("take_away_ones");
  setTimeout(() => {
    showBorrowOverlay();
  }, 1000);
  // Instead of updating the speech bubble, show the new overlay
}

async function takeAway(place, count) {
  const sourceBlockElements = rows[0][place].element;
  const sourceBlocks = Array.from(
    sourceBlockElements.querySelectorAll(".blocks-grid img")
  );
  const targetPlaceholders = Array.from(rows[1][place].blockContainer.children);
  let takenAwayCount = 0;
  for (let i = 0; i < count; i++) {
    await new Promise((resolve) =>
      animateCloneToTarget(
        sourceBlocks[i],
        targetPlaceholders[i],
        () => sourceBlocks[i].classList.add("transparent"),
        () => {
          takenAwayCount++;
          const newBlock = document.createElement("img");
          newBlock.src = `assets/${place === "tens" ? "ten" : "unit"}.png`;
          targetPlaceholders[i].replaceWith(newBlock);
          resolve();
        }
      )
    );
    await wait(150);
  }
}
async function collect(place) {
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
async function handleTakeAwayOnes() {
  await takeAway("ones", SUBTRAHEND_ONES);
  nextButton.textContent = texts.buttons.collect_ones;
  nextButton.disabled = false;
  const minuend = rows[0];
  minuend.ones.blockContainer.classList.remove("unit-block-overflow");
  updateSpeechBubble("collect_ones");
  showFtue(nextButton, true);
}
async function handleTakeAwayTens() {
  await takeAway("tens", SUBTRAHEND_TENS);
  nextButton.textContent = texts.buttons.collect_tens;
  nextButton.disabled = false;
  updateSpeechBubble("collect_tens");
  showFtue(nextButton, true);
}
async function handleCollectRemainingOnes() {
  await collect("ones");
  nextButton.textContent = texts.buttons.take_away_tens;
  nextButton.disabled = false;
  updateSpeechBubble("take_away_tens");
  showFtue(nextButton, true);
}
async function handleCollectRemainingTens() {
  await collect("tens");
  const minuend = rows[0];
  const overflowContainer = minuend.ones.element.querySelector(
    ".unit-block-overflow"
  );
  if (overflowContainer) overflowContainer.remove();
  setJaxpose("pose_superHappy");
  confettiBurst();
  playSound("confetti");
  updateSpeechBubble("collect_done");
  nextButton.disabled = false;
  nextButton.textContent = texts.buttons.next;
  showFtue(nextButton, true);
}

function setupFinalStep() {
  updateSpeechBubble("final_result");
  problemStatement.innerHTML = `<strong>${MINUEND} − ${SUBTRAHEND} = ${
    MINUEND - SUBTRAHEND
  }</strong>`;
  rows.forEach((row) => {
    row.tensNumber.element.classList.add("ftue-highlight");
    row.onesNumber.element.classList.add("ftue-highlight");
  });
  nextButton.textContent = texts.buttons.next;
  nextButton.disabled = false;
  showFtue(nextButton, true);
}

function showCompletionOverlay() {
  contextContainer.style.visibility = "hidden";
  nextButton.style.visibility = "hidden";
  
  // Set the content for the FINAL overlay
  overlayTitle.innerHTML = texts.context_data.overlay_title;
  overlayMessage.innerHTML = texts.context_data.overlay_message; // Using the general "well done" message
  
  overlay.style.display = "flex";
  
  // Configure the button to restart the activity
  startOverBtn.textContent = texts.buttons.start_over;
  startOverBtn.onclick = initializeApp; // Correctly assign the function reference
  showFtue(startOverBtn, true);
}

function showBorrowOverlay() {
  // Hide the main UI elements that the overlay will cover
  contextContainer.style.visibility = 'hidden';
  nextButton.style.visibility = 'hidden';

  // Set the content for the BORROW-specific overlay
  overlayTitle.innerHTML = texts.context_data.borrow_title;
  overlayMessage.innerHTML = texts.context_data.step_borrow_complete;
  
  // Configure the button to proceed to the next step
  startOverBtn.textContent = texts.buttons.okay;
  startOverBtn.onclick = () => {
    hideFtue();
    overlay.style.display = 'none'; // Hide the overlay
    
    // Make the main UI visible again for the subsequent steps
    contextContainer.style.visibility = 'visible';
    nextButton.style.visibility = 'visible';
  };
  
  // Show the overlay
  overlay.style.display = "flex";
  nextButton.disabled = false;
  nextButton.textContent = texts.buttons.take_away_ones;
  showFtue(startOverBtn, true);
}
// --- UPDATED SECTION END ---

// --- INITIALIZATION ---
function initializeApp() {
  if (overlay) overlay.style.display = "none";
  contextContainer.style.visibility = "visible";
  nextButton.style.visibility = "visible";
  problemStatement.innerHTML = "";
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
  OnesHeading.textContent = texts.headings.ones;
  TensHeading.textContent = texts.headings.tens;
  nextButton.onclick = advanceStep;
  appMain.removeEventListener("click", handleStepperClick);
  appMain.addEventListener("click", handleStepperClick);
  setupStep0_a();
}

// Position marquee based on logo width
function positionMarquee() {
  const logo = document.querySelector('.tb-logo img');
  const marquee = document.querySelector('.top-marquee');
  if (logo && marquee) {
    // Wait for logo to load
    if (logo.complete) {
      const logoWidth = logo.offsetWidth;
      const logoLeft = 10; // logo left position in pixels
      const spacing = 10; // spacing between logo and marquee
      marquee.style.paddingLeft = `${logoLeft + logoWidth + spacing}px`;
    } else {
      logo.addEventListener('load', () => {
        const logoWidth = logo.offsetWidth;
        const logoLeft = 10;
        const spacing = 10;
        marquee.style.paddingLeft = `${logoLeft + logoWidth + spacing}px`;
      });
    }
  }
}

initializeApp();
positionMarquee();