// ============================================================
// ====================== state & config ======================
// ============================================================
let lang = "en"; // Will be set from HTML lang attribute in initializeApplet()
let currentScreen = 1;
let divisions = 1;
let waterLevel = 0;
let currentQuestion = 0;
let nextButtonUnlocked = false;
let handIconElement = null;
let denominatorCorrectlySet = false; // New state variable
let waterfillingAudio = null;

// Questions configuration
const questions = [
  { numerator: 2, denominator: 3 },
  { numerator: 1, denominator: 4 },
  { numerator: 1, denominator: 5 },
  { numerator: 3, denominator: 4 },
  { numerator: 5, denominator: 5 },
];

// ============================================================
// ====================== audio functions ======================
// ============================================================
// Global audio context - initialized on first user interaction
let globalAudioContext = null;
let audioInitialized = false;

// Initialize audio context on first user interaction
function initializeAudio() {
  if (audioInitialized) return true;

  try {
    globalAudioContext = new (window.AudioContext ||
      window.webkitAudioContext)();

    // Resume context if it's suspended (required by some browsers)
    if (globalAudioContext.state === "suspended") {
      globalAudioContext.resume();
    }

    audioInitialized = true;
    console.log("Audio initialized successfully");
    return true;
  } catch (e) {
    console.error("Failed to initialize audio:", e);
    return false;
  }
}

// Enhanced audio function with better error handling
function playSound(frequency, duration = 200, type = "sine", volume = 0.1) {
  try {
    // Initialize audio if not already done
    if (!initializeAudio()) {
      console.log("Audio initialization failed");
      return;
    }

    // Check if context is available and not closed
    if (!globalAudioContext || globalAudioContext.state === "closed") {
      console.log("Audio context not available");
      return;
    }

    // Resume context if suspended
    if (globalAudioContext.state === "suspended") {
      globalAudioContext.resume();
    }

    const oscillator = globalAudioContext.createOscillator();
    const gainNode = globalAudioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(globalAudioContext.destination);

    oscillator.frequency.setValueAtTime(
      frequency,
      globalAudioContext.currentTime
    );
    oscillator.type = type;

    gainNode.gain.setValueAtTime(volume, globalAudioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      globalAudioContext.currentTime + duration / 1000
    );

    oscillator.start(globalAudioContext.currentTime);
    oscillator.stop(globalAudioContext.currentTime + duration / 1000);
  } catch (e) {
    console.error("Error playing sound:", e);
  }
}

function playClickSound() {
  playSound(600, 40, "sine", 0.15);
  setTimeout(() => playSound(800, 20, "sine", 0.1), 40);
}

function playCorrectSound() {
  playSound(784, 80, "triangle", 0.2);
  setTimeout(() => playSound(988, 80, "triangle", 0.2), 80);
  setTimeout(() => playSound(1319, 200, "triangle", 0.25), 160);

  setTimeout(() => {
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        playSound(1500 + i * 200, 60, "triangle", 0.15);
      }, i * 60);
    }
  }, 360);
}

function playIncorrectSound() {
  playSound(392, 100, "sine", 0.2);
  setTimeout(() => playSound(330, 300, "sine", 0.25), 100);
  setTimeout(() => playSound(349, 80, "sine", 0.15), 400);
}

function playDivisionSound() {
  playSound(800, 50, "triangle", 0.15);
  setTimeout(() => playSound(1000, 30, "triangle", 0.1), 50);
}

// ============================================================
// ====================== initialization ======================
// ============================================================
function initializeApplet() {
  console.log("Initializing Applet...");

  // Set language from HTML lang attribute
  lang = document.documentElement.lang || "en";
  console.log("Language set to:", lang);

  waterfillingAudio = document.getElementById("waterfilling-audio");
  if (waterfillingAudio) {
    waterfillingAudio.load(); // Ensure audio is loaded
  }
  
  // Position marquee based on logo width
  positionMarquee();
  
  setupEventListeners();
  updateUI();
  updateText();
}

function positionMarquee() {
  const logo = document.querySelector('.tb-logo img');
  const marqueeBanner = document.querySelector('.marquee-banner');
  
  if (logo && marqueeBanner) {
    // Wait for logo image to load
    if (logo.complete) {
      updateMarqueePosition(logo, marqueeBanner);
    } else {
      logo.addEventListener('load', () => {
        updateMarqueePosition(logo, marqueeBanner);
      });
    }
    
    // Also update on window resize
    window.addEventListener('resize', () => {
      updateMarqueePosition(logo, marqueeBanner);
    });
  }
}

function updateMarqueePosition(logo, marqueeBanner) {
  const logoRect = logo.getBoundingClientRect();
  const logoRight = logoRect.right;
  const containerRect = document.querySelector('.applet-container').getBoundingClientRect();
  const containerLeft = containerRect.left;
  
  // Calculate left position relative to container
  const leftPosition = logoRight - containerLeft;
  
  marqueeBanner.style.left = `${leftPosition}px`;
}

function setupEventListeners() {
  // Start screen
  document.getElementById("startButton").addEventListener("click", () => {
    playClickSound();
    switchToScreen(2);
  });

  // Screen 2 - Introduction to Container
  document.getElementById("add-btn").addEventListener("click", () => {
    playClickSound();
    playDivisionSound();
    if (divisions < 10) {
      divisions++;
      updateDivisionMarkers("division-markers", divisions, "division-numbers");
      document.getElementById("number-display").textContent = divisions;

      // Show Next button after user selects 5 or more divisions
      if (divisions >= 5 && !nextButtonUnlocked) {
        nextButtonUnlocked = true;
        document.getElementById("nextButton").style.display = "inline-block";
        showHandIcon("nextButton");
      }
    }
  });

  document.getElementById("subtract-btn").addEventListener("click", () => {
    playClickSound();
    if (divisions > 1) {
      divisions--;
      updateDivisionMarkers("division-markers", divisions, "division-numbers");
      document.getElementById("number-display").textContent = divisions;
    }
  });

  document.getElementById("nextButton").addEventListener("click", () => {
    playClickSound();
    if (handIconElement) {
      handIconElement.remove();
      handIconElement = null;
    }
    switchToScreen(3);
    // Reset divisions for screen 3
    divisions = 1;
    updateDivisionMarkers("division-markers3", divisions, "division-numbers3");
    document.getElementById("number-display3").textContent = divisions;
  });

  // Screen 3 - Divide into 3 Equal Parts
  document.getElementById("add-btn3").addEventListener("click", () => {
    playClickSound();
    playDivisionSound();
    if (divisions < 10) {
      divisions++;
      updateDivisionMarkers(
        "division-markers3",
        divisions,
        "division-numbers3"
      );
      document.getElementById("number-display3").textContent = divisions;

      // Check if user selected 3 divisions
      if (divisions === 3) {
        // Show success message
        document.getElementById("dialogue-box3").classList.remove("incorrect");
        document.getElementById("dialogue-box3").classList.add("correct");
        document.getElementById("dialogue-text3").innerHTML =
          langText[lang].screen3.success;
        document.getElementById("nextButton3").style.display = "inline-block";
        document.getElementById("character-img3").src =
          "assets/Deete_Happy.png";
        document.getElementById("number-display3").classList.remove("red");
        document.getElementById("number-display3").classList.add("green");
        playCorrectSound();
        // Disable buttons
        document.getElementById("add-btn3").disabled = true;
        document.getElementById("subtract-btn3").disabled = true;
      } else {
        // Show error message
        document.getElementById("dialogue-box3").classList.add("incorrect");
        document.getElementById("dialogue-text3").innerHTML =
          langText[lang].screen3.error;
        document.getElementById("character-img3").src = "assets/Deete_Sad.png";
        document.getElementById("number-display3").classList.add("red");
        playIncorrectSound();
      }
    }
  });

  document.getElementById("subtract-btn3").addEventListener("click", () => {
    playClickSound();
    if (divisions > 1) {
      divisions--;
      updateDivisionMarkers(
        "division-markers3",
        divisions,
        "division-numbers3"
      );
      document.getElementById("number-display3").textContent = divisions;

      // Reset error/success state
      document
        .getElementById("dialogue-box3")
        .classList.remove("correct", "incorrect");
      document.getElementById("dialogue-text3").innerHTML =
        langText[lang].screen3.dialogue;
      document.getElementById("nextButton3").style.display = "none";
      document.getElementById("character-img3").src =
        "assets/Deete_Neutral.png";
      document
        .getElementById("number-display3")
        .classList.remove("green", "red");
      // Enable buttons
      document.getElementById("add-btn3").disabled = false;
    }
  });

  document.getElementById("nextButton3").addEventListener("click", () => {
    playClickSound();
    switchToScreen(4);
    // Set up screen 4 with 3 divisions
    divisions = 3;
    updateDivisionMarkers("division-markers4", divisions, "division-numbers4");
    document.getElementById("water4").style.height = "0%";
  });

  // Screen 4 - Fill One Part
  const sliderTrack4 = document.getElementById("slider-track4");
  const sliderThumb4 = document.getElementById("slider-thumb4");
  setupCustomSlider(sliderTrack4, sliderThumb4, "water4");

  document.getElementById("check-btn4").addEventListener("click", () => {
    playClickSound();
    hideAllFeedbackMessages(); // Hide any showing feedback messages
    const targetHeight = (100 / 3) * 0.92; // Adjust for new 94% height area
    const tolerance = 3; // Allow 3% tolerance

    if (Math.abs(waterLevel - targetHeight) <= tolerance) {
      // Correct - filled 1/3
      hideRedDivisionLine("red-division-line4");
      switchToScreen(5);
      // Set up screen 5
      document.getElementById("water5").style.height = targetHeight + "%";
      // document.getElementById('slider-thumb5').style.bottom = `calc(${targetHeight}% - ${document.getElementById('slider-thumb5').offsetHeight / 2}px)`;
    } else {
      // Show red line at current wrong water level
      showRedDivisionLine("red-division-line4", waterLevel);

      if (waterLevel > targetHeight + tolerance) {
        // Too much water
        document.getElementById("dialogue-box4").classList.add("incorrect");
        document.getElementById("dialogue-text4").innerHTML =
          langText[lang].screen4.tooMuch;
        document.getElementById("character-img4").src = "assets/Deete_Sad.png";
        playIncorrectSound();
      } else {
        // Not enough water
        document.getElementById("dialogue-box4").classList.add("incorrect");
        document.getElementById("dialogue-text4").innerHTML =
          langText[lang].screen4.notEnough;
        document.getElementById("character-img4").src = "assets/Deete_Sad.png";
        playIncorrectSound();
      }
    }
  });

  // Screen 5 - Choose Fraction
  const fractionButtons = [
    {
      id: "fraction-btn1",
      textKey: "incorrect1_2",
      correct: false,
      fraction: { numerator: 1, denominator: 2 },
    },
    {
      id: "fraction-btn2",
      textKey: "correct1_3",
      correct: true,
      fraction: { numerator: 1, denominator: 3 },
    },
    {
      id: "fraction-btn3",
      textKey: "incorrect3_1",
      correct: false,
      fraction: { numerator: 3, denominator: 1 },
    },
  ];

  fractionButtons.forEach((buttonInfo) => {
    document.getElementById(buttonInfo.id).addEventListener("click", () => {
      playClickSound();

      // Reset all buttons and dialogue box
      fractionButtons.forEach((btn) => {
        document
          .getElementById(btn.id)
          .classList.remove("correct", "incorrect");
      });
      document
        .getElementById("dialogue-box5")
        .classList.remove("correct", "incorrect");
      document.getElementById("nextButton5").style.display = "none";
      document.getElementById("character-img5").src =
        "assets/Deete_Neutral.png";

      // Hide red fill and line
      hideRedWaterFill("red-water-fill5");
      hideRedWaterLine("red-water-line5");
      hideExternalDivisionNumbers(); // Always clear external numbers on new click

      // Get references to elements
      const buttonElement = document.getElementById(buttonInfo.id);
      const dialogueBox = document.getElementById("dialogue-box5");
      const dialogueText = document.getElementById("dialogue-text5");
      const characterImg = document.getElementById("character-img5");
      const feedbackMessage = document.getElementById(
        "screen5-feedback-message"
      );

      // Clear previous feedback and reset main dialogue text
      feedbackMessage.innerHTML = "";
      feedbackMessage.classList.remove("show"); // Add this line for reset
      dialogueText.innerHTML = langText[lang].screen5.dialogue; // Reset to default dialogue

      if (buttonInfo.correct) {
        buttonElement.classList.add("correct");
        dialogueBox.classList.add("correct");
        dialogueText.innerHTML = langText[lang].screen5[buttonInfo.textKey]; // Display correct message in main dialogue
        characterImg.src = "assets/Deete_Happy.png";
        document.getElementById("nextButton5").style.display = "inline-block";
        playCorrectSound();
        // Ensure default division numbers are visible and external ones are hidden
        document.getElementById("division-numbers5").style.display = "flex";
        hideExternalDivisionNumbers();
      } else {
        buttonElement.classList.add("incorrect");
        dialogueBox.classList.add("incorrect");
        feedbackMessage.innerHTML = langText[lang].screen5[buttonInfo.textKey]; // Display incorrect message in feedback div
        feedbackMessage.classList.add("show"); // Add this line to show the feedback
        characterImg.src = "assets/Deete_Sad.png";
        playIncorrectSound();

        // Hide default division numbers and show external ones
        document.getElementById("division-numbers5").style.display = "none";
        // Show red fill based on the wrong fraction selected
        showRedWaterFillForWrongAnswer(buttonInfo.fraction);
        displayExternalDivisionNumbers(buttonInfo.fraction); // Display external numbers for wrong answer
      }
    });
  });

  document.getElementById("nextButton5").addEventListener("click", () => {
    playClickSound();
    switchToScreen(6);
    // Set up screen 6
    divisions = 3; // Ensure divisions is set to 3
    waterLevel = (100 / 3) * 0.92; // Adjust for new 94% height area
    document.getElementById("water6").style.height = (100 / 3) * 0.92 + "%";
    updateDivisionMarkers("division-markers6", 3, "division-numbers6");
    document.getElementById("number-display6").textContent = "3";
  });

  // Screen 6 - Fraction Form
  document.getElementById("nextButton6").addEventListener("click", () => {
    playClickSound();
    switchToScreen(7);
  });

  // Screen 7 - Introduction to Practice
  document.getElementById("practiceButton").addEventListener("click", () => {
    playClickSound();
    currentQuestion = 0;
    setupQuestion(currentQuestion);
    switchToScreen(8);
  });

  // Question Screen
  document.getElementById("question-add-btn").addEventListener("click", () => {
    playClickSound();
    playDivisionSound();
    const currentValue = parseInt(
      document.getElementById("question-number-display").textContent
    );
    if (currentValue < 10) {
      const newValue = currentValue + 1;
      document.getElementById("question-number-display").textContent = newValue;
      updateDivisionMarkers(
        "question-division-markers",
        newValue,
        "question-division-numbers"
      );

      // Reset dialogue and character to neutral state
      document
        .getElementById("question-dialogue-box")
        .classList.remove("correct", "incorrect");
      document.getElementById("question-dialogue-text").innerHTML = `${
        langText[lang].question.createFraction
      } <span id="target-fraction">${createFractionHTML(
        questions[currentQuestion].numerator,
        questions[currentQuestion].denominator
      )}</span>?<br>${langText[lang].question.setDenominator}`;
      document.getElementById("question-character").src =
        "assets/Deete_Neutral.png";
      document
        .getElementById("question-number-display")
        .classList.remove("green", "red");
      // Remove red from division markers
      document
        .querySelectorAll("#question-division-markers .division-marker")
        .forEach((marker) => {
          marker.classList.remove("red");
        });
    }
  });

  document
    .getElementById("question-subtract-btn")
    .addEventListener("click", () => {
      playClickSound();
      const currentValue = parseInt(
        document.getElementById("question-number-display").textContent
      );
      if (currentValue > 1) {
        const newValue = currentValue - 1;
        document.getElementById("question-number-display").textContent =
          newValue;
        updateDivisionMarkers(
          "question-division-markers",
          newValue,
          "question-division-numbers"
        );

        // Reset dialogue and character to neutral state
        document
          .getElementById("question-dialogue-box")
          .classList.remove("correct", "incorrect");
        document.getElementById("question-dialogue-text").innerHTML = `${
          langText[lang].question.createFraction
        } <span id="target-fraction">${createFractionHTML(
          questions[currentQuestion].numerator,
          questions[currentQuestion].denominator
        )}</span>?<br>${langText[lang].question.setDenominator}`;
        document.getElementById("question-character").src =
          "assets/Deete_Neutral.png";
        document
          .getElementById("question-number-display")
          .classList.remove("green", "red");
        // Remove red from division markers
        document
          .querySelectorAll("#question-division-markers .division-marker")
          .forEach((marker) => {
            marker.classList.remove("red");
          });
      }
    });

  // Question Screen Slider
  const questionSliderTrack = document.getElementById("question-slider-track");
  const questionSliderThumb = document.getElementById("question-slider-thumb");
  setupCustomSlider(questionSliderTrack, questionSliderThumb, "question-water");

  document
    .getElementById("question-check-btn")
    .addEventListener("click", () => {
      playClickSound();
      hideAllFeedbackMessages(); // Hide any showing feedback messages

      if (!denominatorCorrectlySet) {
        // Validate denominator
        const currentDenominator = parseInt(
          document.getElementById("question-number-display").textContent
        );
        const targetDenominator = questions[currentQuestion].denominator;

        if (currentDenominator === targetDenominator) {
          // Correct denominator selected
          denominatorCorrectlySet = true;
          document
            .getElementById("question-dialogue-box")
            .classList.remove("incorrect");
          document
            .getElementById("question-dialogue-box")
            .classList.add("correct");
          document.getElementById("question-dialogue-text").innerHTML = `${
            langText[lang].question.createFraction
          } <span id="target-fraction">${createFractionHTML(
            questions[currentQuestion].numerator,
            questions[currentQuestion].denominator
          )}</span>?<br><br>${langText[lang].question.setNumerator}`;
          document.getElementById("question-character").src =
            "assets/Deete_Happy.png";
          document
            .getElementById("question-number-display")
            .classList.add("green");
          showFeedbackMessage(`${langText[lang].question.greatJob}`);

          // Disable number selector and enable slider
          document.getElementById("question-add-btn").disabled = true;
          document.getElementById("question-subtract-btn").disabled = true;
          document.getElementById("question-slider-container").style.display =
            "flex";
          document
            .getElementById("question-check-btn")
            .classList.remove("check-btn-denominator-state"); // Remove class when switching to numerator validation
          // The check button remains visible for numerator validation

          playCorrectSound();
        } else {
          // Incorrect denominator
          document
            .getElementById("question-dialogue-box")
            .classList.add("incorrect");
          document.getElementById("question-dialogue-text").innerHTML = `${
            langText[lang].question.createFraction
          } <span id="target-fraction">${createFractionHTML(
            questions[currentQuestion].numerator,
            questions[currentQuestion].denominator
          )}</span>?<br>${langText[lang].question.setDenominator}`;
          document.getElementById("question-character").src =
            "assets/Deete_Sad.png";
          document
            .getElementById("question-number-display")
            .classList.add("red");

          // Add red to division markers
          const questionDivisionMarkers = document.querySelectorAll(
            "#question-division-markers .division-marker"
          );
          questionDivisionMarkers.forEach((marker) => {
            marker.classList.add("red");
          });

          playIncorrectSound();
          showIncorrectFeedbackMessage(
            langText[lang].question.checkDenominatorAgain
          );
        }
      } else {
        // Validate numerator (water level)
        const denominator = parseInt(
          document.getElementById("question-number-display").textContent
        );
        const targetNumerator = questions[currentQuestion].numerator;
        const targetHeight = (targetNumerator / denominator) * 94; // Adjust for new 94% height area
        const tolerance = 3; // Allow 3% tolerance

        if (Math.abs(waterLevel - targetHeight) <= tolerance) {
          // Correct
          hideRedDivisionLine("red-division-line-question");
          showGreenDivisionLine("green-division-line-question", waterLevel); // Show green line
          document
            .getElementById("question-dialogue-box")
            .classList.remove("incorrect");
          document
            .getElementById("question-dialogue-box")
            .classList.add("correct");

          // Hide question, show feedback
          document.getElementById("question-dialogue-text").style.display =
            "none";
          document.getElementById("correct-feedback").style.display = "block";

          // Update feedback text
          document.getElementById("correct-feedback-line1").textContent =
            langText[lang].question.wellDone;
          document.getElementById("correct-feedback-line2").innerHTML = `${
            langText[lang].question.youHaveCreated
          } ${createFractionHTML(targetNumerator, denominator)} ${
            langText[lang].question.byFilling
          } ${targetNumerator} ${
            langText[lang].question.outOf
          } ${denominator} ${langText[lang].question.equalParts}`;

          document.getElementById("question-character").src =
            "assets/Deete_Happy.png";
          document.getElementById("question-next-btn").style.display =
            "inline-block";

          // Disable slider interaction after correct answer
          document.getElementById("question-slider-thumb").style.pointerEvents =
            "none";
          document.getElementById("question-slider-thumb").style.cursor =
            "default";

          playCorrectSound();
        } else {
          // Show red line at current wrong water level
          hideGreenDivisionLine("green-division-line-question"); // Hide green line if incorrect
          showRedDivisionLine("red-division-line-question", waterLevel);

          // Incorrect
          document
            .getElementById("question-dialogue-box")
            .classList.add("incorrect");
          document.getElementById(
            "question-dialogue-text"
          ).innerHTML = `${langText[lang].question.notQuiteRight} ${targetNumerator} ${langText[lang].question.outOf} ${denominator} ${langText[lang].question.equalParts} <span id="target-fraction" style="display: none;"></span>`;
          document.getElementById("question-character").src =
            "assets/Deete_Sad.png";

          playIncorrectSound();
          showIncorrectFeedbackMessage(langText[lang].question.checkNumeratorAgain);
        }
      }
    });

  document.getElementById("question-next-btn").addEventListener("click", () => {
    playClickSound();
    currentQuestion++;

    if (currentQuestion < questions.length) {
      // Move to next question
      setupQuestion(currentQuestion);
    } else {
      // All questions completed, move to summary screen
      switchToScreen(9);
      // Set up summary screen
      updateDivisionMarkers(
        "summary-division-markers1",
        5,
        "summary-division-numbers1"
      );
      updateDivisionMarkers(
        "summary-division-markers2",
        1,
        "summary-division-numbers2"
      );
    }
  });

  // Summary Screen
  document.getElementById("summary-next-btn").addEventListener("click", () => {
    playClickSound();
    switchToScreen(10);
  });

  // End Screen
  document.getElementById("endButton").addEventListener("click", () => {
    playClickSound();
    restartApplet();
  });
}

// ============================================================
// ====================== helper functions ======================
// ============================================================
function restartApplet() {
  // Reset all state variables
  currentScreen = 1;
  divisions = 1;
  waterLevel = 0;
  currentQuestion = 0;
  nextButtonUnlocked = false;
  denominatorCorrectlySet = false;

  // Hide all screens and show screen 1
  const screens = document.querySelectorAll(".content-screen");
  screens.forEach((screen) => {
    screen.classList.remove("active");
  });
  document.getElementById("screen1").classList.add("active");

  // Reset UI elements
  updateUI();
  updateText();

  // Clear any feedback messages
  const feedbackMessages = document.querySelectorAll(".feedback-message");
  feedbackMessages.forEach((msg) => {
    msg.classList.remove("show");
  });

  // Reset character images
  const characterImages = document.querySelectorAll('img[id*="character"]');
  characterImages.forEach((img) => {
    if (
      img.id.includes("start-character") ||
      img.id.includes("end-character")
    ) {
      img.src = img.id.includes("start-character")
        ? "assets/Deete_Neutral_Q.png"
        : "assets/Deete_Happy_Q.png";
    } else {
      img.src = "assets/Deete_Neutral.png";
    }
  });

  // Reset dialogue boxes
  const dialogueBoxes = document.querySelectorAll(".dialogue-box");
  dialogueBoxes.forEach((box) => {
    box.classList.remove("correct", "incorrect");
  });

  // Reset fraction buttons
  const fractionButtons = document.querySelectorAll(".fraction-btn");
  fractionButtons.forEach((btn) => {
    btn.classList.remove("correct", "incorrect");
  });

  // Reset number displays
  const numberDisplays = document.querySelectorAll('[id*="number-display"]');
  numberDisplays.forEach((display) => {
    display.classList.remove("red", "green");
  });

  // Reset stepper buttons
  const stepperButtons = document.querySelectorAll(".stepper-btn");
  stepperButtons.forEach((btn) => {
    btn.disabled = false;
  });

  // Hide next buttons
  const nextButtons = document.querySelectorAll(
    '[id*="nextButton"], [id*="next-btn"]'
  );
  nextButtons.forEach((btn) => {
    btn.style.display = "none";
  });

  // Reset water levels
  const waterElements = document.querySelectorAll(".water");
  waterElements.forEach((water) => {
    water.style.height = "0%";
  });

  // Reset sliders
  const sliderThumbs = document.querySelectorAll(".slider-thumb");
  sliderThumbs.forEach((thumb) => {
    thumb.style.bottom = "0%";
    thumb.style.pointerEvents = "auto";
    thumb.style.cursor = "grab";
  });

  // Hide slider containers
  const sliderContainers = document.querySelectorAll(
    ".custom-slider-container"
  );
  sliderContainers.forEach((container) => {
    container.style.display = "none";
  });

  // Hide check buttons
  const checkButtons = document.querySelectorAll(".check-btn");
  checkButtons.forEach((btn) => {
    btn.style.display = "none";
  });

  // Clear external division numbers
  hideExternalDivisionNumbers();

  // Clear red/green lines
  const redLines = document.querySelectorAll(
    '[id*="red-division-line"], [id*="red-water-line"]'
  );
  redLines.forEach((line) => {
    line.classList.remove("show");
  });

  const greenLines = document.querySelectorAll('[id*="green-division-line"]');
  greenLines.forEach((line) => {
    line.classList.remove("show");
  });

  // Clear red water fills
  const redWaterFills = document.querySelectorAll('[id*="red-water-fill"]');
  redWaterFills.forEach((fill) => {
    fill.classList.remove("show");
    fill.style.height = "0%";
  });

  console.log("Applet restarted");
}
function switchToScreen(screenNumber) {
  // Hide all screens
  const screens = document.querySelectorAll(".content-screen");
  screens.forEach((screen) => {
    screen.classList.remove("active");
  });

  // Clear external division numbers if leaving screen 5
  if (currentScreen === 5 && screenNumber !== 5) {
    hideExternalDivisionNumbers();
  }

  // Show the target screen
  let screenId;
  switch (screenNumber) {
    case 8:
      screenId = "question-screen";
      break;
    case 9:
      screenId = "summary-screen";
      break;
    case 10:
      screenId = "end-screen";
      break;
    default:
      screenId = "screen" + screenNumber;
      break;
  }

  const targetScreen = document.getElementById(screenId);
  if (targetScreen) {
    targetScreen.classList.add("active");
  }

  currentScreen = screenNumber;
  console.log("Switched to screen", screenNumber);
}

function updateDivisionMarkers(
  markerContainerId,
  divs = divisions,
  numberContainerId
) {
  const markersContainer = document.getElementById(markerContainerId);
  const numbersContainer = document.getElementById(numberContainerId);

  // Clear existing markers and numbers
  markersContainer.innerHTML = "";
  if (numbersContainer) {
    numbersContainer.innerHTML = "";
  }

  // Add new markers based on current divisions
  for (let i = 0; i < divs; i++) {
    const marker = document.createElement("div");
    marker.className = "division-marker";

    // For screen 3, add color based on whether divisions is correct
    if (markerContainerId === "division-markers3") {
      if (divs === 3) {
        marker.classList.add("green");
      }
    }

    markersContainer.appendChild(marker);
  }

  // Add numbers to each division
  if (numbersContainer) {
    for (let i = 0; i < divs; i++) {
      const number = document.createElement("div");
      number.className = "division-number";
      number.textContent = i + 1;
      numbersContainer.appendChild(number);
    }
  }
}

function setupCustomSlider(track, thumb, waterId) {
  let isDragging = false;

  const handleDragStart = () => {
    isDragging = true;
    thumb.style.cursor = "grabbing";
    if (waterfillingAudio) {
      waterfillingAudio
        .play()
        .catch((e) => console.log("Audio play failed:", e));
    }
  };

  const handleDragEnd = () => {
    isDragging = false;
    thumb.style.cursor = "grab";
    if (waterfillingAudio) {
      waterfillingAudio.pause();
      waterfillingAudio.currentTime = 0; // Reset for next play
    }
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;

    const clientY = e.clientY || e.touches[0].clientY;
    const trackRect = track.getBoundingClientRect();
    const offsetY = clientY - trackRect.top;
    let newY = Math.max(0, Math.min(trackRect.height, offsetY));

    // Invert the value
    newY = trackRect.height - newY;

    const sliderPercentage = (newY / trackRect.height) * 100;
    // Water should fill to match the division markers area (94% of container)
    const waterPercentage = sliderPercentage * 0.92;

    thumb.style.bottom = `calc(${sliderPercentage}% - ${
      thumb.offsetHeight / 2
    }px)`;
    document.getElementById(waterId).style.height = waterPercentage + "%";
    waterLevel = waterPercentage;

    // Hide red division line when user adjusts slider
    if (waterId === "water4") {
      hideRedDivisionLine("red-division-line4");
    } else if (waterId === "question-water") {
      hideRedDivisionLine("red-division-line-question");
      hideGreenDivisionLine("green-division-line-question"); // Hide green line when slider is moved
    }
  };

  thumb.addEventListener("mousedown", handleDragStart);
  document.addEventListener("mouseup", handleDragEnd);
  document.addEventListener("mousemove", handleDragMove);

  thumb.addEventListener("touchstart", handleDragStart);
  document.addEventListener("touchend", handleDragEnd);
  document.addEventListener("touchmove", handleDragMove);
}

function setupQuestion(questionIndex) {
  const question = questions[questionIndex];

  // Reset UI elements
  document
    .getElementById("question-dialogue-box")
    .classList.remove("correct", "incorrect");
  document.getElementById("question-character").src =
    "assets/Deete_Neutral.png";
  document
    .getElementById("question-number-display")
    .classList.remove("green", "red");
  document.getElementById("question-next-btn").style.display = "none";

  // Hide red and green division lines
  hideRedDivisionLine("red-division-line-question");
  hideGreenDivisionLine("green-division-line-question");

  // Show question, hide feedback
  document.getElementById("question-dialogue-text").style.display = "block";
  document.getElementById("correct-feedback").style.display = "none";

  // Set question text
  document.getElementById("question-dialogue-text").innerHTML = `${
    langText[lang].question.createFraction
  } <span id="target-fraction">${createFractionHTML(
    question.numerator,
    question.denominator
  )}</span>?<br>${langText[lang].question.setDenominator}`;

  // Reset container
  document.getElementById("question-number-display").textContent = "1";
  document.getElementById("question-water").style.height = "0%";
  document.getElementById("question-slider-thumb").style.bottom = "0%";
  waterLevel = 0; // Explicitly reset waterLevel

  // Reset controls
  document.getElementById("question-add-btn").disabled = false;
  document.getElementById("question-subtract-btn").disabled = false;
  document.getElementById("question-slider-container").style.display = "none";
  document.getElementById("question-check-btn").style.display = "inline-block"; // Show the check button initially for denominator validation
  document
    .getElementById("question-check-btn")
    .classList.add("check-btn-denominator-state"); // Add class for denominator state

  // Re-enable slider interaction for new question
  document.getElementById("question-slider-thumb").style.pointerEvents = "auto";
  document.getElementById("question-slider-thumb").style.cursor = "grab";

  // Reset denominatorCorrectlySet state
  denominatorCorrectlySet = false;

  // Update division markers
  updateDivisionMarkers(
    "question-division-markers",
    1,
    "question-division-numbers"
  );
}

function createFractionHTML(numerator, denominator) {
  return `
    <div class="fraction-display" style="display: inline-flex; vertical-align: middle; margin: 0 5px;">
      <div class="numerator">${numerator}</div>
      <div class="fraction-line"></div>
      <div class="denominator">${denominator}</div>
    </div>
  `;
}

function showFeedbackMessage(message) {
  const feedbackBox = document.getElementById("feedback-message");
  feedbackBox.textContent = message;
  feedbackBox.classList.add("show");

  setTimeout(() => {
    feedbackBox.classList.remove("show");
  }, 1500);
}

function showIncorrectFeedbackMessage(message) {
  const feedbackBox = document.getElementById("incorrect-feedback-message");
  feedbackBox.textContent = message;
  feedbackBox.classList.add("show");

  setTimeout(() => {
    feedbackBox.classList.remove("show");
  }, 1500);
}

function hideAllFeedbackMessages() {
  const feedbackMessages = document.querySelectorAll(".feedback-message");
  feedbackMessages.forEach((msg) => {
    msg.classList.remove("show");
  });
}

function showRedDivisionLine(containerId, wrongWaterLevel) {
  const redLine = document.getElementById(containerId);
  if (redLine) {
    // The water fills within the division markers area (84% height, starting at 10% from top)
    // Water container has padding-top: 5%, padding-bottom: 6%
    // Division markers area: height: 84%, top: 10%
    // Water element has bottom: 9.6px offset

    // Convert water level percentage to position within the division markers area
    const divisionMarkersTop = 10; // 10% from top of container
    const divisionMarkersHeight = 84; // 84% of container height
    const containerPaddingBottom = 6; // 6% padding bottom

    // Calculate position within the fillable area
    const positionInFillableArea =
      (wrongWaterLevel / 94) * divisionMarkersHeight;
    const bottomPosition = containerPaddingBottom + positionInFillableArea;
    const visualOffset = 0; // Position slightly below for better visibility

    redLine.style.bottom = `${bottomPosition - visualOffset}%`;
    redLine.classList.add("show");
  }
}

function hideRedDivisionLine(containerId) {
  const redLine = document.getElementById(containerId);
  if (redLine) {
    redLine.classList.remove("show");
  }
}

function showGreenDivisionLine(containerId, correctWaterLevel) {
  const greenLine = document.getElementById(containerId);
  if (greenLine) {
    const divisionMarkersTop = 10; // 10% from top of container
    const divisionMarkersHeight = 84; // 84% of container height
    const containerPaddingBottom = 6; // 6% padding bottom

    const positionInFillableArea =
      (correctWaterLevel / 94) * divisionMarkersHeight;
    const bottomPosition = containerPaddingBottom + positionInFillableArea;
    const visualOffset = 0;

    greenLine.style.bottom = `${bottomPosition - visualOffset}%`;
    greenLine.classList.add("show");
  }
}

function hideGreenDivisionLine(containerId) {
  const greenLine = document.getElementById(containerId);
  if (greenLine) {
    greenLine.classList.remove("show");
  }
}

function showRedWaterFillForWrongAnswer(fraction) {
  const redWaterFill = document.getElementById("red-water-fill5");
  const redWaterLine = document.getElementById("red-water-line5");

  if (!redWaterFill || !redWaterLine) return;

  let fillHeight = 0;
  let linePosition = 0;

  if (fraction.numerator === 1 && fraction.denominator === 2) {
    // 1/2 - fill to 50% of the fillable area
    fillHeight = 47; // 50% of 84% fillable area
    linePosition = 0 + 0.89 + fillHeight; // 6% padding bottom + fill height, adjusted for 9.6px bottom offset
  } else if (fraction.numerator === 3 && fraction.denominator === 1) {
    // 3/1 - fill to maximum (100% of fillable area)
    fillHeight = 88; // 100% of 84% fillable area
    linePosition = 0.4 + 0.89 + fillHeight; // 6% padding bottom + fill height, adjusted for 9.6px bottom offset
  }

  // Set the red fill height
  redWaterFill.style.height = fillHeight + "%";
  redWaterFill.classList.add("show");

  // Set the red line position
  redWaterLine.style.bottom = linePosition + "%";
  redWaterLine.classList.add("show");
}

function hideRedWaterFill(containerId) {
  const redWaterFill = document.getElementById(containerId);
  if (redWaterFill) {
    redWaterFill.classList.remove("show");
    redWaterFill.style.height = "0%";
  }
}

function hideRedWaterLine(containerId) {
  const redWaterLine = document.getElementById(containerId);
  if (redWaterLine) {
    redWaterLine.classList.remove("show");
  }
}

function displayExternalDivisionNumbers(fraction) {
  const externalNumbersContainer = document.getElementById(
    "external-division-numbers5"
  );
  if (!externalNumbersContainer) return;

  externalNumbersContainer.innerHTML = ""; // Clear previous numbers

  const displayCount =
    fraction.numerator > fraction.denominator
      ? fraction.numerator
      : fraction.denominator;
  const divisionHeightPercent = 84 / displayCount; // 84% is the fillable height of the water container

  for (let i = 0; i < displayCount; i++) {
    const numberDiv = document.createElement("div");
    numberDiv.className = "external-division-number";
    numberDiv.textContent = i + 1;

    // Calculate bottom position: (index * division height) + (half division height) + bottom padding (6%)
    let offset = 0;
    if (displayCount === 3) {
      // Only apply adjustments when there are 3 divisions
      if (i === 0) {
        // For number '1'
        offset = 5; // Move up
      } else if (i === 2) {
        // For number '3'
        offset = -5; // Move down
      }
    }
    const bottomPosition =
      i * divisionHeightPercent + divisionHeightPercent / 2 + 6 + offset;
    numberDiv.style.bottom = `${bottomPosition}%`;

    externalNumbersContainer.appendChild(numberDiv);
  }
}

function hideExternalDivisionNumbers() {
  const externalNumbersContainer = document.getElementById(
    "external-division-numbers5"
  );
  if (externalNumbersContainer) {
    externalNumbersContainer.innerHTML = "";
  }
}

function showHandIcon(buttonId) {
  const button = document.getElementById(buttonId);
  handIconElement = document.createElement("div");
  handIconElement.className = "hand-icon";
  handIconElement.style.top = button.offsetTop + "px";
  handIconElement.style.left = button.offsetLeft - 70 + "px";
  button.parentNode.appendChild(handIconElement);
}

function updateUI() {
  // Initial setup for screen 2
  updateDivisionMarkers("division-markers", 1, "division-numbers");

  // Initial setup for screen 5 - adjust for new 94% height area
  document.getElementById("water5").style.height = (100 / 3) * 0.92 + "%";
  updateDivisionMarkers("division-markers5", 3, "division-numbers5");

  // Initial setup for screen 6 - adjust for new 94% height area
  document.getElementById("water6").style.height = (100 / 3) * 0.92 + "%";
  updateDivisionMarkers("division-markers6", 3, "division-numbers6");

  // Initial setup for screen 9 (summary screen)
  updateDivisionMarkers(
    "summary-division-markers1",
    5,
    "summary-division-numbers1"
  );
  updateDivisionMarkers(
    "summary-division-markers2",
    1,
    "summary-division-numbers2"
  );
}

function updateText() {
  document.getElementById("welcome-title").textContent =
    langText[lang].welcome.title;
  document.getElementById("start-dialogue-text").innerHTML =
    langText[lang].welcome.description;
  document.getElementById("startButton").textContent =
    langText[lang].welcome.button;
  document.getElementById("dialogue-text").innerHTML =
    langText[lang].screen2.dialogue;
  document.getElementById("nextButton").textContent =
    langText[lang].screen2.nextButton;
  document.getElementById("dialogue-text3").innerHTML =
    langText[lang].screen3.dialogue;
  document.getElementById("nextButton3").textContent =
    langText[lang].screen3.nextButton;
  document.getElementById("dialogue-text4").innerHTML =
    langText[lang].screen4.dialogue;
  document.getElementById("check-btn4").textContent =
    langText[lang].screen4.checkButton;
  document.getElementById("dialogue-text5").innerHTML =
    langText[lang].screen5.dialogue;
  document.getElementById("nextButton5").textContent =
    langText[lang].screen5.nextButton;
  document.getElementById("nextButton6").textContent =
    langText[lang].screen6.nextButton;
  document.getElementById("practice-dialogue-text").innerHTML =
    langText[lang].practice.title;
  document.getElementById("practiceButton").textContent =
    langText[lang].practice.button;
  document.getElementById("question-check-btn").textContent =
    langText[lang].question.checkButton;
  document.getElementById("question-next-btn").textContent =
    langText[lang].question.nextButton;
  document.getElementById("summary-next-btn").textContent =
    langText[lang].summary.nextButton;
  document.getElementById("end-title").textContent = langText[lang].end.title;
  document.getElementById("end-dialogue-text").innerHTML =
    langText[lang].end.description;
  document.getElementById("endButton").textContent = langText[lang].end.button;

  // Update dynamic text
  document.querySelector(".formula-text span:first-child").innerHTML =
    langText[lang].screen6.partsFilled;
  document.querySelector(".formula-text span:last-child").innerHTML =
    langText[lang].screen6.partsSplit;
  document.querySelector(
    "#summary-dialogue-box .formula-text span:first-child"
  ).innerHTML = langText[lang].summary.partsFilled;
  document.querySelector(
    "#summary-dialogue-box .formula-text span:last-child"
  ).innerHTML = langText[lang].summary.partsSplit;
  document.querySelector(".summary-text").innerHTML =
    langText[lang].summary.oneWhole;

  if (currentScreen === 8) {
    setupQuestion(currentQuestion);
    const feedback = document.getElementById("correct-feedback");
    if (feedback.style.display === "block") {
      const question = questions[currentQuestion - 1];
      document.getElementById("correct-feedback-line1").textContent =
        langText[lang].question.wellDone;
      document.getElementById("correct-feedback-line2").innerHTML = `${
        langText[lang].question.youHaveCreated
      } ${createFractionHTML(question.numerator, question.denominator)} ${
        langText[lang].question.byFilling
      } ${question.numerator} ${langText[lang].question.outOf} ${
        question.denominator
      } ${langText[lang].question.equalParts}`;
    }
  }
}

// Initialize the applet when the DOM is loaded
document.addEventListener("DOMContentLoaded", initializeApplet);
