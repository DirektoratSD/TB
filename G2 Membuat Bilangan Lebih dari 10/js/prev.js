const undoQ = [];

function forStep1() {
  wiggle(false);
  unitNumberTab.classList.remove("outlined");
  updateInstructions("reminder");
  nextButton.disabled = false;
  plusBtn.style.pointerEvents = "none";
  plusBtn.classList.remove("pulse-highlight");
  plusBtn.removeEventListener("click", clickPLusFirstTime, { once: true });
  unitCount = 9;
  render();
  prevButton.disabled = true;
}
undoQ.push(forStep1);
function forStep2() {
  wiggle(false);
  unitNumberTab.classList.remove("outlined");
  unitCount = 9;
  render();
  showMCQ(false);
  showStatement(-1);
  updateInstructions("plus");
  nextButton.disabled = true;
  plusBtn.style.pointerEvents = "auto";
  plusBtn.classList.add("pulse-highlight");
  plusBtn.addEventListener("click", clickPLusFirstTime, { once: true });
}

undoQ.push(forStep2);

function forStep3() {
  unitCount = 10;
  render();
  wiggle(true);
  tenCount = 0;
  renderTens(0);
  tenNumberTab.style.color = "transparent";
  tenTextDisplay.style.color = "transparent";
  leftDir.onclick = onLeftDirClick1;
  showMCQ(true);
  freshenUpMcq();
  updateInstructions("mcq");
  plusBtn.style.pointerEvents = "none";
  plusBtn.classList.remove("pulse-highlight");
  plusBtn.removeEventListener("click", clickPLusFirstTime);
}
undoQ.push(forStep3);

function forStep4() {
  unitCount = 10;
  render();
  wiggle(true);
  tenCount = 0;
  renderTens(0);
  tenNumberTab.style.color = "transparent";
  tenTextDisplay.style.color = "transparent";
  leftDir.onclick = onLeftDirClick1;
  rightDir.onclick = onRightDirClick;
  nextButton.disabled = true;
  showDirArrow("left");
  showStatement(-1);
  updateInstructions("move_left");
  setCavePose("Normal");
}
undoQ.push(forStep4);

function forStep5() {
  tenCount = 2;
  renderTens(2);
  showDirArrow("right");
  updateInstructions("move_right");
  showStatement(-1);
  nextButton.disabled = true;
  unitCount = 10;
  render();
  unitCount=0;
  document
    .querySelectorAll(".count-square")
    .forEach((el) => (el.style.visibility = "hidden"));
  unitNumberTab.textContent = "0";
  unitTextDisplay.textContent = numberToText[0] + tags.ones;
  leftDir.onclick = onLeftDirClick3;
  rightDir.onclick = onRightDirClick;
  wiggle(false);
  setCavePose("Normal");
}
undoQ.push(forStep5);

prevButton.addEventListener("click", handlePrev);

function handlePrev() {
  playAudio("click");
  if (progress > 0) {
    progress--; // Go back to the previous step's index
    updateStepCounter(progress); // Update counter to show previous step
    undoQ[progress](); // Execute the undo action for the step we just moved away from (i.e., the state we are returning to)
  }
}
