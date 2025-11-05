// Main App Component - Complete Implementation
function App() {
    // Get initial step based on visibility settings
    const getInitialStep = () => {
        if (typeof STEP_VISIBILITY !== 'undefined') {
            if (STEP_VISIBILITY.SHOW_INTRODUCTION_STEPS) {
                if (STEP_VISIBILITY.SHOW_STEP_A) return 'A';
                if (STEP_VISIBILITY.SHOW_STEP_B) return 'B';
                if (STEP_VISIBILITY.SHOW_STEP_C) return 'C';
            }
        }
        return 1; // Default to step 1 if no intro steps are shown
    };
    
    const [currentStep, setCurrentStep] = React.useState(getInitialStep());
    const [currentLanguage, setCurrentLanguage] = React.useState((typeof APP_CONFIG !== 'undefined' && APP_CONFIG.defaultLanguage) ? APP_CONFIG.defaultLanguage : 'en');
    const [characterState, setCharacterState] = React.useState('neutral');
    const [step6CorrectAnswerSelected, setStep6CorrectAnswerSelected] = React.useState(false);
    const [step5AnimationComplete, setStep5AnimationComplete] = React.useState(false);
    
    // No step state needed for single step application

    // Get text based on current language
    const getText = (key) => {
        return AppData.getText(key);
    };

    // Change language
    const switchLanguage = (langCode) => {
        if (AppData.setLanguage(langCode)) {
            setCurrentLanguage(langCode);
        }
    };

    // No auto-advance logic needed for single step

    // No step-specific state reset needed for single step

    // Reset function
    const resetApp = React.useCallback(() => {
        setCurrentStep(getInitialStep());
        setCharacterState('neutral');
        setStep6CorrectAnswerSelected(false);
        setStep5AnimationComplete(false);
    }, []);

    // Get character dialogue - supports steps A, B, C and steps 1, 2, 3, 4, 5, 6, and 7
    const getCharacterDialogue = () => {
        switch (currentStep) {
            case 'A':
                return { text: getText('stepAMessage'), key: 'stepAMessage' };
            case 'B':
                return { text: getText('stepBMessage'), key: 'stepBMessage' };
            case 'C':
                return { text: getText('stepCMessage'), key: 'stepCMessage' };
            case 1:
                return { text: getText('step1Message'), key: 'step1Message' };
            case 2:
                return { text: getText('step2Message'), key: 'step2Message' };
            case 3:
                return { text: getText('step3Message'), key: 'step3Message' };
            case 4:
                return { text: getText('step4Message'), key: 'step4Message' };
            case 5:
                if (step5AnimationComplete) {
                    return { text: getText('step5AnimationCompleteCharacterMessage'), key: 'step5AnimationCompleteCharacterMessage' };
                } else {
                    return { text: getText('step5Message'), key: 'step5Message' };
                }
            case 6:
                if (step6CorrectAnswerSelected) {
                    return { text: getText('step6CompletedMessage'), key: 'step6CompletedMessage' };
                } else {
                    return { text: getText('step6Message'), key: 'step6Message' };
                }
            case '7A':
                return { text: getText('step7AMessage'), key: 'step7AMessage' };
            case '7B':
                return { text: getText('step7BMessage'), key: 'step7BMessage' };
            case 8:
                return { text: getText('step8Message'), key: 'step8Message' };
            case 'D':
                return { text: getText('stepDMessage'), key: 'stepDMessage' };
            default:
                return { text: getText('stepAMessage'), key: 'stepAMessage' };
        }
    };

    return React.createElement('div', { className: 'main-container' },
        React.createElement(Header, {
            getText: getText
        }),
        React.createElement('div', { className: 'activity-container' },
            React.createElement(CharacterPanel, {
                characterState: characterState,
                dialogue: getCharacterDialogue().text,
                dialogueKey: getCharacterDialogue().key
            }),
            React.createElement(InteractionPanel, {
                currentStep: currentStep,
                onStepChange: setCurrentStep,
                getText: getText,
                onReset: resetApp,
                onStep6StateChange: setStep6CorrectAnswerSelected,
                onStep5AnimationComplete: setStep5AnimationComplete
            })
        )
    );
}

// Render the app using React 18 createRoot API
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(React.createElement(App)); 