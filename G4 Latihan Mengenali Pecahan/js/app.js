// =================
// App Setup
// =================
const T = window.APP_TEXTS;
if (!T) {
  console.error("Error: Text data not found. Ensure texts.js is loaded.");
}
// Global DOM Elements
let appletContainer, contextBox, characterImageEl, activityArea;
let startButton, checkButton, feedbackText, handFtue, handFtueImg;
let numeratorBox, denominatorBox, currentNumerator, currentDenominator;
let numeratorPlusBtn, numeratorMinusBtn, denominatorPlusBtn, denominatorMinusBtn;
// App State
let currentQuestionIndex = -1;
let isAnimating = false;
let isCorrectState = false; // State to track if the current view is a correct answer screen
currentNumerator = null;
currentDenominator = null;
// =================
// Initialization
// =================
function initApp() {
  // DOM Element Assignments
  appletContainer = document.querySelector(".applet-container");
  contextBox = document.getElementById("contextBox");
  characterImageEl = document.getElementById("characterImageElement");
  activityArea = document.getElementById("activity-area");
  startButton = document.getElementById("startButton");
  checkButton = document.getElementById("checkButton");
  feedbackText = document.getElementById("feedbackText");
  handFtue = document.getElementById("hand-ftue");
  handFtueImg = document.getElementById("hand-ftue-img");
  // Set initial texts from texts.js
  document.getElementById("html_title").textContent = T.html_title;
  document.getElementById("main_title_text").textContent = T.main_title_text;
  document.getElementById("subtitle_text").textContent = T.subtitle_text;
  handFtueImg.src = T.item_images.ftue_cursor;
  // Event Listeners
  startButton.addEventListener("click", handleStart);
  checkButton.addEventListener("click", handleCheck);
  renderStep(0); // Start at the intro screen
}
// =================
// Game Flow Control
// =================
function renderStep(step) {
    resetStepState();
    if (step === 0) { // Initial Intro Step
        appletContainer.classList.add("initial-state");
        updateInstructions("step_0_intro");
        startButton.textContent = T.button_texts.start;
        startButton.style.display = 'block';
        checkButton.style.display = 'none';
        showFtue(startButton);
    } else if (step > 0 && step <= T.questions.length) { // Question steps
        appletContainer.classList.remove("initial-state");
        appletContainer.classList.add("question-view-layout");
        setJaxPose("speaking_head");
        currentQuestionIndex = step - 1;
        setupQuestionUI();
    } else { // Final Step
        appletContainer.classList.add("initial-state");
        appletContainer.classList.remove("question-view-layout");
        updateInstructions("step_final");
        startButton.textContent = T.button_texts.start_over;
        startButton.style.display = 'block';
        checkButton.style.display = 'none';
        currentQuestionIndex = -1; // Reset for restart
    }
}
function resetStepState() {
  isAnimating = false;
  isCorrectState = false; // Reset the correct state flag
  hideFtue();
  setContextBoxState("normal");
  setJaxPose("normal");
  appletContainer.classList.remove("initial-state", "question-view-layout");
  activityArea.innerHTML = "";
  feedbackText.classList.remove('visible', 'correct', 'incorrect');
  startButton.style.display = 'none';
  checkButton.style.display = 'block';
  checkButton.disabled = false;
  checkButton.textContent = T.button_texts.check;
  // Reset fraction values
  currentNumerator = null;
  currentDenominator = null;
}
// =========================
// UI & Layout Management
// =========================
function setupQuestionUI() {
    const question = T.questions[currentQuestionIndex];
    updateInstructions("question_prompt", {
        object: question.object,
        description: question.description
    });
    // Create main containers
    const imageContainer = document.createElement('div');
    imageContainer.className = 'image-container';
    const fractionContainer = document.createElement('div');
    fractionContainer.className = 'fraction-container';
    // Add question image
    const questionImg = document.createElement('img');
    questionImg.src = T.item_images[question.name];
    questionImg.className = 'question-image';
    questionImg.alt = question.object;
    imageContainer.appendChild(questionImg);
    // Create numerator stepper section
    const numeratorSection = document.createElement('div');
    numeratorSection.className = 'stepper-section';
    
    const numeratorControls = document.createElement('div');
    numeratorControls.className = 'stepper-controls';
    
    numeratorMinusBtn = document.createElement('button');
    numeratorMinusBtn.className = 'stepper-button';
    numeratorMinusBtn.textContent = '-';
    numeratorMinusBtn.addEventListener('click', () => handleStepper('numerator', -1));
    
    numeratorBox = document.createElement('div');
    numeratorBox.className = 'numerator-box';
    numeratorBox.textContent = currentNumerator === null ? '' : currentNumerator;
    
    numeratorPlusBtn = document.createElement('button');
    numeratorPlusBtn.className = 'stepper-button';
    numeratorPlusBtn.textContent = '+';
    numeratorPlusBtn.addEventListener('click', () => handleStepper('numerator', 1));
    
    numeratorControls.append(numeratorMinusBtn, numeratorBox, numeratorPlusBtn);
    numeratorSection.appendChild(numeratorControls);
    
    // Create fraction line
    const fractionLine = document.createElement('div');
    fractionLine.className = 'fraction-line';
    
    // Create denominator stepper section
    const denominatorSection = document.createElement('div');
    denominatorSection.className = 'stepper-section';
    
    const denominatorControls = document.createElement('div');
    denominatorControls.className = 'stepper-controls';
    
    denominatorMinusBtn = document.createElement('button');
    denominatorMinusBtn.className = 'stepper-button';
    denominatorMinusBtn.textContent = '-';
    denominatorMinusBtn.addEventListener('click', () => handleStepper('denominator', -1));
    
    denominatorBox = document.createElement('div');
    denominatorBox.className = 'denominator-box';
    denominatorBox.textContent = currentDenominator === null ? '' : currentDenominator;
    
    denominatorPlusBtn = document.createElement('button');
    denominatorPlusBtn.className = 'stepper-button';
    denominatorPlusBtn.textContent = '+';
    denominatorPlusBtn.addEventListener('click', () => handleStepper('denominator', 1));
    
    denominatorControls.append(denominatorMinusBtn, denominatorBox, denominatorPlusBtn);
    denominatorSection.appendChild(denominatorControls);
    
    // Assemble fraction container
    fractionContainer.append(numeratorSection, fractionLine, denominatorSection);
    
    // Add to activity area
    activityArea.append(imageContainer, fractionContainer);
    
    // Update stepper button states
    updateStepperButtons();
}
// =========================
// Interaction Logic
// =========================
function handleStart() {
    if (isAnimating) return;
    audioPlay('click');
    if (currentQuestionIndex === -1 && startButton.textContent === T.button_texts.start) {
        renderStep(1); // Start with the first question
    } else {
        location.reload(); // "Start Over" was clicked
    }
}
function handleStepper(type, delta) {
    if (isAnimating || isCorrectState) return;
    audioPlay('click');
    
    if (type === 'numerator') {
        if (currentNumerator === null) {
            currentNumerator = 1;
        } else {
            currentNumerator += delta;
        }
        currentNumerator = Math.max(0, Math.min(20, currentNumerator));
        numeratorBox.textContent = currentNumerator;
    } else if (type === 'denominator') {
        if (currentDenominator === null) {
            currentDenominator = 1;
        } else {
            currentDenominator += delta;
        }
        currentDenominator = Math.max(1, Math.min(20, currentDenominator));
        denominatorBox.textContent = currentDenominator;
    }
    
    updateStepperButtons();
    hideFtue();
}
function updateStepperButtons() {
    numeratorMinusBtn.disabled = currentNumerator !== null && currentNumerator <= 0;
    numeratorPlusBtn.disabled = currentNumerator !== null && currentNumerator >= 20;
    
    denominatorMinusBtn.disabled = currentDenominator !== null && currentDenominator <= 1;
    denominatorPlusBtn.disabled = currentDenominator !== null && currentDenominator >= 20;
}
function handleCheck() {
    if (isAnimating) return;
    
    if (isCorrectState) {
        audioPlay('click');
        renderStep(currentQuestionIndex + 2);
        return;
    }
    
    isAnimating = true;
    hideFtue();
    audioPlay('click');
    
    if (currentNumerator === null || currentDenominator === null) {
        setJaxPose('wrong');
        setContextBoxState('incorrect');
        audioPlay('wrong');
        feedbackText.textContent = T.instructions.feedback_empty.text;
        feedbackText.classList.add('visible', 'incorrect');
        setTimeout(() => {
            setContextBoxState('normal');
            setJaxPose('speaking_head');
            feedbackText.classList.remove('visible', 'incorrect');
            isAnimating = false;
        }, 4000);
        return;
    }
    
    const question = T.questions[currentQuestionIndex];
    const numeratorCorrect = currentNumerator === question.numerator;
    const denominatorCorrect = currentDenominator === question.denominator;
    const bothCorrect = numeratorCorrect && denominatorCorrect;
    
    if (bothCorrect) {
        setJaxPose('correct');
        setContextBoxState('correct');
        numeratorBox.classList.add('correct');
        denominatorBox.classList.add('correct');
        feedbackText.textContent = T.instructions.feedback_correct.text;
        feedbackText.classList.add('visible', 'correct');
        checkButton.textContent = T.button_texts.next;
        
        numeratorPlusBtn.disabled = true;
        numeratorMinusBtn.disabled = true;
        denominatorPlusBtn.disabled = true;
        denominatorMinusBtn.disabled = true;
        
        showFtue(checkButton);
        isCorrectState = true;
        isAnimating = false;
    } else {
        setJaxPose('wrong');
        setContextBoxState('incorrect');
        audioPlay('wrong');
        
        let feedbackKey;
        if (!numeratorCorrect && !denominatorCorrect) {
            feedbackKey = 'feedback_both_wrong';
            numeratorBox.classList.add('incorrect');
            denominatorBox.classList.add('incorrect');
        } else if (!numeratorCorrect) {
            feedbackKey = 'feedback_numerator_wrong';
            numeratorBox.classList.add('incorrect');
        } else {
            feedbackKey = 'feedback_denominator_wrong';
            denominatorBox.classList.add('incorrect');
        }
        
        feedbackText.textContent = T.instructions[feedbackKey].text;
        feedbackText.classList.add('visible', 'incorrect');
        
        setTimeout(() => {
            numeratorBox.classList.remove('incorrect');
            denominatorBox.classList.remove('incorrect');
            setContextBoxState('normal');
            setJaxPose('speaking_head');
            feedbackText.classList.remove('visible', 'incorrect');
            isAnimating = false;
        }, 4000);
    }
}
// =========================
// Helpers
// =========================
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
function updateInstructions(key, params = {}) {
  const contextSection = document.querySelector(".context-section");
  let instruction = T.instructions[key];
  if (instruction) {
    let title = instruction.title;
    let text = typeof instruction.text === "function" ? instruction.text(params) : instruction.text;
    contextSection.innerHTML = `<h2>${title}</h2><div><p>${text}</p></div>`;
  }
}
function showFtue(element) {
  if (!element || !handFtue) return;
  setTimeout(() => {
    const rect = element.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return;
    handFtue.style.left = `${rect.left + rect.width / 2}px`;
    handFtue.style.top = `${rect.top + rect.height / 2}px`;
    handFtue.classList.add("hand-animating");
  }, 500);
}
function hideFtue() {
  if (handFtue) handFtue.classList.remove("hand-animating");
}
function setContextBoxState(state = "normal") {
  contextBox.classList.remove("correct", "incorrect");
  if (state === "correct" || state === "incorrect") {
    contextBox.classList.add(state);
  }
}
function setJaxPose(pose) {
  if (T.character_images && T.character_images[pose]) {
    characterImageEl.src = T.character_images[pose];
  }
}
function audioPlay(type) {
  if (T.audio && T.audio[type]) {
    new Audio(T.audio[type]).play().catch((e) => console.warn("Audio play failed:", e));
  }
}
document.addEventListener("DOMContentLoaded", initApp);