let progress = 0;
let stepQ = [];

function atStep0() {
  unitWidget.style.display = "block";
  tenWidget.style.display = "block";
  updateInstructions("reminder");
  toggleFullScreenOverlay(false);
  playAudio("click")
}

function atStep1() {
  updateInstructions("plus");
  nextButton.disabled = true;
  plusBtn.style.pointerEvents = "auto";
  plusBtn.classList.add("pulse-highlight");
  plusBtn.addEventListener("click", clickPLusFirstTime, { once: true });
  prevButton.disabled = false;
}
function clickPLusFirstTime() {
  plusBtn.style.pointerEvents = "none";
  plusBtn.classList.remove("pulse-highlight");
  plusBtn.removeEventListener("click", clickPLusFirstTime);
  nextButton.disabled= false;
}
function toMcq(){
  showMCQ(true);
  nextButton.disabled = true;
  updateInstructions("mcq");
}
function afterMcq(){
  showMCQ(false);
  nextButton.disabled = true;
  showDirArrow("left");
  showStatement(-1);
  updateInstructions("move_left");
  setCavePose("Normal")
  prevButton.disabled = false;
}
function whenHits10() {
  updateInstructions("pink_unlike");
  setCavePose("Thinking");
  wiggle()
  nextButton.disabled = false;
}
function reverse10() {
  wiggle(false)
  unitNumberTab.classList.remove("outlined");
  nextButton.disabled = true;
}
startButton.addEventListener("click", atStep0);
startButton.textContent = T.button_texts.next;
stepQ.push(atStep1);
stepQ.push(toMcq);
stepQ.push(afterMcq);
stepQ.push(after20MoveRight)
stepQ.push(after20MoveLeft)

function handleNext() {
  playAudio("click")
  if (progress < stepQ.length) {
    stepQ[progress]();
    progress++;
    updateStepCounter(progress);
  }
}
nextButton.addEventListener("click", handleNext);

function showStatement(i) {
  const display = i === 0 ? "block" : "flex";
  const elements = document.querySelectorAll(`#statements>div`);

  elements.forEach((element, index) => {
    if (index === i) {
      element.style.display = display;
    } else {
      element.style.display = "none";
    }
  });
}

function showComment(tag) {
  const commentEl = document.querySelector(".comment");
  showStatement(0);
  commentEl.innerHTML = T.comments[tag];
}
function showNumberText(num){
  playNumber(tenCount * 10 + unitCount);
  const text = numberToText[num]
  updateInstructionFromNumber(num)
  showStatement(1);
  const numberText = document.querySelector("#numberText>p");
  numberText.textContent = text
}


function after20MoveRight() {
  showStatement(2);
  updateInstructions("move_right");
  showDirArrow("right")
  nextButton.disabled = true;
}
function after20MoveLeft() {
  showDirArrow("left")
  showStatement(-1);
  updateInstructions("pink_unlike");
  setCavePose("Thinking");
  nextButton.disabled = true;
}

function wiggle(bool=true){
  if(bool){
    vibrateElement(unitInnerCard)
    vibrateElement(unitNumberTab)
    unitNumberTab.classList.add("outlined");
    setTimeout(()=>{vibrateElement(unitSquaresContainer)}, 100)
  }else{
    vibrateElement(unitInnerCard, false)
    vibrateElement(unitNumberTab, false)
    vibrateElement(unitSquaresContainer, false)
    unitNumberTab.classList.remove("outlined");
  }
}


function initMCQ(mcqData) {
  const container = document.getElementById("mcqContainer");
  const optionElements = container.querySelectorAll(".option");
  optionElements.forEach((el, index) => {
    el.textContent = mcqData.options[index];
    el.classList.remove("correct", "wrong");
    el.addEventListener("click", () => {
      prevButton.disabled = true;
      showComment(mcqData.feedback[index]);
      optionElements.forEach((opt) => opt.classList.remove("correct", "wrong"));
      if (index === mcqData.answer) {
        playAudio("correct");
        el.classList.add("correct");
        optionElements.forEach((opt) =>
          opt.style.pointerEvents = "none"
        );
        setCavePose("Happy")
        nextButton.disabled = false;
      } else {
        playAudio("wrong");
        el.classList.add("wrong");
        setCavePose("Sad")
      }
    });
  });
}
function showMCQ(show){
  const container = document.getElementById("mcqContainer");
  if(!show){
    container.style.display = "none";
    boxContainer.style.display = "flex";
    return;
  }
  container.style.display = "flex";
  boxContainer.style.display = "none";
}
initMCQ(mcqData);

function freshenUpMcq(){
  showStatement(-1);
  nextButton.disabled = true;
  const container = document.getElementById("mcqContainer");
  const optionElements = container.querySelectorAll(".option");
  optionElements.forEach((el, index) => {
    el.classList.remove("correct", "wrong");
    el.style.pointerEvents = "auto";
  })
}

function playNumber(num) {
  const lang = flag === "ENGLISH" ? "English" : "Indo";
  const audioUrl = `sound${lang}/${num}.mp3`;

  const audio = new Audio(audioUrl);
  audio.play();
}

document.querySelector("#numberText .speaker-btn").addEventListener("click", () => {
  playNumber(tenCount * 10 + unitCount);
});

const unitPill = document.querySelector("#unit-widget .pill-badge");
const tenPill = document.querySelector("#ten-widget .pill-badge");
unitPill.textContent = tags.ones;
tenPill.textContent = tags.tens;