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

document.addEventListener("DOMContentLoaded", () => {
  const scaleWrapper = document.querySelector(".scale-wrapper");

  // Get language from HTML lang attribute, with fallback to "en"
  const htmlLang = document.documentElement.lang || "en";
  let currentLanguage = texts[htmlLang] ? htmlLang : "en";
  let currentScreen = 1;
  let currentQuestionIndex = 0;
  let waterLevel = 0;
  let isSliderActive = true;
  const waterSound = document.getElementById("waterSound");

  const questions = [
    { type: "estimate", value: 1 / 2, text_key: "q1_text" },
    { type: "less_than", value: 1 / 2, text_key: "q2_text" },
    { type: "greater_than", value: 1 / 2, text_key: "q3_text" },
    { type: "estimate", value: 1 / 3, text_key: "q4_text" },
    { type: "less_than", value: 1 / 3, text_key: "q5_text" },
    { type: "estimate", value: 2 / 3, text_key: "q6_text" },
    { type: "between", value: [1 / 3, 1 / 2], text_key: "q7_text" },
    { type: "between", value: [1 / 3, 2 / 3], text_key: "q8_text" },
  ];

  function updateTexts() {
    const langTexts = texts[currentLanguage];
    document.getElementById("welcome-title").textContent =
      langTexts.welcome_title;
    document.getElementById("start-speech-text").innerHTML =
      langTexts.start_speech;
    document.getElementById("start-btn").textContent = langTexts.start_btn;
    document.getElementById("screen2-speech-text").innerHTML =
      langTexts.screen2_speech;
    document.getElementById("screen2-next-btn").textContent =
      langTexts.next_btn;
    document.getElementById("screen3-speech-text").innerHTML =
      langTexts.screen3_speech;
    document.getElementById("screen3-next-btn").textContent =
      langTexts.next_btn;
    document.getElementById("question-speech-text").innerHTML =
      langTexts.question_speech;
    document.getElementById("check-btn").textContent = langTexts.check_btn;
    console.log(
      "Element 'end-speech-text':",
      document.getElementById("end-speech-text")
    );
    document.getElementById("end-speech-text").innerHTML = langTexts.end_speech;
    document.getElementById("start-again-btn").textContent =
      langTexts.start_again_btn;
  }

  function showScreen(screenId) {
    document.querySelectorAll(".content-screen").forEach((screen) => {
      screen.classList.remove("active");
    });
    document.getElementById(screenId).classList.add("active");
    currentScreen = screenId;
  }

  function resetApp() {
    // Reset all variables to initial state
    currentQuestionIndex = 0;
    waterLevel = 0;
    isSliderActive = true;

    // Reset water level and slider position
    const water = document.querySelector("#question-screen .water");
    const thumb = document.getElementById("slider-thumb-question");
    if (water && thumb) {
      water.style.height = "0%";
      thumb.style.bottom = `calc(0% - ${thumb.offsetHeight / 2}px)`;
    }

    // Clear any existing markers, lines, and highlights
    const divisionMarkers = document.querySelector(
      "#question-screen .division-markers"
    );
    const divisionNumbers = document.querySelector(
      "#question-screen .division-numbers"
    );
    const divisionLines = document.querySelector(
      "#question-screen .division-lines"
    );
    const redErrorLine = document.querySelector(
      "#question-screen .red-error-line"
    );
    const greenCorrectLine = document.querySelector(
      "#question-screen .green-correct-line"
    );

    if (divisionMarkers) divisionMarkers.innerHTML = "";
    if (divisionNumbers) divisionNumbers.innerHTML = "";
    if (divisionLines) divisionLines.innerHTML = "";
    if (redErrorLine) {
      redErrorLine.classList.remove("show");
    }
    if (greenCorrectLine) {
      greenCorrectLine.classList.remove("show");
    }

    // Clear any existing water fill highlights
    const existingFill = document.querySelector(
      "#question-screen .water-fill-highlight"
    );
    if (existingFill) {
      existingFill.remove();
    }

    // Clear any existing dynamically added division markers
    document
      .querySelectorAll(
        "#question-screen .water-container .division-marker.yellow-marker, #question-screen .water-container .division-marker.white-marker"
      )
      .forEach((marker) => {
        marker.remove();
      });

    // Reset check button
    const checkBtn = document.getElementById("check-btn");
    if (checkBtn) {
      checkBtn.textContent = texts[currentLanguage].check_btn;
      checkBtn.classList.remove("red");
      checkBtn.onclick = handleCheckAnswer;
    }

    // Reset character image
    const questionCharacter = document.getElementById("question-character");
    if (questionCharacter) {
      questionCharacter.src = "assets/Deete_Neutral_Q.png";
    }

    // Reset speech bubble
    const speechBubble = document.querySelector(
      "#question-screen .speech-bubble-horizontal"
    );
    if (speechBubble) {
      speechBubble.classList.remove("incorrect", "correct");
      speechBubble.innerHTML = `<p>${texts[currentLanguage].question_speech}</p>`;
    }

    // Ensure the static top marker is visible
    const staticTopMarker = document.querySelector(
      "#question-screen .water-container .screen3-marker"
    );
    if (staticTopMarker) staticTopMarker.style.display = "";
  }

  function showQuestionScreen() {
    document.querySelectorAll(".content-screen").forEach((screen) => {
      screen.classList.remove("active");
    });
    document.getElementById("question-screen").classList.add("active");
    loadQuestion(currentQuestionIndex);
  }

  function loadQuestion(index) {
    const question = questions[index];
    const langTexts = texts[currentLanguage];
    document.getElementById("question-text").innerHTML =
      langTexts[question.text_key];
    document.getElementById("question-character").src =
      "assets/Deete_Neutral_Q.png";
    // Reset UI elements for the new question
    const speechBubble = document.querySelector(
      "#question-screen .speech-bubble-horizontal"
    );
    speechBubble.classList.remove("incorrect", "correct");
    // Wrap the text in a paragraph tag to ensure CSS styles are applied
    speechBubble.innerHTML = `<p>${langTexts.question_speech}</p>`;
    document.getElementById("check-btn").textContent = langTexts.check_btn;
    document.getElementById("check-btn").classList.remove("red");
    const water = document.querySelector("#question-screen .water");
    const thumb = document.getElementById("slider-thumb-question");
    water.style.height = "0%";
    thumb.style.bottom = `calc(0% - ${thumb.offsetHeight / 2}px)`;
    waterLevel = 0;
    isSliderActive = true;
    document.querySelector("#question-screen .division-lines").innerHTML = "";
    document.querySelector("#question-screen .division-markers").innerHTML = ""; // Clear division markers
    document.querySelector("#question-screen .division-numbers").innerHTML = ""; // Clear division numbers
    document
      .querySelector("#question-screen .red-error-line")
      .classList.remove("show");
    document
      .querySelector("#question-screen .green-correct-line")
      .classList.remove("show");
    // Clear any existing water fill highlights
    const existingFill = document.querySelector(
      "#question-screen .water-fill-highlight"
    );
    if (existingFill) {
      existingFill.remove();
    }
    // Clear any existing dynamically added division markers
    document
      .querySelectorAll(
        "#question-screen .water-container .division-marker.yellow-marker, #question-screen .water-container .division-marker.white-marker"
      )
      .forEach((marker) => {
        marker.remove();
      });

    // Ensure the static top marker is visible at the start of each question
    const staticTopMarker = document.querySelector(
      "#question-screen .water-container .screen3-marker"
    );
    if (staticTopMarker) staticTopMarker.style.display = "";
  }

  function getMappedSliderValue() {
    return waterLevel / 89;
  }

  function handleCheckAnswer() {
    const sliderValue = getMappedSliderValue();
    const question = questions[currentQuestionIndex];
    const speechBubble = document.querySelector(
      "#question-screen .speech-bubble-horizontal"
    );
    const checkBtn = document.getElementById("check-btn");
    const langTexts = texts[currentLanguage];
    let isCorrect = false;

    switch (question.type) {
      case "estimate":
        isCorrect = Math.abs(sliderValue - question.value) <= 0.05;
        break;
      case "less_than":
        isCorrect = sliderValue < question.value;
        break;
      case "greater_than":
        isCorrect = sliderValue > question.value;
        break;
      case "between":
        isCorrect =
          sliderValue > question.value[0] && sliderValue < question.value[1];
        break;
    }

    speechBubble.classList.remove("incorrect", "correct");
    // Hide the always-visible top marker once an answer is checked
    const staticTopMarker = document.querySelector(
      "#question-screen .water-container .screen3-marker"
    );
    if (staticTopMarker) staticTopMarker.style.display = "none";
    if (isCorrect) {
      playCorrectSound();
      document.getElementById("question-character").src =
        "assets/Deete_Happy_Q.png";
      speechBubble.classList.add("correct");
      speechBubble.innerHTML = getFeedbackText(true);
      checkBtn.textContent = langTexts.next_btn;
      isSliderActive = false;

      // Snap to target for estimate questions
      if (question.type === "estimate") {
        const targetLevel = question.value * 89;
        const water = document.querySelector("#question-screen .water");
        const thumb = document.getElementById("slider-thumb-question");
        const percentage = (targetLevel / 89) * 100;
        thumb.style.bottom = `calc(${percentage}% - ${
          thumb.offsetHeight / 2
        }px)`;
        water.style.height = targetLevel + "%";
        waterLevel = targetLevel;
      }

      checkBtn.onclick = () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
          loadQuestion(currentQuestionIndex);
          checkBtn.onclick = handleCheckAnswer;
        } else {
          showScreen("end-screen");
        }
      };
      // Show division markers and numbers for single fraction correct answers
      if (["estimate", "less_than", "greater_than"].includes(question.type)) {
        showCorrectDivisionMarkers(question);
        showCorrectState(sliderValue);
      } else if (question.type === "between") {
        showCorrectStateForBetween(question.value[0], question.value[1]);
      }
    } else {
      playIncorrectSound();
      document.getElementById("question-character").src =
        "assets/Deete_Sad_Q.png";
      speechBubble.classList.add("incorrect");
      speechBubble.innerHTML = getFeedbackText(false);
      checkBtn.textContent = langTexts.try_again_btn;
      checkBtn.classList.add("red");
      isSliderActive = false;
      checkBtn.onclick = () => {
        loadQuestion(currentQuestionIndex);
        checkBtn.onclick = handleCheckAnswer;
      };
      // Only show error state for single fraction questions
      if (
        ["estimate", "less_than", "greater_than", "between"].includes(
          question.type
        )
      ) {
        showErrorState(sliderValue);
      }
    }
  }

  function showCorrectState(sliderValue) {
    const greenLine = document.querySelector(
      "#question-screen .green-correct-line"
    );

    greenLine.style.bottom = `calc(6% + ${0.89 * waterLevel}%)`;
    greenLine.classList.add("show");
    console.log(
      "showCorrectState called. Green correct line bottom position:",
      `calc(6% + ${0.89 * waterLevel}%)`,
      "Water Level:",
      waterLevel + "%"
    );
  }

  function showCorrectStateForBetween(val1, val2) {
    const waterContainer = document.querySelector(
      "#question-screen .water-container"
    );
    const divisionMarkersContainer = document.querySelector(
      "#question-screen .division-markers"
    );
    const containerHeight = waterContainer.offsetHeight; // Get actual height of the container
    const fillableHeight = containerHeight * 0.84; // 84% of container height is fillable
    const bottomOffset = containerHeight * 0.06; // 6% is bottom padding

    const fraction1 = decimalToFraction(val1);
    const fraction2 = decimalToFraction(val2);
    const denominator1 = fraction1.den;
    const denominator2 = fraction2.den;

    // Helper function to draw markers with correct positioning
    const drawMarkers = (denominator, colorClass = "") => {
      for (let i = 1; i <= denominator; i++) {
        // Draw 'denominator' markers
        const marker = document.createElement("div");
        marker.className = "division-marker";
        if (colorClass) {
          marker.classList.add(colorClass);
        }
        // Calculate position as a percentage from the bottom
        // The fillable area is 89% of the container height, with 6% bottom padding.
        // So, 100% of the water level corresponds to 89% of the container height.
        // The markers should divide the *entire* fillable area.
        const positionPercentage = (i / denominator) * 89 + 6; // 6% is bottom padding
        marker.style.bottom = `${positionPercentage}%`;
        divisionMarkersContainer.appendChild(marker);
      }
    };

    // Clear division numbers for 'between' questions
    document.querySelector("#question-screen .division-numbers").innerHTML = "";

    if (denominator1 === denominator2) {
      drawMarkers(denominator1); // Yellow markers for common denominator, centered
    } else {
      drawMarkers(denominator1); // Yellow markers for first denominator, centered
      drawMarkers(denominator2, "white-marker"); // White markers for second denominator, centered
    }

    // Green Fill (between val1 and val2)
    const fillDiv = document.createElement("div");
    fillDiv.className = "water-fill-highlight";

    const bottomPosPx = val1 * fillableHeight + bottomOffset;
    const heightPx = (val2 - val1) * fillableHeight;

    fillDiv.style.bottom = `${bottomPosPx}px`;
    fillDiv.style.height = `${heightPx}px`;
    waterContainer.appendChild(fillDiv);
  }

  function getFeedbackText(isCorrect) {
    const question = questions[currentQuestionIndex];
    const langTexts = texts[currentLanguage];
    const sliderValue = getMappedSliderValue();

    let feedbackText = "";

    if (isCorrect) {
      switch (question.type) {
        case "less_than":
          if (question.text_key === "q2_text")
            feedbackText = langTexts.feedback_less_correct_q2;
          else if (question.text_key === "q5_text")
            feedbackText = langTexts.feedback_less_correct_q5;
          break;
        case "greater_than":
          feedbackText = langTexts.feedback_greater_correct;
          break;
        case "between":
          if (question.text_key === "q7_text")
            feedbackText = langTexts.feedback_q7_correct;
          else if (question.text_key === "q8_text")
            feedbackText = langTexts.feedback_q8_correct;
          break;
        default:
          const fraction = decimalToFraction(question.value);
          feedbackText = langTexts.feedback_correct
            .replace("{numerator}", fraction.num)
            .replace("{denominator}", fraction.den)
            .replace(
              "{fraction}",
              `<span class='fraction'><span class='numerator'>${fraction.num}</span><span class='denominator'>${fraction.den}</span></span>`
            );
          break;
      }
    } else {
      if (question.text_key === "q7_text")
        feedbackText = langTexts.feedback_q7_wrong;
      else if (question.text_key === "q8_text")
        feedbackText = langTexts.feedback_q8_wrong;
      else if (Math.abs(sliderValue - question.value) < 0.001)
        feedbackText = langTexts.feedback_equal;
      else if (sliderValue > question.value) {
        if (question.text_key === "q1_text") {
          feedbackText = langTexts.feedback_greater_q1;
        } else if (question.text_key === "q5_text") {
          feedbackText = langTexts.feedback_greater_q5;
        } else {
          feedbackText = langTexts.feedback_greater;
        }
      } else feedbackText = langTexts.feedback_less;
    }

    // Wrap the feedback text in a paragraph tag to ensure CSS styles are applied
    return `<p>${feedbackText}</p>`;
  }
  function decimalToFraction(decimal) {
    const tolerance = 1.0e-6;
    let h1 = 1;
    let h2 = 0;
    let k1 = 0;
    let k2 = 1;
    let b = decimal;
    do {
      let a = Math.floor(b);
      let aux = h1;
      h1 = a * h1 + h2;
      h2 = aux;
      aux = k1;
      k1 = a * k1 + k2;
      k2 = aux;
      b = 1 / (b - a);
    } while (Math.abs(decimal - h1 / k1) > decimal * tolerance);

    return {
      num: h1,
      den: k1,
    };
  }

  function showErrorState(sliderValue) {
    const divisionMarkersContainer = document.querySelector(
      "#question-screen .division-markers"
    );
    const divisionNumbersContainer = document.querySelector(
      "#question-screen .division-numbers"
    );
    const dottedLine = document.querySelector(
      "#question-screen .red-error-line"
    );
    const question = questions[currentQuestionIndex];

    divisionMarkersContainer.innerHTML = ""; // Clear previous markers
    divisionNumbersContainer.innerHTML = ""; // Clear previous numbers

    if (["estimate", "less_than", "greater_than"].includes(question.type)) {
      const fraction = decimalToFraction(question.value);
      const denominator = fraction.den;
      const numerator = fraction.num;

      for (let i = 1; i <= denominator; i++) {
        // Create division marker
        const marker = document.createElement("div");
        marker.className = "division-marker";
        // Calculate position as a percentage from the bottom
        const positionPercentage = (i / denominator) * 89 + 6; // 6% is bottom padding
        marker.style.bottom = `${positionPercentage}%`;
        divisionMarkersContainer.appendChild(marker);

        // Create division number
        const number = document.createElement("div");
        number.className = "division-number";
        number.textContent = i;
        // Position division number absolutely as well
        number.style.bottom = `${positionPercentage}%`;
        divisionNumbersContainer.appendChild(number);
      }

      // All division markers should be yellow when the answer is wrong.
      // The default style for .division-marker in style.css is already yellow.
      // No need to add a specific class for yellow.
      // The previous 'red' highlighting for the correct marker is removed as per requirement.
    } else if (question.type === "between") {
      const fraction1 = decimalToFraction(question.value[0]);
      const fraction2 = decimalToFraction(question.value[1]);
      const denominator1 = fraction1.den;
      const denominator2 = fraction2.den;

      // Helper function to draw markers with correct positioning
      const drawMarkers = (denominator, colorClass = "") => {
        for (let i = 1; i <= denominator; i++) {
          // Draw 'denominator' markers
          const marker = document.createElement("div");
          marker.className = "division-marker";
          if (colorClass) {
            marker.classList.add(colorClass);
          }
          // Calculate position as a percentage from the bottom
          // The fillable area is 84% of the container height, with 6% bottom padding.
          // So, 100% of the water level corresponds to 84% of the container height.
          // The markers should divide the *entire* fillable area.
          const positionPercentage = (i / denominator) * 84 + 6; // 6% is bottom padding
          marker.style.bottom = `${positionPercentage}%`;
          divisionMarkersContainer.appendChild(marker);
        }
      };

      // Clear division numbers for 'between' questions
      divisionNumbersContainer.innerHTML = "";

      if (denominator1 === denominator2) {
        drawMarkers(denominator1); // Yellow markers for common denominator, centered
      } else {
        drawMarkers(denominator1); // Yellow markers for first denominator, centered
        drawMarkers(denominator2, "white-marker"); // White markers for second denominator, centered
      }
    }

    // Set directly to water level for exact alignment
    dottedLine.style.bottom = `calc(6% + ${0.89 * waterLevel}%)`;
    dottedLine.classList.add("show");
    console.log(
      "showErrorState called. Red error line bottom position:",
      `calc(6% + ${0.89 * waterLevel}%)`,
      "Water Level:",
      waterLevel + "%"
    );
  }

  function showCorrectDivisionMarkers(question) {
    const divisionMarkersContainer = document.querySelector(
      "#question-screen .division-markers"
    );
    const divisionNumbersContainer = document.querySelector(
      "#question-screen .division-numbers"
    );

    divisionMarkersContainer.innerHTML = ""; // Clear previous markers
    divisionNumbersContainer.innerHTML = ""; // Clear previous numbers

    const fraction = decimalToFraction(question.value);
    const denominator = fraction.den;
    const numerator = fraction.num;

    for (let i = 1; i <= denominator; i++) {
      // Create division marker
      const marker = document.createElement("div");
      marker.className = "division-marker";
      // Calculate position as a percentage from the bottom
      const positionPercentage = (i / denominator) * 89 + 6; // 6% is bottom padding
      marker.style.bottom = `${positionPercentage}%`;
      divisionMarkersContainer.appendChild(marker);

      // Create division number
      const number = document.createElement("div");
      number.className = "division-number";
      number.textContent = i;
      // Position division number absolutely as well
      number.style.bottom = `${positionPercentage}%`;
      divisionNumbersContainer.appendChild(number);
    }
  }

  function handleScaling() {
    const containerWidth = 1920;
    const containerHeight = 1080;
    const availableWidth = window.innerWidth;
    const availableHeight = window.innerHeight;

    const scale = Math.min(
      availableWidth / containerWidth,
      availableHeight / containerHeight
    );
    scaleWrapper.style.transform = `scale(${scale})`;
  }

  // Event Listeners

  document.getElementById("start-btn").addEventListener("click", () => {
    playClickSound();
    showScreen("screen2");
  });
  document.getElementById("screen2-next-btn").addEventListener("click", () => {
    playClickSound();
    showScreen("screen3");
  });
  document.getElementById("screen3-next-btn").addEventListener("click", () => {
    playClickSound();
    showQuestionScreen();
  });
  document.getElementById("check-btn").onclick = handleCheckAnswer;
  document.getElementById("start-again-btn").addEventListener("click", () => {
    playClickSound();
    resetApp();
    showScreen("screen1");
  });

  function setupCustomSlider(track, thumb, waterId) {
    let isDragging = false;

    const handleDragStart = (e) => {
      if (!isSliderActive) return;
      playClickSound();
      waterSound.play();
      isDragging = true;
      thumb.style.cursor = "grabbing";
      document.body.style.cursor = "grabbing";
    };

    const handleDragEnd = () => {
      if (isDragging) {
        isDragging = false;
        thumb.style.cursor = "grab";
        document.body.style.cursor = "default";
        waterSound.pause();
      }
    };

    const handleDragMove = (e) => {
      if (!isDragging) return;

      e.preventDefault();

      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      if (clientY === undefined) return;

      const trackRect = track.getBoundingClientRect();
      const offsetY = clientY - trackRect.top;

      let newY = trackRect.height - offsetY;
      let percentage = (newY / trackRect.height) * 100;
      percentage = Math.max(0, Math.min(100, percentage));

      // Adjust percentage to account for the non-fillable top and bottom parts of the beaker
      let adjustedPercentage = percentage * 0.89;
      if (waterId === "#screen3 .water") {
        adjustedPercentage = percentage * 0.89; // Consistent fill for screen3
      }

      thumb.style.bottom = `calc(${percentage}% - ${thumb.offsetHeight / 2}px)`;
      document.querySelector(waterId).style.height = adjustedPercentage + "%";
      waterLevel = adjustedPercentage;
    };

    thumb.addEventListener("mousedown", handleDragStart);
    document.addEventListener("mouseup", handleDragEnd);
    document.addEventListener("mousemove", handleDragMove);

    thumb.addEventListener("touchstart", handleDragStart, { passive: false });
    document.addEventListener("touchend", handleDragEnd);
    document.addEventListener("touchmove", handleDragMove, { passive: false });
  }

  setupCustomSlider(
    document.getElementById("slider-track-3"),
    document.getElementById("slider-thumb-3"),
    "#screen3 .water"
  );
  setupCustomSlider(
    document.getElementById("slider-track-question"),
    document.getElementById("slider-thumb-question"),
    "#question-screen .water"
  );

  // Initial setup
  window.addEventListener("resize", handleScaling);
  handleScaling();
  updateTexts();
  showScreen("screen1");
});
