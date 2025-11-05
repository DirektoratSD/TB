// Math Learning Applet - Grid Editor Version
// This version includes grid editor integration for layout design
const { useState, useEffect, useCallback } = React;

// Function to make React elements editable in grid editor
const makeReactElementsEditable = () => {
  console.log('🔧 Attempting to make React elements editable...');
  console.log('Current grid dimensions:', window.gridPositions ? window.gridPositions.gridDimensions : 'N/A');
  
  // Get the grid system instance first
  const gridSystem = window.gridSystem || GridSystem.getInstance();
  
  console.log('GridSystem available:', !!gridSystem);
  console.log('GridEditor available:', !!window.gridEditor);
  console.log('GridEditor enabled:', window.gridEditor ? window.gridEditor.isEnabled : 'N/A');
  
  if (!window.gridEditor) {
    console.warn('GridEditor not available');
    return;
  }
  
  if (!window.gridEditor.isEnabled) {
    console.warn('GridEditor not enabled');
    return;
  }
  
  if (!gridSystem) {
    console.warn('GridSystem not available');
    return;
  }

  const characterContainer = document.querySelector('.character-container');
  const dialogContainer = document.querySelector('.dialog-container');
  
  console.log('Found elements:', { characterContainer, dialogContainer });
  
  [characterContainer, dialogContainer].forEach((element, index) => {
    if (element) {
      // Add unique identifier
      const elementId = element.className.includes('character') ? 'react-character' : 'react-dialog';
      element.id = elementId;
      
      // Get current coordinates from the element's data attribute
      const coordinates = element.getAttribute('data-coordinates');
      const gridPosition = element.getAttribute('data-grid-position');
      
      // Convert element to absolute positioning for dragging
      const currentPosition = element.getBoundingClientRect();
      element.style.position = 'absolute';
      element.style.left = `${currentPosition.left}px`;
      element.style.top = `${currentPosition.top}px`;
      element.style.width = `${currentPosition.width}px`;
      element.style.height = `${currentPosition.height}px`;
      element.style.zIndex = '10';
      
      // Force remove any existing editor styling first
      element.classList.remove('grid-editable');
      const existingHandles = element.querySelectorAll('.resize-handle');
      existingHandles.forEach(handle => handle.remove());
      const existingInfo = element.querySelector('.element-info');
      if (existingInfo) existingInfo.remove();
      
              // Parse coordinates properly
        let parsedCoords = [1, 1, 10, 10]; // default
        let coordinateString = 'R1C1-R10C10'; // default
        
        if (coordinates) {
          try {
            // Handle array format like "[3, 3, 48, 110]"
            if (coordinates.startsWith('[') && coordinates.endsWith(']')) {
              const coordArray = JSON.parse(coordinates);
              parsedCoords = coordArray;
              coordinateString = `R${coordArray[0]}C${coordArray[1]}-R${coordArray[2]}C${coordArray[3]}`;
            } else {
              // Handle R1C1-R10C10 format
              coordinateString = coordinates;
              parsedCoords = gridSystem?.calculations?.parseCoordinates(coordinates) || [1, 1, 10, 10];
            }
            console.log(`📍 Parsed coordinates for ${elementId}:`, parsedCoords, coordinateString);
          } catch (error) {
            console.error(`Failed to parse coordinates "${coordinates}" for ${elementId}:`, error);
          }
        }
        
        // Apply the correct position to the element
        if (parsedCoords && parsedCoords.length === 4) {
          console.log(`🎯 Applying coordinates [${parsedCoords.join(', ')}] to ${elementId}`);
          const customPosition = gridPositions.createCustomElement(parsedCoords, `Custom ${elementId}`);
          console.log(`📍 Generated position for ${elementId}:`, customPosition);
          
          if (customPosition && customPosition.css) {
            // Store original style for comparison
            const originalStyle = {
              position: element.style.position,
              left: element.style.left,
              top: element.style.top,
              width: element.style.width,
              height: element.style.height
            };
            
            // Apply new styles
            Object.assign(element.style, customPosition.css);
            element.style.position = 'absolute'; // Ensure absolute positioning
            
            console.log(`📝 Style changes for ${elementId}:`);
            console.log('  Original:', originalStyle);
            console.log('  New CSS:', customPosition.css);
            console.log('  Applied:', {
              position: element.style.position,
              left: element.style.left,
              top: element.style.top,
              width: element.style.width,
              height: element.style.height
            });
            
            // Force a reflow to ensure styles are applied
            element.offsetHeight; // trigger reflow
            
            console.log(`✅ Applied custom position to ${elementId}`);
          } else {
            console.error(`❌ Failed to generate position for ${elementId} with coordinates:`, parsedCoords);
          }
        }
        
        // Register with grid system if not already registered
        if (!gridSystem.elements.has(elementId)) {
          // Create element data structure that matches grid system expectations
          const elementData = {
            element: element,
            coordinates: coordinateString,
            coords: parsedCoords,
            type: 'react-component',
            options: {
              id: elementId,
              styles: {},
              className: element.className
            }
          };
          
          // Add to grid system's elements Map
          gridSystem.elements.set(elementId, elementData);
          
          // Add to main page if PageManager is available
          if (window.pageManager) {
            window.pageManager.addElementToPage(elementId, 'page1');
          }
          
          console.log(`✅ Registered ${elementId} with grid system:`, elementData);
        }
      
      // Add editable styling and functionality
      element.classList.add('grid-editable');
      element.style.cursor = 'move';
      element.style.border = '3px solid rgba(255, 0, 0, 0.8)'; // Red border to make it obvious
      element.style.userSelect = 'none';
      element.style.pointerEvents = 'auto'; // Ensure it can receive events
      
      // Add resize handles
      try {
        window.gridEditor.addResizeHandles(element);
        console.log(`✅ Added resize handles to ${elementId}`);
      } catch (error) {
        console.error(`Failed to add resize handles to ${elementId}:`, error);
      }
      
      // Add info overlay
      if (window.gridEditor.settings && window.gridEditor.settings.showElementInfo) {
        try {
          const elementData = gridSystem.elements.get(elementId);
          window.gridEditor.addElementInfo(element, elementData);
          console.log(`✅ Added info overlay to ${elementId}`);
        } catch (error) {
          console.error(`Failed to add info overlay to ${elementId}:`, error);
        }
      }
      
      console.log(`✅ Made ${elementId} editable with absolute positioning`);
    }
  });
  
  console.log('🎯 React elements editability setup complete');
};

// Add header text box function
const createHeaderTextBox = () => {
  console.log('🎯 Creating header text box...');
  
  // Get the grid system instance
  const gridSystem = window.gridSystem || GridSystem.getInstance();
  if (!gridSystem) {
    console.warn('GridSystem not available for header creation');
    return;
  }
  
  // Create header text box spanning full width and 5 rows
  const headerCoords = 'R1C1-R5C128'; // Full width, 5 rows high
  const headerText = 'Math Learning Platform - Interactive Grid System';
  
  const headerElement = gridSystem.createTextBox(headerCoords, headerText, {
    styles: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)', // Black background with 70% opacity
      color: 'white',                        // White font
      fontSize: '120gc',                     // Large font size using grid cell units
      fontWeight: 'bold',                    // Bold text
      textAlign: 'center',                   // Center aligned
      padding: '10px 20px',                  // Padding
      borderRadius: '0px',                   // No rounded corners for header
      textShadow: '2px 2px 4px rgba(0,0,0,0.8)', // Text shadow for better readability
      border: '2px solid rgba(255, 255, 255, 0.3)', // Subtle white border
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '100'                          // High z-index to stay on top
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

// Main App Component (Editor Version)
const MathLearningApp = () => {
  // Responsive font scaling based on screen size
  const [screenSize, setScreenSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(3); // We have 3 pages now
  const [showGrid2, setShowGrid2] = useState(false); // Grid2 visibility state
  
  // Animation states for Grid1 - moved to top level to prevent state corruption
  const [hasAnimated, setHasAnimated] = useState(false);
  const [animatedPosition, setAnimatedPosition] = useState(null);
  
  // Grid2 visibility flags - all default to false
  const [firstNumberFlag, setFirstNumberFlag] = useState(false);
  const [secondNumberFlag, setSecondNumberFlag] = useState(false);
  const [thirdNumberFlag, setThirdNumberFlag] = useState(false);
  const [separatorFlag, setSeparatorFlag] = useState(false);
  
  // Grid1 behavior flag - controls animation and highlighting
  const [grid1Flag, setGrid1Flag] = useState(false);
  
  // Current highlight focus for progressive sequence
  const [currentHighlightFocus, setCurrentHighlightFocus] = useState('R1C2');
  
  // Page 2 Grid1 animation completion flag
  const [p2grid1animationcomplete, setP2grid1animationcomplete] = useState(false);
  
  // Quiz overlay state
  const [showQuizOverlay, setShowQuizOverlay] = useState(false);
  const [quizFeedback, setQuizFeedback] = useState('');
  const [clickedOption, setClickedOption] = useState(null);



  useEffect(() => {
    const handleResize = () => {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
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
      delete window.navigateToPage;
      delete window.getCurrentPage;
    };
  }, [currentPage, totalPages]);

  // Set Grid2 visibility based on page
  useEffect(() => {
    if (currentPage === 2 || currentPage === 3) {
      setShowGrid2(true);
      console.log(`🔄 Page ${currentPage} - Grid2 shown immediately`);
    } else {
      setShowGrid2(false);
      console.log('🔄 Page changed - Grid2 hidden');
    }
  }, [currentPage]);

  // Animation states are now reset in question change handlers to prevent timing conflicts

  // Make elements editable when grid editor is enabled
  useEffect(() => {
    const checkEditor = setInterval(() => {
      if (window.gridEditor) {
        // Override the showEditor method to include our React elements
        const originalShowEditor = window.gridEditor.showEditor.bind(window.gridEditor);
        window.gridEditor.showEditor = function() {
          originalShowEditor();
          setTimeout(makeReactElementsEditable, 500); // Increased delay
        };
        
        // Also try to make elements editable immediately if editor is already enabled
        if (window.gridEditor.isEnabled) {
          setTimeout(makeReactElementsEditable, 300);
        }
        
        clearInterval(checkEditor);
      }
    }, 100);
    
    return () => clearInterval(checkEditor);
  }, []);

  // Additional effect to ensure elements become editable when they're rendered
  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.gridEditor && window.gridEditor.isEnabled) {
        makeReactElementsEditable();
        
        // Grid elements are now handled by React components
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Create header component with grid positioning
  const HeaderComponent = () => {
    const position = gridPositions.getStandardElement('header');
    
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
        justifyContent: 'center',
        zIndex: '1000',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '0px',
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
      },
      'data-grid-position': 'header',
      'data-coordinates': '[1, 1, 4, 128]'
    },
      typeof i18n !== 'undefined' ? i18n.t('appInfo.titleEditor') : 'Math Learning Platform - Long Column Addition (Editor Mode)'
    );
  };

  // Static components moved outside main app - they now use React.memo for optimization

  // Create dialog box component with clean, conflict-free implementation
  const DialogComponent = () => {
    // Use the updated dialogBubble coordinates
    const position = gridPositions.getScreenElement('dialogBubble');
    
    // Use EXACT same pattern as NextButton - get element and process styles  
    const pageElement = GridPositionUtils.getPageElement(1, 'dialog-bubble');
    const dialogElement = pageElement || StandardPositions.dialogBubble;
    
    // Process dialog styles using the same GridCellFontUtils as NextButton
    // Dialog has props.options structure, NextButton has direct props
    const dialogOptions = dialogElement.props.options || {};
    const processedDialogStyles = GridCellFontUtils.processGcStyles(dialogOptions);
    
    // Grid calculations are handled by the caching system
    // No need to force updates on every render
    
    // Debug: Log what we're getting - same as NextButton debug pattern
    console.log('🔍 [DialogComponent Editor Debug] Dialog element:', dialogElement);
    console.log('🔍 [DialogComponent Editor Debug] Raw options:', rawDialogOptions);
    console.log('🔍 [DialogComponent Editor Debug] Processed styles:', processedDialogStyles);
    console.log('🔍 [DialogComponent Editor Debug] fontSize value:', processedDialogStyles.fontSize);
    console.log('🔍 [DialogComponent Editor Debug] fontSize type:', typeof processedDialogStyles.fontSize);
    
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
            // Apply processed styles directly - same pattern as NextButton
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
          // Get text from page configuration first
          const pageElement = GridPositionUtils.getPageElement(currentPage, 'dialog-bubble');
          if (pageElement && pageElement.props && typeof pageElement.props.text === 'function') {
            return pageElement.props.text();
          } else if (pageElement && pageElement.props && pageElement.props.text) {
            return pageElement.props.text;
          }
          // Fallback text using i18n system
          return typeof i18n !== 'undefined' ? i18n.t(`dialogs.page${currentPage}.dialogtext`) : 
            (currentPage === 1 ? "Let's solve this addition challenge." : "Split the numbers into their place values.");
        })())
      )
    );
  };

  // Create instruction header component
  const InstructionHeaderComponent = () => {
    const position = gridPositions.getScreenElement('instructionHeader');
    const pageElement = GridPositionUtils.getPageElement(1, 'instruction-header');
    const instructionElement = pageElement || StandardPositions.instructionHeader;
    
    console.log('🔍 [InstructionHeader Editor] Position from grid system:', position);
    console.log('🔍 [InstructionHeader Editor] CSS coordinates:', position?.css);
    
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
    const position = gridPositions.getScreenElement('questionDropdown');
    const pageElement = GridPositionUtils.getPageElement(1, 'question-dropdown');
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
        setShowQuizOverlay(false);
        setShowGrid2(false);
        setCurrentHighlightFocus('R1C2'); // Reset interactive highlighting to start from first number
        
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

  // Create next button component
  const NextButtonComponent = () => {
    const position = gridPositions.getScreenElement('nextButton');
    const pageElement = GridPositionUtils.getPageElement(currentPage, 'next-button');
    const buttonElement = pageElement || StandardPositions.nextButton;
    
    // Process gc styles for the button
    const processedButtonStyles = GridCellFontUtils.processGcStyles(buttonElement.props);
    
    // Dynamic button text based on current page
    const getButtonText = () => {
      if (currentPage === 8) {
        return typeof i18n !== 'undefined' ? i18n.t('dialogs.buttons.carryOver') : 'Carry Over';
      }
      return typeof i18n !== 'undefined' ? i18n.t('dialogs.buttons.next') : 'Next';
    };
    
    return React.createElement('button', {
      className: 'next-button',
      style: {
        ...position.css,
        ...processedButtonStyles,
        cursor: 'pointer',
        border: 'none',
        outline: 'none',
        transition: 'all 0.2s ease',
        zIndex: '5000',
        pointerEvents: 'auto',
        position: 'absolute'
      },
      onClick: () => {
        console.log('Next button clicked!');
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
          // Show quiz overlay on page 3
          setShowQuizOverlay(true);
          setQuizFeedback('');
          console.log('🔄 Showing quiz overlay on page 3');
        } else if (currentPage === 8) {
          // Sync current question from page 8 to page 9 (carry over page)
          if (typeof PageUtils !== 'undefined') {
            PageUtils.syncQuestionsBetweenPages(8, 9);
          }
          setCurrentPage(9);
          console.log('🔄 Navigating to page 9 (Carry Over)');
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
    console.log('🔍 [Previous Button Editor] Rendering on page:', currentPage);
    console.log('🔍 [Previous Button Editor] Position:', position);
    console.log('🔍 [Previous Button Editor] Button element:', buttonElement);
    
    if (!position) {
      console.error('🔴 [Previous Button Editor] Position not found!');
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
            
            console.log(`🔍 [Page 15 Previous Editor] Tens column value: ${tensColumnValue}`);
            
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
    console.log('🔸 [Interactive Editor] Starting unified interactive highlighting system');
    console.log('🔸 [Interactive Editor] Grid container:', gridContainer);
    console.log('🔸 [Interactive Editor] Question data:', questionData);
    
    if (!gridContainer || !questionData) {
      console.log('🔸 [Interactive Editor] Missing grid container or question data');
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
        
        console.log('🔸 [Interactive Editor] Applied highlight to', cellPosition, 'cell:', cellElement);
        
        // Debug: Check if styles are actually applied
        setTimeout(() => {
          const computedStyle = window.getComputedStyle(cellElement);
          console.log('🔸 [Interactive Editor] Computed styles after highlight:', {
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
        console.log('🔸 [Interactive Editor] Could not find cell element for', cellPosition);
        console.log('🔸 [Interactive Editor] Available cells:', Array.from(gridContainer.querySelectorAll('[data-cell]')).map(el => el.getAttribute('data-cell')));
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
        
        console.log('🔸 [Interactive Editor] Removed highlight from', cellPosition);
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
        console.log(`🔸 [Interactive Editor] Updated highlight to: ${currentHighlightFocus}`);
      }
    };
    
    // Set up initial highlight
    updateHighlight();
    
    // Store reference to update function for external use
    gridContainer._updateHighlight = updateHighlight;
    
    console.log('🔸 [Interactive Editor] Unified highlighting system initialized');
  };

  // Standalone highlight update function
  const updateHighlightDirectly = (gridContainer, focusPosition) => {
    console.log('🔸 [Interactive Editor] Updating highlight directly for position:', focusPosition);
    
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
        
        console.log('🔸 [Interactive Editor] Applied highlight to', cellPosition, 'cell:', cellElement);
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
        
        console.log('🔸 [Interactive Editor] Removed highlight from', cellPosition);
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
  useEffect(() => {
    if (currentPage === 2 && !grid1Flag) {
      console.log(`🔸 [Interactive Editor] Focus state changed to: ${currentHighlightFocus}`);
      
      // Wait for Grid1 to be ready before attempting highlighting
      const waitForGrid1 = () => {
        const gridContainer = document.querySelector('[data-grid-position="grid1"]');
        
        if (gridContainer && gridContainer.children.length > 0) {
          console.log('🔸 [Interactive Editor] Grid container found and ready:', gridContainer);
          console.log('🔸 [Interactive Editor] Has _updateHighlight function:', !!gridContainer._updateHighlight);
          
          if (gridContainer._updateHighlight) {
            console.log('🔸 [Interactive Editor] Calling _updateHighlight function');
            gridContainer._updateHighlight();
          } else {
            console.log('🔸 [Interactive Editor] No _updateHighlight function found - updating directly');
            updateHighlightDirectly(gridContainer, currentHighlightFocus);
          }
        } else {
          console.log('🔸 [Interactive Editor] Grid container not ready yet, retrying in 100ms...');
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
      console.log('🔍 [Grid1 Editor] Effect running, checking for question data...');
      console.log('🔍 [Grid1 Editor] QUESTIONS available:', typeof QUESTIONS !== 'undefined');
      console.log('🔍 [Grid1 Editor] Grid1Utils available:', typeof Grid1Utils !== 'undefined');
      console.log('🔍 [Grid1 Editor] Current question data:', gridElement.props.questionData);
      
      if (!gridElement.props.questionData && typeof Grid1Utils !== 'undefined' && typeof QUESTIONS !== 'undefined') {
        console.log('🔍 [Grid1 Editor] Loading first question on both pages...');
        Grid1Utils.loadQuestion(0, 1); // Load on page 1
        Grid1Utils.loadQuestion(0, 2); // Load on page 2
        setForceUpdate(prev => prev + 1);
      }
    }, []);
    
    // Animation effect for page 2 - only if grid1Flag is false
    React.useEffect(() => {
      if (currentPage === 2 && gridElement.props.animateOnLoad && typeof anime !== 'undefined' && !grid1Flag) {
        console.log('🎬 [Grid1 Editor] Animation effect called - currentPage:', currentPage);
        console.log('🎬 [Grid1 Editor] animateOnLoad:', gridElement.props.animateOnLoad);
        console.log('🎬 [Grid1 Editor] anime available:', typeof anime !== 'undefined');
        console.log('🎬 [Grid1 Editor] hasAnimated:', hasAnimated);
        console.log('🎬 [Grid1 Editor] animatedPosition:', animatedPosition);
        
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
              console.log('🎬 [Grid1 Editor] Found grid element with selector:', selector, element);
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
              console.log('🎬 [Grid1 Editor] Found grid element by content analysis:', div);
              return div;
            }
          }
          
          return null;
        };
        
        // Function to wait for DOM element and animate
        const waitForElementAndAnimate = (attempts = 0) => {
          const maxAttempts = 20; // Try for up to 2 seconds
          const gridContainer = findGridElement();
          
          console.log(`🎬 [Grid1 Editor] Attempt ${attempts + 1}/${maxAttempts} - Grid container found:`, gridContainer);
          
          if (gridContainer) {
            console.log('🎬 [Grid1 Editor] Grid element found! Starting animation...');
            
            // Get animation configuration
            const { animationDelay, animationDuration, animationEasing, targetPosition } = gridElement.props;
            const [targetRow, targetCol] = targetPosition;
            
            // Calculate target position in CSS percentages
            const targetTop = ((targetRow - 1) / 72) * 100;
            const targetLeft = ((targetCol - 1) / 128) * 100;
            
            // Set initial position (current position from coordinates)
            const initialTop = ((coordinates[0] - 1) / 72) * 100;
            const initialLeft = ((coordinates[1] - 1) / 128) * 100;
            
            console.log(`🎬 [Grid1 Editor] Animation config:`, {
              delay: animationDelay,
              duration: animationDuration,
              easing: animationEasing,
              coordinates: coordinates,
              targetPosition: targetPosition,
              from: { top: initialTop, left: initialLeft },
              to: { top: targetTop, left: targetLeft },
              hasAnimated: hasAnimated
            });
            
            // Function to start interactive highlighting after delay
            const startInteractiveHighlightingAfterDelay = () => {
              setTimeout(() => {
                console.log('🔸 [Interactive Editor] Starting interactive highlighting system after Grid2 completion');
                
                // Get fresh grid container reference (in case component re-rendered)
                const freshGridContainer = findGridElement();
                if (freshGridContainer) {
                  console.log('🔸 [Interactive Editor] Using fresh grid container reference:', freshGridContainer);
                  startInteractiveHighlighting(freshGridContainer, gridElement.props.questionData);
                } else {
                  console.error('🔸 [Interactive Editor] Could not find fresh grid container for highlighting');
                }
              }, 50); // Wait 50ms to allow Grid2 to render and animate before starting interactive highlighting
            };
            
            // Check p2grid1animationcomplete flag to determine animation behavior
            if (p2grid1animationcomplete) {
              // p2grid1animationcomplete = true: Start at original position and animate to target
              console.log('🎬 [Grid1 Editor] p2grid1animationcomplete = true - Starting at original position and animating to target');
              
              // Set initial position (original position from coordinates)
              const initialTop = ((coordinates[0] - 1) / 72) * 100;
              const initialLeft = ((coordinates[1] - 1) / 128) * 100;
              
              // Position grid at start coordinates first
              gridContainer.style.top = `${initialTop}%`;
              gridContainer.style.left = `${initialLeft}%`;
              
              console.log('🎬 [Grid1 Editor] Grid positioned at start coordinates:', { top: `${initialTop}%`, left: `${initialLeft}%` });
              
              // Start animation after delay
              setTimeout(() => {
                console.log('🎬 [Grid1 Editor] Starting animation from start to target...');
                anime({
                  targets: gridContainer,
                  top: `${targetTop}%`,
                  left: `${targetLeft}%`,
                  duration: animationDuration,
                  easing: animationEasing,
                  begin: () => {
                    console.log('🎬 [Grid1 Editor] Animation started!');
                  },
                  complete: () => {
                    console.log('🎬 [Grid1 Editor] Animation completed!');
                    
                    // Persist the animated position to prevent reversion on re-renders
                    setAnimatedPosition({ top: `${targetTop}%`, left: `${targetLeft}%` });
                    setHasAnimated(true);
                    console.log('🎬 [Grid1 Editor] Animated position persisted:', { top: `${targetTop}%`, left: `${targetLeft}%` });
                    
                    // Start interactive highlighting after Grid2 has time to render and animate
                    startInteractiveHighlightingAfterDelay();
                  }
                });
              }, animationDelay);
            } else {
              // p2grid1animationcomplete = false: Place directly at target without animation
              console.log('🎬 [Grid1 Editor] p2grid1animationcomplete = false - Placing directly at target position');
              
              // Position grid directly at target coordinates
              gridContainer.style.top = `${targetTop}%`;
              gridContainer.style.left = `${targetLeft}%`;
              
              // Persist the position
              setAnimatedPosition({ top: `${targetTop}%`, left: `${targetLeft}%` });
              setHasAnimated(true);
              console.log('🎬 [Grid1 Editor] Grid positioned directly at target:', { top: `${targetTop}%`, left: `${targetLeft}%` });
              
              // Set p2grid1animationcomplete flag to true since we've "completed" the positioning
              setP2grid1animationcomplete(true);
              console.log('🎬 [Grid1 Editor] p2grid1animationcomplete set to true');
              
              // Start interactive highlighting after Grid2 has time to render and animate
              startInteractiveHighlightingAfterDelay();
            }
          } else if (attempts < maxAttempts - 1) {
            console.log(`🎬 [Grid1 Editor] Grid element not found yet, retrying in 100ms...`);
            console.log('🎬 [Grid1 Editor] All elements in DOM:', document.querySelectorAll('*').length);
            console.log('🎬 [Grid1 Editor] All divs:', document.querySelectorAll('div').length);
            
            // Wait 100ms and try again
            setTimeout(() => waitForElementAndAnimate(attempts + 1), 100);
          } else {
            console.error('🎬 [Grid1 Editor] Could not find grid element after', maxAttempts, 'attempts');
            console.log('🎬 [Grid1 Editor] Final DOM state:', document.body.innerHTML);
          }
        };
        
        // Start trying to find and animate the element
        waitForElementAndAnimate();
      }
    }, [currentPage, forceUpdate]); // Trigger when page changes or component updates
    
    console.log('🔍 [Grid1 Editor] Grid configuration:', gridElement.props);
    
    // Calculate cell positions and sizes
    const calculateCellLayout = () => {
      const { gridStructure, defaultCellSize, columnOverrides, rowOverrides, cellOverrides } = gridElement.props;
      const { columns, rows } = gridStructure;
      const cells = [];
      
      console.log('🔍 [Grid1 Editor] calculateCellLayout called');
      console.log('🔍 [Grid1 Editor] Grid structure:', gridStructure);
      console.log('🔍 [Grid1 Editor] Column overrides:', columnOverrides);
      console.log('🔍 [Grid1 Editor] Current question:', gridElement.props.questionData);
      
      // Calculate total grid width accounting for column overrides
      let totalGridWidthInCells = 0;
      for (let col = 1; col <= columns; col++) {
        const colWidth = columnOverrides[`col${col}`]?.columns || defaultCellSize.columns;
        totalGridWidthInCells += colWidth;
      }
      console.log('🔍 [Grid1 Editor] Total grid width in cells:', totalGridWidthInCells);
      
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
          console.log(`🔍 [Grid1] Separator Row ${row + 1}: height=${cellHeight} (override: ${rowOverrides[`row${row + 1}`]?.rows}, default: ${defaultCellSize.rows})`);
          
          const cellTop = (currentRow / totalGridHeightInCells) * 100;
          const cellLeft = 0; // Start at left edge
          const cellHeightPercent = (cellHeight / totalGridHeightInCells) * 100;
          const cellWidthPercent = 100; // Span full width
          
          console.log(`🔍 [Grid1 Editor] Separator Row ${row + 1}: full width spanning`);
          
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
            
            console.log(`🔍 [Grid1 Editor] Cell ${row + 1},${col + 1}: width=${cellWidth}, height=${cellHeight}`);
            console.log(`🔍 [Grid1 Editor] Cell ${row + 1},${col + 1} - Override key: col${col + 1}, Override value:`, columnOverrides[`col${col + 1}`]);
            console.log(`🔍 [Grid1 Editor] Cell ${row + 1},${col + 1} - totalGridWidthInCells: ${totalGridWidthInCells}`);
            
            // Track the maximum height in this row
            rowHeight = Math.max(rowHeight, cellHeight);
            
            // Calculate position percentages within the grid
            const cellTop = (currentRow / totalGridHeightInCells) * 100;
            const cellLeft = (currentCol / totalGridWidthInCells) * 100;
            const cellHeightPercent = (cellHeight / totalGridHeightInCells) * 100;
            const cellWidthPercent = (cellWidth / totalGridWidthInCells) * 100;
            
            // Get cell content
            const cellContent = typeof Grid1Utils !== 'undefined' ? Grid1Utils.getCellContent(row + 1, col + 1) : '';
            
            console.log(`🔍 [Grid1 Editor] Cell ${row + 1},${col + 1} content: "${cellContent}" at position left=${cellLeft.toFixed(2)}%, width=${cellWidthPercent.toFixed(2)}%`);
            
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
    console.log('🔍 [Grid1 Editor] Calculated cells:', cells);
    
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
            }, cell.content || '')
          )
      })
    );
  };

  const Grid2Component = () => {
    // Only render Grid2 on pages 2 and 3 AND when showGrid2 is true
    if ((currentPage !== 2 && currentPage !== 3) || !showGrid2) {
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
        console.log(`Grid2 Editor: Loading first question for page ${currentPage}...`);
        Grid2Utils.loadQuestion(0, currentPage);
        setForceUpdate(prev => prev + 1);
      }
    }, [appUpdateTrigger]);
    
    // Animation effect for pages 2 and 3
    React.useEffect(() => {
      if ((currentPage === 2 || currentPage === 3) && gridElement.props.animateOnLoad && typeof anime !== 'undefined') {
        console.log('🎬 [Grid2 Editor] Animation effect called - currentPage:', currentPage);
        
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
              console.log('🎬 [Grid2 Editor] Found grid element with selector:', selector, element);
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
              console.log('🎬 [Grid2 Editor] Found grid element by analysis:', div);
              return div;
            }
          }
          
          return null;
        };
        
        // Function to wait for DOM element and animate
        const waitForElementAndAnimate = (attempts = 0) => {
          const maxAttempts = 20;
          const gridContainer = findGridElement();
          
          console.log(`🎬 [Grid2 Editor] Attempt ${attempts + 1}/${maxAttempts} - Grid container found:`, gridContainer);
          
          if (gridContainer) {
            console.log('🎬 [Grid2 Editor] Grid element found! Starting animation...');
            
            const { animationDelay, animationDuration, animationEasing, targetPosition } = gridElement.props;
            const [targetRow, targetCol] = targetPosition;
            
            // Calculate target position in CSS percentages
            const targetTop = ((targetRow - 1) / 72) * 100;
            const targetLeft = ((targetCol - 1) / 128) * 100;
            
            console.log(`🎬 [Grid2 Editor] Animation config:`, {
              delay: animationDelay,
              duration: animationDuration,
              easing: animationEasing,
              targetPosition: targetPosition,
              to: { top: targetTop, left: targetLeft }
            });
            
            // Start animation after delay
            setTimeout(() => {
              console.log('🎬 [Grid2 Editor] Starting animation now...');
              anime({
                targets: gridContainer,
                top: `${targetTop}%`,
                left: `${targetLeft}%`,
                duration: animationDuration,
                easing: animationEasing,
                begin: () => {
                  console.log('🎬 [Grid2 Editor] Animation started!');
                },
                complete: () => {
                  console.log('🎬 [Grid2 Editor] Animation completed!');
                }
              });
            }, animationDelay);
          } else if (attempts < maxAttempts - 1) {
            console.log(`🎬 [Grid2 Editor] Grid element not found yet, retrying in 100ms...`);
            setTimeout(() => waitForElementAndAnimate(attempts + 1), 100);
          } else {
            console.error('🎬 [Grid2 Editor] Could not find grid element after', maxAttempts, 'attempts');
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
          
          // Never skip header (R1) or carry (R2) rows
          if (rowNumber === 1 || rowNumber === 2) {
            shouldSkipRow = false;
          }
          // Number rows (R3 to R3+numberCount-1) controlled by number flags
          else if (rowNumber >= 3 && rowNumber < 3 + gridDimensions.numberCount) {
            const numberIndex = rowNumber - 3; // 0-based index
            if (numberIndex === 0 && !firstNumberFlag) shouldSkipRow = true;
            else if (numberIndex === 1 && !secondNumberFlag) shouldSkipRow = true;
            else if (numberIndex === 2 && !thirdNumberFlag) shouldSkipRow = true;
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
          if ((rowNumber >= 1 && rowNumber <= 3) && !firstNumberFlag) {
            shouldSkipRow = true;
          } else if (rowNumber === 4 && !secondNumberFlag) {
            shouldSkipRow = true;
          } else if (rowNumber === 5 && !thirdNumberFlag) {
            shouldSkipRow = true;
          } else if (rowNumber === 6 && !separatorFlag) {
            shouldSkipRow = true;
          }
        }
        
        if (shouldSkipRow) {
          console.log(`🔍 [Grid2 Editor] Skipping row ${rowNumber} due to flag settings`);
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
          console.log(`🔍 [Grid2 Editor] Separator Row ${row + 1}: height=${cellHeight} (override: ${rowOverrides[`row${row + 1}`]?.rows}, default: ${defaultCellSize.rows})`);
          
          const cellTop = (currentRow / totalGridHeightInCells) * 100;
          const cellLeft = 0; // Start at left edge
          const cellHeightPercent = (cellHeight / totalGridHeightInCells) * 100;
          const cellWidthPercent = 100; // Span full width
          
          console.log(`🔍 [Grid2 Editor] Separator Row ${row + 1}: full width spanning`);
          
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
            console.log('🔍 [Grid2 Editor] Separator row styles applied:', gridElement.props.separatorRowStyles);
            console.log('🔍 [Grid2 Editor] Final separator cell style:', cellStyle);
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
            
            console.log(`🔍 [Grid2 Editor] Cell ${row + 1},${col + 1}: width=${cellWidth}, height=${cellHeight}`);
            console.log(`🔍 [Grid2 Editor] Cell ${row + 1},${col + 1} - Override key: col${col + 1}, Override value:`, columnOverrides[`col${col + 1}`]);
            console.log(`🔍 [Grid2 Editor] Cell ${row + 1},${col + 1} - totalGridWidthInCells: ${totalGridWidthInCells}`);
            
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
            
            console.log(`🔍 [Grid2 Editor] Cell ${row + 1},${col + 1} content: "${cellContent}" at position left=${cellLeft.toFixed(2)}%, width=${cellWidthPercent.toFixed(2)}%`);
            
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
                console.log(`🔧 [Grid2 Editor] Applied cellOverride for ${cellOverrideKey}:`, cellOverride.style);
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
      )
    );
  };

  // Function to determine if feedback indicates correct answer


  // Quiz Modal Component - now handled by grid positioning system
  const QuizModalComponent = () => {
    if (!showQuizOverlay) {
      return null;
    }

    const pageElement = GridPositionUtils.getPageElement(2, 'quizModal');
    if (!pageElement) {
      console.error('Quiz modal not found on page 2');
      return null;
    }

    const position = gridPositions.getStandardElement('quizModal');
    if (!position) {
      console.error('Quiz modal position not found');
      return null;
    }

    const handleOptionClick = (optionObject) => {
      console.log('🎯 Quiz option clicked:', optionObject);
      setClickedOption(optionObject);
      
      // Use the feedback from the option object
      setQuizFeedback(optionObject.feedback);
      
      if (optionObject.isCorrect) {
        // After showing correct feedback, navigate back after delay
        setTimeout(() => {
          setShowQuizOverlay(false);
          setClickedOption(null);
          if (typeof PageUtils !== 'undefined') {
            PageUtils.syncQuestionsBetweenPages(2, 1);
          }
          setCurrentPage(1);
          console.log('🔄 Quiz completed - returning to page 1');
        }, 3000);
      }
    };

    // Process GC styles from gridPositions configuration
    const processedHeaderStyles = GridCellFontUtils.processGcStyles(pageElement.props.headerStyles);
    const processedButtonStyles = GridCellFontUtils.processGcStyles(pageElement.props.buttonStyles);
    const processedCorrectButtonStyles = GridCellFontUtils.processGcStyles(pageElement.props.correctButtonStyles);
    const processedFeedbackStyles = GridCellFontUtils.processGcStyles(pageElement.props.feedbackStyles);
    const processedButtonContainerStyles = GridCellFontUtils.processGcStyles(pageElement.props.buttonContainerStyles);
    
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
        display: showQuizOverlay ? 'flex' : 'none',
        flexDirection: processedModalProps.flexDirection,
        alignItems: processedModalProps.alignItems,
        justifyContent: processedModalProps.justifyContent,
        pointerEvents: processedModalProps.pointerEvents,
        boxSizing: processedModalProps.boxSizing
      },
      'data-grid-position': 'quizModal'
    },
      // Quiz Header
      React.createElement('h1', {
        style: processedHeaderStyles
      }, pageElement.props.title),

      // Quiz Options Container
      React.createElement('div', {
        style: processedButtonContainerStyles
      },
        ...pageElement.props.options.map(optionObject => 
          React.createElement('button', {
            key: optionObject.option,
            style: (() => {
              // COMPREHENSIVE DEBUG LOGGING
              console.log('=== BUTTON STYLE DEBUG ===');
              console.log('Button Option Object:', optionObject);
              console.log('Clicked Option:', clickedOption);
              console.log('Quiz Feedback:', quizFeedback);
              console.log('Has Feedback:', !!quizFeedback);
              console.log('Has Clicked Option:', !!clickedOption);
              
              // Check all conditions separately
              const hasQuizFeedback = !!quizFeedback;
              const hasClickedOption = !!clickedOption;
              const isOptionCorrect = optionObject.isCorrect;
              const isClickedOption = clickedOption && optionObject.option === clickedOption.option;
              
              console.log('Condition Checks:');
              console.log('  hasQuizFeedback:', hasQuizFeedback);
              console.log('  hasClickedOption:', hasClickedOption);
              console.log('  isOptionCorrect:', isOptionCorrect);
              console.log('  isClickedOption:', isClickedOption);
              
              // Use isCorrect flag from option object to determine button color
              const shouldBeGreen = hasQuizFeedback && hasClickedOption && isOptionCorrect && isClickedOption;
              const shouldBeRed = hasQuizFeedback && hasClickedOption && !isOptionCorrect && isClickedOption;
              
              console.log('Final Style Decisions:');
              console.log('  shouldBeGreen:', shouldBeGreen);
              console.log('  shouldBeRed:', shouldBeRed);
              
              // Debug the processed styles
              console.log('Available Style Objects:');
              console.log('  processedButtonStyles:', processedButtonStyles);
              console.log('  processedCorrectButtonStyles:', processedCorrectButtonStyles);
              
              if (shouldBeGreen) {
                console.log('✅ SHOULD BE GREEN - Returning green styles');
                const greenStyles = {
                  ...processedCorrectButtonStyles,
                  backgroundColor: 'rgba(102, 204, 102, 0.9)',
                  borderColor: '#66cc66',
                  border: '3px solid #66cc66'
                };
                console.log('Green styles object:', greenStyles);
                return greenStyles;
              } else if (shouldBeRed) {
                console.log('❌ SHOULD BE RED - Returning red styles');
                const redStyles = {
                  ...processedButtonStyles,
                  backgroundColor: 'rgba(255, 102, 102, 0.9)',
                  borderColor: '#ff6666',
                  border: '3px solid #ff6666'
                };
                console.log('Red styles object:', redStyles);
                return redStyles;
              } else {
                console.log('⚪ DEFAULT - Returning default styles');
                console.log('Default styles object:', processedButtonStyles);
                return processedButtonStyles;
              }
            })(),
            onClick: () => handleOptionClick(optionObject),
            onMouseEnter: (e) => {
              // Don't override styles if button is in a feedback state
              if (!quizFeedback || !clickedOption) {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                e.target.style.transform = 'scale(1.05)';
              }
            },
            onMouseLeave: (e) => {
              // Don't override styles if button is in a feedback state
              if (!quizFeedback || !clickedOption) {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                e.target.style.transform = 'scale(1)';
              }
            }
          }, optionObject.option)
        )
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
  } else {
    console.error('React root element or ReactDOM not found');
  }
}); 