// js/app.js
document.addEventListener("DOMContentLoaded", () => {
  // --- DOM element declarations ---
  const prevButton = document.getElementById("prevButton");
  const nextButton = document.getElementById("nextButton");
  const stepCounterElement = document.getElementById("stepCounter");
  const instructionContentElement = document.getElementById(
    "instructionContentElement"
  );
  const characterImageElement = document.getElementById(
    "characterImageElement"
  );
  const questionTextElement = document.getElementById("questionText");
  const leftCloudElement = document.getElementById("leftCloud");
  const rightCloudElement = document.getElementById("rightCloud");
  const mergedCloudElement = document.getElementById("mergedCloud");
  const numpadElement = document.getElementById("numpad");
  const numpadFeedbackArea = document.getElementById("numpad-feedback-area");
  const joinButtonContainer = document.getElementById("join-button-container");
  const cloudContainer = document.querySelector(".cloud-container");
  const finalSummaryContainer = document.getElementById(
    "final-summary-container"
  );
  const summaryLeftPanel = document.getElementById("summary-left-panel");
  const summaryRightPanel = document.getElementById("summary-right-panel");
  const welcomeSlide = document.getElementById("welcome-slide");
  const welcomeDescription = document.getElementById("welcomeDescription");
  const startButton = document.getElementById("startButton");
  const mainLayout = document.querySelector(".main-layout");
  const titleBar = document.querySelector(".titleBar");
  const logo = document.getElementById("logo");
  const welcomeLogo = document.getElementById("welcome-logo");

  let currentQuestionIndex = 0;
  let questions = [];
  let subStep = "left";
  let isLocked = false;
  let CLOUD_SVG_PATH = "";
  let isWelcomeSlide = true;

  async function handleNumpadInput(number, buttonEl) {
    if (isLocked) return;
    isLocked = true;
    audioPlay("click");
    clearFeedbackDots();

    const q = questions[currentQuestionIndex];
    let expectedAnswer;

    if (subStep === "left") expectedAnswer = q.leftCloudCount;
    else if (subStep === "right") expectedAnswer = q.rightCloudCount;
    else if (subStep === "merged")
      expectedAnswer = q.leftCloudCount + q.rightCloudCount;

    const isCorrect = number === expectedAnswer;

    for (let i = 1; i <= 10; i++) {
      const colorClass = i === expectedAnswer ? "dot-correct" : "dot-neutral";
      showFeedbackDots(i, i, colorClass);
    }

    if (isCorrect) {
      buttonEl.classList.add("correct");
      setFeedback("happy", q.prompt.correct);
      await delay(2500);
      await advanceSubStep();
    } else {
      const originalPrompt = instructionContentElement.innerHTML;
      buttonEl.classList.add("incorrect");
      setFeedback("sad", q.prompt.incorrect);
      await delay(2500);
      setFeedback("normal", originalPrompt);
    }

    resetNumpadButtonStyles();
    clearFeedbackDots();
    isLocked = false;
  }

  async function advanceSubStep() {
    const q = questions[currentQuestionIndex];

    if (subStep === "left") {
      subStep = "right";
      questionTextElement.innerHTML = q.prompt.rightCloudQuestion;
      setFeedback("normal", q.prompt.contextPrompts.right);
      highlightCloud("right");
    } else if (subStep === "right") {
      subStep = "merging";
      setFeedback("normal", q.prompt.contextPrompts.merging);
      highlightCloud(null);
      createJoinButton();
      numpadElement.style.display = "none";
    } else if (subStep === "merged") {
      subStep = "done";
      setFeedback("happy", q.prompt.contextPrompts.done);
      questionTextElement.innerHTML = APP_TEXTS.finalMessage.content;
      confettiBurst();
      showFinalSummary();
      nextButton.disabled = false;
      if (currentQuestionIndex === questions.length - 1) {
        nextButton.textContent = APP_TEXTS.buttons.start_over;
      }
    }
  }

  function createJoinButton() {
    joinButtonContainer.innerHTML = "";
    const joinButton = document.createElement("button");
    joinButton.id = "joinButton";
    joinButton.className = "btn btn-tertiary";
    joinButton.textContent = APP_TEXTS.buttons.join;
    joinButton.addEventListener("click", handleJoinClick);
    joinButtonContainer.appendChild(joinButton);
  }

  async function handleJoinClick() {
    if (isLocked) return;
    isLocked = true;
    audioPlay("click");
    joinButtonContainer.innerHTML = "";

    await runMergeAnimation();

    numpadElement.style.display = "flex";

    subStep = "merged";
    const q = questions[currentQuestionIndex];
    questionTextElement.innerHTML = q.prompt.mergedCloudQuestion;
    setFeedback("normal", q.prompt.contextPrompts.merged);
    isLocked = false;
  }

  // MODIFIED: This function now fixes the SVG rendering issue.
  function showFinalSummary() {
    // Hide the main activity components
    cloudContainer.style.display = "none";
    numpadElement.style.display = "none";

    leftCloudElement.style.left = "0%";
    rightCloudElement.style.left = "0%";
    numpadFeedbackArea.style.display = "none";
    questionTextElement.style.display = "none";

    // Clear previous summary content
    summaryLeftPanel.innerHTML = "";
    summaryRightPanel.innerHTML = "";

    // Create clones of the clouds
    const summaryLeftCloud = leftCloudElement.cloneNode(true);
    const summaryRightCloud = rightCloudElement.cloneNode(true);
    const summaryMergedCloud = mergedCloudElement.cloneNode(true);

    // Process all cloned clouds to ensure they render correctly
    [summaryLeftCloud, summaryRightCloud, summaryMergedCloud].forEach(
      (cloud) => {
        // Basic setup: add class, remove ID, make visible
        cloud.classList.add("summary-cloud");
        cloud.classList.remove("highlight");
        cloud.removeAttribute("id");
        cloud.style.opacity = "1";
        cloud.style.removeProperty("transform");

        // --- FIX: Make SVG gradient IDs unique to prevent rendering conflicts ---
        const gradient = cloud.querySelector("linearGradient");
        const path = cloud.querySelector("path");

        if (gradient && path) {
          // Get the old ID (e.g., "grad-leftCloud")
          const oldId = gradient.id;
          // Create a new, unique ID (e.g., "grad-leftCloud_summary")
          const newId = oldId + "_summary";

          // Assign the new ID to the gradient definition
          gradient.id = newId;
          // Update the path's fill to reference the new ID
          path.setAttribute("fill", `url(#${newId})`);
        }
      }
    );

    // Append clouds to the correct panels for the new layout
    summaryLeftPanel.appendChild(summaryLeftCloud);
    summaryLeftPanel.appendChild(summaryRightCloud);
    summaryRightPanel.appendChild(summaryMergedCloud);

    // Show the summary container
    finalSummaryContainer.style.display = "flex";
  }

  function runMergeAnimation() {
    leftCloudElement.style.left = "50%";
    leftCloudElement.style.transform = "translate(-50%, -50%) scale(1)";
    leftCloudElement.style.opacity = "0";

    rightCloudElement.style.right = "auto";
    rightCloudElement.style.left = "50%";
    rightCloudElement.style.transform = "translate(-50%, -50%) scale(1)";
    rightCloudElement.style.opacity = "0";

    mergedCloudElement.style.transform = "translate(-50%, -50%) scale(0.4)";
    mergedCloudElement.style.zIndex = "1";

    return new Promise((resolve) => {
      setTimeout(() => {
        mergedCloudElement.style.opacity = "1";
        mergedCloudElement.classList.add("merging");
        mergedCloudElement.style.transform = "translate(-50%, -50%) scale(1)";
        setTimeout(resolve, 800);
      }, 200);
    });
  }

  function resetCloudStates() {
    const enableTransitions = () =>
      [leftCloudElement, rightCloudElement, mergedCloudElement].forEach((c) => {
        c.style.transition = "";
      });

    [leftCloudElement, rightCloudElement, mergedCloudElement].forEach(
      (c) => (c.style.transition = "none")
    );

    ["opacity", "transform", "left", "right"].forEach((prop) => {
      leftCloudElement.style.removeProperty(prop);
      rightCloudElement.style.removeProperty(prop);
    });

    mergedCloudElement.style.zIndex = "-1";
    mergedCloudElement.style.opacity = "0";
    mergedCloudElement.classList.remove("merging");
    mergedCloudElement.style.transform = "translate(-50%, -50%) scale(0.8)";

    highlightCloud(null);
    setTimeout(enableTransitions, 50);
  }

  function renderQuestion(index) {
    isLocked = false;
    subStep = "left";
    const q = questions[index];
    resetUI();
    setupCloud(leftCloudElement, "left", q);
    setupCloud(rightCloudElement, "right", q);
    setupCloud(mergedCloudElement, "merged", q);
    questionTextElement.innerHTML = q.prompt.initial;
    highlightCloud("left");
    setFeedback("normal", q.prompt.contextPrompts.left);
    updateNavButtons();
    updateStepCounter();
  }

  function resetUI() {
    resetCloudStates();
    clearFeedbackDots();
    resetNumpadButtonStyles();

    joinButtonContainer.innerHTML = "";
    finalSummaryContainer.style.display = "none";

    cloudContainer.style.display = "flex";
    numpadElement.style.display = "flex";
    numpadFeedbackArea.style.display = "flex";
    questionTextElement.style.display = "block";
  }

  // --- No changes to the functions below this line ---

  function showFeedbackDots(boxNumber, dotCount, colorClass) {
    const targetBox = numpadFeedbackArea.querySelector(
      `.feedback-box[data-number='${boxNumber}']`
    );
    if (!targetBox || boxNumber < 0) return;
    targetBox.innerHTML = "";
    for (let i = 0; i < dotCount; i++) {
      const dot = document.createElement("div");
      dot.className = "feedback-dot";
      targetBox.appendChild(dot);
      setTimeout(() => dot.classList.add("visible", colorClass), i * 40);
    }
  }

  function clearFeedbackDots() {
    numpadFeedbackArea.querySelectorAll(".feedback-box").forEach((box) => {
      box.innerHTML = "";
    });
  }

  function init() {
    questions = APP_TEXTS.questions;
    prevButton.addEventListener("click", handlePrev);
    nextButton.addEventListener("click", handleNext);
    prevButton.textContent = APP_TEXTS.buttons.previous;
    startButton.addEventListener("click", handleStart);

    // Set logo sources
    const logoPath = APP_TEXTS.assets.logo || "assets/logo.png";
    if (logo) logo.src = logoPath;
    if (welcomeLogo) welcomeLogo.src = logoPath;

    createNumpad();
    createFeedbackArea();
    showWelcomeSlide();
  }

  function showWelcomeSlide() {
    isWelcomeSlide = true;
    welcomeSlide.classList.remove("hidden");
    welcomeDescription.textContent = APP_TEXTS.welcome.description;
    startButton.textContent = APP_TEXTS.buttons.start;

    // Hide entire main-layout and titleBar
    if (mainLayout) {
      mainLayout.classList.add("hidden");
    }
    if (titleBar) {
      titleBar.classList.add("hidden");
    }
    prevButton.disabled = true;
    nextButton.disabled = true;
    nextButton.textContent = APP_TEXTS.buttons.next;
  }

  function hideWelcomeSlide() {
    isWelcomeSlide = false;
    welcomeSlide.classList.add("hidden");

    // Show main-layout and titleBar
    if (mainLayout) {
      mainLayout.classList.remove("hidden");
    }
    if (titleBar) {
      titleBar.classList.remove("hidden");
    }
    renderQuestion(currentQuestionIndex);
  }

  function handleStart() {
    audioPlay("click");
    hideWelcomeSlide();
  }

  function createFeedbackArea() {
    numpadFeedbackArea.innerHTML = "";
    for (let i = 1; i <= 10; i++) {
      const box = document.createElement("div");
      box.className = "feedback-box";
      box.dataset.number = i;
      numpadFeedbackArea.appendChild(box);
    }
  }

  function populateCloudWithObjects(cloudEl, objectType, count) {
    const assetSrc = APP_TEXTS.assets[objectType] || APP_TEXTS.assets.balloon;
    for (let i = 0; i < count; i++) {
      const foreignObject = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "foreignObject"
      );
      const angle = (i / count) * 2 * Math.PI + Math.random() * 0.5;
      const radius = 15 + Math.random() * 20;
      const x = 50 + Math.cos(angle) * radius;
      const y = 45 + Math.sin(angle) * radius;
      const size = 28;
      foreignObject.setAttribute("x", `${x - size / 2}%`);
      foreignObject.setAttribute("y", `${y - size / 2}%`);
      foreignObject.setAttribute("width", `${size}%`);
      foreignObject.setAttribute("height", `${size}%`);
      const img = document.createElement("img");
      img.src = assetSrc;
      img.className = "cloud-object";
      foreignObject.appendChild(img);
      cloudEl.appendChild(foreignObject);
    }
  }

  function createNumpad() {
    numpadElement.innerHTML = "";
    for (let i = 1; i <= 10; i++) {
      const button = document.createElement("button");
      button.className = "number-btn";
      button.dataset.number = i;
      button.textContent = i;
      button.addEventListener("click", () => handleNumpadInput(i, button));
      numpadElement.appendChild(button);
    }
  }

  function setupCloud(cloudEl, type, question) {
    const id = cloudEl.id;
    CLOUD_SVG_PATH = question.svgPath;
    let count, gradColors;
    if (type === "left") {
      count = question.leftCloudCount;
      gradColors = question.gradLeft;
    } else if (type === "right") {
      count = question.rightCloudCount;
      gradColors = question.gradRight;
    } else {
      count = question.leftCloudCount + question.rightCloudCount;
      gradColors = question.gradMerged;
    }
    cloudEl.innerHTML = `<defs><linearGradient id="grad-${id}" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:${gradColors[0]};" /><stop offset="100%" style="stop-color:${gradColors[1]};" /></linearGradient></defs><path d="${CLOUD_SVG_PATH}" fill="url(#grad-${id})" />`;
    cloudEl.setAttribute("viewBox", "0 0 513 320");
    populateCloudWithObjects(cloudEl, question.objectType, count);
  }

  function handleNext() {
    if (nextButton.disabled) return;
    audioPlay("click");

    // Check if this is the "Start Over" button
    if (nextButton.textContent === APP_TEXTS.buttons.start_over) {
      currentQuestionIndex = 0;
      showWelcomeSlide();
      return;
    }

    currentQuestionIndex =
      currentQuestionIndex < questions.length - 1
        ? currentQuestionIndex + 1
        : 0;
    renderQuestion(currentQuestionIndex);
  }

  function handlePrev() {
    if (currentQuestionIndex > 0) {
      audioPlay("click");
      currentQuestionIndex--;
      renderQuestion(currentQuestionIndex);
    }
  }

  function highlightCloud(cloudType) {
    leftCloudElement.classList.toggle("highlight", cloudType === "left");
    rightCloudElement.classList.toggle("highlight", cloudType === "right");
  }

  function resetNumpadButtonStyles() {
    numpadElement
      .querySelectorAll(".number-btn")
      .forEach((btn) => btn.classList.remove("incorrect", "correct"));
  }

  function setFeedback(state, text) {
    characterImageElement.src =
      APP_TEXTS.characters[state] || APP_TEXTS.characters.normal;
    if (text) instructionContentElement.innerHTML = text;
  }

  function updateNavButtons() {
    prevButton.disabled = currentQuestionIndex === 0;
    nextButton.disabled = true;
    nextButton.textContent = APP_TEXTS.buttons.next;
  }

  function updateStepCounter() {
    stepCounterElement.innerHTML = "";
    questions.forEach((_, i) => {
      const dot = document.createElement("div");
      dot.className = "dot";
      if (i === currentQuestionIndex) dot.classList.add("active");
      stepCounterElement.appendChild(dot);
    });
  }

  function confettiBurst() {
    if (typeof confetti !== "function") return;
    audioPlay("confetti");
    const duration = 1 * 1000;
    const end = Date.now() + duration;
    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 85,
        origin: {
          x: 0,
        },
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 85,
        origin: {
          x: 1,
        },
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  const audioCache = {};

  function audioPlay(type) {
    if (!APP_TEXTS.audio[type]) return;
    if (!audioCache[type]) audioCache[type] = new Audio(APP_TEXTS.audio[type]);
    audioCache[type].play().catch((e) => console.error("Audio error:", e));
  }

  init();
});
