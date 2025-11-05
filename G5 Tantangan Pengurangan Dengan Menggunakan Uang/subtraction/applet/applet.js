// MAPS
if (sessionStorage.getItem("additionCompleted") !== "true") {
  window.location.href = "../index.html";
}
sessionStorage.removeItem("additionCompleted");
const RCmap = {
  oColumn: ".right-panel .col-5",
  tColumn: ".right-panel .col-4",
  hColumn: ".right-panel .col-3",
  thColumn: ".right-panel .col-2",
  tthColumn: ".right-panel .col-1",
  num1Row: ".left-panel .row-num1",
  num2Row: ".left-panel .row-num2",
  resultRow: ".right-panel .row-result",
  rightRowHeader: ".right-panel .row-header",
  rightRowCarry: ".right-panel .row-carry",
  rightRowLine: ".right-panel .row-line",
  rightRowResult: ".right-panel .row-result",
  rightRowNum1: ".right-panel .row-num1",
  rightRowNum2: ".right-panel .row-num2",
};
const resultRow = {
  o: ".right-panel .row-result.o-color",
  t: ".right-panel .row-result.t-color",
  h: ".right-panel .row-result.h-color",
  th: ".right-panel .row-result.th-color",
  tth: ".right-panel .row-result.tth-color",
};
const carryRow = {
  o: ".right-panel .row-carry.o-color",
  t: ".right-panel .row-carry.t-color",
  h: ".right-panel .row-carry.h-color",
  th: ".right-panel .row-carry.th-color",
  tth: ".right-panel .row-carry.tth-color",
};
const topRow = {
  o: ".right-panel .row-num1.o-color",
  t: ".right-panel .row-num1.t-color",
  h: ".right-panel .row-num1.h-color",
  th: ".right-panel .row-num1.th-color",
  tth: ".right-panel .row-num1.tth-color",
};

// IMPORTS
const highlightBox = document.getElementById("highlight-box");
const addButton = document.querySelector("#highlight-box>button");
const q = document.querySelector.bind(document);
const mcqContainer = document.getElementById("mcq-container");
const mainContainer = document.querySelector(".main-container");
const bigQuestion = document.getElementById("big-question");
const facts = document.getElementById("facts");

let o1,
  o2,
  o3,
  h1,
  h2,
  h3,
  t1,
  t2,
  t3,
  th1,
  th2,
  th3,
  tt1,
  tt2,
  tt3,
  oBorrow,
  tBorrow,
  hBorrow,
  thBorrow,
  ttBorrow,
  oCorrect,
  tCorrect,
  hCorrect,
  thCorrect,
  ttCorrect,
  oFinal,
  tFinal,
  hFinal,
  thFinal,
  ttFinal;
let questionIndex = 0,
  currentQuestion = null,
  answer,
  templateDataMCQ = null;

function getDataFromQuestion() {
  currentQuestion = firstStageQuestions[questionIndex].numbers;
  [tt1, th1, h1, t1, o1] = currentQuestion[0].toString().split("").map(Number);
  [tt2, th2, h2, t2, o2] = currentQuestion[1].toString().split("").map(Number);
  answer = currentQuestion[0] - currentQuestion[1];
  [tt3, th3, h3, t3, o3] = answer.toString().split("").map(Number);

  oBorrow = Number(o1 < o2);
  tBorrow = Number(t1 - oBorrow < t2);
  hBorrow = Number(h1 - tBorrow < h2);
  thBorrow = Number(th1 - hBorrow < th2);
  ttBorrow = Number(tt1 - thBorrow < tt2);
  oCorrect = o1;
  tCorrect = t1 - oBorrow;
  hCorrect = h1 - tBorrow;
  thCorrect = th1 - hBorrow;
  ttCorrect = tt1 - thBorrow;

  oFinal = o1 + oBorrow * 10;
  tFinal = t1 + tBorrow * 10 - oBorrow;
  hFinal = h1 + hBorrow * 10 - tBorrow;
  thFinal = th1 + thBorrow * 10 - hBorrow;
  ttFinal = tt1 + ttBorrow * 10 - thBorrow;
  templateDataMCQ = {
    answer,
    o1,
    o2,
    o3,
    h1,
    h2,
    h3,
    t1,
    t2,
    t3,
    th1,
    th2,
    th3,
    tt1,
    tt2,
    tt3,
    oBorrow,
    tBorrow,
    hBorrow,
    thBorrow,
    ttBorrow,
    oCorrect,
    tCorrect,
    hCorrect,
    thCorrect,
    ttCorrect,
    oFinal,
    oFinal_minus: oFinal - 1,
    oFinal_plus: oFinal + 1,
    tFinal,
    tFinal_minus: tFinal - 1,
    tFinal_plus: tFinal + 1,
    hFinal,
    hFinal_minus: hFinal - 1,
    hFinal_plus: hFinal + 1,
    thFinal,
    thFinal_minus: thFinal - 1,
    thFinal_plus: thFinal + 1,
    ttFinal,
    ttFinal_minus: ttFinal - 1,
    ttFinal_plus: ttFinal + 1,
    o1x: o1,
    t1x: t1,
    h1x: h1,
    th1x: th1,
    tt1x: tt1,
    o2x: o2,
    t2x: t2,
    h2x: h2,
    th2x: th2,
    tt2x: tt2,
    o3x: o3,
    t3x: t3,
    h3x: h3,
    th3x: th3,
    tt3x: tt3,
    o3x_minus: o3 + 2,
    o3x_plus: o3 + 1,
    t3x_minus: t3 + 2,
    t3x_plus: t3 + 1,
    h3x_minus: h3 + 2,
    h3x_plus: h3 + 1,
    th3x_minus: th3 + 2,
    th3x_plus: th3 + 1,
    tt3x_minus: tt3 + 2,
    tt3x_plus: tt3 + 1,
  };
}
[addButton, nextButton].forEach((btn) =>
  btn.addEventListener("click", () => playSound("click"))
);
function fillNumbers() {
  const [num1, num2] = currentQuestion;
  const num1Digits = num1.toString().split("");
  const num2Digits = num2.toString().split("");

  const leftRow1Items = document.querySelectorAll(".left-panel .row-num1.item");
  const leftRow2Items = document.querySelectorAll(".left-panel .row-num2.item");

  num1Digits.forEach((digit, index) => {
    leftRow1Items[index].textContent = digit;
  });

  num2Digits.forEach((digit, index) => {
    leftRow2Items[index].textContent = digit;
  });

  const rightRow1Items = document.querySelectorAll(
    ".right-panel .row-num1.item"
  );
  const rightRow2Items = document.querySelectorAll(
    ".right-panel .row-num2.item"
  );

  num1Digits.forEach((digit, index) => {
    rightRow1Items[index].textContent = digit;
  });

  num2Digits.forEach((digit, index) => {
    rightRow2Items[index].textContent = digit;
  });
}

function showRC(q, show) {
  if (show) {
    document
      .querySelectorAll(q)
      .forEach((el) => el.classList.remove("text-transparent"));
  } else {
    document
      .querySelectorAll(q)
      .forEach((el) => el.classList.add("text-transparent"));
  }
}
function showAddButton(show = true) {
  const display = show ? "flex" : "none";
  document.querySelector("#highlight-box>button").style.display = display;
}
function popInNumber(q, text) {
  const container = document.querySelector(q);
  container.innerHTML = `<span style="display: inline-block;">${text}</span>`;
  const span = container.querySelector("span");

  span.animate(
    [
      { opacity: 0, transform: "scale(0)" },
      { opacity: 1, transform: "scale(1)" },
    ],
    {
      duration: 300,
      easing: "ease-out",
      fill: "forwards",
    }
  );
}
function popInResult(tag, num) {
  const q = resultRow[tag];
  popInNumber(q, num);
}
function loadMcqIn(mcqId, cb, onCorrect) {
  showTextWithTag("mcqIn");
  nextButton.disabled = true;
  loadMcq(mcqId, onCorrect);
  mcqContainer.style.display = "flex";
  nextButton.onclick = () => {
    mcqContainer.style.display = "none";
    cb?.();
  };
}

function loadMcq(mcqId, onCorrect) {
  const templateData = templateDataMCQ;
  const questionEl = document.getElementById("mcq-question");
  const optionsEl = document.getElementById("mcq-options");
  const feedbackEl = document.getElementById("bottom-statement");

  const mcq = mcqData[mcqId];

  if (!mcq) {
    console.error(`Error: MCQ with ID "${mcqId}" not found.`);
    return;
  }

  optionsEl.innerHTML = "";
  optionsEl.style.pointerEvents = "auto";

  const fillTemplate = (text) =>
    text.replace(/\{\{(\w+)\}\}/g, (_, key) => templateData[key] ?? "");

  questionEl.innerHTML = fillTemplate(mcq.question);

  mcq.options.forEach((optionText, index) => {
    const optionDiv = document.createElement("div");
    optionDiv.classList.add("option");
    optionDiv.textContent = fillTemplate(optionText);

    optionDiv.addEventListener("click", () => {
      let feedbackText = "";
      if (index === mcq.answer_index) {
        optionsEl.style.pointerEvents = "none";
        optionDiv.classList.add("correct");
        feedbackText = mcq.correct_feedback;
        playSound("correct");
        onCorrect?.();
        nextButton.disabled = false;
      } else {
        optionDiv.classList.add("wrong");
        feedbackText = mcq.wrong_feedback;
        playSound("wrong");
      }

      if (feedbackEl) {
        feedbackEl.textContent = feedbackText;
      }
    });

    optionsEl.appendChild(optionDiv);
  });
}
function highlightColumnBorder(query) {
  borderGreen(false);
  const elements = document.querySelectorAll(`${query}`);
  const box = document.getElementById("highlight-box");
  box.style.display = "block";

  const firstRect = elements[0].getBoundingClientRect();
  const lastRect = elements[elements.length - 1].getBoundingClientRect();
  const left = firstRect.left;
  const top = firstRect.top;
  const right = firstRect.right;
  const bottom = lastRect.bottom;

  box.style.left = `${left}px`;
  box.style.top = `${top + scrollY}px`;
  box.style.width = `${right - left}px`;
  box.style.height = `${bottom - top}px`;
}

function unhighlightColumn() {
  const box = document.getElementById("highlight-box");
  box.style.display = "none";
}

function highlightRowBorder(query, heightFraction = 1) {
  borderGreen(false);
  const elements = document.querySelectorAll(`${query}`);
  const box = document.getElementById("highlight-box");
  box.style.display = "block";

  const firstRect = elements[0].getBoundingClientRect();
  const lastRect = elements[elements.length - 1].getBoundingClientRect();
  const left = firstRect.left;
  const top = firstRect.top;
  const right = lastRect.right;
  const bottom = firstRect.bottom;
  const offset = 1;
  box.style.left = `${left - offset}px`;
  box.style.top = `${top - offset}px`;
  box.style.width = `${right - left + 2 * offset}px`;
  box.style.height = `${(bottom - top) / heightFraction + 2 * offset}px`;
}

function borderGreen(bool) {
  if (bool) {
    document.querySelector("#highlight-box").classList.add("green-box");
  } else {
    document.querySelector("#highlight-box").classList.remove("green-box");
  }
}
function borderRed(bool) {
  if (bool) {
    document.querySelector("#highlight-box").classList.add("red-box");
  } else {
    document.querySelector("#highlight-box").classList.remove("red-box");
  }
}
function vibrateElementWithTag(tag, bool) {
  vibrateElement(document.querySelector(`${tag}`), bool);
}
function toggleRightPanelStyle(isSimplified) {
  const rightPanelContainer = document.querySelector(
    ".right-panel .addition-container"
  );

  if (rightPanelContainer) {
    if (isSimplified) {
      rightPanelContainer.classList.add("simplified-mode");
    } else {
      rightPanelContainer.classList.remove("simplified-mode");
    }
  }
}
// --- NEW FIRST STAGE ---
function highlightText(fullText, partsToHighlight, className) {
  let highlightedText = fullText;
  partsToHighlight.forEach((part) => {
    const regex = new RegExp(
      part.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"),
      "g"
    );
    highlightedText = highlightedText.replace(
      regex,
      `<span class="${className}">${part}</span>`
    );
  });
  return highlightedText;
}

function firstStage_step1() {
  mainContainer.classList.add("first-stage");
  const currentProblem = firstStageQuestions[questionIndex];
  bigQuestion.innerHTML = currentProblem.question;
  document.getElementById("addition-word-problem").style.display = "none";
  facts.innerHTML = "";
  facts.style.display = "none";
  showTextWithTag("first_stage_1");
  nextButton.disabled = false;
  showFtue(nextButton);
  nextButton.onclick = firstStage_step2;
}

function firstStage_step2() {
  facts.style.display = "flex";
  hideFtue();
  const currentProblem = firstStageQuestions[questionIndex];
  bigQuestion.innerHTML = highlightText(
    currentProblem.question,
    currentProblem.given,
    "yellow-bg"
  );

  facts.innerHTML = "";
  currentProblem.givenFacts.forEach((fact) => {
    facts.innerHTML += `<span>${fact}</span>`;
  });

  showTextWithTag("first_stage_2");
  showFtue(nextButton);
  nextButton.onclick = firstStage_step3;
}

function firstStage_step3() {
  hideFtue();
  const currentProblem = firstStageQuestions[questionIndex];
  let highlightedQuestion = highlightText(
    currentProblem.question,
    currentProblem.toFind,
    "green-bg"
  );
  bigQuestion.innerHTML = highlightedQuestion;

  facts.innerHTML = "";
  currentProblem.toFindFacts.forEach((fact) => {
    facts.innerHTML += `<span>${fact}</span>`;
  });

  showTextWithTag("first_stage_3");
  showFtue(nextButton);
  nextButton.onclick = firstStage_stepMcq;
}
function firstStage_stepMcq() {
  hideFtue();
  facts.innerHTML = `
    <div id="step3-mcq-container">
      <p id="step3-mcq-question">Should we add or subtract to solve this question?</p>
      <div id="step3-mcq-options">
        <div class="option">Add</div>
        <div class="option">Subtract</div>
      </div>
    </div>
  `;

  const options = document.querySelectorAll("#step3-mcq-options .option");
  options.forEach((option, index) => {
    option.addEventListener("click", () => {
      // "Subtract" is the correct option at index 1
      if (index === 1) {
        option.classList.add("correct");
        playSound("correct");
        nextButton.disabled = false;
        showFtue(nextButton);
        // Disable further clicks on options
        document.querySelector("#step3-mcq-options").style.pointerEvents =
          "none";
      } else {
        option.classList.add("wrong");
        playSound("wrong");
      }
    });
  });

  nextButton.disabled = true;
  nextButton.onclick = firstStage_step4;
}

function firstStage_step4() {
  hideFtue();

  bigQuestion.style.display = "none";
  facts.style.display = "none";

  const additionWordProblem = document.getElementById("addition-word-problem");
  if (additionWordProblem) {
    additionWordProblem.style.display = "flex";

    const currentProblem = firstStageQuestions[questionIndex];
    const lines = additionWordProblem.querySelectorAll(".awp-line");

    if (lines.length >= 4) {
      const fact1Text = currentProblem.givenFacts[1].split(":")[0].trim();
      lines[0].querySelector(".awp-text").textContent = fact1Text;
      lines[0].querySelector(".awp-number").textContent =
        currentProblem.numbers[0];

      const fact2Text = currentProblem.givenFacts[2].split(":")[0].trim();
      lines[1].querySelector(".awp-text").textContent = fact2Text;
      lines[1].querySelector(".awp-number").textContent =
        currentProblem.numbers[1] + " -";

      const toFindText = currentProblem.toFindFacts[1];
      lines[3].querySelector(".awp-text").textContent = toFindText;
    }
  }

  showTextWithTag("first_stage_4");
  nextButton.disabled = false;
  showFtue(nextButton);
  nextButton.onclick = startMainApplet;
}

function startMainApplet() {
  hideFtue();
  mainContainer.classList.remove("first-stage");
  stage0();
}
// --- END OF NEW FIRST STAGE ---

function stage0() {
  showTextWithTag("start");
  nextButton.disabled = false;
  showFtue(nextButton);
  nextButton.onclick = stage1;
  document.querySelector(".left-panel .addition-container").style.display =
    "none";
  toggleRightPanelStyle(true);
  stage1();
}
function stage1() {
  toggleRightPanelStyle(false);
  playSound("click");
  showTextWithTag("after_split");
  hideFtue();
  // showFtue(nextButton);
  highlightColumnBorder(RCmap.oColumn);
  setTimeout(() => {
    showAddButton(true);
    showFtue(addButton);
  }, 500);
  nextButton.disabled = true;
  if (oBorrow) {
    addButton.onclick = onesMinusClickBorrow;
  } else {
    addButton.onclick = finalAddOnes;
  }
  showTextWithTag("ones_1");
  nextButton.disabled = true;
}
function stage2() {
  playSound("click");
  hideFtue();
  showRC(RCmap.rightRowNum1, true);
  showTextWithTag("split_number2");
  highlightRowBorder(RCmap.num2Row);
  highlightBox.classList.add("clickable");
  highlightBox.onclick = stage3;
  setTimeout(() => {
    showFtue(highlightBox, true);
  }, 500);
}
function stage3() {
  playSound("click");
  showTextWithTag("after_split");
  hideFtue();
  showRC(RCmap.rightRowNum2, true);
  showRC(RCmap.rightRowLine, true);
  nextButton.disabled = false;
  highlightBox.classList.remove("clickable");
  highlightBox.onclick = null;
  unhighlightColumn();
  showFtue(nextButton);
  nextButton.onclick = onesMcq1;
}
function onesMcq1() {
  hideFtue();
  loadMcqIn("ones_place", () => {
    highlightColumnBorder(RCmap.oColumn);
    setTimeout(() => {
      showAddButton(true);
      showFtue(addButton);
    }, 500);
    nextButton.disabled = true;
    if (oBorrow) {
      addButton.onclick = onesMinusClickBorrow;
    } else {
      addButton.onclick = finalAddOnes;
    }
    showTextWithTag("ones_1");
  });
}
function onesMinusClickBorrow() {
  playSound("wrong");
  vibrateElement(highlightBox, true);
  splitOverlay("ones_mcq1");
  hideFtue();
  borderRed(true);
  showAddButton(false);
  setTimeout(() => {
    loadMcqIn("ones_borrow", () => {
      const el = selectTopRowCell("t");
      showFtue(el);
      el.onclick = onClickingTenTopCell;
      nextButton.disabled = true;
      splitOverlay(false);
      showTextWithTag("split_ones");
      vibrateElement(highlightBox, false);
    });
  }, 100);
}
function onClickingTenTopCell() {
  showTextWithTag("splitted_for_ones");
  onClickingNextCell("t");
  q(topRow.t).onclick = null;
  nextButton.disabled = false;
  nextButton.onclick = howManyOnes;
}
function howManyOnes() {
  splitOverlay("ones_mcq2");
  hideFtue();
  loadMcqIn(
    "num_at_ones",
    () => {
      showAddButton();
      showFtue(addButton);
      addButton.onclick = finalAddOnes;
      borderRed(false);
      nextButton.disabled = true;
      splitOverlay(false);
      showTextWithTag("enough_ones");
    },
    () => {
      popInNumber(carryRow.t, tCorrect);
      popInNumber(topRow.o, oFinal);
    }
  );
}
function finalAddOnes() {
  hideFtue();
  showAddButton(false);
  loadMcqIn(
    "final_add_ones",
    () => {},
    () => {
      nextButton.disabled = false;
      showAddButton(false);
      showFtue(nextButton);
      borderGreen(true);
      nextButton.onclick = moveToTens;
      showTextWithTag("subtracted_ones");
      popInNumber(resultRow.o, o3);
    }
  );
}

function moveToTens() {
  mcqContainer.style.display = "none";
  hideFtue();
  unhighlightColumn();
  borderGreen(false);
  showTextWithTag("tens_1");
  highlightColumnBorder(RCmap.tColumn);
  setTimeout(() => {
    showAddButton(true);
    showFtue(addButton);
  }, 500);
  nextButton.disabled = true;
  if (tBorrow) {
    addButton.onclick = tensMinusClickBorrow;
  } else {
    addButton.onclick = finalAddTens;
  }
}

function tensMinusClickBorrow() {
  playSound("wrong");
  vibrateElement(highlightBox, true);
  splitOverlay("tens_mcq1");
  hideFtue();
  borderRed(true);
  showAddButton(false);
  setTimeout(() => {
    loadMcqIn("tens_borrow", () => {
      const el = selectTopRowCell("h");
      showFtue(el);
      el.onclick = onClickingHundredTopCell;
      nextButton.disabled = true;
      splitOverlay(false);
      showTextWithTag("split_tens");
      vibrateElement(highlightBox, false);
    });
  }, 100);
}

function onClickingHundredTopCell() {
  showTextWithTag("splitted_for_tens");
  onClickingNextCell("h");
  q(topRow.h).onclick = null;
  nextButton.disabled = false;
  nextButton.onclick = howManyTens;
}

function howManyTens() {
  splitOverlay("tens_mcq2");
  hideFtue();
  loadMcqIn(
    "num_at_tens",
    () => {
      showAddButton();
      showFtue(addButton);
      addButton.onclick = finalAddTens;
      borderRed(false);
      nextButton.disabled = true;
      splitOverlay(false);
      showTextWithTag("enough_tens");
    },
    () => {
      popInNumber(carryRow.h, hCorrect);
      const tensTopRow = document.querySelector(topRow.t);
      if (tensTopRow.classList.contains("strike-through")) {
        popInNumber(carryRow.t, tFinal);
      } else {
        popInNumber(topRow.t, tFinal);
      }
    }
  );
}

function finalAddTens() {
  hideFtue();
  showAddButton(false);
  loadMcqIn(
    "final_add_tens",
    () => {},
    () => {
      nextButton.disabled = false;
      showAddButton(false);
      showFtue(nextButton);
      borderGreen(true);
      nextButton.onclick = moveToHundreds;
      showTextWithTag("subtracted_tens");
      popInNumber(resultRow.t, t3);
    }
  );
}

function moveToHundreds() {
  mcqContainer.style.display = "none";
  hideFtue();
  unhighlightColumn();
  borderGreen(false);
  showTextWithTag("hundreds_1");
  highlightColumnBorder(RCmap.hColumn);
  setTimeout(() => {
    showAddButton(true);
    showFtue(addButton);
  }, 500);
  nextButton.disabled = true;
  if (hBorrow) {
    addButton.onclick = hundredsMinusClickBorrow;
  } else {
    addButton.onclick = finalAddHundreds;
  }
}

function hundredsMinusClickBorrow() {
  playSound("wrong");
  vibrateElement(highlightBox, true);
  splitOverlay("hundreds_mcq1");
  hideFtue();
  borderRed(true);
  showAddButton(false);
  setTimeout(() => {
    loadMcqIn("hundreds_borrow", () => {
      const el = selectTopRowCell("th");
      showFtue(el);
      el.onclick = onClickingThousandTopCell;
      nextButton.disabled = true;
      splitOverlay(false);
      showTextWithTag("split_hundreds");
      vibrateElement(highlightBox, false);
    });
  }, 100);
}

function onClickingThousandTopCell() {
  showTextWithTag("splitted_for_hundreds");
  onClickingNextCell("th");
  q(topRow.th).onclick = null;
  nextButton.disabled = false;
  nextButton.onclick = howManyHundreds;
}

function howManyHundreds() {
  splitOverlay("hundreds_mcq2");
  hideFtue();
  loadMcqIn(
    "num_at_hundreds",
    () => {
      showAddButton();
      showFtue(addButton);
      addButton.onclick = finalAddHundreds;
      borderRed(false);
      nextButton.disabled = true;
      splitOverlay(false);
      showTextWithTag("enough_hundreds");
    },
    () => {
      popInNumber(carryRow.th, thCorrect);
      const hundredsTopRow = document.querySelector(topRow.h);
      if (hundredsTopRow.classList.contains("strike-through")) {
        popInNumber(carryRow.h, hFinal);
      } else {
        popInNumber(topRow.h, hFinal);
      }
    }
  );
}

function finalAddHundreds() {
  hideFtue();
  showAddButton(false);
  loadMcqIn(
    "final_add_hundreds",
    () => {},
    () => {
      nextButton.disabled = false;
      showAddButton(false);
      showFtue(nextButton);
      borderGreen(true);
      nextButton.onclick = moveToThousands;
      showTextWithTag("subtracted_hundreds");
      popInNumber(resultRow.h, h3);
    }
  );
}

function moveToThousands() {
  mcqContainer.style.display = "none";
  hideFtue();
  unhighlightColumn();
  borderGreen(false);
  showTextWithTag("thousands_1");
  highlightColumnBorder(RCmap.thColumn);
  setTimeout(() => {
    showAddButton(true);
    showFtue(addButton);
  }, 500);
  nextButton.disabled = true;
  if (thBorrow) {
    addButton.onclick = thousandsMinusClickBorrow;
  } else {
    addButton.onclick = finalAddThousands;
  }
}

function thousandsMinusClickBorrow() {
  playSound("wrong");
  vibrateElement(highlightBox, true);
  splitOverlay("thousands_mcq1");
  hideFtue();
  borderRed(true);
  showAddButton(false);
  setTimeout(() => {
    loadMcqIn("thousands_borrow", () => {
      const el = selectTopRowCell("tth");
      showFtue(el);
      el.onclick = onClickingTenThousandTopCell;
      nextButton.disabled = true;
      splitOverlay(false);
      showTextWithTag("split_thousands");
      vibrateElement(highlightBox, false);
    });
  }, 100);
}

function onClickingTenThousandTopCell() {
  showTextWithTag("splitted_for_thousands");
  onClickingNextCell("tth");
  q(topRow.tth).onclick = null;
  nextButton.disabled = false;
  nextButton.onclick = howManyThousands;
}

function howManyThousands() {
  splitOverlay("thousands_mcq2");
  hideFtue();
  loadMcqIn(
    "num_at_thousands",
    () => {
      showAddButton();
      showFtue(addButton);
      addButton.onclick = finalAddThousands;
      borderRed(false);
      nextButton.disabled = true;
      splitOverlay(false);
      showTextWithTag("enough_thousands");
    },
    () => {
      popInNumber(carryRow.tth, ttCorrect);
      const thousandsTopRow = document.querySelector(topRow.th);
      if (thousandsTopRow.classList.contains("strike-through")) {
        popInNumber(carryRow.th, thFinal);
      } else {
        popInNumber(topRow.th, thFinal);
      }
    }
  );
}

function finalAddThousands() {
  hideFtue();
  showAddButton(false);
  loadMcqIn(
    "final_add_thousands",
    () => {},
    () => {
      nextButton.disabled = false;
      showAddButton(false);
      showFtue(nextButton);
      borderGreen(true);
      nextButton.onclick = moveToTenThousands;
      showTextWithTag("subtracted_thousands");
      popInNumber(resultRow.th, th3);
    }
  );
}

function moveToTenThousands() {
  mcqContainer.style.display = "none";
  hideFtue();
  unhighlightColumn();
  borderGreen(false);
  showTextWithTag("ten_thousands_1");
  highlightColumnBorder(RCmap.tthColumn);
  setTimeout(() => {
    showAddButton(true);
    showFtue(addButton);
  }, 500);
  nextButton.disabled = true;
  addButton.onclick = finalAddTenThousands;
}

function finalAddTenThousands() {
  hideFtue();
  showAddButton(false);
  loadMcqIn(
    "final_add_ten_thousands",
    () => {},
    () => {
      nextButton.disabled = false;
      showAddButton(false);
      showFtue(nextButton);
      borderGreen(true);
      nextButton.onclick = endStage;
      showTextWithTag("subtracted_ten_thousands");
      popInNumber(resultRow.tth, tt3);
    }
  );
}

function endStage() {
  mcqContainer.style.display = "none";
  document.querySelector(".left-panel .addition-container").style.display =
    "grid";
  nextButton.disabled = false;
  hideFtue();
  unhighlightColumn();
  highlightRowBorder(".right-panel .row-result");
  borderGreen(true);
  const leftResultItems = document.querySelectorAll(
    ".left-panel .row-result.item"
  );
  const answerDigits = answer.toString().split("");
  answerDigits.forEach((digit, index) => {
    if (leftResultItems[index]) {
      leftResultItems[index].textContent = digit;
    }
  });
  showTextWithTag("final_summary");
  templateDataMCQ.answer = answer;

  nextButton.onclick = finalSummaryStage;
}

function finalSummaryStage() {
  unhighlightColumn();
  hideFtue();
  mainContainer.classList.add("first-stage");
  document.querySelector(".left-panel").style.display = "none";
  document.querySelector(".right-panel").style.display = "none";
  document.querySelector(".question-panel").style.display = "flex";
  document.getElementById("big-question").style.display = "none";
  document.getElementById("facts").style.display = "none";

  const additionWordProblem = document.getElementById("addition-word-problem");
  additionWordProblem.style.display = "flex";

  const currentProblem = firstStageQuestions[questionIndex];
  const lines = additionWordProblem.querySelectorAll(".awp-line");

  if (lines.length >= 4) {
    // const fact1Text = currentProblem.givenFacts[1].split(":")[0].trim();
    // lines[0].querySelector(".awp-text").textContent = fact1Text + " =";
    // lines[0].querySelector(".awp-number").textContent =
    //   currentProblem.numbers[0];

    // const fact2Text = currentProblem.givenFacts[2].split(":")[0].trim();
    // lines[1].querySelector(".awp-text").textContent = fact2Text + " =";
    // lines[1].querySelector(".awp-number").textContent =
    //   "- " + currentProblem.numbers[1];

    // const toFindText = currentProblem.toFindFacts[1];
    // lines[3].querySelector(".awp-text").textContent = toFindText + " =";

    const answerBox = lines[3].querySelector(".awp-box");
    if (answerBox) {
      answerBox.textContent = answer;
      answerBox.style.border = "none";
    }
  }

  showTextWithTag("conclude");

  playSound("congrats");
  confettiBurst();
  // nextButton.disabled = true;
  // nextButton.textContent = buttonText.try_new;
  nextButton.onclick = finalScreen;
}
function finalScreen() {
  triggerFullScreenOverlay(true);
  overlayButton.onclick = () => {
    sessionStorage.removeItem("additionCompleted");
    location = "../index.html";
  };
}
// finalScreen()
function onClickingNextCell(tag) {
  playSound("click");
  hideFtue();
  const topRowEl = document.querySelector(topRow[tag]);
  const carryRowEl = document.querySelector(carryRow[tag]);
  const originalValue = parseInt(topRowEl.textContent);

  topRowEl.classList.add("strike-through");

  if (originalValue > 0) {
    const remainingValue = originalValue - 1;
    carryRowEl.innerHTML = `${remainingValue} + 1`;
  } else {
    carryRowEl.innerHTML = "0 + 0";
  }
}

function selectTopRowCell(tag) {
  const el = document.querySelector(topRow[tag]);
  el.classList.add("selected");
  return el;
}

function splitOverlay(tag) {
  const mcqOverlay = document.getElementById("mcq-overlay");
  if (!tag) {
    mcqOverlay.classList.remove("split");
    return;
  }
  const finalText = fillPlaceholders(textPool[tag], templateDataMCQ);
  const leftInfo = document.getElementById("left-info");
  leftInfo.innerHTML = finalText;
  mcqOverlay.classList.add("split");
}

function initiate() {
  getDataFromQuestion();
  fillNumbers();
  fillHeaders();
  firstStage_step1();
  // firstStage_step2();
  // firstStage_step3();
  firstStage_step4();
}

initiate();

function showTextWithTag(tag, colorClass) {
  const finalText = fillPlaceholders(textPool[tag], templateDataMCQ);
  showText(finalText, colorClass);
}
function fillHeaders() {
  const headerElements = document.querySelectorAll(".right-panel .row-header");
  headerElements.forEach((element, index) => {
    if (headerArray[index]) {
      element.textContent = headerArray[index];
    }
  });
}

function loadNextQuestion() {
  questionIndex++;

  if (questionIndex >= firstStageQuestions.length) {
    triggerFullScreenOverlay(true);
    nextButton.disabled = true;
    return;
  }

  document.querySelectorAll(".row-result").forEach((cell) => {
    cell.textContent = "";
    cell.innerHTML = "";
  });

  document.querySelectorAll(".row-carry").forEach((cell) => {
    cell.textContent = "";
    cell.innerHTML = "";
  });
  document
    .querySelectorAll(".strike-through")
    .forEach((el) => el.classList.remove("strike-through"));
  document
    .querySelectorAll(".selected")
    .forEach((el) => el.classList.remove("selected"));
  nextButton.textContent = buttonText.next;

  unhighlightColumn();
  hideFtue();

  document.querySelector(".left-panel").style.display = "flex";
  document.querySelector(".right-panel").style.display = "flex";

  initiate();
}
