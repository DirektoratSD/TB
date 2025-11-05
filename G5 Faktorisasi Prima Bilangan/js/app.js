// =================
// App Setup
// =================
const T = window.APP_TEXTS;
if (!T) {
  console.error("Error: Text data not found. Ensure texts.js is loaded.");
}

// Global DOM Elements
let appletContainer,
  mainLayout,
  leftPanel,
  rightPanel,
  contextBox,
  characterImageEl;
let activityArea, prevButton, nextButton;
let handFtue, handFtueImg;

// App State
let currentStep = 0;
let currentQuestionIndex = 0;
let activeNumberCell = null; // Will store the TD element of the number to be divided

// =================
// Initialization
// =================
function initApp() {
  appletContainer = document.querySelector(".applet-container");
  mainLayout = document.querySelector(".main-layout");
  leftPanel = document.querySelector(".left-panel-anchor");
  rightPanel = document.querySelector(".right-panel-content");
  contextBox = document.getElementById("contextBox");
  characterImageEl = document.getElementById("characterImageElement");
  activityArea = document.getElementById("activity-area");
  prevButton = document.getElementById("prevButton");
  nextButton = document.getElementById("nextButton");
  handFtue = document.getElementById("hand-ftue");
  handFtueImg = document.getElementById("hand-ftue-img");

  document.getElementById("html_title").textContent = T.html_title;
  document.getElementById("main_title_text").textContent = T.main_title_text;
  document.getElementById("subtitle_text").textContent = T.subtitle_text;
  prevButton.textContent = T.button_texts.prev;
  nextButton.textContent = T.button_texts.next;
  handFtueImg.src = T.item_images.ftue_cursor;

  // Position marquee from right edge of logo
  const logo = document.querySelector(".tb-logo");
  const marquee = document.querySelector(".top-marquee");
  const marqueeElement = document.querySelector(".top-marquee marquee");
  if (logo && marquee) {
    const updateMarqueePosition = () => {
      const logoRect = logo.getBoundingClientRect();
      const containerRect = appletContainer.getBoundingClientRect();
      const logoRightEdge = logoRect.right - containerRect.left;
      marquee.style.left = logoRightEdge + "px";
    };
    updateMarqueePosition();
    window.addEventListener("resize", updateMarqueePosition);

    // Reduce marquee delay after first cycle
    if (marqueeElement) {
      const initialDelay = marqueeElement.scrollDelay || 85; // Default marquee delay
      
      // Set initial delay
      marqueeElement.scrollDelay = initialDelay;
      
      // Calculate when first cycle completes and reduce delay
      // Measure the text width to estimate scroll duration
      const tempSpan = document.createElement('span');
      tempSpan.style.visibility = 'hidden';
      tempSpan.style.position = 'absolute';
      tempSpan.style.whiteSpace = 'nowrap';
      tempSpan.style.fontSize = window.getComputedStyle(marqueeElement).fontSize;
      tempSpan.textContent = marqueeElement.textContent || marqueeElement.innerText;
      document.body.appendChild(tempSpan);
      
      const textWidth = tempSpan.offsetWidth;
      document.body.removeChild(tempSpan);
      
      // Get scroll amount (default is 6 pixels per scroll)
      const scrollAmount = marqueeElement.scrollAmount || 6;
      const scrollDelay = initialDelay;
      
      // Calculate total distance to scroll: text width + container width (so text scrolls completely off)
      const marqueeWidth = marquee.offsetWidth;
      const totalScrollDistance = textWidth + marqueeWidth;
      
      // Calculate time for one complete cycle: (totalScrollDistance / scrollAmount) * scrollDelay
      // Plus the delay before restart
      const cycleTime = (totalScrollDistance / scrollAmount) * scrollDelay + scrollDelay;
      
      // After first cycle completes, reduce delay to half
      setTimeout(() => {
        if (marqueeElement) {
          marqueeElement.scrollDelay = Math.floor(initialDelay / 2);
        }
      }, cycleTime);
    }
  }

  nextButton.addEventListener("click", handleNextClick);
  renderStep(currentStep);
}

// =================
// Game Flow Control
// =================
function renderStep(step) {
  currentStep = step;
  // FIXED: Reset context box color, but NOT for tutorial feedback steps
  if (![4, 6].includes(step)) {
    updateContextBoxState("normal");
  }

  // Steps that clear the activity area
  if ([1, 2, 3, 5, 7].includes(step)) {
    activityArea.innerHTML = "";
  }
  nextButton.disabled = true;
  hideFtue();
  setJaxPose("normal");
  appletContainer.classList.remove("initial-state");

  switch (step) {
    case 0:
      cleanUpIntro();
      activityArea.innerHTML = "";
      appletContainer.classList.add("initial-state");
      rightPanel.style.display = "none";
      updateInstructions("step_0");
      const startButton = createButton(T.button_texts.start, () =>
        renderStep(1)
      );
      const startButtonContainer = document.createElement("div");
      startButtonContainer.id = "start-button-container";
      startButtonContainer.appendChild(startButton);
      leftPanel.appendChild(startButtonContainer);
      showFtue(startButton);
      break;

    case 1:
      cleanUpIntro();
      rightPanel.style.display = "flex";
      updateInstructions("step_1");
      activityArea.innerHTML = `<div class="hammer-intro-container"><img src="${T.item_images.hammer_passive}"></div>`;
      nextButton.disabled = false;
      showFtue(nextButton);
      break;

    case 2:
      updateInstructions("step_2");
      activityArea.innerHTML = `<div class="hammer-intro-container" data-number="2"><img src="${T.item_images.hammer_active}"></div>`;
      nextButton.disabled = false;
      showFtue(nextButton);
      break;

    case 3:
      setupGameLayout();
      updateInstructions("step_3");
      createInitialRow(12);
      const hammer2 = createHammer(2, "20%", "40%");
      hammer2.addEventListener("click", () => handleStrike(hammer2));
      break;

    // FIXED: Tutorial Success Message step now handles its own state
    case 4:
      updateContextBoxState("correct");
      updateInstructions("step_3_success");
      nextButton.disabled = false;
      showFtue(nextButton);
      break;

    case 5:
      setupGameLayout();
      updateInstructions("step_4");
      createInitialRow(9);
      const hammer2_fail = createHammer(2, "20%", "40%");
      hammer2_fail.addEventListener("click", () => handleStrike(hammer2_fail));
      break;

    // FIXED: Tutorial Fail Message step now handles its own state
    case 6:
      updateContextBoxState("incorrect");
      updateInstructions("step_4_fail");
      nextButton.disabled = false;
      showFtue(nextButton);
      break;

    case 7:
      startQuestion(0);
      break;

    case 8:
      summarize_step1();
      break;

    case 9:
      summarize_step2();
      break;

    case 10:
      summarize_step3();
      break;

    case 11:
      cleanUpIntro();
      activityArea.innerHTML = "";
      appletContainer.classList.add("initial-state");
      rightPanel.style.display = "none";
      setJaxPose("correct");
      updateInstructions("final_screen");
      const startOverButton = createButton(T.button_texts.start_over, () =>
        renderStep(0)
      );
      const startOverContainer = document.createElement("div");
      startOverContainer.id = "start-button-container";
      startOverContainer.appendChild(startOverButton);
      leftPanel.appendChild(startOverContainer);
      break;
  }
}

function handleNextClick() {
  audioPlay("click");
  renderStep(currentStep + 1);
}

function cleanUpIntro() {
  const btnContainer = document.getElementById("start-button-container");
  if (btnContainer) btnContainer.remove();
}

// =========================
// Main Activity Functions
// =========================
function startQuestion(qIndex) {
  currentQuestionIndex = qIndex;
  const question = T.gameConfig.questions[qIndex];
  setupGameLayout();
  updateInstructions("activity_start", { num: question.numberToFactor });

  createInitialRow(question.numberToFactor);

  question.hammers.forEach((hammerNum, index) => {
    const topPos = 15 + index * 20;
    const hammerEl = createHammer(hammerNum, "20%", `${topPos}%`);
    hammerEl.addEventListener("click", () => handleStrike(hammerEl));
  });
}

function handleStrike(hammerEl) {
  if (!activeNumberCell || hammerEl.classList.contains("disabled")) return;

  const hammerNum = parseInt(hammerEl.dataset.number);
  const numberToStrike = parseInt(activeNumberCell.dataset.value);

  document
    .querySelectorAll(".hammer")
    .forEach((h) => h.classList.add("disabled"));

  const targetNodeEl = activeNumberCell.querySelector(".tree-node");
  const targetRect = targetNodeEl.getBoundingClientRect();
  const activityRect = activityArea.getBoundingClientRect();
  const hammerRect = hammerEl.getBoundingClientRect();

  const targetX = targetRect.left - activityRect.left - hammerRect.width * 0.8;
  const targetY = targetRect.top - activityRect.top;
  hammerEl.style.left = `calc(${targetX}px + 10vw)`;
  hammerEl.style.top = `calc(${targetY}px - 6vw)`;

  setTimeout(() => {
    hammerEl.classList.add("hammer-swing");

    setTimeout(() => {
      const isTutorialStep = [3, 5].includes(currentStep);
      const isSuccess = numberToStrike % hammerNum === 0;

      if (isSuccess) {
        audioPlay("strike_success");
        setJaxPose("correct");

        // For non-tutorial steps, set color immediately. For tutorial, the next step will handle it.
        if (!isTutorialStep) {
          updateContextBoxState("correct");
        }

        // --- STRIKE EFFECT GIF ---
        const displayArea = activityArea.querySelector(".factor-display-area");
        const displayRect = displayArea.getBoundingClientRect();
        const strikeEffect = document.createElement("img");
        strikeEffect.src = T.item_images.strike_gif;
        strikeEffect.className = "strike-effect";
        strikeEffect.style.left = `${
          targetRect.left - displayRect.left + targetRect.width / 2
        }px`;
        strikeEffect.style.top = `${
          targetRect.top - displayRect.top + targetRect.height / 2
        }px`;
        displayArea.appendChild(strikeEffect);
        setTimeout(() => strikeEffect.remove(), 700);
        // --- END STRIKE EFFECT ---

        const newNumber = numberToStrike / hammerNum;
        activeNumberCell.classList.remove("active-cell");

        const parentRow = activeNumberCell.parentElement;
        const factorCell = parentRow.querySelector(".factor-cell");
        factorCell.innerHTML = `<div class="step-factor">${hammerNum}</div>`;
        factorCell.classList.add("has-line");

        const newRow = createRow(newNumber);

        document.querySelector(
          ".breakdown-text"
        ).textContent = `${hammerNum} × ${newNumber} = ${numberToStrike}`;

        if (newNumber === 1) {
          activeNumberCell = null;
          updateInstructions("activity_last_strike", {
            hammerNum,
            oldNum: numberToStrike,
            newNum: newNumber,
          });
          nextButton.disabled = false;
          showFtue(nextButton);
        } else {
          activeNumberCell = newRow.querySelector(".number-cell");
          activeNumberCell.classList.add("active-cell");
          if (!isTutorialStep) {
            updateInstructions("activity_success", {
              hammerNum,
              oldNum: numberToStrike,
              newNum: newNumber,
            });
          }
        }

        // FIXED: Advance to the feedback step, which will show the correct text and color.
        if (isTutorialStep) setTimeout(() => renderStep(currentStep + 1), 500);
      } else {
        // FAIL
        audioPlay("strike_fail");
        setJaxPose("wrong");
        targetNodeEl.classList.add("incorrect");

        // For non-tutorial steps, set color immediately. For tutorial, the next step will handle it.
        if (!isTutorialStep) {
          updateContextBoxState("incorrect");
          updateInstructions("activity_fail", {
            hammerNum,
            num: numberToStrike,
          });
          setTimeout(() => targetNodeEl.classList.remove("incorrect"), 2000);
        } else {
          // FIXED: Advance to the feedback step, which will show the correct text and color.
          setTimeout(() => renderStep(currentStep + 1), 1500);
        }
      }

      // Cleanup and re-enable hammers
      hammerEl.classList.remove("hammer-swing");
      setTimeout(() => {
        hammerEl.style.left = hammerEl.dataset.initialLeft;
        hammerEl.style.top = hammerEl.dataset.initialTop;

        if (activeNumberCell !== null) {
          if (!isTutorialStep) {
            const delay = isSuccess ? 0 : 1500;
            setTimeout(() => {
              document
                .querySelectorAll(".hammer")
                .forEach((h) => h.classList.remove("disabled"));
            }, delay);
          }
        }
      }, 500);
    }, 500);
  }, 500);
}

// =========================
// Summarization Functions
// =========================
function summarize_step1() {
  const question = T.gameConfig.questions[currentQuestionIndex];
  const table = document.getElementById("division-table");
  const factorCells = table.querySelectorAll(".factor-cell .step-factor");

  const factors = Array.from(factorCells).map((cell) => cell.textContent);

  updateInstructions("summary_1", {
    num: question.numberToFactor,
    factors: factors.sort((a, b) => a - b).join(" × "),
  });

  const numberCells = table.querySelectorAll(".number-cell");
  numberCells.forEach((cell, index) => {
    // FIXED: Fade all intermediate numbers AND the final '1'. Only the root number remains.
    if (index > 0) {
      const node = cell.querySelector(".tree-node");
      if (node) node.classList.add("faded");
    }
  });

  const hammerArea = activityArea.querySelector(".hammer-area");
  const breakdownText = activityArea.querySelector(".breakdown-text");
  if (hammerArea) hammerArea.style.display = "none";
  if (breakdownText) breakdownText.style.display = "none";

  nextButton.disabled = false;
  showFtue(nextButton);
}

function summarize_step2() {
  const question = T.gameConfig.questions[currentQuestionIndex];
  updateInstructions("summary_2", { num: question.numberToFactor });

  const displayArea = activityArea.querySelector(".factor-display-area");
  if (!displayArea) return;

  const mcqContainer = document.createElement("div");
  mcqContainer.className = "mcq-container";
  question.mcq.options.forEach((optionText) => {
    const optionButton = createButton(
      optionText,
      () => checkMcqAnswer(optionButton, optionText),
      "mcq-option"
    );
    mcqContainer.appendChild(optionButton);
  });
  displayArea.appendChild(mcqContainer);
}

function checkMcqAnswer(button, answer) {
  const question = T.gameConfig.questions[currentQuestionIndex];
  const isCorrect = answer === question.mcq.correctAnswer;

  if (isCorrect) {
    audioPlay("correct");
    setJaxPose("correct");
    updateContextBoxState("correct");
    document
      .querySelectorAll(".mcq-option:not([disabled])")
      .forEach((b) => (b.disabled = true));
    button.classList.add("correct");
    updateInstructions("summary_2_success");
    nextButton.disabled = false;
    showFtue(nextButton);
  } else {
    audioPlay("wrong");
    setJaxPose("wrong");
    updateContextBoxState("incorrect");
    button.disabled = true;
    button.classList.add("incorrect");
    updateInstructions("summary_2_fail");
  }
}

async function summarize_step3() {
  updateInstructions("summary_3");
  const question = T.gameConfig.questions[currentQuestionIndex];
  const displayArea = activityArea.querySelector(".factor-display-area");
  if (!displayArea) return;

  // Hide MCQ
  const mcqContainer = displayArea.querySelector(".mcq-container");
  if (mcqContainer) mcqContainer.style.display = "none";

  // --- 1. Prepare the final text with SPANs for highlighting ---
  const finalResultDiv = document.createElement("div");
  finalResultDiv.className = "final-factorization-text";
  displayArea.appendChild(finalResultDiv);

  const factorsArray = question.mcq.correctAnswer
    .replace(/\*/g, "×")
    .split(" × ");
  const factorsHtml = factorsArray
    .map((f) => `<span class="num-prime">${f}</span>`)
    .join(" × ");

  finalResultDiv.innerHTML = `Faktorisasi Prima dari <span class="num-root">${question.numberToFactor}</span> = ${factorsHtml}`;

  // --- 2. FIXED: Gather elements and match them correctly for highlighting ---
  const table = document.getElementById("division-table");
  const rootNodeEl = table.querySelector("tbody tr:first-child .tree-node");
  // Make a mutable copy of the factor nodes from the table to "consume" as we match them
  const availableFactorNodes = Array.from(
    table.querySelectorAll(".factor-cell .step-factor")
  );

  const rootTextEl = finalResultDiv.querySelector(".num-root");
  const factorTextEls = Array.from(
    finalResultDiv.querySelectorAll(".num-prime")
  );

  const elementsToHighlight = [];
  // Add the root number first
  if (rootNodeEl && rootTextEl) {
    elementsToHighlight.push({ node: rootNodeEl, text: rootTextEl });
  }

  // Match each prime factor from the text to a node from the table
  factorTextEls.forEach((textEl) => {
    const numToFind = textEl.textContent;
    const foundNodeIndex = availableFactorNodes.findIndex(
      (node) => node.textContent === numToFind
    );

    if (foundNodeIndex > -1) {
      const foundNode = availableFactorNodes[foundNodeIndex];
      elementsToHighlight.push({ node: foundNode, text: textEl });
      // Remove the matched node so it can't be matched again (handles repeated factors)
      availableFactorNodes.splice(foundNodeIndex, 1);
    }
  });

  // --- 3. Sequential Highlight Animation ---
  const highlightDelay = 1000; // 1 second per highlight
  nextButton.disabled = true;

  for (let i = 0; i < elementsToHighlight.length; i++) {
    const highlightPair = (pair) => {
      return new Promise((resolve) => {
        if (pair.node) pair.node.classList.add("highlight");
        if (pair.text) pair.text.classList.add("highlight");
        audioPlay("correct");

        setTimeout(() => {
          if (pair.node) pair.node.classList.remove("highlight");
          if (pair.text) pair.text.classList.remove("highlight");
          resolve();
        }, highlightDelay - 200);
      });
    };
    await highlightPair(elementsToHighlight[i]);
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  // --- 4. Final step ---
  nextButton.disabled = false;
  showFtue(nextButton);
}

// =========================
// UI & Helper Functions
// =========================
function updateContextBoxState(state) {
  // 'correct', 'incorrect', or 'normal'
  contextBox.classList.remove("correct", "incorrect");
  if (state === "correct" || state === "incorrect") {
    contextBox.classList.add(state);
  }
}

function setupGameLayout() {
  activityArea.innerHTML = `
      <div class="game-layout">
          <div class="hammer-area"></div>
          <div class="factor-display-area">
              <table id="division-table">
                  <tbody></tbody>
              </table>
              <div class="breakdown-text"></div>
          </div>
      </div>`;
  activeNumberCell = null;
}

function createHammer(number, left, top) {
  const hammerArea = activityArea.querySelector(".hammer-area");
  const hammer = document.createElement("div");
  hammer.className = "hammer";
  hammer.dataset.number = number;
  hammer.style.left = left;
  hammer.style.top = top;
  hammer.dataset.initialLeft = left;
  hammer.dataset.initialTop = top;
  hammer.innerHTML = `<img src="${T.item_images.hammer_active}">`;
  hammerArea.appendChild(hammer);
  return hammer;
}

function createInitialRow(value) {
  const tableBody = document.querySelector("#division-table tbody");
  const row = tableBody.insertRow();

  row.insertCell().className = "factor-cell";

  const numberCell = row.insertCell();
  numberCell.className = "number-cell active-cell";
  numberCell.dataset.value = value;
  numberCell.innerHTML = `<div class="tree-node">${value}</div>`;

  activeNumberCell = numberCell;
  return row;
}

function createRow(value) {
  const tableBody = document.querySelector("#division-table tbody");
  const row = tableBody.insertRow();

  const factorCell = row.insertCell();
  factorCell.className = "factor-cell";

  const numberCell = row.insertCell();
  numberCell.className = "number-cell";
  numberCell.dataset.value = value;

  const nodeClass = value === 1 ? "tree-node prime" : "tree-node";
  numberCell.innerHTML = `<div class="${nodeClass}">${value}</div>`;

  return row;
}

function createButton(text, onClick, className = "btn-primary") {
  const button = document.createElement("button");
  button.className = `btn ${className}`;
  button.innerHTML = text.replace(/\*/g, "×");
  button.addEventListener("click", () => {
    audioPlay("click");
    onClick();
  });
  return button;
}

function showFtue(element) {
  if (!element) return;
  const rect = element.getBoundingClientRect();
  handFtue.style.left = `${rect.left + rect.width / 2}px`;
  handFtue.style.top = `${rect.top + rect.height / 2}px`;
  handFtue.classList.add("hand-animating");
}

function hideFtue() {
  handFtue.classList.remove("hand-animating");
}

function updateInstructions(key, params = {}) {
  const contextSection = document.querySelector(".context-section");
  let instruction = T.instructions[key];
  if (instruction) {
    let title = instruction.title;
    let text =
      typeof instruction.text === "function"
        ? instruction.text(params)
        : instruction.text;
    contextSection.innerHTML = `<h2>${title}</h2><div>${text}</div>`;

    contextSection
      .querySelectorAll(".inline-hammer-wrapper")
      .forEach((wrapper) => {
        const img = wrapper.querySelector("img");
        if (!img) return;

        const hammerNum = img.dataset.number;
        const numberEl = document.createElement("span");
        numberEl.textContent = hammerNum;

        Object.assign(numberEl.style, {
          position: "absolute",
          top: "45%",
          left: "25%",
          transform: "translate(-50%, -50%)",
          fontSize: "1.5vw",
          fontWeight: "bold",
          color: "#d4a668",
          textShadow: "-0.05vw -0.05vw 0.02vw #f8d5ab",
          filter: "drop-shadow(0.05vw 0.05vw 0.02vw #3f2603)",
          pointerEvents: "none",
        });

        wrapper.appendChild(numberEl);
      });
  }
}

function setJaxPose(pose) {
  if (T.character_images && T.character_images[pose]) {
    characterImageEl.src = T.character_images[pose];
  }
}

function audioPlay(type) {
  if (T.audio && T.audio[type]) {
    new Audio(T.audio[type])
      .play()
      .catch((e) => console.warn("Audio play failed:", e));
  }
}

function isPrime(num) {
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}

document.addEventListener("DOMContentLoaded", initApp);
