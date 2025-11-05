// Interaction Panel Component
function InteractionPanel({ currentStep, onStepChange, getText, onReset, onStep6StateChange, onStep5AnimationComplete }) {
    const [step3CorrectAnswerSelected, setStep3CorrectAnswerSelected] = React.useState(false);
    const [step4PlusClicked, setStep4PlusClicked] = React.useState(false);
    const [step4CorrectAnswerSelected, setStep4CorrectAnswerSelected] = React.useState(false);
    const [step5CellClicked, setStep5CellClicked] = React.useState(false);
    const [step5CorrectAnswerSelected, setStep5CorrectAnswerSelected] = React.useState(false);
    const [step5AnimationComplete, setStep5AnimationComplete] = React.useState(false);
    const [step5ShowCarryRow, setStep5ShowCarryRow] = React.useState(false);
    const [step5AnimationStarted, setStep5AnimationStarted] = React.useState(false);
    const [step5MorphingPhase, setStep5MorphingPhase] = React.useState(0); // 0: sum, 1: colored, 2: fading tens, 3: units only
    const [step6PlusClicked, setStep6PlusClicked] = React.useState(false);
    const [step6CorrectAnswerSelected, setStep6CorrectAnswerSelected] = React.useState(false);

    const [step7APlusClicked, setStep7APlusClicked] = React.useState(false);
    const [step7ACorrectAnswerSelected, setStep7ACorrectAnswerSelected] = React.useState(false);
    const [step7BCellClicked, setStep7BCellClicked] = React.useState(false);
    const [step7BCorrectAnswerSelected, setStep7BCorrectAnswerSelected] = React.useState(false);
    const [step7BAnimationComplete, setStep7BAnimationComplete] = React.useState(false);
    const [step7BShowCarryRow, setStep7BShowCarryRow] = React.useState(true); // Show carry row initially for step 7B (unlike step 5)
    const [step7BAnimationStarted, setStep7BAnimationStarted] = React.useState(false);
    const [step7BMorphingPhase, setStep7BMorphingPhase] = React.useState(0); // 0: sum, 1: colored, 2: fading hundreds, 3: tens only


    
    // Calculate units sum dynamically
    const getUnitsSum = () => {
        const firstUnits = parseInt(String(FIRST_NUMBER).slice(-1)); // Units digit of first number
        const secondUnits = parseInt(String(SECOND_NUMBER).slice(-1)); // Units digit of second number
        return firstUnits + secondUnits;
    };
    
    const unitsSum = getUnitsSum();
    const tensDigit = Math.floor(unitsSum / 10); // Digit to carry
    const unitsDigit = unitsSum % 10; // Digit to remain
    
    // Calculate tens place sum (carry + tens digits)
    const getTensSum = () => {
        const firstTens = Math.floor((FIRST_NUMBER % 100) / 10);
        const secondTens = Math.floor((SECOND_NUMBER % 100) / 10);
        return tensDigit + firstTens + secondTens;
    };
    
    const tensSum = getTensSum();
    const carryToHundreds = Math.floor(tensSum / 10); // Digit to carry to hundreds
    const tensResult = tensSum % 10; // Final tens digit
    
    // Calculate hundreds place sum (carry + hundreds digits)  
    const getHundredsSum = () => {
        const firstHundreds = Math.floor(FIRST_NUMBER / 100);
        const secondHundreds = Math.floor(SECOND_NUMBER / 100);
        return carryToHundreds + firstHundreds + secondHundreds;
    };
    
    const hundredsSum = getHundredsSum();
    const hundredsResult = hundredsSum % 10; // Final hundreds digit
    
    // Get plus sign positioning based on step
    const getPlusPosition = (step) => {
        // Steps 2, 4, 5, 6, 7A, 7B - one coordinate
        if ([2, 4, 5].includes(step)) {
            return { left: '73%', top: '57%' };
        }
        
        // Steps 2, 4, 5, 6, 7A, 7B - one coordinate
        if ([6, '7A', '7B'].includes(step)) {
            return { left: '73%', top: '64%' };
        }
        // Steps 3, 8 - another coordinate
        if ([3].includes(step)) {
            return { left: '47%', top: '57%' };
        }
        // Steps 3, 8 - another coordinate
        if ([8].includes(step)) {
            return { left: '47%', top: '64%' };
        }
        // Default positioning
        return { left: '50%', top: '50%' };
    };
    
    // Additional calculations for step 7B (tens place carrying)
    const tensCarryDigit = Math.floor(tensSum / 10); // Digit to carry to hundreds from tens
    const tensRemainingDigit = tensSum % 10; // Digit to remain in tens
    
    // Reset step3CorrectAnswerSelected when leaving step 3
    React.useEffect(() => {
        if (currentStep !== 3) {
            setStep3CorrectAnswerSelected(false);
        }
    }, [currentStep]);

    // Reset step4 states when leaving step 4
    React.useEffect(() => {
        if (currentStep !== 4) {
            setStep4PlusClicked(false);
            setStep4CorrectAnswerSelected(false);
        }
    }, [currentStep]);

    // Reset step5 states when leaving step 5
    React.useEffect(() => {
        if (currentStep !== 5) {
            setStep5CellClicked(false);
            setStep5CorrectAnswerSelected(false);
            setStep5AnimationComplete(false);
            setStep5ShowCarryRow(false);
            setStep5AnimationStarted(false);
            setStep5MorphingPhase(0);
            // Notify parent component
            if (onStep5AnimationComplete) {
                onStep5AnimationComplete(false);
            }
        }
    }, [currentStep]);

    // Reset step6 states when leaving step 6
    React.useEffect(() => {
        if (currentStep !== 6) {
            setStep6PlusClicked(false);
            setStep6CorrectAnswerSelected(false);
        }
    }, [currentStep]);

    // Reset step7A states when leaving step 7A
    React.useEffect(() => {
        if (currentStep !== '7A') {
            setStep7APlusClicked(false);
            setStep7ACorrectAnswerSelected(false);
        }
    }, [currentStep]);

    // Reset step7B states when leaving step 7B
    React.useEffect(() => {
        if (currentStep !== '7B') {
            setStep7BCellClicked(false);
            setStep7BCorrectAnswerSelected(false);
            setStep7BAnimationComplete(false);
            setStep7BShowCarryRow(true); // Keep carry row visible when entering step 7B (unlike step 5)
            setStep7BAnimationStarted(false);
            setStep7BMorphingPhase(0);

        }
    }, [currentStep]);



    // Notify parent component when step 6 state changes
    React.useEffect(() => {
        if (onStep6StateChange) {
            onStep6StateChange(step6CorrectAnswerSelected);
        }
    }, [step6CorrectAnswerSelected, onStep6StateChange]);

    // Animation sequence for step 5
    React.useEffect(() => {
        if (currentStep === 5 && step5CorrectAnswerSelected && !step5AnimationComplete) {
            // Start the animation sequence
            const animateCarryOperation = async () => {
                console.log('Starting carry operation animation...');
                
                // Step 1: Wait 1 second, then show carry row
                await new Promise(resolve => setTimeout(resolve, 1000));
                console.log('Showing carry row...');
                setStep5ShowCarryRow(true);
                
                // Step 2: Wait 0.5 seconds
                await new Promise(resolve => setTimeout(resolve, 500));
                console.log('Starting digit animation...');
                
                // Step 3: Start digit animation and mark as started
                setStep5AnimationStarted(true);
                await animateDigitSeparationWithMorph();
                
                // Mark animation as complete
                setStep5AnimationComplete(true);
                // Notify parent component
                if (onStep5AnimationComplete) {
                    onStep5AnimationComplete(true);
                }
                console.log('Animation sequence complete!');
            };
            
                    animateCarryOperation();
    }
}, [currentStep, step5CorrectAnswerSelected, step5AnimationComplete]);

// Animation sequence for step 7B (replica of step 5)
React.useEffect(() => {
    if (currentStep === '7B' && step7BCorrectAnswerSelected && !step7BAnimationComplete) {
        // Start the animation sequence
        const animateCarryOperation = async () => {
            console.log('Starting step 7B carry operation animation...');
            
            // Step 1: Wait 1 second, then show carry row
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Showing step 7B carry row...');
            setStep7BShowCarryRow(true);
            
            // Step 2: Wait 0.5 seconds
            await new Promise(resolve => setTimeout(resolve, 500));
            console.log('Starting step 7B digit animation...');
            
            // Step 3: Start digit animation and mark as started
            setStep7BAnimationStarted(true);
            await animateDigitSeparationWithMorph7B();
            
            // Mark animation as complete
            setStep7BAnimationComplete(true);
            console.log('Step 7B animation sequence complete!');
        };
        
        animateCarryOperation();
    }
}, [currentStep, step7BCorrectAnswerSelected, step7BAnimationComplete]);

    // Append \u00A0+ to R2C4 and R3C4 cells (second-units), \u00A0\u00A0\u00A0 to R2C4 cell (first-units), and \u00A0\u00A0\u00A0 to R1C4 cell for all steps
    // Note: R5C4 for step 8 is now handled in the MathProblemGrid answerValues prop above
    React.useEffect(() => {
        // Use setTimeout to ensure the cells are rendered
        const timeoutId = setTimeout(() => {
            // Handle R2C4 cells - use querySelectorAll to handle multiple grids (e.g., step 8 has left and right grids)
            const cellsR2C4 = document.querySelectorAll('[data-cell="R2C4"]');
            cellsR2C4.forEach(cellR2C4 => {
                if (cellR2C4.classList.contains('second-units')) {
                    // Append \u00A0+ to R2C4 cell (second-units) for all steps
                    // Check if we haven't already appended the + sign
                    if (!cellR2C4.textContent.includes('+')) {
                        const originalText = cellR2C4.textContent.trim();
                        // Remove any existing appended content before adding new
                        const cleanText = originalText.replace(/\s*\+/g, '');
                        cellR2C4.textContent = cleanText + '\u00A0+';
                    }
                } else if (cellR2C4.classList.contains('first-units')) {
                    // Append \u00A0\u00A0\u00A0 to R2C4 cell (first-units) for all steps
                    // Check if we haven't already appended the spaces (avoid duplicates)
                    const hasAppendedSpaces = cellR2C4.textContent.includes('\u00A0\u00A0\u00A0') && 
                        cellR2C4.textContent.split('\u00A0\u00A0\u00A0').length >= 2;
                    
                    if (!hasAppendedSpaces) {
                        const originalText = cellR2C4.textContent.trim();
                        // Remove any existing appended spaces before adding new ones
                        const cleanText = originalText.replace(/\u00A0{3,}/g, '');
                        cellR2C4.textContent = cleanText + '\u00A0\u00A0\u00A0';
                    }
                }
            });
            
            // Handle R3C4 cell
            const cellR3C4 = document.querySelector('[data-cell="R3C4"]');
            if (cellR3C4) {
                if (cellR3C4.classList.contains('second-units')) {
                    // Append \u00A0+ to R3C4 cell (second-units) for all steps
                    // Check if we haven't already appended the + sign
                    if (!cellR3C4.textContent.includes('+')) {
                        const originalText = cellR3C4.textContent.trim();
                        // Remove any existing appended content before adding new
                        const cleanText = originalText.replace(/\s*\+/g, '');
                        cellR3C4.textContent = cleanText + '\u00A0+';
                    }
                } else if (cellR3C4.classList.contains('first-units')) {
                    // Append \u00A0\u00A0\u00A0 to R3C4 cell (first-units) for all steps
                    // Check if we haven't already appended the spaces (avoid duplicates)
                    const hasAppendedSpaces = cellR3C4.textContent.includes('\u00A0\u00A0\u00A0') && 
                        cellR3C4.textContent.split('\u00A0\u00A0\u00A0').length >= 2;
                    
                    if (!hasAppendedSpaces) {
                        const originalText = cellR3C4.textContent.trim();
                        // Remove any existing appended spaces before adding new ones
                        const cleanText = originalText.replace(/\u00A0{3,}/g, '');
                        cellR3C4.textContent = cleanText + '\u00A0\u00A0\u00A0';
                    }
                }
            }
            
            // Handle R4C4 cell (second-units) - append \u00A0+
            const cellR4C4 = document.querySelector('[data-cell="R4C4"]');
            if (cellR4C4 && cellR4C4.classList.contains('second-units')) {
                // Check if we haven't already appended the + sign
                if (!cellR4C4.textContent.includes('+')) {
                    const originalText = cellR4C4.textContent.trim();
                    // Remove any existing appended content before adding new
                    const cleanText = originalText.replace(/\s*\+/g, '');
                    cellR4C4.textContent = cleanText + '\u00A0+';
                }
            }
            
            // Handle R5C4 cells (answer-units) - append \u00A0\u00A0\u00A0, but not if it has animated-plus-container class
            // Use querySelectorAll to handle multiple grids (e.g., step 8 has left and right grids)
            const cellsR5C4 = document.querySelectorAll('[data-cell="R5C4"]');
            cellsR5C4.forEach(cellR5C4 => {
                if (cellR5C4.classList.contains('answer-units') && 
                    !cellR5C4.classList.contains('animated-plus-container')) {
                    // Check if we haven't already appended the spaces (avoid duplicates)
                    const hasAppendedSpaces = cellR5C4.textContent.includes('\u00A0\u00A0\u00A0') && 
                        cellR5C4.textContent.split('\u00A0\u00A0\u00A0').length >= 2;
                    
                    if (!hasAppendedSpaces) {
                        const originalText = cellR5C4.textContent.trim();
                        // Remove any existing appended spaces before adding new ones
                        const cleanText = originalText.replace(/\u00A0{3,}/g, '');
                        cellR5C4.textContent = cleanText + '\u00A0\u00A0\u00A0';
                    }
                }
            });
            
            // Append \u00A0\u00A0\u00A0 to R1C4 cells for all steps (first-units, header-units, etc.)
            // Use querySelectorAll to handle multiple grids (e.g., step 8 has left and right grids)
            const cellsR1C4 = document.querySelectorAll('[data-cell="R1C4"]');
            cellsR1C4.forEach(cellR1C4 => {
                // Check if we haven't already appended the spaces (avoid duplicates)
                const hasAppendedSpaces = cellR1C4.textContent.includes('\u00A0\u00A0\u00A0') && 
                    cellR1C4.textContent.split('\u00A0\u00A0\u00A0').length >= 2;
                
                if (!hasAppendedSpaces) {
                    const originalText = cellR1C4.textContent.trim();
                    // Remove any existing appended spaces before adding new ones
                    const cleanText = originalText.replace(/\u00A0{3,}/g, '');
                    cellR1C4.textContent = cleanText + '\u00A0\u00A0\u00A0';
                }
            });
        }, 100);
        
        return () => clearTimeout(timeoutId);
    }, [currentStep]);

    // Function to animate digit separation and carry with morphing
    const animateDigitSeparationWithMorph = () => {
        return new Promise((resolve) => {
            // Find the source cell (R5C4) and target cells
            const sourceCell = document.querySelector('[data-cell="R5C4"]');
            const carryTensCell = document.querySelector('[data-cell="R2C3"]'); // Tens place in carry row
            
            if (!sourceCell || !carryTensCell) {
                console.warn('Could not find required cells for animation');
                resolve();
                return;
            }
            
            // Get computed styles from the source cell to match font size
            const sourceStyles = window.getComputedStyle(sourceCell);
            const fontSize = sourceStyles.fontSize;
            const fontWeight = sourceStyles.fontWeight;
            
            // Get positions
            const sourceRect = sourceCell.getBoundingClientRect();
            const carryRect = carryTensCell.getBoundingClientRect();
            
            // Create temporary animated element for the "1" that flies out
            const animatedOne = document.createElement('div');
            
            // Style the animated element to match cell font size
            Object.assign(animatedOne.style, {
                position: 'fixed',
                fontSize: fontSize, // Use same font size as cell
                fontWeight: fontWeight, // Use same font weight as cell
                zIndex: 1000,
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FF4D6D', // Pink color for "1"
                left: sourceRect.left + sourceRect.width / 2 - 10 + 'px',
                top: sourceRect.top + sourceRect.height / 2 - 10 + 'px',
                width: '20px',
                height: '20px',
                opacity: 0 // Start invisible
            });
            
            animatedOne.textContent = tensDigit.toString();
            
            // Add to document
            document.body.appendChild(animatedOne);
            
            // Create GSAP timeline
            const tl = gsap.timeline({
                onComplete: () => {
                    // Clean up animated elements
                    document.body.removeChild(animatedOne);
                    resolve();
                }
            });
            
            // Animation sequence:
            // 1. Show the "1" emerging from the cell and morph cell content
            tl.to(animatedOne, {
                opacity: 1,
                duration: 0.3,
                ease: "power2.out",
                onStart: () => {
                    // Start morphing the cell content using React state
                    setStep5MorphingPhase(1); // Start with colored digits
                    
                    // Create a morphing effect by gradually changing the phase
                    setTimeout(() => setStep5MorphingPhase(2), 200); // Fading "1"
                    setTimeout(() => setStep5MorphingPhase(3), 400); // Only "3"
                }
            })
            // 2. "1" rises up from the cell
            .to(animatedOne, {
                y: -50,
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.1")
            // 3. "1" flies to carry position
            .to(animatedOne, {
                x: carryRect.left - sourceRect.left - sourceRect.width / 2 + carryRect.width / 2 + 10,
                y: carryRect.top - sourceRect.top - sourceRect.height / 2 + carryRect.height / 2 - 60,
                duration: 1.2,
                ease: "power2.inOut"
            }, "-=0.2");
        });
    };

    // Function to animate digit separation and carry with morphing for step 7B
    const animateDigitSeparationWithMorph7B = () => {
        return new Promise((resolve) => {
            // Find the source cell (R5C3) and target cells
            const sourceCell = document.querySelector('[data-cell="R5C3"]');
            const carryHundredsCell = document.querySelector('[data-cell="R2C2"]'); // Hundreds place in carry row
            
            if (!sourceCell || !carryHundredsCell) {
                console.warn('Could not find required cells for step 7B animation');
                resolve();
                return;
            }
            
            // Get computed styles from the source cell to match font size
            const sourceStyles = window.getComputedStyle(sourceCell);
            const fontSize = sourceStyles.fontSize;
            const fontWeight = sourceStyles.fontWeight;
            
            // Get positions
            const sourceRect = sourceCell.getBoundingClientRect();
            const carryRect = carryHundredsCell.getBoundingClientRect();
            
            // Create temporary animated element for the carry digit that flies out
            const animatedCarry = document.createElement('div');
            
            // Style the animated element to match cell font size
            Object.assign(animatedCarry.style, {
                position: 'fixed',
                fontSize: fontSize, // Use same font size as cell
                fontWeight: fontWeight, // Use same font weight as cell
                zIndex: 1000,
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FF4D6D', // Pink color for carry digit
                left: sourceRect.left + sourceRect.width / 2 - 10 + 'px',
                top: sourceRect.top + sourceRect.height / 2 - 10 + 'px',
                width: '20px',
                height: '20px',
                opacity: 0 // Start invisible
            });
            
            animatedCarry.textContent = tensCarryDigit.toString();
            
            // Add to document
            document.body.appendChild(animatedCarry);
            
            // Create GSAP timeline
            const tl = gsap.timeline({
                onComplete: () => {
                    // Clean up animated elements
                    document.body.removeChild(animatedCarry);
                    resolve();
                }
            });
            
            // Animation sequence:
            // 1. Show the carry digit emerging from the cell and morph cell content
            tl.to(animatedCarry, {
                opacity: 1,
                duration: 0.3,
                ease: "power2.out",
                onStart: () => {
                    // Start morphing the cell content using React state
                    setStep7BMorphingPhase(1); // Start with colored digits
                    
                    // Create a morphing effect by gradually changing the phase
                    setTimeout(() => setStep7BMorphingPhase(2), 200); // Fading carry digit
                    setTimeout(() => setStep7BMorphingPhase(3), 400); // Only remaining digit
                }
            })
            // 2. Carry digit rises up from the cell
            .to(animatedCarry, {
                y: -50,
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.1")
            // 3. Carry digit flies to carry position
            .to(animatedCarry, {
                x: carryRect.left - sourceRect.left - sourceRect.width / 2 + carryRect.width / 2 + 10,
                y: carryRect.top - sourceRect.top - sourceRect.height / 2 + carryRect.height / 2 - 60,
                duration: 1.2,
                ease: "power2.inOut"
            }, "-=0.2");
        });
    };

        // Get bottom dialogue message - supports steps A, B, C and steps 1, 2, 3, 4, 5, 6, and 7
    const getBottomDialogueData = () => {
        switch (currentStep) {
            case 'A':
                return { text: getText('stepABottomMessage'), key: 'stepABottomMessage' };
            case 'B':
                return { text: getText('stepBBottomMessage'), key: 'stepBBottomMessage' };
            case 'C':
                return { text: getText('stepCBottomMessage'), key: 'stepCBottomMessage' };
            case 1:
                return { text: getText('step1BottomMessage'), key: 'step1BottomMessage' };
            case 2:
                return { text: getText('step2BottomMessage'), key: 'step2BottomMessage' };
            case 3:
                // Change message after correct answer is selected
                if (step3CorrectAnswerSelected) {
                    return { text: getText('step3NextMessage'), key: 'step3NextMessage' };
                }
                return { text: getText('step3BottomMessage'), key: 'step3BottomMessage' };
            case 4:
                // Change message based on step 4 state
                if (step4CorrectAnswerSelected) {
                return { text: getText('step4BottomMessageFinal'), key: 'step4BottomMessageFinal' };
                } else if (step4PlusClicked) {
                    return { text: "", key: 'step4ChoiceQuestion' }; // No bottom message when showing choice question
                } else {
                    return { text: getText('step4BottomMessage'), key: 'step4BottomMessage' };
                }
            case 5:
                // For step 5 carrying logic
                if (step5AnimationComplete) {
                    return { text: getText('step5AnimationCompleteMessage'), key: 'step5AnimationCompleteMessage' };
                } else if (step5CorrectAnswerSelected) {
                    return { text: getText('step5AnimationMessage'), key: 'step5AnimationMessage' };
                } else if (step5CellClicked) {
                    return { text: "", key: 'step5ChoiceQuestion' }; // No bottom message when showing choice question
                } else {
                    return { text: getText('step5InitialMessage').replace('{number}', unitsSum), key: 'step5InitialMessage' };
                }
            case 6:
                // Change message based on step 6 state
                if (step6CorrectAnswerSelected) {
                    return { text: getText('step6CompletedBottomMessage'), key: 'step6CompletedBottomMessage' };
                } else if (step6PlusClicked) {
                    return { text: "", key: 'step6ChoiceQuestion' }; // No bottom message when showing choice question
                } else {
                    return { text: getText('step6BottomMessage'), key: 'step6BottomMessage' };
                }
            case '7A':
                // Change message based on step 7A state
                if (step7ACorrectAnswerSelected) {
                    return { text: getText('step7ACompletedBottomMessage'), key: 'step7ACompletedBottomMessage' };
                } else if (step7APlusClicked) {
                    return { text: "", key: 'step7AChoiceQuestion' }; // No bottom message when showing choice question
                } else {
                    return { text: getText('step7ABottomMessage'), key: 'step7ABottomMessage' };
                }
            case '7B':
                // For step 7B carrying logic - simplified to only show up to animation completion
                if (step7BAnimationComplete) {
                    return { text: getText('step7BBottomMessage'), key: 'step7BBottomMessage' };
                } else if (step7BCorrectAnswerSelected) {
                    return { text: getText('step7BAnimationMessage'), key: 'step7BAnimationMessage' };
                } else if (step7BCellClicked) {
                    return { text: "", key: 'step7BChoiceQuestion' }; // No bottom message when showing choice question
                } else {
                    return { text: getText('step7BInitialMessage').replace('{number}', tensSum), key: 'step7BInitialMessage' };
                }
            case 8:
                return { text: getText('step8BottomMessage'), key: 'step8BottomMessage' };
            case 'D':
                return { text: getText('stepDBottomMessage'), key: 'stepDBottomMessage' };
            default:
                return { text: getText('stepABottomMessage'), key: 'stepABottomMessage' };
        }
    };

    return React.createElement('div', { className: 'interaction-panel' },
        React.createElement('div', { className: 'visualization-panel' },
            React.createElement('div', { 
                className: `working-area ${currentStep === 3 ? 'split-layout' : ''}` 
            },

                    currentStep === 'A' ?
                    React.createElement('div', { 
                        className: 'question-box',
                        style: {
                            color: 'white',
                            fontSize: '54px',
                            lineHeight: '1.6',
                            padding: '20px',
                            textAlign: 'center',
                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                            borderRadius: '10px',
                            margin: '20px auto',
                            width: '95%'
                        }
                    }, getText('stepAQuestionText')) :
                    currentStep === 'B' ?
                    React.createElement('div', { 
                        className: 'question-box',
                        style: {
                            color: 'white',
                            fontSize: '54px',
                            lineHeight: '1.6',
                            padding: '20px',
                            textAlign: 'center',
                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                            borderRadius: '10px',
                            margin: '20px auto',
                            width: '95%'
                        }
                    }, 
                        // Create highlighted text for step B using internationalized text
                        React.createElement('span', null,
                            AppData.currentLanguage === 'en' ? 
                                React.createElement('span', null,
                                    'A palm oil farmer has several plantations. ',
                                    React.createElement('span', { 
                                        style: { 
                                            backgroundColor: 'green', 
                                            color: 'black', 
                                            padding: '2px 4px',
                                            borderRadius: '3px'
                                        } 
                                    }, 'Plantation A produces 328 fruits'),
                                    ', ',
                                    React.createElement('span', { 
                                        style: { 
                                            backgroundColor: 'yellow', 
                                            color: 'black', 
                                            padding: '2px 4px',
                                            borderRadius: '3px'
                                        } 
                                    }, 'plantation B produces 579 fruits'),
                                    '. How many palm oils are produced from plantation A and plantation B?'
                                ) :
                                React.createElement('span', null,
                                    'Seorang petani kelapa sawit memiliki beberapa perkebunan. ',
                                    React.createElement('span', { 
                                        style: { 
                                            backgroundColor: 'green', 
                                            color: 'black', 
                                            padding: '2px 4px',
                                            borderRadius: '3px'
                                        } 
                                    }, 'Kebun A menghasilkan 328 buah'),
                                    ', ',
                                    React.createElement('span', { 
                                        style: { 
                                            backgroundColor: 'yellow', 
                                            color: 'black', 
                                            padding: '2px 4px',
                                            borderRadius: '3px'
                                        } 
                                    }, 'kebun B menghasilkan 579 buah'),
                                    '. Berapakah jumlah kelapa sawit yang dihasilkan dari kebun A dan kebun B?'
                                )
                        )
                    ) :
                    currentStep === 'C' ?
                    React.createElement('div', { 
                        className: 'question-box',
                        style: {
                            color: 'white',
                            fontSize: '54px',
                            lineHeight: '1.6',
                            padding: '20px',
                            textAlign: 'center',
                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                            borderRadius: '10px',
                            margin: '20px auto',
                            width: '95%'
                        }
                    }, 
                        // Create highlighted text for step C using internationalized text
                        React.createElement('span', null,
                            AppData.currentLanguage === 'en' ? 
                                React.createElement('span', null,
                                    'A palm oil farmer has several plantations. Plantation A produces 328 fruits, plantation B produces 579 fruits. ',
                                    React.createElement('span', { 
                                        style: { 
                                            backgroundColor: 'yellow', 
                                            color: 'black', 
                                            padding: '2px 4px',
                                            borderRadius: '3px'
                                        } 
                                    }, 'How many palm oils are produced from plantation A and plantation B'),
                                    '?'
                                ) :
                                React.createElement('span', null,
                                    'Seorang petani kelapa sawit mempunyai beberapa kebun. Kebun A menghasilkan 328 buah, kebun B menghasilkan 579 buah. ',
                                    React.createElement('span', { 
                                        style: { 
                                            backgroundColor: 'yellow', 
                                            color: 'black', 
                                            padding: '2px 4px',
                                            borderRadius: '3px'
                                        } 
                                    }, 'Berapa banyak minyak kelapa sawit yang dihasilkan dari perkebunan A dan perkebunan B'),
                                    '?'
                                )
                        )
                    ) :
                    currentStep === 1 ?
                    React.createElement(React.Fragment, null,
                        React.createElement('div', { 
                            style: {
                                position: 'absolute',
                                left: '73%',
                                top: '48%',
                                transform: 'translate(-50%, -50%)',
                                fontSize: '4rem',
                                fontWeight: 'bold',
                                color: 'white',
                                background: 'transparent',
                                border: 'none',
                                zIndex: 10,
                                pointerEvents: 'none'
                            }
                        }, ''),
                        React.createElement(MathProblemGrid, {
                            firstNumber: FIRST_NUMBER,
                            secondNumber: SECOND_NUMBER,
                            showHeaderRow: false,
                            showCarryRow: false,
                            placeValueColorsOn: false,
                            answerValues: ['', '', ''],  // all blank - no placeholders in step 1
                            cellBgMode: 'custom',
                            customCellBg: 'white,0,white',  // Transparent white background, white font
                            currentStep: currentStep,
                            onCellClick: () => {},
                            onPlusClick: () => {}
                        })
                    ) :
                    currentStep === 2 ?
                    React.createElement(React.Fragment, null,
                        React.createElement('div', { 
                            style: {
                                position: 'absolute',
                                left: getPlusPosition(currentStep).left,
                                top: getPlusPosition(currentStep).top,
                                transform: 'translate(-50%, -50%)',
                                fontSize: '4rem',
                                fontWeight: 'bold',
                                color: 'white',
                                background: 'transparent',
                                border: 'none',
                                zIndex: 10,
                                pointerEvents: 'none'
                            }
                        }, ''),
                        React.createElement(MathProblemGrid, {
                            firstNumber: FIRST_NUMBER,
                            secondNumber: SECOND_NUMBER,
                            showHeaderRow: true,  // Show headers (H, T, U)
                            showCarryRow: false,
                            placeValueColorsOn: true,  // Use column colors
                            answerValues: ['', '', ''],  // all blank - no placeholders in step 2
                            currentStep: currentStep,
                            onCellClick: () => {},
                            onPlusClick: () => {}
                        })
                    ) :
                    currentStep === 3 ?
                    React.createElement(React.Fragment, null,
                        React.createElement('div', { className: 'left-half' },
                            React.createElement('div', { 
                                style: {
                                    position: 'absolute',
                                    left: getPlusPosition(currentStep).left,
                                    top: getPlusPosition(currentStep).top,
                                    transform: 'translate(-50%, -50%)',
                                    fontSize: '4rem',
                                    fontWeight: 'bold',
                                    color: 'white',
                                    background: 'transparent',
                                    border: 'none',
                                    zIndex: 10,
                                    pointerEvents: 'none'
                                }
                            }, ''),
                            React.createElement(MathProblemGrid, {
                                firstNumber: FIRST_NUMBER,
                                secondNumber: SECOND_NUMBER,
                                showHeaderRow: true,  // Show headers (H, T, U)
                                showCarryRow: false,
                                placeValueColorsOn: true,  // Use column colors
                                answerValues: ['', '', ''],  // All blank - no ? in step 3
                                showColumnBorders: step3CorrectAnswerSelected ? '0,0,2' : '0,0,0',  // Show animated border on units column when correct answer selected
                                currentStep: currentStep,
                                onCellClick: () => {},
                                onPlusClick: () => {}
                            })
                        ),
                        React.createElement('div', { className: 'right-half' },
                            React.createElement(InteractiveChoiceQuestion, {
                                headerText: AppData.getStep3ChoiceQuestion().headerText,
                                buttons: AppData.getStep3ChoiceQuestion().buttons,
                                isTryAgainActive: AppData.getStep3ChoiceQuestion().isTryAgainActive,
                                buttonOrder: AppData.getStep3ChoiceQuestion().buttonOrder,
                                componentBackgroundColor: AppData.getStep3ChoiceQuestion().componentBackgroundColor,
                                componentBackgroundOpacity: AppData.getStep3ChoiceQuestion().componentBackgroundOpacity,
                                defaultButtonColor: AppData.getStep3ChoiceQuestion().defaultButtonColor,
                                defaultButtonOpacity: AppData.getStep3ChoiceQuestion().defaultButtonOpacity,
                                onCorrectAnswer: () => {
                                    // Handle correct answer - show animated border and enable next button
                                    console.log('Correct answer selected!');
                                    setStep3CorrectAnswerSelected(true);
                                }
                            })
                        )
                    ) :
                    currentStep === 4 ?
                    React.createElement(React.Fragment, null,
                        React.createElement('div', { className: step4PlusClicked ? 'left-half' : 'full-width' },
                            React.createElement('div', { 
                                style: {
                                    position: 'absolute',
                                    left: getPlusPosition(currentStep).left,
                                    top: getPlusPosition(currentStep).top,
                                    transform: 'translate(-50%, -50%)',
                                    fontSize: '4rem',
                                    fontWeight: 'bold',
                                    color: 'white',
                                    background: 'transparent',
                                    border: 'none',
                                    zIndex: 10,
                                    pointerEvents: 'none'
                                }
                            }, ''),
                    React.createElement(MathProblemGrid, {
                        firstNumber: FIRST_NUMBER,
                        secondNumber: SECOND_NUMBER,
                        showHeaderRow: true,  // Show headers (H, T, U)
                        showCarryRow: false,
                        placeValueColorsOn: true,  // Use column colors
                                answerValues: step4CorrectAnswerSelected ? ['', '', unitsSum.toString()] : ['', '', ''],  // Show units sum when correct answer selected
                                showColumnBorders: step4CorrectAnswerSelected ? '0,0,2' : '0,0,0',  // Show animated border when correct answer selected
                                cellOverrides: step4PlusClicked ? {} : { 
                                    'R5C4': 'animated-plus-cell' // Special cell override for animated plus (R5C4 = answer row, units column)
                                },
                                step4PlusClicked: step4PlusClicked, // Pass the state to the grid
                                currentStep: currentStep,
                                onCellClick: () => {},
                                onPlusClick: () => {
                                    console.log('Plus sign clicked in step 4!');
                                    setStep4PlusClicked(true);
                                }
                            })
                        ),
                        // Show choice question on the right when plus is clicked
                        step4PlusClicked && React.createElement('div', { className: 'right-half' },
                            React.createElement(InteractiveChoiceQuestion, {
                                headerText: AppData.getStep4ChoiceQuestion().headerText,
                                buttons: AppData.getStep4ChoiceQuestion().buttons,
                                isTryAgainActive: AppData.getStep4ChoiceQuestion().isTryAgainActive,
                                buttonOrder: AppData.getStep4ChoiceQuestion().buttonOrder,
                                componentBackgroundColor: AppData.getStep4ChoiceQuestion().componentBackgroundColor,
                                componentBackgroundOpacity: AppData.getStep4ChoiceQuestion().componentBackgroundOpacity,
                                defaultButtonColor: AppData.getStep4ChoiceQuestion().defaultButtonColor,
                                defaultButtonOpacity: AppData.getStep4ChoiceQuestion().defaultButtonOpacity,
                                onCorrectAnswer: () => {
                                    // Handle correct answer - show animated border and enable next button
                                    console.log('Step 4 correct answer selected!');
                                    setStep4CorrectAnswerSelected(true);
                                }
                            })
                        )
                    ) :
                    currentStep === 5 ?
                    React.createElement(React.Fragment, null,
                        React.createElement('div', { className: step5CellClicked ? 'left-half' : 'full-width' },
                            // Only show plus sign when quiz modal is NOT open
                            !step5CellClicked && React.createElement('div', { 
                                style: {
                                    position: 'absolute',
                                    left: getPlusPosition(currentStep).left,
                                    top: getPlusPosition(currentStep).top,
                                    transform: 'translate(-50%, -50%)',
                                    fontSize: '4rem',
                                    fontWeight: 'bold',
                                    color: 'white',
                                    background: 'transparent',
                                    border: 'none',
                                    zIndex: 10,
                                    pointerEvents: 'none'
                                }
                            }, ''),
                            // Show red plus sign when quiz modal IS open
                            step5CellClicked && React.createElement('div', { 
                                style: {
                                    position: 'absolute',
                                    left: '48%',
                                    top: getPlusPosition(currentStep).top,
                                    transform: 'translate(-50%, -50%)',
                                    fontSize: '4rem',
                                    fontWeight: 'bold',
                                    color: 'white',
                                    background: 'transparent',
                                    border: 'none',
                                    zIndex: 10,
                                    pointerEvents: 'none'
                                }
                            }, ''),
                            React.createElement(MathProblemGrid, {
                                firstNumber: FIRST_NUMBER,
                                secondNumber: SECOND_NUMBER,
                                showHeaderRow: true,  // Show headers (H, T, U)
                                showCarryRow: step5ShowCarryRow, // Show carry row after animation starts
                                carryValues: step5AnimationComplete ? `,${tensDigit},` : '', // Show tens digit in carry position (R2C3) after animation
                                placeValueColorsOn: true,  // Use column colors
                                answerValues: step5AnimationComplete ? ['', '', unitsDigit.toString()] : ['', '', unitsSum.toString()],  // Show units digit after animation, sum before
                                showColumnBorders: step5CorrectAnswerSelected ? '0,0,2' : '0,0,0',  // Show border after correct answer
                                cellOverrides: step5CorrectAnswerSelected ? {} : { 'R5C4': 'red,80,white' }, // Red background before correct answer
                                step5CorrectAnswerSelected: step5CorrectAnswerSelected, // Pass state for special rendering
                                step5MorphingPhase: step5MorphingPhase, // Pass morphing phase for animation
                                step5UnitsSum: unitsSum, // Pass the calculated units sum
                                step5TensDigit: tensDigit, // Pass the tens digit to carry
                                step5UnitsDigit: unitsDigit, // Pass the units digit to remain
                                currentStep: currentStep,
                                onCellClick: (rowType, placeValue, content) => {
                                    console.log('Cell clicked in step 5:', rowType, placeValue, content);
                                    if (rowType === 'answer' && placeValue === 'units') {
                                        console.log('R5C4 (answer units) cell clicked in step 5!');
                                        setStep5CellClicked(true);
                                    }
                                },
                                onPlusClick: () => {}
                            })
                        ),
                        // Show choice question only when cell is clicked
                        step5CellClicked && React.createElement('div', { className: 'right-half' },
                            React.createElement(InteractiveChoiceQuestion, {
                                headerText: AppData.getStep5ChoiceQuestion().headerText,
                                buttons: AppData.getStep5ChoiceQuestion().buttons,
                                isTryAgainActive: AppData.getStep5ChoiceQuestion().isTryAgainActive,
                                buttonOrder: AppData.getStep5ChoiceQuestion().buttonOrder,
                                componentBackgroundColor: AppData.getStep5ChoiceQuestion().componentBackgroundColor,
                                componentBackgroundOpacity: AppData.getStep5ChoiceQuestion().componentBackgroundOpacity,
                                defaultButtonColor: AppData.getStep5ChoiceQuestion().defaultButtonColor,
                                defaultButtonOpacity: AppData.getStep5ChoiceQuestion().defaultButtonOpacity,
                                onCorrectAnswer: () => {
                                    // Handle correct answer - show animated border and enable next button
                                    console.log('Step 5 correct answer selected!');
                                    setStep5CorrectAnswerSelected(true);
                                }
                            })
                        )
                    ) :
                    currentStep === 6 ?
                    React.createElement(React.Fragment, null,
                        React.createElement('div', { className: step6PlusClicked ? 'left-half' : 'full-width' },
                            React.createElement('div', { 
                                style: {
                                    position: 'absolute',
                                    left: getPlusPosition(currentStep).left,
                                    top: getPlusPosition(currentStep).top,
                                    transform: 'translate(-50%, -50%)',
                                    fontSize: '4rem',
                                    fontWeight: 'bold',
                                    color: 'white',
                                    background: 'transparent',
                                    border: 'none',
                                    zIndex: 10,
                                    pointerEvents: 'none'
                                }
                            }, ''),
                            React.createElement(MathProblemGrid, {
                                firstNumber: FIRST_NUMBER,
                                secondNumber: SECOND_NUMBER,
                                showHeaderRow: true,  // Show headers (H, T, U)
                                showCarryRow: true, // Show carry row with the carried digit
                                carryValues: `,${tensDigit},`, // Show tens digit in carry position (R2C3)
                                placeValueColorsOn: true,  // Use column colors
                                answerValues: step6CorrectAnswerSelected ? ['', tensSum.toString(), unitsDigit.toString()] : ['', '', unitsDigit.toString()],  // Show full tens sum when correct answer selected
                                showColumnBorders: '0,2,0',  // Show animated border on tens column from step 6 start
                                cellOverrides: step6PlusClicked ? {} : { 
                                    'R5C3': 'animated-plus-cell' // Special cell override for animated plus (R5C3 = answer row, tens column)
                                },
                                step6PlusClicked: step6PlusClicked, // Pass the state to the grid
                                step5CorrectAnswerSelected: true, // Show multi-colored text in units
                                step5UnitsSum: unitsSum, // Pass the calculated units sum
                                step5TensDigit: tensDigit, // Pass the tens digit
                                step5UnitsDigit: unitsDigit, // Pass the units digit
                                currentStep: currentStep,
                                onCellClick: () => {},
                                onPlusClick: () => {
                                    console.log('Plus sign clicked in step 6!');
                                    setStep6PlusClicked(true);
                                }
                            })
                        ),
                        // Show choice question on the right when plus is clicked
                        step6PlusClicked && React.createElement('div', { className: 'right-half' },
                            React.createElement(InteractiveChoiceQuestion, {
                                headerText: AppData.getStep6ChoiceQuestion().headerText,
                                buttons: AppData.getStep6ChoiceQuestion().buttons,
                                isTryAgainActive: AppData.getStep6ChoiceQuestion().isTryAgainActive,
                                buttonOrder: AppData.getStep6ChoiceQuestion().buttonOrder,
                                componentBackgroundColor: AppData.getStep6ChoiceQuestion().componentBackgroundColor,
                                componentBackgroundOpacity: AppData.getStep6ChoiceQuestion().componentBackgroundOpacity,
                                defaultButtonColor: AppData.getStep6ChoiceQuestion().defaultButtonColor,
                                defaultButtonOpacity: AppData.getStep6ChoiceQuestion().defaultButtonOpacity,
                                onCorrectAnswer: () => {
                                    // Handle correct answer - show animated border and enable next button
                                    console.log('Step 6 correct answer selected!');
                                    setStep6CorrectAnswerSelected(true);
                                    
                                    // Log which step will be next based on tensSum
                                    if (tensSum > 9) {
                                        console.log('tensSum > 9, will go to step 7B when Next is clicked');
                                    } else {
                                        console.log('tensSum <= 9, will go to step 7A when Next is clicked');  
                                    }
                                }
                            })
                        )
                    ) :
                    currentStep === '7A' ?
                    React.createElement(React.Fragment, null,
                        React.createElement('div', { className: step7APlusClicked ? 'left-half' : 'full-width' },
                            React.createElement('div', { 
                                style: {
                                    position: 'absolute',
                                    left: getPlusPosition(currentStep).left,
                                    top: getPlusPosition(currentStep).top,
                                    transform: 'translate(-50%, -50%)',
                                    fontSize: '4rem',
                                    fontWeight: 'bold',
                                    color: 'white',
                                    background: 'transparent',
                                    border: 'none',
                                    zIndex: 10,
                                    pointerEvents: 'none'
                                }
                            }, ''),
                            React.createElement(MathProblemGrid, {
                                firstNumber: FIRST_NUMBER,
                                secondNumber: SECOND_NUMBER,
                                showHeaderRow: true,  // Show headers (H, T, U)
                                showCarryRow: true, // Show carry row with the carried digit
                                carryValues: `${carryToHundreds > 0 ? carryToHundreds : ''},${tensDigit},`, // Show hundreds carry if needed, plus tens carry
                                placeValueColorsOn: true,  // Use column colors
                                cellBgMode: 'transparent', // Transparent backgrounds for all cells
                                answerValues: step7ACorrectAnswerSelected ? [hundredsResult.toString(), tensResult.toString(), unitsDigit.toString()] : ['', tensResult.toString(), unitsDigit.toString()],  // Show hundreds result when correct answer selected
                                showColumnBorders: '1,0,0',  // Show animated border on hundreds column (column 1)
                                cellOverrides: step7APlusClicked ? {} : { 
                                    'R5C2': 'animated-plus-cell' // Special cell override for animated plus (R5C2 = answer row, hundreds column)
                                },
                                step7PlusClicked: step7APlusClicked, // Pass the state to the grid
                                step5CorrectAnswerSelected: true, // Show multi-colored text in units
                                step5UnitsSum: unitsSum, // Pass the calculated units sum
                                step5TensDigit: tensDigit, // Pass the tens digit
                                step5UnitsDigit: unitsDigit, // Pass the units digit
                                currentStep: currentStep,
                                onCellClick: () => {},
                                onPlusClick: () => {
                                    console.log('Plus sign clicked in step 7A!');
                                    setStep7APlusClicked(true);
                                }
                            })
                        ),
                        // Show choice question on the right when plus is clicked
                        step7APlusClicked && React.createElement('div', { className: 'right-half' },
                            React.createElement(InteractiveChoiceQuestion, {
                                headerText: AppData.getStep7AChoiceQuestion().headerText,
                                buttons: AppData.getStep7AChoiceQuestion().buttons,
                                isTryAgainActive: AppData.getStep7AChoiceQuestion().isTryAgainActive,
                                buttonOrder: AppData.getStep7AChoiceQuestion().buttonOrder,
                                componentBackgroundColor: AppData.getStep7AChoiceQuestion().componentBackgroundColor,
                                componentBackgroundOpacity: AppData.getStep7AChoiceQuestion().componentBackgroundOpacity,
                                defaultButtonColor: AppData.getStep7AChoiceQuestion().defaultButtonColor,
                                defaultButtonOpacity: AppData.getStep7AChoiceQuestion().defaultButtonOpacity,
                                onCorrectAnswer: () => {
                                    // Handle correct answer - show animated border and enable next button
                                    console.log('Step 7A correct answer selected!');
                                    setStep7ACorrectAnswerSelected(true);
                                }
                            })
                        )
                    ) :
                    currentStep === '7B' ?
                    React.createElement(React.Fragment, null,
                        React.createElement('div', { className: step7BCellClicked ? 'left-half' : 'full-width' },
                            React.createElement('div', { 
                                style: {
                                    position: 'absolute',
                                    left: getPlusPosition(currentStep).left,
                                    top: getPlusPosition(currentStep).top,
                                    transform: 'translate(-50%, -50%)',
                                    fontSize: '4rem',
                                    fontWeight: 'bold',
                                    color: 'white',
                                    background: 'transparent',
                                    border: 'none',
                                    zIndex: 10,
                                    pointerEvents: 'none'
                                }
                            }, ''),
                            React.createElement(MathProblemGrid, {
                                firstNumber: FIRST_NUMBER,
                                secondNumber: SECOND_NUMBER,
                                showHeaderRow: true,  // Show headers (H, T, U)
                                showCarryRow: step7BShowCarryRow, // Show carry row when animation starts
                                carryValues: (() => {
                                    const carryVal = step7BAnimationComplete ? `${tensCarryDigit},${tensDigit},` : `,${tensDigit},`;
                                    console.log(`Step 7B carryValues: "${carryVal}", tensCarryDigit: ${tensCarryDigit}, tensDigit: ${tensDigit}, step7BAnimationComplete: ${step7BAnimationComplete}, step7BShowCarryRow: ${step7BShowCarryRow}`);
                                    return carryVal;
                                })(), // Show original carry from step 5 in tens, add new carry to hundreds after animation
                                placeValueColorsOn: true,  // Use column colors
                                cellBgMode: 'transparent', // Transparent backgrounds for all cells
                                answerValues: step7BAnimationComplete ? ['', tensRemainingDigit.toString(), unitsDigit.toString()] : ['', tensSum.toString(), unitsDigit.toString()],  // Show intermediate result after animation
                                showColumnBorders: step7BAnimationComplete ? '0,0,0' : '0,1,0',  // No borders after animation complete
                                cellOverrides: (() => {
                                    if (step7BAnimationComplete) {
                                        return {}; // No overrides after animation complete
                                    } else if (step7BCellClicked) {
                                        return {}; // No overrides when cell is clicked
                                    } else {
                                        return { 'R5C3': 'red,80,white' }; // Red background with white font for tens column initially
                                    }
                                })(),
                                step5CorrectAnswerSelected: true, // Show multi-colored text in units
                                step5UnitsSum: unitsSum, // Pass the calculated units sum
                                step5TensDigit: tensDigit, // Pass the tens digit
                                step5UnitsDigit: unitsDigit, // Pass the units digit
                                // Step 7B morphing data (exactly same as step 5)
                                step7BCorrectAnswerSelected: step7BCorrectAnswerSelected, // Pass state for special rendering
                                step7BMorphingPhase: step7BMorphingPhase, // Pass morphing phase for animation
                                step7BSum: tensSum, // Pass the calculated tens sum
                                step7BCarryDigit: tensCarryDigit, // Pass the carry digit to carry
                                step7BRemainingDigit: tensRemainingDigit, // Pass the remaining digit to remain
                                currentStep: currentStep,
                                onCellClick: (rowType, placeValue, content) => {
                                    console.log('Cell clicked in step 7B:', rowType, placeValue, content);
                                    if (rowType === 'answer' && placeValue === 'tens' && !step7BAnimationComplete) {
                                        console.log('R5C3 (answer tens) cell clicked in step 7B!');
                                        setStep7BCellClicked(true);
                                    }
                                },
                                onPlusClick: () => {}  // No plus click functionality needed after simplification
                            })
                        ),
                        // Show choice question on the right when cell is clicked (initial carrying question)
                        step7BCellClicked && React.createElement('div', { className: 'right-half' },
                            React.createElement(InteractiveChoiceQuestion, {
                                headerText: AppData.getStep7BChoiceQuestion().headerText,
                                buttons: AppData.getStep7BChoiceQuestion().buttons,
                                isTryAgainActive: AppData.getStep7BChoiceQuestion().isTryAgainActive,
                                buttonOrder: AppData.getStep7BChoiceQuestion().buttonOrder,
                                componentBackgroundColor: AppData.getStep7BChoiceQuestion().componentBackgroundColor,
                                componentBackgroundOpacity: AppData.getStep7BChoiceQuestion().componentBackgroundOpacity,
                                defaultButtonColor: AppData.getStep7BChoiceQuestion().defaultButtonColor,
                                defaultButtonOpacity: AppData.getStep7BChoiceQuestion().defaultButtonOpacity,
                                onCorrectAnswer: () => {
                                    // Handle correct answer - start animation
                                    console.log('Step 7B correct answer selected!');
                                    setStep7BCorrectAnswerSelected(true);
                                }
                            })
                        )
                    ) :
                    currentStep === 8 ?
                    React.createElement(React.Fragment, null,
                        React.createElement('div', { className: 'left-half' },
                            React.createElement('div', { 
                                style: {
                                    position: 'absolute',
                                    left: getPlusPosition(currentStep).left,
                                    top: getPlusPosition(currentStep).top,
                                    transform: 'translate(-50%, -50%)',
                                    fontSize: '4rem',
                                    fontWeight: 'bold',
                                    color: 'white',
                                    background: 'transparent',
                                    border: 'none',
                                    zIndex: 10,
                                    pointerEvents: 'none'
                                }
                            }, ''),
                            React.createElement('div', { 
                                style: {
                                    position: 'absolute',
                                    left: '95%',
                                    top: '49%',
                                    transform: 'translate(-50%, -50%)',
                                    fontSize: '4rem',
                                    fontWeight: 'bold',
                                    color: 'black',
                                    background: 'transparent',
                                    border: 'none',
                                    zIndex: 10,
                                    pointerEvents: 'none'
                                }
                            }, ''),
                            React.createElement(MathProblemGrid, {
                                firstNumber: FIRST_NUMBER,
                                secondNumber: SECOND_NUMBER,
                                showHeaderRow: true,  // Show headers (H, T, U)
                                showCarryRow: true, // Show carry row with the carried digit
                                carryValues: tensSum > 9 ? `${Math.floor(tensSum / 10)},${tensDigit},` : `,${tensDigit},`, // Show appropriate carry values based on path
                                placeValueColorsOn: true,  // Use column colors
                                answerValues: [hundredsResult.toString(), tensResult.toString(), unitsDigit.toString()],  // Show completed result
                                showColumnBorders: '0,0,0',  // No animated borders in final state
                                step5CorrectAnswerSelected: true, // Show multi-colored text in units
                                step5UnitsSum: unitsSum, // Pass the calculated units sum
                                step5TensDigit: tensDigit, // Pass the tens digit
                                step5UnitsDigit: unitsDigit, // Pass the units digit
                                currentStep: currentStep,
                                onCellClick: () => {},
                                onPlusClick: () => {}
                            })
                        ),
                        React.createElement('div', { className: 'right-half' },
                            React.createElement(MathProblemGrid, {
                                firstNumber: FIRST_NUMBER,
                                secondNumber: SECOND_NUMBER,
                                showHeaderRow: false,
                                showCarryRow: false,
                                placeValueColorsOn: false,
                                answerValues: (FIRST_NUMBER + SECOND_NUMBER).toString(),  // Show the actual answer
                                cellBgMode: 'custom',
                                customCellBg: 'white,0,white',  // Transparent white background, white font
                                currentStep: 8, // Use step 8 styling for consistent plus sign styling
                                onCellClick: () => {},
                                onPlusClick: () => {}
                            })
                        )
                    ) :
                    currentStep === 'D' ?
                    React.createElement('div', { className: 'content-area' },
                        React.createElement('div', { className: 'full-width' },
                            React.createElement('div', { 
                                className: 'question-box',
                                style: { 
                                    whiteSpace: 'pre-line',
                                    fontSize: '57.6px',
                                    fontWeight: 'bold',
                                    color: 'white',
                                    textAlign: 'center',
                                    padding: '30px',
                                    border: '2px solid #3498db',
                                    borderRadius: '10px',
                                    margin: '20px'
                                }
                            }, getText('stepDBoxText'))
                        )
                    ) :
                    React.createElement(MathProblemGrid, {
                        firstNumber: FIRST_NUMBER,
                        secondNumber: SECOND_NUMBER,
                        showHeaderRow: true,
                        showCarryRow: false,
                        placeValueColorsOn: true,
                        answerValues: (() => {
                            const fullAnswer = (FIRST_NUMBER + SECOND_NUMBER).toString();
                            // Convert to array format: [hundreds, tens, units]
                            const answerDigits = fullAnswer.split('').reverse().slice(0, 3);
                            while (answerDigits.length < 3) answerDigits.unshift('');
                            // Append \u00A0\u00A0\u00A0 to units (index 2)
                            if (answerDigits[2]) {
                                answerDigits[2] = answerDigits[2] + '\u00A0\u00A0\u00A0';
                            }
                            return answerDigits.reverse(); // Return in [hundreds, tens, units] order
                        })(),
                        showColumnBorders: '0,0,1',
                        currentStep: currentStep,
                        onCellClick: () => {},
                        onPlusClick: () => {}
                    })
            ),
            // Show SecondDialogBox for all steps including step 3, with exceptions for specific interactive states
            !(currentStep === 4 && step4PlusClicked && !step4CorrectAnswerSelected) && !(currentStep === 5 && step5CellClicked && !step5CorrectAnswerSelected && !step5AnimationComplete) && !(currentStep === 6 && step6PlusClicked && !step6CorrectAnswerSelected) && !(currentStep === '7A' && step7APlusClicked && !step7ACorrectAnswerSelected) && !(currentStep === '7B' && step7BCellClicked && !step7BCorrectAnswerSelected && !step7BAnimationComplete) && getBottomDialogueData().text ? React.createElement(SecondDialogBox, {
                text: getBottomDialogueData().text,
                highlights: AppData.getHighlights(getBottomDialogueData().key),
                className: 'second-dialog-box',
                textAlign: 'center',
                showBorder: true,
                backgroundColor: 'rgba(255, 255, 255, 0.95)'
            }) : null
        ),
        React.createElement(ControlPanel, {
            currentStep: currentStep,
            onStepChange: onStepChange,
            onReset: onReset,
            getText: getText,
            step3CorrectAnswerSelected: step3CorrectAnswerSelected,
            step4CorrectAnswerSelected: step4CorrectAnswerSelected,
            step5CorrectAnswerSelected: step5CorrectAnswerSelected,
            step5AnimationComplete: step5AnimationComplete,
            step6CorrectAnswerSelected: step6CorrectAnswerSelected,

            step7ACorrectAnswerSelected: step7ACorrectAnswerSelected,
            step7BCorrectAnswerSelected: step7BCorrectAnswerSelected,
            step7BAnimationComplete: step7BAnimationComplete
        })
    );
} 