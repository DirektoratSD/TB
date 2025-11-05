// MAPS
const RCmap = {
  oColumn: ".right-panel .col-5",
  tColumn: ".right-panel .col-4",
  hColumn: ".right-panel .col-3",
  thColumn: ".right-panel .col-2",
  tthColumn: ".right-panel .col-1",
  num1Row: ".left-panel .row-num1",
  num2Row: ".left-panel .row-num2",
  resultRow: ".right-panel .row-result",
  rightRowHeader: ".right-panel .row-header",
  rightRowCarry: ".right-panel .row-carry",
  rightRowLine: ".right-panel .row-line",
  rightRowResult: ".right-panel .row-result",
  rightRowNum1: ".right-panel .row-num1",
  rightRowNum2: ".right-panel .row-num2",
};
const resultRow = {
  o: ".right-panel .row-result.o-color",
  t: ".right-panel .row-result.t-color",
  h: ".right-panel .row-result.h-color",
  th: ".right-panel .row-result.th-color",
  tth: ".right-panel .row-result.tth-color",
};
const carryRow = {
  o: ".right-panel .row-carry.o-color",
  t: ".right-panel .row-carry.t-color",
  h: ".right-panel .row-carry.h-color",
  th: ".right-panel .row-carry.th-color",
  tth: ".right-panel .row-carry.tth-color",
};
const tagToNumber = {
  o: 10,
  t: 100,
  h: 1000,
  th: 10000,
};

// MAPS end

// IMPORTS
const highlightBox = document.getElementById("highlight-box");
const addButton = document.querySelector("#highlight-box>button");
const mcqContainer = document.getElementById("mcq-container");
const mainContainer = document.querySelector(".main-container");
const bigQuestion = document.getElementById("big-question");
const facts = document.getElementById("facts");

const questions = firstStageQuestions.map((q) => q.numbers);

let o1,
  o2,
  o3,
  h1,
  h2,
  h3,
  t1,
  t2,
  t3,
  th1,
  th2,
  th3,
  tt1,
  tt2,
  tt3,
  osum,
  tsum,
  hsum,
  thsum,
  ttsum,
  oOverflow,
  tOverflow,
  hOverflow,
  thOverflow,
  ttOverflow;
let questionIndex = 0,
  currentQuestion = null,
  answer,
  templateDataMCQ = null;
let firstStageStep = 0;

function getDataFromQuestion() {
  currentQuestion = questions[questionIndex];
  [tt1, th1, h1, t1, o1] = currentQuestion[0].toString().split("").map(Number);
  [tt2, th2, h2, t2, o2] = currentQuestion[1].toString().split("").map(Number);
  answer = currentQuestion[0] + currentQuestion[1];
  [tt3, th3, h3, t3, o3] = answer.toString().split("").map(Number);
  osum = o1 + o2;
  oOverflow = Number(osum > 9);
  tsum = t1 + t2 + oOverflow;
  tOverflow = Number(tsum > 9);
  hsum = h1 + h2 + tOverflow;
  hOverflow = Number(hsum > 9);
  thsum = th1 + th2 + hOverflow;
  thOverflow = Number(thsum > 9);
  ttsum = tt1 + tt2 + thOverflow;
  ttOverflow = Number(ttsum > 9);
  templateDataMCQ = {
    answer,
    o1,
    o2,
    o3,
    h1,
    h2,
    h3,
    t1,
    t2,
    t3,
    th1,
    th2,
    th3,
    tt1,
    tt2,
    tt3,
    osum,
    tsum,
    hsum,
    thsum,
    ttsum,
    oOverflow,
    tOverflow,
    hOverflow,
    thOverflow,
    ttOverflow,
    osumx: osum,
    tsumx: tsum,
    hsumx: hsum,
    thsumx: thsum,
    ttsumx: ttsum,
    o1x: o1,
    t1x: t1,
    h1x: h1,
    th1x: th1,
    tt1x: tt1,
    o2x: o2,
    t2x: t2,
    h2x: h2,
    th2x: th2,
    tt2x: tt2,
    o3x: o3,
    t3x: t3,
    h3x: h3,
    th3x: th3,
    tt3x: tt3,
    osumx_minus: osum - 1,
    osumx_plus: osum + 1,
    tsumx_minus: tsum - 1,
    tsumx_plus: tsum + 1,
    hsumx_minus: hsum - 1,
    hsumx_plus: hsum + 1,
    thsumx_minus: thsum - 1,
    thsumx_plus: thsum + 1,
    ttsumx_minus: ttsum - 1,
    ttsumx_plus: ttsum + 1,

    // Variations for MCQ options (result digits)
    o3x_minus: o3 + 2,
    o3x_plus: o3 + 1,
    t3x_minus: t3 + 2,
    t3x_plus: t3 + 1,
    h3x_minus: h3 + 2,
    h3x_plus: h3 + 1,
    th3x_minus: th3 + 2,
    th3x_plus: th3 + 1,
    tt3x_minus: tt3 + 2,
    tt3x_plus: tt3 + 1,
    oOverflowStr: oOverflow ? " + 1" : "",
    tOverflowStr: tOverflow ? " + 1" : "",
    hOverflowStr: hOverflow ? " + 1" : "",
    thOverflowStr: thOverflow ? " + 1" : "",
  };
}
[addButton, nextButton].forEach((btn) =>
  btn.addEventListener("click", () => playSound("click"))
);
function fillNumbers() {
  // Deconstruct the numbers from the current question
  const [num1, num2] = currentQuestion;
  const num1Digits = num1.toString().split("");
  const num2Digits = num2.toString().split("");

  // --- Left Panel (Single Digits) ---
  const leftRow1Items = document.querySelectorAll(".left-panel .row-num1.item");
  const leftRow2Items = document.querySelectorAll(".left-panel .row-num2.item");

  // Fill the first number row (e.g., 6 7 5 7 6)
  // Starts from index 1 because the first column is a placeholder
  num1Digits.forEach((digit, index) => {
    leftRow1Items[index].textContent = digit;
  });

  // Fill the second number row (e.g., + 1 5 6 7 8)
  num2Digits.forEach((digit, index) => {
    leftRow2Items[index].textContent = digit;
  });

  // --- Right Panel (Place Values) ---
  const rightRow1Items = document.querySelectorAll(
    ".right-panel .row-num1.item"
  );
  const rightRow2Items = document.querySelectorAll(
    ".right-panel .row-num2.item"
  );
  const placeValues = [10000, 1000, 100, 10, 1];

  // Fill the first number row with place values (e.g., 60000, 7000, 500, 70, 6)
  num1Digits.forEach((digit, index) => {
    rightRow1Items[index].textContent = digit;
  });

  // Fill the second number row with place values (e.g., 10000, 5000, 600, 70, 8)
  num2Digits.forEach((digit, index) => {
    rightRow2Items[index].textContent = digit;
  });
}

// Also, you'll need to call this new function from your `initiate` function.

function showRC(q, show) {
  if (show) {
    document
      .querySelectorAll(q)
      .forEach((el) => el.classList.remove("text-transparent"));
  } else {
    document
      .querySelectorAll(q)
      .forEach((el) => el.classList.add("text-transparent"));
  }
}
function showAddButton(show) {
  const display = show ? "flex" : "none";
  document.querySelector("#highlight-box>button").style.display = display;
}
document
  .querySelector("#highlight-box>button")
  .addEventListener("click", () => {
    showAddButton(false);
  });
function popInNumber(q, text) {
  const container = document.querySelector(q);
  container.innerHTML = `<span style="display: inline-block;">${text}</span>`;
  const span = container.querySelector("span");

  // Animate opacity and scale
  span.animate(
    [
      { opacity: 0, transform: "scale(0)" },
      { opacity: 1, transform: "scale(1)" },
    ],
    {
      duration: 300,
      easing: "ease-out",
      fill: "forwards",
    }
  );
}
function popInResult(tag, num) {
  const q = resultRow[tag];
  popInNumber(q, num);
}
function loadMcqIn(mcqId, onNextClick, onCorrect) {
  showTextWithTag("mcqIn");
  nextButton.disabled = true;
  loadMcq(mcqId, onCorrect); // Pass the onCorrect callback down
  mcqContainer.style.display = "flex";
  nextButton.onclick = () => {
    mcqContainer.style.display = "none";
    onNextClick?.();
  };
}

function loadMcq(mcqId, onCorrect) {
  const templateData = templateDataMCQ;
  const questionEl = document.getElementById("mcq-question");
  const optionsEl = document.getElementById("mcq-options");
  const feedbackEl = document.getElementById("bottom-statement");

  const mcq = mcqData[mcqId];

  if (!mcq) {
    console.error(`Error: MCQ with ID "${mcqId}" not found.`);
    return;
  }

  optionsEl.innerHTML = "";
  optionsEl.style.pointerEvents = "auto";

  const fillTemplate = (text) =>
    text.replace(/\{\{(\w+)\}\}/g, (_, key) => templateData[key] ?? "");

  questionEl.innerHTML = fillTemplate(mcq.question);

  mcq.options.forEach((optionText, index) => {
    const optionDiv = document.createElement("div");
    optionDiv.classList.add("option");
    optionDiv.textContent = fillTemplate(optionText);

    optionDiv.addEventListener("click", () => {
      let feedbackText = "";
      if (index === mcq.answer_index) {
        optionsEl.style.pointerEvents = "none";
        optionDiv.classList.add("correct");
        feedbackText = mcq.correct_feedback;
        playSound("correct");
        onCorrect?.(); // *** EXECUTE THE onCorrect CALLBACK HERE ***
        nextButton.disabled = false;
      } else {
        optionDiv.classList.add("wrong");
        feedbackText = mcq.wrong_feedback;
        playSound("wrong");
      }

      if (feedbackEl) {
        feedbackEl.textContent = feedbackText;
      }
    });

    optionsEl.appendChild(optionDiv);
  });
}
function highlightColumnBorder(query) {
  borderGreen(false);
  const elements = document.querySelectorAll(`${query}`);
  const box = document.getElementById("highlight-box");
  box.style.display = "block"; // show box

  const firstRect = elements[0].getBoundingClientRect();
  const lastRect = elements[elements.length - 1].getBoundingClientRect();
  const left = firstRect.left;
  const top = firstRect.top;
  const right = firstRect.right;
  const bottom = lastRect.bottom;

  box.style.left = `${left}px`;
  box.style.top = `${top + scrollY}px`;
  box.style.width = `${right - left}px`;
  box.style.height = `${bottom - top}px`;
}

function unhighlightColumn() {
  const box = document.getElementById("highlight-box");
  box.style.display = "none";
}

function highlightRowBorder(query, heightFraction = 1) {
  borderGreen(false);
  const elements = document.querySelectorAll(`${query}`);
  const box = document.getElementById("highlight-box");
  box.style.display = "block"; // show box

  const firstRect = elements[0].getBoundingClientRect();
  const lastRect = elements[elements.length - 1].getBoundingClientRect();
  const left = firstRect.left;
  const top = firstRect.top;
  const right = lastRect.right;
  const bottom = firstRect.bottom;
  const offset = 1;
  box.style.left = `${left - offset}px`;
  box.style.top = `${top - offset}px`;
  box.style.width = `${right - left + 2 * offset}px`;
  box.style.height = `${(bottom - top) / heightFraction + 2 * offset}px`;
}

function borderGreen(bool) {
  if (bool) {
    document.querySelector("#highlight-box").classList.add("green-box");
  } else {
    document.querySelector("#highlight-box").classList.remove("green-box");
  }
}
function borderRed(bool) {
  if (bool) {
    document.querySelector("#highlight-box").classList.add("red-box");
  } else {
    document.querySelector("#highlight-box").classList.remove("red-box");
  }
}
function vibrateElementWithTag(tag, bool) {
  vibrateElement(document.querySelector(`${tag}`), bool);
}
function toggleRightPanelStyle(isSimplified) {
  const rightPanelContainer = document.querySelector(
    ".right-panel .addition-container"
  );

  if (rightPanelContainer) {
    if (isSimplified) {
      // Add the class to apply the simplified styles
      rightPanelContainer.classList.add("simplified-mode");
    } else {
      // Remove the class to revert to the default styles
      rightPanelContainer.classList.remove("simplified-mode");
    }
  }
}
// --- NEW FIRST STAGE ---

function highlightText(fullText, partsToHighlight, className) {
  let highlightedText = fullText;
  partsToHighlight.forEach((part) => {
    const regex = new RegExp(
      part.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"),
      "g"
    );
    highlightedText = highlightedText.replace(
      regex,
      `<span class="${className}">${part}</span>`
    );
  });
  return highlightedText;
}

function firstStage_step1() {
  populateDnd(dndData);
  mainContainer.classList.add("first-stage");
  const currentProblem = firstStageQuestions[questionIndex];
  bigQuestion.innerHTML = currentProblem.question;
  facts.innerHTML = "";
  facts.style.display = "none";
  showTextWithTag("first_stage_1");
  nextButton.disabled = false;
  showFtue(nextButton);
  nextButton.onclick = firstStage_step2;
}

function firstStage_step2() {
  facts.style.display = "flex";
  hideFtue();
  const currentProblem = firstStageQuestions[questionIndex];
  bigQuestion.innerHTML = highlightText(
    currentProblem.question,
    currentProblem.given,
    "yellow-bg"
  );
  console.log(currentProblem);

  facts.innerHTML = "";
  currentProblem.givenFacts.forEach((fact) => {
    facts.innerHTML += `<span>${fact}</span>`;
  });

  showTextWithTag("first_stage_2");
  showFtue(nextButton);
  nextButton.onclick = firstStage_step3;
}

function firstStage_step3() {
  hideFtue();
  const currentProblem = firstStageQuestions[questionIndex];
  // Only highlight the 'toFind' parts, removing the previous highlight.
  let highlightedQuestion = highlightText(
    currentProblem.question,
    currentProblem.toFind,
    "green-bg"
  );
  bigQuestion.innerHTML = highlightedQuestion;

  facts.innerHTML = "";
  currentProblem.toFindFacts.forEach((fact) => {
    facts.innerHTML += `<span>${fact}</span>`;
  });

  showTextWithTag("first_stage_3");
  showFtue(nextButton);
  nextButton.onclick = dragAndDropStage;
}
function populateDnd(data) {
  // Set the main equation title
  document.querySelector(
    ".dnd-equation .dnd-text"
  ).textContent = `${data.mainTitle} =`;

  // Set the text for the draggable cards
  document.getElementById("money-at-start").textContent =
    data.cards.moneyAtStart;
  document.getElementById("toy-robot-cost").textContent =
    data.cards.toyRobotCost;
  document.getElementById("spinning-top-cost").textContent =
    data.cards.spinningTopCost;

  // Set the title for the combined cost section
  document.querySelector(".dnd-title").textContent = data.combinedTitle;
}
function dragAndDropStage() {
  hideFtue();
  bigQuestion.style.display = "none";
  facts.style.display = "none";

  const dragAndDropContainer = document.getElementById("drag-and-drop");
  dragAndDropContainer.style.display = "flex";

  showText(textPool.drag_the_cards);
  nextButton.disabled = true;

  const cards = document.querySelectorAll(".dnd-card");
  const dropzones = document.querySelectorAll(".dnd-dropzone");
  let correctlyPlacedCount = 0;

  // --- NEW: Variables for Touch State ---
  let draggedCard = null; // The card being dragged (for touch)
  let ghostElement = null; // The clone that follows the finger
  let currentOverZone = null; // The dropzone the finger is currently over
  let touchOffsetX = 0;
  let touchOffsetY = 0;

  // --- REFACTORED: Core Drop Logic ---
  // This logic is now in its own function to be shared by mouse and touch events.
  function handleDrop(card, zone) {
    if (!card || !zone) {
      return;
    }

    const cardId = card.id;
    const allowedCards = zone.getAttribute("data-correct-card").split(",");

    if (zone.children.length > 0) {
      // Zone is already full
      // If it's an incorrect drop, we might still want feedback
      if (!allowedCards.includes(cardId)) {
        triggerIncorrectDrop(zone);
      }
      return;
    }

    if (allowedCards.includes(cardId)) {
      // Correct drop
      playSound("correct");
      zone.appendChild(card);
      card.classList.add("placed");
      card.setAttribute("draggable", "false");
      correctlyPlacedCount++;

      if (correctlyPlacedCount === cards.length) {
        showText(textPool.afterdnd);
        showMoneyValues();
        nextButton.disabled = false;
        showFtue(nextButton);
      }
    } else {
      // Incorrect drop
      triggerIncorrectDrop(zone);
    }
  }

  // --- NEW: Helper for incorrect drop feedback ---
  function triggerIncorrectDrop(zone) {
    playSound("wrong");
    const combinedZone = zone.closest(".dnd-combined-zone");
    const targetForFeedback = combinedZone || zone;

    targetForFeedback.classList.add("incorrect");
    setTimeout(() => {
      targetForFeedback.classList.remove("incorrect");
    }, 500);
  }

  // --- 1. Mouse Event Listeners (Original, but simplified) ---

  cards.forEach((card) => {
    card.addEventListener("dragstart", (e) => {
      if (card.classList.contains("placed")) {
        e.preventDefault();
        return;
      }
      e.dataTransfer.setData("text/plain", e.target.id);
      setTimeout(() => {
        card.classList.add("dragging");
      }, 0);
    });

    card.addEventListener("dragend", () => {
      card.classList.remove("dragging");
    });
  });

  dropzones.forEach((zone) => {
    zone.addEventListener("dragover", (e) => {
      e.preventDefault();
      if (zone.children.length === 0) {
        zone.classList.add("over");
      }
    });

    zone.addEventListener("dragleave", () => {
      zone.classList.remove("over");
    });

    zone.addEventListener("drop", (e) => {
      e.preventDefault();
      zone.classList.remove("over");

      const cardId = e.dataTransfer.getData("text/plain");
      const card = document.getElementById(cardId);

      // Use the refactored drop logic
      handleDrop(card, zone);
    });
  });

  // --- 2. NEW: Touch Event Listeners ---

  cards.forEach((card) => {
    // We use { passive: false } to be able to call e.preventDefault()
    card.addEventListener("touchstart", handleTouchStart, { passive: false });
  });

  function handleTouchStart(e) {
    const card = e.target.closest(".dnd-card");

    if (!card || card.classList.contains("placed")) {
      return;
    }

    // Prevent page scrolling while dragging
    e.preventDefault();

    draggedCard = card;
    const touch = e.targetTouches[0];

    // --- Create and position the ghost element ---
    ghostElement = card.cloneNode(true);
    ghostElement.id = "ghost-card-active"; // Avoid duplicate IDs
    ghostElement.classList.add("ghost-card");
    document.body.appendChild(ghostElement);

    // Calculate offset: where did the user touch the card?
    const rect = card.getBoundingClientRect();
    touchOffsetX = touch.clientX - rect.left;
    touchOffsetY = touch.clientY - rect.top;

    // Position ghost element under the finger
    ghostElement.style.left = `${touch.clientX - touchOffsetX}px`;
    ghostElement.style.top = `${touch.clientY - touchOffsetY}px`;

    // Hide the original card
    card.classList.add("dragging");

    // Add listeners to the whole document to track movement
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);
    document.addEventListener("touchcancel", handleTouchEnd); // In case of interruption
  }

  function handleTouchMove(e) {
    if (!draggedCard || !ghostElement) return;

    // Prevent scrolling
    e.preventDefault();

    const touch = e.targetTouches[0];

    // Move the ghost element with the finger
    ghostElement.style.left = `${touch.clientX - touchOffsetX}px`;
    ghostElement.style.top = `${touch.clientY - touchOffsetY}px`;

    // --- Simulate 'dragover' and 'dragleave' ---
    // Hide ghost to check what's underneath
    ghostElement.style.display = "none";
    const elementUnderFinger = document.elementFromPoint(
      touch.clientX,
      touch.clientY
    );
    ghostElement.style.display = ""; // Show it again immediately

    const newZone = elementUnderFinger
      ? elementUnderFinger.closest(".dnd-dropzone")
      : null;

    if (newZone !== currentOverZone) {
      // We've moved to a new zone (or off a zone)
      if (currentOverZone) {
        currentOverZone.classList.remove("over"); // Simulate 'dragleave'
      }

      currentOverZone = newZone;

      if (currentOverZone && currentOverZone.children.length === 0) {
        currentOverZone.classList.add("over"); // Simulate 'dragover'
      }
    }
  }

  function handleTouchEnd(e) {
    // Clean up document listeners
    document.removeEventListener("touchmove", handleTouchMove);
    document.removeEventListener("touchend", handleTouchEnd);
    document.removeEventListener("touchcancel", handleTouchEnd);

    // --- Simulate 'drop' ---
    if (currentOverZone) {
      currentOverZone.classList.remove("over");
      // Use the refactored drop logic
      handleDrop(draggedCard, currentOverZone);
    }

    // Clean up ghost element
    if (ghostElement) {
      document.body.removeChild(ghostElement);
      ghostElement = null;
    }

    // Show original card again
    if (draggedCard) {
      draggedCard.classList.remove("dragging");
    }

    // Reset all state variables
    draggedCard = null;
    currentOverZone = null;
    touchOffsetX = 0;
    touchOffsetY = 0;
  }

  // --- Original Next Button Logic ---
  nextButton.onclick = () => {
    dragAndDropContainer.style.display = "none";
    firstStage_step4();
  };
}
function showMoneyValues() {
  // --- Get the elements for the new frame ---
  const title = document.querySelector(".dnd-title");
  const valuesContainer = document.querySelector(".dnd-values");
  const startMoneyEl = document.getElementById("start-money-value");
  const cost1El = document.getElementById("cost1-value");
  const cost2El = document.getElementById("cost2-value");

  // --- Data for the values ---
  const problemData = firstStageQuestions[questionIndex];
  const startMoney = problemData.total;
  const costs = {
    "toy-robot-cost": problemData.numbers[0],
    "spinning-top-cost": problemData.numbers[1],
  };

  // --- Get the dropped cards in the combined zone ---
  const combinedDropzones = document.querySelectorAll(
    ".dnd-combined-zone .dnd-dropzone"
  );
  const firstCardId = combinedDropzones[0].firstChild.id;
  const secondCardId = combinedDropzones[1].firstChild.id;

  // --- Populate with numbers based on the drop order ---
  startMoneyEl.textContent = startMoney;
  cost1El.textContent = costs[firstCardId];
  cost2El.textContent = costs[secondCardId];

  // --- Make the new frame visible with animations ---
  title.classList.add("visible");
  valuesContainer.classList.add("visible");
}

function firstStage_step4() {
  hideFtue();

  // Undisplay the question and facts divs
  bigQuestion.style.display = "none";
  facts.style.display = "none";

  // Get the new container and display it
  const additionWordProblem = document.getElementById("addition-word-problem");
  if (additionWordProblem) {
    additionWordProblem.style.display = "flex";

    const currentProblem = firstStageQuestions[questionIndex];
    const lines = additionWordProblem.querySelectorAll(".awp-line");

    if (lines.length >= 4) {
      // Line 1: First given fact and number
      const fact1Text = currentProblem.givenFacts[2].split(":")[0].trim();
      lines[0].querySelector(".awp-text").textContent = fact1Text;
      lines[0].querySelector(".awp-number").textContent =
        currentProblem.numbers[0];

      // Line 2: Second given fact and number
      const fact2Text = currentProblem.givenFacts[3].split(":")[0].trim();
      lines[1].querySelector(".awp-text").textContent = fact2Text;
      lines[1].querySelector(".awp-number").textContent =
        currentProblem.numbers[1] + " +";

      // Line 4: "To Find" text, adapted from the image and problem context
      const toFindText = textPool.total_money_spent;
      lines[3].querySelector(".awp-text").textContent = toFindText;
    }
  }

  showTextWithTag("first_stage_4");
  nextButton.disabled = false;
  showFtue(nextButton);
  nextButton.onclick = startMainApplet;
}

function startMainApplet() {
  hideFtue();
  mainContainer.classList.remove("first-stage");
  stage0();
  stage1();
}

// --- END OF NEW FIRST STAGE ---

function stage0() {
  document.querySelector(".left-panel .addition-container").style.display =
    "none";
  toggleRightPanelStyle(true);
  showTextWithTag("start");
  nextButton.disabled = false;
  showFtue(nextButton);
  nextButton.onclick = stage1;
}
function stage1() {
  toggleRightPanelStyle(false);
  playSound("click");
  showTextWithTag("after_split");
  hideFtue();
  showFtue(nextButton);
  nextButton.onclick = onesMcq1;
}
function stage2() {
  playSound("click");
  hideFtue();
  showRC(RCmap.rightRowNum1, true);
  showTextWithTag("split_number2");
  highlightRowBorder(RCmap.num2Row);
  highlightBox.classList.add("clickable");
  highlightBox.onclick = stage3;
  setTimeout(() => {
    showFtue(highlightBox, true);
  }, 500);
}
function stage3() {
  playSound("click");
  showTextWithTag("after_split");
  hideFtue();
  showRC(RCmap.rightRowNum2, true);
  showRC(RCmap.rightRowLine, true);
  nextButton.disabled = false;
  highlightBox.classList.remove("clickable");
  highlightBox.onclick = null;
  unhighlightColumn();
  showFtue(nextButton);
  nextButton.onclick = onesMcq2;
}
function onesMcq1() {
  hideFtue();

  highlightColumnBorder(RCmap.oColumn);
  setTimeout(() => {
    showAddButton(true);
    showFtue(addButton);
  }, 500);
  nextButton.disabled = true;
  addButton.onclick = onesMcq2;
  showTextWithTag("ones_1");
}
function onesMcq2() {
  hideFtue();
  loadMcqIn(
    "add_ones",
    () => {
      showAddButton(false);

      if (oOverflow) {
        vibrateElementWithTag(resultRow.o, true);
        showTextWithTag("ones_carryover");
        const onesResultCell = document.querySelector(resultRow.o);
        showFtue(onesResultCell, true);
        highlightBox.onclick = afterMcq2;
        highlightBox.classList.add("clickable");
        nextButton.disabled = true;
        borderRed(true);
      } else {
        nextButton.onclick = tens1;
        showTextWithTag("ones_complete");
        borderGreen(true);
      }
    },
    () => {
      popInResult("o", osum);
    }
  );
}
function afterMcq2() {
  hideFtue();
  splitOverlay("mcq_one");
  loadMcqIn("ones_split", () => {
    // popInResult("o", splitNumber(osum));
    nextButton.disabled = true; // Disable the next button

    splitOverlay(false);
    setTimeout(() => {
      moveCarry();
    }, 500);
  });
}

function moveCarry() {
  borderRed(false);
  borderGreen(true)
  highlightBox.onclick = null;
  highlightBox.classList.remove("clickable");
  const onesResultCell = document.querySelector(resultRow.o);
  onesResultCell.classList.remove("clickable");
  onesResultCell.onclick = null; // Remove the click event
  vibrateElementWithTag(resultRow.o, false);
  hideFtue();
  animateCarry(resultRow.o, carryRow.t, "o");
  showTextWithTag("ones_complete");
  nextButton.disabled = false; // Re-enable the next button for the next step
  showFtue(nextButton);
  nextButton.onclick = tens1;
}
function tens1() {
  borderGreen(false);
  highlightColumnBorder(RCmap.tColumn);
  setTimeout(() => {
    showAddButton(true);
    showFtue(addButton);
  }, 500);
  nextButton.disabled = true;
  addButton.onclick = tensMcq2;
}
function splitNumber(n) {
  if (n < 10) return [n, 0]; // No split needed for single-digit numbers

  const length = n.toString().length;
  const base = Math.pow(10, length - 1);
  const remainder = n - base;

  return `${base}<br>+${remainder}`;
}
function animateCarry(q1, q2, tag) {
  const tagToResult = { o: o3, t: t3, h: h3, th: th3 };
  const text = 1;

  const source = document.querySelector(q1);
  const target = document.querySelector(q2);
  if (!source || !target) return;

  // Create floating element
  const floating = document.createElement("span");
  floating.textContent = text;
  floating.style.position = "absolute";
  floating.style.zIndex = 1000;
  floating.style.pointerEvents = "none";
  floating.style.transition = "transform 0.5s ease, opacity 0.5s ease";
  floating.style.opacity = "1";
  floating.style.fontSize = "2rem";
  floating.style.color = "white";

  // Get positions
  const srcRect = source.getBoundingClientRect();
  const tgtRect = target.getBoundingClientRect();

  // Set initial position
  const startX = srcRect.left + srcRect.width / 2;
  const startY = srcRect.top + srcRect.height / 2;
  const endX = tgtRect.left + tgtRect.width / 2;
  const endY = tgtRect.top + tgtRect.height / 2;

  floating.style.left = `${startX}px`;
  floating.style.top = `${startY}px`;
  floating.style.transform = `translate(-50%, -50%) scale(1)`;

  document.body.appendChild(floating);

  // Force layout before animating
  requestAnimationFrame(() => {
    const dx = endX - startX;
    const dy = endY - startY;

    floating.style.transform = `translate(${dx}px, ${dy}px) scale(0.5)`;
  });
  console.log(tagToResult[tag]);

  // Clean up after animation
  setTimeout(() => {
    document.body.removeChild(floating);
    target.innerHTML = `<span>${text}</span>`;
    document.querySelector(resultRow[tag]).textContent = tagToResult[tag];
  }, 500);
}
function splitOverlay(tag) {
  const mcqOverlay = document.getElementById("mcq-overlay");
  if (!tag) {
    mcqOverlay.classList.remove("split");
    return;
  }
  const finalText = fillPlaceholders(textPool[tag], templateDataMCQ);
  const leftInfo = document.getElementById("left-info");
  leftInfo.innerHTML = finalText;
  mcqOverlay.classList.add("split");
}

function tensMcq2() {
  hideFtue();
  loadMcqIn(
    "add_tens",
    () => {
      showAddButton(false);

      if (tOverflow) {
        vibrateElementWithTag(resultRow.t, true);
        showTextWithTag("tens_carryover");
        const tensResultCell = document.querySelector(resultRow.t);
        showFtue(tensResultCell, true);
        highlightBox.onclick = afterTensMcq2;
        highlightBox.classList.add("clickable");
        nextButton.disabled = true;
        borderRed(true);
      } else {
        nextButton.onclick = hundreds1;
        showTextWithTag("tens_complete");
        borderGreen(true);
      }
    },
    () => {
      popInResult("t", tsum);
    }
  );
}

function afterTensMcq2() {
  hideFtue();
  splitOverlay("mcq_ten");
  loadMcqIn("tens_split", () => {
    nextButton.disabled = true;

    splitOverlay(false);
    setTimeout(() => {
      moveTensCarry();
    }, 500);
  });
}

function moveTensCarry() {
  borderRed(false);
  borderGreen(true);
  highlightBox.classList.remove("clickable");
  highlightBox.onclick = null;
  const tensResultCell = document.querySelector(resultRow.t);
  tensResultCell.classList.remove("clickable");
  tensResultCell.onclick = null;
  vibrateElementWithTag(resultRow.t, false);
  hideFtue();
  animateCarry(resultRow.t, carryRow.h, "t");
  showTextWithTag("tens_complete");
  nextButton.disabled = false;
  showFtue(nextButton);
  nextButton.onclick = hundreds1;
}

// --- HUNDREDS PLACE FLOW ---
function hundreds1() {
  borderGreen(false);
  hideFtue();
  unhighlightColumn();
  showTextWithTag("hundreds_1");
  highlightColumnBorder(RCmap.hColumn);
  setTimeout(() => {
    showAddButton(true);
    showFtue(addButton);
  }, 500);
  nextButton.disabled = true;
  addButton.onclick = hundredsMcq2;
}

function hundredsMcq2() {
  hideFtue();
  loadMcqIn(
    "add_hundreds",
    () => {
      showAddButton(false);

      if (hOverflow) {
        vibrateElementWithTag(resultRow.h, true);
        showTextWithTag("hundreds_carryover");
        const hundredsResultCell = document.querySelector(resultRow.h);
        showFtue(hundredsResultCell, true);
        highlightBox.onclick = afterHundredsMcq2;
        highlightBox.classList.add("clickable");
        nextButton.disabled = true;
        borderRed(true);
      } else {
        nextButton.onclick = thousands1;
        showTextWithTag("hundreds_complete");
        borderGreen(true);
      }
    },
    () => {
      popInResult("h", hsum);
    }
  );
}

function afterHundredsMcq2() {
  hideFtue();
  splitOverlay("mcq_hundred");
  loadMcqIn("hundreds_split", () => {
    nextButton.disabled = true;

    splitOverlay(false);
    setTimeout(() => {
      moveHundredsCarry();
    }, 500);
  });
}

function moveHundredsCarry() {
  borderRed(false);
  borderGreen(true);
  highlightBox.classList.remove("clickable");
  highlightBox.onclick = null;
  const hundredsResultCell = document.querySelector(resultRow.h);
  hundredsResultCell.classList.remove("clickable");
  hundredsResultCell.onclick = null;
  vibrateElementWithTag(resultRow.h, false);
  hideFtue();
  animateCarry(resultRow.h, carryRow.th, "h");
  showTextWithTag("hundreds_complete");
  nextButton.disabled = false;
  showFtue(nextButton);
  nextButton.onclick = thousands1;
}

// --- THOUSANDS PLACE FLOW ---
function thousands1() {
  borderGreen(false);
  hideFtue();
  unhighlightColumn();
  showTextWithTag("thousands_1");
  highlightColumnBorder(RCmap.thColumn);
  setTimeout(() => {
    showAddButton(true);
    showFtue(addButton);
  }, 500);
  nextButton.disabled = true;
  addButton.onclick = thousandsMcq2;
}

function thousandsMcq2() {
  hideFtue();
  loadMcqIn(
    "add_thousands",
    () => {
      borderGreen(true);
      if (thOverflow) {
        vibrateElementWithTag(resultRow.th, true);
        showTextWithTag("thousands_carryover");
        const thousandsResultCell = document.querySelector(resultRow.th);
        showFtue(thousandsResultCell, true);
        highlightBox.onclick = afterThousandsMcq2;
        highlightBox.classList.add("clickable");
        nextButton.disabled = true;
        borderRed(true);
      } else {
        nextButton.onclick = tenThousands1;
        showTextWithTag("thousands_complete");
        borderGreen(true);
      }
    },
    () => {
      popInResult("th", thsum);

    }
  );
}

function afterThousandsMcq2() {
  hideFtue();
  splitOverlay("mcq_thousand");
  loadMcqIn("thousands_split", () => {
    nextButton.disabled = true;

    splitOverlay(false);
    setTimeout(() => {
      moveThousandsCarry();
    }, 500);
  });
}

function moveThousandsCarry() {
  borderRed(false);
  borderGreen(true);
  highlightBox.classList.remove("clickable");
  highlightBox.onclick = null;
  const thousandsResultCell = document.querySelector(resultRow.th);
  thousandsResultCell.classList.remove("clickable");
  thousandsResultCell.onclick = null;
  vibrateElementWithTag(resultRow.th, false);
  hideFtue();
  animateCarry(resultRow.th, carryRow.tth, "th");
  showTextWithTag("thousands_complete");
  nextButton.disabled = false;
  showFtue(nextButton);
  nextButton.onclick = tenThousands1;
}

// --- TEN THOUSANDS PLACE FLOW ---
function tenThousands1() {
  borderGreen(false);
  hideFtue();
  unhighlightColumn();
  showTextWithTag("ten_thousands_1");
  highlightColumnBorder(RCmap.tthColumn);
  setTimeout(() => {
    showAddButton(true);
    showFtue(addButton);
  }, 500);
  nextButton.disabled = true;
  addButton.onclick = tenThousandsMcq2;
}

function tenThousandsMcq2() {
  hideFtue();
  loadMcqIn(
    "add_ten_thousands",
    () => {
      showAddButton(false);
      unhighlightColumn();

      showTextWithTag("ten_thousands_complete");
      nextButton.disabled = false;
      showFtue(nextButton);
      endStage();
    },
    () => {
      popInResult("tth", ttsum);
      borderGreen(true);
    }
  );
}

// --- END STAGE ---
function endStage() {
  nextButton.disabled = false;
  hideFtue();
  highlightRowBorder(".right-panel .row-result");
  // unhighlightColumn();
  document.querySelector(".left-panel .addition-container").style.display =
    "grid";
  // Final reveal of the answer in the left panel
  const leftResultItems = document.querySelectorAll(
    ".left-panel .row-result.item"
  );
  const answerDigits = answer.toString().split("");
  answerDigits.forEach((digit, index) => {
    // Ensure the element exists before setting textContent
    if (leftResultItems[index]) {
      leftResultItems[index].textContent = digit;
    }
  });

  // Add the final answer to the template data for the summary text
  templateDataMCQ.answer = answer;
  const finalText = fillPlaceholders(textPool.final_summary, templateDataMCQ);
  showText(finalText);

  // Transition to the final summary screen
  nextButton.textContent = buttonText.next;
  nextButton.onclick = finalSummaryStage;
  showFtue(nextButton);
}

function finalSummaryStage() {
  unhighlightColumn();
  hideFtue();
  mainContainer.classList.add("first-stage");

  // Hide the original question and facts containers
  bigQuestion.style.display = "none";
  facts.style.display = "none";

  // Show and populate the addition word problem view
  const additionWordProblem = document.getElementById("addition-word-problem");
  additionWordProblem.style.display = "flex";

  const currentProblem = firstStageQuestions[questionIndex];
  const lines = additionWordProblem.querySelectorAll(".awp-line");

  if (lines.length >= 4) {
    // Repopulate the problem text for context
    // const fact1Text = currentProblem.givenFacts[1].split(":")[0].trim();
    // lines[0].querySelector(".awp-text").textContent = fact1Text + " =";
    // lines[0].querySelector(".awp-number").textContent =
    //   currentProblem.numbers[0];

    // const fact2Text = currentProblem.givenFacts[2].split(":")[0].trim();
    // lines[1].querySelector(".awp-text").textContent = fact2Text + " =";
    // lines[1].querySelector(".awp-number").textContent =
    //   "+ " + currentProblem.numbers[1];

    // const toFindText = currentProblem.total_money_spent
    // lines[3].querySelector(".awp-text").textContent = toFindText + " =";

    // Find the box and fill it with the calculated answer
    const answerBox = lines[3].querySelector(".awp-box");
    if (answerBox) {
      answerBox.textContent = answer; // Set the text to the final answer
      answerBox.style.border = "none"; // Remove the border to make it look like a label
    }
  }

  // Show the summary text in the bottom panel
  showTextWithTag("move_to_subtraction");

  // Play celebration effects
  playSound("congrats");
  // confettiBurst();
  nextButton.onclick = moveToSubtraction;
}
const moveToSubtraction = () => {
  sessionStorage.setItem("additionCompleted", "true");
  window.location.href = "subtraction/index.html";
};

// GEMINI END
function initiate() {
  getDataFromQuestion();
  fillNumbers();
  fillHeaders();
  firstStage_step1();
}

initiate();

function showTextWithTag(tag, colorClass) {
  const finalText = fillPlaceholders(textPool[tag], templateDataMCQ);
  showText(finalText, colorClass);
}
function fillHeaders() {
  const headerElements = document.querySelectorAll(".right-panel .row-header");
  headerElements.forEach((element, index) => {
    if (headerArray[index]) {
      element.textContent = headerArray[index];
    }
  });
}

function loadNextQuestion() {
  // 1. Move to the next question index.
  questionIndex++;

  // 2. Check if all questions have been completed.
  if (questionIndex >= questions.length) {
    // If there are no more questions, show the final completion overlay and disable the button.
    triggerFullScreenOverlay(true);
    nextButton.disabled = true;
    return;
  }

  // 3. Reset the UI elements from the previous question.
  // Clear all result cells in both the left and right panels.
  document.querySelectorAll(".row-result").forEach((cell) => {
    cell.textContent = "";
    cell.innerHTML = ""; // Use innerHTML to clear any potential HTML content like <br>
  });

  // Clear all carry-over cells.
  document.querySelectorAll(".row-carry").forEach((cell) => {
    cell.textContent = "";
    cell.innerHTML = "";
  });

  // Reset the "Next" button's text from "Try New" back to "Next".
  nextButton.textContent = buttonText.next;

  // Hide any active highlights or FTUE elements.
  unhighlightColumn();
  hideFtue();

  // 4. Initiate the applet with the new question data.
  // This function will set up the new numbers and reset the flow to the first stage.
  initiate();
}
