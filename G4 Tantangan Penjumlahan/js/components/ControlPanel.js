// Control Panel Component - With navigation between steps 1, 2, 3, 4, 5, 6, 7A, 7B, and 8
function ControlPanel({
  currentStep,
  onStepChange,
  onReset,
  getText,
  step3CorrectAnswerSelected,
  step4CorrectAnswerSelected,
  step5CorrectAnswerSelected,
  step5AnimationComplete,
  step6CorrectAnswerSelected,
  step7ACorrectAnswerSelected,
  step7BCorrectAnswerSelected,
  step7BAnimationComplete,
}) {
  // Get step visibility settings from constants
  const showIntroSteps =
    typeof STEP_VISIBILITY !== "undefined"
      ? STEP_VISIBILITY.SHOW_INTRODUCTION_STEPS
      : true;
  const showStepA =
    showIntroSteps &&
    (typeof STEP_VISIBILITY !== "undefined"
      ? STEP_VISIBILITY.SHOW_STEP_A
      : true);
  const showStepB =
    showIntroSteps &&
    (typeof STEP_VISIBILITY !== "undefined"
      ? STEP_VISIBILITY.SHOW_STEP_B
      : true);
  const showStepC =
    showIntroSteps &&
    (typeof STEP_VISIBILITY !== "undefined"
      ? STEP_VISIBILITY.SHOW_STEP_C
      : true);
  const showStepD =
    showIntroSteps &&
    (typeof STEP_VISIBILITY !== "undefined"
      ? STEP_VISIBILITY.SHOW_STEP_D
      : true);

  // Helper function to get the first available step
  const getFirstStep = () => {
    if (showStepA) return "A";
    if (showStepB) return "B";
    if (showStepC) return "C";
    return 1; // Default to step 1 if no intro steps are shown
  };

  // Helper function to get the last available step
  const getLastStep = () => {
    if (showStepD) return "D";
    return 8; // Default to step 8 if step D is not shown
  };

  // Helper function to get the next step after intro steps
  const getStepAfterIntro = () => {
    return 1; // Always go to step 1 after intro steps
  };

  // Helper function to get the step before math steps
  const getStepBeforeMath = () => {
    if (showStepC) return "C";
    if (showStepB) return "B";
    if (showStepA) return "A";
    return 1; // If no intro steps, stay at step 1
  };

  // Calculate tens sum to determine 7A vs 7B path
  const getUnitsSum = () => {
    const firstUnits = parseInt(String(FIRST_NUMBER).slice(-1));
    const secondUnits = parseInt(String(SECOND_NUMBER).slice(-1));
    return firstUnits + secondUnits;
  };

  const unitsSum = getUnitsSum();
  const tensDigit = Math.floor(unitsSum / 10);

  const getTensSum = () => {
    const firstTens = Math.floor((FIRST_NUMBER % 100) / 10);
    const secondTens = Math.floor((SECOND_NUMBER % 100) / 10);
    return tensDigit + firstTens + secondTens;
  };

  const tensSum = getTensSum();
  return React.createElement(
    "div",
    { className: "control-panel" },
    React.createElement(
      "div",
      { className: "navigation-buttons left-buttons" },
      React.createElement(
        "button",
        {
          className: "control-btn",
          onClick: () => {
            if (currentStep === "B") {
              onStepChange(showStepA ? "A" : getFirstStep());
            } else if (currentStep === "C") {
              onStepChange(showStepB ? "B" : showStepA ? "A" : getFirstStep());
            } else if (currentStep === 1) {
              onStepChange(getStepBeforeMath());
            } else if (currentStep === "7A") {
              if (tensSum > 9) {
                onStepChange("7B"); // Go back to 7B if coming from 7A in a 7B→7A path
              } else {
                onStepChange(6); // Go back to step 6 if this is the normal 6→7A path
              }
            } else if (currentStep === "7B") {
              onStepChange(6);
            } else if (currentStep === 8) {
              onStepChange("7A"); // Step 8 goes back to 7A
            } else if (currentStep === "D") {
              onStepChange(8); // Step D goes back to step 8
            } else if (typeof currentStep === "number") {
              onStepChange(Math.max(1, currentStep - 1));
            }
          },
          disabled: currentStep === getFirstStep(),
        },
        getText("buttons.previous")
      )
    ),
    React.createElement(
      "div",
      { className: "center-section" },
      React.createElement(
        "div",
        { className: "progress-dots" },
        // Conditionally render step A
        showStepA
          ? React.createElement(
              "div",
              {
                className: `progress-dot ${
                  currentStep === "A" ? "active" : ""
                }`,
                onClick: () => onStepChange("A"),
                title: getText("stepNames.stepA"),
              },
              "A"
            )
          : null,
        // Conditionally render step B
        showStepB
          ? React.createElement(
              "div",
              {
                className: `progress-dot ${
                  currentStep === "B" ? "active" : ""
                }`,
                onClick: () => onStepChange("B"),
                title: getText("stepNames.stepB"),
              },
              "B"
            )
          : null,
        // Conditionally render step C
        showStepC
          ? React.createElement(
              "div",
              {
                className: `progress-dot ${
                  currentStep === "C" ? "active" : ""
                }`,
                onClick: () => onStepChange("C"),
                title: getText("stepNames.stepC"),
              },
              "C"
            )
          : null,
        React.createElement(
          "div",
          {
            className: `progress-dot ${currentStep === 1 ? "active" : ""}`,
            onClick: () => onStepChange(1),
            title: getText("stepNames.step1"),
          },
          "1"
        ),
        React.createElement(
          "div",
          {
            className: `progress-dot ${currentStep === 2 ? "active" : ""}`,
            onClick: () => onStepChange(2),
            title: getText("stepNames.step2"),
          },
          "2"
        ),
        React.createElement(
          "div",
          {
            className: `progress-dot ${currentStep === 3 ? "active" : ""}`,
            onClick: () => onStepChange(3),
            title: getText("stepNames.step3"),
          },
          "3"
        ),
        React.createElement(
          "div",
          {
            className: `progress-dot ${currentStep === 4 ? "active" : ""}`,
            onClick: () => onStepChange(4),
            title: getText("stepNames.step4"),
          },
          "4"
        ),
        React.createElement(
          "div",
          {
            className: `progress-dot ${currentStep === 5 ? "active" : ""}`,
            onClick: () => onStepChange(5),
            title: getText("stepNames.step5"),
          },
          "5"
        ),
        React.createElement(
          "div",
          {
            className: `progress-dot ${currentStep === 6 ? "active" : ""}`,
            onClick: () => onStepChange(6),
            title: getText("stepNames.step6"),
          },
          "6"
        ),
        React.createElement(
          "div",
          {
            className: `progress-dot ${
              currentStep === "7A" || currentStep === "7B" ? "active" : ""
            }`,
            onClick: () => onStepChange("7A"), // Default to 7A when clicking on step 7
            title:
              currentStep === "7B"
                ? getText("stepNames.step7B")
                : getText("stepNames.step7A"),
          },
          "7"
        ),
        React.createElement(
          "div",
          {
            className: `progress-dot ${currentStep === 8 ? "active" : ""}`,
            onClick: () => onStepChange(8),
            title: getText("stepNames.step8"),
          },
          "8"
        ),
        // Conditionally render step D
        showStepD
          ? React.createElement(
              "div",
              {
                className: `progress-dot ${
                  currentStep === "D" ? "active" : ""
                }`,
                onClick: () => onStepChange("D"),
                title: getText("stepNames.stepD"),
              },
              "D"
            )
          : null
      ),
      React.createElement(
        "button",
        {
          className: "control-btn reset-btn",
          onClick: onReset,
        },
        getText("buttons.reset")
      )
    ),
    React.createElement(
      "div",
      { className: "navigation-buttons right-buttons" },
      currentStep !== getLastStep()
        ? React.createElement(
            "button",
            {
              className: "control-btn",
              onClick: () => {
                if (currentStep === "A") {
                  onStepChange(
                    showStepB ? "B" : showStepC ? "C" : getStepAfterIntro()
                  );
                } else if (currentStep === "B") {
                  onStepChange(showStepC ? "C" : getStepAfterIntro());
                } else if (currentStep === "C") {
                  onStepChange(getStepAfterIntro());
                } else if (currentStep === 6) {
                  // Conditional logic: if tensSum > 9, go to step 7B, else go to step 7A
                  if (tensSum > 9) {
                    console.log(
                      "From ControlPanel: tensSum > 9, going to step 7B"
                    );
                    onStepChange("7B");
                  } else {
                    console.log(
                      "From ControlPanel: tensSum <= 9, going to step 7A"
                    );
                    onStepChange("7A");
                  }
                } else if (currentStep === "7B") {
                  onStepChange("7A"); // 7B goes to 7A
                } else if (currentStep === "7A") {
                  onStepChange(8); // 7A goes to step 8
                } else if (currentStep === 8) {
                  if (showStepD) {
                    onStepChange("D"); // Go to step D if it's available
                  }
                  // If Step D is not available, do nothing (button should be disabled)
                } else if (typeof currentStep === "number") {
                  onStepChange(Math.min(8, currentStep + 1));
                }
              },
              disabled:
                (currentStep === 3 && !step3CorrectAnswerSelected) ||
                (currentStep === 4 && !step4CorrectAnswerSelected) ||
                (currentStep === 5 && !step5AnimationComplete) ||
                (currentStep === 6 && !step6CorrectAnswerSelected) ||
                (currentStep === "7A" && !step7ACorrectAnswerSelected) ||
                (currentStep === "7B" && !step7BAnimationComplete),
            },
            getText("buttons.next")
          )
        : null
    )
  );
}
