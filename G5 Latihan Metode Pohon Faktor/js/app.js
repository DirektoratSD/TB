// =================
// App Setup
// =================
const T = window.APP_TEXTS;
if (!T) {
  console.error("Error: Text data not found. Ensure texts.js is loaded.");
}

// Global DOM Elements
let appletContainer, mainLayout, leftPanel, rightPanel, contextBox, characterImageEl;
let activityArea, prevButton, nextButton, progressBarContainer;
let handFtue, handFtueImg;

// App State
let currentQuestionIndex = -1;
let currentPhase = 'intro'; // 'intro', 'breakdown', 'breakdown_complete', 'mcq', 'mcq_complete', 'end'
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
  progressBarContainer = document.getElementById('progress-bar-container');
  handFtue = document.getElementById("hand-ftue");
  handFtueImg = document.getElementById("hand-ftue-img");

  document.getElementById("html_title").textContent = T.html_title;
  document.getElementById("main_title_text").textContent = T.main_title_text;
  document.getElementById("subtitle_text").textContent = T.subtitle_text;
  prevButton.textContent = T.button_texts.prev;
  nextButton.textContent = T.button_texts.next;
  handFtueImg.src = T.item_images.ftue_cursor;

  nextButton.addEventListener("click", handleNextClick);

  renderProgressBar();
  showIntroScreen();
}

// =================
// Game Flow Control
// =================
function handleNextClick() {
  audioPlay("click");
  hideFtue();

  if (currentPhase === 'breakdown_complete') {
    showMCQ();
  } else if (currentPhase === 'mcq_complete') {
    startNextQuestion();
  }
}

function showIntroScreen() {
    currentPhase = 'intro';
    currentQuestionIndex = -1;
    
    // NEW: Hide progress bar on intro screen
    progressBarContainer.style.display = 'none';

    updateProgressBar();
    cleanUpIntro(); 
    
    activityArea.innerHTML = "";
    appletContainer.classList.add('initial-state');
    rightPanel.style.display = 'none';
    setJaxPose("normal");
    updateInstructions("step_0");
    
    const startButton = createButton(T.button_texts.start, startNextQuestion);
    const startButtonContainer = document.createElement('div');
    startButtonContainer.id = 'start-button-container';
    startButtonContainer.appendChild(startButton);
    leftPanel.appendChild(startButtonContainer);
    showFtue(startButton);
    nextButton.disabled = true;
}

function startNextQuestion() {
    if (currentPhase === 'intro') {
        currentQuestionIndex = 0;
        // NEW: Show progress bar when first question starts
        progressBarContainer.style.display = 'flex';
    } else {
        currentQuestionIndex++;
    }

    hideFtue();
    cleanUpIntro();

    if (currentQuestionIndex >= T.gameConfig.questions.length) {
        showFinalScreen();
        return;
    }

    currentPhase = 'breakdown';
    updateProgressBar();
    setJaxPose('normal');
    nextButton.disabled = true;

    appletContainer.classList.remove('initial-state');
    rightPanel.style.display = 'flex';

    const question = T.gameConfig.questions[currentQuestionIndex];
    setupGameLayout();
    updateInstructions("activity_start", { num: question.numberToFactor, qNum: currentQuestionIndex + 1 });

    activeNodeId = createNode(question.numberToFactor, { top: "5%", left: "50%" }).id;

    question.hammers.forEach((hammerNum, index) => {
        const topPos = 5 + index * 22;
        const hammerEl = createHammer(hammerNum, "20%", `${topPos}%`);
        hammerEl.addEventListener("click", () => {
            if (activeNodeId !== null) {
                const nodeToStrike = treeData[activeNodeId];
                handleStrike(hammerEl, nodeToStrike.value, nodeToStrike.id);
            }
        });
    });
}

function showMCQ() {
    currentPhase = 'mcq';
    nextButton.disabled = true;
    const question = T.gameConfig.questions[currentQuestionIndex];

    updateInstructions("summary_mcq", { num: question.numberToFactor, qNum: currentQuestionIndex + 1 });

    const hammerArea = activityArea.querySelector(".hammer-area");
    const breakdownText = activityArea.querySelector(".breakdown-text");
    if (hammerArea) hammerArea.style.display = "none";
    if (breakdownText) breakdownText.style.display = "none";

    Object.values(treeData).forEach((node) => {
        const isRoot = node.parentId === null;
        if (!isRoot && !node.isPrime) {
            const nodeCircle = node.element.querySelector(".tree-node");
            if (nodeCircle) {
                nodeCircle.classList.add("faded");
            }
        }
    });

    const treeArea = activityArea.querySelector('.factor-tree-area');
    const mcqContainer = document.createElement("div");
    mcqContainer.className = "mcq-container";
    question.mcq.options.forEach(optionText => {
        const optionButton = createButton(optionText, () => checkMcqAnswer(optionButton, optionText), 'mcq-option');
        mcqContainer.appendChild(optionButton);
    });
    treeArea.appendChild(mcqContainer);
}


function checkMcqAnswer(button, answer) {
  const question = T.gameConfig.questions[currentQuestionIndex];
  document.querySelectorAll(".mcq-option").forEach((b) => (b.disabled = true));

  if (answer === question.mcq.correctAnswer) {
    audioPlay("correct");
    setJaxPose("correct");
    button.classList.add("correct");
    currentPhase = 'mcq_complete';
    updateInstructions("summary_mcq_success");
    nextButton.disabled = false;
    showFtue(nextButton);
  } else {
    audioPlay("wrong");
    setJaxPose("wrong");
    button.classList.add("incorrect");
    updateInstructions("summary_mcq_fail");
    setTimeout(() => {
      button.classList.remove("incorrect");
      document.querySelectorAll(".mcq-option").forEach((b) => (b.disabled = false));
      setJaxPose("normal");
      updateInstructions("summary_mcq", { num: question.numberToFactor, qNum: currentQuestionIndex + 1 });
    }, 2000);
  }
}

function showFinalScreen() {
    currentPhase = 'end';
    
    // NEW: Hide progress bar on final screen
    progressBarContainer.style.display = 'none';

    activityArea.innerHTML = "";
    appletContainer.classList.add('initial-state');
    rightPanel.style.display = 'none';
    setJaxPose("correct");
    updateInstructions("final_screen");
    const startOverButton = createButton(T.button_texts.start_over, showIntroScreen);
    const startOverContainer = document.createElement("div");
    startOverContainer.id = "start-button-container";
    startOverContainer.appendChild(startOverButton);
    leftPanel.appendChild(startOverContainer);
    nextButton.disabled = true;
}

function cleanUpIntro() {
  const btnContainer = document.getElementById("start-button-container");
  if (btnContainer) btnContainer.remove();
}

// =========================
// Main Activity Functions
// =========================
function handleStrike(hammerEl, numberToStrike, nodeId) {
  const hammerNum = parseInt(hammerEl.dataset.number);
  const node = treeData[nodeId];
  if (!node || hammerEl.classList.contains("disabled")) return;

  document.querySelectorAll(".hammer").forEach((h) => h.classList.add("disabled"));

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
      if (numberToStrike % hammerNum === 0) {
        // --- SUCCESS ---
        audioPlay("strike_success");

        const treeArea = activityArea.querySelector(".factor-tree-area");
        const treeAreaRect = treeArea.getBoundingClientRect();
        const strikeEffect = document.createElement("img");
        strikeEffect.src = T.item_images.strike_gif;
        strikeEffect.className = "strike-effect";
        strikeEffect.style.left = `${targetRect.left - treeAreaRect.left + targetRect.width / 2}px`;
        strikeEffect.style.top = `${targetRect.top - treeAreaRect.top}px`;
        treeArea.appendChild(strikeEffect);
        setTimeout(() => strikeEffect.remove(), 500);

        const factor1 = hammerNum;
        const factor2 = numberToStrike / hammerNum;

        const child1Node = createNode(factor1, { parentId: node.id, side: "left" });
        const child2Node = createNode(factor2, { parentId: node.id, side: "right" });

        node.childrenIds = [child1Node.id, child2Node.id];
        document.querySelector(".breakdown-text").textContent = `${factor1} × ${factor2} = ${numberToStrike}`;

        setJaxPose("correct");
        activeNodeId = !treeData[child2Node.id].isPrime ? child2Node.id : null;
        const allPrime = checkAllNodesPrime();

        if (allPrime) {
          currentPhase = 'breakdown_complete';
          updateInstructions("activity_last_strike", { hammerNum, oldNum: numberToStrike, newNum: factor2 });
          nextButton.disabled = false;
          showFtue(nextButton);
          activeNodeId = null;
          document.querySelectorAll(".hammer").forEach((h) => h.classList.add("disabled"));
        } else {
           updateInstructions("activity_success", { hammerNum, oldNum: numberToStrike, newNum: factor2 });
           setTimeout(() => document.querySelectorAll(".hammer").forEach((h) => h.classList.remove("disabled")), 500);
        }
      } else {
        // --- FAIL ---
        audioPlay("strike_fail");
        setJaxPose("wrong");
        targetNodeEl.classList.add("incorrect");
        updateInstructions("activity_fail", { hammerNum, num: numberToStrike });

        setTimeout(() => {
            targetNodeEl.classList.remove("incorrect");
            setJaxPose("normal");
            document.querySelectorAll(".hammer").forEach((h) => h.classList.remove("disabled"));
        }, 2000);
      }

      hammerEl.classList.remove("hammer-swing");
      setTimeout(() => {
        hammerEl.style.left = hammerEl.dataset.initialLeft;
        hammerEl.style.top = hammerEl.dataset.initialTop;
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
// UI & Helper Functions
// =========================
function renderProgressBar() {
    progressBarContainer.innerHTML = '';
    T.gameConfig.questions.forEach((q, index) => {
        const stepEl = document.createElement('div');
        stepEl.className = 'progress-step';
        stepEl.id = `progress-step-${index}`;
        // NEW: Removed progress-label from template
        stepEl.innerHTML = `
            <div class="progress-circle"><span class="progress-text">${index + 1}</span></div>
        `;
        progressBarContainer.appendChild(stepEl);
    });
}

function updateProgressBar() {
    T.gameConfig.questions.forEach((q, index) => {
        const stepEl = document.getElementById(`progress-step-${index}`);
        if (!stepEl) return;
        stepEl.classList.remove('current', 'completed');
        if (index < currentQuestionIndex) {
            stepEl.classList.add('completed');
        } else if (index === currentQuestionIndex) {
            stepEl.classList.add('current');
        }
    });
}

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
    const factorTreeArea = activityArea.querySelector(".factor-tree-area");
    factorTreeArea.innerHTML = '<div class="breakdown-text"></div>';
    const hammerArea = activityArea.querySelector(".hammer-area");
    if (hammerArea) hammerArea.style.display = 'block';
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
    const childDistance = 8;
    const angle = options.side === "left" ? 120 : 60;
    const rad = angle * (Math.PI / 180);
    nodeWrapper.style.left = `calc(50% + ${childDistance * Math.cos(rad)}vw)`;
    nodeWrapper.style.top = `calc(50% + ${childDistance * Math.sin(rad) * 1}vw)`;
    nodeWrapper.style.transform = "translate(-50%, -50%)";
    parentNode.element.appendChild(nodeWrapper);
    const line = document.createElement("div");
    line.className = "line";
    line.style.height = `${childDistance}vw`;
    line.style.transform = `rotate(${angle - 90}deg)`;
    line.style.zIndex = 0;
    nodeWrapper.prepend(line);
  } else {
    nodeWrapper.style.top = options.top;
    nodeWrapper.style.left = options.left;
    nodeWrapper.style.transform = "translateX(-50%)";
    treeArea.appendChild(nodeWrapper);
  }
  setTimeout(() => nodeWrapper.classList.remove("node-entering"), 50);
  treeData[id] = { id, value, parentId: parentNode ? parentNode.id : null, childrenIds: [], element: nodeWrapper, isPrime: isPrime(value) };
  if (treeData[id].isPrime) nodeEl.classList.add("prime");
  return treeData[id];
}

function createButton(text, onClick, className = "btn-primary") {
  const button = document.createElement("button");
  button.className = `btn ${className}`;
  button.textContent = text;
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
    let title = typeof instruction.title === "function" ? instruction.title(params) : instruction.title;
    let text = typeof instruction.text === "function" ? instruction.text(params) : instruction.text;
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