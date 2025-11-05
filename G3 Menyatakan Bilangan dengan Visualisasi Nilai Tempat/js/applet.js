const questions = [436, 319, 285, 572];
let questionIndex = 0;
let widgets = Array.from(document.querySelectorAll(".widget-container"));
let currentContainer = 0;
const tagMap = ["unit", "ten", "hundred"];
const submitButton = document.getElementById("submitButton");
submitButton.textContent = texts.button_texts.submit;
const completionOverlay = document.getElementById("activity-complete-overlay");
const startOverBtn = document.getElementById("start-over-btn");

function initiateQuestion() {
  if (questionIndex === 0) {
    setNextText("next");
  }
  resetContainers();
  document.getElementById("box-container").animate({ opacity: [0, 1] }, 500);
  commentElement.classList.remove("green", "red");
  updateStepCounter(questionIndex);
  document.querySelectorAll(".control-btn").forEach((btn) => {
    btn.disabled = false;
  });
  showStatement(-1);
  nextButton.disabled = true;
  submitButton.disabled = false;
  updateHeader("questionText");
  document.getElementById("numberInQuestion").textContent =
    questions[questionIndex];
}
initiateQuestion();

function onHitting10() {
  wiggle(tagMap[currentContainer]);
  setNextText("add_jar");
  nextButton.disabled = false;
  updateHeader(tagMap[currentContainer] + "_overflow");
}
function reverse10() {
  wiggle(tagMap[currentContainer], false);
  setNextText("next");
  nextButton.disabled = true;
  updateHeader(tagMap[currentContainer] + "_general");
}

function showWidgetContainer(i, show = true) {
  if (show) {
    widgets[i].style.display = "block";
  } else {
    widgets[i].style.display = "none";
  }
}
function showControlButtons(tag, show = true) {
  const btns = document.querySelectorAll(`#${tag}-widget .control-btn`);
  if (!show) {
    btns.forEach((btn) => {
      btn.classList.add("disabled");
    });
  } else {
    btns.forEach((btn) => {
      btn.classList.remove("disabled");
    });
  }
}
function showStatement(i) {
  const display = i === 0 ? "block" : "flex";
  const elements = document.querySelectorAll(`#statements>div`);

  elements.forEach((element, index) => {
    if (index === i) {
      element.style.display = display;
    } else {
      showCharHead(false);
      element.style.display = "none";
    }
  });
}

function showComment(tag) {
  showCharHead(true);
  const commentEl = document.querySelector(".comment");
  showStatement(0);
  commentEl.innerHTML = T.comments[tag];
}
function showCommentTextVersion(text) {
  const commentEl = document.querySelector(".comment");
  showStatement(0);
  commentEl.innerHTML = text;
}
function showNumberText(num, isLegit = true) {
  const text = spellNumber(num);
  // showStatement(1);
  const numberTextP = document.querySelector("#numberText>p");
  numberTextP.textContent = text + (isLegit ? "" : "?");
}

function wiggle(tag = "unit", bool = true) {
  const innerCard = document.querySelector(`#${tag}-widget .inner-card`);
  const numberTab = document.querySelector(`#${tag}-widget .number-tab`);
  const squaresContainer = document.querySelector(
    `#${tag}-widget .squares-container`
  );
  if (bool) {
    vibrateElement(innerCard);
    setTimeout(() => {
      vibrateElement(squaresContainer);
    }, 100);
    numberTab.classList.add("outlined");
    vibrateElement(numberTab);
  } else {
    vibrateElement(innerCard, false);
    vibrateElement(squaresContainer, false);
    numberTab.classList.remove("outlined");
    vibrateElement(numberTab, false);
  }
}
function checkAnswer() {
  const userAnswer = [countObject.hundred, countObject.ten, countObject.unit];
  const correctAnswer = questions[questionIndex]
    .toString()
    .padStart(3, "0")
    .split("")
    .map(Number);

  let correct = true;
  for (let i = 0; i < 3; i++) {
    if (userAnswer[i] !== correctAnswer[i]) {
      correct = false;
      widgets[i].classList.add("glow-widget");
    }
  }
  return correct;
}
submitButton.onclick = function () {
  const correct = checkAnswer();
  if (correct) {
    setKidPose("happy");
    playSound("correct");
    confettiBurst();
    showComment("correct");
    turnOffGlow();
    commentElement.classList.add("green");
    commentElement.classList.remove("red");
    submitButton.disabled = true;
    document.querySelectorAll(".control-btn").forEach((btn) => {
      btn.disabled = true;
    });

    // Check if this is the last question
    if (questionIndex === questions.length - 1) {
      // It is the last question, so show the completion overlay after a delay
      nextButton.disabled = true;
      const heading = document.querySelector(
        "#activity-complete-overlay .overlay-text h1"
      );
      const para = document.querySelector(
        "#activity-complete-overlay .overlay-text p"
      );
      heading.textContent = texts.overlay_heading;
      para.textContent = texts.overlay_final;
      setNextText("start_over"); // Update button text for clarity
      startOverBtn.textContent = texts.button_texts.start_over;
      setTimeout(() => {
        completionOverlay.classList.add("visible");
      }, 1500); // 1.5-second delay to let the user see the "correct" feedback
    } else {
      // It's not the last question, so enable the regular next button
      nextButton.disabled = false;
    }
  } else {
    setKidPose("sad");
    playSound("wrong");
    showComment("wrong");
    commentElement.classList.add("red");
  }
};
const turnOffGlow = function () {
  widgets.forEach((widget) => {
    widget.classList.remove("glow-widget");
  });
};

nextButton.onclick = function () {
  if (questionIndex === 0) {
    prevButton.disabled = false;
  }
  playSound("click");
  questionIndex = (questionIndex + 1) % questions.length;
  initiateQuestion();
};
prevButton.onclick = function () {
  if (questionIndex === 0) {
    return;
  } else if (questionIndex === 1) {
    prevButton.disabled = true;
  }
  playSound("click");
  questionIndex = questionIndex - 1;
  initiateQuestion();
};

function resetApplet() {
  // 1. Hide the completion overlay first
  if (completionOverlay) {
    completionOverlay.classList.remove("visible");
  }

  // 2. Reset the question index to the beginning
  questionIndex = 0;

  // 3. Reset containers and other states
  if (typeof resetContainers === "function") {
    resetContainers();
  }

  // 4. Reset applet state
  if (prevButton) {
    prevButton.disabled = true;
  }

  // 5. Show welcome slide and hide main content
  // Use setTimeout to ensure overlay animation completes first
  setTimeout(() => {
    const welcomeSlide = document.getElementById("welcomeSlide");
    const mainContent = document.getElementById("mainContent");
    if (welcomeSlide && mainContent) {
      welcomeSlide.classList.remove("hidden");
      mainContent.classList.add("hidden");
    }
  }, 100);
}

if (startOverBtn) {
  startOverBtn.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    resetApplet();
  });
}

function showCharHead(show) {
  const display = show ? "block" : "none";
  const charHead = document.querySelector("#charHead");
  charHead.style.display = display;
}

const textsBottoms = document.querySelectorAll(".text-display");
textsBottoms.forEach((text, i) => (text.textContent = tagsArray[2 - i]));
