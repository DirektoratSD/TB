function checkAnswer() {
  const correctAnswer = questions[questionIndex].number;
  const answerInDigits = correctAnswer
    .toString()
    .split("")
    .reverse()
    .map(Number);
    const unitplace = answerInDigits[0];
    const tenplace = answerInDigits[1] || 0;
    
    
  const total = tenCount * 10 + unitCount;
  if (total === 0) {
    glowBlue();
    glowPink();
    return "nothingAdded";
  }
  if (unitCount > 9) {
    wiggle();
    return "tooManyOnes";
  }
  if (unitCount == unitplace && tenCount == tenplace) {
    return "correctAnswer";
  }
  if (unitCount == unitplace && tenCount != tenplace) {
    glowBlue();
    return "onesCorrectTensWrong";
  }
  if (unitCount != unitplace && tenCount == tenplace) {
    glowPink();
    return "tensCorrectOnesWrong";
  }
  if (unitCount != unitplace && tenCount != tenplace) {
    glowBlue();
    glowPink();
    return "randomTotalWrong";
  }
}

function addedCheckFor7(){
    if(tenCount>0){
        return "tensWrong"
    }
    return false;
}
function addedCheckFor30(){
    if(unitCount>0){
        return "onesWrong"
    }
    return false;
}

function finalCheckAnswer(){
    const number = questions[questionIndex].number;
    if(number==30){
        const result = addedCheckFor30()
        if(result){
            return result
        }
    }
    if(number==7){
        const result = addedCheckFor7()
        if(result){
            return result
        }
    }
    return checkAnswer()
}

function onSubmit(){
    const result = finalCheckAnswer()

    const comment = questions[questionIndex].feedback[result];
    
    showCommentTextVersion(comment);
    if(result=="correctAnswer"){
        if(questionIndex==questions.length-1){
            nextButton.textContent = T.button_texts.start_over
        }
        commentElement.classList.add("green")
        commentElement.classList.remove("red")
        nextButton.disabled = false
        submitButton.disabled = true
        playSound("correct")
        setCavePose("Happy")
        return
    }
    playSound("wrong")
    setCavePose("Sad")
    commentElement.classList.remove("green")
    commentElement.classList.add("red")
}
submitButton.textContent = T.button_texts.submit;
submitButton.addEventListener("click", onSubmit);

function glowPink(show=true){
  const mainCard = document.querySelector("#unit-widget .main-card");
  if(show){
    mainCard.classList.add("glow-pink");
  }else{
    mainCard.classList.remove("glow-pink");
  }
}
function glowBlue(show=true){
  const mainCard = document.querySelector("#ten-widget .main-card");
  if(show){
    mainCard.classList.add("glow-blue");
  }else{
    mainCard.classList.remove("glow-blue");
  }
}

function cancelAttention(){
  glowPink(false);
  glowBlue(false);
}