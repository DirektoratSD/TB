// app.js
const T = texts;

let contextBox,
  prevButton,
  nextButton,
  startButton,
  stepCounterElement,
  definitionOverlay,
  definitionOverlayContent,
  closeDefinitionOverlay;

// App state
let currentStep = 0,
  NUM_STRUCTURES = 7;

initApp();

function initApp() {
  contextBox = document.getElementById("contextBox");
  prevButton = document.getElementById("prevButton");
  nextButton = document.getElementById("nextButton");
  startButton = document.getElementById("startButton");
  stepCounterElement = document.getElementById("stepCounter");
  definitionOverlay = document.getElementById("definitionOverlay");
  definitionOverlayContent = document.getElementById(
    "definitionOverlayContent"
  );
  closeDefinitionOverlay = document.getElementById("closeDefinitionOverlay");
  nextButton.textContent = T.button_texts.next;
  prevButton.textContent = T.button_texts.prev;
}

function updateInstructions(key) {
  const ContextSection = document.querySelector(".context-section");
  const title = T.left_panel[key].instruction_title;
  const content = T.left_panel[key].instruction_text;

  ContextSection.innerHTML = `<h2>${title}</h2><div><p>${content}</p></div>`;
  ContextSection.classList.add("visible");
}
function createStepCounter() {
  stepCounterElement.innerHTML = "";
  for (let i = 0; i < NUM_STRUCTURES; i++) {
    const dot = document.createElement("div");
    dot.classList.add("dot");

    dot.dataset.stepIndex = i;
    stepCounterElement.appendChild(dot);
  }
}
function updateStepCounter(stepIndex) {
  const dots = stepCounterElement.querySelectorAll(".dot");
  dots.forEach((dot) => dot.classList.remove("active"));
  dots[stepIndex].classList.add("active");
}

function setCavePose(pose) {
  const JAX = document.querySelector(`.character-display img`);
  JAX.src = `assets/cave${pose}.png`;
}

createStepCounter();
updateStepCounter(0);

function vibrateElement(el, bool = true) {
  if (!bool) {
    el.classList.remove("vibrate-x");
    return;
  }
  el.classList.add("vibrate-x");
}

function playAudio(id) {
  const audio = document.getElementById(id);
  audio.currentTime = 0;
  audio.play();
}

function playSound(name) {
  const file = `sound/${name}.mp3`;
  const audio = new Audio(file);
  audio.play();
}

function confettiBurst() {
  const duration = 2.5 * 1000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 360,
      origin: { x: 0.5, y: 0.5 },
    });
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

function setNextText(key){
  nextButton.textContent = T.button_texts[key];
}

function updateInstructionFromNumber(n){
  const ContextSection = document.querySelector(".context-section");
  const content = numberForm[n-10];
  ContextSection.innerHTML = `<div><p>${content}</p></div>`;
  ContextSection.classList.add("visible");
}

function updateInstructionWithQuestion(data){
  const text = data.text
  const n = data.number
  const ContextSection = document.querySelector(".context-section");
  ContextSection.innerHTML = `<div><p>${text}</p></div><div class="question-number">${n}</div>`;
  ContextSection.classList.add("visible");
}

function toggleFullScreenOverlay(show) {
  const overlay = document.getElementById("fullscreenOverlay");
  if (show) {
    overlay.style.opacity = "1";
    overlay.style.display = "block";
  } else {
    overlay.style.opacity = "0";
    setTimeout(() => {
      overlay.style.display = "none";
    }, 500);
  }
}
function overlayTextBubble(text1,text2) {
  const bubble = document.querySelector("#leftBubble>p");
  bubble.innerHTML = text1;
  const bubble2 = document.querySelector("#rightBubble>p");
  bubble2.innerHTML = text2;
}


function showOverlayWith2Bubbles(index){
  overlayTextBubble(texts.bubble_data[index].left, texts.bubble_data[index].right);
  toggleFullScreenOverlay(true);
}

showOverlayWith2Bubbles(0);