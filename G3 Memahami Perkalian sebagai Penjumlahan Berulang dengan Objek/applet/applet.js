// --- DOM Element References ---
const grid = document.getElementById("graph-grid");
const colSlider = document.getElementById("column-slider");
const rowSlider = document.getElementById("row-slider");
const xAxisLabels = document.getElementById("x-axis-labels");
const yAxisLabels = document.getElementById("y-axis-labels");
const vSliderLabels = document.getElementById("v-slider-labels");
const hSliderLabels = document.getElementById("h-slider-labels");
const appletContainer = document.querySelector(".applet-container");
const appletH1 = document.querySelector("#applet>.h1");
const leftAnimationBox = document.getElementById("left-animation-box");
const rightAnimationBox = document.getElementById("right-animation-box");
const sheet = document.styleSheets[0];
const cornerText = document.getElementById("corner-text");
const upperControls = document.getElementById("upper-controls");
const graphContainer = document.querySelector(".graph-main-content");
// --- Constants ---
const MAX_ROWS = 8;
const MAX_COLS = 8;
const max_cols_actual = 6;

let question = {
  col: 5,
  row: 4,
};
const imageTags = ["cup", "dumpling"];
let backgroundClasses = ["cup-background", "dumpling-background"];
function setClass() {
  backgroundClasses.forEach((className) => {
    graphContainer.classList.remove(className);
  });
  graphContainer.classList.add(backgroundClasses[questionIndex]);
  graphContainer.classList.add("first-stage")
}
function setCornerText(){
  const img = cornerText.querySelector("img");
  const p = cornerText.querySelector("p");
  img.src = `assets/${imageTags[questionIndex]}.png`;
  p.innerHTML = fillPlaceholders(
    leftInstructions.cornerText,
    templateData
  );
  
}
// --- State ---
let cells = [];
let xAxisSpans = [];
let yAxisSpans = [];
let duplicateCells = [];
let stage = 0;
let templateData = null;
let questionIndex = 0;

/**
 * Initializes or resets the applet for a new question.
 * This function now includes a full reset of the UI and state.
 */
function initialize() {
  // --- Full Reset Section ---

  // 1. Clear dynamically created DOM elements from previous run
  grid.innerHTML = "";
  xAxisLabels.innerHTML = "";
  yAxisLabels.innerHTML = "";
  vSliderLabels.innerHTML = "";
  hSliderLabels.innerHTML = "";
  leftAnimationBox.innerHTML = "";
  rightAnimationBox.innerHTML = "";

  // 2. Remove any leftover '.duplicate-cell' elements from the body
  const oldDuplicates = document.querySelectorAll(".duplicate-cell");
  oldDuplicates.forEach((cell) => cell.remove());

  // 3. Reset sliders to their initial values
  colSlider.value = 0;
  rowSlider.value = 1;

  // 4. Reset UI element visibility to the initial state
  appletH1.style.display = "block";
  appletContainer.style.display = "none";
  colSlider.parentElement.style.display = "none";
  rowSlider.parentElement.style.display = "none";
  leftAnimationBox.style.display = "none";
  rightAnimationBox.style.display = "none";
  document.getElementById("bottom-text").style.display = "none";
  cornerText.style.display = "block";

  // 5. Reset buttons to their initial state
  nextButton.disabled = false;
  previousButton.style.display = "none";
  setNext("start"); // Resets the Next button text

  // 6. Clear the MCQ options from the context panel
  const contextDiv = document.getElementById("context");
  let optionsContainer = document.getElementById("context-options");
  if (optionsContainer) {
    optionsContainer.remove();
  }

  // --- Reset State Variables ---
  cells = [];
  xAxisSpans = [];
  yAxisSpans = [];
  duplicateCells = [];
  stage = 0;
  templateData = null;
  question = questions[questionIndex];

  // --- Re-creation and Setup Section (from original code) ---

  // Create all 64 grid cells and store their references
  for (let r = 0; r < MAX_ROWS; r++) {
    cells[r] = [];
    for (let c = 0; c < MAX_COLS; c++) {
      const cell = document.createElement("div");
      cell.classList.add("grid-cell");
      grid.appendChild(cell);
      cells[r][c] = cell;
    }
  }

  // Create static axis and slider labels once
  createStaticLabels();

  // Add event listeners to sliders
  colSlider.addEventListener("input", handleSliderChange);
  rowSlider.addEventListener("input", handleSliderChange);

  // Initial UI update based on default slider values
  setClass();
  updateUI();
  setUpAnimationBox();

  templateData = {
    item: question.item,
    item_plural: question.item_plural,
    group_name: question.group_name,
    group_name_plural: question.group_name_plural,
    row_count: question.row,
    col_count: question.col,
    ans: question.row * question.col,
    repeated_addition_string: repeatedAdditionString(
      question.col,
      question.row
    ),
  };
  upperControls.textContent = fillPlaceholders(
    leftInstructions.question,
    templateData
  );
  appletH1.querySelector("img").src = `assets/${imageTags[questionIndex]}.png`;
  setCornerText();

  // Start the sequence for the new question
  atStage0();
}

/**
 * Creates all the labels for axes and sliders one time.
 */
function createStaticLabels() {
  // X-Axis Labels (Horizontal)
  for (let i = 1; i <= MAX_COLS; i++) {
    const label = document.createElement("span");
    label.textContent = i;
    xAxisLabels.appendChild(label);
    xAxisSpans.push(label);
  }

  // Y-Axis Labels (Vertical)
  // Create them in reverse order for correct visual layout with flex-direction: column
  for (let i = 7; i >= 1; i--) {
    const label = document.createElement("span");
    label.textContent = i;
    yAxisLabels.appendChild(label);
    yAxisSpans.push(label);
  }
  yAxisSpans.reverse(); // Correct the array order to match index (0 to 7)

  // Vertical Slider Labels
  for (let i = 0; i <= max_cols_actual; i++) {
    const label = document.createElement("span");
    label.textContent = i;
    vSliderLabels.appendChild(label);
  }
  for (let i = 0; i <= MAX_ROWS; i++) {
    const label = document.createElement("span");
    label.textContent = i;
    hSliderLabels.appendChild(label);
  }
}

function updateUI() {
  const numCols = parseInt(colSlider.value, 10);
  const numRows = parseInt(rowSlider.value, 10);
  vibrateElement(grid, false);
  // Update Grid Cells
  for (let r = 0; r < MAX_ROWS; r++) {
    for (let c = 0; c < MAX_COLS; c++) {
      // We reference the cell from our 2D array. Note that the array is
      // indexed from top-to-bottom (row 0 is the top row).
      const cell = cells[r][c];

      // Determine if a cell should be visible.
      // The condition `r >= MAX_ROWS - numRows` selects the bottom `numRows` of the grid.
      const isVisible = r >= MAX_ROWS - numRows && c < numCols;

      if (isVisible) {
        // To calculate the number from bottom-left, we create a "visual" row index
        // that starts at 0 for the bottom-most visible row and increases upwards.
        // `(MAX_ROWS - 1)` is the index of the last row in the grid.
        // By subtracting the current row `r`, we invert the row index.
        const visualRowFromBottom = MAX_ROWS - 1 - r;

        // The number is calculated based on this bottom-up visual row.
        // This makes the bottom-left cell (c=0, visualRowFromBottom=0) have the value 1.
        cell.textContent = visualRowFromBottom * numCols + c + 1;
        cell.classList.add("visible");
      } else {
        // Hide any cells that are not in the selected range.
        cell.classList.remove("visible");
      }
    }
  }

  // Update Axis Label Visibility
  // X-Axis
  xAxisSpans.forEach((span, index) => {
    span.classList.toggle("visible", index < numCols);
  });

  // Y-Axis
  yAxisSpans.forEach((span, index) => {
    span.classList.toggle("visible", index < numRows);
  });
}

/**
 * Event handler for when either slider's value changes.
 */
function handleSliderChange() {
  const fadedCell = document.querySelector(".grid-cell.faded");
  if (fadedCell) {
    fadedCell.classList.remove("faded");
  }
  setJAXpose("thinking");
  playSound("click");
  updateUI();
}
function highlightTopRightCell() {
  // 1. Get all currently visible cells
  const visibleCells = document.querySelectorAll(".grid-cell.visible");

  // 2. Add classes to de-highlight all of them
  visibleCells.forEach((cell) => {
    cell.classList.add("no-background", "de-highlighted");
  });

  // 3. Find the top-right cell based on slider values
  const numCols = parseInt(colSlider.value, 10);
  const numRows = parseInt(rowSlider.value, 10);

  // Check if there are any visible cells to avoid errors
  if (numRows > 0 && numCols > 0) {
    // The top visible row has an index of (MAX_ROWS - numRows)
    // The right-most visible column has an index of (numCols - 1)
    const topRightCell = cells[MAX_ROWS - numRows][numCols - 1];

    // 4. Remove the 'de-highlighted' class from only the top-right cell
    if (topRightCell) {
      topRightCell.classList.remove("de-highlighted");
    }
  }
}
function biggestCell() {
  const numCols = parseInt(colSlider.value, 10);
  const numRows = parseInt(rowSlider.value, 10);
  if (numRows > 0 && numCols > 0) {
    const topRightCell = cells[MAX_ROWS - numRows][numCols - 1];
    return topRightCell;
  }
}
function removeHighlight() {
  const visibleCells = document.querySelectorAll(".grid-cell.visible");

  visibleCells.forEach((cell) => {
    cell.classList.remove("no-background", "de-highlighted");
  });
}
// --- Start the Applet ---
initialize();

function atStage0() {
  setJAXpose("normal");
  updateInstructionWithTag("start");
  setNext("start");
  const graphMainContent = document.querySelector(".graph-main-content");
  graphMainContent.classList.remove("shifted");
  stage++;
}
function atStage1() {
  setJAXpose("thinking");
  appletH1.style.display = "none";
  appletContainer.style.display = "flex";
  updateInstructionWithTag("set_horizontal");
  setNext("set");
  colSlider.parentElement.style.display = "flex";

  const firstCell = cells[MAX_ROWS - 1][0]; // Get the bottom-left cell
  if (firstCell) {
    firstCell.classList.add("visible");
    firstCell.classList.add("faded"); // Apply the faded class
    firstCell.innerHTML = "";
  }

  stage++;
}

function checkSetColumn() {
  const correct = colSlider.value == question.col;
  if (!correct) {
    setJAXpose("sad");
    playSound("wrong");
    vibrateElement(grid);
    updateInstructionWithTag("wrong_feedback_x", "red");
    return;
  }
  if (correct) {
    playSound("correct");
    setJAXpose("happy");
    updateInstructionWithTag("set_vertical");
    rowSlider.parentElement.style.display = "flex";
    colSlider.parentElement.style.display = "none";
    stage++;
  }
}

function checkSetRow() {
  const correct = rowSlider.value == question.row;
  if (!correct) {
    setJAXpose("sad");
    playSound("wrong");
    updateInstructionWithTag("wrong_feedback_y", "red");
    vibrateElement(grid);
    return;
  }
  if (correct) {
    setJAXpose("happy");
    playSound("correct");
    rowSlider.parentElement.style.display = "none";
    setNext("next");
    updateInstructionWithTag("complete_setting");
    stage++;
  }
}
function blankStepBeforeMcq() {
  updateInstructionWithTag("before_question");
  highlightTopRightCell();
  graphContainer.classList.remove("first-stage");
  stage++;
}
function mcq1() {
  setJAXpose("normal");
  // This will ask the user to identify the number of columns (5)
  loadContextMcq("column_question", question.col);
  nextButton.disabled = true;
}

function mcq2() {
  setJAXpose("normal");
  // This will ask the user to identify the number of rows (4)
  loadContextMcq("row_question", question.row);
}
function mcqCompleted() {
  nextButton.disabled = false;
  updateInstructionWithTag("completed_questions");
  stage++;
}
function animateStage() {
  const graphMainContent = document.querySelector(".graph-main-content");
  graphMainContent.classList.add("shifted");
  createDuplicateCells();
  setJAXpose("thinking");
  cornerText.style.display = "none";
  animateRows();
  stage++;
}
function lastStage() {
  updateInstructionWithTag("completion");
  setNext("summary");
  previousButton.style.display = "none";
  const bottomText = document.getElementById("bottom-text");
  bottomText.innerHTML = fillPlaceholders(
    leftInstructions.bottom_text,
    templateData
  );
  bottomText.style.display = "block";
  stage++;
}
function summary() {
  if (questionIndex < questions.length - 1) {
    overlayButton.textContent = buttonText.next_question;
  } else {
    overlayButton.textContent = buttonText.start_over;
  }
  triggerFullScreenOverlay(true);
  return;
}
function dehighlightxLabels() {
  xAxisSpans.forEach((span) => {
    span.classList.add("de-highlighted");
  });
}
function highlightSingleOnXaxis(i) {
  xAxisSpans[i].classList.remove("de-highlighted");
}
function highlightSingleOnYaxis(i) {
  yAxisSpans[i].classList.remove("de-highlighted");
}
function dehighlightyLabels() {
  yAxisSpans.forEach((span) => {
    span.classList.add("de-highlighted");
  });
}
const stepQ = [
  atStage0,
  atStage1,
  checkSetColumn,
  checkSetRow,
  blankStepBeforeMcq,
  mcq1,
  mcq2,
  mcqCompleted,
  animateStage,
  lastStage,
  summary,
];

nextButton.addEventListener("click", () => {
  playSound("click");
  stepQ[stage]();
});

function loadContextMcq(questionTag, correctAnswer) {
  // Update the instruction panel with the question text
  updateInstructionWithTag(questionTag);

  // Find the #context div to add our options container
  const contextDiv = document.getElementById("context");
  if (!contextDiv) return;

  // Remove old options container if it exists, then create a new one
  let optionsContainer = document.getElementById("context-options");
  if (optionsContainer) {
    optionsContainer.remove();
  }
  optionsContainer = document.createElement("div");
  optionsContainer.id = "context-options";
  // Add a class for styling the container if needed
  optionsContainer.className = "context-options-container";

  // Generate and add the option buttons from the fixed list
  const options = [question.col, question.row, question.row * question.col];
  options.forEach((optionValue) => {
    const optionButton = document.createElement("button");
    optionButton.className = "context-option"; // Use this class for styling
    optionButton.textContent = optionValue;
    optionButton.dataset.value = optionValue; // Store the answer in a data attribute
    optionsContainer.appendChild(optionButton);
  });

  // Add the new options container to the context panel
  contextDiv.appendChild(optionsContainer);

  // Add a single event listener to the container that uses the correct answer
  optionsContainer.addEventListener("click", (event) =>
    handleContextMcqAnswer(event, correctAnswer)
  );
}

/**
 * Handles the click event on an MCQ option button.
 * @param {Event} event The click event.
 * @param {number} correctAnswer The correct answer passed from loadContextMcq.
 */
function handleContextMcqAnswer(event, correctAnswer) {
  const clickedButton = event.target.closest(".context-option");
  // Do nothing if the click wasn't on a button or if it's already answered correctly
  if (
    !clickedButton ||
    clickedButton.disabled ||
    clickedButton.classList.contains("correct")
  )
    return;

  const userAnswer = parseInt(clickedButton.dataset.value, 10);

  if (userAnswer === correctAnswer) {
    playSound("correct");
    setJAXpose("happy");
    clickedButton.classList.remove("wrong");
    clickedButton.classList.add("correct");

    // Disable all buttons since the correct answer was found
    const allButtons = document.querySelectorAll(".context-option");
    allButtons.forEach((btn) => (btn.disabled = true));

    // After a short delay, proceed to the next step
    setTimeout(() => {
      stage++; // Move to the next stage
      stepQ[stage](); // Execute the next function in the sequence
    }, 1000); // 1 second delay before moving on
  } else {
    playSound("wrong");
    setJAXpose("sad");
    clickedButton.classList.add("wrong");
  }
}
// Function 1: Returns a string in the format "num + num + num" (i times)
function repeatedAdditionString(num, i) {
  return Array(i).fill(num).join(" + ");
}

// Function 2: Returns a string in the format "num * i"
function multiplicationString(num, i) {
  return `${i} × ${num}`;
}

function setUpAnimationBox() {
  leftAnimationBox.innerHTML = leftInstructions.shortData.leftBadge;
  rightAnimationBox.innerHTML = leftInstructions.shortData.rightBadge;
  for (let i = question.row; i > 0; i--) {
    p1 = document.createElement("p");
    p1.innerHTML = repeatedAdditionString(question.col, i);
    leftAnimationBox.appendChild(p1);
    p2 = document.createElement("p");
    p2.classList.add("p2");
    p2.innerHTML = multiplicationString(question.col, i);
    rightAnimationBox.appendChild(p2);
  }
}

function createDuplicate(element) {
  const rect = element.getBoundingClientRect();

  // Create the duplicate div
  const duplicate = document.createElement("div");
  duplicate.classList.add("duplicate-cell");

  // Apply the same size and position using absolute positioning
  Object.assign(duplicate.style, {
    position: "absolute",
    top: `${rect.top + window.scrollY}px`,
    left: `${rect.left + window.scrollX}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    // Optional: allows clicks to pass through
    zIndex: 100, // Make sure it appears on top
  });

  // Append to body
  document.body.appendChild(duplicate);
  return duplicate;
}
function createDuplicateCells() {
  const visibleCells = document.querySelectorAll(".grid-cell.visible");
  visibleCells.forEach((cell, i) => {
    const duplicate = createDuplicate(cell);
    duplicateCells.push(duplicate);
  });
}

/**
 * A helper function to create a delay using Promises.
 * @param {number} ms - The delay in milliseconds.
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Animates the rows one by one from bottom to top.
 * It highlights the duplicate cells, the y-axis label, and the text in the animation boxes for each row.
 */
async function animateRows() {
  setJAXpose("thinking");
  // Disable the next button during animation to prevent conflicts
  nextButton.disabled = true;
  previousButton.disabled = true;
  updateInstructionWithTag("animation_1");
  leftAnimationBox.style.display = "flex";
  rightAnimationBox.style.display = "flex";
  biggestCell().classList.add("de-highlighted");
  dehighlightxLabels();
  dehighlightyLabels();

  const leftPs = leftAnimationBox.querySelectorAll("p");
  const rightPs = rightAnimationBox.querySelectorAll("p");
  const numCols = question.col;
  const numRows = question.row;

  // The main animation loop, iterating from the bottom row (i=0) to the top.
  for (let i = 0; i < numRows; i++) {
    // --- 1. Highlight the duplicate cells for the current row ---
    // The duplicateCells are ordered from the top-most visible row to the bottom-most.
    // We calculate the index for the row from the top to get the correct slice.
    await sleep(1000); // 1-second delay between each row animation
    const rowFromTop = numRows - 1 - i;
    const start = rowFromTop * numCols;
    const end = start + numCols;
    if (i === 0) {
      highlightSingleOnXaxis(question.col - 1);
    }

    for (let j = start; j < end; j++) {
      if (duplicateCells[j]) {
        duplicateCells[j].classList.add("show");
        if (j === end - 1) {
          if (i > 0) {
            duplicateCells[j + question.col].textContent = "";
          }
          duplicateCells[j].textContent = question.col * (i + 1);
        }
      }
    }

    // --- 2. Highlight the Y-axis label ---
    // yAxisSpans is 0-indexed from the bottom, so it matches our loop index 'i'.
    if (yAxisSpans[i]) {
      dehighlightyLabels();
      highlightSingleOnYaxis(i);
    }

    // --- 3. Highlight the text in the animation boxes ---
    // The paragraphs are ordered top to bottom in the DOM, so we access them in reverse.
    const pIndex = numRows - 1 - i;
    const pIndexPrev = pIndex + 1;
    if (i > 0) {
      if (leftPs[pIndexPrev]) {
        leftPs[pIndexPrev].classList.remove("fullShow");
        leftPs[pIndexPrev].classList.add("de-highlighted");
      }
      if (rightPs[pIndexPrev]) {
        rightPs[pIndexPrev].classList.remove("fullShow");
        rightPs[pIndexPrev].classList.add("de-highlighted");
      }
    }
    if (leftPs[pIndex]) {
      leftPs[pIndex].classList.add("fullShow");
    }
    if (rightPs[pIndex]) {
      rightPs[pIndex].classList.add("fullShow");
    }

    // --- 4. Wait before proceeding to the next row ---
  }
  await sleep(1500);
  // Re-enable the next button after the animation is complete
  nextButton.disabled = false;
  updateInstructionWithTag("animation_end");
  afterAnimation();
}
function afterAnimation() {
  duplicateCells.forEach((duplicate) => duplicate.classList.remove("show"));
  biggestCell().classList.remove("de-highlighted");
  previousButton.disabled = false;
  previousButton.style.display = "block";
  setJAXpose("normal");
}

previousButton.onclick = () => {
  const leftP = leftAnimationBox.querySelector("p");
  const rightP = rightAnimationBox.querySelector("p");
  leftP.classList.remove("fullShow");
  leftP.classList.add("de-highlighted");
  rightP.classList.remove("fullShow");
  rightP.classList.add("de-highlighted");
  animateRows();
};
function setOverlayCurrent() {
  const heading = document.querySelector("#fullscreen-overlay h1");
  heading.style.display = "none";
  const paragraph = document.querySelector("#fullscreen-overlay p");
  paragraph.innerHTML = leftInstructions.summary;
}
setOverlayCurrent();

function updateInstructionWithTag(tag, colorClass) {
  const finalText = fillPlaceholders(leftInstructions[tag], templateData);
  updateInstruction(finalText, colorClass);
}

function goToNext() {
  questionIndex = (questionIndex + 1) % questions.length;
  initialize();
  triggerFullScreenOverlay(false);
}
overlayButton.onclick = goToNext;
