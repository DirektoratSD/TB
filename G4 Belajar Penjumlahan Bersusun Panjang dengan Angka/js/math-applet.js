// Main Math Learning Applet React Component
const { useState, useEffect, useCallback } = React;

// Note: Grid editor functionality moved to grid-editor.html
// This main app focuses on the learning experience

// Add header text box function  
const createHeaderTextBox = () => {
  console.log('🎯 Creating header text box...');
  
  // Get the grid system instance
  const gridSystem = window.gridSystem || GridSystem.getInstance();
  if (!gridSystem) {
    console.warn('GridSystem not available for header creation');
    return;
  }
  
  // Create header text box spanning full width and 8 rows (to match gridPositions standard)
  const headerCoords = 'R1C1-R8C128'; // Full width, 8 rows high
  const headerText = 'Math Learning Platform - Interactive Grid System';
  
  const headerElement = gridSystem.createTextBox(headerCoords, headerText, {
    styles: {
      backgroundColor: 'rgba(255, 0, 0, 0.8)', // Red background for visibility
      color: 'white',                        // White font
      fontSize: '24px',                     // Fixed font size for debugging
      fontWeight: 'bold',                    // Bold text
      textAlign: 'center',                   // Center aligned
      padding: '10px 20px',                  // Padding
      borderRadius: '0px',                   // No rounded corners for header
      textShadow: '2px 2px 4px rgba(0,0,0,0.8)', // Text shadow for better readability
      border: '3px solid yellow',            // Bright border for visibility
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '1000'                         // Very high z-index to stay on top
    },
    id: 'header-text-box'
  });
  
  // Add to page 1 if PageManager is available
  if (window.pageManager && headerElement) {
    window.pageManager.addElementToPage('header-text-box', 'page1');
    console.log('✅ Header text box added to page 1');
  }
  
  return headerElement;
};

// Static components - defined outside main app to prevent re-creation on every render
// Note: No React.memo needed since these components don't receive props
const LogoComponent = () => {
  return React.createElement('div', {
    className: 'logo-container',
    style: {
      position: 'absolute',
      zIndex: '10001',
      pointerEvents: 'auto'
    }
  },
    React.createElement('img', {
      src: 'assets/logo.png',
      alt: 'Logo',
      className: 'logo-image',
      style: {
        height: 'auto',
        width: 'auto',
        objectFit: 'contain'
      }
    })
  );
};

const MarqueeComponent = () => {
  // Calculate left position: logo left + logo width + small gap
  const logoLeft = 'calc(clamp(5px, 1vw, 15px))';
  const logoWidth = 'clamp(60px, 8vw, 180px)';
  const marqueeLeft = `calc(${logoLeft} + ${logoWidth} + 10px)`;
  
  return React.createElement('div', {
    className: 'marquee-container',
    style: {
      position: 'absolute',
      top: '0',
      left: marqueeLeft,
      right: '0',
      height: '5vh',
      zIndex: '9999',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      background: 'rgba(0, 0, 0, 0.35)'
    }
  },
    React.createElement('div', {
      className: 'marquee-content',
      style: {
        display: 'inline-block',
        whiteSpace: 'nowrap',
        color: 'white',
        fontSize: 'clamp(0.875rem, 1.5vw, 1.5rem)',
        animation: 'marquee-scroll 30s linear infinite'
      }
    }, 'Temukan konten dan modul lengkap menggunakan PID, lewat aplikasi Teman Belajar')
  );
};

const CharacterComponent = () => {
  const position = gridPositions.getScreenElement('characterArea');
  
  // Debug log to verify component is not re-rendering unnecessarily
  console.log('🎭 CharacterComponent rendered - this should only appear once per session');
  
  return React.createElement('div', {
    className: 'character-container',
    style: {
      ...position.css,
      zIndex: '998'
    },
    'data-grid-position': 'characterArea',
    'data-coordinates': '[34, 2, 72, 28]'
  },
    React.createElement('img', {
      src: 'assets/character_excited.png',
      alt: 'Excited Character',
      className: 'character-image'
    })
  );
};

const Container1Component = () => {
  const position = gridPositions.getScreenElement('container1');
  const containerElement = StandardPositions.container1;
  
  return React.createElement('div', {
    className: 'container1',
    style: {
      ...position.css,
      backgroundColor: containerElement.props.backgroundColor || 'rgba(0, 0, 0, 0.7)',
      opacity: containerElement.props.opacity || 1,
      borderRadius: containerElement.props.borderRadius || '8px',
      zIndex: '500',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    'data-grid-position': 'container1',
    'data-coordinates': '[5, 30, 38, 128]'
  });
};

const Container2Component = () => {
  const position = gridPositions.getScreenElement('container2');
  const containerElement = StandardPositions.container2;
  
  return React.createElement('div', {
    className: 'container2',
    style: {
      ...position.css,
      backgroundColor: containerElement.props.backgroundColor || 'rgba(255, 0, 0, 0.7)',
      opacity: containerElement.props.opacity || 1,
      borderRadius: containerElement.props.borderRadius || '8px',
      zIndex: '500',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    'data-grid-position': 'container2',
    'data-coordinates': '[39, 30, 72, 128]'
  });
};

// Main App Component
const MathLearningApp = () => {
  // Responsive font scaling based on screen size
  const [screenSize, setScreenSize] = React.useState({ width: window.innerWidth, height: window.innerHeight });
  const [appUpdateTrigger, setAppUpdateTrigger] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages] = React.useState(20); // We have 20 pages now
  const [showGrid2, setShowGrid2] = React.useState(false); // Grid2 visibility state
  
  // Animation states for Grid1 - moved to top level to prevent state corruption
  const [hasAnimated, setHasAnimated] = React.useState(false);
  const [animatedPosition, setAnimatedPosition] = React.useState(null);
  
  // Grid2 visibility flags - all default to false
  const [firstNumberFlag, setFirstNumberFlag] = React.useState(false);
  const [secondNumberFlag, setSecondNumberFlag] = React.useState(false);
  const [thirdNumberFlag, setThirdNumberFlag] = React.useState(false);
  const [separatorFlag, setSeparatorFlag] = React.useState(false);
  
  // Grid1 behavior flag - controls animation and highlighting
  const [grid1Flag, setGrid1Flag] = React.useState(false);
  
  // Grid1 answer row visibility flag - controls whether answer row is shown
  const [grid1answerflag, setGrid1answerflag] = React.useState(false);
  
  // Current highlight focus for progressive sequence
  const [currentHighlightFocus, setCurrentHighlightFocus] = React.useState('R1C2');
  
  // Page 2 Grid1 animation completion flag
  const [p2grid1animationcomplete, setP2grid1animationcomplete] = React.useState(false);
  
  // Quiz overlay state
  const [showQuizOverlay, setShowQuizOverlay] = React.useState(false);
  const [quizFeedback, setQuizFeedback] = React.useState('');
  const [clickedOption, setClickedOption] = React.useState(null);
  
  // Next button disabled state per page (tracks which quiz pages have been completed)
  const [completedQuizPages, setCompletedQuizPages] = React.useState(new Set());



  // Digit calculation variables (default to 0)
  const [onesdigitsum, setOnesdigitsum] = React.useState(0);
  const [onesdigitanswer, setOnesdigitanswer] = React.useState(0);
  const [tensCarry, setTensCarry] = React.useState(0);
  const [tensdigitsum, setTensdigitsum] = React.useState(0);
  const [tensdigitanswer, setTensdigitanswer] = React.useState(0);
  const [hundredsCarry, setHundredsCarry] = React.useState(0);
  const [hundredsdigitsum, setHundredsdigitsum] = React.useState(0);
  const [hundredsdigitanswer, setHundredsdigitanswer] = React.useState(0);

  React.useEffect(() => {
    const handleResize = () => {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    };
    
    // Add global update function for question changes
    window.forceAppUpdate = () => {
      setAppUpdateTrigger(prev => prev + 1);
    };
    
    // Add global page navigation functions
    window.navigateToPage = (pageNumber) => {
      if (pageNumber >= 1 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
        console.log(`🔄 Navigated to page ${pageNumber}`);
        
        // Reset Grid2 visibility when changing pages
        setShowGrid2(false);
      }
    };
    
    window.getCurrentPage = () => currentPage;
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      delete window.forceAppUpdate;
      delete window.navigateToPage;
      delete window.getCurrentPage;
    };
  }, [currentPage, totalPages]);

  // Set Grid2 visibility based on page
  React.useEffect(() => {
    if (currentPage >= 2) {
      setShowGrid2(true);
      console.log(`🔄 Page ${currentPage} - Grid2 shown immediately`);
    } else {
      setShowGrid2(false);
      console.log('🔄 Page changed - Grid2 hidden');
    }
    
    // Set Grid1 answer flag based on page
    if (currentPage === 20) {
      setGrid1answerflag(true);
      window.grid1answerflag = true; // Make available globally
      console.log(`🔄 Page ${currentPage} - Grid1 answer row enabled`);
      // Force Grid1Utils to reload for page 20 to show answer row
      if (typeof Grid1Utils !== 'undefined') {
        const currentQuestionIndex = typeof PageUtils !== 'undefined' ? PageUtils.getCurrentQuestionIndex(20) : 0;
        Grid1Utils.loadQuestion(currentQuestionIndex, 20);
        console.log(`🔄 Forcing Grid1Utils.loadQuestion for page 20 with question ${currentQuestionIndex}`);
      }
    } else {
      setGrid1answerflag(false);
      window.grid1answerflag = false; // Make available globally
      console.log(`🔄 Page ${currentPage} - Grid1 answer row disabled`);
      // Force Grid1Utils to reload for non-page-20 to hide answer row
      if (typeof Grid1Utils !== 'undefined') {
        const currentQuestionIndex = typeof PageUtils !== 'undefined' ? PageUtils.getCurrentQuestionIndex(currentPage) : 0;
        Grid1Utils.loadQuestion(currentQuestionIndex, currentPage);
        console.log(`🔄 Forcing Grid1Utils.loadQuestion for page ${currentPage} with question ${currentQuestionIndex}`);
      }
    }
  }, [currentPage]);

  // Animation states are now reset in question change handlers to prevent timing conflicts

    // Function to calculate digit-wise sums and carries
  const calculateDigitSums = React.useCallback(() => {
    console.log('🔍 [DEBUG] calculateDigitSums called');
    console.log('🔍 [DEBUG] PageUtils available:', typeof PageUtils !== 'undefined');
    console.log('🔍 [DEBUG] PageUtils.getCurrentQuestion available:', typeof PageUtils?.getCurrentQuestion === 'function');
    
    // Get current question data
    let questionData = null;
    
    // Try PageUtils first
    if (typeof PageUtils !== 'undefined' && typeof PageUtils.getCurrentQuestion === 'function') {
      questionData = PageUtils.getCurrentQuestion(1);
      console.log('🔍 [DEBUG] Retrieved question data from PageUtils:', questionData);
    }
    
    // Try Grid1Utils as fallback
    if (!questionData && typeof Grid1Utils !== 'undefined' && typeof Grid1Utils.getCurrentQuestion === 'function') {
      questionData = Grid1Utils.getCurrentQuestion();
      console.log('🔍 [DEBUG] Retrieved question data from Grid1Utils:', questionData);
    }
    
    // Try QUESTIONS array directly as last resort
    if (!questionData && typeof QUESTIONS !== 'undefined' && QUESTIONS.length > 0) {
      questionData = QUESTIONS[0]; // Get first question as default
      console.log('🔍 [DEBUG] Retrieved question data from QUESTIONS[0]:', questionData);
    }
    
    if (!questionData) {
      console.log('📊 Unable to retrieve question data from any source');
      return;
    }

    // Extract numbers (default to 0 if not present)
    const firstNumber = questionData.first_number || 0;
    const secondNumber = questionData.second_number || 0;
    const thirdNumber = questionData.third_number || 0;

    // Helper function to get digit at position (0 = ones, 1 = tens, 2 = hundreds)
    const getDigitAtPosition = (number, position) => {
      const numStr = number.toString();
      const digitIndex = numStr.length - 1 - position;
      return digitIndex >= 0 ? parseInt(numStr[digitIndex]) : 0;
    };

    // Calculate ones digit sum
    const onesFirst = getDigitAtPosition(firstNumber, 0);
    const onesSecond = getDigitAtPosition(secondNumber, 0);
    const onesThird = thirdNumber ? getDigitAtPosition(thirdNumber, 0) : 0;
    const calculatedOnesSum = onesFirst + onesSecond + onesThird;

    // Calculate ones digit answer and tens carry
    const calculatedOnesAnswer = calculatedOnesSum <= 9 ? calculatedOnesSum : calculatedOnesSum % 10;
    const calculatedTensCarry = Math.floor(calculatedOnesSum / 10) * 10;

    // Calculate tens digit sum
    const tensFirst = getDigitAtPosition(firstNumber, 1);
    const tensSecond = getDigitAtPosition(secondNumber, 1);
    const tensThird = thirdNumber ? getDigitAtPosition(thirdNumber, 1) : 0;
    const calculatedTensSum = calculatedTensCarry + tensFirst + tensSecond + tensThird;

    // Calculate tens digit answer and hundreds carry
    const calculatedTensAnswer = calculatedTensSum <= 99 ? calculatedTensSum : calculatedTensSum % 100;
    const calculatedHundredsCarry = Math.floor(calculatedTensSum / 100) * 100;

    // Calculate hundreds digit sum (only for 3-digit numbers)
    const maxDigits = Math.max(
      firstNumber.toString().length,
      secondNumber.toString().length,
      thirdNumber ? thirdNumber.toString().length : 0
    );
    
    let calculatedHundredsSum = 0;
    let calculatedHundredsAnswer = 0;
    
    if (maxDigits === 3) {
      const hundredsFirst = getDigitAtPosition(firstNumber, 2);
      const hundredsSecond = getDigitAtPosition(secondNumber, 2);
      const hundredsThird = thirdNumber ? getDigitAtPosition(thirdNumber, 2) : 0;
      calculatedHundredsSum = calculatedHundredsCarry + hundredsFirst + hundredsSecond + hundredsThird;
      calculatedHundredsAnswer = calculatedHundredsSum; // No modulo for hundreds
    }

    // Update state variables
    setOnesdigitsum(calculatedOnesSum);
    setOnesdigitanswer(calculatedOnesAnswer);
    setTensCarry(calculatedTensCarry);
    setTensdigitsum(calculatedTensSum);
    setTensdigitanswer(calculatedTensAnswer);
    setHundredsCarry(calculatedHundredsCarry);
    setHundredsdigitsum(calculatedHundredsSum);
    setHundredsdigitanswer(calculatedHundredsAnswer);

    // Console logging
    console.log('📊 ========== DIGIT CALCULATIONS ==========');
    console.log(`📊 Question: ${firstNumber} + ${secondNumber}${thirdNumber ? ' + ' + thirdNumber : ''}`);
    console.log(`📊 Numbers breakdown:`);
    console.log(`   First number: ${firstNumber} (hundreds: ${getDigitAtPosition(firstNumber, 2)}, tens: ${getDigitAtPosition(firstNumber, 1)}, ones: ${getDigitAtPosition(firstNumber, 0)})`);
    console.log(`   Second number: ${secondNumber} (hundreds: ${getDigitAtPosition(secondNumber, 2)}, tens: ${getDigitAtPosition(secondNumber, 1)}, ones: ${getDigitAtPosition(secondNumber, 0)})`);
    if (thirdNumber) {
      console.log(`   Third number: ${thirdNumber} (hundreds: ${getDigitAtPosition(thirdNumber, 2)}, tens: ${getDigitAtPosition(thirdNumber, 1)}, ones: ${getDigitAtPosition(thirdNumber, 0)})`);
    }
    console.log(`📊 onesdigitsum = ${onesFirst} + ${onesSecond}${thirdNumber ? ' + ' + onesThird : ''} = ${calculatedOnesSum}`);
    console.log(`📊 onesdigitanswer = ${calculatedOnesSum <= 9 ? calculatedOnesSum : `${calculatedOnesSum} % 10`} = ${calculatedOnesAnswer}`);
    console.log(`📊 tensCarry = (${calculatedOnesSum} // 10) * 10 = ${calculatedTensCarry}`);
    console.log(`📊 tensdigitsum = ${calculatedTensCarry} + ${tensFirst} + ${tensSecond}${thirdNumber ? ' + ' + tensThird : ''} = ${calculatedTensSum}`);
    console.log(`📊 tensdigitanswer = ${calculatedTensSum <= 99 ? calculatedTensSum : `${calculatedTensSum} % 100`} = ${calculatedTensAnswer}`);
    console.log(`📊 hundredsCarry = (${calculatedTensSum} // 100) * 100 = ${calculatedHundredsCarry}`);
    
    if (maxDigits === 3) {
      const hundredsFirst = getDigitAtPosition(firstNumber, 2);
      const hundredsSecond = getDigitAtPosition(secondNumber, 2);
      const hundredsThird = thirdNumber ? getDigitAtPosition(thirdNumber, 2) : 0;
      console.log(`📊 hundredsdigitsum = ${calculatedHundredsCarry} + ${hundredsFirst} + ${hundredsSecond}${thirdNumber ? ' + ' + hundredsThird : ''} = ${calculatedHundredsSum}`);
      console.log(`📊 hundredsdigitanswer = ${calculatedHundredsSum}`);
    } else {
      console.log(`📊 hundredsdigitsum = 0 (not a 3-digit number)`);
      console.log(`📊 hundredsdigitanswer = 0 (not a 3-digit number)`);
    }
    console.log('📊 ========================================');
  }, []);

  // Helper function to check if Next button should be disabled
  const isNextButtonDisabled = () => {
    // Special logic for page 2
    if (currentPage === 2) {
      // Get current question data to determine if it's 2-number or 3-number array
      const pageElement = GridPositionUtils.getPageElement(currentPage, 'grid1');
      const questionData = pageElement?.props?.questionData;
      
      if (questionData) {
        const isThreeNumbers = questionData.third_number !== undefined;
        
        if (isThreeNumbers) {
          // 3-number array: enable when all three flags are true
          const allFlagsTrue = firstNumberFlag && secondNumberFlag && thirdNumberFlag;
          console.log(`🔍 [Next Button Check] Page 2 (3-number): firstFlag=${firstNumberFlag}, secondFlag=${secondNumberFlag}, thirdFlag=${thirdNumberFlag}, enabled=${allFlagsTrue}`);
          return !allFlagsTrue;
        } else {
          // 2-number array: enable when first two flags are true
          const bothFlagsTrue = firstNumberFlag && secondNumberFlag;
          console.log(`🔍 [Next Button Check] Page 2 (2-number): firstFlag=${firstNumberFlag}, secondFlag=${secondNumberFlag}, enabled=${bothFlagsTrue}`);
          return !bothFlagsTrue;
        }
      }
      
      // Default to disabled if no question data
      console.log(`🔍 [Next Button Check] Page 2: No question data, defaulting to disabled`);
      return true;
    }
    
    // Quiz pages logic
    const quizPages = [3, 5, 7, 11, 13, 17];
    const isQuizPage = quizPages.includes(currentPage);
    const isCompleted = completedQuizPages.has(currentPage);
    const shouldDisable = isQuizPage && !isCompleted;
    
    console.log(`🔍 [Next Button Check] Page ${currentPage}:`);
    console.log(`   - Is quiz page: ${isQuizPage}`);
    console.log(`   - Is completed: ${isCompleted}`);
    console.log(`   - Should disable: ${shouldDisable}`);
    console.log(`   - Completed pages: [${Array.from(completedQuizPages).join(', ')}]`);
    
    if (!isQuizPage) {
      return false; // Non-quiz pages are always enabled
    }
    return !isCompleted; // Quiz pages are disabled until completed
  };

  // Auto-show quiz modal on page 3, page 5, page 7, page 11, page 13, and page 17
  React.useEffect(() => {
    if (currentPage === 3 || currentPage === 5 || currentPage === 7 || currentPage === 11 || currentPage === 13 || currentPage === 17) {
      setShowQuizOverlay(true);
      console.log(`📝 Page ${currentPage} - Quiz modal shown automatically`);
      console.log(`🔒 Next button disabled status: ${isNextButtonDisabled()} (completed: ${completedQuizPages.has(currentPage)})`);
    } else {
      setShowQuizOverlay(false);
      console.log('📝 Page changed - Quiz modal hidden');
      console.log(`🔓 Next button enabled on non-quiz page ${currentPage}`);
    }
  }, [currentPage, completedQuizPages]);

  // Calculate digit sums and carries when page 1 loads
  React.useEffect(() => {
    console.log('🔍 [DEBUG] Page changed, currentPage:', currentPage);
    if (currentPage === 1) {
      console.log('🔍 [DEBUG] Page 1 detected, calling calculateDigitSums');
      calculateDigitSums();
    }
  }, [currentPage, appUpdateTrigger, calculateDigitSums]);

  // Expose currentPage and digit calculations to global context for Grid2Utils and page 7 modal
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      window.getCurrentPage = () => currentPage;
      window.getOnesdigitsum = () => onesdigitsum;
      window.getOnesdigitanswer = () => onesdigitanswer;
      window.getTensCarry = () => tensCarry;
      window.getTensdigitsum = () => tensdigitsum;
      window.getTensdigitanswer = () => tensdigitanswer;
      window.getHundredsCarry = () => hundredsCarry;
      window.getHundredsdigitsum = () => hundredsdigitsum;
      window.getHundredsdigitanswer = () => hundredsdigitanswer;
    }
  }, [currentPage, onesdigitsum, onesdigitanswer, tensCarry, tensdigitsum, tensdigitanswer, hundredsCarry, hundredsdigitsum, hundredsdigitanswer]);

  // Clean app focused on learning experience
  // Grid editing capabilities available in grid-editor.html

    // Create header component with grid positioning
  const HeaderComponent = () => {
    const position = gridPositions.getStandardElement('header');
    
    // Grid positioning using standard header element
    
    return React.createElement('div', {
      className: 'header-container',
      style: {
        ...position.css,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        fontSize: '24px',
        fontWeight: 'bold',
        textAlign: 'center',
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: '1000',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '0px',
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
      },
      'data-grid-position': 'header',
      'data-coordinates': '[1, 1, 4, 128]'
    },
      // Page dropdown on the left - conditionally rendered based on APP_CONFIG
      (typeof window.APP_CONFIG !== 'undefined' && window.APP_CONFIG.SHOW_PAGE_PROGRESS) ? 
        React.createElement('div', {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }
        },
          React.createElement('label', {
            htmlFor: 'page-dropdown',
            style: {
              fontSize: '16px',
              fontWeight: 'normal',
              color: 'white'
            }
          }, 'Page: '),
          React.createElement('select', {
            id: 'page-dropdown',
            value: currentPage,
            onChange: (event) => {
              const selectedPage = parseInt(event.target.value);
              console.log(`🔍 [Page Dropdown] Jumping to page ${selectedPage}`);
              setCurrentPage(selectedPage);
            },
            style: {
              fontSize: '16px',
              padding: '5px 10px',
              borderRadius: '4px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: 'black',
              minWidth: '60px'
            }
          },
            ...Array.from({length: totalPages}, (_, i) => i + 1).map(pageNum => 
              React.createElement('option', {
                key: pageNum,
                value: pageNum
              }, `${pageNum}`)
            )
          )
        ) : 
        React.createElement('div', {
          style: {
            width: '130px' // Placeholder to maintain layout balance
          }
        }),
      // Title in the center
      React.createElement('div', {
        style: {
          flex: 1,
          textAlign: 'center'
        }
      }, typeof i18n !== 'undefined' ? i18n.t('appInfo.title') : 'Math Learning Platform - Long Column Addition'),
      // Empty space on the right to balance the layout
      React.createElement('div', {
        style: {
          width: '130px' // Same width as the left side
        }
      })
    );
  };

    // Static components moved outside main app - they now use React.memo for optimization

  // Create dialog box component with clean, conflict-free implementation
  const DialogComponent = () => {
    // Use the updated dialogBubble coordinates
    const position = gridPositions.getScreenElement('dialogBubble');
    
    // Get the element configuration (current page)
    const pageElement = GridPositionUtils.getPageElement(currentPage, 'dialog-bubble');
    
    // Use EXACT same pattern as NextButton - get element and process styles
    const dialogElement = pageElement || StandardPositions.dialogBubble;
    
    // Process dialog styles using the same GridCellFontUtils as NextButton
    // Dialog has props.options structure, NextButton has direct props
    const dialogOptions = dialogElement.props.options || {};
    const processedDialogStyles = GridCellFontUtils.processGcStyles(dialogOptions);
    
    // Grid calculations are handled by the caching system
    // No need to force updates on every render
    
    // Debug: Log what we're getting - same as NextButton debug pattern
    console.log('🔍 [DialogComponent Debug] Current page:', currentPage);
    console.log('🔍 [DialogComponent Debug] Page element:', pageElement);
    console.log('🔍 [DialogComponent Debug] Processed styles:', processedDialogStyles);
    console.log('🔍 [DialogComponent Debug] fontSize value:', processedDialogStyles.fontSize);
    console.log('🔍 [DialogComponent Debug] fontSize type:', typeof processedDialogStyles.fontSize);
    
    return React.createElement('div', {
      className: 'clean-dialog-container',
      style: {
        ...position.css,
        zIndex: '999'
        // CSS custom properties now handled by gridcell-units.js updateCSSVariables()
      },
      'data-grid-position': 'dialogBubble'
    },
              React.createElement('div', {
        className: 'clean-dialog-bubble',
        style: {
          width: '100%',
          height: '100%',
          backgroundColor: processedDialogStyles.backgroundColor || '#ffffff',
          borderRadius: processedDialogStyles.borderRadius || '12px',
          padding: '5px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          border: '2px solid #e0e0e0'
        }
      },
        // Dialog tail/pointer
          React.createElement('div', {
          className: 'clean-dialog-tail',
          style: {
            position: 'absolute',
            bottom: '-12px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '0',
            height: '0',
            borderLeft: '15px solid transparent',
            borderRight: '15px solid transparent',
            borderTop: `15px solid ${processedDialogStyles.backgroundColor || '#ffffff'}`,
            zIndex: '10'
          }
        }),
                // Dialog text content - apply processed styles directly like NextButton
        React.createElement('div', {
          className: 'clean-dialog-text',
          style: {
            // Apply processed styles directly - exact same pattern as NextButton
            ...processedDialogStyles,
            lineHeight: '1.2',
            fontWeight: 'bold',
            margin: '0',
            padding: '0',
            display: 'block',
            width: 'auto',
            height: 'auto',
            overflow: 'visible',
            whiteSpace: 'normal',
            wordWrap: 'break-word'
          }
        }, (() => {
          // Get text from page configuration
          const pageElement = GridPositionUtils.getPageElement(currentPage, 'dialog-bubble');
          if (pageElement && pageElement.props && typeof pageElement.props.text === 'function') {
            return pageElement.props.text();
          } else if (pageElement && pageElement.props && pageElement.props.text) {
            return pageElement.props.text;
          }
          // Fallback text using i18n system
          return typeof i18n !== 'undefined' ? i18n.t(`dialogs.page${currentPage}.dialogtext`) : "Split the numbers into their place values.";
        })())
        )
      );
  };

  // Create instruction header component
  const InstructionHeaderComponent = () => {
    const position = gridPositions.getScreenElement('instructionHeader');
    const pageElement = GridPositionUtils.getPageElement(currentPage, 'instruction-header');
    const instructionElement = pageElement || StandardPositions.instructionHeader;
    
    console.log('🔍 [InstructionHeader] Position from grid system:', position);
    console.log('🔍 [InstructionHeader] CSS coordinates:', position?.css);
    
    // Process GC styles for font size
    const processedStyles = GridCellFontUtils.processGcStyles({
      fontSize: instructionElement.props.fontSize,
      textAlign: instructionElement.props.textAlign,
      color: instructionElement.props.textColor,
      backgroundColor: instructionElement.props.backgroundColor,
      fontWeight: instructionElement.props.fontWeight
    });
    
    return React.createElement('div', {
      className: 'instruction-header',
      style: {
        ...position.css,
        fontSize: processedStyles.fontSize || '19px',
        textAlign: processedStyles.textAlign || 'center',
        color: processedStyles.color || '#ffffff',
        backgroundColor: processedStyles.backgroundColor || 'transparent',
        fontWeight: processedStyles.fontWeight || 'bold',
        zIndex: '600',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Arial, sans-serif',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
        userSelect: 'none',
        pointerEvents: 'none'
      },
      'data-grid-position': 'instruction-header',
      'data-coordinates': '[5, 30, 72, 128]'
    }, currentPage === 2 && !grid1Flag ? 
             (currentHighlightFocus === 'R1C2' ? (typeof i18n !== 'undefined' ? i18n.t('dialogs.instructions.tapFirstNumber') : "Tap on the first number") :
        currentHighlightFocus === 'R2C2' ? (typeof i18n !== 'undefined' ? i18n.t('dialogs.instructions.tapSecondNumber') : "Tap on the second number") :
        currentHighlightFocus === 'R3C2' ? (typeof i18n !== 'undefined' ? i18n.t('dialogs.instructions.tapThirdNumber') : "Tap on the third number") :
        (typeof i18n !== 'undefined' ? i18n.t('dialogs.instructions.tapFirstNumber') : "Tap on the first number")) : 
      instructionElement.props.text);
  };

  // Create question dropdown component
  const QuestionDropdownComponent = () => {
    // Check if question dropdown should be shown based on APP_CONFIG
    if (typeof window.APP_CONFIG !== 'undefined' && !window.APP_CONFIG.SHOW_QUESTION_DROPDOWN) {
      return null;
    }
    
    const position = gridPositions.getScreenElement('questionDropdown');
    const pageElement = GridPositionUtils.getPageElement(currentPage, 'question-dropdown');
    const dropdownElement = pageElement || StandardPositions.questionDropdown;
    
    const [currentQuestion, setCurrentQuestion] = React.useState(0);
    
          const handleQuestionChange = (event) => {
        const questionIndex = parseInt(event.target.value);
        setCurrentQuestion(questionIndex);
        
        // Reset all flags when changing questions
        setFirstNumberFlag(false);
        setSecondNumberFlag(false);
        setThirdNumberFlag(false);
        setSeparatorFlag(false);
        setHasAnimated(false);
        setGrid1Flag(false);
        setP2grid1animationcomplete(false);
        setGrid1answerflag(false);
        setShowQuizOverlay(false);
        setShowGrid2(false);
        setCurrentHighlightFocus('R1C2'); // Reset interactive highlighting to start from first number
        
        // Reset global flag
        if (typeof window !== 'undefined') {
          window.grid1answerflag = false;
        }
        
        if (typeof Grid1Utils !== 'undefined') {
          Grid1Utils.loadQuestion(questionIndex);
          // Force re-render by updating parent state
          if (typeof window.forceAppUpdate === 'function') {
            window.forceAppUpdate();
          }
        }
      };
    
    // Generate options from QUESTIONS array
    const generateOptions = () => {
      if (typeof QUESTIONS === 'undefined') {
        return [React.createElement('option', { value: 0, key: 0 }, 'Loading questions...')];
      }
      
      return QUESTIONS.map((question, index) => {
        const hasThreeNumbers = question.third_number !== undefined;
        const displayText = hasThreeNumbers 
          ? `Q${index + 1}: ${question.first_number} + ${question.second_number} + ${question.third_number}`
          : `Q${index + 1}: ${question.first_number} + ${question.second_number}`;
        
        return React.createElement('option', { 
          value: index, 
          key: index 
        }, displayText);
      });
    };
    
    return React.createElement('div', {
      className: 'question-dropdown-container',
      style: {
        ...position.css,
        zIndex: '700',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'auto'
      },
      'data-grid-position': 'question-dropdown',
      'data-coordinates': '[5, 100, 9, 128]'
    },
      React.createElement('select', {
        value: currentQuestion,
        onChange: handleQuestionChange,
        style: {
          ...dropdownElement.props,
          width: '100%',
          height: '80%',
          padding: '8px',
          textAlign: 'center',
          cursor: 'pointer'
        }
      }, ...generateOptions())
    );
  };

  // Add CSS keyframes for pulsating animation
  React.useEffect(() => {
    const styleId = 'next-button-pulse-animation';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes nextButtonPulse {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(255, 153, 0, 0.7);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 0 10px rgba(255, 153, 0, 0.3);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(255, 153, 0, 0);
          }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Create next button component
  const NextButtonComponent = () => {
    const position = gridPositions.getScreenElement('nextButton');
    const pageElement = GridPositionUtils.getPageElement(currentPage, 'next-button');
    const buttonElement = pageElement || StandardPositions.nextButton;
    
    // Process gc styles for the button
    const processedButtonStyles = GridCellFontUtils.processGcStyles(buttonElement.props);
    
    // Dynamic button text based on current page
    const getButtonText = () => {
      if (currentPage === 8 || currentPage === 14) {
                 return typeof i18n !== 'undefined' ? i18n.t('dialogs.buttons.carryOver') : 'Carry Over';
      }
      if (currentPage === 20) {
        // Check if there are more questions after the current one
        const currentQuestionIndex = PageUtils.getCurrentQuestionIndex(20);
        const hasMoreQuestions = typeof QUESTIONS !== 'undefined' && currentQuestionIndex < QUESTIONS.length - 1;
        return hasMoreQuestions ? 
          (typeof i18n !== 'undefined' ? i18n.t('dialogs.buttons.tryNew') : 'Try New') : 
          (typeof i18n !== 'undefined' ? i18n.t('dialogs.buttons.startAgain') : 'Start Again');
      }
      return typeof i18n !== 'undefined' ? i18n.t('dialogs.buttons.next') : 'Next';
    };
    
    const buttonDisabled = isNextButtonDisabled();
    console.log(`🔍 [Next Button Render] Page ${currentPage} - Button disabled: ${buttonDisabled}`);
    console.log(`🔍 [Next Button Render] Disabled prop: ${buttonDisabled ? 'included' : 'omitted'}`);
    console.log(`🔍 [Next Button Render] Expected cursor: ${buttonDisabled ? 'not-allowed' : 'pointer'}`);
    console.log(`🔍 [Next Button Render] Expected background: ${buttonDisabled ? 'rgba(120, 120, 120, 0.5)' : 'rgba(255, 153, 0, 0.9)'}`);
    
    // Add a ref callback to inspect the actual DOM element
    const refCallback = (buttonElement) => {
      if (buttonElement) {
        console.log(`🔍 [DOM Debug] Button element:`, buttonElement);
        console.log(`🔍 [DOM Debug] disabled property:`, buttonElement.disabled);
        console.log(`🔍 [DOM Debug] disabled attribute:`, buttonElement.getAttribute('disabled'));
        console.log(`🔍 [DOM Debug] Has disabled attribute:`, buttonElement.hasAttribute('disabled'));
        console.log(`🔍 [DOM Debug] Background color:`, window.getComputedStyle(buttonElement).backgroundColor);
        console.log(`🔍 [DOM Debug] Cursor:`, window.getComputedStyle(buttonElement).cursor);
      }
    };
    
    return React.createElement('button', {
      className: 'next-button',
      ...(buttonDisabled ? { disabled: true } : {}),
      ref: refCallback,
      style: {
        ...position.css,
        ...processedButtonStyles,
        cursor: buttonDisabled ? 'not-allowed' : 'pointer',
        border: buttonDisabled ? '5px solid #666' : '5px solid #333',
        outline: 'none',
        transition: buttonDisabled ? 'all 0.2s ease' : 'all 0.2s ease, transform 0.2s ease',
        zIndex: '99999',
        pointerEvents: 'auto',
        position: 'absolute',
        backgroundColor: buttonDisabled ? 'rgba(120, 120, 120, 0.5)' : 'rgba(255, 153, 0, 0.9)',
        opacity: buttonDisabled ? 0.5 : 1,
        isolation: 'isolate',
        transform: buttonDisabled ? 'none' : 'scale(1)',
        animation: buttonDisabled ? 'none' : 'nextButtonPulse 2s infinite',
        clip: 'auto',
        clipPath: 'none',
        overflow: 'visible',
        visibility: 'visible',
        display: 'block',
        touchAction: 'manipulation',
        userSelect: 'none'
      },
      onClick: (e) => {
        if (buttonDisabled) {
          console.log('🚫 Next button clicked but disabled');
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        console.log('🚨 Next button clicked!', e);
        console.log('🚨 Current page:', currentPage);
        // console.log('🚨 Total pages:', totalPages);
        // console.log('🚨 Event target:', e.target);
        // console.log('🚨 Button element:', e.currentTarget);
        
        // Stop event propagation to prevent interference
        e.preventDefault();
        e.stopPropagation();
        
        // Hide quiz modal and reset states if it's currently showing
        if (showQuizOverlay) {
          setShowQuizOverlay(false);
          setClickedOption(null);
          setQuizFeedback('');
          console.log('🔄 Quiz modal hidden and states reset');
        }
        
        // Navigate to next page or show quiz
        if (currentPage === 1) {
          // Sync current question from page 1 to page 2
          if (typeof PageUtils !== 'undefined') {
            PageUtils.syncQuestionsBetweenPages(1, 2);
          }
          setCurrentPage(2);
          console.log('🔄 Navigating to page 2');
        } else if (currentPage === 2) {
          // Sync current question from page 2 to page 3
          if (typeof PageUtils !== 'undefined') {
            PageUtils.syncQuestionsBetweenPages(2, 3);
          }
          setCurrentPage(3);
          console.log('🔄 Navigating to page 3');
        } else if (currentPage === 3) {
          // Sync current question from page 3 to page 4
          if (typeof PageUtils !== 'undefined') {
            PageUtils.syncQuestionsBetweenPages(3, 4);
          }
          setCurrentPage(4);
          console.log('🔄 Navigating to page 4');
        } else if (currentPage === 4) {
          // Sync current question from page 4 to page 5
          if (typeof PageUtils !== 'undefined') {
            PageUtils.syncQuestionsBetweenPages(4, 5);
          }
          setCurrentPage(5);
          console.log('🔄 Navigating to page 5');
        } else if (currentPage === 5) {
          // Sync current question from page 5 to page 6
          if (typeof PageUtils !== 'undefined') {
            PageUtils.syncQuestionsBetweenPages(5, 6);
          }
          setCurrentPage(6);
          console.log('🔄 Navigating to page 6');
        } else if (currentPage === 6) {
          // Sync current question from page 6 to page 7
          if (typeof PageUtils !== 'undefined') {
            PageUtils.syncQuestionsBetweenPages(6, 7);
          }
          setCurrentPage(7);
          console.log('🔄 Navigating to page 7');
        } else if (currentPage === 7) {
          // Sync current question from page 7 to page 8
          if (typeof PageUtils !== 'undefined') {
            PageUtils.syncQuestionsBetweenPages(7, 8);
          }
          setCurrentPage(8);
          console.log('🔄 Navigating to page 8');
        } else if (currentPage === 8) {
          // Sync current question from page 8 to page 9 (carry over page)
          if (typeof PageUtils !== 'undefined') {
            PageUtils.syncQuestionsBetweenPages(8, 9);
          }
          setCurrentPage(9);
          console.log('🔄 Navigating to page 9 (Carry Over)');
        } else if (currentPage === 9) {
          // Sync current question from page 9 to page 10 (carry over page)
          if (typeof PageUtils !== 'undefined') {
            PageUtils.syncQuestionsBetweenPages(9, 10);
          }
          setCurrentPage(10);
          console.log('🔄 Navigating to page 10 (Carry Over)');
        } else if (currentPage === 10) {
          // Sync current question from page 10 to page 11 (quiz page)
          if (typeof PageUtils !== 'undefined') {
            PageUtils.syncQuestionsBetweenPages(10, 11);
          }
          setCurrentPage(11);
          console.log('🔄 Navigating to page 11 (Quiz)');
        } else if (currentPage === 11) {
          // Check tens column value to determine navigation path (same logic as page 12)
          const currentQuestion = Grid1Utils.getCurrentQuestion();
          let tensColumnValue = 0;
          
          if (currentQuestion) {
            // Calculate tens column value directly from question data
            // Calculate tenscarry (from ones column overflow)
            const onesSum = (currentQuestion.first_number % 10) + 
                           (currentQuestion.second_number % 10) + 
                           (currentQuestion.third_number ? (currentQuestion.third_number % 10) : 0);
            const tenscarry = Math.floor(onesSum / 10) * 10;
            
            // Calculate tens digits multiplied by 10
            const firstTens = Math.floor(currentQuestion.first_number / 10) % 10;
            const secondTens = Math.floor(currentQuestion.second_number / 10) % 10;
            const thirdTens = currentQuestion.third_number ? Math.floor(currentQuestion.third_number / 10) % 10 : 0;
            
            // Calculate tens column value based on number of numbers
            if (currentQuestion.third_number) {
              // 3 numbers: tenscarry + (firstTens * 10) + (secondTens * 10) + (thirdTens * 10)
              tensColumnValue = tenscarry + (firstTens * 10) + (secondTens * 10) + (thirdTens * 10);
            } else {
              // 2 numbers: tenscarry + (firstTens * 10) + (secondTens * 10)
              tensColumnValue = tenscarry + (firstTens * 10) + (secondTens * 10);
            }
          }
          
          console.log(`🔄 Page 11: Tens column value = ${tensColumnValue}`);
          
          if (tensColumnValue < 90) {
            // No carry over needed - skip to page 15
            if (typeof PageUtils !== 'undefined') {
              PageUtils.syncQuestionsBetweenPages(11, 15);
            }
            setCurrentPage(15);
            console.log(`🔄 Navigating to page 15 (No carry over needed, tens value ${tensColumnValue} < 90)`);
          } else {
            // Carry over needed - go to page 12 (replica of page 10)
          if (typeof PageUtils !== 'undefined') {
            PageUtils.syncQuestionsBetweenPages(11, 12);
          }
          setCurrentPage(12);
            console.log(`🔄 Navigating to page 12 (Carry over needed, tens value ${tensColumnValue} >= 90)`);
          }
        } else if (currentPage === 12) {
          // Check tens column value to determine navigation path
          // Note: Page 12 may be bypassed in normal flow since page 11 now has conditional logic
          const currentQuestion = Grid1Utils.getCurrentQuestion();
          let tensColumnValue = 0;
          
          if (currentQuestion) {
            // Calculate tens column value directly from question data
            // Calculate tenscarry (from ones column overflow)
            const onesSum = (currentQuestion.first_number % 10) + 
                           (currentQuestion.second_number % 10) + 
                           (currentQuestion.third_number ? (currentQuestion.third_number % 10) : 0);
            const tenscarry = Math.floor(onesSum / 10) * 10;
            
            // Calculate tens digits multiplied by 10
            const firstTens = Math.floor(currentQuestion.first_number / 10) % 10;
            const secondTens = Math.floor(currentQuestion.second_number / 10) % 10;
            const thirdTens = currentQuestion.third_number ? Math.floor(currentQuestion.third_number / 10) % 10 : 0;
            
            // Calculate tens column value based on number of numbers
            if (currentQuestion.third_number) {
              // 3 numbers: tenscarry + (firstTens * 10) + (secondTens * 10) + (thirdTens * 10)
              tensColumnValue = tenscarry + (firstTens * 10) + (secondTens * 10) + (thirdTens * 10);
            } else {
              // 2 numbers: tenscarry + (firstTens * 10) + (secondTens * 10)
              tensColumnValue = tenscarry + (firstTens * 10) + (secondTens * 10);
            }
          }
          
          console.log(`🔄 Page 12: Tens column value = ${tensColumnValue}`);
          
          if (tensColumnValue < 90) {
            // No carry over needed - skip to page 15
            if (typeof PageUtils !== 'undefined') {
              PageUtils.syncQuestionsBetweenPages(12, 15);
            }
            setCurrentPage(15);
            console.log(`🔄 Navigating to page 15 (No carry over needed, tens value ${tensColumnValue} < 90)`);
          } else {
            // Carry over needed - go to page 13 (normal flow)
            if (typeof PageUtils !== 'undefined') {
              PageUtils.syncQuestionsBetweenPages(12, 13);
            }
            setCurrentPage(13);
            console.log(`🔄 Navigating to page 13 (Carry over needed, tens value ${tensColumnValue} >= 90)`);
          }
        } else if (currentPage === 13) {
          // Sync current question from page 13 to page 14 (exact replica of page 12)
          if (typeof PageUtils !== 'undefined') {
            PageUtils.syncQuestionsBetweenPages(13, 14);
          }
          setCurrentPage(14);
          console.log('🔄 Navigating to page 14 (Exact replica of page 12)');
        } else if (currentPage === 14) {
          // Sync current question from page 14 to page 15 (exact replica of page 12)
          if (typeof PageUtils !== 'undefined') {
            PageUtils.syncQuestionsBetweenPages(14, 15);
          }
          setCurrentPage(15);
          console.log('🔄 Navigating to page 15 (Exact replica of page 12)');
        } else if (currentPage === 15) {
          // Sync current question from page 15 to page 16 (exact replica of page 15)
          if (typeof PageUtils !== 'undefined') {
            PageUtils.syncQuestionsBetweenPages(15, 16);
          }
          setCurrentPage(16);
          console.log('🔄 Navigating to page 16 (Exact replica of page 15)');
        } else if (currentPage === 16) {
          // Sync current question from page 16 to page 17 (exact replica of page 16 with quiz modal)
          if (typeof PageUtils !== 'undefined') {
            PageUtils.syncQuestionsBetweenPages(16, 17);
          }
          setCurrentPage(17);
          console.log('🔄 Navigating to page 17 (Exact replica of page 16 with quiz modal)');
        } else if (currentPage === 17) {
          // Sync current question from page 17 to page 18 (exact replica of page 16)
          if (typeof PageUtils !== 'undefined') {
            PageUtils.syncQuestionsBetweenPages(17, 18);
          }
          setCurrentPage(18);
          console.log('🔄 Navigating to page 18 (Exact replica of page 16)');
        } else if (currentPage === 18) {
          // Sync current question from page 18 to page 19 (exact replica of page 18)
          if (typeof PageUtils !== 'undefined') {
            PageUtils.syncQuestionsBetweenPages(18, 19);
          }
          setCurrentPage(19);
          console.log('🔄 Navigating to page 19 (Exact replica of page 18)');
        } else if (currentPage === 19) {
          // Sync current question from page 19 to page 20 (exact replica of page 19)
          if (typeof PageUtils !== 'undefined') {
            PageUtils.syncQuestionsBetweenPages(19, 20);
          }
          setCurrentPage(20);
          console.log('🔄 Navigating to page 20 (Exact replica of page 19)');
        } else if (currentPage === 20) {
          // Handle Try New vs Start Again functionality
          const currentQuestionIndex = PageUtils.getCurrentQuestionIndex(20);
          const hasMoreQuestions = typeof QUESTIONS !== 'undefined' && currentQuestionIndex < QUESTIONS.length - 1;
          
          if (hasMoreQuestions) {
            // Try New - load next question and go to page 1
            const nextQuestionIndex = currentQuestionIndex + 1;
            console.log(`🔄 Try New: Loading question ${nextQuestionIndex + 1} and going to page 1`);
            
            // Reset all flags when starting a new question
            setFirstNumberFlag(false);
            setSecondNumberFlag(false);
            setThirdNumberFlag(false);
            setSeparatorFlag(false);
            setHasAnimated(false);
            setGrid1Flag(false);
            setP2grid1animationcomplete(false);
            setGrid1answerflag(false);
            setShowQuizOverlay(false);
            setShowGrid2(false);
            setCurrentHighlightFocus('R1C2'); // Reset interactive highlighting to start from first number
            
            // Reset global flag
            if (typeof window !== 'undefined') {
              window.grid1answerflag = false;
            }
            
            // Load the next question on page 1
            if (typeof Grid1Utils !== 'undefined') {
              Grid1Utils.loadQuestion(nextQuestionIndex, 1);
            }
            
            // Reset completed quiz pages for the new question
            setCompletedQuizPages(new Set());
            
            // Navigate to page 1
            setCurrentPage(1);
            console.log(`🔄 Try New: Started with question ${nextQuestionIndex + 1} on page 1`);
          } else {
            // Start Again - go back to first question and page 1
            console.log('🔄 Start Again: Going back to question 1 on page 1');
            
            // Reset all flags when starting again
            setFirstNumberFlag(false);
            setSecondNumberFlag(false);
            setThirdNumberFlag(false);
            setSeparatorFlag(false);
            setHasAnimated(false);
            setGrid1Flag(false);
            setP2grid1animationcomplete(false);
            setGrid1answerflag(false);
            setShowQuizOverlay(false);
            setShowGrid2(false);
            setCurrentHighlightFocus('R1C2'); // Reset interactive highlighting to start from first number
            
            // Reset global flag
            if (typeof window !== 'undefined') {
              window.grid1answerflag = false;
            }
            
            // Load the first question on page 1
            if (typeof Grid1Utils !== 'undefined') {
              Grid1Utils.loadQuestion(0, 1);
            }
            
            // Reset completed quiz pages
            setCompletedQuizPages(new Set());
            
            // Navigate to page 1
            setCurrentPage(1);
            console.log('🔄 Start Again: Restarted with question 1 on page 1');
          }
        } else {
          // For future pages, go to next page
          const nextPage = currentPage + 1;
          if (nextPage <= totalPages) {
            setCurrentPage(nextPage);
            console.log(`🔄 Navigating to page ${nextPage}`);
          }
        }
      },
      onMouseEnter: (e) => {
        e.target.style.transform = 'scale(1.05)';
        e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
      },
      onMouseLeave: (e) => {
        e.target.style.transform = 'scale(1)';
        e.target.style.boxShadow = 'none';
      },
      'data-grid-position': 'next-button'
    }, getButtonText());
  };

  // Create previous button component
  const PreviousButtonComponent = () => {
    // Show previous button only on page 2 and beyond
    if (currentPage === 1) {
      return null; // Don't show on page 1
    }
    
    const position = gridPositions.getScreenElement('previousButton');
    const pageElement = GridPositionUtils.getPageElement(currentPage, 'previous-button');
    const buttonElement = pageElement || StandardPositions.previousButton;
    
    // Process gc styles for the button
    const processedButtonStyles = GridCellFontUtils.processGcStyles(buttonElement.props);
    
    // Debug logging
    console.log('🔍 [Previous Button] Rendering on page:', currentPage);
    console.log('🔍 [Previous Button] Position:', position);
    console.log('🔍 [Previous Button] Button element:', buttonElement);
    
    if (!position) {
      console.error('🔴 [Previous Button] Position not found!');
      return null;
    }
    
    return React.createElement('button', {
      className: 'previous-button',
      style: {
        ...position.css,
        ...processedButtonStyles,
        cursor: 'pointer',
        border: '5px solid cyan',
        outline: 'none',
        transition: 'all 0.2s ease',
        zIndex: '99999',
        pointerEvents: 'auto',
        position: 'absolute',
        backgroundColor: 'rgba(102, 153, 204, 0.9)',
        isolation: 'isolate',
        transform: 'none',
        clip: 'auto',
        clipPath: 'none',
        overflow: 'visible',
        visibility: 'visible',
        display: 'block',
        touchAction: 'manipulation',
        userSelect: 'none'
      },
      onClick: (e) => {
        console.log('🚨 Previous button clicked!', e);
        console.log('🚨 Current page:', currentPage);
        
        // Stop event propagation to prevent interference
        e.preventDefault();
        e.stopPropagation();
        
        // Navigate to previous page
        if (currentPage > 1) {
          if (currentPage === 15) {
            // Check tens column value to determine navigation path (same logic as page 12)
            const currentQuestion = Grid1Utils.getCurrentQuestion();
            let tensColumnValue = 0;
            
            if (currentQuestion) {
              // Calculate tens column value directly from question data
              // Calculate tenscarry (from ones column overflow)
              const onesSum = (currentQuestion.first_number % 10) + 
                             (currentQuestion.second_number % 10) + 
                             (currentQuestion.third_number ? (currentQuestion.third_number % 10) : 0);
              const tenscarry = Math.floor(onesSum / 10) * 10;
              
              // Calculate tens digits multiplied by 10
              const firstTens = Math.floor(currentQuestion.first_number / 10) % 10;
              const secondTens = Math.floor(currentQuestion.second_number / 10) % 10;
              const thirdTens = currentQuestion.third_number ? Math.floor(currentQuestion.third_number / 10) % 10 : 0;
              
              // Calculate tens column value based on number of numbers
              if (currentQuestion.third_number) {
                // 3 numbers: tenscarry + (firstTens * 10) + (secondTens * 10) + (thirdTens * 10)
                tensColumnValue = tenscarry + (firstTens * 10) + (secondTens * 10) + (thirdTens * 10);
              } else {
                // 2 numbers: tenscarry + (firstTens * 10) + (secondTens * 10)
                tensColumnValue = tenscarry + (firstTens * 10) + (secondTens * 10);
              }
            }
            
            console.log(`🔍 [Page 15 Previous] Tens column value: ${tensColumnValue}`);
            
            if (tensColumnValue < 90) {
              // No carry needed - go back directly to page 11 (skipping pages 12-14)
              if (typeof PageUtils !== 'undefined') {
                PageUtils.syncQuestionsBetweenPages(15, 11);
              }
              setCurrentPage(11);
              console.log('🔄 Navigating back to page 11 (No carry over needed, skipping pages 12-14)');
            } else {
              // Carry needed - go back to page 14 (normal flow)
              if (typeof PageUtils !== 'undefined') {
                PageUtils.syncQuestionsBetweenPages(15, 14);
              }
              setCurrentPage(14);
              console.log('🔄 Navigating back to page 14 (Carry over needed, normal flow)');
            }
          } else {
            // Normal navigation for all other pages
          if (typeof PageUtils !== 'undefined') {
            PageUtils.syncQuestionsBetweenPages(currentPage, currentPage - 1);
          }
          setCurrentPage(currentPage - 1);
          console.log(`🔄 Navigating to page ${currentPage - 1}`);
          }
        }
      },
      onMouseEnter: (e) => {
        e.target.style.transform = 'scale(1.05)';
        e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
      },
      onMouseLeave: (e) => {
        e.target.style.transform = 'scale(1)';
        e.target.style.boxShadow = 'none';
      },
      'data-grid-position': 'previous-button'
    }, typeof i18n !== 'undefined' ? i18n.t('dialogs.buttons.previous') : 'Previous');
  };

  // Create page indicator component
  const PageIndicatorComponent = () => {
    // Check if page progress indicator should be shown based on APP_CONFIG
    if (typeof window.APP_CONFIG !== 'undefined' && !window.APP_CONFIG.SHOW_PAGE_PROGRESS) {
      return null;
    }
    
    return React.createElement('div', {
      className: 'page-indicator',
      style: {
        position: 'absolute',
        top: '10px',
        right: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '20px',
        fontSize: '16px',
        fontWeight: 'bold',
        zIndex: '1001',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
        pointerEvents: 'auto'
      }
    }, `Page ${currentPage} of ${totalPages}`);
  };

  // Create grid1 component with flexible cell sizing
  // Interactive highlighting system for grid cells - unified system
  const startInteractiveHighlighting = (gridContainer, questionData) => {
    console.log('🔸 [Interactive] Starting unified interactive highlighting system');
    console.log('🔸 [Interactive] Grid container:', gridContainer);
    console.log('🔸 [Interactive] Question data:', questionData);
    
    if (!gridContainer || !questionData) {
      console.log('🔸 [Interactive] Missing grid container or question data');
      return;
    }
    
    // Function to apply highlight styling
    const applyHighlight = (cellPosition) => {
      const row = cellPosition.charAt(1); // Extract row number from R1C2 format
      const cellElement = gridContainer.querySelector(`[data-cell="cell_${row}_2"]`);
      
      if (cellElement) {
        // Add highlight class to prevent hover interference
        cellElement.classList.add('highlighted-cell');
        
        // Apply highlight styles with !important via setProperty
        cellElement.style.setProperty('border', '6px solid #FFD700', 'important');
        cellElement.style.setProperty('background-color', 'rgba(255, 255, 0, 0.3)', 'important');
        cellElement.style.setProperty('cursor', 'pointer', 'important');
        cellElement.style.setProperty('transition', 'all 0.3s ease', 'important');
        cellElement.style.setProperty('z-index', '450', 'important');
        cellElement.style.setProperty('pointer-events', 'auto', 'important');
        
        console.log('🔸 [Interactive] Applied highlight to', cellPosition, 'cell:', cellElement);
        
        // Debug: Check if styles are actually applied
        setTimeout(() => {
          const computedStyle = window.getComputedStyle(cellElement);
          console.log('🔸 [Interactive] Computed styles after highlight:', {
            border: computedStyle.border,
            backgroundColor: computedStyle.backgroundColor,
            cursor: computedStyle.cursor,
            zIndex: computedStyle.zIndex,
            pointerEvents: computedStyle.pointerEvents,
            visibility: computedStyle.visibility,
            display: computedStyle.display,
            opacity: computedStyle.opacity
          });
        }, 100);
        
        return cellElement;
      } else {
        console.log('🔸 [Interactive] Could not find cell element for', cellPosition);
        console.log('🔸 [Interactive] Available cells:', Array.from(gridContainer.querySelectorAll('[data-cell]')).map(el => el.getAttribute('data-cell')));
        return null;
      }
    };
    
    // Function to remove highlight styling
    const removeHighlight = (cellPosition) => {
      const row = cellPosition.charAt(1); // Extract row number from R1C2 format
      const cellElement = gridContainer.querySelector(`[data-cell="cell_${row}_2"]`);
      
      if (cellElement) {
        // Remove highlight class
        cellElement.classList.remove('highlighted-cell');
        
        // Remove highlight styles
        cellElement.style.removeProperty('border');
        cellElement.style.removeProperty('background-color');
        cellElement.style.removeProperty('cursor');
        cellElement.style.removeProperty('transition');
        cellElement.style.removeProperty('z-index');
        cellElement.style.removeProperty('pointer-events');
        
        console.log('🔸 [Interactive] Removed highlight from', cellPosition);
      }
    };
    
    // Function to update highlight based on current focus
    const updateHighlight = () => {
      // Remove all existing highlights
      ['R1C2', 'R2C2', 'R3C2'].forEach(cell => {
        removeHighlight(cell);
      });
      
      // Apply highlight to current focus (only if conditions are met)
      if (currentHighlightFocus && currentPage === 2 && !grid1Flag) {
        applyHighlight(currentHighlightFocus);
        console.log(`🔸 [Interactive] Updated highlight to: ${currentHighlightFocus}`);
      }
    };
    
    // Set up initial highlight
    updateHighlight();
    
    // Store reference to update function for external use
    gridContainer._updateHighlight = updateHighlight;
    
    console.log('🔸 [Interactive] Unified highlighting system initialized');
  };

  // Standalone highlight update function
  const updateHighlightDirectly = (gridContainer, focusPosition) => {
    console.log('🔸 [Interactive] Updating highlight directly for position:', focusPosition);
    
    // Function to apply highlight styling
    const applyHighlight = (cellPosition) => {
      const row = cellPosition.charAt(1);
      const cellElement = gridContainer.querySelector(`[data-cell="cell_${row}_2"]`);
      
      if (cellElement) {
        cellElement.classList.add('highlighted-cell');
        cellElement.style.setProperty('border', '6px solid #FFD700', 'important');
        cellElement.style.setProperty('background-color', 'rgba(255, 255, 0, 0.3)', 'important');
        cellElement.style.setProperty('cursor', 'pointer', 'important');
        cellElement.style.setProperty('transition', 'all 0.3s ease', 'important');
        cellElement.style.setProperty('z-index', '450', 'important');
        cellElement.style.setProperty('pointer-events', 'auto', 'important');
        
        console.log('🔸 [Interactive] Applied highlight to', cellPosition, 'cell:', cellElement);
        return true;
      }
      return false;
    };
    
    // Function to remove highlight styling
    const removeHighlight = (cellPosition) => {
      const row = cellPosition.charAt(1);
      const cellElement = gridContainer.querySelector(`[data-cell="cell_${row}_2"]`);
      
      if (cellElement) {
        cellElement.classList.remove('highlighted-cell');
        cellElement.style.removeProperty('border');
        cellElement.style.removeProperty('background-color');
        cellElement.style.removeProperty('cursor');
        cellElement.style.removeProperty('transition');
        cellElement.style.removeProperty('z-index');
        cellElement.style.removeProperty('pointer-events');
        
        console.log('🔸 [Interactive] Removed highlight from', cellPosition);
        return true;
      }
      return false;
    };
    
    // Remove all existing highlights
    ['R1C2', 'R2C2', 'R3C2'].forEach(cell => {
      removeHighlight(cell);
    });
    
    // Apply highlight to current focus
    if (focusPosition) {
      applyHighlight(focusPosition);
    }
  };

  // Effect to update highlighting when currentHighlightFocus changes
  React.useEffect(() => {
    if (currentPage === 2 && !grid1Flag) {
      console.log(`🔸 [Interactive] Focus state changed to: ${currentHighlightFocus}`);
      
      // Wait for Grid1 to be ready before attempting highlighting
      const waitForGrid1 = () => {
        const gridContainer = document.querySelector('[data-grid-position="grid1"]');
        
        if (gridContainer && gridContainer.children.length > 0) {
          console.log('🔸 [Interactive] Grid container found and ready:', gridContainer);
          console.log('🔸 [Interactive] Has _updateHighlight function:', !!gridContainer._updateHighlight);
          
          if (gridContainer._updateHighlight) {
            console.log('🔸 [Interactive] Calling _updateHighlight function');
            gridContainer._updateHighlight();
          } else {
            console.log('🔸 [Interactive] No _updateHighlight function found - updating directly');
            updateHighlightDirectly(gridContainer, currentHighlightFocus);
          }
        } else {
          console.log('🔸 [Interactive] Grid container not ready yet, retrying in 100ms...');
          setTimeout(waitForGrid1, 100);
        }
      };
      
      // Start checking for Grid1 readiness
      waitForGrid1();
    }
  }, [currentHighlightFocus, grid1Flag, currentPage]);

  const Grid1Component = () => {
    const pageElement = GridPositionUtils.getPageElement(currentPage, 'grid1');
    if (!pageElement) {
      console.error(`Grid1 not found on page ${currentPage}`);
      return null;
    }
    
    const coordinates = gridPositions.calculateGridCoordinates(pageElement);
    const position = gridPositions.convertToCSS(coordinates, 'grid1', 'page', 'grid');
    const gridElement = pageElement;
    
    const [forceUpdate, setForceUpdate] = React.useState(0);
    
    // Load first question if no question is loaded
    React.useEffect(() => {
      // console.log('🔍 [Grid1] Effect running, checking for question data...');
      // console.log('🔍 [Grid1] QUESTIONS available:', typeof QUESTIONS !== 'undefined');
      // console.log('🔍 [Grid1] Grid1Utils available:', typeof Grid1Utils !== 'undefined');
      // console.log('🔍 [Grid1] Current question data:', gridElement.props.questionData);
      
      if (!gridElement.props.questionData && typeof Grid1Utils !== 'undefined' && typeof QUESTIONS !== 'undefined') {
        // console.log('🔍 [Grid1] Loading first question on both pages...');
        Grid1Utils.loadQuestion(0, 1); // Load on page 1
        Grid1Utils.loadQuestion(0, 2); // Load on page 2
        setForceUpdate(prev => prev + 1);
      }
    }, [appUpdateTrigger]); // Add dependency on appUpdateTrigger
    
    // Animation effect for page 2 - only if grid1Flag is false
    React.useEffect(() => {
      if (currentPage === 2 && gridElement.props.animateOnLoad && typeof anime !== 'undefined' && !grid1Flag) {
        // console.log('🎬 [Grid1] Animation effect called - currentPage:', currentPage);
        // console.log('🎬 [Grid1] animateOnLoad:', gridElement.props.animateOnLoad);
        // console.log('🎬 [Grid1] anime available:', typeof anime !== 'undefined');
        // console.log('🎬 [Grid1] hasAnimated:', hasAnimated);
        // console.log('🎬 [Grid1] animatedPosition:', animatedPosition);
        
        // Function to try finding the grid element with different selectors
        const findGridElement = () => {
          // Try specific selectors first
          const specificSelectors = [
            `[data-grid-position="grid1"]`,
            `[data-element-name="grid1"]`,
            `#grid1`,
            `.grid1-container`,
            `div[data-grid-name="grid1"]`
          ];
          
          for (const selector of specificSelectors) {
            const element = document.querySelector(selector);
            if (element && !element.id.includes('info-panel') && !element.id.includes('debug')) {
              // console.log('🎬 [Grid1] Found grid element with selector:', selector, element);
              return element;
            }
          }
          
          // Try to find by class or content, avoiding debug panels
          const allDivs = document.querySelectorAll('div[style*="position: absolute"]');
          for (const div of allDivs) {
            // Skip debug panels and other unwanted elements
            if (div.id && (div.id.includes('info-panel') || div.id.includes('debug') || div.id.includes('panel'))) {
              continue;
            }
            
            // Look for grid-like characteristics
            const hasGridContent = div.innerHTML.includes('143') || div.innerHTML.includes('278') || div.innerHTML.includes('396');
            const hasGridStructure = div.children.length > 0 && div.children[0].style && div.children[0].style.position === 'absolute';
            
            if (hasGridContent || hasGridStructure) {
              // console.log('🎬 [Grid1] Found grid element by content analysis:', div);
              return div;
            }
          }
          
          return null;
        };
        
        // Function to wait for DOM element and animate
        const waitForElementAndAnimate = (attempts = 0) => {
          const maxAttempts = 20; // Try for up to 2 seconds
          const gridContainer = findGridElement();
          
          // console.log(`🎬 [Grid1] Attempt ${attempts + 1}/${maxAttempts} - Grid container found:`, gridContainer);
          
          if (gridContainer) {
            // console.log('🎬 [Grid1] Grid element found! Starting animation...');
            
            // Get animation configuration
            const { animationDelay, animationDuration, animationEasing, targetPosition } = gridElement.props;
            const [targetRow, targetCol] = targetPosition;
            
            // Calculate target position in CSS percentages
            const targetTop = ((targetRow - 1) / 72) * 100;
            const targetLeft = ((targetCol - 1) / 128) * 100;
            
            // Set initial position (current position from coordinates)
            const initialTop = ((coordinates[0] - 1) / 72) * 100;
            const initialLeft = ((coordinates[1] - 1) / 128) * 100;
            
            // console.log(`🎬 [Grid1] Animation config:`, {
            //   delay: animationDelay,
            //   duration: animationDuration,
            //   easing: animationEasing,
            //   coordinates: coordinates,
            //   targetPosition: targetPosition,
            //   from: { top: initialTop, left: initialLeft },
            //   to: { top: targetTop, left: targetLeft },
            //   hasAnimated: hasAnimated
            // });
            
            // Function to start interactive highlighting after delay
            const startInteractiveHighlightingAfterDelay = () => {
              setTimeout(() => {
                console.log('🔸 [Interactive] Starting interactive highlighting system after Grid2 completion');
                
                // Get fresh grid container reference (in case component re-rendered)
                const freshGridContainer = findGridElement();
                if (freshGridContainer) {
                  console.log('🔸 [Interactive] Using fresh grid container reference:', freshGridContainer);
                  startInteractiveHighlighting(freshGridContainer, gridElement.props.questionData);
                } else {
                  console.error('🔸 [Interactive] Could not find fresh grid container for highlighting');
                }
              }, 50); // Wait 50ms to allow Grid2 to render and animate before starting interactive highlighting
            };
            
            // Check p2grid1animationcomplete flag to determine animation behavior
            if (p2grid1animationcomplete) {
              // p2grid1animationcomplete = true: Start at original position and animate to target
              // console.log('🎬 [Grid1] p2grid1animationcomplete = true - Starting at original position and animating to target');
              
              // Set initial position (original position from coordinates)
              const initialTop = ((coordinates[0] - 1) / 72) * 100;
              const initialLeft = ((coordinates[1] - 1) / 128) * 100;
              
              // Position grid at start coordinates first
              gridContainer.style.top = `${initialTop}%`;
              gridContainer.style.left = `${initialLeft}%`;
              
              // console.log('🎬 [Grid1] Grid positioned at start coordinates:', { top: `${initialTop}%`, left: `${initialLeft}%` });
              
              // Start animation after delay
              setTimeout(() => {
                // console.log('🎬 [Grid1] Starting animation from start to target...');
                anime({
                  targets: gridContainer,
                  top: `${targetTop}%`,
                  left: `${targetLeft}%`,
                  duration: animationDuration,
                  easing: animationEasing,
                  begin: () => {
                    // console.log('🎬 [Grid1] Animation started!');
                  },
                  complete: () => {
                    // console.log('🎬 [Grid1] Animation completed!');
                    
                    // Persist the animated position to prevent reversion on re-renders
                    setAnimatedPosition({ top: `${targetTop}%`, left: `${targetLeft}%` });
                    setHasAnimated(true);
                    // console.log('🎬 [Grid1] Animated position persisted:', { top: `${targetTop}%`, left: `${targetLeft}%` });
                    
                    // Start interactive highlighting after Grid2 has time to render and animate
                    startInteractiveHighlightingAfterDelay();
                  }
                });
              }, animationDelay);
            } else {
              // p2grid1animationcomplete = false: Place directly at target without animation
              // console.log('🎬 [Grid1] p2grid1animationcomplete = false - Placing directly at target position');
              
              // Position grid directly at target coordinates
              gridContainer.style.top = `${targetTop}%`;
              gridContainer.style.left = `${targetLeft}%`;
              
              // Persist the position
              setAnimatedPosition({ top: `${targetTop}%`, left: `${targetLeft}%` });
              setHasAnimated(true);
              // console.log('🎬 [Grid1] Grid positioned directly at target:', { top: `${targetTop}%`, left: `${targetLeft}%` });
              
              // Set p2grid1animationcomplete flag to true since we've "completed" the positioning
              setP2grid1animationcomplete(true);
              // console.log('🎬 [Grid1] p2grid1animationcomplete set to true');
              
              // Start interactive highlighting after Grid2 has time to render and animate
              startInteractiveHighlightingAfterDelay();
            }
          } else if (attempts < maxAttempts - 1) {
            console.log(`🎬 [Grid1] Grid element not found yet, retrying in 100ms...`);
            // console.log('🎬 [Grid1] All elements in DOM:', document.querySelectorAll('*').length);
            // console.log('🎬 [Grid1] All divs:', document.querySelectorAll('div').length);
            
            // Wait 100ms and try again
            setTimeout(() => waitForElementAndAnimate(attempts + 1), 100);
          } else {
            console.error('🎬 [Grid1] Could not find grid element after', maxAttempts, 'attempts');
            console.log('🎬 [Grid1] Final DOM state:', document.body.innerHTML);
          }
        };
        
        // Start trying to find and animate the element
        waitForElementAndAnimate();
      }
    }, [currentPage, forceUpdate]); // Trigger when page changes or component updates
    
    // [REMOVED] - Duplicate highlighting system that conflicted with startInteractiveHighlighting
    // The startInteractiveHighlighting function now handles all highlighting logic
    
    // console.log('🔍 [Grid1] Grid configuration:', gridElement.props);
    
    // Calculate cell positions and sizes
    const calculateCellLayout = () => {
      const { gridStructure, defaultCellSize, columnOverrides, rowOverrides, cellOverrides } = gridElement.props;
      const { columns, rows } = gridStructure;
      const cells = [];
      
      // console.log('🔍 [Grid1] calculateCellLayout called');
      // console.log('🔍 [Grid1] Grid structure:', gridStructure);
      // console.log('🔍 [Grid1] Column overrides:', columnOverrides);
      // console.log('🔍 [Grid1] Current question:', gridElement.props.questionData);
      
      // Calculate total grid width accounting for column overrides
      let totalGridWidthInCells = 0;
      for (let col = 1; col <= columns; col++) {
        const colWidth = columnOverrides[`col${col}`]?.columns || defaultCellSize.columns;
        totalGridWidthInCells += colWidth;
      }
      // console.log('🔍 [Grid1] Total grid width in cells:', totalGridWidthInCells);
      
      // Calculate total grid height
      const totalGridHeightInCells = rows * defaultCellSize.rows;
      
      // Calculate cell positions
      let currentRow = 0;
      for (let row = 0; row < rows; row++) {
        let currentCol = 0;
        let rowHeight = defaultCellSize.rows; // Default row height
        
        // Check if this is a separator row and if separator line is enabled
        const isSeparatorRow = typeof Grid1Utils !== 'undefined' ? Grid1Utils.isSeparatorRow(row + 1) : false;
        const showSeparatorLine = gridElement.props.showSeparatorLine !== false; // Default to true
        
        if (isSeparatorRow && showSeparatorLine) {
          // For separator rows, create one cell that spans the full width
          const cellKey = `separator_${row + 1}`;
          // Check for row overrides first, then use default
          const cellHeight = rowOverrides[`row${row + 1}`]?.rows || defaultCellSize.rows;
          // console.log(`🔍 [Grid1] Separator Row ${row + 1}: height=${cellHeight} (override: ${rowOverrides[`row${row + 1}`]?.rows}, default: ${defaultCellSize.rows})`);
          
          const cellTop = (currentRow / totalGridHeightInCells) * 100;
          const cellLeft = 0; // Start at left edge
          const cellHeightPercent = (cellHeight / totalGridHeightInCells) * 100;
          const cellWidthPercent = 100; // Span full width
          
          // console.log(`🔍 [Grid1] Separator Row ${row + 1}: full width spanning`);
          
          // Create separator cell style
          let cellStyle = {
            position: 'absolute',
            top: `${cellTop}%`,
            left: `${cellLeft}%`,
            width: `${cellWidthPercent}%`,
            height: `${cellHeightPercent}%`,
            backgroundColor: 'transparent',
            border: 'none',
            padding: '7px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          };
          
          // Apply custom separator row styles if available
          if (gridElement.props.separatorRowStyles) {
            Object.assign(cellStyle, gridElement.props.separatorRowStyles);
            // console.log('🔍 [Grid1] Separator row styles applied:', gridElement.props.separatorRowStyles);
            // console.log('🔍 [Grid1] Final separator cell style:', cellStyle);
          }
          
          cells.push({
            key: cellKey,
            row: row + 1,
            col: 0, // Spans all columns
            content: '',
            isSeparator: true,
            style: cellStyle
          });
          
          rowHeight = cellHeight;
        } else if (isSeparatorRow && !showSeparatorLine) {
          // Separator row with line disabled - treat as regular row but skip content
          currentCol = 0;
          
          for (let col = 0; col < columns; col++) {
            const cellKey = `cell_${row + 1}_${col + 1}`;
            
            // Get cell size (check overrides)
            const cellHeight = cellOverrides[cellKey]?.rows || 
                            rowOverrides[`row${row + 1}`]?.rows || 
                            columnOverrides[`col${col + 1}`]?.rows || 
                            defaultCellSize.rows;
                            
            const cellWidth = cellOverrides[cellKey]?.columns || 
                           rowOverrides[`row${row + 1}`]?.columns || 
                           columnOverrides[`col${col + 1}`]?.columns || 
                           defaultCellSize.columns;
            
            // Track the maximum height in this row
            rowHeight = Math.max(rowHeight, cellHeight);
            
            // Calculate position percentages within the grid
            const cellTop = (currentRow / totalGridHeightInCells) * 100;
            const cellLeft = (currentCol / totalGridWidthInCells) * 100;
            const cellHeightPercent = (cellHeight / totalGridHeightInCells) * 100;
            const cellWidthPercent = (cellWidth / totalGridWidthInCells) * 100;
            
            // Create cell style (empty cell for separator row)
            let cellStyle = {
              position: 'absolute',
              top: `${cellTop}%`,
              left: `${cellLeft}%`,
              width: `${cellWidthPercent}%`,
              height: `${cellHeightPercent}%`,
              backgroundColor: 'transparent',
              border: 'none'
            };
            
            cells.push({
              key: cellKey,
              row: row + 1,
              col: col + 1,
              content: '', // Empty content for disabled separator row
              isSeparator: false,
              style: cellStyle
            });
            
            // Move to the next column position
            currentCol += cellWidth;
          }
        } else {
          // For regular rows, create individual cells
          // Reset currentCol at the beginning of each row
          currentCol = 0;
          
          for (let col = 0; col < columns; col++) {
            const cellKey = `cell_${row + 1}_${col + 1}`;
            
            // Get cell size (check overrides)
            const cellHeight = cellOverrides[cellKey]?.rows || 
                            rowOverrides[`row${row + 1}`]?.rows || 
                            columnOverrides[`col${col + 1}`]?.rows || 
                            defaultCellSize.rows;
                            
            const cellWidth = cellOverrides[cellKey]?.columns || 
                           rowOverrides[`row${row + 1}`]?.columns || 
                           columnOverrides[`col${col + 1}`]?.columns || 
                           defaultCellSize.columns;
            
            // console.log(`🔍 [Grid1] Cell ${row + 1},${col + 1}: width=${cellWidth}, height=${cellHeight}`);
            // console.log(`🔍 [Grid1] Cell ${row + 1},${col + 1} - Override key: col${col + 1}, Override value:`, columnOverrides[`col${col + 1}`]);
            // console.log(`🔍 [Grid1] Cell ${row + 1},${col + 1} - totalGridWidthInCells: ${totalGridWidthInCells}`);
            
            // Track the maximum height in this row
            rowHeight = Math.max(rowHeight, cellHeight);
            
            // Calculate position percentages within the grid
            const cellTop = (currentRow / totalGridHeightInCells) * 100;
            const cellLeft = (currentCol / totalGridWidthInCells) * 100;
            const cellHeightPercent = (cellHeight / totalGridHeightInCells) * 100;
            const cellWidthPercent = (cellWidth / totalGridWidthInCells) * 100;
            
            // Get cell content
            const cellContent = typeof Grid1Utils !== 'undefined' ? Grid1Utils.getCellContent(row + 1, col + 1) : '';
            
            // console.log(`🔍 [Grid1] Cell ${row + 1},${col + 1} content: "${cellContent}" at position left=${cellLeft.toFixed(2)}%, width=${cellWidthPercent.toFixed(2)}%`);
            
            // Create cell style
            let cellStyle = {
              position: 'absolute',
              top: `${cellTop}%`,
              left: `${cellLeft}%`,
              width: `${cellWidthPercent}%`,
              height: `${cellHeightPercent}%`,
              ...gridElement.props.cellStyles
            };
            
            cells.push({
              key: cellKey,
              row: row + 1,
              col: col + 1,
              content: cellContent,
              isSeparator: false,
              style: cellStyle
            });
            
            // Move to the next column position
            currentCol += cellWidth;
          }
        }
        currentRow += rowHeight;
      }
      
      return cells;
    };
    
    const cells = calculateCellLayout();
    // console.log('🔍 [Grid1] Calculated cells:', cells);
    
    return React.createElement('div', {
      className: 'grid1-container',
      style: {
        ...position.css,
        zIndex: '400',
        position: 'relative',
        // Apply animated position if animation has completed OR if grid1Flag is true (direct positioning)
        ...(hasAnimated && animatedPosition ? animatedPosition : {}),
        // If grid1Flag is true, position directly at target
        ...(grid1Flag && currentPage === 2 ? { 
          top: `${((gridElement.props.targetPosition[0] - 1) / 72) * 100}%`, 
          left: `${((gridElement.props.targetPosition[1] - 1) / 128) * 100}%` 
        } : {})
      },
      'data-grid-position': 'grid1',
      'data-coordinates': '[15, 35, 65, 95]'
    }, 
      // Render all cells
      ...cells.map(cell => {
        // Create click handler for specific cells on page 2
        const handleCellClick = (event) => {
          if (currentPage === 2) {
            console.log(`🔘 Grid1 cell clicked: R${cell.row}C${cell.col}`);
            
            // Progressive highlighting sequence
            if (cell.row === 1 && cell.col === 2 && currentHighlightFocus === 'R1C2') {
              setFirstNumberFlag(true);
              console.log('🔘 First number flag set to true');
              // Move to next highlight
              setCurrentHighlightFocus('R2C2');
              console.log('🔘 Moving focus to R2C2');
            } else if (cell.row === 2 && cell.col === 2 && currentHighlightFocus === 'R2C2') {
              setSecondNumberFlag(true);
              console.log('🔘 Second number flag set to true');
              
              // Determine if we have 2 or 3 numbers based on actual question data structure
              const questionData = gridElement.props.questionData;
              const isThreeNumbers = questionData && questionData.third_number !== undefined;
              
              console.log('🔘 Question data:', questionData);
              console.log('🔘 Has third_number:', !!questionData?.third_number);
              console.log('🔘 Is three numbers:', isThreeNumbers);
              
              if (isThreeNumbers) {
                // Move to R3C2 for 3-number arrays
                setCurrentHighlightFocus('R3C2');
                console.log('🔘 Three numbers detected - moving focus to R3C2');
              } else {
                // Set grid1Flag to true for 2-number arrays and also set separator flag and third number flag
                setGrid1Flag(true);
                setSeparatorFlag(true);
                setThirdNumberFlag(true);
                console.log('🔘 Two numbers detected - setting grid1Flag to true');
                console.log('🔘 Setting separator flag to true');
                console.log('🔘 Setting third number flag to true');
              }
            } else if (cell.row === 3 && cell.col === 2 && currentHighlightFocus === 'R3C2') {
              setThirdNumberFlag(true);
              console.log('🔘 Third number flag set to true');
              // Set grid1Flag to true after clicking R3C2 and also set separator flag
              setGrid1Flag(true);
              setSeparatorFlag(true);
              console.log('🔘 Setting grid1Flag to true after R3C2');
              console.log('🔘 Setting separator flag to true');
                     }
       }
     };
     
     
     
     return React.createElement('div', {
          key: cell.key,
          className: `grid1-cell${cell.isSeparator ? ' separator-row' : ''}`,
          style: {
            ...cell.style,
            cursor: (currentPage === 2 && !cell.isSeparator && cell.row <= 3 && cell.col === 2) ? 'pointer' : 'default'
          },
          'data-cell': cell.key,
          onClick: handleCellClick
        },
          // For separator rows, create a line element; for regular cells, create text content
          cell.isSeparator ? 
            React.createElement('div', {
              style: {
                width: 'calc(100% - 10px)',
                height: '6px',
                background: '#FFFFFF',
                borderRadius: '2px',
                margin: '0 auto',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                border: '2px solid #FFFFFF',
                borderTop: '4px solid #FFFFFF',
                marginTop: '5px'
              }
            }) :
            React.createElement('div', {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: cell.col === 2 ? 'flex-end' : 'center', // Right align numbers, center align operators
                height: '100%',
                paddingRight: cell.col === 2 ? '10px' : '0',
                // Use textStyles from grid configuration
                ...GridCellFontUtils.processGcStyles(gridElement.props.textStyles || {}),
                // Override color for separators
                color: gridElement.props.textStyles?.color || 'white'
              }
            }, 
            // Check if this is the answer row and render colored digits
            (function() {
              const question = typeof Grid1Utils !== 'undefined' ? Grid1Utils.getCurrentQuestion() : null;
              if (!question) return cell.content || '';
              
              const hasThreeNumbers = question.third_number !== undefined;
              const separatorRow = hasThreeNumbers ? 4 : 3;
              const answerRow = separatorRow + 1;
              
              // If this is the answer row and column 2, render colored digits
              if (cell.row === answerRow && cell.col === 2 && cell.content) {
                const answerStr = cell.content.toString();
                const digits = answerStr.split('');
                
                // Create colored digit elements
                return digits.map((digit, index) => {
                  const color = typeof Grid1Utils !== 'undefined' ? 
                    Grid1Utils.getAnswerDigitColor(index, digits.length) : 'white';
                  
                  // Check if this is the units digit (ones place - last digit)
                  const isUnitsDigit = index === digits.length - 1;
                  const digitContent = isUnitsDigit ? digit + '\u00A0\u00A0\u00A0' : digit;
                  
                  return React.createElement('span', {
                    key: index,
                    style: { color: color }
                  }, digitContent);
                });
              }
              
              return cell.content || '';
            })()
            )
          )
      })
    );
  };

  const Grid2Component = () => {
    // Only render Grid2 on page 2 and beyond AND when showGrid2 is true
    if (currentPage < 2 || !showGrid2) {
      return null;
    }
    
    const pageElement = GridPositionUtils.getPageElement(currentPage, 'grid2');
    if (!pageElement) {
      console.error(`Grid2 not found on page ${currentPage}`);
      return null;
    }
    
    const coordinates = gridPositions.calculateGridCoordinates(pageElement);
    const position = gridPositions.convertToCSS(coordinates, 'grid2', 'page', 'grid');
    const gridElement = pageElement;
    
    const [forceUpdate, setForceUpdate] = React.useState(0);
    
    // Load first question if no question is loaded
    React.useEffect(() => {
      if (!gridElement.props.questionData && typeof Grid2Utils !== 'undefined' && typeof QUESTIONS !== 'undefined') {
        console.log(`Grid2: Loading first question for page ${currentPage}...`);
        Grid2Utils.loadQuestion(0, currentPage);
        setForceUpdate(prev => prev + 1);
      }
    }, [appUpdateTrigger]);
    
    // Animation effect for pages 2 and beyond
    React.useEffect(() => {
      if (currentPage >= 2 && gridElement.props.animateOnLoad && typeof anime !== 'undefined') {
        console.log('🎬 [Grid2] Animation effect called - currentPage:', currentPage);
        
        // Function to try finding the grid element with different selectors
        const findGridElement = () => {
          const specificSelectors = [
            `[data-grid-position="grid2"]`,
            `[data-element-name="grid2"]`,
            `#grid2`,
            `.grid2-container`,
            `div[data-grid-name="grid2"]`
          ];
          
          for (const selector of specificSelectors) {
            const element = document.querySelector(selector);
            if (element && !element.id.includes('info-panel') && !element.id.includes('debug')) {
              console.log('🎬 [Grid2] Found grid element with selector:', selector, element);
              return element;
            }
          }
          
          // Try to find by class or content, avoiding debug panels
          const allDivs = document.querySelectorAll('div[style*="position: absolute"]');
          for (const div of allDivs) {
            if (div.id && (div.id.includes('info-panel') || div.id.includes('debug') || div.id.includes('panel'))) {
              continue;
            }
            
            // Look for grid2-specific characteristics
            const hasGrid2Class = div.className.includes('grid2');
            const hasGrid2Data = div.dataset.gridPosition === 'grid2';
            
            if (hasGrid2Class || hasGrid2Data) {
              console.log('🎬 [Grid2] Found grid element by analysis:', div);
              return div;
            }
          }
          
          return null;
        };
        
        // Function to wait for DOM element and animate
        const waitForElementAndAnimate = (attempts = 0) => {
          const maxAttempts = 20;
          const gridContainer = findGridElement();
          
          console.log(`🎬 [Grid2] Attempt ${attempts + 1}/${maxAttempts} - Grid container found:`, gridContainer);
          
          if (gridContainer) {
            console.log('🎬 [Grid2] Grid element found! Starting animation...');
            
            const { animationDelay, animationDuration, animationEasing, targetPosition } = gridElement.props;
            const [targetRow, targetCol] = targetPosition;
            
            // Calculate target position in CSS percentages
            const targetTop = ((targetRow - 1) / 72) * 100;
            const targetLeft = ((targetCol - 1) / 128) * 100;
            
            console.log(`🎬 [Grid2] Animation config:`, {
              delay: animationDelay,
              duration: animationDuration,
              easing: animationEasing,
              targetPosition: targetPosition,
              to: { top: targetTop, left: targetLeft }
            });
            
            // Start animation after delay
            setTimeout(() => {
              console.log('🎬 [Grid2] Starting animation now...');
              anime({
                targets: gridContainer,
                top: `${targetTop}%`,
                left: `${targetLeft}%`,
                duration: animationDuration,
                easing: animationEasing,
                begin: () => {
                  console.log('🎬 [Grid2] Animation started!');
                },
                complete: () => {
                  console.log('🎬 [Grid2] Animation completed!');
                }
              });
            }, animationDelay);
          } else if (attempts < maxAttempts - 1) {
            console.log(`🎬 [Grid2] Grid element not found yet, retrying in 100ms...`);
            setTimeout(() => waitForElementAndAnimate(attempts + 1), 100);
          } else {
            console.error('🎬 [Grid2] Could not find grid element after', maxAttempts, 'attempts');
          }
        };
        
        waitForElementAndAnimate();
      }
    }, [currentPage, forceUpdate]);
    
    // Calculate cell positions and sizes - EXACTLY like Grid1
    const calculateCellLayout = () => {
      const { gridStructure, defaultCellSize, columnOverrides, rowOverrides, cellOverrides } = gridElement.props;
      const { columns, rows } = gridStructure;
      const cells = [];
      
      // Calculate total grid width and height
      const totalGridWidthInCells = columns * defaultCellSize.columns;
      const totalGridHeightInCells = rows * defaultCellSize.rows;
      
      // Track current row position (like Grid1)
      let currentRow = 0;
      
      // Calculate cell positions
      for (let row = 0; row < rows; row++) {
        // Skip rows based on visibility flags
        const rowNumber = row + 1;
        let shouldSkipRow = false;
        
        // Check if this row should be hidden based on flags
        // For pages beyond page 2, treat number flags as true
        const effectiveFirstFlag = currentPage > 2 ? true : firstNumberFlag;
        const effectiveSecondFlag = currentPage > 2 ? true : secondNumberFlag;
        const effectiveThirdFlag = currentPage > 2 ? true : thirdNumberFlag;
        
        // New Grid2 row structure:
        // R1: Header (always visible)
        // R2: Carry (always visible) 
        // R3-R4 (or R3-R5): Numbers (controlled by number flags)
        // R5 (or R6): Separator (controlled by separatorFlag)
        // R6 (or R7): Answer (always visible)
        // R7 (or R8): Additional Answer (always visible)
        
        const gridDimensions = gridElement.props.gridDimensions;
        if (gridDimensions) {
          const separatorRow = gridDimensions.numberCount + 3; // header + carry + numbers
          
          // Header (R1) and carry (R2) rows controlled by firstNumberFlag
          if (rowNumber === 1 || rowNumber === 2) {
            if (!effectiveFirstFlag) shouldSkipRow = true;
          }
          // Number rows (R3 to R3+numberCount-1) controlled by number flags
          else if (rowNumber >= 3 && rowNumber < 3 + gridDimensions.numberCount) {
            const numberIndex = rowNumber - 3; // 0-based index
            if (numberIndex === 0 && !effectiveFirstFlag) shouldSkipRow = true;
            else if (numberIndex === 1 && !effectiveSecondFlag) shouldSkipRow = true;
            else if (numberIndex === 2 && !effectiveThirdFlag) shouldSkipRow = true;
          }
          // Separator row controlled by separatorFlag
          else if (rowNumber === separatorRow && !separatorFlag) {
            shouldSkipRow = true;
          }
          // Answer rows (always visible)
          else if (rowNumber > separatorRow) {
            shouldSkipRow = false;
          }
        } else {
          // Fallback to old logic if gridDimensions not available
          if ((rowNumber >= 1 && rowNumber <= 3) && !effectiveFirstFlag) {
            shouldSkipRow = true;
          } else if (rowNumber === 4 && !effectiveSecondFlag) {
            shouldSkipRow = true;
          } else if (rowNumber === 5 && !effectiveThirdFlag) {
            shouldSkipRow = true;
          } else if (rowNumber === 6 && !separatorFlag) {
            shouldSkipRow = true;
          }
        }
        
        if (shouldSkipRow) {
          console.log(`🔍 [Grid2] Skipping row ${rowNumber} due to flag settings`);
          continue;
        }
        let currentCol = 0;
        let rowHeight = defaultCellSize.rows; // Default row height
        
        // Check if this is a separator row first (before processing columns)
        const firstCellData = (typeof Grid2Utils !== 'undefined' && gridElement.props.getCellContent) ? 
                           gridElement.props.getCellContent(row + 1, 1) : { content: '', color: '' };
        const firstCellContent = typeof firstCellData === 'object' ? firstCellData.content : firstCellData;
        const isSeparatorRow = firstCellContent === '' && gridElement.props.gridDimensions && 
                            (row + 1 === gridElement.props.gridDimensions.numberCount + 2 || 
                             row + 1 === gridElement.props.gridDimensions.numberCount + 3);
        
        if (isSeparatorRow) {
          // For separator rows, create one cell that spans the full width (like Grid1)
          const cellKey = `separator_${row + 1}`;
          // Check for row overrides first, then use default (like Grid1)
          const cellHeight = rowOverrides[`row${row + 1}`]?.rows || defaultCellSize.rows;
          console.log(`🔍 [Grid2] Separator Row ${row + 1}: height=${cellHeight} (override: ${rowOverrides[`row${row + 1}`]?.rows}, default: ${defaultCellSize.rows})`);
          
          const cellTop = (currentRow / totalGridHeightInCells) * 100;
          const cellLeft = 0; // Start at left edge
          const cellHeightPercent = (cellHeight / totalGridHeightInCells) * 100;
          const cellWidthPercent = 100; // Span full width
          
          console.log(`🔍 [Grid2] Separator Row ${row + 1}: full width spanning`);
          
          // Create separator cell style
          let cellStyle = {
            position: 'absolute',
            top: `${cellTop}%`,
            left: `${cellLeft}%`,
            width: `${cellWidthPercent}%`,
            height: `${cellHeightPercent}%`,
            backgroundColor: 'transparent',
            border: 'none',
            padding: '7px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          };
          
          // Apply custom separator row styles if available (like Grid1)
          if (gridElement.props.separatorRowStyles) {
            Object.assign(cellStyle, gridElement.props.separatorRowStyles);
            console.log('🔍 [Grid2] Separator row styles applied:', gridElement.props.separatorRowStyles);
            console.log('🔍 [Grid2] Final separator cell style:', cellStyle);
          }
          
          cells.push({
            key: cellKey,
            row: row + 1,
            col: 0, // Spans all columns
            content: '',
            color: '#ffffff',
            isSeparator: true,
            style: cellStyle
          });
          
          rowHeight = cellHeight;
        } else {
          // For regular rows, create individual cells
          currentCol = 0;
          
          for (let col = 0; col < columns; col++) {
            const cellKey = `cell_${row + 1}_${col + 1}`;
            
            // Get cell size (check overrides like Grid1)
            const cellHeight = cellOverrides[cellKey]?.rows || 
                            rowOverrides[`row${row + 1}`]?.rows || 
                            columnOverrides[`col${col + 1}`]?.rows || 
                            defaultCellSize.rows;
                            
            const cellWidth = cellOverrides[cellKey]?.columns || 
                           rowOverrides[`row${row + 1}`]?.columns || 
                           columnOverrides[`col${col + 1}`]?.columns || 
                           defaultCellSize.columns;
            
            console.log(`🔍 [Grid2] Cell ${row + 1},${col + 1}: width=${cellWidth}, height=${cellHeight}`);
            console.log(`🔍 [Grid2] Cell ${row + 1},${col + 1} - Override key: col${col + 1}, Override value:`, columnOverrides[`col${col + 1}`]);
            console.log(`🔍 [Grid2] Cell ${row + 1},${col + 1} - totalGridWidthInCells: ${totalGridWidthInCells}`);
            
            // Track the maximum height in this row (like Grid1)
            rowHeight = Math.max(rowHeight, cellHeight);
            
            // Calculate position percentages within the grid (like Grid1)
            const cellTop = (currentRow / totalGridHeightInCells) * 100;
            const cellLeft = (currentCol / totalGridWidthInCells) * 100;
            const cellHeightPercent = (cellHeight / totalGridHeightInCells) * 100;
            const cellWidthPercent = (cellWidth / totalGridWidthInCells) * 100;
            
            // Get cell content using Grid2Utils (now returns object with content and color)
            const cellData = (typeof Grid2Utils !== 'undefined' && gridElement.props.getCellContent) ? 
                              gridElement.props.getCellContent(row + 1, col + 1) : { content: '', color: '' };
            
            // Extract content and color
            const cellContent = typeof cellData === 'object' ? cellData.content : cellData;
            const cellColor = typeof cellData === 'object' ? cellData.color : '#ffffff';
            
            console.log(`🔍 [Grid2] Cell ${row + 1},${col + 1} content: "${cellContent}" at position left=${cellLeft.toFixed(2)}%, width=${cellWidthPercent.toFixed(2)}%`);
            
            // Create cell style
            let cellStyle = {
              position: 'absolute',
              top: `${cellTop}%`,
              left: `${cellLeft}%`,
              width: `${cellWidthPercent}%`,
              height: `${cellHeightPercent}%`,
              ...gridElement.props.cellStyles
            };
            
            // Apply cellOverrides if they exist for this specific cell
            const cellOverrideKey = `${row + 1},${col + 1}`;
            if (gridElement.props.cellOverrides && gridElement.props.cellOverrides[cellOverrideKey]) {
              const cellOverride = gridElement.props.cellOverrides[cellOverrideKey];
              if (cellOverride.style) {
                // Merge the override styles into the cell style
                cellStyle = {
                  ...cellStyle,
                  ...cellOverride.style
                };
                console.log(`🔧 [Grid2] Applied cellOverride for ${cellOverrideKey}:`, cellOverride.style);
              }
            }
            

            
            cells.push({
              key: cellKey,
              row: row + 1,
              col: col + 1,
              content: cellContent,
              color: cellColor,
              isSeparator: false,
              style: cellStyle
            });
            
            // Move to the next column position (like Grid1)
            currentCol += cellWidth;
          }
        }
        currentRow += rowHeight; // Accumulate row height (like Grid1)
      }
      
      return cells;
    };
    
    const cells = calculateCellLayout();
    
                   // Create column overlay for page 4, page 6, page 8, page 9, page 10, page 11, page 12, page 13, page 14, page 15, page 16, page 17, and page 18 border (excluding page 19)
     const createColumnOverlay = () => {
               if (currentPage !== 4 && currentPage !== 6 && currentPage !== 8 && currentPage !== 9 && currentPage !== 10 && currentPage !== 11 && currentPage !== 12 && currentPage !== 13 && currentPage !== 14 && currentPage !== 15 && currentPage !== 16 && currentPage !== 17 && currentPage !== 18) return null;
       
                // Add CSS animation for moving dashes if not already added
         if (!document.getElementById('moving-dashes-style')) {
           const style = document.createElement('style');
           style.id = 'moving-dashes-style';
           style.textContent = `
                        @keyframes movingDashesWhite {
             0% {
               border-image-source: repeating-linear-gradient(45deg, white 0px, white 10px, transparent 10px, transparent 20px);
             }
             25% {
               border-image-source: repeating-linear-gradient(45deg, white 5px, white 15px, transparent 15px, transparent 25px);
             }
             50% {
               border-image-source: repeating-linear-gradient(45deg, white 10px, white 20px, transparent 20px, transparent 30px);
             }
             75% {
               border-image-source: repeating-linear-gradient(45deg, white 15px, white 25px, transparent 25px, transparent 35px);
             }
             100% {
               border-image-source: repeating-linear-gradient(45deg, white 20px, white 30px, transparent 30px, transparent 40px);
             }
           }
           
           @keyframes movingDashesRed {
             0% {
               border-image-source: repeating-linear-gradient(45deg, red 0px, red 10px, transparent 10px, transparent 20px);
             }
             25% {
               border-image-source: repeating-linear-gradient(45deg, red 5px, red 15px, transparent 15px, transparent 25px);
             }
             50% {
               border-image-source: repeating-linear-gradient(45deg, red 10px, red 20px, transparent 20px, transparent 30px);
             }
             75% {
               border-image-source: repeating-linear-gradient(45deg, red 15px, red 25px, transparent 25px, transparent 35px);
             }
             100% {
               border-image-source: repeating-linear-gradient(45deg, red 20px, red 30px, transparent 30px, transparent 40px);
             }
           }
             
                        .grid2-column-overlay-white {
             border: 3px solid;
             border-image: repeating-linear-gradient(45deg, white 0px, white 10px, transparent 10px, transparent 20px) 1;
             animation: movingDashesWhite 2s linear infinite;
           }
           
           .grid2-column-overlay-red {
             border: 3px solid;
             border-image: repeating-linear-gradient(45deg, red 0px, red 10px, transparent 10px, transparent 20px) 1;
             animation: movingDashesRed 2s linear infinite;
           }
           `;
           document.head.appendChild(style);
         }
      
      // Get number of digits from grid dimensions
      const maxDigits = gridElement.props.gridDimensions?.maxDigits || 2;
      
            // Determine which column to highlight based on number of digits and page
      let highlightColumn = 0;
      if (currentPage === 10) {
        // Page 10 specific: column depends on number of digits
        if (maxDigits === 2) {
          highlightColumn = 1; // C1 for 2-digit numbers (tens column)
        } else if (maxDigits === 3) {
          highlightColumn = 3; // C3 for 3-digit numbers (tens column)
        }
      } else if (currentPage === 12) {
        // Page 12 specific: column depends on number of digits
        if (maxDigits === 2) {
          highlightColumn = 1; // C1 for 2-digit numbers (tens column)
        } else if (maxDigits === 3) {
          highlightColumn = 3; // C3 for 3-digit numbers (tens column)
        }
      } else if (currentPage === 14) {
        // Page 14 specific: column depends on number of digits
        if (maxDigits === 2) {
          highlightColumn = 1; // C1 for 2-digit numbers (tens column)
        } else if (maxDigits === 3) {
          highlightColumn = 3; // C3 for 3-digit numbers (tens column)
        }
      } else if (currentPage === 15) {
        // Page 15: Column border around C3
        highlightColumn = 3; // C3 for all numbers
      } else if (currentPage === 11 || currentPage === 13 || currentPage === 16 || currentPage === 17 || currentPage === 18 || currentPage === 19 || currentPage === 20) {
        // Page 11, 13, 16+: Border on tens column instead of ones column - always use C1
        if (maxDigits === 3) {
          highlightColumn = 1; // C1 for 3-digit numbers (moved from C3)
        } else if (maxDigits === 2) {
          highlightColumn = 1; // C1 for 2-digit numbers (tens column)
        }
      } else {
        // Pages 4, 6, 8, 9: Border on ones column
        if (maxDigits === 3) {
          highlightColumn = 5; // C5 for 3-digit numbers (ones column)
        } else if (maxDigits === 2) {
          highlightColumn = 3; // C3 for 2-digit numbers (ones column)
        }
      }
      
      if (highlightColumn === 0) return null;
      
      // Determine border color based on page and calculated values
      let borderColor = 'white'; // Default color
      if (currentPage === 6 && onesdigitsum > 9) {
        borderColor = 'red';
      } else if (currentPage === 12 || currentPage === 14) {
        // Page 12 and 14: Check if tens column value > 90
        const page12TensValue = Grid2Utils.calculatePage12TensValue(gridElement.props.questionData, gridElement.props.gridDimensions);
        if (page12TensValue > 90) {
          borderColor = 'red';
          console.log(`🔍 [Grid2] Page ${currentPage}: Tens value ${page12TensValue} > 90, setting border to red`);
        } else {
          borderColor = 'white';
          console.log(`🔍 [Grid2] Page ${currentPage}: Tens value ${page12TensValue} <= 90, keeping border white`);
        }
      } else if (currentPage === 15) {
        // Page 15: Always use white border
        borderColor = 'white';
        console.log(`🔍 [Grid2] Page 15: Setting border to white`);
      } else if (currentPage === 16) {
        // Page 16: Always use white border (same as page 15)
        borderColor = 'white';
        console.log(`🔍 [Grid2] Page 16: Setting border to white`);
      } else if (currentPage === 17) {
        // Page 17: Always use white border (same as page 15 and 16)
        borderColor = 'white';
        console.log(`🔍 [Grid2] Page 17: Setting border to white`);
      } else if (currentPage === 18) {
        // Page 18: Always use white border (same as page 15, 16, and 17)
        borderColor = 'white';
        console.log(`🔍 [Grid2] Page 18: Setting border to white`);
      } else if (currentPage === 19) {
        // Page 19: Always use white border (same as page 15, 16, 17, and 18)
        borderColor = 'white';
        console.log(`🔍 [Grid2] Page 19: Setting border to white`);
      } else if (currentPage === 20) {
        // Page 20: Always use white border (same as page 15, 16, 17, 18, and 19)
        borderColor = 'white';
        console.log(`🔍 [Grid2] Page 20: Setting border to white`);
      } else if (currentPage === 8 || currentPage === 9 || currentPage === 10 || currentPage === 11 || currentPage === 13) {
        borderColor = 'white'; // Page 8, 9, 10, and 11 always have white border
      }
      
      console.log(`🔍 [Grid2] Page ${currentPage}: onesdigitsum = ${onesdigitsum}, borderColor = ${borderColor}`);
      
                   // Find cells in the target column within specific row range
      const numberCount = gridElement.props.gridDimensions?.numberCount || 2;
      let startRow, endRow;
      
              if (currentPage === 9 || currentPage === 10 || currentPage === 11 || currentPage === 12 || currentPage === 13) {
        // Page 9, 10, 11, 12, and 13: Special row range from R1 (header row)
        startRow = 1; // Start from header row
        endRow = numberCount === 3 ? 7 : 6; // For 3 numbers: R1 to R7, For 2 numbers: R1 to R6
      } else if (currentPage === 14) {
        // Page 14: Extended row range to include additional answer row
        startRow = 1; // Start from header row
        endRow = numberCount === 3 ? 8 : 7; // For 3 numbers: R1 to R8, For 2 numbers: R1 to R7
      } else if (currentPage === 15) {
        // Page 15: Specific row ranges
        startRow = 1; // Start from header row
        endRow = numberCount === 3 ? 7 : 6; // For 3 numbers: R1 to R7, For 2 numbers: R1 to R6
      } else if (currentPage === 16) {
        // Page 16: Specific row ranges (same as page 15)
        startRow = 1; // Start from header row
        endRow = numberCount === 3 ? 7 : 6; // For 3 numbers: R1 to R7, For 2 numbers: R1 to R6
      } else if (currentPage === 17) {
        // Page 17: Specific row ranges (same as page 15 and 16)
        startRow = 1; // Start from header row
        endRow = numberCount === 3 ? 7 : 6; // For 3 numbers: R1 to R7, For 2 numbers: R1 to R6
      } else if (currentPage === 18) {
        // Page 18: Specific row ranges (same as page 15, 16, and 17)
        startRow = 1; // Start from header row
        endRow = numberCount === 3 ? 7 : 6; // For 3 numbers: R1 to R7, For 2 numbers: R1 to R6
      } else if (currentPage === 19) {
        // Page 19: Specific row ranges (same as page 15, 16, 17, and 18)
        startRow = 1; // Start from header row
        endRow = numberCount === 3 ? 7 : 6; // For 3 numbers: R1 to R7, For 2 numbers: R1 to R6
      } else if (currentPage === 20) {
        // Page 20: Specific row ranges (same as page 15, 16, 17, 18, and 19)
        startRow = 1; // Start from header row
        endRow = numberCount === 3 ? 7 : 6; // For 3 numbers: R1 to R7, For 2 numbers: R1 to R6
      } else if (currentPage === 8) {
        // Page 8: For 3 numbers: R2 to R8, For 2 numbers: R2 to R7
        startRow = 2; // Start from carry row
        endRow = numberCount === 3 ? 8 : 7;
      } else {
        // Page 4 and 6: For 3 numbers: R2 to R7, For 2 numbers: R2 to R6
        startRow = 2; // Start from carry row
        endRow = numberCount === 3 ? 7 : 6;
      }
      
      console.log(`🔍 [Grid2] Page ${currentPage} border range: R${startRow} to R${endRow} (${numberCount} numbers)`);
      
      const columnCells = cells.filter(cell => 
        cell.col === highlightColumn && 
        !cell.isSeparator && 
        cell.row >= startRow && 
        cell.row <= endRow
      );
       if (columnCells.length === 0) return null;
       
       // Calculate overlay position and dimensions
       const firstCell = columnCells.find(cell => cell.row === startRow);
       const lastCell = columnCells.find(cell => cell.row === endRow) || columnCells[columnCells.length - 1];
       
       if (!firstCell || !lastCell) return null;
      
      // Get cell dimensions from grid configuration
      const { gridStructure, defaultCellSize, columnOverrides } = gridElement.props;
      const cellWidth = columnOverrides[`col${highlightColumn}`]?.columns || defaultCellSize.columns;
      const totalGridWidthInCells = gridStructure.columns * defaultCellSize.columns;
      
      // Calculate overlay dimensions
      const overlayLeft = firstCell.style.left;
      const overlayWidth = firstCell.style.width;
      const overlayTop = firstCell.style.top;
      const overlayHeight = `calc(${lastCell.style.top} + ${lastCell.style.height} - ${firstCell.style.top})`;
      
             console.log(`🔍 [Grid2] Page ${currentPage} column overlay: column ${highlightColumn} (${currentPage === 10 || currentPage === 11 || currentPage === 12 || currentPage === 13 || currentPage === 14 || currentPage === 15 || currentPage === 16 || currentPage === 17 || currentPage === 18 || currentPage === 19 || currentPage === 20 ? 'tens' : 'ones'} column, R${startRow} to R${endRow}), left=${overlayLeft}, width=${overlayWidth}, top=${overlayTop}, height=${overlayHeight}`);
      
             return React.createElement('div', {
         key: 'column-overlay',
         className: borderColor === 'red' ? 'grid2-column-overlay-red' : 'grid2-column-overlay-white',
         style: {
           position: 'absolute',
           left: overlayLeft,
           width: overlayWidth,
           top: overlayTop,
           height: overlayHeight,
           backgroundColor: 'transparent',
           pointerEvents: 'none',
           zIndex: '402' // Higher than cells to be on top
         },
         'data-column-overlay': highlightColumn
       });
    };
     
     // Create plus sign for page 4 navigation
     const createPlusSign = () => {
       if (currentPage !== 4 && currentPage !== 10 && currentPage !== 11 && currentPage !== 16) return null;
       
       console.log(`🔍 [Grid2] CreatePlusSign called on page ${currentPage}`);
       console.log('🔍 [Grid2] GridElement props:', gridElement.props);
       console.log('🔍 [Grid2] GridDimensions:', gridElement.props.gridDimensions);
       
       // Get number of digits from grid dimensions with fallback
       let maxDigits = gridElement.props.gridDimensions?.maxDigits;
       
       // Fallback: Calculate from question data if gridDimensions not available
       if (!maxDigits && gridElement.props.questionData) {
         const numbers = [];
         if (gridElement.props.questionData.first_number) numbers.push(gridElement.props.questionData.first_number);
         if (gridElement.props.questionData.second_number) numbers.push(gridElement.props.questionData.second_number);
         if (gridElement.props.questionData.third_number) numbers.push(gridElement.props.questionData.third_number);
         
         maxDigits = Math.max(...numbers.map(num => num.toString().length));
         console.log('🔍 [Grid2] Calculated maxDigits from question data:', maxDigits, 'from numbers:', numbers);
       }
       
       // Final fallback: default to 3 digits for now (since most problems are 3-digit)
       if (!maxDigits) {
         maxDigits = 3;
         console.log('🔍 [Grid2] Using default maxDigits:', maxDigits);
       }
       
       // Fixed positions based on problem type
       let targetRow = 0;
       let plusColumn = 0;
       
       // Determine if this is a 2-number or 3-number question
       const isThreeNumberQuestion = gridElement.props.questionData && 
         gridElement.props.questionData.third_number && 
         gridElement.props.questionData.third_number !== null;
       
       // Set row and column based on page and problem characteristics
       if (currentPage === 4) {
         // Page 4: Plus sign in ones column
         // Set row based on number of numbers in the question
         if (isThreeNumberQuestion) {
           targetRow = 7; // R7 for 3-number questions
         } else {
           targetRow = 6; // R6 for 2-number questions
         }
         
         // Set column based on number of digits (ones column)
         if (maxDigits === 3) {
           plusColumn = 5; // C5 for 3-digit problems
         } else if (maxDigits === 2) {
           plusColumn = 3; // C3 for 2-digit problems
         }
                        } else if (currentPage === 10) {
          // Page 10: Plus sign in tens column
        if (maxDigits === 3) {
          // 3-digit numbers: plus sign in C3 (tens column)
          if (isThreeNumberQuestion) {
            targetRow = 7; // R7 for 3 numbers
            plusColumn = 3; // C3 (tens column for 3-digit)
          } else {
            targetRow = 6; // R6 for 2 numbers
            plusColumn = 3; // C3 (tens column for 3-digit)
          }
        } else if (maxDigits === 2) {
          // 2-digit numbers: plus sign in C1 (tens column)
          targetRow = 6; // R6 for 2 numbers
          plusColumn = 1; // C1 (tens column for 2-digit)
        }
        } else if (currentPage === 11 || currentPage === 12 || currentPage === 13 || currentPage === 14) {
          // Page 11+: Plus sign in tens column
        if (maxDigits === 3) {
          // 3-digit numbers
          if (isThreeNumberQuestion) {
            targetRow = 7; // R7 for 3 numbers
            plusColumn = 1; // C1 (moved from C3)
          } else {
            targetRow = 6; // R6 for 2 numbers
            plusColumn = 1; // C1 (moved from C3)
          }
        } else if (maxDigits === 2) {
          // 2-digit numbers (always 2 numbers for 2-digit)
          targetRow = 6; // R6 for 2 numbers
          plusColumn = 1; // C1 (tens column)
        }
               } else if (currentPage === 16) {
         // Page 16: Plus sign in column 1 for 3-digit numbers only
         if (maxDigits === 3) {
           // 3-digit numbers
           if (isThreeNumberQuestion) {
             targetRow = 7; // R7 for 3 numbers
             plusColumn = 1; // C1
           } else {
             targetRow = 6; // R6 for 2 numbers
             plusColumn = 1; // C1
           }
         } else {
           // No plus sign for 2-digit numbers on page 16
           return null;
         }
       }
       
       console.log('🔍 [Grid2] MaxDigits:', maxDigits, 'IsThreeNumberQuestion:', isThreeNumberQuestion, 'TargetRow:', targetRow, 'PlusColumn:', plusColumn);
       console.log('🔍 [Grid2] Question data:', gridElement.props.questionData);
       
       if (targetRow === 0 || plusColumn === 0) {
         console.log('🔍 [Grid2] Invalid target position, returning null');
         return null;
       }
       
       console.log('🔍 [Grid2] Looking for cell R' + targetRow + 'C' + plusColumn);
       console.log('🔍 [Grid2] Available cells:', cells.map(c => `R${c.row}C${c.col}${c.isSeparator ? '(sep)' : ''}`));
       
       // Debug: Show all cells in column 5 with their content
       const column5Cells = cells.filter(cell => cell.col === 5);
       console.log('🔍 [Grid2] Column 5 cells:');
       column5Cells.forEach(cell => {
         console.log(`  R${cell.row}C${cell.col}: "${cell.content}" ${cell.isSeparator ? '(separator)' : ''}`);
       });
       
       const targetCell = cells.find(cell => 
         cell.row === targetRow && 
         cell.col === plusColumn && 
         !cell.isSeparator
       );
       
       console.log('🔍 [Grid2] Target cell found:', targetCell);
       
       if (!targetCell) {
         console.log('🔍 [Grid2] Target cell not found, trying fallback positioning');
         // Fallback: try to find any cell in the target column
         const columnCells = cells.filter(cell => cell.col === plusColumn && !cell.isSeparator);
         console.log('🔍 [Grid2] Column cells found:', columnCells);
         
         if (columnCells.length > 0) {
           // Use any existing cell to calculate approximate position
           const referenceCell = columnCells[columnCells.length - 1];
           const fallbackCell = {
             key: `fallback_${targetRow}_${plusColumn}`,
             row: targetRow,
             col: plusColumn,
             content: '',
             color: '#ffffff',
             isSeparator: false,
             style: {
               position: 'absolute',
               top: referenceCell.style.top,
               left: referenceCell.style.left,
               width: referenceCell.style.width,
               height: referenceCell.style.height
             }
           };
           console.log('🔍 [Grid2] Using fallback positioning for R' + targetRow + 'C' + plusColumn);
           
           // Get plus sign styling from StandardPositions
           const plusSignElement = StandardPositions.plusSign;
           if (!plusSignElement) {
             console.log('🔍 [Grid2] Plus sign element not found in StandardPositions');
             return null;
           }
           
           // Create plus sign with fallback positioning using StandardPositions styles
           return React.createElement('div', {
             key: 'plus-sign',
             className: 'grid2-plus-sign',
             style: {
               ...plusSignElement.props.style,
               left: fallbackCell.style.left,
               top: fallbackCell.style.top,
               width: fallbackCell.style.width,
               height: fallbackCell.style.height
             },
             onClick: (e) => {
               e.preventDefault();
               e.stopPropagation();
               
               if (currentPage === 4) {
                 console.log('🎯 Plus sign clicked - navigating to page 5');
                 if (typeof PageUtils !== 'undefined') {
                   PageUtils.syncQuestionsBetweenPages(4, 5);
                 }
                 setCurrentPage(5);
               } else if (currentPage === 10) {
                 console.log('🎯 Plus sign clicked - navigating to page 11');
                 // Sync current question from page 10 to page 11
                 if (typeof PageUtils !== 'undefined') {
                   PageUtils.syncQuestionsBetweenPages(10, 11);
                 }
                 setCurrentPage(11);
               } else if (currentPage === 11) {
                 console.log('🎯 Plus sign clicked on page 11 - show quiz');
                 // Page 11: Show quiz modal
                 setShowQuizOverlay(true);
                 setQuizFeedback('');
               } else if (currentPage === 12) {
                 console.log('🎯 Plus sign clicked on page 12 - no action');
                 // Page 12: No specific action for now
               } else if (currentPage === 13) {
                 console.log('🎯 Plus sign clicked on page 13 - show quiz');
                 // Page 13: Show quiz modal (like page 7)
                 setShowQuizOverlay(true);
                 setQuizFeedback('');
               } else if (currentPage === 14) {
                 console.log('🎯 Plus sign clicked on page 14 - no action');
                 // Page 14: No specific action for now
               } else if (currentPage === 15) {
                 console.log('🎯 Plus sign clicked on page 15 - navigating to page 17');
                 // Sync current question from page 15 to page 17
                 if (typeof PageUtils !== 'undefined') {
                   PageUtils.syncQuestionsBetweenPages(15, 17);
                 }
                 setCurrentPage(17);
               } else if (currentPage === 16) {
                 console.log('🎯 Plus sign clicked on page 16 - navigating to page 17');
                 // Sync current question from page 16 to page 17
                 if (typeof PageUtils !== 'undefined') {
                   PageUtils.syncQuestionsBetweenPages(16, 17);
                 }
                 setCurrentPage(17);
               }
             },
             'data-plus-sign': `fallback-${fallbackCell.key}`
           },
             React.createElement('div', {
               style: plusSignElement.props.circleStyle,
               onMouseEnter: plusSignElement.props.onMouseEnter,
               onMouseLeave: plusSignElement.props.onMouseLeave
             }, plusSignElement.props.content)
           );
         }
         
         console.log('🔍 [Grid2] No fallback cell found either, returning null');
         return null;
       }
       
       console.log(`🔍 [Grid2] Page ${currentPage} plus sign: R${targetRow}C${plusColumn} (${maxDigits} digits, ${isThreeNumberQuestion ? '3' : '2'} numbers)`);
       
       // Get plus sign styling from StandardPositions
       const plusSignElement = StandardPositions.plusSign;
       if (!plusSignElement) {
         console.log('🔍 [Grid2] Plus sign element not found in StandardPositions');
         return null;
       }
       
       return React.createElement('div', {
         key: 'plus-sign',
         className: 'grid2-plus-sign',
         style: {
           ...plusSignElement.props.style,
           left: targetCell.style.left,
           top: targetCell.style.top,
           width: targetCell.style.width,
           height: targetCell.style.height
         },
         onClick: (e) => {
           e.preventDefault();
           e.stopPropagation();
           
           if (currentPage === 4) {
             console.log('🎯 Plus sign clicked - navigating to page 5');
             // Sync current question from page 4 to page 5
             if (typeof PageUtils !== 'undefined') {
               PageUtils.syncQuestionsBetweenPages(4, 5);
             }
             setCurrentPage(5);
           } else if (currentPage === 10) {
             console.log('🎯 Plus sign clicked - navigating to page 11');
             // Sync current question from page 10 to page 11
             if (typeof PageUtils !== 'undefined') {
               PageUtils.syncQuestionsBetweenPages(10, 11);
             }
             setCurrentPage(11);
           } else if (currentPage === 11) {
             console.log('🎯 Plus sign clicked on page 11 - show quiz');
             // Page 11: Show quiz modal
             setShowQuizOverlay(true);
             setQuizFeedback('');
           } else if (currentPage === 12) {
             console.log('🎯 Plus sign clicked on page 12 - no action');
             // Page 12: No specific action for now
           } else if (currentPage === 13) {
             console.log('🎯 Plus sign clicked on page 13 - show quiz');
             // Page 13: Show quiz modal (like page 7)
             setShowQuizOverlay(true);
             setQuizFeedback('');
           } else if (currentPage === 14) {
             console.log('🎯 Plus sign clicked on page 14 - no action');
             // Page 14: No specific action for now
           } else if (currentPage === 15) {
             console.log('🎯 Plus sign clicked on page 15 - navigating to page 17');
             // Sync current question from page 15 to page 17
             if (typeof PageUtils !== 'undefined') {
               PageUtils.syncQuestionsBetweenPages(15, 17);
             }
             setCurrentPage(17);
           } else if (currentPage === 16) {
             console.log('🎯 Plus sign clicked on page 16 - navigating to page 17');
             // Sync current question from page 16 to page 17
             if (typeof PageUtils !== 'undefined') {
               PageUtils.syncQuestionsBetweenPages(16, 17);
             }
             setCurrentPage(17);
           }
         },
         'data-plus-sign': `R${targetRow}C${plusColumn}`
       },
         React.createElement('div', {
           style: plusSignElement.props.circleStyle,
           onMouseEnter: plusSignElement.props.onMouseEnter,
           onMouseLeave: plusSignElement.props.onMouseLeave
         }, plusSignElement.props.content)
       );
     };
    
         // Create row overlay for page 19 and 20
     const createRowOverlay = () => {
       if (currentPage !== 19 && currentPage !== 20) return null;
      
             console.log(`🔍 [Grid2] Creating row overlay for page ${currentPage}`);
      
      // Get number of digits and numbers from grid dimensions
      const maxDigits = gridElement.props.gridDimensions?.maxDigits || 3;
      const numberCount = gridElement.props.gridDimensions?.numberCount || 2;
      
      // Only create overlay for 3-digit numbers
      if (maxDigits !== 3) return null;
      
      // Determine which row to highlight
      let targetRow;
      if (numberCount === 2) {
        targetRow = 6; // R6 for 3-digit 2-numbers
      } else if (numberCount === 3) {
        targetRow = 7; // R7 for 3-digit 3-numbers
      } else {
        return null;
      }
      
             console.log(`🔍 [Grid2] Page ${currentPage} row overlay: maxDigits=${maxDigits}, numberCount=${numberCount}, targetRow=${targetRow}`);
      
      // Find all cells in the target row
      const rowCells = cells.filter(cell => cell.row === targetRow && !cell.isSeparator);
      
      if (rowCells.length === 0) {
        console.log(`🔍 [Grid2] No cells found in row ${targetRow}`);
        return null;
      }
      
      // Calculate overlay position spanning the entire row
      const firstCell = rowCells[0];
      const lastCell = rowCells[rowCells.length - 1];
      
      const overlayLeft = firstCell.style.left;
      const overlayWidth = `calc(${lastCell.style.left} + ${lastCell.style.width} - ${firstCell.style.left})`;
      const overlayTop = firstCell.style.top;
      const overlayHeight = firstCell.style.height;
      
             console.log(`🔍 [Grid2] Page ${currentPage} row overlay: R${targetRow}, left=${overlayLeft}, width=${overlayWidth}, top=${overlayTop}, height=${overlayHeight}`);
      
            // Add CSS animation for moving dashes if not already added (matching page 18 style)
      if (!document.querySelector('#grid2-row-overlay-animation')) {
        const style = document.createElement('style');
        style.id = 'grid2-row-overlay-animation';
        style.textContent = `
          .grid2-row-overlay-white {
            border: 3px solid;
            border-image: repeating-linear-gradient(45deg, white 0px, white 10px, transparent 10px, transparent 20px) 1;
            animation: movingDashesWhite 2s linear infinite;
          }
          .grid2-row-overlay-solid {
            border: 3px solid white;
          }
        `;
        document.head.appendChild(style);
      }

      // Use different border style for page 20
      const borderClassName = currentPage === 20 ? 'grid2-row-overlay-solid' : 'grid2-row-overlay-white';

      return React.createElement('div', {
        key: 'row-overlay',
        className: borderClassName,
        style: {
          position: 'absolute',
          left: overlayLeft,
          width: overlayWidth,
          top: overlayTop,
          height: overlayHeight,
          backgroundColor: 'transparent',
          pointerEvents: 'none',
          zIndex: '402' // Higher than cells to be on top
        },
        'data-row-overlay': targetRow
      });
    };
    
    return React.createElement('div', {
      className: 'grid2-container',
      style: {
        ...position.css,
        zIndex: '401',
        position: 'absolute'
      },
      'data-grid-position': 'grid2',
      'data-coordinates': `[${coordinates.join(', ')}]`
    }, 
      // Render all cells
      ...cells.map(cell => 
          React.createElement('div', {
          key: cell.key,
          className: `grid2-cell${cell.isSeparator ? ' separator-row' : ''}`,
          style: cell.style,
          'data-cell': cell.key
        },
          // For separator rows, create a line element; for regular cells, create text content
          cell.isSeparator ? 
            React.createElement('div', {
              style: {
                width: 'calc(100% - 10px)',
                height: '6px',
                background: '#FFFFFF',
                borderRadius: '2px',
                margin: '0 auto',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                border: '2px solid #FFFFFF',
                borderTop: '4px solid #FFFFFF',
                marginTop: '5px'
              }
            }) :
            React.createElement('div', {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                // Use textStyles from grid configuration
                ...GridCellFontUtils.processGcStyles(gridElement.props.textStyles || {}),
                color: cell.color || gridElement.props.textStyles?.color || 'white'
              }
            }, cell.content || '')
          )
      ),
            // Add column overlay for page 4
      createColumnOverlay(),
      // Add plus sign for page 4
      createPlusSign(),
      // Add row overlay for page 19
      createRowOverlay()
    );
  };

  // Helper functions for Page 11 Quiz
  const calculatePage11Answer = (questionData) => {
    if (!questionData) return 0;
    
    // Calculate tens carry (from ones column overflow)
    const onesSum = (questionData.first_number % 10) + 
                   (questionData.second_number % 10) + 
                   (questionData.third_number ? (questionData.third_number % 10) : 0);
    const tenscarry = Math.floor(onesSum / 10) * 10;
    
    // Get tens digits from the numbers
    const maxDigits = Math.max(
      questionData.first_number.toString().length,
      questionData.second_number.toString().length,
      questionData.third_number ? questionData.third_number.toString().length : 0
    );
    
    // Calculate tens digits multiplied by 10
    const firstTens = Math.floor(questionData.first_number / 10) % 10;
    const secondTens = Math.floor(questionData.second_number / 10) % 10;
    const thirdTens = questionData.third_number ? Math.floor(questionData.third_number / 10) % 10 : 0;
    
    // Calculate based on question type
    if (maxDigits === 2 && !questionData.third_number) {
      // 2-digit 2 numbers: tenscarry + (firstTens * 10) + (secondTens * 10)
      return tenscarry + (firstTens * 10) + (secondTens * 10);
    } else if (maxDigits === 3 && !questionData.third_number) {
      // 3-digit 2 numbers: tenscarry + (firstTens * 10) + (secondTens * 10)
      return tenscarry + (firstTens * 10) + (secondTens * 10);
    } else if (maxDigits === 3 && questionData.third_number) {
      // 3-digit 3 numbers: tenscarry + (firstTens * 10) + (secondTens * 10) + (thirdTens * 10)
      return tenscarry + (firstTens * 10) + (secondTens * 10) + (thirdTens * 10);
    }
    
    return tenscarry;
  };
  
  const generatePage11QuestionText = (questionData) => {
    if (!questionData) return 'Loading...';
    
    // Calculate tens carry
    const onesSum = (questionData.first_number % 10) + 
                   (questionData.second_number % 10) + 
                   (questionData.third_number ? (questionData.third_number % 10) : 0);
    const tenscarry = Math.floor(onesSum / 10) * 10;
    
    // Get tens digits from the numbers
    const maxDigits = Math.max(
      questionData.first_number.toString().length,
      questionData.second_number.toString().length,
      questionData.third_number ? questionData.third_number.toString().length : 0
    );
    
    // Calculate tens digits multiplied by 10
    const firstTens = Math.floor(questionData.first_number / 10) % 10;
    const secondTens = Math.floor(questionData.second_number / 10) % 10;
    const thirdTens = questionData.third_number ? Math.floor(questionData.third_number / 10) % 10 : 0;
    
    let questionText = '';
    
    if (maxDigits === 2 && !questionData.third_number) {
      // 2-digit 2 numbers: tenscarry + (firstTens * 10) + (secondTens * 10) = ?
      questionText = `${tenscarry} + ${firstTens * 10} + ${secondTens * 10} = ?`;
    } else if (maxDigits === 3 && !questionData.third_number) {
      // 3-digit 2 numbers: tenscarry + (firstTens * 10) + (secondTens * 10) = ?
      questionText = `${tenscarry} + ${firstTens * 10} + ${secondTens * 10} = ?`;
    } else if (maxDigits === 3 && questionData.third_number) {
      // 3-digit 3 numbers: tenscarry + (firstTens * 10) + (secondTens * 10) + (thirdTens * 10) = ?
      questionText = `${tenscarry} + ${firstTens * 10} + ${secondTens * 10} + ${thirdTens * 10} = ?`;
    }
    
    return questionText;
  };
  
  const generatePage11Options = (questionData) => {
    const correctAnswer = calculatePage11Answer(questionData);
    const incorrectAnswer1 = correctAnswer - 10;
    const incorrectAnswer2 = correctAnswer + 10;
    
    // Create structured options with feedback
    const options = [
      {
        option: correctAnswer,
        isCorrect: true,
        feedback: typeof i18n !== 'undefined' ? i18n.t('dialogs.quiz.absolutelyCorrect') : "That's absolutely correct!"
      },
      {
        option: incorrectAnswer1,
        isCorrect: false,
        feedback: typeof i18n !== 'undefined' ? i18n.t('dialogs.quiz.missedAdding') : "Looks like you missed adding 10. Try again!"
      },
      {
        option: incorrectAnswer2,
        isCorrect: false,
        feedback: typeof i18n !== 'undefined' ? i18n.t('dialogs.quiz.incorrect') : "No, that's incorrect. Try again!"
      }
    ];
    
    // Simple shuffle
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    
    return options;
  };

  // Generate quiz options for Page 13 (tens column splitting)
  const generatePage13Options = (tensColumnValue) => {
    // Calculate m and n according to the new specification
    const m = Math.floor(tensColumnValue / 100) * 100; // Hundreds component
    const n = tensColumnValue % 100; // Remainder
    
    // Generate options according to the new specification
    const options = [
      {
        option: `${m} + ${n}`,
        isCorrect: true,
        feedback: typeof i18n !== 'undefined' ? i18n.t('dialogs.quiz.splitCorrect', { value: m + n }) : `Correct! we need to carry ${m} to the hundreds place.\nSo we split it as ${m} + ${n}`
      },
      {
        option: `${m - 10} + ${n + 10}`,
        isCorrect: false,
        feedback: typeof i18n !== 'undefined' ? i18n.t('dialogs.quiz.carryErrorMessage', { incorrect: m - 10 }) : `We need to carry ${m} to the hundreds place not ${m - 10}. Try again!`
      },
      {
        option: `${n - 10} + ${m + 10}`,
        isCorrect: false,
        feedback: typeof i18n !== 'undefined' ? i18n.t('dialogs.quiz.carryErrorMessage', { incorrect: m + 10 }) : `We need to carry ${m} to the hundreds place not ${m + 10}. Try again!`
      }
    ];
    
    // Shuffle the options to randomize order
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    
    return options;
  };



  // Quiz Modal Component - now handled by grid positioning system
  const QuizModalComponent = () => {
    // For page 5, 7, 11, 13, and 17, show modal based on conditions. For page 3, only show if showQuizOverlay is true
    const shouldShowModal = currentPage === 5 || currentPage === 7 || currentPage === 13 || (currentPage === 11 && showQuizOverlay) || (currentPage === 3 && showQuizOverlay) || (currentPage === 17 && showQuizOverlay);
    
    // State to store stable options for page 5 and 7
    const [stableOptions, setStableOptions] = React.useState(null);
    const [lastQuestionId, setLastQuestionId] = React.useState(null);
    
    if (!shouldShowModal) {
      return null;
    }

    // Get the appropriate page element and modal type based on current page
    let targetPage, modalElementName, modalPositionName;
    if (currentPage === 7) {
      targetPage = 7;
      modalElementName = 'quizmodalwithtext';
      modalPositionName = 'quizmodalwithtext';
    } else if (currentPage === 13) {
      targetPage = 7; // Use page 7's modal structure for page 13
      modalElementName = 'quizmodalwithtext';
      modalPositionName = 'quizmodalwithtext';
    } else if (currentPage === 5) {
      targetPage = 5;
      modalElementName = 'quizModal';
      modalPositionName = 'quizModal';
    } else if (currentPage === 11) {
      targetPage = 11;
      modalElementName = 'quizModal';
      modalPositionName = 'quizModal';
    } else if (currentPage === 17) {
      targetPage = 17;
      modalElementName = 'quizModal';
      modalPositionName = 'quizModal';
    } else {
      targetPage = 3;
      modalElementName = 'quizModal';
      modalPositionName = 'quizModal';
    }

    const pageElement = GridPositionUtils.getPageElement(targetPage, modalElementName);
    if (!pageElement) {
      console.error(`Quiz modal not found on page ${targetPage}`);
      return null;
    }

    const position = gridPositions.getStandardElement(modalPositionName);
    if (!position) {
      console.error(`Quiz modal position not found: ${modalPositionName}`);
      return null;
    }

    const handleOptionClick = (optionObject) => {
      console.log('🎯 Quiz option clicked:', optionObject);
      setClickedOption(optionObject);
      
      // Use feedback from the option object
      setQuizFeedback(optionObject.feedback);
      
      // Use isCorrect flag to determine if quiz is completed
      if (optionObject.isCorrect) {
        setCompletedQuizPages(prev => new Set([...prev, currentPage])); // Mark page as completed
        console.log(`🔓 Page ${currentPage} quiz completed - Next button enabled`);
      }
    };

    // Process GC styles from gridPositions configuration
    const processedHeaderStyles = GridCellFontUtils.processGcStyles(pageElement.props.headerStyles);
    const processedButtonStyles = GridCellFontUtils.processGcStyles(pageElement.props.buttonStyles);
    const processedCorrectButtonStyles = GridCellFontUtils.processGcStyles(pageElement.props.correctButtonStyles);
    const processedIncorrectButtonStyles = GridCellFontUtils.processGcStyles(pageElement.props.incorrectButtonStyles);
    const processedFeedbackStyles = GridCellFontUtils.processGcStyles(pageElement.props.feedbackStyles);
    const processedButtonContainerStyles = GridCellFontUtils.processGcStyles(pageElement.props.buttonContainerStyles);
    
    // Process description styles if this is a quizmodalwithtext
    const processedDescriptionStyles = (currentPage === 7 || currentPage === 13) ? 
      GridCellFontUtils.processGcStyles(pageElement.props.descriptionStyles) : 
      null;
    
    // Process only the modal-level properties (not nested style objects)
    const processedModalProps = GridCellFontUtils.processGcStyles({
      backgroundColor: pageElement.props.backgroundColor,
      borderRadius: pageElement.props.borderRadius,
      border: pageElement.props.border,
      padding: pageElement.props.padding,
      display: pageElement.props.display,
      flexDirection: pageElement.props.flexDirection,
      alignItems: pageElement.props.alignItems,
      justifyContent: pageElement.props.justifyContent,
      pointerEvents: pageElement.props.pointerEvents,
      boxSizing: pageElement.props.boxSizing
    });



    // Get content based on current page
    const getModalContent = () => {
      if (currentPage === 7) {
        // Page 7: Carry-over splitting quiz (ones column)
        // Get digit calculation values from global context
        const currentOnesdigitsum = typeof window !== 'undefined' && window.getOnesdigitsum ? window.getOnesdigitsum() : 0;
        const currentTensCarry = typeof window !== 'undefined' && window.getTensCarry ? window.getTensCarry() : 0;
        const currentOnesdigitanswer = typeof window !== 'undefined' && window.getOnesdigitanswer ? window.getOnesdigitanswer() : 0;
        
        const headerText = pageElement.props.getHeaderText ? 
          pageElement.props.getHeaderText(currentOnesdigitsum) : 
                     (typeof i18n !== 'undefined' ? i18n.t('dialogs.quiz.howShouldWeSplit', { value: currentOnesdigitsum }) : `To do a carry over, how should we split ${currentOnesdigitsum}?`);
        
        const descriptionText = pageElement.props.getDescriptionText ?
          pageElement.props.getDescriptionText(currentOnesdigitsum) :
                     (typeof i18n !== 'undefined' ? i18n.t('dialogs.quiz.splitForCarryOverTens', { value: currentOnesdigitsum }) : `${currentOnesdigitsum} > 9\n\nWe need to split ${currentOnesdigitsum} to do a carry over to tens place.`);
        
        // Generate stable options once per question
        const questionId = `${currentPage}-${currentOnesdigitsum}-${currentTensCarry}-${currentOnesdigitanswer}`;
        
        if (lastQuestionId !== questionId || !stableOptions) {
          // Generate new options for this question
          const rawOptions = pageElement.props.getOptions ? 
            pageElement.props.getOptions(currentOnesdigitsum, currentTensCarry, currentOnesdigitanswer) : 
            [];
          
          // Convert to structured format if needed (page 7 options should already be in new format)
          const newOptions = rawOptions.map(option => {
            if (typeof option === 'object' && option.option !== undefined) {
              return option; // Already in new format
            } else {
              // Convert old format to new format (fallback)
              return {
                option: option.text || option,
                isCorrect: option.isCorrect || false,
                feedback: option.feedback || "Try again!"
              };
            }
          });
          
          setStableOptions(newOptions);
          setLastQuestionId(questionId);
          return { headerText, descriptionText, options: newOptions, correctAnswer: currentOnesdigitsum };
        }
        
        // Use previously generated stable options
        return { headerText, descriptionText, options: stableOptions, correctAnswer: currentOnesdigitsum };
      } else if (currentPage === 13) {
        // Page 13: Tens carry-over splitting quiz (tens column)
        const currentQuestion = PageUtils.getCurrentQuestion(currentPage);
        if (!currentQuestion) return { headerText: 'Loading...', options: [] };
        
        // Calculate tens values like page 12 does
        const onesSum = (currentQuestion.first_number % 10) + 
                       (currentQuestion.second_number % 10) + 
                       (currentQuestion.third_number ? (currentQuestion.third_number % 10) : 0);
        const tenscarry = Math.floor(onesSum / 10) * 10;
        
        // Calculate tens digits multiplied by 10
        const firstTens = Math.floor(currentQuestion.first_number / 10) % 10;
        const secondTens = Math.floor(currentQuestion.second_number / 10) % 10;
        const thirdTens = currentQuestion.third_number ? Math.floor(currentQuestion.third_number / 10) % 10 : 0;
        
        // Determine problem type
        const maxDigits = Math.max(
          currentQuestion.first_number.toString().length,
          currentQuestion.second_number.toString().length,
          currentQuestion.third_number ? currentQuestion.third_number.toString().length : 0
        );
        const numberCount = currentQuestion.third_number ? 3 : 2;
        
        let tensColumnValue, headerText, descriptionText;
        
        if (maxDigits === 3 && numberCount === 2) {
          // 3-digit 2 numbers
          tensColumnValue = tenscarry + (firstTens * 10) + (secondTens * 10);
          headerText = typeof i18n !== 'undefined' ? i18n.t('dialogs.quiz.howShouldWeSplit', { value: tensColumnValue }) : `To do a carry over, how should we split ${tensColumnValue}?`;
          descriptionText = typeof i18n !== 'undefined' ? i18n.t('dialogs.quiz.splitForCarryOverHundreds', { value: tensColumnValue }) : `${tensColumnValue} > 90\n\nWe need to split ${tensColumnValue} to do a carry over to hundreds place.`;
        } else if (maxDigits === 3 && numberCount === 3) {
          // 3-digit 3 numbers
          tensColumnValue = tenscarry + (firstTens * 10) + (secondTens * 10) + (thirdTens * 10);
          headerText = typeof i18n !== 'undefined' ? i18n.t('dialogs.quiz.howShouldWeSplit', { value: tensColumnValue }) : `To do a carry over, how should we split ${tensColumnValue}?`;
          descriptionText = typeof i18n !== 'undefined' ? i18n.t('dialogs.quiz.splitForCarryOverHundreds', { value: tensColumnValue }) : `${tensColumnValue} > 90\n\nWe need to split ${tensColumnValue} to do a carry over to hundreds place.`;
        } else {
          // Default case (2-digit or other cases)
          tensColumnValue = tenscarry + (firstTens * 10) + (secondTens * 10);
          headerText = typeof i18n !== 'undefined' ? i18n.t('dialogs.quiz.howShouldWeSplit', { value: tensColumnValue }) : `To do a carry over, how should we split ${tensColumnValue}?`;
          descriptionText = typeof i18n !== 'undefined' ? i18n.t('dialogs.quiz.splitForCarryOverTens', { value: tensColumnValue }) : `${tensColumnValue} > 9\n\nWe need to split ${tensColumnValue} to do a carry over to tens place.`;
        }
        
        // Generate stable options once per question
        const questionId = `page13-${currentQuestion.first_number}-${currentQuestion.second_number}-${currentQuestion.third_number || 0}-${tensColumnValue}`;
        
        if (lastQuestionId !== questionId || !stableOptions) {
          // Generate new options for page 13 based on tens column value
          const newOptions = generatePage13Options(tensColumnValue);
          setStableOptions(newOptions);
          setLastQuestionId(questionId);
          return { headerText, descriptionText, options: newOptions, correctAnswer: tensColumnValue };
        }
        
        // Use previously generated stable options
        return { headerText, descriptionText, options: stableOptions, correctAnswer: tensColumnValue };
      } else if (currentPage === 5) {
        // Page 5: Custom ones digit addition quiz
        const currentQuestion = PageUtils.getCurrentQuestion(currentPage);
        if (!currentQuestion) return { headerText: 'Loading...', options: [] };
        
        const headerText = pageElement.props.getQuestionText ? 
          pageElement.props.getQuestionText(currentQuestion) : 
          'Question not available';
        
        // Calculate correct answer for Page 5
        const firstOnes = currentQuestion.first_number % 10;
        const secondOnes = currentQuestion.second_number % 10;
        const thirdOnes = currentQuestion.third_number ? currentQuestion.third_number % 10 : null;
        const correctAnswer = thirdOnes !== null ? 
          firstOnes + secondOnes + thirdOnes : 
          firstOnes + secondOnes;
        
        // Generate stable options once per question
        const questionId = `${currentQuestion.first_number}-${currentQuestion.second_number}-${currentQuestion.third_number || 0}`;
        
        if (lastQuestionId !== questionId || !stableOptions) {
          // Generate new options for this question
          const rawOptions = pageElement.props.getOptions ? 
            pageElement.props.getOptions(currentQuestion) : 
            [];
          
          // Convert simple arrays to structured format if needed
          const newOptions = rawOptions.map(option => {
            if (typeof option === 'object' && option.option !== undefined) {
              return option; // Already in new format
            } else {
              // Convert simple value to structured format
              return {
                option: option,
                isCorrect: option === correctAnswer,
                feedback: option === correctAnswer ? 
                  (pageElement.props.correctFeedback || "Correct!") : 
                  (pageElement.props.incorrectFeedback || "Try again!")
              };
            }
          });
          
          setStableOptions(newOptions);
          setLastQuestionId(questionId);
          return { headerText, options: newOptions, correctAnswer };
        }
        
        // Use previously generated stable options
        return { headerText, options: stableOptions, correctAnswer };
      } else if (currentPage === 11) {
        // Page 11: Tens digit addition quiz
        const currentQuestion = PageUtils.getCurrentQuestion(currentPage);
        if (!currentQuestion) return { headerText: 'Loading...', options: [] };
        
        const headerText = generatePage11QuestionText(currentQuestion);
        
        // Generate stable options once per question
        const questionId = `page11-${currentQuestion.first_number}-${currentQuestion.second_number}-${currentQuestion.third_number || 0}`;
        
        if (lastQuestionId !== questionId || !stableOptions) {
          // Generate new options for this question
          const newOptions = generatePage11Options(currentQuestion);
          const correctAnswer = calculatePage11Answer(currentQuestion);
          setStableOptions(newOptions);
          setLastQuestionId(questionId);
          return { headerText, options: newOptions, correctAnswer };
        }
        
        // Use previously generated stable options
        const correctAnswer = calculatePage11Answer(currentQuestion);
        return { headerText, options: stableOptions, correctAnswer };
      } else if (currentPage === 17) {
        // Page 17: Final assessment quiz
        const currentQuestion = PageUtils.getCurrentQuestion(currentPage);
        if (!currentQuestion) return { headerText: 'Loading...', options: [] };
        
        const headerText = pageElement.props.getQuestionText ? 
          pageElement.props.getQuestionText(currentQuestion) : 
          'Final Assessment';
        
        // Generate stable options once per question
        const questionId = `page17-${currentQuestion.first_number}-${currentQuestion.second_number}-${currentQuestion.third_number || 0}`;
        
        if (lastQuestionId !== questionId || !stableOptions) {
          // Generate new options for this question
          const correctAnswer = pageElement.props.getCorrectAnswer ? 
            pageElement.props.getCorrectAnswer(currentQuestion) : 
            (currentQuestion.first_number + currentQuestion.second_number + (currentQuestion.third_number || 0));
          
          // Check if this is a 3-digit question
          const maxDigits = Math.max(
            currentQuestion.first_number.toString().length,
            currentQuestion.second_number.toString().length,
            currentQuestion.third_number ? currentQuestion.third_number.toString().length : 0
          );
          const numberCount = currentQuestion.third_number ? 3 : 2;
          
          let newOptions;
          if (maxDigits === 3 && (numberCount === 3 || numberCount === 2)) {
            // For 3-digit questions (both 2-number and 3-number): specific format with hundreds place values
            // Generate exactly 3 options: correct, and two incorrect based on individual hundreds
            const first = currentQuestion.first_number;
            const second = currentQuestion.second_number;
            const third = currentQuestion.third_number;
            
            // Get individual hundreds place values
            const firstHundreds = Math.floor(first / 100) * 100;
            const secondHundreds = Math.floor(second / 100) * 100;
            const thirdHundreds = third ? Math.floor(third / 100) * 100 : 0;
            
            // Create exactly 3 options
            if (numberCount === 3) {
            newOptions = [
                correctAnswer,           // Correct: hundredsCarry + firstHundreds + secondHundreds + thirdHundreds
                firstHundreds + secondHundreds + thirdHundreds,  // Incorrect: missing carry
                firstHundreds + secondHundreds   // Incorrect: missing third number
              ];
            } else {
              newOptions = [
                correctAnswer,           // Correct: hundredsCarry + firstHundreds + secondHundreds
                firstHundreds + secondHundreds,  // Incorrect: missing carry
                firstHundreds            // Incorrect: only first number
              ];
            }
            
            // Remove duplicates and filter out negative/zero values
            newOptions = newOptions.filter((value, index, self) => 
              self.indexOf(value) === index && value > 0
            );
            
            // If we don't have exactly 3 unique options, add more
            while (newOptions.length < 3) {
              const additionalOption = correctAnswer + (newOptions.length * 100);
              if (!newOptions.includes(additionalOption) && additionalOption > 0) {
                newOptions.push(additionalOption);
              }
            }
            
            // Take only first 3 options and shuffle
            newOptions = newOptions.slice(0, 3).sort(() => Math.random() - 0.5);
          } else {
            // For other cases: generate multiple variations as before
            const incorrectAnswer = pageElement.props.getIncorrectAnswer ? 
              pageElement.props.getIncorrectAnswer(currentQuestion) : 
              correctAnswer + 1;
            
            newOptions = [
              correctAnswer,
              incorrectAnswer,
              correctAnswer + 10,
              correctAnswer - 10
            ].filter((value, index, self) => self.indexOf(value) === index && value > 0) // Remove duplicates and negative values
             .sort(() => Math.random() - 0.5); // Shuffle options
          }
          
          // Convert simple arrays to structured format
          const structuredOptions = newOptions.map(option => ({
            option: option,
            isCorrect: option === correctAnswer,
            feedback: option === correctAnswer ? 
              (pageElement.props.correctFeedback || "Correct!") : 
              (pageElement.props.incorrectFeedback || "Try again!")
          }));
          
          setStableOptions(structuredOptions);
          setLastQuestionId(questionId);
          return { headerText, options: structuredOptions, correctAnswer };
        }
        
        // Use previously generated stable options
        const correctAnswer = pageElement.props.getCorrectAnswer ? 
          pageElement.props.getCorrectAnswer(currentQuestion) : 
          (currentQuestion.first_number + currentQuestion.second_number + (currentQuestion.third_number || 0));
        
        return { headerText, options: stableOptions, correctAnswer };
      } else {
        // Page 3: Standard quiz
        // Convert simple arrays to structured format if needed
        const rawOptions = pageElement.props.options || [];
        const structuredOptions = rawOptions.map(option => {
          if (typeof option === 'object' && option.option !== undefined) {
            return option; // Already in new format
          } else {
            // Convert simple value to structured format
            return {
              option: option,
              isCorrect: option === pageElement.props.correctAnswer,
              feedback: option === pageElement.props.correctAnswer ? 
                (pageElement.props.correctFeedback || "Correct!") : 
                (pageElement.props.incorrectFeedback || "Try again!")
            };
          }
        });
        
        return { 
          headerText: pageElement.props.title, 
          options: structuredOptions,
          correctAnswer: pageElement.props.correctAnswer
        };
      }
    };

    const modalContent = getModalContent();

    return React.createElement('div', {
      className: 'quiz-modal',
      style: {
        ...position.css,
        // Override with quiz-specific styles for proper layering
        zIndex: '999999', // Highest z-index to ensure it's on top
        position: 'absolute',
        backgroundColor: processedModalProps.backgroundColor,
        borderRadius: processedModalProps.borderRadius,
        border: processedModalProps.border,
        padding: processedModalProps.padding,
        display: shouldShowModal ? 'flex' : 'none',
        flexDirection: processedModalProps.flexDirection,
        alignItems: processedModalProps.alignItems,
        justifyContent: processedModalProps.justifyContent,
        pointerEvents: processedModalProps.pointerEvents,
        boxSizing: processedModalProps.boxSizing
      },
      'data-grid-position': 'quizModal'
    },
      // Two-column layout for quizmodalwithtext (pages 7 and 13)
      (currentPage === 7 || currentPage === 13) ? React.createElement('div', {
        style: {
          display: 'flex',
          width: '100%',
          height: '100%',
          gap: '0px'
        }
      },
        // Left Column (40%) - Description Text
        React.createElement('div', {
          style: {
            flex: '0 0 40%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px 15px'
          }
        },
          modalContent.descriptionText && React.createElement('div', {
            style: {
              fontSize: '28px',
              lineHeight: '1.3',
              textAlign: 'center',
              color: '#ffffff',
              fontWeight: 'bold',
              margin: '0',
              width: '100%',
              maxWidth: '100%',
              padding: '0',
              boxSizing: 'border-box'
            }
          }, modalContent.descriptionText)
        ),
        
        // Right Column (60%) - Header, Buttons, Feedback
        React.createElement('div', {
          style: {
            flex: '0 0 60%',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            backgroundColor: 'rgba(50, 50, 50, 0.95)',
            borderRadius: '15px'
          }
        },
          // Top Row (20%) - Header
          React.createElement('div', {
            style: {
              flex: '0 0 20%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '15px 20px'
            }
          },
            React.createElement('h1', {
              style: {
                margin: '0',
                textAlign: 'center',
                color: '#ffffff',
                fontSize: '24px',
                fontWeight: 'bold',
                width: '80%',
                maxWidth: '100%',
                padding: '0',
                boxSizing: 'border-box'
              }
            }, modalContent.headerText)
          ),
          
          // Middle Row (50%) - Buttons
          React.createElement('div', {
            style: {
              flex: '0 0 50%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 20px'
            }
          },
            ...modalContent.options.map(option => {
              return React.createElement('button', {
                key: option.option,
                style: (() => {
                  // Check all conditions separately
                  const hasQuizFeedback = !!quizFeedback;
                  const hasClickedOption = !!clickedOption;
                  const isClickedOption = clickedOption && option.option === clickedOption.option;
                  
                  // Use isCorrect flag from option object to determine button color
                  const shouldBeGreen = hasQuizFeedback && hasClickedOption && option.isCorrect && isClickedOption;
                  const shouldBeRed = hasQuizFeedback && hasClickedOption && !option.isCorrect && isClickedOption;
                  
                  if (shouldBeGreen) {
                    return {
                      ...processedCorrectButtonStyles,
                      backgroundColor: 'rgba(102, 204, 102, 0.9)',
                      borderColor: '#66cc66',
                      border: '3px solid #66cc66',
                      width: '70%',
                      minHeight: '55px',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    };
                  } else if (shouldBeRed) {
                    return {
                      ...processedButtonStyles,
                      backgroundColor: 'rgba(255, 102, 102, 0.9)',
                      borderColor: '#ff6666',
                      border: '3px solid #ff6666',
                      width: '70%',
                      minHeight: '55px',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    };
                  } else {
                    return {
                      ...processedButtonStyles,
                      width: '70%',
                      minHeight: '55px',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: '3px solid #333',
                      color: '#333'
                    };
                  }
                })(),
                onClick: () => handleOptionClick(option),
                onMouseEnter: (e) => {
                  if (!quizFeedback || !clickedOption) {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                    e.target.style.transform = 'scale(1.02)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
                  }
                },
                onMouseLeave: (e) => {
                  if (!quizFeedback || !clickedOption) {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = 'none';
                  }
                }
              }, option.option);
            })
          ),
          
          // Bottom Row (30%) - Feedback
          React.createElement('div', {
            style: {
              flex: '0 0 30%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '25px 30px'
            }
          },
            quizFeedback && React.createElement('div', {
              style: {
                color: (() => {
                  // Use isCorrect flag from clicked option to determine feedback color
                  const isCorrectOption = clickedOption && clickedOption.isCorrect;
                  return isCorrectOption ? '#4CAF50' : '#FF5252';
                })(),
                textAlign: 'center',
                width: '70%',
                maxWidth: '100%',
                fontSize: '23px',
                fontWeight: 'bold',
                lineHeight: '1.3',
                padding: '20px',
                border: '2px solid',
                borderColor: (() => {
                  const isCorrectOption = clickedOption && clickedOption.isCorrect;
                  return isCorrectOption ? '#4CAF50' : '#FF5252';
                })(),
                borderRadius: '10px',
                backgroundColor: (() => {
                  const isCorrectOption = clickedOption && clickedOption.isCorrect;
                  return isCorrectOption ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 82, 82, 0.1)';
                })(),
                boxSizing: 'border-box',
                margin: '0'
              }
            }, quizFeedback)
          )
        )
      ) : 
      // Regular single-column layout for other quiz pages (3, 5, 11, 17)
      React.createElement('div', {
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%'
        }
      },
        // Quiz Header
        React.createElement('h1', {
          style: processedHeaderStyles
        }, modalContent.headerText),

        // Quiz Options Container
        React.createElement('div', {
          style: processedButtonContainerStyles
        },
          ...modalContent.options.map(optionObject => {
            return React.createElement('button', {
              key: optionObject.option,
              style: (() => {
                // Check all conditions separately
                const hasQuizFeedback = !!quizFeedback;
                const hasClickedOption = !!clickedOption;
                const isClickedOption = clickedOption && clickedOption.option === optionObject.option;
                
                // Use isCorrect flag from option object to determine button color
                const shouldBeGreen = hasQuizFeedback && hasClickedOption && optionObject.isCorrect && isClickedOption;
                const shouldBeRed = hasQuizFeedback && hasClickedOption && !optionObject.isCorrect && isClickedOption;
                
                if (shouldBeGreen) {
                  return {
                    ...processedCorrectButtonStyles,
                    backgroundColor: 'rgba(102, 204, 102, 0.9)',
                    borderColor: '#66cc66',
                    border: '3px solid #66cc66'
                  };
                } else if (shouldBeRed) {
                  return {
                    ...processedButtonStyles,
                    backgroundColor: 'rgba(255, 102, 102, 0.9)',
                    borderColor: '#ff6666',
                    border: '3px solid #ff6666'
                  };
                } else {
                  return processedButtonStyles;
                }
              })(),
              onClick: () => handleOptionClick(optionObject),
              onMouseEnter: (e) => {
                if (!quizFeedback || !clickedOption) {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                  e.target.style.transform = 'scale(1.05)';
                }
              },
              onMouseLeave: (e) => {
                if (!quizFeedback || !clickedOption) {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                  e.target.style.transform = 'scale(1)';
                }
              }
            }, optionObject.option);
          })
        ),

        // Feedback Display
        quizFeedback && React.createElement('div', {
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '25px 30px',
            minHeight: '100px'
          }
        },
          React.createElement('div', {
            style: {
              color: (() => {
                // Use isCorrect flag from clicked option to determine feedback color
                const isCorrectOption = clickedOption && clickedOption.isCorrect;
                return isCorrectOption ? '#4CAF50' : '#FF5252';
              })(),
              textAlign: 'center',
              width: '70%',
              maxWidth: '100%',
              fontSize: '23px',
              fontWeight: 'bold',
              lineHeight: '1.3',
              padding: '20px',
              border: '2px solid',
              borderColor: (() => {
                const isCorrectOption = clickedOption && clickedOption.isCorrect;
                return isCorrectOption ? '#4CAF50' : '#FF5252';
              })(),
              borderRadius: '10px',
              backgroundColor: (() => {
                const isCorrectOption = clickedOption && clickedOption.isCorrect;
                return isCorrectOption ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 82, 82, 0.1)';
              })(),
              boxSizing: 'border-box',
              margin: '0'
            }
          }, quizFeedback)
        )
      )
    );
  };

  return React.createElement('div', {
    className: 'main-container',
    style: {
      width: '100vw',
      height: '100vh',
      backgroundImage: 'url(assets/background.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',
      pointerEvents: 'none'
    }
  },
    // Marquee component (before logo so logo appears in front)
    React.createElement(MarqueeComponent),
    // Logo component
    React.createElement(LogoComponent),
    // Header component
    React.createElement(HeaderComponent),
    // Page indicator component
    React.createElement(PageIndicatorComponent),
    // Container components
    React.createElement(Container1Component),
    React.createElement(Container2Component),
    // Character component
    React.createElement(CharacterComponent),
    // Dialog component
    React.createElement(DialogComponent),
    // Instruction header component
    React.createElement(InstructionHeaderComponent),
    // Question dropdown component
    React.createElement(QuestionDropdownComponent),
    // Grid1 component
    React.createElement(Grid1Component),
    // Grid2 component
    React.createElement(Grid2Component),
    // Quiz Modal component
    React.createElement(QuizModalComponent),
    // Next Button component
    React.createElement(NextButtonComponent),
    // Previous Button component
    React.createElement(PreviousButtonComponent)
  );
};

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
  const root = document.getElementById('react-root');
  if (root && ReactDOM) {
    const reactRoot = ReactDOM.createRoot(root);
    reactRoot.render(React.createElement(MathLearningApp));
    
    // Grid elements are now handled by React components
  } else {
    console.error('React root element or ReactDOM not found');
  }
}); 