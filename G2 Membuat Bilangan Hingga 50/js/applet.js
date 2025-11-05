let progress = 0;
let questionIndex=0
const toHide=[[0,1],[0,1],[3],[3]]
function atStep0() {
  playSound("click");
  unitWidget.style.display = "block";
  tenWidget.style.display = "block";
  submitButton.style.visibility = "visible";
  toggleFullScreenOverlay(false);
  reset()
}

function whenHits10() {
  updateInstructions("pink_unlike");
  setCavePose("Thinking");
  wiggle()
  unitNumberTab.classList.add("outlined");
  nextButton.disabled = false;
}
function reverse10() {
  wiggle(false)
  unitNumberTab.classList.remove("outlined");
  nextButton.disabled = true;
}
startButton.onclick = atStep0;
startButton.textContent = T.button_texts.next;
function showOverlay2(){
  showOverlayWith2Bubbles(1)
}
function showOverlay3(){
  showOverlayWith2Bubbles(2)
}
function reset(){
  if(questionIndex==0) {
    prevButton.disabled = true;
    nextButton.textContent = T.button_texts.next
  }
  else if(questionIndex==1){
    prevButton.disabled = false;
  }
  submitButton.disabled = false
  hideControlButtons();
  hideControlButtons(toHide[questionIndex])
  resetTen()
  resetUnit()
  updateInstructionWithQuestion(questions[questionIndex]);
  nextButton.disabled = true;
  showStatement(-1);
  setCavePose("Normal");
}
function handleNext() {
  playSound("click");
    questionIndex=(questionIndex+1)%questions.length;
    updateStepCounter(questionIndex);
    if(questionIndex===2){
      showOverlay2()
      return;
    }
    else if(questionIndex===4){
      showOverlay3()
      return;
    }
    reset();

}
function handlePrev(){
  playSound("click");
  if (questionIndex > 0) {
    questionIndex--;
    updateStepCounter(questionIndex);
    reset();
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
function showCommentTextVersion(text){
  const commentEl = document.querySelector(".comment");
  showStatement(0);
  commentEl.innerHTML = text;
}
function showNumberText(num){
  const text = numberToText[num]
  updateInstructionFromNumber(num)
  showStatement(1);
  const numberText = document.querySelector("#numberText>p");
  numberText.textContent = text
}


function wiggle(bool=true){
  if(bool){
    vibrateElement(unitInnerCard)
    setTimeout(()=>{vibrateElement(unitSquaresContainer)}, 100)
  }else{
    vibrateElement(unitInnerCard, false)
    vibrateElement(unitSquaresContainer, false)
  }
}

function hideControlButtons(arr){
  const buttons = document.querySelectorAll(".control-btn");
  buttons.forEach((button)=>{
    button.style.visibility = "visible";
  })
  if(!arr) return;
  arr.forEach((index)=>{
    buttons[index].style.visibility = "hidden";
  })
}

const unitPill = document.querySelector("#unit-widget .pill-badge");
const tenPill = document.querySelector("#ten-widget .pill-badge");
unitPill.textContent = tags.ones;
tenPill.textContent = tags.tens;