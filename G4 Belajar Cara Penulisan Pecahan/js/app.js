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
let selectedColor = { name: "Green", value: "#81C784" };
let isPoseLocked = false;
let isAnimating = false;
let PaperSize = 40;
let colorStep = 0;

// =================
// Initialization
// =================
function initApp() {
  // DOM Element Assignments
  appletContainer = document.querySelector(".applet-container");
  mainLayout = document.querySelector(".main-layout");
  equipmentArea = document.getElementById("equipment-area");
  rightPanel = document.querySelector(".right-panel-content");
  contextBox = document.getElementById("contextBox");
  characterImageEl = document.getElementById("characterImageElement");
  activityArea = document.getElementById("activity-area");
  nextButton = document.getElementById("nextButton");
  handFtue = document.getElementById("hand-ftue");
  handFtueImg = document.getElementById("hand-ftue-img");

  // Position marquee from logo right edge to screen right edge
  positionMarquee();

  // Initial Text Setup
  document.getElementById("html_title").textContent = T.html_title;
  document.getElementById("main_title_text").textContent = T.main_title_text;
  document.getElementById("subtitle_text").textContent = T.subtitle_text;
  nextButton.textContent = T.button_texts.next;
  handFtueImg.src = T.item_images.ftue_cursor;

  // Event Listeners
  // <<< MODIFIED: Updated nextButton listener to handle "Reset" and "Start Over" states
  nextButton.addEventListener("click", () => {
    if (isAnimating) return;
    audioPlay("click");

    // Handle "Reset" button state for the scissor challenge
    if (nextButton.textContent === T.button_texts.reset) {
      renderStep(15);
      return;
    }

    // Handle "Start Over" button on the final screen
    if (currentStep === 17) {
      renderStep(18); // This step triggers a page reload
      return;
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
  if (step === 0) {
    resetStepState(true);
    setJaxPose("normal");
    appletContainer.querySelector(".lowerControls").append(nextButton);
  } else {
    resetStepState();
  }

  // <<< MODIFIED: Steps 15 and beyond have been re-numbered and updated
  switch (step) {
    case 0:
      updateInstructions("step_0_intro");
      createPaper(`${PaperSize}vw`, `${PaperSize}vw`, "50%", "48%");
      createTool("scissor-2", T.item_images.scissor, "15%", "50%");
      nextButton.disabled = false;
      showFtue(nextButton);
      break;

    case 1:
      updateInstructions("step_1_intro_s3");
      createTool("scissor-3", T.item_images.scissor_3, "40%", "50%");
      nextButton.disabled = false;
      showFtue(nextButton);
      break;

    case 2: // Handles BOTH cuts for the 1/3 fraction
      if (cutCount === 0) {
        updateInstructions("step_2_use_s3");
        document
          .querySelector('.tool-item[data-tool="scissor-2"]')
          .classList.add("disabled");
        showFtue(document.querySelector(`.tool-item[data-tool="scissor-3"]`));
        setupInteraction("scissor-3", "cut_vertical_3");
      } else if (cutCount === 1) {
        updateInstructions("step_3_cut_again");
        showFtue(document.querySelector(`.tool-item[data-tool="scissor-3"]`));
        setupInteraction("scissor-3", "cut_horizontal_3");
      } else {
        renderStep(3); // Both cuts are done
      }
      break;

    case 3: // Handles ALL gluing actions
      if (glueCount < 1) {
        updateInstructions("step_4_glue_intro");
        document
          .querySelectorAll('.tool-item[data-tool^="scissor"]')
          .forEach((s) => s.classList.add("disabled"));
        if (!equipmentArea.querySelector('[data-tool="glue_gun"]')) {
          createTool("glue_gun", T.item_images.glue_gun, "90%", "50%");
        }
        showFtue(document.querySelector(`.tool-item[data-tool="glue_gun"]`));
        setupInteraction("glue_gun", "glue");
      } else {
        renderStep(4); // Gluing is complete
      }
      break;

    case 4:
      const stepInfo = T.instructions.step_5_count_mcq;
      updateInstructions("step_5_count_mcq");
      equipmentArea
        .querySelector('[data-tool="glue_gun"]')
        .classList.add("disabled");
      createMcq(stepInfo.options, stepInfo.correctAnswer, () => {
        setContextBoxState("correct");
        setJaxPose("correct");
        nextButton.disabled = false;
        showFtue(nextButton);
      });
      break;

    case 5:
      updateInstructions("step_6_palette_intro");
      createColorPalette();
      nextButton.disabled = false;
      showFtue(nextButton);
      break;

    case 6:
      const colorToTry = T.gameConfig.colors[2];
      updateInstructions("step_7_color_action", {
        colorName: colorToTry.name,
        colorValue: colorToTry.value,
      });
      selectedColor = colorToTry;
      showFtue(document.querySelector(`.color-swatch[data-color-name="Pink"]`));
      setupInteraction("color", "color");
      break;

    case 7:
      const stepInfoMcq = T.instructions.step_8_color_mcq;
      updateInstructions("step_8_color_mcq", {
        colorName: selectedColor.name,
        colorValue: selectedColor.value,
      });
      createMcq(stepInfoMcq.options, stepInfoMcq.correctAnswer, () => {
        setContextBoxState("correct");
        setJaxPose("correct");
        nextButton.disabled = false;
        showFtue(nextButton);
      });
      break;

    case 8:
      activityArea.innerHTML = "";
      equipmentArea.innerHTML = "";
      updateInstructions("step_9_mid_transition", {
        colorName: selectedColor.name,
        colorValue: selectedColor.value,
      });
      appletContainer.classList.add("initial-state");
      const nextBtn = createButton(
        T.button_texts.next,
        () => renderStep(9),
        "btn-primary"
      );
      const btnContainer = document.createElement("div");
      btnContainer.id = "start-button-container";
      btnContainer.appendChild(nextBtn);
      document.querySelector(".left-panel-anchor").appendChild(btnContainer);
      showFtue(nextBtn);
      break;

    case 9:
      setupFinalLayout(); // Transition to the final layout view
      updateInstructions("step_10_final_intro");
      activityArea.querySelector(".paper-display").innerHTML = `
            <div style="display: flex; gap: 0.75vw; width: ${PaperSize}vw; height: ${PaperSize}vw;">
                <div class="paper-piece" style="width: 33.33%; height: 100%; position: relative; background-color: ${T.gameConfig.paperColor}; border-color: ${T.gameConfig.paperStroke};"></div>
                <div class="paper-piece" style="width: 33.33%; height: 100%; position: relative; background-color: ${T.gameConfig.paperColor}; border-color: ${T.gameConfig.paperStroke};"></div>
                <div class="paper-piece" style="width: 33.33%; height: 100%; position: relative; background-color: ${T.gameConfig.paperColor}; border-color: ${T.gameConfig.paperStroke};"></div>
            </div>`;
      appletContainer
        .querySelector(".workingArea-container")
        .append(nextButton);
      const introText = document.createElement("h1");
      introText.id = "intro_text";
      introText.textContent = T.instructions.fraction_intro.text;
      activityArea.querySelector(".fraction-builder-area").append(introText);
      nextButton.disabled = false;
      showFtue(nextButton);
      break;

    case 10:
      createFractionBuilder("denominator", 3);
      break;

    case 11:
      updateInstructions("step_12_color_part_3", {
        colorName: selectedColor.name,
        colorValue: selectedColor.value,
      });
      const finalPaperPieces = activityArea.querySelectorAll(
        ".paper-display .paper-piece"
      );
      if (finalPaperPieces.length > 0) {
        finalPaperPieces[0].style.backgroundColor = selectedColor.value;
      }
      nextButton.disabled = false;
      showFtue(nextButton);
      break;

    case 12:
      createFractionBuilder("numerator", 3);
      break;

    case 13:
      updateInstructions("step_14_perfect");
      nextButton.disabled = false;
      showFtue(nextButton);
      break;

    case 14:
      updateInstructions("step_15_fraction_form_3");
      createFractionBuilder("form_equals_fraction", 3, 1);
      nextButton.disabled = false;
      showFtue(nextButton);
      break;

    case 15: // <<< MODIFIED: Scissor-5 challenge setup
      resetStepState(true);
      const orangeColor = T.gameConfig.colors[1];
      selectedColor = orangeColor; // Pre-select a color for later
      appletContainer.querySelector(".lowerControls").append(nextButton);
      updateInstructions("step_15_intro_s5", {
        scissorImg: T.item_images.scissor_5,
      });
      setJaxPose("normal");

      rightPanel.style.display = "flex";
      equipmentArea.style.display = "flex";

      // Create all tools, but only disable glue gun
      createTool("scissor-2", T.item_images.scissor, "15%", "50%");
      createTool("scissor-3", T.item_images.scissor_3, "40%", "50%");
      createTool("scissor-5", T.item_images.scissor_5, "65%", "50%");
      createTool("glue_gun", T.item_images.glue_gun, "90%", "50%");

      showFtue(document.querySelector(`.tool-item[data-tool="scissor-5"]`));
      document
        .querySelector('.tool-item[data-tool="glue_gun"]')
        .classList.add("disabled");

      createPaper(`${PaperSize}vw`, `${PaperSize}vw`, "50%", "48%");
      nextButton.disabled = true;

      // Custom interaction setup for this step
      const allScissors = equipmentArea.querySelectorAll(
        '[data-tool^="scissor-"]'
      );
      const papers = document.querySelectorAll(".paper-piece");

      const handleScissorClick = (e) => {
        if (isAnimating) return;
        selectedTool = e.currentTarget;
        document
          .querySelectorAll(".tool-item.selected")
          .forEach((t) => t.classList.remove("selected"));
        selectedTool.classList.add("selected");
        audioPlay("click");
        showFtue(document.querySelector(".paper-piece"));
      };

      const handlePaperClick = (e) => {
        if (isAnimating || !selectedTool) return;
        selectedPaper = e.currentTarget;
        isAnimating = true;
        audioPlay("click");
        hideFtue();
        animateAndPerformAction("cut_challenge", selectedTool, selectedPaper);
      };

      allScissors.forEach((s) =>
        s.addEventListener("click", handleScissorClick)
      );
      papers.forEach((p) => p.addEventListener("click", handlePaperClick));
      break;

    case 16: // <<< ADDED: New step for coloring after the correct cut
      updateInstructions("step_16_color_prompt");
      // Disable tools
      document
        .querySelectorAll(".tool-item")
        .forEach((tool) => tool.classList.add("disabled"));
      createColorPalette();
      showFtue(document.querySelector(`.color-swatch[data-color-name="Pink"]`));
      setupInteraction("color", "color");
      break;

    case 17: // <<< WAS 16: Final display step
      setupFinalLayout();
      updateInstructions("step_17_final_display_5");
      appletContainer.querySelector(".lowerControls").innerHTML = "";
      appletContainer
        .querySelector(".workingArea-container")
        .append(nextButton);

      createFractionBuilder("form_equals_fraction", 5, 1);

      const paperDisplay = activityArea.querySelector(".paper-display");
      paperDisplay.style.width = "40vw";
      let paperHTML = "";
      for (let i = 0; i < 5; i++) {
        const bgColor = i === 0 ? selectedColor.value : T.gameConfig.paperColor;
        paperHTML += `<div class="paper-piece" style="width: 20%; height: 100%; position: relative; background-color: ${bgColor}; border-color: ${T.gameConfig.paperStroke};"></div>`;
      }
      paperDisplay.innerHTML = `<div style="display: flex; gap: 0.5vw; width: 100%; height: ${PaperSize}vw;">${paperHTML}</div>`;

      nextButton.textContent = T.button_texts.start_over;
      nextButton.disabled = false;
      showFtue(nextButton);
      break;

    case 18: // <<< WAS 17: Reload the app
      location.reload();
      break;
  }
}

function resetStepState(fullReset = false) {
  nextButton.disabled = true;
  hideFtue();
  setContextBoxState("normal");
  setJaxPose("normal");
  selectedTool = null;
  selectedPaper = null;
  isAnimating = false;

  if (fullReset) {
    isPoseLocked = false;
    appletContainer.classList.remove("final-phase-layout", "initial-state");
    activityArea.innerHTML = "";
    equipmentArea.innerHTML = "";
    nextPaperId = 0;
    cutCount = 0;
    glueCount = 0;

    // <<< FIX: Explicitly ensure panels are visible on full reset
    rightPanel.style.display = "";
    equipmentArea.style.display = "";
  }

  document
    .querySelectorAll(".tool-item, .paper-piece, .color-swatch")
    .forEach((el) => {
      if (el.parentNode) {
        const newEl = el.cloneNode(true);
        el.parentNode.replaceChild(newEl, el);
      }
    });

  document
    .querySelectorAll(".tool-item, .paper-piece, .color-swatch")
    .forEach((el) => {
      if (!el.classList.contains("disabled")) {
        el.style.pointerEvents = "auto";
      }
    });

  const startBtn = document.getElementById("start-button-container");
  if (startBtn) startBtn.remove();

  nextButton.textContent = T.button_texts.next;
}

// ... (setupFinalLayout, createPaper, createTool, etc. remain unchanged) ...
function setupFinalLayout() {
  appletContainer.classList.remove("initial-state");
  appletContainer.classList.add("final-phase-layout");
  setJaxPose("speaking_head");
  isPoseLocked = true;
  rightPanel.style.display = "flex";
  equipmentArea.style.display = "none";
  activityArea.innerHTML = "";
  const builderArea = document.createElement("div");
  builderArea.className = "fraction-builder-area";
  const paperDisplay = document.createElement("div");
  paperDisplay.className = "paper-display";
  activityArea.append(builderArea, paperDisplay);
}
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
    if (isAnimating) return;
    selectedTool = e.currentTarget;
    document
      .querySelectorAll(".tool-item.selected, .color-swatch.selected")
      .forEach((t) => t.classList.remove("selected"));
    selectedTool.classList.add("selected");
    audioPlay("click");

    // <<< MODIFIED: FTUE logic for glue gun
    if (toolType === "glue_gun") {
      // Find a paper piece that is part of a sub-group (i.e., its parent is not the main container)
      // This targets the smaller pieces that need to be glued.
      const pieceToGlue = Array.from(papers).find(
        (p) => p.parentElement && !p.parentElement.classList.contains("paper-container")
      );
      showFtue(pieceToGlue || document.querySelector(".paper-piece")); // Show FTUE on the small piece, with a fallback
    } else {
      showFtue(document.querySelector(".paper-piece"));
    }
  };

  const handlePaperClick = (e) => {
    if (isAnimating || !selectedTool) return;
    selectedPaper = e.currentTarget;
    selectedPaper.classList.add("selected");
    isAnimating = true;
    hideFtue();
    audioPlay("click");
    animateAndPerformAction(action, selectedTool, selectedPaper);
  };

  if (toolType === "color") {
    swatches.forEach((swatch) =>
      swatch.addEventListener("click", handleToolClick)
    );
    papers.forEach((paper) =>
      paper.addEventListener("click", (e) => {
        if (
          isAnimating ||
          !selectedTool ||
          !selectedTool.classList.contains("color-swatch")
        )
          return;
        isAnimating = true;
        const targetPaper = e.currentTarget;
        selectedColor = {
          name: selectedTool.dataset.colorName,
          value: selectedTool.dataset.colorValue,
        };
        targetPaper.style.backgroundColor = selectedColor.value;
        setJaxPose("correct");
        audioPlay("paint");
        document
          .querySelectorAll(".color-swatch")
          .forEach((el) => (el.style.pointerEvents = "none"));
        // <<< MODIFIED: Disable clicking on all other paper pieces after coloring one.
        document
          .querySelectorAll(".paper-piece")
          .forEach((p) => (p.style.pointerEvents = "none"));
        nextButton.disabled = false;
        showFtue(nextButton);
        isAnimating = false;
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
  const equipmentAreaRect = equipmentArea.getBoundingClientRect();

  const originalTop = tool.style.top;
  const originalLeft = tool.style.left;
  let success = false;
  let customFailure = false;

  document
    .querySelectorAll(".tool-item, .paper-piece")
    .forEach((el) => (el.style.pointerEvents = "none"));

  if (action === "cut_challenge") {
    const toolName = tool.dataset.tool;
    const numPieces = parseInt(toolName.split("-")[1]);

    tool.style.transition =
      "top 0.4s ease-in-out, left 0.4s ease-in-out, transform 0.3s ease";

    // Animate the cut (vertical)
    for (let i = 1; i < numPieces; i++) {
      const position = (paperRect.width / numPieces) * i;
      let startX =
        paperRect.left + position - toolRect.width / 2 - equipmentAreaRect.left;
      let startY =
        paperRect.bottom - toolRect.height / 2 - equipmentAreaRect.top;

      tool.style.transform = `translate(0, 0) rotate(0deg)`;
      tool.style.left = `${startX}px`;
      tool.style.top = `${startY}px`;
      await delay(600);
      audioPlay("cut");

      const endY = paperRect.top - toolRect.height / 4 - equipmentAreaRect.top;
      tool.style.top = `${endY}px`;
      await delay(600);
    }
    tool.style.transform = "translate(-50%, -50%) rotate(0deg)";

    // Replace paper with cut pieces
    const parentContainer = paper.parentElement;
    parentContainer.innerHTML = "";
    parentContainer.style.flexDirection = "row";
    for (let i = 0; i < numPieces; i++) {
      const p = document.createElement("div");
      p.className = "paper-piece";
      p.style.width = `${100 / numPieces}%`;
      p.style.height = "100%";
      p.style.backgroundColor = T.gameConfig.paperColor;
      parentContainer.appendChild(p);
    }

    if (numPieces === 5) {
      success = true; // Correct scissor used
    } else {
      success = false; // Incorrect scissor
      customFailure = true;
      updateInstructions("step_15_cut_wrong", { count: numPieces });
      nextButton.textContent = T.button_texts.reset;
      nextButton.disabled = false;
      showFtue(nextButton);
    }
  } else if (action.startsWith("cut_")) {
    // ... (existing cut logic remains the same)
    const parts = action.split("_");
    const numPieces = parseInt(parts[2]);
    const isVertical = action.includes("vertical");
    tool.style.transition =
      "top 0.4s ease-in-out, left 0.4s ease-in-out, transform 0.3s ease";

    for (let i = 1; i < numPieces; i++) {
      const position = isVertical
        ? (paperRect.width / numPieces) * i
        : (paperRect.height / numPieces) * i;

      let startX =
        (isVertical
          ? paperRect.left + position - toolRect.width / 2
          : paperRect.left - toolRect.width / 2) - equipmentAreaRect.left;

      let startY =
        (isVertical
          ? paperRect.bottom - toolRect.height / 2 - equipmentAreaRect.top
          : paperRect.top + position - toolRect.height / 2) -
        equipmentAreaRect.top;

      tool.style.transform = `translate(0, 0) rotate(${
        isVertical ? 0 : 90
      }deg)`;
      tool.style.left = `${startX}px`;
      tool.style.top = `${startY}px`;
      await delay(600);

      if (isVertical) {
        const endY =
          paperRect.top - toolRect.height / 4 - equipmentAreaRect.top;
        tool.style.top = `${endY}px`;
      } else {
        const endX = paperRect.right - toolRect.width - equipmentAreaRect.left;
        tool.style.left = `${endX}px`;
      }
      audioPlay("cut");
      await delay(600);
    }
    tool.style.transform = "translate(-50%, -50%) rotate(0deg)";

    const parentContainer = paper.parentElement;
    if (cutCount === 0) {
      parentContainer.innerHTML = "";
      parentContainer.style.flexDirection = "row";
      for (let i = 0; i < numPieces; i++) {
        const p = document.createElement("div");
        p.className = "paper-piece";
        p.style.width = `${100 / numPieces}%`;
        p.style.height = "100%";
        p.style.backgroundColor = T.gameConfig.paperColor;
        parentContainer.appendChild(p);
      }
    } else {
      const newSubContainer = document.createElement("div");
      newSubContainer.style.cssText = `display: flex; flex-direction: column; width: ${paper.style.width}; height: 100%; gap: 0.25vw;`;
      for (let i = 0; i < numPieces; i++) {
        const p = document.createElement("div");
        p.className = "paper-piece";
        p.style.width = "100%";
        p.style.height = `${100 / numPieces}%`;
        p.style.backgroundColor = T.gameConfig.paperColor;
        newSubContainer.appendChild(p);
      }
      parentContainer.replaceChild(newSubContainer, paper);
    }
    cutCount++;
    success = true;
  } else if (action === "glue") {
    const parentOfClickedPiece = paper.parentElement;
    const isBigPiece =
      parentOfClickedPiece.classList.contains("paper-container");

    if (isBigPiece) {
      // This is not one of the small, cut pieces. Fail.
      success = false;
    } else {
      // Correct piece clicked. Animate and merge all at once.
      const containerToGlue = parentOfClickedPiece;
      const grandParentContainer = containerToGlue.parentElement;
      const containerRect = containerToGlue.getBoundingClientRect();

      tool.style.transition = "top 0.4s ease-out, left 0.4s ease-out";
      audioPlay("glue");

      // Calculate corner positions for the "swirl" animation
      const corner = {
        left: containerRect.left - equipmentAreaRect.left + toolRect.width / 2,
        top: containerRect.top - equipmentAreaRect.top + toolRect.height / 2,
        right:
          containerRect.right - equipmentAreaRect.left + toolRect.width / 2,
        bottom:
          containerRect.bottom - equipmentAreaRect.top - toolRect.height / 2,
      };

      // Animation path: top-left -> top-right -> bottom-right -> bottom-left
      tool.style.left = `${corner.left}px`;
      tool.style.top = `${corner.top}px`;
      await delay(800);

      tool.style.left = `${corner.right}px`;
      await delay(800);

      tool.style.top = `${corner.bottom}px`;
      await delay(800);

      tool.style.left = `${corner.left}px`;
      await delay(800);

      // Create a single new piece to replace the container of small pieces
      const mergedPiece = document.createElement("div");
      mergedPiece.className = "paper-piece";
      mergedPiece.style.width = containerToGlue.style.width;
      mergedPiece.style.height = "100%";
      mergedPiece.style.backgroundColor = T.gameConfig.paperColor;

      grandParentContainer.replaceChild(mergedPiece, containerToGlue);

      glueCount = 1; // Set to 1 to signify completion
      success = true;
    }
  }

  tool.style.top = originalTop;
  tool.style.left = originalLeft;
  await delay(500);

  isAnimating = false;

  // Determine next step
  if (success) {
    if (action === "cut_challenge") {
      renderStep(16); // Correct cut proceeds to the new coloring step
    } else {
      renderStep(currentStep); // Default success behavior (e.g., for glue)
    }
  } else if (customFailure) {
    // This is for our "wrong scissor" case. Pointers are re-enabled but nothing else happens.
    document.querySelectorAll(".tool-item, .paper-piece").forEach((el) => {
      if (!el.classList.contains("disabled")) el.style.pointerEvents = "auto";
    });
  } else {
    // Default failure behavior for actions like glue
    audioPlay("wrong");
    setContextBoxState("incorrect");
    setJaxPose("wrong");
    updateInstructions("feedback_glue_fail");
    await delay(4000);
    renderStep(currentStep);
  }
}
// ... (createFractionBuilder and helper functions remain unchanged) ...
function createFractionBuilder(part, totalPieces = 2, coloredPieces = 1) {
  const area = activityArea.querySelector(".fraction-builder-area");
  if (!area) return;

  if (part === "denominator" || part === "numerator") {
    const keyMap = {
      denominator: `step_11_denominator_${totalPieces}`,
      numerator: `step_13_numerator_${totalPieces}`,
    };
    const stepInfo = T.instructions[keyMap[part]];
    updateInstructions(keyMap[part], {
      colorValue: selectedColor.value,
      colorName: selectedColor.name,
    });
    const existingContent =
      area.querySelector(".fraction-display-area")?.innerHTML || "";
    const isNumerator = part === "numerator";
    const labelColor = isNumerator
      ? selectedColor.value
      : T.gameConfig.paperStroke;
    const coloredLabel = `<b style="color: ${labelColor};">${stepInfo.label}</b>`;
    let newPartHTML = `
            <div class="fraction-part" data-part="${part}">
                <span class="fraction-label">${coloredLabel}</span>
                <div class="fraction-number-box" id="${part}-box"></div>
            </div>`;
    area.innerHTML = `<div class="fraction-display-area">${
      isNumerator
        ? newPartHTML + existingContent
        : existingContent + newPartHTML
    }</div>`;
    createMcq(
      stepInfo.options,
      stepInfo.correctAnswer,
      () => {
        const box = document.getElementById(`${part}-box`);
        box.textContent = stepInfo.correctAnswer;
        box.classList.add("filled");
        box.style.color = labelColor;
        setJaxPose("correct");
        setContextBoxState("correct");
        setTimeout(() => {
          nextButton.disabled = false;
          showFtue(nextButton);
        }, 500);
      },
      area
    );
  } else if (part === "form_equals_fraction") {
    const numInfo = T.instructions[`step_13_numerator_${totalPieces}`];
    const denInfo = T.instructions[`step_11_denominator_${totalPieces}`];
    const numLabel = `<b style="color:${selectedColor.value}">${numInfo.label}</b>`;
    const denLabel = `<b style="color:${T.gameConfig.paperStroke}">${denInfo.label}</b>`;

    area.innerHTML = `
            <div class="fraction-display-area final-form">
                <div class="fraction-column">
                    <div class="fraction-label">${numLabel}</div>
                    <div class="fraction-line"></div>
                    <div class="fraction-label">${denLabel}</div>
                </div>
                <div class="equals-sign">=</div>
                <div class="fraction-column">
                    <div class="fraction-number-box filled" style="color: ${selectedColor.value};">${coloredPieces}</div>
                    <div class="fraction-line"></div>
                    <div class="fraction-number-box filled" style="color: ${T.gameConfig.paperStroke};">${totalPieces}</div>
                </div>
            </div>`;
  }
}
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
  if (isPoseLocked) return;
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

function positionMarquee() {
  const logo = document.querySelector(".tb-logo");
  const marquee = document.querySelector(".top-marquee");
  const logoImg = document.querySelector(".tb-logo img");
  
  if (logo && marquee) {
    const updateMarqueePosition = () => {
      const logoRect = logo.getBoundingClientRect();
      const logoRight = logoRect.right;
      marquee.style.left = `${logoRight}px`;
      marquee.style.right = "0";
    };
    
    // Wait for logo image to load before positioning
    if (logoImg && !logoImg.complete) {
      logoImg.addEventListener("load", updateMarqueePosition);
    }
    
    // Initial positioning (use requestAnimationFrame to ensure layout is complete)
    requestAnimationFrame(() => {
      setTimeout(updateMarqueePosition, 100);
    });
    
    // Update on resize
    window.addEventListener("resize", updateMarqueePosition);
  }
}

document.addEventListener("DOMContentLoaded", initApp);