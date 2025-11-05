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
let treeData = {};
let nextNodeId = 0;
let activeNodeId = null;

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

  nextButton.addEventListener("click", handleNextClick);

  renderStep(currentStep);
}

// =================
// Game Flow Control
// =================
function renderStep(step) {
  currentStep = step;
  const stepsThatClearLayout = [1, 2];
  if (stepsThatClearLayout.includes(step)) {
    activityArea.innerHTML = "";
  }
  nextButton.disabled = true;
  hideFtue();
  setJaxPose("normal");
  setContextBoxState("normal");
  appletContainer.classList.remove("initial-state");

  // UPDATED: Renumbered steps for a smoother flow.
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

    case 3: // First interactive step (Try on 8)
      setupGameLayout();
      updateInstructions("step_3");
      createNode(8, { top: "10%", left: "50%" });
      const hammer2 = createHammer(2, "20%", "40%");
      hammer2.addEventListener("click", () => handleStrike(hammer2, 8, 0));
      break;

    case 4: // Second interactive step (Try on 9) - (was step 5)
      setupGameLayout();
      updateInstructions("step_4");
      createNode(9, { top: "10%", left: "50%" });
      const hammer2_fail = createHammer(2, "20%", "40%");
      hammer2_fail.addEventListener("click", () =>
        handleStrike(hammer2_fail, 9, 0)
      );
      break;

    case 5: // Third interactive step (Try on 12) - (was step 7)
      setupGameLayout();
      updateInstructions("step_5");
      createNode(12, { top: "10%", left: "50%" });
      const hammer3 = createHammer(3, "20%", "20%");
      const hammer5 = createHammer(5, "20%", "60%");
      hammer3.addEventListener("click", () => handleStrike(hammer3, 12, 0));
      hammer5.addEventListener("click", () => handleStrike(hammer5, 12, 0));
      break;

    case 6: // Start main game question - (was step 9)
      startQuestion(0);
      break;

    case 7: // Summary Step 1 - (was step 10)
      summarize_step1();
      break;

    case 8: // Summary Step 2 (MCQ) - (was step 11)
      summarize_step2();
      break;

    case 9: // Summary Step 3 (Highlighting) - (was step 12)
      summarize_step3();
      break;

    case 10: // Final Screen - (was step 13)
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

  activeNodeId = createNode(question.numberToFactor, {
    top: "10%",
    left: "50%",
  }).id;

  question.hammers.forEach((hammerNum, index) => {
    const topPos = 15 + index * 20;
    const hammerEl = createHammer(hammerNum, "20%", `${topPos}%`);
    hammerEl.addEventListener("click", () => {
      if (activeNodeId !== null) {
        const nodeToStrike = treeData[activeNodeId];
        handleStrike(hammerEl, nodeToStrike.value, nodeToStrike.id);
      }
    });
  });
}

function handleStrike(hammerEl, numberToStrike, nodeId) {
  const hammerNum = parseInt(hammerEl.dataset.number);
  const node = treeData[nodeId];
  if (!node || hammerEl.classList.contains("disabled")) return;

  document
    .querySelectorAll(".hammer")
    .forEach((h) => h.classList.add("disabled"));

  const targetNodeEl = node.element.querySelector(".tree-node");
  const targetRect = targetNodeEl.getBoundingClientRect();
  const hammerRect = hammerEl.getBoundingClientRect();
  const activityRect = activityArea.getBoundingClientRect();

  const targetX = targetRect.left - activityRect.left - hammerRect.width * 0.8;
  const targetY = targetRect.top - activityRect.top;
  hammerEl.style.left = `calc(${targetX}px + 10vw)`;
  hammerEl.style.top = `calc(${targetY}px - 6vw)`;

  setTimeout(() => {
    hammerEl.classList.add("hammer-swing");

    setTimeout(() => {
      const isTutorialStep = [3, 4, 5].includes(currentStep); // Updated step numbers
      const isSuccess = numberToStrike % hammerNum === 0;

      if (isSuccess) {
        // --- SUCCESS ---
        audioPlay("strike_success");
        setContextBoxState("correct");
        setJaxPose("correct");

        const treeArea = activityArea.querySelector(".factor-tree-area");
        const treeAreaRect = treeArea.getBoundingClientRect();
        const strikeEffect = document.createElement("img");
        strikeEffect.src = T.item_images.strike_gif;
        strikeEffect.className = "strike-effect";
        strikeEffect.style.left = `${
          targetRect.left - treeAreaRect.left + targetRect.width / 2
        }px`;
        strikeEffect.style.top = `${targetRect.top - treeAreaRect.top}px`;
        treeArea.appendChild(strikeEffect);
        setTimeout(() => strikeEffect.remove(), 500);

        const factor1 = hammerNum;
        const factor2 = numberToStrike / hammerNum;

        const child1Node = createNode(factor1, {
          parentId: node.id,
          side: "left",
        });
        const child2Node = createNode(factor2, {
          parentId: node.id,
          side: "right",
        });

        node.childrenIds = [child1Node.id, child2Node.id];
        document.querySelector(
          ".breakdown-text"
        ).textContent = `${factor1} × ${factor2} = ${numberToStrike}`;

        // UPDATED: Logic to persist feedback until "Next" is clicked
        if (currentStep === 3) {
          updateInstructions("step_3_success");
          nextButton.disabled = false;
          showFtue(nextButton);
        } else if (currentStep === 5) {
          updateInstructions("step_5_success", { hammerNum });
          nextButton.disabled = false;
          showFtue(nextButton);
        }

        activeNodeId = !treeData[child2Node.id].isPrime ? child2Node.id : null;
        const allPrime = checkAllNodesPrime();

        if (allPrime) {
          updateInstructions("activity_last_strike", {
            hammerNum,
            oldNum: numberToStrike,
            newNum: factor2,
          });
          nextButton.disabled = false;
          showFtue(nextButton);
          activeNodeId = null;
        } else if (!isTutorialStep) {
          updateInstructions("activity_success", {
            hammerNum,
            oldNum: numberToStrike,
            newNum: factor2,
          });
        }
      } else {
        // --- FAIL ---
        audioPlay("strike_fail");
        setJaxPose("wrong");
        setContextBoxState("incorrect");
        targetNodeEl.classList.add("incorrect");

        // UPDATED: Logic to persist feedback until "Next" is clicked
        if (currentStep === 4) {
          // was step 5
          updateInstructions("step_4_fail");
          nextButton.disabled = false;
          showFtue(nextButton);
        } else if (!isTutorialStep) {
          updateInstructions("activity_fail", {
            hammerNum,
            num: numberToStrike,
          });
          setTimeout(() => {
            targetNodeEl.classList.remove("incorrect");
            setJaxPose("normal");
            setContextBoxState("normal");
          }, 2000);
        }
        else{
          updateInstructions("activity_fail", {
            hammerNum,
            num: numberToStrike,
          });
          setTimeout(() => {
            targetNodeEl.classList.remove("incorrect");
            setJaxPose("normal");
            setContextBoxState("normal");
          }, 2000);
        }
      }

      hammerEl.classList.remove("hammer-swing");

      setTimeout(() => {
        hammerEl.style.left = hammerEl.dataset.initialLeft;
        hammerEl.style.top = hammerEl.dataset.initialTop;

        const allPrime = checkAllNodesPrime();
        if (!isTutorialStep && !allPrime) {
          const delay = isSuccess ? 0 : 1500;
          setTimeout(() => {
            document
              .querySelectorAll(".hammer")
              .forEach((h) => h.classList.remove("disabled"));
          }, delay);
        } else if (isTutorialStep && !isSuccess && currentStep !== 4) {
          // Re-enable hammers on fail for steps that allow retries (e.g. step 5 with multiple hammers)
          document.querySelectorAll(".hammer").forEach((h) => {
            if (h !== hammerEl) {
              h.classList.remove("disabled");
            }
          });
        }
      }, 500);
    }, 500);
  }, 500);
}

function checkAllNodesPrime() {
  const leafNodes = Object.values(treeData).filter(
    (node) => node.childrenIds.length === 0
  );
  if (leafNodes.length === 0) return false;
  return leafNodes.every((node) => node.isPrime);
}

// =========================
// Summarization Functions
// =========================
function summarize_step1() {
  const question = T.gameConfig.questions[currentQuestionIndex];
  const finalFactors = Object.values(treeData)
    .filter((node) => node.childrenIds.length === 0)
    .map((node) => node.value)
    .sort((a, b) => a - b);

  updateInstructions("summary_1", {
    num: question.numberToFactor,
    factors: finalFactors.join(", "),
  });
  setContextBoxState("correct");

  const hammerArea = activityArea.querySelector(".hammer-area");
  const breakdownText = activityArea.querySelector(".breakdown-text");
  if (hammerArea) hammerArea.style.display = "none";
  if (breakdownText) breakdownText.style.display = "none";

  Object.values(treeData).forEach((node) => {
    const isRoot = node.parentId === null;
    const isPrime = node.isPrime;

    if (!isRoot && !isPrime) {
      const nodeCircle = node.element.querySelector(".tree-node");
      if (nodeCircle) {
        nodeCircle.classList.add("faded");
      }
    }
  });

  nextButton.disabled = false;
  showFtue(nextButton);
}

function summarize_step2() {
  const question = T.gameConfig.questions[currentQuestionIndex];
  updateInstructions("summary_2", { num: question.numberToFactor });
  setContextBoxState("normal");

  const treeArea = activityArea.querySelector(".factor-tree-area");
  if (!treeArea) {
    return;
  }

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
  treeArea.appendChild(mcqContainer);
}

function checkMcqAnswer(button, answer) {
  const question = T.gameConfig.questions[currentQuestionIndex];
  const isCorrect = answer === question.mcq.correctAnswer;

  // Disable all buttons once an answer is chosen to prevent changes
  document.querySelectorAll(".mcq-option").forEach((b) => {
    b.disabled = true;
  });

  if (isCorrect) {
    audioPlay("correct");
    setJaxPose("correct");
    setContextBoxState("correct");

    button.classList.add("correct");
    updateInstructions("summary_2_success");
    nextButton.disabled = false;
    showFtue(nextButton);
  } else {
    audioPlay("wrong");
    setJaxPose("wrong");
    setContextBoxState("incorrect");

    button.classList.add("incorrect");
    updateInstructions("summary_2_fail");

    // Re-enable buttons so the user can try again
    setTimeout(() => {
      setContextBoxState("normal");
      document.querySelectorAll(".mcq-option").forEach((b) => {
        b.disabled = false;
        b.classList.remove("incorrect");
      });
    }, 2000);
  }
}

async function summarize_step3() {
  updateInstructions("summary_3");
  setContextBoxState("correct");
  const question = T.gameConfig.questions[currentQuestionIndex];

  const treeArea = activityArea.querySelector(".factor-tree-area");
  if (!treeArea) return;

  const mcqContainer = treeArea.querySelector(".mcq-container");
  if (mcqContainer) mcqContainer.style.display = "none";

  const finalResult = document.createElement("div");
  finalResult.className = "final-factorization-text";
  treeArea.appendChild(finalResult);

  const rootNode = Object.values(treeData).find(
    (node) => node.parentId === null
  );
  const leafNodes = Object.values(treeData)
    .filter((node) => node.childrenIds.length === 0)
    .sort((a, b) => a.value - b.value);

  let html = `<span class="step-factor num-root" data-node-id="${rootNode.id}">${rootNode.value}</span> <span>=</span>`;
  const factorSpans = leafNodes.map(
    (node) =>
      `<span class="step-factor num-prime" data-node-id="${node.id}">${node.value}</span>`
  );
  html += factorSpans.join("<span>×</span>");
  finalResult.innerHTML = html;

  const nodesToHighlight = [rootNode, ...leafNodes];
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  // Disable next button during animation
  nextButton.disabled = true;

  for (const node of nodesToHighlight) {
    const textSpan = finalResult.querySelector(`[data-node-id="${node.id}"]`);
    const treeNodeEl = node.element.querySelector(".tree-node");

    if (textSpan && treeNodeEl) {
      textSpan.classList.add("highlight");
      treeNodeEl.classList.add("highlight");

      await delay(1000);
      audioPlay("correct");

      textSpan.classList.remove("highlight");
      treeNodeEl.classList.remove("highlight");

      await delay(200);
    }
  }

  nextButton.disabled = false;
  showFtue(nextButton);
}

// =========================
// UI & Helper Functions
// =========================
function setupGameLayout() {
  if (!activityArea.querySelector(".game-layout")) {
    activityArea.innerHTML = `
        <div class="game-layout">
            <div class="hammer-area"></div>
            <div class="factor-tree-area">
                <div class="breakdown-text"></div>
            </div>
        </div>`;
  } else {
    activityArea.querySelector(".hammer-area").innerHTML = "";
    activityArea.querySelector(".factor-tree-area").innerHTML =
      '<div class="breakdown-text"></div>';
  }
  treeData = {};
  nextNodeId = 0;
  activeNodeId = null;
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

function createNode(value, options) {
  const treeArea = activityArea.querySelector(".factor-tree-area");
  const id = nextNodeId++;

  const nodeWrapper = document.createElement("div");
  nodeWrapper.className = "tree-node-wrapper node-entering";

  const nodeEl = document.createElement("div");
  nodeEl.className = "tree-node";
  nodeEl.textContent = value;
  nodeWrapper.appendChild(nodeEl);

  let parentNode = null;
  if (options.parentId !== undefined && treeData[options.parentId]) {
    parentNode = treeData[options.parentId];
  }

  if (parentNode) {
    const parentWrapper = parentNode.element;
    const childDistance = 12;
    const angle = options.side === "left" ? 135 : 45;
    const rad = angle * (Math.PI / 180);

    nodeWrapper.style.left = `calc(50% + ${childDistance * Math.cos(rad)}vw)`;
    nodeWrapper.style.top = `calc(50% + ${
      childDistance * Math.sin(rad) * 0.8
    }vw)`;
    nodeWrapper.style.transform = "translate(-50%, -50%)";

    parentWrapper.appendChild(nodeWrapper);

    const line = document.createElement("div");
    line.className = "line";
    line.style.height = `${childDistance * 0.9}vw`;
    line.style.transform = `rotate(${angle - 90}deg)`;
    nodeWrapper.prepend(line);
  } else {
    nodeWrapper.style.top = options.top;
    nodeWrapper.style.left = options.left;
    nodeWrapper.style.transform = "translateX(-50%)";
    treeArea.appendChild(nodeWrapper);
  }

  setTimeout(() => nodeWrapper.classList.remove("node-entering"), 50);

  treeData[id] = {
    id,
    value,
    parentId: parentNode ? parentNode.id : null,
    childrenIds: [],
    element: nodeWrapper,
    isPrime: isPrime(value),
  };

  if (treeData[id].isPrime) nodeEl.classList.add("prime");
  return treeData[id];
}

function createButton(text, onClick, className = "btn-primary") {
  const button = document.createElement("button");
  button.className = `btn ${className}`;
  button.innerHTML = text;
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
    contextSection.innerHTML = `<h2>${title}</h2><div><p>${text}</p></div>`;

    contextSection.querySelectorAll(".inline-hammer").forEach((img) => {
      if (img.parentElement.className === "inline-hammer-wrapper") return;
      const hammerNum = img.dataset.number;
      const wrapper = document.createElement("div");
      wrapper.className = "inline-hammer-wrapper";
      img.parentNode.insertBefore(wrapper, img);
      wrapper.appendChild(img);

      const numberEl = document.createElement("span");
      numberEl.textContent = hammerNum;
      numberEl.style.position = "absolute";
      numberEl.style.top = "45%";
      numberEl.style.left = "25%";
      numberEl.style.transform = "translate(-50%, -50%)";
      numberEl.style.color = "#ffd39a";
      numberEl.style.filter = "drop-shadow(0.02vw 0.02vw 0.02vw #3f2603)";
      numberEl.style.textShadow = "-0.02vw -0.02vw 0.02vw #f3ddc2";
      numberEl.style.fontWeight = "bold";
      numberEl.style.fontSize = "1.5vw";
      wrapper.appendChild(numberEl);
    });
  }
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

// =================
// Marquee Positioning
// =================
function positionMarquee() {
  const logo = document.querySelector(".tb-logo");
  const marqueeContainer = document.querySelector(".marquee-container");
  
  if (logo && marqueeContainer) {
    const logoRect = logo.getBoundingClientRect();
    const logoRightEdge = logoRect.right;
    marqueeContainer.style.left = `${logoRightEdge}px`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initApp();
  // Position marquee initially and after images load
  positionMarquee();
  window.addEventListener("load", positionMarquee);
  window.addEventListener("resize", positionMarquee);
});
