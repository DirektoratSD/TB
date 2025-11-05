const nextButton = document.getElementById("next-button");
const previousButton = document.getElementById("previous-button");
const overlayButton = document.getElementById("overlay-button");
// overlayButton.onclick = () => location.reload();
const stepCounterElement = document.querySelector("#stepCounter");
nextButton.textContent = buttonText.next;
previousButton.textContent = buttonText.replay;
overlayButton.textContent = buttonText.start_over;
const audioCache = {};
const sounds = ["correct", "wrong", "click", "congrats"];
sounds.forEach((name) => {
  const audio = new Audio(`sound/${name}.mp3`);
  audio.load(); // Preloads the audio
  audioCache[name] = audio;
});
function playSound(filename) {
  if (!audioCache[filename]) {
    const audio = new Audio(`sound/${filename}.mp3`);
    audioCache[filename] = audio;
  }
  const sound = audioCache[filename].cloneNode(); // Clone so it can overlap itself
  sound.play();
}
function setJAXpose(name) {
  const jax = document.querySelector("#character>img");
  jax.src = `assets/JAX${name}.png`;
}
function vibrateElement(el, bool = true) {
  if (!bool) {
    el.classList.remove("vibrate-x");
    return;
  }
  // el.style.position = "relative";
  el.classList.add("vibrate-x");
}
function confettiBurst() {
  const duration = 1 * 1000;
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

function showFtue(element) {
  if (!element) return;
  const handFtue = document.getElementById("hand-ftue");

  handFtue.classList.remove("hand-animating");
  element.classList.remove("ftue-highlight");

  const rect = element.getBoundingClientRect();

  handFtue.style.top = `${rect.top + rect.height / 2}px`;
  handFtue.style.left = `${rect.left + rect.width / 2}px`;
  handFtue.classList.add("hand-animating");
}
function hideFtue() {
  const handFtue = document.getElementById("hand-ftue");
  handFtue.classList.remove("hand-animating");
}
// showFtue(nextButton)
// hideFtue();
function triggerFullScreenOverlay(show) {
  const overlay = document.getElementById("fullscreen-overlay");
  const display = show ? "flex" : "none";
  overlay.style.display = display;
}

const maxStep = 8; //random number now, depends on applet
function createStepCounter(maxStep) {
  stepCounterElement.innerHTML = "";
  for (let i = 0; i < maxStep; i++) {
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

function updateInstruction(text1, colorClass) {
  const context = document.querySelector("#context");
  context.animate(
    [
      { transform: "scale(0.1)", opacity: 0 },
      { transform: "scale(1)", opacity: 1 },
    ],
    {
      duration: 300,
      easing: "ease-out", // Simple, smooth easing
      fill: "forwards", // Keeps final state after animation
    }
  );
  colorClass = colorClass || "";
  context.innerHTML = `<p class="${colorClass}">${text1}</p>`;
}

function setOverlay() {
  const heading = document.querySelector("#fullscreen-overlay h1");
  const paragraph = document.querySelector("#fullscreen-overlay p");
  heading.innerHTML = overlayData.heading;
  paragraph.innerHTML = overlayData.paragraph;
}
// setOverlay();
// updateInstructionWithData("general");
// createStepCounter(maxStep);
// updateStepCounter(0);

function fillPlaceholders(template, data) {
  return template.replace(/\{\{(.*?)\}\}/g, (match, key) => {
    const trimmedKey = key.trim();

    return data.hasOwnProperty(trimmedKey) ? data[trimmedKey] : match;
  });
}

function updateInstructionWithTag(tag, colorClass) {
  updateInstruction(leftInstructions[tag], colorClass);
}
function setNext(tag){
  nextButton.textContent = buttonText[tag]
}