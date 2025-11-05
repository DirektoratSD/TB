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
  equipmentArea,
  rightPanel,
  contextBox,
  characterImageEl;
let activityArea, nextButton, handFtue, handFtueImg;

// App State
let currentStep = 0;
let nextPaperId = 0;
let selectedTool = null;
let selectedPaper = null;
let cutCount = 0;
let glueCount = 0;
let selectedColor = { name: "Blue", value: "#64B5F6" };
let isPoseLocked = false; // <<< CHANGE 1: Added state to lock the pose
let PaperSize = 36;

// =================
// Initialization
// =================
function initApp() {
  // DOM Element Assignments
  appletContainer = document.querySelector(".applet-container");
  mainLayout = document.querySelector(".main-layout");
  leftPanel = document.querySelector(".left-panel-anchor");
  equipmentArea = document.getElementById("equipment-area");
  rightPanel = document.querySelector(".right-panel-content");
  contextBox = document.getElementById("contextBox");
  characterImageEl = document.getElementById("characterImageElement");
  activityArea = document.getElementById("activity-area");
  nextButton = document.getElementById("nextButton");
  handFtue = document.getElementById("hand-ftue");
  handFtueImg = document.getElementById("hand-ftue-img");

  // Initial Text Setup
  document.getElementById("html_title").textContent = T.html_title;
  nextButton.textContent = T.button_texts.next;
  handFtueImg.src = T.item_images.ftue_cursor;

  equipmentArea.style.opacity = 0;

  // Position marquee from logo's right edge to screen's right edge
  function updateMarqueePosition() {
    const logo = document.querySelector(".tb-logo");
    const marqueeContainer = document.querySelector(".marquee-container");
    if (logo && marqueeContainer) {
      const logoRect = logo.getBoundingClientRect();
      const containerRect = appletContainer.getBoundingClientRect();
      const logoRightEdge = logoRect.right - containerRect.left;
      marqueeContainer.style.left = `${logoRightEdge}px`;
      marqueeContainer.style.width = `${containerRect.width - logoRightEdge}px`;
    }
  }
  updateMarqueePosition();
  window.addEventListener("resize", updateMarqueePosition);

  // Event Listeners
  nextButton.addEventListener("click", () => {
    audioPlay("click");
    // FIX: The final step is now 16
    if (currentStep === 16) {
      // Special case for "Start Over"
      currentStep = -1; // Will be incremented to 0
    }
    renderStep(currentStep + 1);
  });

  // Start the app
  renderStep(0);
}

// =================
// Game Flow Control
// =================
function renderStep(step) {
  currentStep = step;
  resetStepState();

  switch (step) {
    case 0:
      appletContainer.classList.add("initial-state");
      updateInstructions("step_0");
      const startButton = createButton(
        T.button_texts.start,
        () => {
          renderStep(1);
          audioPlay("click");
        },
        "btn-primary"
      );
      const startBtnContainer = document.createElement("div");
      startBtnContainer.id = "start-button-container";
      startBtnContainer.appendChild(startButton);
      document
        .querySelector(".left-panel-anchor")
        .appendChild(startBtnContainer);
      showFtue(startButton);
      break;

    case 1:
      appletContainer.classList.remove("initial-state");
      updateInstructions("step_1");
      createPaper(`${PaperSize}vw`, `${PaperSize}vw`, "50%", "40%");
      nextButton.disabled = false;
      showFtue(nextButton);
      break;

    case 2:
      updateInstructions("step_2");
      equipmentArea.style.opacity = 1;
      createTool("scissor", T.item_images.scissor, "30%", "50%");
      nextButton.disabled = false;
      showFtue(nextButton);
      break;

    case 3:
      if (cutCount === 0) {
        updateInstructions("step_3_cut1");
        setupInteraction("scissor", "cut_vertical");
        showFtue(document.querySelector(`.tool-item[data-tool="scissor"]`));
      } else if (cutCount === 1) {
        updateInstructions("step_3_cut2");
        setupInteraction("scissor", "cut_horizontal");
        showFtue(document.querySelector(`.tool-item[data-tool="scissor"]`));
      } else {
        updateInstructions("step_3_glue_intro");
        createTool("glue_gun", T.item_images.glue_gun, "70%", "50%");
        document
          .querySelector('.tool-item[data-tool="scissor"]')
          .classList.add("disabled");
        nextButton.disabled = false;
        showFtue(nextButton);
      }
      break;

    case 4:
      if (glueCount === 0) {
        updateInstructions("step_4_glue");
        showFtue(document.querySelector(`.tool-item[data-tool="glue_gun"]`));
        setupInteraction("glue_gun", "glue_horizontal");
      } else {
        const stepInfo = T.instructions.step_4_mcq;
        updateInstructions("step_4_mcq");
        createMcq(stepInfo.options, stepInfo.correctAnswer, () => {
          setContextBoxState("correct");
          setJaxPose("correct");
          setTimeout(() => {
            updateInstructions("step_4_success");
            document.querySelector(".paper-container").style.gap = "0vw";
            nextButton.disabled = false;
            showFtue(nextButton);
          }, 1000);
        });
      }
      break;

    case 5:
      updateInstructions("step_5_palette_intro");
      document.querySelector(".paper-container").style.gap = "0.5vw";
      createColorPalette();
      nextButton.disabled = false;
      showFtue(nextButton);
      break;

    case 6:
      const colorToTry = T.gameConfig.colors[1]; // Try the second color (Merah/Red)
      updateInstructions("step_6_color", { colorName: colorToTry.name });
      showFtue(document.querySelector(`.color-swatch[data-color-name="${colorToTry.name}"]`));
      setupInteraction("color", "color");
      break;

    case 7:
      activityArea.innerHTML = "";
      equipmentArea.innerHTML = "";
      updateInstructions("step_6_success");
      appletContainer.classList.add("initial-state");
      rightPanel.style.display = "none";
      equipmentArea.style.display = "none";

      const transitionNextButton = createButton(
        T.button_texts.next,
        () => {
          renderStep(8);
          audioPlay("click");
        },
        "btn-primary"
      );
      const btnContainer = document.createElement("div");
      btnContainer.id = "start-button-container";
      btnContainer.appendChild(transitionNextButton);
      document.querySelector(".left-panel-anchor").appendChild(btnContainer);
      showFtue(transitionNextButton);
      break;

    case 8:
      setupFinalLayout();
      appletContainer.classList.remove("initial-state");
      updateInstructions("step_7_final_intro");
      activityArea.querySelector(
        ".paper-display"
      ).innerHTML = `<div class="paper-piece" style="width: ${PaperSize}vw; height: ${PaperSize}vw; position: relative; background-color: ${T.gameConfig.paperColor}; border-color: ${T.gameConfig.paperStroke}"></div>`;
      appletContainer
        .querySelector(".workingArea-container")
        .append(nextButton);
      const introText = document.createElement("h1");
      introText.id = "intro_text";
      introText.textContent = T.instructions.fraction_intro.text;
      activityArea.querySelector(".fraction-builder-area").append(introText);
      nextButton.disabled = false;
      appletContainer.querySelector(".lowerControls").innerHTML = "";
      showFtue(nextButton);
      break;

    case 9:
      updateInstructions("step_8_final_split", {
        scissorImg: T.item_images.scissor,
      });
      document.getElementById("intro_text").display = "none";
      activityArea.querySelector(".paper-display").innerHTML = `
            <div style="display: flex; gap: 0.75vw;">
                <div class="paper-piece" style="width: ${
                  PaperSize / 2
                }vw; height: ${PaperSize}vw; position: relative; background-color: ${
        T.gameConfig.paperColor
      };"></div>
                <div class="paper-piece" style="width: ${
                  PaperSize / 2
                }vw; height: ${PaperSize}vw; position: relative; background-color: ${
        T.gameConfig.paperColor
      };"></div>
            </div>`;
      nextButton.disabled = false;
      showFtue(nextButton);
      break;

    case 10:
      createFractionBuilder("denominator");
      break;

    case 11:
      updateInstructions("step_10_color_part", {
        colorName: selectedColor.name,
      });
      const finalPaperPieces = activityArea.querySelectorAll(
        ".paper-display .paper-piece"
      );
      if (finalPaperPieces.length > 0) {
        finalPaperPieces[0].style.backgroundColor = selectedColor.value;
        finalPaperPieces[0].style.filter = "none";
      }
      nextButton.disabled = false;
      showFtue(nextButton);
      break;

    case 12:
      createFractionBuilder("numerator");
      break;

    case 13: // "Perfect!"
      updateInstructions("step_11_success");
      // FIX: Removed createFractionBuilder('form_fraction') call from here
      nextButton.disabled = false;
      showFtue(nextButton);
      break;

    case 14: // "Making a fraction" - just add the line
      updateInstructions("step_12_fraction_form");
      activityArea.querySelector(".mcq-option-container")?.remove();
      createFractionBuilder("equals"); // FIX: Moved here
      nextButton.disabled = false;
      showFtue(nextButton);
      break;

    case 15: // was 15
      activityArea.querySelector(".paper-display")?.remove();
      nextButton.style.left = "44%";
      activityArea.querySelector(".fraction-builder-area").style.transform =
        "scale(1.2)";
      activityArea.style.justifyContent = "center";
      updateInstructions("step_13_final", {
        numColor: selectedColor.value,
        denColor: T.gameConfig.paperColor,
      });
      nextButton.textContent = T.button_texts.start_over;
      nextButton.disabled = false;
      showFtue(nextButton);
      break;

    case 16: // was 16
      location.reload();
      break;
  }
}

function resetStepState() {
  nextButton.disabled = true;
  hideFtue();
  setContextBoxState("normal");
  setJaxPose("normal");
  selectedTool = null;
  selectedPaper = null;

  document.querySelectorAll(".paper-piece").forEach((el) => {
    if (el.parentNode) {
      const newEl = el.cloneNode(true);
      el.parentNode.replaceChild(newEl, el);
    }
  });

  document
    .querySelectorAll(".selected")
    .forEach((el) => el.classList.remove("selected"));

  document
    .querySelectorAll(".tool-item, .paper-piece, .color-swatch")
    .forEach((el) => {
      if (!el.classList.contains("disabled")) {
        el.style.pointerEvents = "auto";
      }
    });

  if (currentStep === 0) {
    isPoseLocked = false; // <<< CHANGE 2: Unlock the pose on reset
    appletContainer.classList.remove("final-phase-layout", "initial-state");

    rightPanel.style.display = "flex";
    equipmentArea.style.display = "flex";
    equipmentArea.style.opacity = 0;

    activityArea.innerHTML = "";
    equipmentArea.innerHTML = "";
    nextPaperId = 0;
    cutCount = 0;
    glueCount = 0;
    nextButton.textContent = T.button_texts.next;
  }
  const startBtn = document.getElementById("start-button-container");
  if (startBtn) startBtn.remove();
}

function setupFinalLayout() {
  appletContainer.classList.add("final-phase-layout");
  setJaxPose("speaking_head");
  isPoseLocked = true; // <<< CHANGE 3: Lock the pose
  rightPanel.style.display = "flex";
  equipmentArea.style.display = "none";
  activityArea.innerHTML = "";
  const builderArea = document.createElement("div");
  builderArea.className = "fraction-builder-area";
  const paperDisplay = document.createElement("div");
  paperDisplay.className = "paper-display";
  activityArea.append(builderArea, paperDisplay);
}

// =========================
// UI & Element Creation
// =========================

function createPaper(width, height, left, top) {
  const container = document.createElement("div");
  container.className = "paper-container";
  container.style.width = width;
  container.style.height = height;

  const piece = document.createElement("div");
  piece.className = "paper-piece";
  piece.dataset.id = nextPaperId++;
  piece.style.width = "100%";
  piece.style.height = "100%";
  piece.style.backgroundColor = T.gameConfig.paperColor;

  container.appendChild(piece);
  activityArea.appendChild(container);
  return container;
}

function createTool(toolName, imgSrc, top, left) {
  const tool = document.createElement("div");
  tool.className = "tool-item";
  tool.dataset.tool = toolName;
  tool.innerHTML = `<img src="${imgSrc}" alt="${toolName}">`;
  tool.style.top = top;
  tool.style.left = left;
  tool.style.transform = "translate(-50%, -50%)";
  equipmentArea.appendChild(tool);
  return tool;
}

function createColorPalette() {
  const paletteContainer = document.createElement("div");
  paletteContainer.className = "color-palette-container";
  T.gameConfig.colors.forEach((color) => {
    const swatch = document.createElement("div");
    swatch.className = "color-swatch";
    swatch.style.backgroundColor = color.value;
    swatch.dataset.colorName = color.name;
    swatch.dataset.colorValue = color.value;
    paletteContainer.appendChild(swatch);
  });
  activityArea.appendChild(paletteContainer);
}

function createButton(text, onClick, className = "btn-primary") {
  const button = document.createElement("button");
  button.className = `btn ${className}`;
  button.innerHTML = text;
  button.addEventListener("click", onClick);
  return button;
}

function createMcq(options, correctAnswer, onSuccess, parentElement) {
  const container = document.createElement("div");
  container.className = "mcq-option-container";

  options.forEach((optionText) => {
    const btn = createButton(
      optionText,
      () => {
        audioPlay("click");
        container
          .querySelectorAll(".mcq-btn")
          .forEach((b) => (b.disabled = true));

        if (optionText === correctAnswer) {
          audioPlay("correct");
          btn.classList.add("correct");
          onSuccess();
        } else {
          audioPlay("wrong");
          btn.classList.add("incorrect");
          setContextBoxState("incorrect");
          setJaxPose("wrong");
          setTimeout(() => {
            btn.classList.remove("incorrect");
            setContextBoxState("normal");
            setJaxPose("normal");
            container
              .querySelectorAll(".mcq-btn")
              .forEach((b) => (b.disabled = false));
          }, 1500);
        }
      },
      "mcq-btn"
    );
    container.appendChild(btn);
  });

  const targetParent =
    parentElement || document.querySelector(".context-section");
  const existingMcq = targetParent.querySelector(".mcq-option-container");
  if (existingMcq) existingMcq.remove();

  targetParent.appendChild(container);
}

// =========================
// Interaction Logic
// =========================

function setupInteraction(toolType, action) {
  const tools = document.querySelectorAll(
    `.tool-item[data-tool="${toolType}"]`
  );
  const papers = document.querySelectorAll(".paper-piece");
  const swatches = document.querySelectorAll(".color-swatch");

  const handleToolClick = (e) => {
    // CHANGE 1: Disallow selection on disabled tools.
    if (e.currentTarget.classList.contains("disabled")) {
      return;
    }

    selectedTool = e.currentTarget;
    document
      .querySelectorAll(".tool-item, .color-swatch")
      .forEach((t) => t.classList.remove("selected"));
    selectedTool.classList.add("selected");
    audioPlay("click");

    // CHANGE 2: Show FTUE on the correct paper piece for gluing.
    if (selectedTool.dataset.tool === "glue_gun") {
      // Find one of the small squares inside the vertical container.
      const targetPaper = document.querySelector(
        '.paper-container div[style*="flex-direction: column"] .paper-piece'
      );
      showFtue(targetPaper);
    } else {
      // Default behavior for other tools.
      showFtue(document.querySelector(".paper-piece"));
    }
  };

  const handlePaperClick = (e) => {
    if (!selectedTool) return;
    selectedPaper = e.currentTarget;
    hideFtue();
    selectedPaper.classList.add("selected");
    audioPlay("click");

    document
      .querySelectorAll(".tool-item, .paper-piece, .color-swatch")
      .forEach((el) => (el.style.pointerEvents = "none"));
    animateAndPerformAction(action, selectedTool, selectedPaper);
  };

  if (toolType === "color") {
    swatches.forEach((swatch) =>
      swatch.addEventListener("click", handleToolClick)
    );
    papers.forEach((paper) =>
      paper.addEventListener("click", (e) => {
        if (!selectedTool || !selectedTool.classList.contains("color-swatch"))
          return;
        const targetPaper = e.currentTarget;
        selectedColor = {
          name: selectedTool.dataset.colorName,
          value: selectedTool.dataset.colorValue,
        };
        showFtue(document.querySelector(".paper-piece"));
        targetPaper.style.backgroundColor = selectedColor.value;
        setJaxPose("correct");
        setTimeout(() => {
          hideFtue();
        }, 1000);
        audioPlay("paint");

        document
          .querySelectorAll(".paper-piece, .color-swatch")
          .forEach((el) => (el.style.pointerEvents = "none"));

        setTimeout(() => {
          const stepInfo = T.instructions.step_6_mcq;
          updateInstructions("step_6_mcq", { colorName: selectedColor.name });
          createMcq(stepInfo.options, stepInfo.correctAnswer, () => {
            setContextBoxState("correct");
            setTimeout(() => {
              renderStep(7);
            }, 1500);
          });
        }, 500);
      })
    );
  } else {
    tools.forEach((tool) => tool.addEventListener("click", handleToolClick));
    papers.forEach((paper) =>
      paper.addEventListener("click", handlePaperClick)
    );
  }
}

async function animateAndPerformAction(action, tool, paper) {
  const toolRect = tool.getBoundingClientRect();
  const paperRect = paper.getBoundingClientRect();
  const activityRect = activityArea.getBoundingClientRect();
  const originalTop = tool.style.top;
  const originalLeft = tool.style.left;

  let success = false;

  // --- Animation & Action Logic ---
  if (action.includes("cut")) {
    let startX, startY, endX, endY;
    if (action.includes("vertical")) {
      startX = paperRect.left - paperRect.width / 2;
      endX = startX;
      startY = paperRect.top + paperRect.height;
      endY = paperRect.top;
    } else {
      // horizontal
      startY = paperRect.top + paperRect.height / 3;
      endY = startY;
      startX = paperRect.left - paperRect.width - activityRect.width / 2;
      tool.style.rotate = `90deg`;
      endX = paperRect.left - (3 * paperRect.width) / 2;
    }

    tool.style.left = `${startX + toolRect.width / 4}px`;
    tool.style.top = `${startY - toolRect.height / 2}px`;
    await delay(600);

    audioPlay("cut");
    tool.style.left = `${endX + toolRect.width / 4}px`;
    tool.style.top = `${endY - toolRect.height / 2}px`;
    await delay(700);
    tool.style.rotate = `0deg`;

    if (action === "cut_vertical") {
      const parentContainer = paper.parentElement;
      parentContainer.innerHTML = "";
      parentContainer.style.flexDirection = "row";
      const p1 = document.createElement("div");
      p1.className = "paper-piece";
      p1.style.width = "50%";
      p1.style.height = "100%";
      p1.style.backgroundColor = T.gameConfig.paperColor;
      const p2 = document.createElement("div");
      p2.className = "paper-piece";
      p2.style.width = "50%";
      p2.style.height = "100%";
      p2.style.backgroundColor = T.gameConfig.paperColor;
      parentContainer.append(p1, p2);
      cutCount++;
    } else if (action === "cut_horizontal") {
      const grandParentContainer = paper.parentElement;
      const newSubContainer = document.createElement("div");
      newSubContainer.style.cssText = `display: flex; flex-direction: column; width: ${paper.style.width}; height: ${paper.style.height}; gap: 0.5vw;`;
      const p1 = document.createElement("div");
      p1.className = "paper-piece";
      p1.style.width = "100%";
      p1.style.height = "50%";
      p1.style.backgroundColor = T.gameConfig.paperColor;
      const p2 = document.createElement("div");
      p2.className = "paper-piece";
      p2.style.width = "100%";
      p2.style.height = "50%";
      p2.style.backgroundColor = T.gameConfig.paperColor;
      newSubContainer.append(p1, p2);
      grandParentContainer.replaceChild(newSubContainer, paper);
      cutCount++;
    }
    success = true;
  } else if (action === "glue_horizontal") {
    const subContainer = paper.parentElement;
    if (
      subContainer &&
      subContainer.style.flexDirection === "column" &&
      subContainer.querySelectorAll(".paper-piece").length === 2
    ) {
      // SUCCESS CASE
      const joinEdgeY =
        subContainer.children[0].getBoundingClientRect().bottom -
        activityRect.top;
      const startX =
        subContainer.getBoundingClientRect().left - activityRect.left / 2;
      const endX =
        subContainer.getBoundingClientRect().right - activityRect.left / 2;

      tool.style.left = `${startX - toolRect.width}px`;
      tool.style.top = `${joinEdgeY - toolRect.height / 2}px`;
      await delay(600);

      audioPlay("glue");
      tool.style.left = `${endX - toolRect.width / 2}px`;
      await delay(700);

      const grandParentContainer = subContainer.parentElement;
      const restoredRectangle = document.createElement("div");
      restoredRectangle.className = "paper-piece";
      restoredRectangle.style.width = subContainer.style.width;
      restoredRectangle.style.height = subContainer.style.height;
      restoredRectangle.style.backgroundColor = T.gameConfig.paperColor;
      grandParentContainer.replaceChild(restoredRectangle, subContainer);

      glueCount++;
      tool.classList.add("disabled");
      success = true;
    } else {
      // FAILURE CASE: Clicked wrong paper
      audioPlay("wrong");
      updateInstructions("feedback_glue_fail");
      setContextBoxState("incorrect");
      setJaxPose("wrong");

      tool.style.top = originalTop;
      tool.style.left = originalLeft; // Return tool immediately
      await delay(3000); // Wait for user to read feedback

      selectedTool.classList.remove("selected");
      selectedPaper.classList.remove("selected");
      selectedTool = null;
      selectedPaper = null;
      document
        .querySelectorAll(".tool-item:not(.disabled), .paper-piece")
        .forEach((el) => (el.style.pointerEvents = "auto"));
      setContextBoxState("normal");
      setJaxPose("normal");
      updateInstructions("step_4_glue"); // Restore original instructions
      return; // Exit function early
    }
  }

  // --- Return tool and re-render step on success ---
  tool.style.top = originalTop;
  tool.style.left = originalLeft;
  await delay(500);

  if (success) {
    renderStep(currentStep);
  }
}

function createFractionBuilder(part) {
  const area = activityArea.querySelector(".fraction-builder-area");
  if (!area) return;

  const instructionKey =
    part === "denominator"
      ? "step_9_denominator"
      : part === "numerator"
      ? "step_11_numerator"
      : null;
  const stepInfo = instructionKey ? T.instructions[instructionKey] : null;

  if (part === "denominator" || part === "numerator") {
    if (!stepInfo) {
      console.error(
        `Instruction key "${instructionKey}" not found in texts.js`
      );
      return;
    }
    updateInstructions(instructionKey, {
      color: selectedColor.value,
      colorName: selectedColor.name,
    });

    const existingContent =
      area.querySelector(".fraction-display-area")?.innerHTML || "";

    const labelColor =
      part === "numerator" ? selectedColor.value : T.gameConfig.paperStroke;
    const coloredLabel = `<b style="color: ${labelColor};">${stepInfo.label}</b>`;

    let newPartHTML = `
            <div class="fraction-part" data-part="${part}">
                <span class="fraction-label">${coloredLabel}</span>
                <div class="fraction-number-box" id="${part}-box"></div>
            </div>`;

    area.innerHTML = `<div class="fraction-display-area">
            ${
              part === "numerator"
                ? newPartHTML + existingContent
                : existingContent + newPartHTML
            }
        </div>`;

    createMcq(
      stepInfo.options,
      stepInfo.correctAnswer,
      () => {
        const box = document.getElementById(`${part}-box`);
        box.textContent = stepInfo.correctAnswer;
        box.classList.add("filled");
        box.style.color =
          part === "numerator" ? selectedColor.value : T.gameConfig.paperStroke;

        setJaxPose("correct");
        setContextBoxState("correct");

        setTimeout(() => {
          nextButton.disabled = false;
          showFtue(nextButton);
        }, 500);
      },
      area
    );
  } else if (part === "form_fraction") {
    const fractionArea = area.querySelector(".fraction-display-area");
    if (fractionArea && !fractionArea.querySelector(".fraction-line")) {
      const denPart = fractionArea.querySelector('[data-part="denominator"]');
      const line = document.createElement("div");
      line.className = "fraction-line";
      fractionArea.insertBefore(line, denPart);
    }
  } else if (part === "equals") {
    const fractionArea = area.querySelector(".fraction-display-area");
    if (!fractionArea) return;

    const numLabelText =
      fractionArea.querySelector('[data-part="numerator"] .fraction-label')
        ?.innerHTML || "";
    const denLabelText =
      fractionArea.querySelector('[data-part="denominator"] .fraction-label')
        ?.innerHTML || "";
    const numValue =
      fractionArea.querySelector("#numerator-box")?.textContent || "";
    const denValue =
      fractionArea.querySelector("#denominator-box")?.textContent || "";
    const numColor =
      fractionArea.querySelector("#numerator-box")?.style.color ||
      selectedColor.value;
    const denColor =
      fractionArea.querySelector("#denominator-box")?.style.color ||
      T.gameConfig.paperColor;

    fractionArea.innerHTML = "";
    fractionArea.classList.add("final-form");

    const newHTML = `
            <div class="fraction-column">
                <div class="fraction-label">${numLabelText}</div>
                <div class="fraction-line"></div>
                <div class="fraction-label">${denLabelText}</div>
            </div>
            <div class="equals-sign">=</div>
            <div class="fraction-column">
                <div class="fraction-number-box filled" style="color: ${numColor};">${numValue}</div>
                <div class="fraction-line"></div>
                <div class="fraction-number-box filled" style="color: ${denColor};">${denValue}</div>
            </div>
        `;
    fractionArea.innerHTML = newHTML;
  }
}

// =========================
// General Helper Functions
// =========================
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

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
  }
}

function showFtue(element) {
  if (!element || !handFtue) return;
  setTimeout(() => {
    const rect = element.getBoundingClientRect();
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
  // Check if the pose is locked. If it is, do nothing.
  if (isPoseLocked) return;

  // The rest of the function remains the same.
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

document.addEventListener("DOMContentLoaded", initApp);
