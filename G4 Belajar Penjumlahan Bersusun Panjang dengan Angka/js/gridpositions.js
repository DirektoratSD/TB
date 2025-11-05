/**
 * GRID POSITIONS SYSTEM
 * ====================
 * Page-based grid positioning system using single coordinate arrays
 * All text is internationalized via data.js
 * Uses linear scaling instead of breakpoint-based responsive design
 */

// Global character border toggle
const CharacterBorderConfig = {
    enabled: false, // Toggle for character borders (disabled by default)
    borderStyle: '3px solid transparent', // Transparent border style
    
    toggle: () => {
        CharacterBorderConfig.enabled = !CharacterBorderConfig.enabled;
        console.log('Character borders:', CharacterBorderConfig.enabled ? 'ENABLED' : 'DISABLED');
        // Trigger a re-render if possible
        if (typeof window !== 'undefined' && window.forceRerender) {
            window.forceRerender();
        }
        return CharacterBorderConfig.enabled;
    },
    
    getCharacterStyle: () => {
        const baseStyle = {
            margin: '0',
            padding: '0',
            display: 'block',
            boxSizing: 'border-box'
        };
        
        return CharacterBorderConfig.enabled ? {
            ...baseStyle,
            border: CharacterBorderConfig.borderStyle
        } : baseStyle;
    }
};

// Global debug border toggle for all grid elements
const DebugBorderConfig = {
    enabled: false, // Toggle for debug borders (disabled by default)
    borderStyle: '2px solid red', // Red border for debugging
    
    toggle: () => {
        DebugBorderConfig.enabled = !DebugBorderConfig.enabled;
        console.log('🔴 Debug borders:', DebugBorderConfig.enabled ? 'ENABLED' : 'DISABLED');
        
        // Apply/remove borders to all grid-positioned elements
        const gridElements = document.querySelectorAll('[data-grid-position]');
        gridElements.forEach(element => {
            if (DebugBorderConfig.enabled) {
                element.style.border = DebugBorderConfig.borderStyle;
                element.style.boxSizing = 'border-box';
            } else {
                element.style.border = '';
            }
        });
        
        // Also update CSS class if available
        const debugStyleId = 'debug-borders-style';
        let debugStyle = document.getElementById(debugStyleId);
        
        if (DebugBorderConfig.enabled) {
            if (!debugStyle) {
                debugStyle = document.createElement('style');
                debugStyle.id = debugStyleId;
                document.head.appendChild(debugStyle);
            }
            debugStyle.textContent = `
                [data-grid-position] {
                    border: ${DebugBorderConfig.borderStyle} !important;
                    box-sizing: border-box !important;
                }
                [data-grid-position] * {
                    box-sizing: border-box !important;
                }
            `;
        } else {
            if (debugStyle) {
                debugStyle.remove();
            }
        }
        
        return DebugBorderConfig.enabled;
    },
    
    getDebugStyle: () => {
        const baseStyle = {
            margin: '0 !important',
            padding: '0 !important',
            boxSizing: 'border-box'
        };
        
        return DebugBorderConfig.enabled ? {
            ...baseStyle,
            border: DebugBorderConfig.borderStyle
        } : baseStyle;
    }
};

// Global utility function to toggle debug borders
const toggleDebugBorders = () => {
    return DebugBorderConfig.toggle();
};

// Global utility function to enable debug borders  
const enableDebugBorders = () => {
    if (!DebugBorderConfig.enabled) {
        DebugBorderConfig.toggle();
    }
    return true;
};

// Global utility function to disable debug borders
const disableDebugBorders = () => {
    if (DebugBorderConfig.enabled) {
        DebugBorderConfig.toggle();
    }
    return false;
};

// Debug function to verify positioning calculations
const debugGridPositioning = (elementName = null) => {
    console.log('🔍 Grid Positioning Debug Report');
    console.log('================================');
    
    const gridElements = elementName ? 
        document.querySelectorAll(`[data-grid-position="${elementName}"]`) :
        document.querySelectorAll('[data-grid-position]');
    
    gridElements.forEach(element => {
        const gridPosition = element.getAttribute('data-grid-position');
        const coordinates = element.getAttribute('data-coordinates');
        const rect = element.getBoundingClientRect();
        const containerRect = document.querySelector('.main-container').getBoundingClientRect();
        
        // Calculate expected positions based on grid
        const [topRow, topCol, bottomRow, bottomCol] = coordinates.slice(1, -1).split(', ').map(Number);
        const expectedLeft = ((topCol - 1) / 128) * 100;
        const expectedTop = ((topRow - 1) / 72) * 100;
        const expectedWidth = ((bottomCol - topCol + 1) / 128) * 100;
        const expectedHeight = ((bottomRow - topRow + 1) / 72) * 100;
        
        // Calculate actual positions as percentages
        const actualLeft = ((rect.left - containerRect.left) / containerRect.width) * 100;
        const actualTop = ((rect.top - containerRect.top) / containerRect.height) * 100;
        const actualWidth = (rect.width / containerRect.width) * 100;
        const actualHeight = (rect.height / containerRect.height) * 100;
        
        console.log(`\n📍 Element: ${gridPosition}`);
        console.log(`   Coordinates: ${coordinates}`);
        console.log(`   Expected: left=${expectedLeft.toFixed(2)}%, top=${expectedTop.toFixed(2)}%, width=${expectedWidth.toFixed(2)}%, height=${expectedHeight.toFixed(2)}%`);
        console.log(`   Actual:   left=${actualLeft.toFixed(2)}%, top=${actualTop.toFixed(2)}%, width=${actualWidth.toFixed(2)}%, height=${actualHeight.toFixed(2)}%`);
        
        const leftDiff = Math.abs(expectedLeft - actualLeft);
        const topDiff = Math.abs(expectedTop - actualTop);
        const widthDiff = Math.abs(expectedWidth - actualWidth);
        const heightDiff = Math.abs(expectedHeight - actualHeight);
        
        if (leftDiff > 0.1 || topDiff > 0.1 || widthDiff > 0.1 || heightDiff > 0.1) {
            console.log(`   ⚠️  MISMATCH: left=${leftDiff.toFixed(2)}%, top=${topDiff.toFixed(2)}%, width=${widthDiff.toFixed(2)}%, height=${heightDiff.toFixed(2)}%`);
        } else {
            console.log(`   ✅ ALIGNED`);
        }
    });
    
    console.log('\n📏 Grid System Info:');
    console.log(`   Dimensions: ${GridPrecisionConfig.precisionSettings[GridPrecisionConfig.currentPrecision].cols}x${GridPrecisionConfig.precisionSettings[GridPrecisionConfig.currentPrecision].rows}`);
    console.log(`   Container Size: ${document.querySelector('.main-container').getBoundingClientRect().width}x${document.querySelector('.main-container').getBoundingClientRect().height}`);
    
    return true;
};

// Grid Precision Configuration
const GridPrecisionConfig = {
    currentPrecision: 8, // This project uses 8x precision (128x72 grid)
    precisionSettings: {
        1: { cols: 16, rows: 9 },   // Normal: 16x9
        2: { cols: 32, rows: 18 },  // 2x: 32x18  
        3: { cols: 48, rows: 27 },  // 3x: 48x27
        4: { cols: 64, rows: 36 },  // 4x: 64x36
        5: { cols: 80, rows: 45 },  // 5x: 80x45
        6: { cols: 96, rows: 54 },  // 6x: 96x54
        7: { cols: 112, rows: 63 }, // 7x: 112x63
        8: { cols: 128, rows: 72 }  // 8x: 128x72 ← Current project setting
    },
    
    // Helper function to convert coordinates between precision levels
    convertCoordinates: (fromPrecision, toPrecision, coord) => {
        const match = coord.match(/R(\d+)C(\d+)/);
        if (!match) return coord;
        
        const [, row, col] = match;
        const multiplier = toPrecision / fromPrecision;
        
        // Convert to new precision
        const newRow = Math.round(parseInt(row) * multiplier);
        const newCol = Math.round(parseInt(col) * multiplier);
        
        return `R${newRow}C${newCol}`;
    }
};

// Grid Cell Font Utilities - Convert grid-cell units to pixels
const GridCellFontUtils = {
    // Convert grid-cell units (gc) to pixels
    convertGcToPixels: (gcValue) => {
        if (typeof gcValue !== 'string' || !gcValue.endsWith('gc')) {
            return gcValue;
        }
        
        const percentage = parseInt(gcValue.replace('gc', ''));
        const config = GridPrecisionConfig.precisionSettings[GridPrecisionConfig.currentPrecision];
        
        // Ensure we have valid window dimensions
        let containerHeight = window.innerHeight;
        if (!containerHeight || containerHeight < 100) {
            // Fallback to reasonable defaults if window dimensions aren't available
            containerHeight = 1080;
        }
        
        const cellHeight = containerHeight / config.rows;
        const fontSize = (cellHeight * percentage) / 100;
        
        // Add bounds checking to prevent unreasonable font sizes
        const minFontSize = 8;
        const maxFontSize = 200;
        const clampedFontSize = Math.max(minFontSize, Math.min(maxFontSize, Math.round(fontSize)));
        
        return `${clampedFontSize}px`;
    },
    
    // Process any CSS property that can use gc units
    processGcProperty: (value, propertyName) => {
        if (typeof value === 'string' && value.endsWith('gc')) {
            return GridCellFontUtils.convertGcToPixels(value);
        }
        return value;
    },
    
    // Process an entire style object to convert all gc units
    processGcStyles: (styles) => {
        // console.log('🔍 [processGcStyles] Input styles:', styles);
        
        if (!styles || typeof styles !== 'object') {
            // console.log('🔍 [processGcStyles] Invalid styles object, returning:', styles);
            return styles;
        }
        
        const processedStyles = { ...styles };
        // console.log('🔍 [processGcStyles] Copied styles:', processedStyles);
        
        const gcProperties = [
            'fontSize', 'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
            'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
            'borderRadius', 'width', 'height', 'letterSpacing',
            'top', 'right', 'bottom', 'left', 'borderWidth'
        ];
        
        // Process fontSize first
        if (processedStyles.fontSize) {
            // console.log('🔍 [processGcStyles] Processing fontSize:', processedStyles.fontSize);
            const originalFontSize = processedStyles.fontSize;
            processedStyles.fontSize = GridCellFontUtils.processGcProperty(processedStyles.fontSize);
            // console.log('🔍 [processGcStyles] fontSize converted:', originalFontSize, '->', processedStyles.fontSize);
        } else {
            console.log('🔍 [processGcStyles] No fontSize found');
        }
        
        // Process lineHeight specially
        if (processedStyles.lineHeight) {
            // console.log('🔍 [processGcStyles] Processing lineHeight:', processedStyles.lineHeight);
            const originalLineHeight = processedStyles.lineHeight;
            if (typeof originalLineHeight === 'string' && originalLineHeight.endsWith('gc')) {
                const lineHeightPx = parseFloat(GridCellFontUtils.convertGcToPixels(originalLineHeight));
                let fontSizePx = 16;
                
                if (typeof processedStyles.fontSize === 'string' && processedStyles.fontSize.endsWith('px')) {
                    fontSizePx = parseFloat(processedStyles.fontSize);
                }
                
                const ratio = lineHeightPx / fontSizePx;
                processedStyles.lineHeight = ratio.toFixed(2);
                // console.log('🔍 [processGcStyles] lineHeight converted:', originalLineHeight, '->', processedStyles.lineHeight, `(${lineHeightPx}px / ${fontSizePx}px)`);
            } else {
                console.log('🔍 [processGcStyles] lineHeight not in gc units:', originalLineHeight);
            }
        }
        
        // Process other properties
        gcProperties.forEach(prop => {
            if (prop !== 'fontSize' && processedStyles[prop]) {
                // console.log(`🔍 [processGcStyles] Processing ${prop}:`, processedStyles[prop]);
                const originalValue = processedStyles[prop];
                processedStyles[prop] = GridCellFontUtils.processGcProperty(processedStyles[prop]);
                if (originalValue !== processedStyles[prop]) {
                    console.log(`🔍 [processGcStyles] ${prop} converted:`, originalValue, '->', processedStyles[prop]);
                }
            }
        });
        
        // console.log('🔍 [processGcStyles] Final processed styles:', processedStyles);
        return processedStyles;
    }
};

// Standard positioning template for consistent placement across all pages
const StandardPositions = {
    // Layout elements
    header: {
        type: 'textbox',
        coordinates: [1, 1, 4, 128],
        zIndex: 1000,
        props: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }
    },
    
    footer: {
        type: 'container',
        coordinates: [68, 1, 72, 128],
        zIndex: 100,
        props: {}
    },
    
    leftSidebar: {
        type: 'container',
        coordinates: [9, 1, 67, 32],
        zIndex: 100,
        props: {}
    },
    
    rightSidebar: {
        type: 'container',
        coordinates: [9, 97, 67, 128],
        zIndex: 100,
        props: {}
    },
    
    mainContent: {
        type: 'container',
        coordinates: [9, 33, 67, 96],
        zIndex: 100,
        props: {}
    },
    
    fullContent: {
        type: 'container',
        coordinates: [9, 1, 67, 128],
        zIndex: 100,
        props: {}
    },
    
    modalCenter: {
        type: 'container',
        coordinates: [16, 36, 60, 100],
        zIndex: 200,
        props: {}
    },
    
    quizModal: {
        type: 'modal',
        coordinates: [15, 40, 60, 115],
        zIndex: 100000,
        get props() {
            return {
                ...GridCellFontUtils.processGcStyles({
                    backgroundColor: 'rgba(0, 0, 0, 0.95)',
                    borderRadius: '50gc',
                    border: '3px solid white',
                    padding: '5px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'stretch',
                    pointerEvents: 'auto',
                    boxSizing: 'border-box',
                    minHeight: '80%',
                    gap: '0gc'
                }),
                // Header styles
                get headerStyles() {
                    return GridCellFontUtils.processGcStyles({
                        color: 'white',
                        fontSize: '225gc',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        marginBottom: '0gc',
                        marginTop: '0gc',
                        marginLeft: '0gc',
                        marginRight: '0gc',
                        fontFamily: 'Arial, sans-serif',
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
                        flex: '0 0 20%',
                        padding: '50gc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    });
                },
                // Button container styles
                get buttonContainerStyles() {
                    return GridCellFontUtils.processGcStyles({
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        gap: '0gc',
                        marginBottom: '0gc',
                        marginTop: '0gc',
                        marginLeft: '0gc',
                        marginRight: '0gc',
                        flex: '0 0 50%'
                    });
                },
                // Button styles
                get buttonStyles() {
                    return GridCellFontUtils.processGcStyles({
                        width: '1000gc',
                        height: '400gc',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        color: '#333',
                        border: '3px solid white',
                        borderRadius: '20gc',
                        fontSize: '150gc',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '0gc',
                        marginBottom: '0gc',
                        marginLeft: '0gc',
                        marginRight: '0gc',
                        transition: 'all 0.3s ease',
                        pointerEvents: 'auto'
                    });
                },
                // Correct button styles
                get correctButtonStyles() {
                    return GridCellFontUtils.processGcStyles({
                        width: '1000gc',
                        height: '400gc',
                        backgroundColor: 'rgba(102, 204, 102, 0.9)',
                        borderColor: '#66cc66',
                        color: '#333',
                        border: '3px solid #66cc66',
                        borderRadius: '20gc',
                        fontSize: '150gc',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '0gc',
                        marginBottom: '0gc',
                        marginLeft: '0gc',
                        marginRight: '0gc',
                        transition: 'all 0.3s ease',
                        pointerEvents: 'auto'
                    });
                },
                // Incorrect button styles
                get incorrectButtonStyles() {
                    return GridCellFontUtils.processGcStyles({
                        width: '1000gc',
                        height: '400gc',
                        backgroundColor: 'rgba(255, 102, 102, 0.9)',
                        borderColor: '#ff6666',
                        color: '#333',
                        border: '3px solid #ff6666',
                        borderRadius: '20gc',
                        fontSize: '150gc',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '0gc',
                        marginBottom: '0gc',
                        marginLeft: '0gc',
                        marginRight: '0gc',
                        transition: 'all 0.3s ease',
                        pointerEvents: 'auto'
                                        });
                },
                // Feedback styles
                get feedbackStyles() {
                    return GridCellFontUtils.processGcStyles({
                        color: 'white',
                        padding: '10gc',
                        fontSize: '200gc',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        maxWidth: '1400gc',
                        fontFamily: 'Arial, sans-serif',
                        whiteSpace: 'pre-line',
                        marginTop: '0gc',
                        marginBottom: '0gc',
                        marginLeft: '0gc',
                        marginRight: '0gc',
                        flex: '0 0 30%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxSizing: 'border-box',
                        overflow: 'auto'
                    });
                },
                // Success feedback background
                successFeedbackBg: 'transparent',
                // Error feedback background
                errorFeedbackBg: 'transparent',
                // Success text color
                successTextColor: '#00ff00',
                // Error text color
                errorTextColor: '#ff0000'
            };
        }
    },

    quizmodalwithtext: {
        type: 'modal',
        coordinates: [15, 40, 60, 115],
        zIndex: 100000,
        get props() {
            return {
                ...GridCellFontUtils.processGcStyles({
                    backgroundColor: 'rgba(0, 0, 0, 0.95)',
                    borderRadius: '50gc',
                    border: '3px solid white',
                    padding: '5px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'stretch',
                    pointerEvents: 'auto',
                    boxSizing: 'border-box',
                    minHeight: '80%',
                    gap: '0gc'
                }),
                // Header styles
                get headerStyles() {
                    return GridCellFontUtils.processGcStyles({
                        color: 'white',
                        fontSize: '225gc',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        marginBottom: '0gc',
                        marginTop: '0gc',
                        marginLeft: '0gc',
                        marginRight: '0gc',
                        fontFamily: 'Arial, sans-serif',
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
                        flex: '0 0 10%',
                        padding: '50gc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    });
                },
                // Description text styles
                get descriptionStyles() {
                    return GridCellFontUtils.processGcStyles({
                        color: 'white',
                        fontSize: '180gc',
                        fontWeight: 'normal',
                        textAlign: 'center',
                        marginBottom: '0gc',
                        marginTop: '0gc',
                        marginLeft: '0gc',
                        marginRight: '0gc',
                        fontFamily: 'Arial, sans-serif',
                        flex: '0 0 10%',
                        padding: '25gc',
                        maxWidth: '1200gc',
                        lineHeight: '1.3',
                        display: 'flex',
                        alignItems: 'center',
                                                justifyContent: 'center'
                    });
                },
                // Button container styles
                get buttonContainerStyles() {
                    return GridCellFontUtils.processGcStyles({
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        gap: '0gc',
                        marginBottom: '0gc',
                        marginTop: '0gc',
                        marginLeft: '0gc',
                        marginRight: '0gc',
                        flex: '0 0 50%'
                    });
                },
                // Button styles
                get buttonStyles() {
                    return GridCellFontUtils.processGcStyles({
                        width: '1000gc',
                        height: '400gc',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        color: '#333',
                        border: '3px solid white',
                        borderRadius: '20gc',
                        fontSize: '150gc',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '0gc',
                        marginBottom: '0gc',
                        marginLeft: '0gc',
                        marginRight: '0gc',
                        transition: 'all 0.3s ease',
                        pointerEvents: 'auto'
                    });
                },
                // Correct button styles
                get correctButtonStyles() {
                    return GridCellFontUtils.processGcStyles({
                        width: '1000gc',
                        height: '400gc',
                        backgroundColor: 'rgba(102, 204, 102, 0.9)',
                        borderColor: '#66cc66',
                        color: '#333',
                        border: '3px solid #66cc66',
                        borderRadius: '20gc',
                        fontSize: '150gc',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '0gc',
                        marginBottom: '0gc',
                        marginLeft: '0gc',
                        marginRight: '0gc',
                        transition: 'all 0.3s ease',
                        pointerEvents: 'auto'
                    });
                },
                // Incorrect button styles
                get incorrectButtonStyles() {
                    return GridCellFontUtils.processGcStyles({
                        width: '1000gc',
                        height: '400gc',
                        backgroundColor: 'rgba(255, 102, 102, 0.9)',
                        borderColor: '#ff6666',
                        color: '#333',
                        border: '3px solid #ff6666',
                        borderRadius: '20gc',
                        fontSize: '150gc',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '0gc',
                        marginBottom: '0gc',
                        marginLeft: '0gc',
                        marginRight: '0gc',
                        transition: 'all 0.3s ease',
                        pointerEvents: 'auto'
                    });
                },
                // Feedback styles
                get feedbackStyles() {
                    return GridCellFontUtils.processGcStyles({
                        color: 'white',
                        padding: '10gc',
                        fontSize: '200gc',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        maxWidth: '1400gc',
                        fontFamily: 'Arial, sans-serif',
                        whiteSpace: 'pre-line',
                        marginTop: '0gc',
                        marginBottom: '0gc',
                        marginLeft: '0gc',
                        marginRight: '0gc',
                        flex: '0 0 30%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxSizing: 'border-box',
                        overflow: 'auto'
                    });
                },
                // Success feedback background
                successFeedbackBg: 'transparent',
                // Error feedback background
                errorFeedbackBg: 'transparent',
                // Success text color
                successTextColor: '#00ff00',
                // Error text color
                errorTextColor: '#ff0000'
            };
        }
    },

    topBanner: {
        type: 'container',
        coordinates: [9, 1, 18, 128],
        zIndex: 100,
        props: {}
    },
    
    bottomControls: {
        type: 'container',
        coordinates: [58, 1, 67, 128],
        zIndex: 100,
        props: {}
    },
    
    buttonRowCenter: {
        type: 'container',
        coordinates: [64, 40, 67, 88],
        zIndex: 100,
        props: {}
    },
    
    buttonColumnRight: {
        type: 'container',
        coordinates: [40, 117, 59, 125],
        zIndex: 100,
        props: {}
    },
    
    topLeft: {
        type: 'container',
        coordinates: [9, 1, 40, 64],
        zIndex: 100,
        props: {}
    },
    
    topRight: {
        type: 'container',
        coordinates: [9, 65, 40, 128],
        zIndex: 100,
        props: {}
    },
    
    bottomLeft: {
        type: 'container',
        coordinates: [41, 1, 67, 64],
        zIndex: 100,
        props: {}
    },
    
    bottomRight: {
        type: 'container',
        coordinates: [41, 65, 67, 128],
        zIndex: 100,
        props: {}
    },
    
    // Character and interaction elements
    character: {
        type: 'image',
        coordinates: [34, 2, 72, 28],
        zIndex: 998,
        props: {
            src: 'assets/character_excited.png',
            alt: 'Excited Character',
            style: {
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                ...CharacterBorderConfig.getCharacterStyle()
            }
        }
    },
    
    characterArea: {
        type: 'container',
        coordinates: [34, 1, 73, 29],
        zIndex: 998,
        props: {}
    },
    
    dialogBubble: {
        type: 'textbox',
        coordinates: [6, 2, 33, 28],
        zIndex: 999,
        props: {
                            get options() {
                    return GridCellFontUtils.processGcStyles({
                        fontSize: '800gc',
                        lineHeight: '1400gc',
                        textAlign: "left",
                        textJustify: "auto",
                        backgroundColor: "#ffffff",
                        textColor: "#000000",
                        borderRadius: '75gc',
                        padding: '5px',
                        showTail: true,
                        tailBorder: "bottom",
                        tailPlacement: "middle",
                        tailDirection: "south"
                    });
                }
        }
    },
    
    container1: {
        type: 'container',
        coordinates: [5, 30, 72, 128],
        zIndex: 500,
        props: {
            backgroundColor: '#000000',
            opacity: 0.8,
            borderRadius: '8px'
        }
    },
    
    container2: {
        type: 'container',
        coordinates: [7, 32, 70, 126],
        zIndex: 500,
        props: {
            backgroundColor: '#ffffff',
            opacity: 0.1,
            borderRadius: '8px'
        }
    },
    
    // Activity and learning elements
    activityArea: {
        type: 'container',
        coordinates: [11, 35, 67, 128],
        zIndex: 100,
        props: {}
    },
    
    problemDisplay: {
        type: 'textbox',
        coordinates: [15, 40, 30, 120],
        zIndex: 100,
        props: {}
    },
    
    answerArea: {
        type: 'textbox',
        coordinates: [35, 50, 45, 110],
        zIndex: 100,
        props: {}
    },
    
    feedbackArea: {
        type: 'textbox',
        coordinates: [50, 40, 60, 120],
        zIndex: 100,
        props: {}
    },
    
    gameBoard: {
        type: 'container',
        coordinates: [12, 20, 60, 108],
        zIndex: 100,
        props: {}
    },
    
    scoreDisplay: {
        type: 'textbox',
        coordinates: [9, 100, 15, 128],
        zIndex: 100,
        props: {}
    },
    
    menuGrid: {
        type: 'grid',
        coordinates: [20, 20, 55, 108],
        zIndex: 100,
        props: {}
    },
    
    titleArea: {
        type: 'textbox',
        coordinates: [12, 30, 22, 98],
        zIndex: 100,
        props: {}
    },
    
    instructionHeader: {
        type: 'textbox',
        coordinates: [64, 50, 68, 108],
        zIndex: 15000,  // Increased z-index to ensure it's above other elements
        props: {
            get text() {
                return typeof i18n !== 'undefined' ? i18n.t('dialogs.instructions.clickNextToContinue') : "Click on Next to continue.";
            },
            fontSize: '275gc',
            textAlign: 'center',
            color: '#000000',
            opacity: 0.8,
            backgroundColor: '#ffffff',
            fontWeight: 'bold',
            userSelect: 'text',  // Make text selectable
            pointerEvents: 'auto',  // Ensure it's interactive
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }
    },
    
    questionDropdown: {
        type: 'dropdown',
        coordinates: [5, 100, 9, 128],
        zIndex: 700,
        props: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '8px',
            border: '2px solid #333',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#333'
        }
    },
    
    nextButton: {
        type: 'button',
        coordinates: [64, 110, 68, 125],
        zIndex: 5000,
        props: {
            get text() {
                // Use i18n system for button text
                return typeof i18n !== 'undefined' ? i18n.t('dialogs.next') : 'Next';
            },
            backgroundColor: '#FF9900',
            color: 'white',
            fontSize: '250gc',
            fontWeight: 'bold',
            borderRadius: '50gc',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'center'
        }
    },
    
    previousButton: {
        type: 'button',
        coordinates: [64, 33, 68, 48],
        zIndex: 5000,
        props: {
            get text() {
                // Use i18n system for button text
                return typeof i18n !== 'undefined' ? i18n.t('dialogs.buttons.previous') : 'Previous';
            },
            backgroundColor: '#6699CC',
            color: 'white',
            fontSize: '250gc',
            fontWeight: 'bold',
            borderRadius: '50gc',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'center'
        }
    },
    
    // Plus sign for navigation on page 4
    plusSign: {
        type: 'button',
        coordinates: [1, 1, 1, 1], // Dummy coordinates - will be dynamically positioned
        zIndex: 403,
        props: {
            get style() {
                return GridCellFontUtils.processGcStyles({
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    pointerEvents: 'auto',
                    zIndex: '403'
                });
            },
            get circleStyle() {
                return GridCellFontUtils.processGcStyles({
                    width: '400gc',
                    height: '400gc',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '250gc',
                    fontWeight: 'bold',
                    color: 'black',
                    border: '2px solid #333',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                    transition: 'transform 0.2s ease'
                });
            },
            content: '+',
            onMouseEnter: (e) => {
                e.target.style.transform = 'scale(1.1)';
            },
            onMouseLeave: (e) => {
                e.target.style.transform = 'scale(1)';
            }
        }
    },
    
    // Grid1 moved to page-specific configuration (GridPositionPages[1])
    // This keeps StandardPositions clean and allows page-specific grid configurations
};

// Main grid positioning class
class GridPositions {
    constructor() {
        this.gridDimensions = {
            columns: 128,
            rows: 72,
            precision: 8
        };
        
        // Base screen dimensions for scaling (16:9 aspect ratio)
        this.baseScreenDimensions = {
            width: 1600,
            height: 900
        };
        
        // Cache for performance
        this.cache = new Map();
        this.lastScreenSize = { width: 0, height: 0 };
        
        // Initialize
        this.updateScreenDimensions();
        this.setupResizeListener();
        this.syncWithGridCellUnits();
    }
    
    /**
     * Update screen dimensions and clear cache if changed
     */
    updateScreenDimensions() {
        const currentSize = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        
        if (currentSize.width !== this.lastScreenSize.width || 
            currentSize.height !== this.lastScreenSize.height) {
            this.lastScreenSize = currentSize;
            this.cache.clear();
        }
    }
    
    /**
     * Setup resize listener with throttling
     */
    setupResizeListener() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.updateScreenDimensions();
            }, 100);
        });
    }
    
    /**
     * Calculate linear scale factor based on screen size
     */
    getScaleFactor() {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        
        const widthScale = screenWidth / this.baseScreenDimensions.width;
        const heightScale = screenHeight / this.baseScreenDimensions.height;
        
        return Math.min(widthScale, heightScale);
    }
    
    /**
     * Get position data for any element from StandardPositions
     */
    getElement(elementName) {
        const cacheKey = `element_${elementName}_${this.lastScreenSize.width}x${this.lastScreenSize.height}`;
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        
        const element = StandardPositions[elementName];
        if (!element) {
            console.warn(`Element "${elementName}" not found in StandardPositions`);
            return null;
        }
        
        // Calculate coordinates based on element type
        let coordinates = element.coordinates;
        if (element.type === 'grid') {
            coordinates = this.calculateGridCoordinates(element);
        }
        
        const position = this.convertToCSS(coordinates, elementName, 'standard', element.type);
        this.cache.set(cacheKey, position);
        return position;
    }
    
    /**
     * Get position data for a standard element (alias for backward compatibility)
     */
    getStandardElement(elementName) {
        return this.getElement(elementName);
    }
    
    /**
     * Get position data for a screen-specific element (alias for backward compatibility)
     */
    getScreenElement(elementName) {
        return this.getElement(elementName);
    }
    
    /**
     * Create a custom element with coordinates
     */
    createCustomElement(coordinates, description = '') {
        return this.convertToCSS(coordinates, 'custom', 'custom', description);
    }
    
    /**
     * Calculate grid coordinates for grid-type elements
     */
    calculateGridCoordinates(gridElement) {
        const [topRow, topCol] = gridElement.coordinates;
        const { gridStructure, defaultCellSize, columnOverrides } = gridElement.props;
        
        // Calculate total grid width accounting for column overrides
        let totalGridWidthInCells = 0;
        for (let col = 1; col <= gridStructure.columns; col++) {
            const colWidth = columnOverrides[`col${col}`]?.columns || defaultCellSize.columns;
            totalGridWidthInCells += colWidth;
        }
        
        // Calculate bottom coordinates based on actual grid dimensions
        const gridHeightInCells = gridStructure.rows * defaultCellSize.rows;
        const gridWidthInCells = totalGridWidthInCells;
        
        const bottomRow = topRow + gridHeightInCells - 1;
        const bottomCol = topCol + gridWidthInCells - 1;
        
        console.log(`🔍 [Grid Coordinates] ${gridElement.type || 'Unknown'} element:`);
        console.log(`  Top: [${topRow}, ${topCol}]`);
        console.log(`  Grid: ${gridStructure.rows}×${gridStructure.columns} (${gridHeightInCells}×${gridWidthInCells} cells)`);
        console.log(`  Column overrides:`, columnOverrides);
        console.log(`  Total width: ${totalGridWidthInCells} cells`);
        console.log(`  Bottom: [${bottomRow}, ${bottomCol}]`);
        console.log(`  Final: [${topRow}, ${topCol}, ${bottomRow}, ${bottomCol}]`);
        
        return [topRow, topCol, bottomRow, bottomCol];
    }
    
    /**
     * Convert grid coordinates to CSS positioning with linear scaling
     */
    convertToCSS(coordinates, elementName, type, elementType = '') {
        const [topRow, topCol, bottomRow, bottomCol] = coordinates;
        
        // Calculate base percentages
        const baseLeft = ((topCol - 1) / this.gridDimensions.columns) * 100;
        const baseTop = ((topRow - 1) / this.gridDimensions.rows) * 100;
        const baseWidth = ((bottomCol - topCol + 1) / this.gridDimensions.columns) * 100;
        const baseHeight = ((bottomRow - topRow + 1) / this.gridDimensions.rows) * 100;
        
        // Apply linear scaling
        const scaleFactor = this.getScaleFactor();
        const minScale = 0.5;
        const maxScale = 2.0;
        const adjustedScale = Math.max(minScale, Math.min(maxScale, scaleFactor));
        
        const left = baseLeft;
        const top = baseTop;
        const width = baseWidth;
        const height = baseHeight;
        
        // Get description from i18n if available
        let description = elementType;
        if (type !== 'custom' && typeof i18n !== 'undefined') {
            const key = `gridPositions.${type}Elements.${elementName}`;
            description = i18n.t(key) || elementType;
        }
        
        // Base CSS properties
        const baseCss = {
            position: 'absolute',
            left: `${left.toFixed(2)}%`,
            top: `${top.toFixed(2)}%`,
            width: `${width.toFixed(2)}%`,
            height: `${height.toFixed(2)}%`,
            '--scale-factor': adjustedScale.toFixed(3),
            margin: '0',
            padding: '0',
            boxSizing: 'border-box'
        };
        
        // Apply debug styles if enabled
        if (typeof DebugBorderConfig !== 'undefined' && DebugBorderConfig.enabled) {
            baseCss.border = DebugBorderConfig.borderStyle;
        }
        
        return {
            coordinates: coordinates,
            css: baseCss,
            gridString: `R${topRow}C${topCol}-R${bottomRow}C${bottomCol}`,
            description: description,
            scaleFactor: adjustedScale,
            type: type,
            elementType: elementType,
            elementName: elementName
        };
    }
    
    /**
     * Apply positioning to a DOM element
     */
    applyPosition(element, positionName, type = 'standard') {
        this.updateScreenDimensions();
        
        const position = this.getElement(positionName);
        
        if (!position) {
            console.warn(`Position "${positionName}" not found`);
            return;
        }
        
        // Apply CSS styles
        Object.assign(element.style, position.css);
        
        // Add data attributes for debugging
        element.setAttribute('data-grid-position', positionName);
        element.setAttribute('data-grid-coordinates', position.gridString);
        element.setAttribute('data-grid-type', type);
        element.setAttribute('data-scale-factor', position.scaleFactor);
    }
    
    /**
     * Get current scale factor for manual adjustments
     */
    getCurrentScaleFactor() {
        return this.getScaleFactor();
    }
    
    /**
     * Sync precision with grid cell units system
     */
    syncWithGridCellUnits() {
        if (typeof gridCellUnits !== 'undefined') {
            gridCellUnits.setPrecision(this.gridDimensions.precision);
        }
    }
    
    /**
     * Clear cache (useful for debugging or manual refresh)
     */
    clearCache() {
        this.cache.clear();
        if (typeof gridCellUnits !== 'undefined') {
            gridCellUnits.clearCache();
        }
    }
}

// Page-based element configurations
const GridPositionPages = {
    // Default/Demo page
    1: [
        {
            name: 'character',
            ...StandardPositions.character,
            // Override or extend specific props if needed
            props: {
                ...StandardPositions.character.props,
                src: 'assets/character_excited.png',
                alt: 'Excited Character'
            }
        },
        {
            name: 'dialog-bubble',
            ...StandardPositions.dialogBubble,
            props: {
                ...StandardPositions.dialogBubble.props,
                get text() {
                    // Dynamic text for page 1 - check if carry over is needed
                    const currentQuestion = Grid1Utils.getCurrentQuestion();
                    if (currentQuestion) {
                        const onesDigitSum = currentQuestion.first_number % 10 + currentQuestion.second_number % 10 + 
                                           (currentQuestion.third_number ? currentQuestion.third_number % 10 : 0);
                        
                        // Use i18n system for both cases
                        if (onesDigitSum > 9) {
                            return typeof i18n !== 'undefined' ? i18n.t('dialogs.page1.dialogtext_carryover') : "Let's solve this addition challenge with carry overs.";
                        } else {
                            return typeof i18n !== 'undefined' ? i18n.t('dialogs.page1.dialogtext') : "Let's solve this addition challenge..";
                        }
                    }
                    // Fallback to i18n system
                    return typeof i18n !== 'undefined' ? i18n.t('dialogs.page1.dialogtext') : 'Let\'s learn addition';
                },
                get options() {
                    return GridCellFontUtils.processGcStyles({
                        fontSize: '350gc',
                        lineHeight: '1400gc',
                        textAlign: "left",
                        textJustify: "auto",
                        backgroundColor: "#ffffff",
                        textColor: "#000000",
                        borderRadius: '75gc',
                        padding: '50gc',
                        showTail: true,
                        tailBorder: "bottom",
                        tailPlacement: "middle",
                        tailDirection: "south"
                    });
                }
            }
        },
        {
            name: 'container1',
            ...StandardPositions.container1
        },
        {
            name: 'container2',
            ...StandardPositions.container2
        },
        {
            name: 'instruction-header',
            ...StandardPositions.instructionHeader
        },
        {
            name: 'question-dropdown',
            ...StandardPositions.questionDropdown
        },
        {
            name: 'grid1',
            type: 'grid',
            coordinates: [30, 70], // Only top coordinates - bottom calculated automatically
            zIndex: 400,
            props: {
                gridStructure: {
                    columns: 2,
                    rows: 4  // Dynamic based on question
                },
                defaultCellSize: {
                    rows: 6,    // Default: 6 rows height
                    columns: 6  // Default: 6 columns width
                },
                columnOverrides: {
                    'col1': { rows: 6, columns: 4 }, // Column 2 uses 10 columns width
                    'col2': { rows: 6, columns: 8 } // Column 2 uses 10 columns width
                },
                rowOverrides: {
                    // Row overrides will be set dynamically by Grid1Utils.loadQuestion()
                },
                cellOverrides: {
                    
                },
                cellStyles: {
                    // backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    // border: '2px solid rgba(255, 255, 255, 0.3)',
                    // borderRadius: '8px'
                },
                // Special styling for separator row
                separatorRowStyles: {
                    // borderTop: '3px solid #ffffff',
                    // backgroundColor: '#fff000'
                },
                textStyles: {
                    fontSize: '400gc',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    textAlign: 'center',
                    verticalAlign: 'middle',
                    fontFamily: 'Arial, sans-serif'
                },
                // Addition problem configuration
                currentQuestionIndex: 0,
                questionData: null, // Will be populated from QUESTIONS array
                showSeparatorLine: true // Flag to control separator line visibility
            }
        },
        {
            name: 'next-button',
            ...StandardPositions.nextButton
        },
        {
            name: 'previous-button',
            ...StandardPositions.previousButton
        }
    ],
    
    // Page 2 - Exact replica of page 1
    2: [
        {
            name: 'character',
            ...StandardPositions.character,
            // Override or extend specific props if needed
            props: {
                ...StandardPositions.character.props,
                src: 'assets/character_excited.png',
                alt: 'Excited Character'
            }
        },
        {
            name: 'dialog-bubble',
            ...StandardPositions.dialogBubble,
            props: {
                ...StandardPositions.dialogBubble.props,
                get text() {
                    // Use i18n system for dialog text
                    return typeof i18n !== 'undefined' ? i18n.t('dialogs.page2.dialogtext') : 'Split the numbers into their place values.';
                },
                get options() {
                    return GridCellFontUtils.processGcStyles({
                        fontSize: '300gc',
                        lineHeight: '1400gc',
                        textAlign: "left",
                        textJustify: "auto",
                        backgroundColor: "#ffffff",
                        textColor: "#000000",
                        borderRadius: '75gc',
                        padding: '50gc',
                        showTail: true,
                        tailBorder: "bottom",
                        tailPlacement: "middle",
                        tailDirection: "south"
                    });
                }
            }
        },
        {
            name: 'container1',
            ...StandardPositions.container1
        },
        {
            name: 'container2',
            ...StandardPositions.container2
        },
        {
            name: 'instruction-header',
            ...StandardPositions.instructionHeader
        },
        {
            name: 'question-dropdown',
            ...StandardPositions.questionDropdown
        },
        {
            name: 'grid1',
            type: 'grid',
            coordinates: [30, 70], // Start below target position for animation
            zIndex: 400,
            props: {
                gridStructure: {
                    columns: 2,
                    rows: 4  // Dynamic based on question
                },
                defaultCellSize: {
                    rows: 6,    // Default: 6 rows height
                    columns: 6  // Default: 6 columns width
                },
                columnOverrides: {
                    'col1': { rows: 6, columns: 4 }, // Column 1 uses 4 columns width
                    'col2': { rows: 6, columns: 8 } // Column 2 uses 8 columns width
                },
                rowOverrides: {
                    // Row overrides will be set dynamically by Grid1Utils.loadQuestion()
                },
                cellOverrides: {
                    
                },
                cellStyles: {
                    // backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    // border: '2px solid rgba(255, 255, 255, 0.3)',
                    // borderRadius: '8px'
                },
                // Special styling for separator row
                separatorRowStyles: {
                    // borderTop: '3px solid #ffffff',
                    // backgroundColor: '#fff000'
                },
                textStyles: {
                    fontSize: '400gc',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    textAlign: 'center',
                    verticalAlign: 'middle',
                    fontFamily: 'Arial, sans-serif'
                },
                // Addition problem configuration
                currentQuestionIndex: 0,
                questionData: null, // Will be populated from QUESTIONS array
                showSeparatorLine: true, // Flag to control separator line visibility
                // Animation configuration for page 2
                animateOnLoad: true, // Enable animation on page load
                animationDelay: 500, // Delay in milliseconds
                animationDuration: 2000, // Animation duration in milliseconds
                animationEasing: 'easeOutQuad', // Animation easing
                targetPosition: [30, 40] // Target position to animate to - should move left
            }
        },
        {
            name: 'next-button',
            ...StandardPositions.nextButton
        },
        {
            name: 'previous-button',
            ...StandardPositions.previousButton
        },
        {
            name: 'grid2',
            type: 'grid',
            coordinates: [18, 65], // Position to the right of Grid1 (row 35, column 80)
            zIndex: 401,
            props: {
                gridStructure: {
                    columns: 5,    // Dynamic based on question
                    rows: 8        // Dynamic based on question
                },
                defaultCellSize: {
                    rows: 6,    // Same as Grid1
                    columns: 8  // Same as Grid1's R1C2 width
                },
                columnOverrides: {
                    // Will be set dynamically by Grid2Utils
                },
                rowOverrides: {
                    // Will be set dynamically by Grid2Utils
                },
                cellOverrides: {
                    
                },
                cellStyles: {
                    // backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    // border: '1px solid rgba(255, 255, 255, 0.5)',
                    // borderRadius: '4px'
                },
                // Special styling for separator row
                separatorRowStyles: {
                    // borderTop: '2px solid #ffffff',
                    // backgroundColor: 'rgba(255, 255, 255, 0.1)'
                },
                textStyles: {
                    fontSize: '400gc',  // Same as Grid1
                    fontWeight: 'bold',
                    color: '#ffffff',
                    textAlign: 'center',
                    verticalAlign: 'middle',
                    fontFamily: 'Arial, sans-serif'
                },
                // Addition problem configuration
                currentQuestionIndex: 0,
                questionData: null, // Will be populated from QUESTIONS array
                showSeparatorLine: true, // Flag to control separator line visibility
                // Grid2-specific properties
                isGrid2: true, // Flag to identify this as Grid2
                dynamicDimensions: true, // Enable dynamic sizing
                showCarryRow: true, // Show carry calculations
                showAdditionalAnswerRow: true, // Show additional answer row if needed
                // Animation configuration for page 2
                animateOnLoad: true, // Enable animation on page load
                animationDelay: 1000, // Delay after grid1 animation
                animationDuration: 800, // Animation duration in milliseconds
                animationEasing: 'easeOutQuad', // Animation easing
                targetPosition: [35, 80] // Target position to animate to (row 35, column 80)
            }
        }
    ],
    
    // Page 3 - Replica of page 2
    3: [
        {
            name: 'character',
            ...StandardPositions.character,
            // Override or extend specific props if needed
            props: {
                ...StandardPositions.character.props,
                src: 'assets/character_excited.png',
                alt: 'Excited Character'
            }
        },
        {
            name: 'dialog-bubble',
            ...StandardPositions.dialogBubble,
            props: {
                ...StandardPositions.dialogBubble.props,
                get text() {
                    // Use i18n system for dialog text
                    return typeof i18n !== 'undefined' ? i18n.t('dialogs.page3.dialogtext') : 'Split the numbers into their place values.';
                },
                get options() {
                    return GridCellFontUtils.processGcStyles({
                        fontSize: '300gc',
                        lineHeight: '1400gc',
                        textAlign: "left",
                        textJustify: "auto",
                        backgroundColor: "#ffffff",
                        textColor: "#000000",
                        borderRadius: '75gc',
                        padding: '50gc',
                        showTail: true,
                        tailBorder: "bottom",
                        tailPlacement: "middle",
                        tailDirection: "south"
                    });
                }
            }
        },
        {
            name: 'container1',
            ...StandardPositions.container1
        },
        {
            name: 'container2',
            ...StandardPositions.container2
        },
        {
            name: 'instruction-header',
            ...StandardPositions.instructionHeader
        },
        {
            name: 'question-dropdown',
            ...StandardPositions.questionDropdown
        },
        {
            name: 'grid1',
            type: 'grid',
            coordinates: [30, 40], // Start below target position for animation
            zIndex: 400,
            props: {
                gridStructure: {
                    columns: 2,
                    rows: 4  // Dynamic based on question
                },
                defaultCellSize: {
                    rows: 6,    // Default: 6 rows height
                    columns: 6  // Default: 6 columns width
                },
                columnOverrides: {
                    'col1': { rows: 6, columns: 4 }, // Column 1 uses 4 columns width
                    'col2': { rows: 6, columns: 8 } // Column 2 uses 8 columns width
                },
                rowOverrides: {
                    // Row overrides will be set dynamically by Grid1Utils.loadQuestion()
                },
                cellOverrides: {
                    
                },
                cellStyles: {
                    // backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    // border: '2px solid rgba(255, 255, 255, 0.3)',
                    // borderRadius: '8px'
                },
                // Special styling for separator row
                separatorRowStyles: {
                    // borderTop: '3px solid #ffffff',
                    // backgroundColor: '#fff000'
                },
                textStyles: {
                    fontSize: '400gc',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    textAlign: 'center',
                    verticalAlign: 'middle',
                    fontFamily: 'Arial, sans-serif'
                },
                // Addition problem configuration
                currentQuestionIndex: 0,
                questionData: null, // Will be populated from QUESTIONS array
                showSeparatorLine: true, // Flag to control separator line visibility
                // Animation configuration for page 3
                animateOnLoad: false, // Enable animation on page load
                animationDelay: 500, // Delay in milliseconds
                animationDuration: 2000, // Animation duration in milliseconds
                animationEasing: 'easeOutQuad', // Animation easing
                targetPosition: [30, 40] // Target position to animate to - should move left
            }
        },
        {
            name: 'next-button',
            ...StandardPositions.nextButton
        },
        {
            name: 'previous-button',
            ...StandardPositions.previousButton
        },
        {
            name: 'grid2',
            type: 'grid',
            coordinates: [18, 65], // Position to the right of Grid1 (row 35, column 80)
            zIndex: 401,
            props: {
                gridStructure: {
                    columns: 5,    // Dynamic based on question
                    rows: 8        // Dynamic based on question
                },
                defaultCellSize: {
                    rows: 6,    // Same as Grid1
                    columns: 8  // Same as Grid1's R1C2 width
                },
                columnOverrides: {
                    // Will be set dynamically by Grid2Utils
                },
                rowOverrides: {
                    // Will be set dynamically by Grid2Utils
                },
                cellOverrides: {
                    
                },
                cellStyles: {
                    // backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    // border: '1px solid rgba(255, 255, 255, 0.5)',
                    // borderRadius: '4px'
                },
                // Special styling for separator row
                separatorRowStyles: {
                    // borderTop: '2px solid #ffffff',
                    // backgroundColor: 'rgba(255, 255, 255, 0.1)'
                },
                textStyles: {
                    fontSize: '400gc',  // Same as Grid1
                    fontWeight: 'bold',
                    color: '#ffffff',
                    textAlign: 'center',
                    verticalAlign: 'middle',
                    fontFamily: 'Arial, sans-serif'
                },
                // Addition problem configuration
                currentQuestionIndex: 0,
                questionData: null, // Will be populated from QUESTIONS array
                showSeparatorLine: true, // Flag to control separator line visibility
                // Grid2-specific properties
                isGrid2: true, // Flag to identify this as Grid2
                dynamicDimensions: true, // Enable dynamic sizing
                showCarryRow: true, // Show carry calculations
                showAdditionalAnswerRow: true, // Show additional answer row if needed
                // Animation configuration for page 3
                animateOnLoad: true, // Enable animation on page load
                animationDelay: 1000, // Delay after grid1 animation
                animationDuration: 800, // Animation duration in milliseconds
                animationEasing: 'easeOutQuad', // Animation easing
                targetPosition: [35, 80] // Target position to animate to (row 35, column 80)
            }
        },
        {
            name: 'quizModal',
            ...StandardPositions.quizModal,
            props: {
                ...StandardPositions.quizModal.props,
                get title() {
                    return typeof i18n !== 'undefined' ? i18n.t('dialogs.quiz.whichColumnFirst') : 'Which column do we add first?';
                },
                get options() {
                    return [
                        {
                            option: typeof i18n !== 'undefined' ? i18n.t('dialogs.quiz.hundreds') : 'Hundreds',
                            isCorrect: false,
                            feedback: typeof i18n !== 'undefined' ? i18n.t('dialogs.quiz.tryAgain') : 'No, that\'s not right!\n\nWe add from right to left. Try again!'
                        },
                        {
                            option: typeof i18n !== 'undefined' ? i18n.t('dialogs.quiz.tens') : 'Tens',
                            isCorrect: false,
                            feedback: typeof i18n !== 'undefined' ? i18n.t('dialogs.quiz.tryAgain') : 'No, that\'s not right!\n\nWe add from right to left. Try again!'
                        },
                        {
                            option: typeof i18n !== 'undefined' ? i18n.t('dialogs.quiz.ones') : 'Ones',
                            isCorrect: true,
                            feedback: typeof i18n !== 'undefined' ? i18n.t('dialogs.quiz.rightDirection') : 'You are right - we go from right to left!'
                        }
                    ];
                },
                // Keep these for backward compatibility, but they may not be used anymore
                get correctAnswer() {
                    return typeof i18n !== 'undefined' ? i18n.t('dialogs.quiz.ones') : 'Ones';
                },
                get correctFeedback() {
                    return typeof i18n !== 'undefined' ? i18n.t('dialogs.quiz.rightDirection') : 'You are right - we go from right to left!';
                },
                get incorrectFeedback() {
                    return typeof i18n !== 'undefined' ? i18n.t('dialogs.quiz.tryAgain') : 'No, that\'s not right!\n\nWe add from right to left. Try again!';
                },
                defaultFeedback: ' \n\n ',
                visible: true // Initially hidden
            }
        }
    ],
    
    // Page 4 - Exact replica of page 3 without the modal
    4: [
        {
            name: 'character',
            ...StandardPositions.character,
            // Override or extend specific props if needed
            props: {
                ...StandardPositions.character.props,
                src: 'assets/character_excited.png',
                alt: 'Excited Character'
            }
        },
        {
            name: 'dialog-bubble',
            ...StandardPositions.dialogBubble,
            props: {
                ...StandardPositions.dialogBubble.props,
                get text() {
                    // Use i18n system for dialog text
                    return typeof i18n !== 'undefined' ? i18n.t('dialogs.page4.dialogtext') : 'Recall we add by place values.\n\nLet\'s add the ones column.';
                },
                get options() {
                    return GridCellFontUtils.processGcStyles({
                        fontSize: '300gc',
                        lineHeight: '1400gc',
                        textAlign: "left",
                        textJustify: "auto",
                        backgroundColor: "#ffffff",
                        textColor: "#000000",
                        borderRadius: '75gc',
                        padding: '50gc',
                        showTail: true,
                        tailBorder: "bottom",
                        tailPlacement: "middle",
                        tailDirection: "south"
                    });
                }
            }
        },
        {
            name: 'container1',
            ...StandardPositions.container1
        },
        {
            name: 'container2',
            ...StandardPositions.container2
        },
        {
            name: 'instruction-header',
            ...StandardPositions.instructionHeader,
            props: {
                ...StandardPositions.instructionHeader.props,
                get text() {
                    return typeof i18n !== 'undefined' ? i18n.t('dialogs.instructions.tapPlusSign') : 'Tap on the plus sign.';
                }
            }
        },
        {
            name: 'question-dropdown',
            ...StandardPositions.questionDropdown
        },
        {
            name: 'grid1',
            type: 'grid',
            coordinates: [30, 40], // Start below target position for animation
            zIndex: 400,
            props: {
                gridStructure: {
                    columns: 2,
                    rows: 4  // Dynamic based on question
                },
                defaultCellSize: {
                    rows: 6,    // Default: 6 rows height
                    columns: 6  // Default: 6 columns width
                },
                columnOverrides: {
                    'col1': { rows: 6, columns: 4 }, // Column 1 uses 4 columns width
                    'col2': { rows: 6, columns: 8 } // Column 2 uses 8 columns width
                },
                rowOverrides: {
                    // Row overrides will be set dynamically by Grid1Utils.loadQuestion()
                },
                cellOverrides: {
                    
                },
                cellStyles: {
                    // backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    // border: '2px solid rgba(255, 255, 255, 0.3)',
                    // borderRadius: '8px'
                },
                // Special styling for separator row
                separatorRowStyles: {
                    // borderTop: '3px solid #ffffff',
                    // backgroundColor: '#fff000'
                },
                textStyles: {
                    fontSize: '400gc',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    textAlign: 'center',
                    verticalAlign: 'middle',
                    fontFamily: 'Arial, sans-serif'
                },
                // Addition problem configuration
                currentQuestionIndex: 0,
                questionData: null, // Will be populated from QUESTIONS array
                showSeparatorLine: true, // Flag to control separator line visibility
                // Animation configuration for page 4
                animateOnLoad: false, // Enable animation on page load
                animationDelay: 500, // Delay in milliseconds
                animationDuration: 2000, // Animation duration in milliseconds
                animationEasing: 'easeOutQuad', // Animation easing
                targetPosition: [30, 40] // Target position to animate to - should move left
            }
        },
        {
            name: 'next-button',
            ...StandardPositions.nextButton
        },
        {
            name: 'previous-button',
            ...StandardPositions.previousButton
        },
        {
            name: 'grid2',
            type: 'grid',
            coordinates: [18, 65], // Position to the right of Grid1 (row 35, column 80)
            zIndex: 401,
            props: {
                gridStructure: {
                    columns: 5,    // Dynamic based on question
                    rows: 8        // Dynamic based on question
                },
                defaultCellSize: {
                    rows: 6,    // Same as Grid1
                    columns: 8  // Same as Grid1's R1C2 width
                },
                columnOverrides: {
                    // Will be set dynamically by Grid2Utils
                },
                rowOverrides: {
                    // Will be set dynamically by Grid2Utils
                },
                cellOverrides: {
                    
                },
                cellStyles: {
                    // backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    // border: '1px solid rgba(255, 255, 255, 0.5)',
                    // borderRadius: '4px'
                },
                // Special styling for separator row
                separatorRowStyles: {
                    // borderTop: '2px solid #ffffff',
                    // backgroundColor: 'rgba(255, 255, 255, 0.1)'
                },
                textStyles: {
                    fontSize: '400gc',  // Same as Grid1
                    fontWeight: 'bold',
                    color: '#ffffff',
                    textAlign: 'center',
                    verticalAlign: 'middle',
                    fontFamily: 'Arial, sans-serif'
                },
                // Addition problem configuration
                currentQuestionIndex: 0,
                questionData: null, // Will be populated from QUESTIONS array
                showSeparatorLine: true, // Flag to control separator line visibility
                // Grid2-specific properties
                isGrid2: true, // Flag to identify this as Grid2
                dynamicDimensions: true, // Enable dynamic sizing
                showCarryRow: true, // Show carry calculations
                showAdditionalAnswerRow: true, // Show additional answer row (always present)
                // Animation configuration for page 4
                animateOnLoad: true, // Enable animation on page load
                animationDelay: 1000, // Delay after grid1 animation
                animationDuration: 800, // Animation duration in milliseconds
                animationEasing: 'easeOutQuad', // Animation easing
                targetPosition: [35, 80] // Target position to animate to (row 35, column 80)
            }
                 }
     ],
     
     // Page 5 - Exact replica of page 4 with quiz modal
     5: [
         {
             name: 'quizModal',
             ...StandardPositions.quizModal,
             props: {
                 ...StandardPositions.quizModal.props,
                 // Override quiz modal content for page 5 - ones digit addition
                 headerText: 'Ones Digit Addition',
                 // Dynamic options based on question data
                 correctAnswer: null, // Will be calculated dynamically
                 incorrectAnswer: null, // Will be calculated dynamically
                 get correctFeedback() {
                     return typeof i18n !== 'undefined' ? i18n.t('dialogs.quiz.correct') : 'Correct!';
                 },
                 get incorrectFeedback() {
                     return typeof i18n !== 'undefined' ? i18n.t('dialogs.quiz.incorrect') : 'No, that is incorrect. Try again!';
                 },
                 // Custom question text generator
                 getQuestionText: (questionData) => {
                     if (!questionData) return 'Question not loaded';
                     
                     const firstOnes = questionData.first_number % 10;
                     const secondOnes = questionData.second_number % 10;
                     const thirdOnes = questionData.third_number ? questionData.third_number % 10 : null;
                     
                     if (thirdOnes !== null) {
                         return `${firstOnes} + ${secondOnes} + ${thirdOnes} = ?`;
                     } else {
                         return `${firstOnes} + ${secondOnes} = ?`;
                     }
                 },
                 // Custom options generator - generates 3 stable options
                 getOptions: (questionData) => {
                     if (!questionData) return ['?', '?', '?'];
                     
                     const firstOnes = questionData.first_number % 10;
                     const secondOnes = questionData.second_number % 10;
                     const thirdOnes = questionData.third_number ? questionData.third_number % 10 : null;
                     
                     // Calculate correct answer
                     const correctAnswer = thirdOnes !== null ? 
                         firstOnes + secondOnes + thirdOnes : 
                         firstOnes + secondOnes;
                     
                     // Generate stable seed based on question numbers for consistent randomness
                     const seed = questionData.first_number + questionData.second_number + (questionData.third_number || 0);
                     
                     // Seeded random function for consistent results
                     const seededRandom = (seed) => {
                         const x = Math.sin(seed) * 10000;
                         return x - Math.floor(x);
                     };
                     
                     // Generate two different incorrect answers (1-18, excluding correct answer)
                     const incorrectAnswers = [];
                     let attempt = 0;
                     
                     while (incorrectAnswers.length < 2 && attempt < 50) {
                         const randomValue = seededRandom(seed + attempt);
                         const incorrectAnswer = Math.floor(randomValue * 18) + 1;
                         
                         if (incorrectAnswer !== correctAnswer && !incorrectAnswers.includes(incorrectAnswer)) {
                             incorrectAnswers.push(incorrectAnswer);
                         }
                         attempt++;
                     }
                     
                     // Fallback if we couldn't generate 2 different incorrect answers
                     while (incorrectAnswers.length < 2) {
                         let fallbackAnswer = (correctAnswer + incorrectAnswers.length + 1) % 19;
                         if (fallbackAnswer === 0) fallbackAnswer = 19;
                         if (fallbackAnswer !== correctAnswer && !incorrectAnswers.includes(fallbackAnswer)) {
                             incorrectAnswers.push(fallbackAnswer);
                         }
                     }
                     
                     // Create options array with correct and incorrect answers
                     const options = [correctAnswer, ...incorrectAnswers];
                     
                     // Shuffle options consistently using seed
                     for (let i = options.length - 1; i > 0; i--) {
                         const j = Math.floor(seededRandom(seed + i + 100) * (i + 1));
                         [options[i], options[j]] = [options[j], options[i]];
                     }
                     
                     return options;
                 }
             }
         },
         {
             name: 'character',
             ...StandardPositions.character,
             // Override or extend specific props if needed
             props: {
                 ...StandardPositions.character.props,
                 src: 'assets/character_excited.png',
                 alt: 'Excited Character'
             }
         },
         {
             name: 'dialog-bubble',
             ...StandardPositions.dialogBubble,
             props: {
                 ...StandardPositions.dialogBubble.props,
                 get text() {
                     // Use i18n system for dialog text
                     return typeof i18n !== 'undefined' ? i18n.t('dialogs.page5.dialogtext') : 'Let us add the ones digit for all the numbers';
                 },
                 get options() {
                     return GridCellFontUtils.processGcStyles({
                         fontSize: '300gc',
                         lineHeight: '1400gc',
                         textAlign: "left",
                         textJustify: "auto",
                         backgroundColor: "#ffffff",
                         textColor: "#000000",
                         borderRadius: '75gc',
                         padding: '50gc',
                         showTail: true,
                         tailBorder: "bottom",
                         tailPlacement: "middle",
                         tailDirection: "south"
                     });
                 }
             }
         },
         {
             name: 'container1',
             ...StandardPositions.container1
         },
         {
             name: 'container2',
             ...StandardPositions.container2
         },
         {
             name: 'instruction-header',
             ...StandardPositions.instructionHeader
         },
         {
             name: 'question-dropdown',
             ...StandardPositions.questionDropdown
         },
         {
             name: 'grid1',
             type: 'grid',
             coordinates: [30, 40], // Start below target position for animation
             zIndex: 400,
             props: {
                 gridStructure: {
                     columns: 2,
                     rows: 4  // Dynamic based on question
                 },
                 defaultCellSize: {
                     rows: 6,    // Default: 6 rows height
                     columns: 6  // Default: 6 columns width
                 },
                 columnOverrides: {
                     'col1': { rows: 6, columns: 4 }, // Column 1 uses 4 columns width
                     'col2': { rows: 6, columns: 8 } // Column 2 uses 8 columns width
                 },
                 rowOverrides: {
                     // Row overrides will be set dynamically by Grid1Utils.loadQuestion()
                 },
                 cellOverrides: {
                     
                 },
                 cellStyles: {
                     // backgroundColor: 'rgba(255, 255, 255, 0.1)',
                     // border: '2px solid rgba(255, 255, 255, 0.3)',
                     // borderRadius: '8px'
                 },
                 // Special styling for separator row
                 separatorRowStyles: {
                     // borderTop: '3px solid #ffffff',
                     // backgroundColor: '#fff000'
                 },
                 textStyles: {
                     fontSize: '400gc',
                     fontWeight: 'bold',
                     color: '#ffffff',
                     textAlign: 'center',
                     verticalAlign: 'middle',
                     fontFamily: 'Arial, sans-serif'
                 },
                 // Addition problem configuration
                 currentQuestionIndex: 0,
                 questionData: null, // Will be populated from QUESTIONS array
                 showSeparatorLine: true, // Flag to control separator line visibility
                 // Animation configuration for page 5
                 animateOnLoad: false, // Enable animation on page load
                 animationDelay: 500, // Delay in milliseconds
                 animationDuration: 2000, // Animation duration in milliseconds
                 animationEasing: 'easeOutQuad', // Animation easing
                 targetPosition: [30, 40] // Target position to animate to - should move left
             }
         },
         {
             name: 'next-button',
             ...StandardPositions.nextButton
         },
         {
             name: 'previous-button',
             ...StandardPositions.previousButton
         },
         {
             name: 'grid2',
             type: 'grid',
             coordinates: [18, 65], // Position to the right of Grid1 (row 35, column 80)
             zIndex: 401,
             props: {
                 gridStructure: {
                     columns: 5,    // Dynamic based on question
                     rows: 8        // Dynamic based on question
                 },
                 defaultCellSize: {
                     rows: 6,    // Same as Grid1
                     columns: 8  // Same as Grid1's R1C2 width
                 },
                 columnOverrides: {
                     // Will be set dynamically by Grid2Utils
                 },
                 rowOverrides: {
                     // Will be set dynamically by Grid2Utils
                 },
                 cellOverrides: {
                     
                 },
                 cellStyles: {
                     // backgroundColor: 'rgba(255, 255, 255, 0.1)',
                     // border: '1px solid rgba(255, 255, 255, 0.5)',
                     // borderRadius: '4px'
                 },
                 // Special styling for separator row
                 separatorRowStyles: {
                     // borderTop: '2px solid #ffffff',
                     // backgroundColor: 'rgba(255, 255, 255, 0.1)'
                 },
                 textStyles: {
                     fontSize: '400gc',  // Same as Grid1
                     fontWeight: 'bold',
                     color: '#ffffff',
                     textAlign: 'center',
                     verticalAlign: 'middle',
                     fontFamily: 'Arial, sans-serif'
                 },
                 // Addition problem configuration
                 currentQuestionIndex: 0,
                 questionData: null, // Will be populated from QUESTIONS array
                 showSeparatorLine: true, // Flag to control separator line visibility
                 // Grid2-specific properties
                 isGrid2: true, // Flag to identify this as Grid2
                 dynamicDimensions: true, // Enable dynamic sizing
                 showCarryRow: true, // Show carry calculations
                 showAdditionalAnswerRow: true, // Show additional answer row if needed
                 // Animation configuration for page 5
                 animateOnLoad: true, // Enable animation on page load
                 animationDelay: 1000, // Delay after grid1 animation
                 animationDuration: 800, // Animation duration in milliseconds
                 animationEasing: 'easeOutQuad', // Animation easing
                 targetPosition: [35, 80] // Target position to animate to (row 35, column 80)
             }
         }
     ],
     
     // Page 6 - Exact replica of page 4
     6: [
         {
             name: 'character',
             ...StandardPositions.character,
             // Override or extend specific props if needed
             props: {
                 ...StandardPositions.character.props,
                 src: 'assets/character_excited.png',
                 alt: 'Excited Character'
             }
         },
         {
             name: 'dialog-bubble',
             ...StandardPositions.dialogBubble,
             props: {
                 ...StandardPositions.dialogBubble.props,
                 get text() {
                     // Use i18n system for dialog text
                     return typeof i18n !== 'undefined' ? i18n.t('dialogs.page6.dialogtext') : 'Oh! We have more than 9 in the ones place.\n\nWe need to do a carry over.';
                 },
                 get options() {
                     return GridCellFontUtils.processGcStyles({
                         fontSize: '300gc',
                         lineHeight: '1400gc',
                         textAlign: "left",
                         textJustify: "auto",
                         backgroundColor: "#ffffff",
                         textColor: "#000000",
                         borderRadius: '75gc',
                         padding: '50gc',
                         showTail: true,
                         tailBorder: "bottom",
                         tailPlacement: "middle",
                         tailDirection: "south"
                     });
                 }
             }
         },
         {
             name: 'container1',
             ...StandardPositions.container1
         },
         {
             name: 'container2',
             ...StandardPositions.container2
         },
         {
             name: 'instruction-header',
             ...StandardPositions.instructionHeader
         },
         {
             name: 'question-dropdown',
             ...StandardPositions.questionDropdown
         },
         {
             name: 'grid1',
             type: 'grid',
             coordinates: [30, 40], // Start below target position for animation
             zIndex: 400,
             props: {
                 gridStructure: {
                     columns: 2,
                     rows: 4  // Dynamic based on question
                 },
                 defaultCellSize: {
                     rows: 6,    // Default: 6 rows height
                     columns: 6  // Default: 6 columns width
                 },
                 columnOverrides: {
                     'col1': { rows: 6, columns: 4 }, // Column 1 uses 4 columns width
                     'col2': { rows: 6, columns: 8 } // Column 2 uses 8 columns width
                 },
                 rowOverrides: {
                     // Row overrides will be set dynamically by Grid1Utils.loadQuestion()
                 },
                 cellOverrides: {
                     
                 },
                 cellStyles: {
                    //  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    //  border: '2px solid rgba(255, 255, 255, 0.3)',
                    //  borderRadius: '8px'
                 },
                 // Special styling for separator row
                 separatorRowStyles: {
                     // borderTop: '3px solid #ffffff',
                     // backgroundColor: '#fff000'
                 },
                 textStyles: {
                     fontSize: '400gc',
                     fontWeight: 'bold',
                     color: '#ffffff',
                     textAlign: 'center',
                     verticalAlign: 'middle',
                     fontFamily: 'Arial, sans-serif'
                 },
                 // Addition problem configuration
                 currentQuestionIndex: 0,
                 questionData: null, // Will be populated from QUESTIONS array
                 showSeparatorLine: true, // Flag to control separator line visibility
                 // Animation configuration for page 6
                 animateOnLoad: false, // Enable animation on page load
                 animationDelay: 500, // Delay in milliseconds
                 animationDuration: 2000, // Animation duration in milliseconds
                 animationEasing: 'easeOutQuad', // Animation easing
                 targetPosition: [30, 40] // Target position to animate to - should move left
             }
         },
         {
             name: 'next-button',
             ...StandardPositions.nextButton
         },
         {
             name: 'previous-button',
             ...StandardPositions.previousButton
         },
         {
             name: 'grid2',
             type: 'grid',
             coordinates: [18, 65], // Position to the right of Grid1 (row 35, column 80)
             zIndex: 401,
             props: {
                 gridStructure: {
                     columns: 5,    // Dynamic based on question
                     rows: 8        // Dynamic based on question
                 },
                 defaultCellSize: {
                     rows: 6,    // Same as Grid1
                     columns: 8  // Same as Grid1's R1C2 width
                 },
                 columnOverrides: {
                     // Will be set dynamically by Grid2Utils
                 },
                 rowOverrides: {
                     // Will be set dynamically by Grid2Utils
                 },
                 cellOverrides: {
                     
                 },
                 cellStyles: {
                    //  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    //  border: '2px solid rgba(255, 255, 255, 0.3)',
                    //  borderRadius: '8px'
                 },
                 // Special styling for separator row
                 separatorRowStyles: {
                    //  borderTop: '2px solid #ffffff',
                    //  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                 },
                 textStyles: {
                     fontSize: '400gc',  // Same as Grid1
                     fontWeight: 'bold',
                     color: '#ffffff',
                     textAlign: 'center',
                     verticalAlign: 'middle',
                     fontFamily: 'Arial, sans-serif'
                 },
                 // Addition problem configuration
                 currentQuestionIndex: 0,
                 questionData: null, // Will be populated from QUESTIONS array
                 showSeparatorLine: true, // Flag to control separator line visibility
                 // Grid2-specific properties
                 isGrid2: true, // Flag to identify this as Grid2
                 dynamicDimensions: true, // Enable dynamic sizing
                 showCarryRow: true, // Show carry calculations
                 showAdditionalAnswerRow: true, // Show additional answer row if needed
                 // Animation configuration for page 6
                 animateOnLoad: true, // Enable animation on page load
                 animationDelay: 1000, // Delay after grid1 animation
                 animationDuration: 800, // Animation duration in milliseconds
                 animationEasing: 'easeOutQuad', // Animation easing
                 targetPosition: [35, 80] // Target position to animate to (row 35, column 80)
             }
         }
     ],
     
     // Page 7 - Exact replica of page 5 with quiz modal with text
     7: [
         {
             name: 'quizmodalwithtext',
             ...StandardPositions.quizmodalwithtext,
             props: {
                 ...StandardPositions.quizmodalwithtext.props,
                 // Override quiz modal content for page 7 - carry-over splitting
                 getHeaderText: (onesdigitsum) => {
                                           return typeof i18n !== 'undefined' ? i18n.t('dialogs.quiz.howShouldWeSplit', { value: onesdigitsum }) : `To do a carry over, how should we split ${onesdigitsum}?`;
                 },
                 getDescriptionText: (onesdigitsum) => {
                                           return typeof i18n !== 'undefined' ? i18n.t('dialogs.quiz.splitForCarryOverTens', { value: onesdigitsum }) : `${onesdigitsum} > 9\n\nWe need to split ${onesdigitsum} to do a carry over to tens place.`;
                 },
                 // Dynamic options based on digit calculations
                 getOptions: (onesdigitsum, tens_carry, onesdigitanswer) => {
                     const incorrect1 = `${tens_carry + 1} + ${onesdigitanswer - 1}`;
                     const correct = `${tens_carry} + ${onesdigitanswer}`;
                     const incorrect2 = `${tens_carry - 1} + ${onesdigitanswer + 1}`;
                     
                     return [
                         { 
                             option: incorrect1, 
                             isCorrect: false, 
                             feedback: typeof i18n !== 'undefined' ? 
                                 i18n.t('dialogs.quiz.carryErrorMessage', { incorrect: incorrect1 }) :
                                 `We need to carry 10 to the tens place, not ${incorrect1}. Try again!`
                         },
                         { 
                             option: correct, 
                             isCorrect: true, 
                             feedback: typeof i18n !== 'undefined' ? 
                                 i18n.t('dialogs.quiz.carryMessage', { value: onesdigitsum, remaining: onesdigitanswer }) :
                                 `We need to carry 10 to the tens place. So, we split ${onesdigitsum} as ${tens_carry} + ${onesdigitanswer}.`
                         },
                         { 
                             option: incorrect2, 
                             isCorrect: false, 
                             feedback: typeof i18n !== 'undefined' ? 
                                 i18n.t('dialogs.quiz.carryErrorMessage', { incorrect: incorrect2 }) :
                                 `We need to carry 10 to the tens place, not ${incorrect2}. Try again!`
                         }
                     ];
                 },
                 // Dynamic feedback based on answer type
                 getFeedback: (answerType, onesdigitsum, tens_carry, onesdigitanswer, selectedAnswer) => {
                     if (answerType === 'correct') {
                         return typeof i18n !== 'undefined' ? 
                             i18n.t('dialogs.quiz.carryMessage', { value: onesdigitsum, remaining: onesdigitanswer }) :
                             `We need to carry 10 to the tens place. So, we split ${onesdigitsum} as ${tens_carry} + ${onesdigitanswer}.`;
                     } else {
                         return typeof i18n !== 'undefined' ? 
                             i18n.t('dialogs.quiz.carryErrorMessage', { incorrect: selectedAnswer }) :
                             `We need to carry 10 to the tens place, not ${selectedAnswer}. Try again!`;
                     }
                 }
             }
         },
         {
             name: 'character',
             ...StandardPositions.character,
             // Override or extend specific props if needed
             props: {
                 ...StandardPositions.character.props,
                 src: 'assets/character_excited.png',
                 alt: 'Excited Character'
             }
         },
         {
             name: 'dialog-bubble',
             ...StandardPositions.dialogBubble,
             props: {
                 ...StandardPositions.dialogBubble.props,
                 get text() {
                     // Use i18n system for dialog text
                     return typeof i18n !== 'undefined' ? i18n.t('dialogs.page7.dialogtext') : 'Oh! We have more than 9 in the ones place.\n\nWe need to do a carry over.';
                 },
                 get options() {
                     return GridCellFontUtils.processGcStyles({
                         fontSize: '300gc',
                         lineHeight: '1400gc',
                         textAlign: "left",
                         textJustify: "auto",
                         backgroundColor: "#ffffff",
                         textColor: "#000000",
                         borderRadius: '75gc',
                         padding: '50gc',
                         showTail: true,
                         tailBorder: "bottom",
                         tailPlacement: "middle",
                         tailDirection: "south"
                     });
                 }
             }
         },
         {
             name: 'container1',
             ...StandardPositions.container1
         },
         {
             name: 'container2',
             ...StandardPositions.container2
         },
         {
             name: 'instruction-header',
             ...StandardPositions.instructionHeader
         },
         {
             name: 'question-dropdown',
             ...StandardPositions.questionDropdown
         },
         {
             name: 'grid1',
             type: 'grid',
             coordinates: [30, 40], // Start below target position for animation
             zIndex: 400,
             props: {
                 gridStructure: {
                     columns: 2,
                     rows: 4  // Dynamic based on question
                 },
                 defaultCellSize: {
                     rows: 6,    // Default: 6 rows height
                     columns: 6  // Default: 6 columns width
                 },
                 columnOverrides: {
                     'col1': { rows: 6, columns: 4 }, // Column 1 uses 4 columns width
                     'col2': { rows: 6, columns: 8 } // Column 2 uses 8 columns width
                 },
                 rowOverrides: {
                     // Row overrides will be set dynamically by Grid1Utils.loadQuestion()
                 },
                 cellOverrides: {
                     
                 },
                 cellStyles: {
                    //  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    //  border: '2px solid rgba(255, 255, 255, 0.3)',
                    //  borderRadius: '8px'
                 },
                 // Special styling for separator row
                 separatorRowStyles: {
                     // borderTop: '3px solid #ffffff',
                     // backgroundColor: '#fff000'
                 },
                 textStyles: {
                     fontSize: '400gc',
                     fontWeight: 'bold',
                     color: '#ffffff',
                     textAlign: 'center',
                     verticalAlign: 'middle',
                     fontFamily: 'Arial, sans-serif'
                 },
                 // Addition problem configuration
                 currentQuestionIndex: 0,
                 questionData: null, // Will be populated from QUESTIONS array
                 showSeparatorLine: true, // Flag to control separator line visibility
                 // Animation configuration for page 7
                 animateOnLoad: false, // Enable animation on page load
                 animationDelay: 500, // Delay in milliseconds
                 animationDuration: 2000, // Animation duration in milliseconds
                 animationEasing: 'easeOutQuad', // Animation easing
                 targetPosition: [30, 40] // Target position to animate to - should move left
             }
         },
         {
             name: 'next-button',
             ...StandardPositions.nextButton
         },
         {
             name: 'previous-button',
             ...StandardPositions.previousButton
         },
         {
             name: 'grid2',
             type: 'grid',
             coordinates: [18, 65], // Position to the right of Grid1 (row 35, column 80)
             zIndex: 401,
             props: {
                 gridStructure: {
                     columns: 5,    // Dynamic based on question
                     rows: 8        // Dynamic based on question
                 },
                 defaultCellSize: {
                     rows: 6,    // Same as Grid1
                     columns: 8  // Same as Grid1's R1C2 width
                 },
                 columnOverrides: {
                     // Will be set dynamically by Grid2Utils
                 },
                 rowOverrides: {
                     // Will be set dynamically by Grid2Utils
                 },
                 cellOverrides: {
                     
                 },
                 cellStyles: {
                    //  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    //  border: '1px solid rgba(255, 255, 255, 0.5)',
                    //  borderRadius: '4px'
                 },
                 // Special styling for separator row
                 separatorRowStyles: {
                    //  borderTop: '2px solid #ffffff',
                    //  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                 },
                 textStyles: {
                     fontSize: '400gc',  // Same as Grid1
                     fontWeight: 'bold',
                     color: '#ffffff',
                     textAlign: 'center',
                     verticalAlign: 'middle',
                     fontFamily: 'Arial, sans-serif'
                 },
                 // Addition problem configuration
                 currentQuestionIndex: 0,
                 questionData: null, // Will be populated from QUESTIONS array
                 showSeparatorLine: true, // Flag to control separator line visibility
                 // Grid2-specific properties
                 isGrid2: true, // Flag to identify this as Grid2
                 dynamicDimensions: true, // Enable dynamic sizing
                 showCarryRow: true, // Show carry calculations
                 showAdditionalAnswerRow: true, // Show additional answer row if needed
                 // Animation configuration for page 7
                 animateOnLoad: true, // Enable animation on page load
                 animationDelay: 1000, // Delay after grid1 animation
                 animationDuration: 800, // Animation duration in milliseconds
                 animationEasing: 'easeOutQuad', // Animation easing
                 targetPosition: [35, 80] // Target position to animate to (row 35, column 80)
             }
         }
     ],
     
     // Page 8 - Exact replica of page 6
     8: [
         {
             name: 'character',
             ...StandardPositions.character,
             // Override or extend specific props if needed
             props: {
                 ...StandardPositions.character.props,
                 src: 'assets/character_excited.png',
                 alt: 'Excited Character'
             }
         },
         {
             name: 'dialog-bubble',
             ...StandardPositions.dialogBubble,
             props: {
                 ...StandardPositions.dialogBubble.props,
                 get text() {
                     // Dynamic text for page 8 - show ones digit sum
                     const currentQuestion = Grid1Utils.getCurrentQuestion();
                     if (currentQuestion) {
                         const onesDigitSum = currentQuestion.first_number % 10 + currentQuestion.second_number % 10 + 
                             (currentQuestion.third_number ? currentQuestion.third_number % 10 : 0);
                         
                         return i18n.t('dialogs.page8.splitCorrectly', { value: onesDigitSum });
                     }
                     // Fallback to i18n system
                     return typeof i18n !== 'undefined' ? i18n.t('dialogs.page8.dialogtext') : 'We have split correctly.';
                 },
                 get options() {
                     return GridCellFontUtils.processGcStyles({
                         fontSize: '300gc',
                         lineHeight: '1400gc',
                         textAlign: "left",
                         textJustify: "auto",
                         backgroundColor: "#ffffff",
                         textColor: "#000000",
                         borderRadius: '75gc',
                         padding: '50gc',
                         showTail: true,
                         tailBorder: "bottom",
                         tailPlacement: "middle",
                         tailDirection: "south"
                     });
                 }
             }
         },
         {
             name: 'container1',
             ...StandardPositions.container1
         },
         {
             name: 'container2',
             ...StandardPositions.container2
         },
         {
             name: 'instruction-header',
             ...StandardPositions.instructionHeader,
             props: {
                 ...StandardPositions.instructionHeader.props,
                 get text() {
                return typeof i18n !== 'undefined' ? i18n.t('dialogs.instructions.clickCarryOver') : 'Click on Carry Over';
            }
             }
         },
         {
             name: 'question-dropdown',
             ...StandardPositions.questionDropdown
         },
         {
             name: 'grid1',
             type: 'grid',
             coordinates: [30, 40], // Start below target position for animation
             zIndex: 400,
             props: {
                 gridStructure: {
                     columns: 2,
                     rows: 4  // Dynamic based on question
                 },
                 defaultCellSize: {
                     rows: 6,    // Default: 6 rows height
                     columns: 6  // Default: 6 columns width
                 },
                 columnOverrides: {
                     'col1': { rows: 6, columns: 4 }, // Column 1 uses 4 columns width
                     'col2': { rows: 6, columns: 8 } // Column 2 uses 8 columns width
                 },
                 rowOverrides: {
                     // Row overrides will be set dynamically by Grid1Utils.loadQuestion()
                 },
                 cellOverrides: {
                     
                 },
                 cellStyles: {
                     // backgroundColor: 'rgba(255, 255, 255, 0.1)',
                     // border: '2px solid rgba(255, 255, 255, 0.3)',
                     // borderRadius: '8px'
                 },
                 // Special styling for separator row
                 separatorRowStyles: {
                     // borderTop: '3px solid #ffffff',
                     // backgroundColor: '#fff000'
                 },
                 textStyles: {
                     fontSize: '400gc',
                     fontWeight: 'bold',
                     color: '#ffffff',
                     textAlign: 'center',
                     verticalAlign: 'middle',
                     fontFamily: 'Arial, sans-serif'
                 },
                 // Addition problem configuration
                 currentQuestionIndex: 0,
                 questionData: null, // Will be populated from QUESTIONS array
                 showSeparatorLine: true, // Flag to control separator line visibility
                 // Animation configuration for page 8
                 animateOnLoad: false, // Enable animation on page load
                 animationDelay: 500, // Delay in milliseconds
                 animationDuration: 2000, // Animation duration in milliseconds
                 animationEasing: 'easeOutQuad', // Animation easing
                 targetPosition: [30, 40] // Target position to animate to - should move left
             }
         },
         {
             name: 'next-button',
             ...StandardPositions.nextButton
         },
         {
             name: 'previous-button',
             ...StandardPositions.previousButton
         },
         {
             name: 'grid2',
             type: 'grid',
             coordinates: [18, 65], // Position to the right of Grid1 (row 35, column 80)
             zIndex: 401,
             props: {
                 gridStructure: {
                     columns: 5,    // Dynamic based on question
                     rows: 8        // Dynamic based on question
                 },
                 defaultCellSize: {
                     rows: 6,    // Same as Grid1
                     columns: 8  // Same as Grid1's R1C2 width
                 },
                 columnOverrides: {
                     // Will be set dynamically by Grid2Utils
                 },
                 rowOverrides: {
                     // Will be set dynamically by Grid2Utils
                 },
                 cellOverrides: {
                     
                 },
                 cellStyles: {
                    //  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    //  border: '1px solid rgba(255, 255, 255, 0.5)',
                    //  borderRadius: '4px'
                 },
                 // Special styling for separator row
                 separatorRowStyles: {
                    //  borderTop: '2px solid #ffffff',
                    //  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                 },
                 textStyles: {
                     fontSize: '400gc',  // Same as Grid1
                     fontWeight: 'bold',
                     color: '#ffffff',
                     textAlign: 'center',
                     verticalAlign: 'middle',
                     fontFamily: 'Arial, sans-serif'
                 },
                 // Addition problem configuration
                 currentQuestionIndex: 0,
                 questionData: null, // Will be populated from QUESTIONS array
                 showSeparatorLine: true, // Flag to control separator line visibility
                 // Grid2-specific properties
                 isGrid2: true, // Flag to identify this as Grid2
                 dynamicDimensions: true, // Enable dynamic sizing
                 showCarryRow: true, // Show carry calculations
                 showAdditionalAnswerRow: true, // Show additional answer row if needed
                 // Animation configuration for page 8
                 animateOnLoad: true, // Enable animation on page load
                 animationDelay: 1000, // Delay after grid1 animation
                 animationDuration: 800, // Animation duration in milliseconds
                 animationEasing: 'easeOutQuad', // Animation easing
                 targetPosition: [35, 80] // Target position to animate to (row 35, column 80)
             }
         }
     ],
     
     // Page 9 - Exact replica of page 8 (Carry Over page)
     9: [
         {
             name: 'character',
             ...StandardPositions.character,
             // Override or extend specific props if needed
             props: {
                 ...StandardPositions.character.props,
                 src: 'assets/character_excited.png',
                 alt: 'Excited Character'
             }
         },
         {
             name: 'dialog-bubble',
             ...StandardPositions.dialogBubble,
             props: {
                 ...StandardPositions.dialogBubble.props,
                 get text() {
                     // Use i18n system for dialog text
                     return typeof i18n !== 'undefined' ? i18n.t('dialogs.page9.dialogtext') : 'Split the numbers into their place values.';
                 },
                 get options() {
                     return GridCellFontUtils.processGcStyles({
                         fontSize: '300gc',
                         lineHeight: '1400gc',
                         textAlign: "left",
                         textJustify: "auto",
                         backgroundColor: "#ffffff",
                         textColor: "#000000",
                         borderRadius: '75gc',
                         padding: '50gc',
                         showTail: true,
                         tailBorder: "bottom",
                         tailPlacement: "middle",
                         tailDirection: "south"
                     });
                 }
             }
         },
         {
             name: 'container1',
             ...StandardPositions.container1
         },
         {
             name: 'container2',
             ...StandardPositions.container2
         },
         {
             name: 'instruction-header',
             ...StandardPositions.instructionHeader
         },
         {
             name: 'question-dropdown',
             ...StandardPositions.questionDropdown
         },
         {
             name: 'grid1',
             type: 'grid',
             coordinates: [30, 40], // Start below target position for animation
             zIndex: 400,
             props: {
                 gridStructure: {
                     columns: 2,
                     rows: 4  // Dynamic based on question
                 },
                 defaultCellSize: {
                     rows: 6,    // Default: 6 rows height
                     columns: 6  // Default: 6 columns width
                 },
                 columnOverrides: {
                     'col1': { rows: 6, columns: 4 }, // Column 1 uses 4 columns width
                     'col2': { rows: 6, columns: 8 } // Column 2 uses 8 columns width
                 },
                 rowOverrides: {
                     // Row overrides will be set dynamically by Grid1Utils.loadQuestion()
                 },
                 cellOverrides: {
                     
                 },
                 cellStyles: {
                     // backgroundColor: 'rgba(255, 255, 255, 0.1)',
                     // border: '2px solid rgba(255, 255, 255, 0.3)',
                     // borderRadius: '8px'
                 },
                 // Special styling for separator row
                 separatorRowStyles: {
                     // borderTop: '3px solid #ffffff',
                     // backgroundColor: '#fff000'
                 },
                 textStyles: {
                     fontSize: '400gc',
                     fontWeight: 'bold',
                     color: '#ffffff',
                     textAlign: 'center',
                     verticalAlign: 'middle',
                     fontFamily: 'Arial, sans-serif'
                 },
                 // Addition problem configuration
                 currentQuestionIndex: 0,
                 questionData: null, // Will be populated from QUESTIONS array
                 showSeparatorLine: true, // Flag to control separator line visibility
                 // Animation configuration for page 9
                 animateOnLoad: false, // Enable animation on page load
                 animationDelay: 500, // Delay in milliseconds
                 animationDuration: 2000, // Animation duration in milliseconds
                 animationEasing: 'easeOutQuad', // Animation easing
                 targetPosition: [30, 40] // Target position to animate to - should move left
             }
         },
         {
             name: 'next-button',
             ...StandardPositions.nextButton
         },
         {
             name: 'previous-button',
             ...StandardPositions.previousButton
         },
         {
             name: 'grid2',
             type: 'grid',
             coordinates: [18, 65], // Position to the right of Grid1 (row 35, column 80)
             zIndex: 401,
             props: {
                 gridStructure: {
                     columns: 5,    // Dynamic based on question
                     rows: 8        // Dynamic based on question
                 },
                 defaultCellSize: {
                     rows: 6,    // Same as Grid1
                     columns: 8  // Same as Grid1's R1C2 width
                 },
                 columnOverrides: {
                     // Will be set dynamically by Grid2Utils
                 },
                 rowOverrides: {
                     // Will be set dynamically by Grid2Utils
                 },
                 cellOverrides: {
                     // Page 9 specific cell overrides for tenscarry borders
                     // Will be set dynamically based on number of digits by loadQuestion function
                 },
                 cellStyles: {
                    //  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    //  border: '1px solid rgba(255, 255, 255, 0.5)',
                    //  borderRadius: '4px'
                 },
                 // Special styling for separator row
                 separatorRowStyles: {
                    //  borderTop: '2px solid #ffffff',
                    //  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                 },
                 textStyles: {
                     fontSize: '400gc',  // Same as Grid1
                     fontWeight: 'bold',
                     color: '#ffffff',
                     textAlign: 'center',
                     verticalAlign: 'middle',
                     fontFamily: 'Arial, sans-serif'
                 },
                 // Addition problem configuration
                 currentQuestionIndex: 0,
                 questionData: null, // Will be populated from QUESTIONS array
                 showSeparatorLine: true, // Flag to control separator line visibility
                 // Grid2-specific properties
                 isGrid2: true, // Flag to identify this as Grid2
                 dynamicDimensions: true, // Enable dynamic sizing
                 showCarryRow: true, // Show carry calculations
                 showAdditionalAnswerRow: true, // Show additional answer row if needed
                 // Animation configuration for page 9
                 animateOnLoad: true, // Enable animation on page load
                 animationDelay: 1000, // Delay after grid1 animation
                 animationDuration: 800, // Animation duration in milliseconds
                 animationEasing: 'easeOutQuad', // Animation easing
                 targetPosition: [35, 80] // Target position to animate to (row 35, column 80)
             }
         }
     ],

     // Page 10 - Exact replica of page 9 (Carry Over page)
     10: [
         {
             name: 'character',
             ...StandardPositions.character,
             // Override or extend specific props if needed
             props: {
                 ...StandardPositions.character.props,
                 src: 'assets/character_excited.png',
                 alt: 'Excited Character'
             }
         },
         {
             name: 'dialog-bubble',
             ...StandardPositions.dialogBubble,
             props: {
                 ...StandardPositions.dialogBubble.props,
                 get text() {
                     // Use i18n system for dialog text
                     return typeof i18n !== 'undefined' ? i18n.t('dialogs.page10.dialogtext') : 'Split the numbers into their place values.';
                 },
                 get options() {
                     return GridCellFontUtils.processGcStyles({
                         fontSize: '300gc',
                         lineHeight: '1400gc',
                         textAlign: "left",
                         textJustify: "auto",
                         backgroundColor: "#ffffff",
                         textColor: "#000000",
                         borderRadius: '75gc',
                         padding: '50gc',
                         showTail: true,
                         tailBorder: "bottom",
                         tailPlacement: "middle",
                         tailDirection: "south"
                     });
                 }
             }
         },
         {
             name: 'container1',
             ...StandardPositions.container1
         },
         {
             name: 'container2',
             ...StandardPositions.container2
         },
         {
             name: 'instruction-header',
             ...StandardPositions.instructionHeader,
             props: {
                 ...StandardPositions.instructionHeader.props,
                 get text() {
                return typeof i18n !== 'undefined' ? i18n.t('dialogs.instructions.tapPlusSign') : 'Tap on the plus sign.';
            }
             }
         },
         {
             name: 'question-dropdown',
             ...StandardPositions.questionDropdown
         },
         {
             name: 'grid1',
             type: 'grid',
             coordinates: [30, 40], // Start below target position for animation
             zIndex: 400,
             props: {
                 gridStructure: {
                     columns: 2,
                     rows: 4  // Dynamic based on question
                 },
                 defaultCellSize: {
                     rows: 6,    // Default: 6 rows height
                     columns: 6  // Default: 6 columns width
                 },
                 columnOverrides: {
                     'col1': { rows: 6, columns: 4 }, // Column 1 uses 4 columns width
                     'col2': { rows: 6, columns: 8 } // Column 2 uses 8 columns width
                 },
                 rowOverrides: {
                     // Row overrides will be set dynamically by Grid1Utils.loadQuestion()
                 },
                 cellOverrides: {
                     
                 },
                 cellStyles: {
                     // backgroundColor: 'rgba(255, 255, 255, 0.1)',
                     // border: '2px solid rgba(255, 255, 255, 0.3)',
                     // borderRadius: '8px'
                 },
                 // Special styling for separator row
                 separatorRowStyles: {
                     // borderTop: '3px solid #ffffff',
                     // backgroundColor: '#fff000'
                 },
                 textStyles: {
                     fontSize: '400gc',
                     fontWeight: 'bold',
                     color: '#ffffff',
                     textAlign: 'center',
                     verticalAlign: 'middle',
                     fontFamily: 'Arial, sans-serif'
                 },
                 // Addition problem configuration
                 currentQuestionIndex: 0,
                 questionData: null, // Will be populated from QUESTIONS array
                 showSeparatorLine: true, // Flag to control separator line visibility
                 // Animation configuration for page 10
                 animateOnLoad: false, // Enable animation on page load
                 animationDelay: 500, // Delay in milliseconds
                 animationDuration: 2000, // Animation duration in milliseconds
                 animationEasing: 'easeOutQuad', // Animation easing
                 targetPosition: [30, 40] // Target position to animate to - should move left
             }
         },
         {
             name: 'next-button',
             ...StandardPositions.nextButton
         },
         {
             name: 'previous-button',
             ...StandardPositions.previousButton
         },
         {
             name: 'grid2',
             type: 'grid',
             coordinates: [18, 65], // Position to the right of Grid1 (row 35, column 80)
             zIndex: 401,
             props: {
                 gridStructure: {
                     columns: 5,    // Dynamic based on question
                     rows: 8        // Dynamic based on question
                 },
                 defaultCellSize: {
                     rows: 6,    // Same as Grid1
                     columns: 8  // Same as Grid1's R1C2 width
                 },
                 columnOverrides: {
                     // Will be set dynamically by Grid2Utils
                 },
                 rowOverrides: {
                     // Will be set dynamically by Grid2Utils
                 },
                 cellOverrides: {
                     // Page 10 specific cell overrides for tenscarry borders
                     // Will be set dynamically based on number of digits by loadQuestion function
                 },
                 cellStyles: {
                    //  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    //  border: '1px solid rgba(255, 255, 255, 0.5)',
                    //  borderRadius: '4px'
                 },
                 // Special styling for separator row
                 separatorRowStyles: {
                    //  borderTop: '2px solid #ffffff',
                    //  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                 },
                 textStyles: {
                     fontSize: '400gc',  // Same as Grid1
                     fontWeight: 'bold',
                     color: '#ffffff',
                     textAlign: 'center',
                     verticalAlign: 'middle',
                     fontFamily: 'Arial, sans-serif'
                 },
                 // Addition problem configuration
                 currentQuestionIndex: 0,
                 questionData: null, // Will be populated from QUESTIONS array
                 showSeparatorLine: true, // Flag to control separator line visibility
                 // Grid2-specific properties
                 isGrid2: true, // Flag to identify this as Grid2
                 dynamicDimensions: true, // Enable dynamic sizing
                 showCarryRow: true, // Show carry calculations
                 showAdditionalAnswerRow: true, // Show additional answer row if needed
                 // Animation configuration for page 10
                 animateOnLoad: true, // Enable animation on page load
                 animationDelay: 1000, // Delay after grid1 animation
                 animationDuration: 800, // Animation duration in milliseconds
                 animationEasing: 'easeOutQuad', // Animation easing
                 targetPosition: [35, 80] // Target position to animate to (row 35, column 80)
             }
         }
     ],

     // Page 11 - Replica of page 10 with quiz modal
     11: [
         {
             name: 'character',
             ...StandardPositions.character,
             // Override or extend specific props if needed
             props: {
                 ...StandardPositions.character.props,
                 src: 'assets/character_excited.png',
                 alt: 'Excited Character'
             }
         },
         {
             name: 'dialog-bubble',
             ...StandardPositions.dialogBubble,
             props: {
                 ...StandardPositions.dialogBubble.props,
                 get text() {
                     // Use i18n system for dialog text
                     return typeof i18n !== 'undefined' ? i18n.t('dialogs.page11.dialogtext') : 'Welcome to Page 11! This is the Quiz page.';
                 },
                 get options() {
                     return GridCellFontUtils.processGcStyles({
                         fontSize: '300gc',
                         lineHeight: '1400gc',
                         textAlign: "left",
                         textJustify: "auto",
                         backgroundColor: "#ffffff",
                         textColor: "#000000",
                         borderRadius: '75gc',
                         padding: '50gc',
                         showTail: true,
                         tailBorder: "bottom",
                         tailPlacement: "middle",
                         tailDirection: "south"
                     });
                 }
             }
         },
         {
             name: 'container1',
             ...StandardPositions.container1
         },
         {
             name: 'container2',
             ...StandardPositions.container2
         },
         {
             name: 'instruction-header',
             ...StandardPositions.instructionHeader
         },
         {
             name: 'question-dropdown',
             ...StandardPositions.questionDropdown
         },
         {
             name: 'grid1',
             type: 'grid',
             coordinates: [30, 40], // Start below target position for animation
             zIndex: 400,
             props: {
                 gridStructure: {
                     columns: 2,
                     rows: 4  // Dynamic based on question
                 },
                 defaultCellSize: {
                     rows: 6,    // Default: 6 rows height
                     columns: 6  // Default: 6 columns width
                 },
                 columnOverrides: {
                     'col1': { rows: 6, columns: 4 }, // Column 1 uses 4 columns width
                     'col2': { rows: 6, columns: 8 } // Column 2 uses 8 columns width
                 },
                 rowOverrides: {
                     // Row overrides will be set dynamically by Grid1Utils.loadQuestion()
                 },
                 cellOverrides: {
                     
                 },
                 cellStyles: {
                     // backgroundColor: 'rgba(255, 255, 255, 0.1)',
                     // border: '2px solid rgba(255, 255, 255, 0.3)',
                     // borderRadius: '8px'
                 },
                 // Special styling for separator row
                 separatorRowStyles: {
                     // borderTop: '3px solid #ffffff',
                     // backgroundColor: '#fff000'
                 },
                 textStyles: {
                     fontSize: '400gc',
                     fontWeight: 'bold',
                     color: '#ffffff',
                     textAlign: 'center',
                     verticalAlign: 'middle',
                     fontFamily: 'Arial, sans-serif'
                 },
                 // Addition problem configuration
                 currentQuestionIndex: 0,
                 questionData: null, // Will be populated from QUESTIONS array
                 showSeparatorLine: true, // Flag to control separator line visibility
                 // Animation configuration for page 11
                 animateOnLoad: false, // Enable animation on page load
                 animationDelay: 500, // Delay in milliseconds
                 animationDuration: 2000, // Animation duration in milliseconds
                 animationEasing: 'easeOutQuad', // Animation easing
                 targetPosition: [30, 40] // Target position to animate to - should move left
             }
         },
         {
             name: 'next-button',
             ...StandardPositions.nextButton
         },
         {
             name: 'previous-button',
             ...StandardPositions.previousButton
         },
         {
             name: 'grid2',
             type: 'grid',
             coordinates: [18, 65], // Position to the right of Grid1 (row 35, column 80)
             zIndex: 401,
             props: {
                 gridStructure: {
                     columns: 5,    // Dynamic based on question
                     rows: 8        // Dynamic based on question
                 },
                 defaultCellSize: {
                     rows: 6,    // Same as Grid1
                     columns: 8  // Same as Grid1's R1C2 width
                 },
                 columnOverrides: {
                     // Will be set dynamically by Grid2Utils
                 },
                 rowOverrides: {
                     // Will be set dynamically by Grid2Utils
                 },
                 cellOverrides: {
                     // Page 11 specific cell overrides for tenscarry borders
                     // Will be set dynamically based on number of digits by loadQuestion function
                 },
                 cellStyles: {
                    //  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    //  border: '1px solid rgba(255, 255, 255, 0.5)',
                    //  borderRadius: '4px'
                 },
                 // Special styling for separator row
                 separatorRowStyles: {
                    //  borderTop: '2px solid #ffffff',
                    //  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                 },
                 textStyles: {
                     fontSize: '400gc',  // Same as Grid1
                     fontWeight: 'bold',
                     color: '#ffffff',
                     textAlign: 'center',
                     verticalAlign: 'middle',
                     fontFamily: 'Arial, sans-serif'
                 },
                 // Addition problem configuration
                 currentQuestionIndex: 0,
                 questionData: null, // Will be populated from QUESTIONS array
                 showSeparatorLine: true, // Flag to control separator line visibility
                 // Grid2-specific properties
                 isGrid2: true, // Flag to identify this as Grid2
                 dynamicDimensions: true, // Enable dynamic sizing
                 showCarryRow: true, // Show carry calculations
                 showAdditionalAnswerRow: true, // Show additional answer row if needed
                 // Animation configuration for page 11
                 animateOnLoad: true, // Enable animation on page load
                 animationDelay: 1000, // Delay after grid1 animation
                 animationDuration: 800, // Animation duration in milliseconds
                 animationEasing: 'easeOutQuad', // Animation easing
                 targetPosition: [35, 80] // Target position to animate to (row 35, column 80)
             }
         },
         {
             name: 'quizModal',
             ...StandardPositions.quizModal
         }
     ],
     
     // Page 12 - Exact replica of page 10
     12: [
         {
             name: 'character',
             ...StandardPositions.character,
             // Override or extend specific props if needed
             props: {
                 ...StandardPositions.character.props,
                 src: 'assets/character_excited.png',
                 alt: 'Excited Character'
             }
         },
         {
             name: 'dialog-bubble',
             ...StandardPositions.dialogBubble,
             props: {
                 ...StandardPositions.dialogBubble.props,
                 get text() {
                     // Use i18n system for dialog text
                     return typeof i18n !== 'undefined' ? i18n.t('dialogs.page12.dialogtext') : 'Welcome to Page 12! This is an exact replica of Page 10.';
                 },
                 get options() {
                     return GridCellFontUtils.processGcStyles({
                         fontSize: '300gc',
                         lineHeight: '1400gc',
                         textAlign: "left",
                         textJustify: "auto",
                         backgroundColor: "#ffffff",
                         textColor: "#000000",
                         borderRadius: '75gc',
                         padding: '50gc',
                         showTail: true,
                         tailBorder: "bottom",
                         tailPlacement: "middle",
                         tailDirection: "south"
                     });
                 }
             }
         },
         {
             name: 'container1',
             ...StandardPositions.container1
         },
         {
             name: 'container2',
             ...StandardPositions.container2
         },
         {
             name: 'instruction-header',
             ...StandardPositions.instructionHeader
         },
         {
             name: 'question-dropdown',
             ...StandardPositions.questionDropdown
         },
         {
             name: 'grid1',
             type: 'grid',
             coordinates: [30, 40], // Start below target position for animation
             zIndex: 400,
             props: {
                 gridStructure: {
                     columns: 2,
                     rows: 4  // Dynamic based on question
                 },
                 defaultCellSize: {
                     rows: 6,    // Default: 6 rows height
                     columns: 6  // Default: 6 columns width
                 },
                 columnOverrides: {
                     'col1': { rows: 6, columns: 4 }, // Column 1 uses 4 columns width
                     'col2': { rows: 6, columns: 8 } // Column 2 uses 8 columns width
                 },
                 rowOverrides: {
                     // Row overrides will be set dynamically by Grid1Utils.loadQuestion()
                 },
                 cellOverrides: {
                     
                 },
                 cellStyles: {
                     // backgroundColor: 'rgba(255, 255, 255, 0.1)',
                     // border: '2px solid rgba(255, 255, 255, 0.3)',
                     // borderRadius: '8px'
                 },
                 // Special styling for separator row
                 separatorRowStyles: {
                     // borderTop: '3px solid #ffffff',
                     // backgroundColor: '#fff000'
                 },
                 textStyles: {
                     fontSize: '400gc',
                     fontWeight: 'bold',
                     color: '#ffffff',
                     textAlign: 'center',
                     verticalAlign: 'middle',
                     fontFamily: 'Arial, sans-serif'
                 },
                 // Addition problem configuration
                 currentQuestionIndex: 0,
                 questionData: null, // Will be populated from QUESTIONS array
                 showSeparatorLine: true, // Flag to control separator line visibility
                 // Animation configuration for page 12
                 animateOnLoad: false, // Enable animation on page load
                 animationDelay: 500, // Delay in milliseconds
                 animationDuration: 2000, // Animation duration in milliseconds
                 animationEasing: 'easeOutQuad', // Animation easing
                 targetPosition: [30, 40] // Target position to animate to - should move left
             }
         },
         {
             name: 'next-button',
             ...StandardPositions.nextButton
         },
         {
             name: 'previous-button',
             ...StandardPositions.previousButton
         },
         {
             name: 'grid2',
             type: 'grid',
             coordinates: [18, 65], // Position to the right of Grid1 (row 35, column 80)
             zIndex: 401,
             props: {
                 gridStructure: {
                     columns: 5,    // Dynamic based on question
                     rows: 8        // Dynamic based on question
                 },
                 defaultCellSize: {
                     rows: 6,    // Same as Grid1
                     columns: 8  // Same as Grid1's R1C2 width
                 },
                 columnOverrides: {
                     // Will be set dynamically by Grid2Utils
                 },
                 rowOverrides: {
                     // Will be set dynamically by Grid2Utils
                 },
                 cellOverrides: {
                     // Page 12 specific cell overrides for tenscarry borders
                     // Will be set dynamically based on number of digits by loadQuestion function
                 },
                 cellStyles: {
                    //  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    //  border: '1px solid rgba(255, 255, 255, 0.5)',
                    //  borderRadius: '4px'
                 },
                 // Special styling for separator row
                 separatorRowStyles: {
                    //  borderTop: '2px solid #ffffff',
                    //  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                 },
                 textStyles: {
                     fontSize: '400gc',  // Same as Grid1
                     fontWeight: 'bold',
                     color: '#ffffff',
                     textAlign: 'center',
                     verticalAlign: 'middle',
                     fontFamily: 'Arial, sans-serif'
                 },
                 // Addition problem configuration
                 currentQuestionIndex: 0,
                 questionData: null, // Will be populated from QUESTIONS array
                 showSeparatorLine: true, // Flag to control separator line visibility
                 // Grid2-specific properties
                 isGrid2: true, // Flag to identify this as Grid2
                 dynamicDimensions: true, // Enable dynamic sizing
                 showCarryRow: true, // Show carry calculations
                 showAdditionalAnswerRow: true, // Show additional answer row if needed
                 // Animation configuration for page 12
                 animateOnLoad: true, // Enable animation on page load
                 animationDelay: 1000, // Delay after grid1 animation
                 animationDuration: 800, // Animation duration in milliseconds
                 animationEasing: 'easeOutQuad', // Animation easing
                 targetPosition: [35, 80] // Target position to animate to (row 35, column 80)
             }
         }
     ],
     
     // Page 13 - Exact replica of page 12 with quiz modal
     13: [
         {
             name: 'character',
             ...StandardPositions.character,
             // Override or extend specific props if needed
             props: {
                 ...StandardPositions.character.props,
                 src: 'assets/character_excited.png',
                 alt: 'Excited Character'
             }
         },
         {
             name: 'dialog-bubble',
             ...StandardPositions.dialogBubble,
             props: {
                 ...StandardPositions.dialogBubble.props,
                 get text() {
                     // Use i18n system for dialog text
                     return typeof i18n !== 'undefined' ? i18n.t('dialogs.page13.dialogtext') : 'Welcome to Page 13! This is an exact replica of Page 12 with a quiz modal.';
                 },
                 get options() {
                     return GridCellFontUtils.processGcStyles({
                         fontSize: '300gc',
                         lineHeight: '1400gc',
                         textAlign: "left",
                         textJustify: "auto",
                         backgroundColor: "#ffffff",
                         textColor: "#000000",
                         borderRadius: '75gc',
                         padding: '50gc',
                         showTail: true,
                         tailBorder: "bottom",
                         tailPlacement: "middle",
                         tailDirection: "south"
                     });
                 }
             }
         },
         {
             name: 'container1',
             ...StandardPositions.container1
         },
         {
             name: 'container2',
             ...StandardPositions.container2
         },
         {
             name: 'instruction-header',
             ...StandardPositions.instructionHeader
         },
         {
             name: 'question-dropdown',
             ...StandardPositions.questionDropdown
         },
         {
             name: 'grid1',
             type: 'grid',
             coordinates: [30, 40], // Start below target position for animation
             zIndex: 400,
             props: {
                 gridStructure: {
                     columns: 2,
                     rows: 4  // Dynamic based on question
                 },
                 defaultCellSize: {
                     rows: 6,    // Default: 6 rows height
                     columns: 6  // Default: 6 columns width
                 },
                 columnOverrides: {
                     'col1': { rows: 6, columns: 4 }, // Column 1 uses 4 columns width
                     'col2': { rows: 6, columns: 8 } // Column 2 uses 8 columns width
                 },
                 rowOverrides: {
                     // Row overrides will be set dynamically by Grid1Utils.loadQuestion()
                 },
                 cellOverrides: {
                     
                 },
                 cellStyles: {
                     // backgroundColor: 'rgba(255, 255, 255, 0.1)',
                     // border: '2px solid rgba(255, 255, 255, 0.3)',
                     // borderRadius: '8px'
                 },
                 // Special styling for separator row
                 separatorRowStyles: {
                     // borderTop: '3px solid #ffffff',
                     // backgroundColor: '#fff000'
                 },
                 textStyles: {
                     fontSize: '400gc',
                     fontWeight: 'bold',
                     color: '#ffffff',
                     textAlign: 'center',
                     verticalAlign: 'middle',
                     fontFamily: 'Arial, sans-serif'
                 },
                 // Addition problem configuration
                 currentQuestionIndex: 0,
                 questionData: null, // Will be populated from QUESTIONS array
                 showSeparatorLine: true, // Flag to control separator line visibility
                 // Animation configuration for page 13
                 animateOnLoad: false, // Enable animation on page load
                 animationDelay: 500, // Delay in milliseconds
                 animationDuration: 2000, // Animation duration in milliseconds
                 animationEasing: 'easeOutQuad', // Animation easing
                 targetPosition: [30, 40] // Target position to animate to - should move left
             }
         },
         {
             name: 'next-button',
             ...StandardPositions.nextButton
         },
         {
             name: 'previous-button',
             ...StandardPositions.previousButton
         },
         {
             name: 'grid2',
             type: 'grid',
             coordinates: [18, 65], // Position to the right of Grid1 (row 35, column 80)
             zIndex: 401,
             props: {
                 gridStructure: {
                     columns: 5,    // Dynamic based on question
                     rows: 8        // Dynamic based on question
                 },
                 defaultCellSize: {
                     rows: 6,    // Same as Grid1
                     columns: 8  // Same as Grid1's R1C2 width
                 },
                 columnOverrides: {
                     // Will be set dynamically by Grid2Utils
                 },
                 rowOverrides: {
                     // Will be set dynamically by Grid2Utils
                 },
                 cellOverrides: {
                     // Page 13 specific cell overrides for tenscarry borders
                     // Will be set dynamically based on number of digits by loadQuestion function
                 },
                 cellStyles: {
                    //  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    //  border: '1px solid rgba(255, 255, 255, 0.5)',
                    //  borderRadius: '4px'
                 },
                 // Special styling for separator row
                 separatorRowStyles: {
                    //  borderTop: '2px solid #ffffff',
                    //  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                 },
                 textStyles: {
                     fontSize: '400gc',  // Same as Grid1
                     fontWeight: 'bold',
                     color: '#ffffff',
                     textAlign: 'center',
                     verticalAlign: 'middle',
                     fontFamily: 'Arial, sans-serif'
                 },
                 // Addition problem configuration
                 currentQuestionIndex: 0,
                 questionData: null, // Will be populated from QUESTIONS array
                 showSeparatorLine: true, // Flag to control separator line visibility
                 // Grid2-specific properties
                 isGrid2: true, // Flag to identify this as Grid2
                 dynamicDimensions: true, // Enable dynamic sizing
                 showCarryRow: true, // Show carry calculations
                 showAdditionalAnswerRow: true, // Show additional answer row if needed
                 // Animation configuration for page 13
                 animateOnLoad: true, // Enable animation on page load
                 animationDelay: 1000, // Delay after grid1 animation
                 animationDuration: 800, // Animation duration in milliseconds
                 animationEasing: 'easeOutQuad', // Animation easing
                 targetPosition: [35, 80] // Target position to animate to (row 35, column 80)
             }
         }
     ],
     
     // Page 14 - Exact replica of page 12 (no quiz modal)
     14: [
         {
             name: 'character',
             ...StandardPositions.character,
             // Override or extend specific props if needed
             props: {
                 ...StandardPositions.character.props,
                 src: 'assets/character_excited.png',
                 alt: 'Excited Character'
             }
         },
         {
             name: 'dialog-bubble',
             ...StandardPositions.dialogBubble,
             props: {
                 ...StandardPositions.dialogBubble.props,
                 get text() {
                     // Dynamic text for page 14 - show tens digit calculation with carry
                     const currentQuestion = Grid1Utils.getCurrentQuestion();
                     if (currentQuestion) {
                         const tensDigitSum = Math.floor(currentQuestion.first_number / 10) % 10 + Math.floor(currentQuestion.second_number / 10) % 10 + 
                                            (currentQuestion.third_number ? Math.floor(currentQuestion.third_number / 10) % 10 : 0);
                         
                         // Calculate carry from ones column
                         const onesDigitSum = currentQuestion.first_number % 10 + currentQuestion.second_number % 10 + 
                                            (currentQuestion.third_number ? currentQuestion.third_number % 10 : 0);
                         const tensCarry = Math.floor(onesDigitSum / 10);
                         
                         const result = (tensDigitSum+ tensCarry) * 10;
                         return i18n.t('dialogs.page14.splitCorrectly', { value: result });
                     }
                     // Fallback to i18n system
                     return typeof i18n !== 'undefined' ? i18n.t('dialogs.page14.dialogtext') : 'We have split correctly.';
                 },
                 get options() {
                     return GridCellFontUtils.processGcStyles({
                         fontSize: '300gc',
                         lineHeight: '1400gc',
                         textAlign: "left",
                         textJustify: "auto",
                         backgroundColor: "#ffffff",
                         textColor: "#000000",
                         borderRadius: '75gc',
                         padding: '50gc',
                         showTail: true,
                         tailBorder: "bottom",
                         tailPlacement: "middle",
                         tailDirection: "south"
                     });
                 }
             }
         },
         {
             name: 'container1',
             ...StandardPositions.container1
         },
         {
             name: 'container2',
             ...StandardPositions.container2
         },
         {
             name: 'instruction-header',
             ...StandardPositions.instructionHeader,
             props: {
                 ...StandardPositions.instructionHeader.props,
                 get text() {
                return typeof i18n !== 'undefined' ? i18n.t('dialogs.instructions.clickCarryOver') : 'Click on Carry Over';
            }
             }
         },
         {
             name: 'question-dropdown',
             ...StandardPositions.questionDropdown
         },
         {
             name: 'grid1',
             type: 'grid',
             coordinates: [30, 40], // Start below target position for animation
             zIndex: 400,
             props: {
                 gridStructure: {
                     columns: 2,
                     rows: 4  // Dynamic based on question
                 },
                 defaultCellSize: {
                     rows: 6,    // Default: 6 rows height
                     columns: 6  // Default: 6 columns width
                 },
                 columnOverrides: {
                     'col1': { rows: 6, columns: 4 }, // Column 1 uses 4 columns width
                     'col2': { rows: 6, columns: 8 } // Column 2 uses 8 columns width
                 },
                 rowOverrides: {
                     // Row overrides will be set dynamically by Grid1Utils.loadQuestion()
                 },
                 cellOverrides: {
                     
                 },
                 cellStyles: {
                     // backgroundColor: 'rgba(255, 255, 255, 0.1)',
                     // border: '2px solid rgba(255, 255, 255, 0.3)',
                     // borderRadius: '8px'
                 },
                 // Special styling for separator row
                 separatorRowStyles: {
                     // borderTop: '3px solid #ffffff',
                     // backgroundColor: '#fff000'
                 },
                 textStyles: {
                     fontSize: '400gc',
                     fontWeight: 'bold',
                     color: '#ffffff',
                     textAlign: 'center',
                     verticalAlign: 'middle',
                     fontFamily: 'Arial, sans-serif'
                 },
                 // Addition problem configuration
                 currentQuestionIndex: 0,
                 questionData: null, // Will be populated from QUESTIONS array
                 showSeparatorLine: true, // Flag to control separator line visibility
                 // Animation configuration for page 14
                 animateOnLoad: false, // Enable animation on page load
                 animationDelay: 500, // Delay in milliseconds
                 animationDuration: 2000, // Animation duration in milliseconds
                 animationEasing: 'easeOutQuad', // Animation easing
                 targetPosition: [30, 40] // Target position to animate to - should move left
             }
         },
         {
             name: 'next-button',
             ...StandardPositions.nextButton
         },
         {
             name: 'previous-button',
             ...StandardPositions.previousButton
         },
         {
             name: 'grid2',
             type: 'grid',
             coordinates: [18, 65], // Position to the right of Grid1 (row 35, column 80)
             zIndex: 401,
             props: {
                 gridStructure: {
                     columns: 5,    // Dynamic based on question
                     rows: 8        // Dynamic based on question
                 },
                 defaultCellSize: {
                     rows: 6,    // Same as Grid1
                     columns: 8  // Same as Grid1's R1C2 width
                 },
                 columnOverrides: {
                     // Will be set dynamically by Grid2Utils
                 },
                 rowOverrides: {
                     // Will be set dynamically by Grid2Utils
                 },
                 cellOverrides: {
                     // Page 14 specific cell overrides for tenscarry borders
                     // Will be set dynamically based on number of digits by loadQuestion function
                 },
                 cellStyles: {
                    //  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    //  border: '1px solid rgba(255, 255, 255, 0.5)',
                    //  borderRadius: '4px'
                 },
                 // Special styling for separator row
                 separatorRowStyles: {
                    //  borderTop: '2px solid #ffffff',
                    //  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                 },
                 textStyles: {
                     fontSize: '400gc',  // Same as Grid1
                     fontWeight: 'bold',
                     color: '#ffffff',
                     textAlign: 'center',
                     verticalAlign: 'middle',
                     fontFamily: 'Arial, sans-serif'
                 },
                 // Addition problem configuration
                 currentQuestionIndex: 0,
                 questionData: null, // Will be populated from QUESTIONS array
                 showSeparatorLine: true, // Flag to control separator line visibility
                 // Grid2-specific properties
                 isGrid2: true, // Flag to identify this as Grid2
                 dynamicDimensions: true, // Enable dynamic sizing
                 showCarryRow: true, // Show carry calculations
                 showAdditionalAnswerRow: true, // Show additional answer row if needed
                 // Animation configuration for page 14
                 animateOnLoad: true, // Enable animation on page load
                 animationDelay: 1000, // Delay after grid1 animation
                 animationDuration: 800, // Animation duration in milliseconds
                 animationEasing: 'easeOutQuad', // Animation easing
                 targetPosition: [35, 80] // Target position to animate to (row 35, column 80)
             }
         }
     ],
     
     // Page 15 - Exact replica of page 12 (no quiz modal)
     15: [
         {
             name: 'character',
             ...StandardPositions.character,
             // Override or extend specific props if needed
             props: {
                 ...StandardPositions.character.props,
                 src: 'assets/character_excited.png',
                 alt: 'Excited Character'
             }
         },
         {
             name: 'dialog-bubble',
             ...StandardPositions.dialogBubble,
             props: {
                 ...StandardPositions.dialogBubble.props,
                 get text() {
                     // Use i18n system for dialog text
                     return typeof i18n !== 'undefined' ? i18n.t('dialogs.page15.dialogtext') : 'Welcome to Page 15! This is an exact replica of Page 12.';
                 },
                 get options() {
                     return GridCellFontUtils.processGcStyles({
                         fontSize: '300gc',
                         lineHeight: '1400gc',
                         textAlign: "left",
                         textJustify: "auto",
                         backgroundColor: "#ffffff",
                         textColor: "#000000",
                         borderRadius: '75gc',
                         padding: '50gc',
                         showTail: true,
                         tailBorder: "bottom",
                         tailPlacement: "middle",
                         tailDirection: "south"
                     });
                 }
             }
         },
         {
             name: 'container1',
             ...StandardPositions.container1
         },
         {
             name: 'container2',
             ...StandardPositions.container2
         },
         {
             name: 'instruction-header',
             ...StandardPositions.instructionHeader
         },
         {
             name: 'question-dropdown',
             ...StandardPositions.questionDropdown
         },
         {
             name: 'grid1',
             type: 'grid',
             coordinates: [30, 40], // Start below target position for animation
             zIndex: 400,
             props: {
                 gridStructure: {
                     columns: 2,
                     rows: 4  // Dynamic based on question
                 },
                 defaultCellSize: {
                     rows: 6,    // Default: 6 rows height
                     columns: 6  // Default: 6 columns width
                 },
                 columnOverrides: {
                     'col1': { rows: 6, columns: 4 }, // Column 1 uses 4 columns width
                     'col2': { rows: 6, columns: 8 } // Column 2 uses 8 columns width
                 },
                 rowOverrides: {
                     // Row overrides will be set dynamically by Grid1Utils.loadQuestion()
                 },
                 cellOverrides: {
                     
                 },
                 cellStyles: {
                     // backgroundColor: 'rgba(255, 255, 255, 0.1)',
                     // border: '2px solid rgba(255, 255, 255, 0.3)',
                     // borderRadius: '8px'
                 },
                 // Special styling for separator row
                 separatorRowStyles: {
                     // borderTop: '3px solid #ffffff',
                     // backgroundColor: '#fff000'
                 },
                 textStyles: {
                     fontSize: '400gc',
                     fontWeight: 'bold',
                     color: '#ffffff',
                     textAlign: 'center',
                     verticalAlign: 'middle',
                     fontFamily: 'Arial, sans-serif'
                 },
                 // Addition problem configuration
                 currentQuestionIndex: 0,
                 questionData: null, // Will be populated from QUESTIONS array
                 showSeparatorLine: true, // Flag to control separator line visibility
                 // Animation configuration for page 15
                 animateOnLoad: false, // Enable animation on page load
                 animationDelay: 500, // Delay in milliseconds
                 animationDuration: 2000, // Animation duration in milliseconds
                 animationEasing: 'easeOutQuad', // Animation easing
                 targetPosition: [30, 40] // Target position to animate to - should move left
             }
         },
         {
             name: 'next-button',
             ...StandardPositions.nextButton
         },
         {
             name: 'previous-button',
             ...StandardPositions.previousButton
         },
         {
             name: 'grid2',
             type: 'grid',
             coordinates: [18, 65], // Position to the right of Grid1 (row 35, column 80)
             zIndex: 401,
             props: {
                 gridStructure: {
                     columns: 5,    // Dynamic based on question
                     rows: 8        // Dynamic based on question
                 },
                 defaultCellSize: {
                     rows: 6,    // Same as Grid1
                     columns: 8  // Same as Grid1's R1C2 width
                 },
                 columnOverrides: {
                     // Will be set dynamically by Grid2Utils
                 },
                 rowOverrides: {
                     // Will be set dynamically by Grid2Utils
                 },
                 cellOverrides: {
                     // Page 15 specific cell overrides for tenscarry borders
                     // Will be set dynamically based on number of digits by loadQuestion function
                 },
                 cellStyles: {
                    //  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    //  border: '1px solid rgba(255, 255, 255, 0.5)',
                    //  borderRadius: '4px'
                 },
                 // Special styling for separator row
                 separatorRowStyles: {
                    //  borderTop: '2px solid #ffffff',
                    //  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                 },
                 textStyles: {
                     fontSize: '400gc',  // Same as Grid1
                     fontWeight: 'bold',
                     color: '#ffffff',
                     textAlign: 'center',
                     verticalAlign: 'middle',
                     fontFamily: 'Arial, sans-serif'
                 },
                 // Addition problem configuration
                 currentQuestionIndex: 0,
                 questionData: null, // Will be populated from QUESTIONS array
                 showSeparatorLine: true, // Flag to control separator line visibility
                 // Grid2-specific properties
                 isGrid2: true, // Flag to identify this as Grid2
                 dynamicDimensions: true, // Enable dynamic sizing
                 showCarryRow: true, // Show carry calculations
                 showAdditionalAnswerRow: true, // Show additional answer row if needed
                 // Animation configuration for page 15
                 animateOnLoad: true, // Enable animation on page load
                 animationDelay: 1000, // Delay after grid1 animation
                 animationDuration: 800, // Animation duration in milliseconds
                 animationEasing: 'easeOutQuad', // Animation easing
                 targetPosition: [35, 80] // Target position to animate to (row 35, column 80)
             }
         }
     ],
     
     // Page 16 - Exact replica of page 15 (same as page 15)
     16: [
         {
             name: 'character',
             ...StandardPositions.character,
             // Override or extend specific props if needed
             props: {
                 ...StandardPositions.character.props,
                 src: 'assets/character_excited.png',
                 alt: 'Excited Character'
             }
         },
         {
             name: 'dialog-bubble',
             ...StandardPositions.dialogBubble,
             props: {
                 ...StandardPositions.dialogBubble.props,
                 get text() {
                     // Use i18n system for dialog text
                     return typeof i18n !== 'undefined' ? i18n.t('dialogs.page16.dialogtext') : 'Welcome to Page 16! This is an exact replica of Page 15.';
                 },
                 get options() {
                     return GridCellFontUtils.processGcStyles({
                         fontSize: '300gc',
                         lineHeight: '1400gc',
                         textAlign: "left",
                         textJustify: "auto",
                         backgroundColor: "#ffffff",
                         textColor: "#000000",
                         borderRadius: '75gc',
                         padding: '50gc',
                         showTail: true,
                         tailBorder: "bottom",
                         tailPlacement: "middle",
                         tailDirection: "south"
                     });
                 }
             }
         },
         {
             name: 'container1',
             ...StandardPositions.container1
         },
         {
             name: 'container2',
             ...StandardPositions.container2
         },
         {
             name: 'instruction-header',
             ...StandardPositions.instructionHeader,
             props: {
                 ...StandardPositions.instructionHeader.props,
                 get text() {
                return typeof i18n !== 'undefined' ? i18n.t('dialogs.instructions.tapPlusSign') : 'Tap on the plus sign.';
            }
             }
         },
         {
             name: 'question-dropdown',
             ...StandardPositions.questionDropdown
         },
         {
             name: 'grid1',
             type: 'grid',
             coordinates: [30, 40], // Start below target position for animation
             zIndex: 400,
             props: {
                 gridStructure: {
                     columns: 2,
                     rows: 4  // Dynamic based on question
                 },
                 defaultCellSize: {
                     rows: 6,    // Default: 6 rows height
                     columns: 6  // Default: 6 columns width
                 },
                 columnOverrides: {
                     'col1': { rows: 6, columns: 4 }, // Column 1 uses 4 columns width
                     'col2': { rows: 6, columns: 8 } // Column 2 uses 8 columns width
                 },
                 rowOverrides: {
                     // Row overrides will be set dynamically by Grid1Utils.loadQuestion()
                 },
                 cellOverrides: {
                     
                 },
                 cellStyles: {
                     // backgroundColor: 'rgba(255, 255, 255, 0.1)',
                     // border: '2px solid rgba(255, 255, 255, 0.3)',
                     // borderRadius: '8px'
                 },
                 // Special styling for separator row
                 separatorRowStyles: {
                     // borderTop: '3px solid #ffffff',
                     // backgroundColor: '#fff000'
                 },
                 textStyles: {
                     fontSize: '400gc',
                     fontWeight: 'bold',
                     color: '#ffffff',
                     textAlign: 'center',
                     verticalAlign: 'middle',
                     fontFamily: 'Arial, sans-serif'
                 },
                 // Addition problem configuration
                 currentQuestionIndex: 0,
                 questionData: null, // Will be populated from QUESTIONS array
                 showSeparatorLine: true, // Flag to control separator line visibility
                 // Animation configuration for page 16
                 animateOnLoad: false, // Enable animation on page load
                 animationDelay: 500, // Delay in milliseconds
                 animationDuration: 2000, // Animation duration in milliseconds
                 animationEasing: 'easeOutQuad', // Animation easing
                 targetPosition: [30, 40] // Target position to animate to - should move left
             }
         },
         {
             name: 'next-button',
             ...StandardPositions.nextButton
         },
         {
             name: 'previous-button',
             ...StandardPositions.previousButton
         },
         {
             name: 'grid2',
             type: 'grid',
             coordinates: [18, 65], // Position to the right of Grid1 (row 35, column 80)
             zIndex: 401,
             props: {
                 gridStructure: {
                     columns: 5,    // Dynamic based on question
                     rows: 8        // Dynamic based on question
                 },
                 defaultCellSize: {
                     rows: 6,    // Same as Grid1
                     columns: 8  // Same as Grid1's R1C2 width
                 },
                 columnOverrides: {
                     // Will be set dynamically by Grid2Utils
                 },
                 rowOverrides: {
                     // Will be set dynamically by Grid2Utils
                 },
                 cellOverrides: {
                     // Page 16 specific cell overrides for tenscarry borders
                     // Will be set dynamically based on number of digits by loadQuestion function
                 },
                 cellStyles: {
                    //  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    //  border: '1px solid rgba(255, 255, 255, 0.5)',
                    //  borderRadius: '4px'
                 },
                 // Special styling for separator row
                 separatorRowStyles: {
                    //  borderTop: '2px solid #ffffff',
                    //  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                 },
                 textStyles: {
                     fontSize: '400gc',  // Same as Grid1
                     fontWeight: 'bold',
                     color: '#ffffff',
                     textAlign: 'center',
                     verticalAlign: 'middle',
                     fontFamily: 'Arial, sans-serif'
                 },
                 // Addition problem configuration
                 currentQuestionIndex: 0,
                 questionData: null, // Will be populated from QUESTIONS array
                 showSeparatorLine: true, // Flag to control separator line visibility
                 // Grid2-specific properties
                 isGrid2: true, // Flag to identify this as Grid2
                 dynamicDimensions: true, // Enable dynamic sizing
                 showCarryRow: true, // Show carry calculations
                 showAdditionalAnswerRow: true, // Show additional answer row if needed
                 // Animation configuration for page 16
                 animateOnLoad: true, // Enable animation on page load
                 animationDelay: 1000, // Delay after grid1 animation
                 animationDuration: 800, // Animation duration in milliseconds
                 animationEasing: 'easeOutQuad', // Animation easing
                 targetPosition: [35, 80] // Target position to animate to (row 35, column 80)
             }
         }
     ],
     
     // Page 17 - Exact replica of page 16 with quiz modal that opens on load
     17: [
         {
             name: 'character',
             ...StandardPositions.character,
             // Override or extend specific props if needed
             props: {
                 ...StandardPositions.character.props,
                 src: 'assets/character_excited.png',
                 alt: 'Excited Character'
             }
         },
         {
             name: 'dialog-bubble',
             ...StandardPositions.dialogBubble,
             props: {
                 ...StandardPositions.dialogBubble.props,
                 get text() {
                     // Use i18n system for dialog text
                     return typeof i18n !== 'undefined' ? i18n.t('dialogs.page17.dialogtext') : 'Welcome to Page 17! This is an exact replica of Page 16 with a quiz modal that opens on load.';
                 },
                 get options() {
                     return GridCellFontUtils.processGcStyles({
                         fontSize: '300gc',
                         lineHeight: '1400gc',
                         textAlign: "left",
                         textJustify: "auto",
                         backgroundColor: "#ffffff",
                         textColor: "#000000",
                         borderRadius: '75gc',
                         padding: '50gc',
                         showTail: true,
                         tailBorder: "bottom",
                         tailPlacement: "middle",
                         tailDirection: "south"
                     });
                 }
             }
         },
         {
             name: 'container1',
             ...StandardPositions.container1
         },
         {
             name: 'container2',
             ...StandardPositions.container2
         },
         {
             name: 'instruction-header',
             ...StandardPositions.instructionHeader
         },
         {
             name: 'question-dropdown',
             ...StandardPositions.questionDropdown
         },
         {
             name: 'grid1',
             type: 'grid',
             coordinates: [30, 40], // Start below target position for animation
             zIndex: 400,
             props: {
                 gridStructure: {
                     columns: 2,
                     rows: 4  // Dynamic based on question
                 },
                 defaultCellSize: {
                     rows: 6,    // Default: 6 rows height
                     columns: 6  // Default: 6 columns width
                 },
                 columnOverrides: {
                     'col1': { rows: 6, columns: 4 }, // Column 1 uses 4 columns width
                     'col2': { rows: 6, columns: 8 } // Column 2 uses 8 columns width
                 },
                 rowOverrides: {
                     // Row overrides will be set dynamically by Grid1Utils.loadQuestion()
                 },
                 cellOverrides: {
                     
                 },
                 cellStyles: {
                     // backgroundColor: 'rgba(255, 255, 255, 0.1)',
                     // border: '2px solid rgba(255, 255, 255, 0.3)',
                     // borderRadius: '8px'
                 },
                 // Special styling for separator row
                 separatorRowStyles: {
                     // borderTop: '3px solid #ffffff',
                     // backgroundColor: '#fff000'
                 },
                 textStyles: {
                     fontSize: '400gc',
                     fontWeight: 'bold',
                     color: '#ffffff',
                     textAlign: 'center',
                     verticalAlign: 'middle',
                     fontFamily: 'Arial, sans-serif'
                 },
                 // Addition problem configuration
                 currentQuestionIndex: 0,
                 questionData: null, // Will be populated from QUESTIONS array
                 showSeparatorLine: true, // Flag to control separator line visibility
                 // Animation configuration for page 17
                 animateOnLoad: false, // Enable animation on page load
                 animationDelay: 500, // Delay in milliseconds
                 animationDuration: 2000, // Animation duration in milliseconds
                 animationEasing: 'easeOutQuad', // Animation easing
                 targetPosition: [30, 40] // Target position to animate to - should move left
             }
         },
         {
             name: 'next-button',
             ...StandardPositions.nextButton
         },
         {
             name: 'previous-button',
             ...StandardPositions.previousButton
         },
         {
             name: 'grid2',
             type: 'grid',
             coordinates: [18, 65], // Position to the right of Grid1 (row 35, column 80)
             zIndex: 401,
             props: {
                 gridStructure: {
                     columns: 5,    // Dynamic based on question
                     rows: 8        // Dynamic based on question
                 },
                 defaultCellSize: {
                     rows: 6,    // Same as Grid1
                     columns: 8  // Same as Grid1's R1C2 width
                 },
                 columnOverrides: {
                     // Will be set dynamically by Grid2Utils
                 },
                 rowOverrides: {
                     // Will be set dynamically by Grid2Utils
                 },
                 cellOverrides: {
                     // Page 17 specific cell overrides for tenscarry borders
                     // Will be set dynamically based on number of digits by loadQuestion function
                 },
                 cellStyles: {
                    //  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    //  border: '1px solid rgba(255, 255, 255, 0.5)',
                    //  borderRadius: '4px'
                 },
                 // Special styling for separator row
                 separatorRowStyles: {
                    //  borderTop: '2px solid #ffffff',
                    //  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                 },
                 textStyles: {
                     fontSize: '400gc',  // Same as Grid1
                     fontWeight: 'bold',
                     color: '#ffffff',
                     textAlign: 'center',
                     verticalAlign: 'middle',
                     fontFamily: 'Arial, sans-serif'
                 },
                 // Addition problem configuration
                 currentQuestionIndex: 0,
                 questionData: null, // Will be populated from QUESTIONS array
                 showSeparatorLine: true, // Flag to control separator line visibility
                 // Grid2-specific properties
                 isGrid2: true, // Flag to identify this as Grid2
                 dynamicDimensions: true, // Enable dynamic sizing
                 showCarryRow: true, // Show carry calculations
                 showAdditionalAnswerRow: true, // Show additional answer row if needed
                 // Animation configuration for page 17
                 animateOnLoad: true, // Enable animation on page load
                 animationDelay: 1000, // Delay after grid1 animation
                 animationDuration: 800, // Animation duration in milliseconds
                 animationEasing: 'easeOutQuad', // Animation easing
                 targetPosition: [35, 80] // Target position to animate to (row 35, column 80)
             }
         },
         {
             name: 'quizModal',
             ...StandardPositions.quizModal,
             props: {
                 ...StandardPositions.quizModal.props,
                 // Override quiz modal content for page 17 - final assessment
                 headerText: 'Final Assessment',
                 // Dynamic options based on question data
                 correctAnswer: null, // Will be calculated dynamically
                 incorrectAnswer: null, // Will be calculated dynamically
                 get correctFeedback() {
                     return typeof i18n !== 'undefined' ? i18n.t('dialogs.quiz.absolutelyCorrect') : "That's absolutely correct!";
                 },
                 get incorrectFeedback() {
                     return typeof i18n !== 'undefined' ? i18n.t('dialogs.quiz.incorrect') : "No, that's incorrect.\n\nTry again!";
                 },
                 // Custom question text generator
                 getQuestionText: (questionData) => {
                     if (!questionData) return 'Question not loaded';
                     
                     const first = questionData.first_number;
                     const second = questionData.second_number;
                     const third = questionData.third_number;
                     
                     // Check if this is a 3-digit question
                     const maxDigits = Math.max(
                         first.toString().length,
                         second.toString().length,
                         third ? third.toString().length : 0
                     );
                     const numberCount = third ? 3 : 2;
                     
                     if (maxDigits === 3 && numberCount === 3) {
                         // For 3-digit 3-number questions: special format
                         // Calculate hundreds carry (from tens column overflow)
                         const firstTens = Math.floor(first / 10) % 10;
                         const secondTens = Math.floor(second / 10) % 10;
                         const thirdTens = Math.floor(third / 10) % 10;
                         
                         // Calculate ones digit sum and carry
                         const onesSum = (first % 10) + (second % 10) + (third % 10);
                         const tensCarry = Math.floor(onesSum / 10) * 10;
                         
                         // Calculate tens column total
                         const tensTotal = tensCarry + (firstTens * 10) + (secondTens * 10) + (thirdTens * 10);
                         const hundredsCarry = Math.floor(tensTotal / 100) * 100;
                         
                         // Get hundreds digits (all three numbers for 3-digit 3-number questions)
                         const firstHundreds = Math.floor(first / 100) * 100;
                         const secondHundreds = Math.floor(second / 100) * 100;
                         const thirdHundreds = Math.floor(third / 100) * 100;
                         
                         return `${hundredsCarry} + ${firstHundreds} + ${secondHundreds} + ${thirdHundreds} = ?`;
                     } else if (maxDigits === 3 && numberCount === 2) {
                         // For 3-digit 2-number questions: special format (same as 3-number but without third)
                         // Calculate hundreds carry (from tens column overflow)
                         const firstTens = Math.floor(first / 10) % 10;
                         const secondTens = Math.floor(second / 10) % 10;
                         
                         // Calculate ones digit sum and carry
                         const onesSum = (first % 10) + (second % 10);
                         const tensCarry = Math.floor(onesSum / 10) * 10;
                         
                         // Calculate tens column total
                         const tensTotal = tensCarry + (firstTens * 10) + (secondTens * 10);
                         const hundredsCarry = Math.floor(tensTotal / 100) * 100;
                         
                         // Get hundreds digits (both numbers for 3-digit 2-number questions)
                         const firstHundreds = Math.floor(first / 100) * 100;
                         const secondHundreds = Math.floor(second / 100) * 100;
                         
                         return `${hundredsCarry} + ${firstHundreds} + ${secondHundreds} = ?`;
                     } else if (third !== null && third !== undefined) {
                         return `What is ${first} + ${second} + ${third}?`;
                     } else {
                         return `What is ${first} + ${second}?`;
                     }
                 },
                 // Custom answer calculation
                 getCorrectAnswer: (questionData) => {
                     if (!questionData) return 0;
                     
                     const first = questionData.first_number || 0;
                     const second = questionData.second_number || 0;
                     const third = questionData.third_number || 0;
                     
                     // Check if this is a 3-digit question
                     const maxDigits = Math.max(
                         first.toString().length,
                         second.toString().length,
                         third ? third.toString().length : 0
                     );
                     const numberCount = third ? 3 : 2;
                     
                     if (maxDigits === 3 && numberCount === 3) {
                         // For 3-digit 3-number questions: calculate hundreds column sum
                         const firstTens = Math.floor(first / 10) % 10;
                         const secondTens = Math.floor(second / 10) % 10;
                         const thirdTens = Math.floor(third / 10) % 10;
                         
                         // Calculate ones digit sum and carry
                         const onesSum = (first % 10) + (second % 10) + (third % 10);
                         const tensCarry = Math.floor(onesSum / 10) * 10;
                         
                         // Calculate tens column total
                         const tensTotal = tensCarry + (firstTens * 10) + (secondTens * 10) + (thirdTens * 10);
                         const hundredsCarry = Math.floor(tensTotal / 100) * 100;
                         
                         // Get hundreds digits (all three numbers for 3-digit 3-number questions)
                         const firstHundreds = Math.floor(first / 100) * 100;
                         const secondHundreds = Math.floor(second / 100) * 100;
                         const thirdHundreds = Math.floor(third / 100) * 100;
                         
                         return hundredsCarry + firstHundreds + secondHundreds + thirdHundreds;
                     } else if (maxDigits === 3 && numberCount === 2) {
                         // For 3-digit 2-number questions: calculate hundreds column sum
                         const firstTens = Math.floor(first / 10) % 10;
                         const secondTens = Math.floor(second / 10) % 10;
                         
                         // Calculate ones digit sum and carry
                         const onesSum = (first % 10) + (second % 10);
                         const tensCarry = Math.floor(onesSum / 10) * 10;
                         
                         // Calculate tens column total
                         const tensTotal = tensCarry + (firstTens * 10) + (secondTens * 10);
                         const hundredsCarry = Math.floor(tensTotal / 100) * 100;
                         
                         // Get hundreds digits (both numbers for 3-digit 2-number questions)
                         const firstHundreds = Math.floor(first / 100) * 100;
                         const secondHundreds = Math.floor(second / 100) * 100;
                         
                         return hundredsCarry + firstHundreds + secondHundreds;
                     } else {
                         // For other cases: simple sum
                         return first + second + third;
                     }
                 },
                 // Custom incorrect answer generation
                 getIncorrectAnswer: (questionData) => {
                     if (!questionData) return 0;
                     
                     const first = questionData.first_number || 0;
                     const second = questionData.second_number || 0;
                     const third = questionData.third_number || 0;
                     
                     // Check if this is a 3-digit 3-number question
                     const maxDigits = Math.max(
                         first.toString().length,
                         second.toString().length,
                         third ? third.toString().length : 0
                     );
                     const numberCount = third ? 3 : 2;
                     
                     if (maxDigits === 3 && numberCount === 3) {
                         // For 3-digit 3-number questions: use ±100 variations
                         // Calculate the correct answer manually
                         const firstTens = Math.floor(first / 10) % 10;
                         const secondTens = Math.floor(second / 10) % 10;
                         const thirdTens = Math.floor(third / 10) % 10;
                         
                         // Calculate ones digit sum and carry
                         const onesSum = (first % 10) + (second % 10) + (third % 10);
                         const tensCarry = Math.floor(onesSum / 10) * 10;
                         
                         // Calculate tens column total
                         const tensTotal = tensCarry + (firstTens * 10) + (secondTens * 10) + (thirdTens * 10);
                         const hundredsCarry = Math.floor(tensTotal / 100) * 100;
                         
                         // Get hundreds digits (all three numbers for 3-digit 3-number questions)
                         const firstHundreds = Math.floor(first / 100) * 100;
                         const secondHundreds = Math.floor(second / 100) * 100;
                         const thirdHundreds = Math.floor(third / 100) * 100;
                         
                         const correctAnswer = hundredsCarry + firstHundreds + secondHundreds + thirdHundreds;
                         return [correctAnswer + 100, correctAnswer - 100];
                     } else {
                         // For other cases: generate multiple variations
                         const correctAnswer = first + second + third;
                         const variations = [
                             correctAnswer + 1,
                             correctAnswer - 1,
                             correctAnswer + 10,
                             correctAnswer - 10,
                             correctAnswer + 100,
                             correctAnswer - 100
                         ];
                         
                         // Filter out the correct answer and pick a random incorrect one
                         const incorrectOptions = variations.filter(v => v !== correctAnswer && v > 0);
                         return incorrectOptions[Math.floor(Math.random() * incorrectOptions.length)] || correctAnswer + 1;
                     }
                 },
                 // Modal should show on page load
                 showOnLoad: true
             }
         }
     ],
     
     // Page 18 - Exact replica of page 16 (same as page 16)
     18: [
         {
             name: 'character',
             ...StandardPositions.character,
             // Override or extend specific props if needed
             props: {
                 ...StandardPositions.character.props,
                 src: 'assets/character_excited.png',
                 alt: 'Excited Character'
             }
         },
         {
             name: 'dialog-bubble',
             ...StandardPositions.dialogBubble,
             props: {
                 ...StandardPositions.dialogBubble.props,
                 get text() {
                     // Use i18n system for dialog text
                     return typeof i18n !== 'undefined' ? i18n.t('dialogs.page18.dialogtext') : 'Welcome to Page 18! This is an exact replica of Page 16.';
                 },
                 get options() {
                     return GridCellFontUtils.processGcStyles({
                         fontSize: '300gc',
                         lineHeight: '1400gc',
                         textAlign: "left",
                         textJustify: "auto",
                         backgroundColor: "#ffffff",
                         textColor: "#000000",
                         borderRadius: '75gc',
                         padding: '50gc',
                         showTail: true,
                         tailBorder: "bottom",
                         tailPlacement: "middle",
                         tailDirection: "south"
                     });
                 }
             }
         },
         {
             name: 'container1',
             ...StandardPositions.container1
         },
         {
             name: 'container2',
             ...StandardPositions.container2
         },
         {
             name: 'instruction-header',
             ...StandardPositions.instructionHeader
         },
         {
             name: 'question-dropdown',
             ...StandardPositions.questionDropdown
         },
         {
             name: 'grid1',
             type: 'grid',
             coordinates: [30, 40], // Start below target position for animation
             zIndex: 400,
             props: {
                 gridStructure: {
                     columns: 2,
                     rows: 4  // Dynamic based on question
                 },
                 defaultCellSize: {
                     rows: 6,    // Default: 6 rows height
                     columns: 6  // Default: 6 columns width
                 },
                 columnOverrides: {
                     'col1': { rows: 6, columns: 4 }, // Column 1 uses 4 columns width
                     'col2': { rows: 6, columns: 8 } // Column 2 uses 8 columns width
                 },
                 rowOverrides: {
                     // Row overrides will be set dynamically by Grid1Utils.loadQuestion()
                 },
                 cellOverrides: {
                     
                 },
                 cellStyles: {
                     // backgroundColor: 'rgba(255, 255, 255, 0.1)',
                     // border: '2px solid rgba(255, 255, 255, 0.3)',
                     // borderRadius: '8px'
                 },
                 // Special styling for separator row
                 separatorRowStyles: {
                     // borderTop: '3px solid #ffffff',
                     // backgroundColor: '#fff000'
                 },
                 textStyles: {
                     fontSize: '400gc',
                     fontWeight: 'bold',
                     color: '#ffffff',
                     textAlign: 'center',
                     verticalAlign: 'middle',
                     fontFamily: 'Arial, sans-serif'
                 },
                 // Addition problem configuration
                 currentQuestionIndex: 0,
                 questionData: null, // Will be populated from QUESTIONS array
                 showSeparatorLine: true, // Flag to control separator line visibility
                 // Animation configuration for page 18
                 animateOnLoad: false, // Enable animation on page load
                 animationDelay: 500, // Delay in milliseconds
                 animationDuration: 2000, // Animation duration in milliseconds
                 animationEasing: 'easeOutQuad', // Animation easing
                 targetPosition: [30, 40] // Target position to animate to - should move left
             }
         },
         {
             name: 'next-button',
             ...StandardPositions.nextButton
         },
         {
             name: 'previous-button',
             ...StandardPositions.previousButton
         },
         {
             name: 'grid2',
             type: 'grid',
             coordinates: [18, 65], // Position to the right of Grid1 (row 35, column 80)
             zIndex: 401,
             props: {
                 gridStructure: {
                     columns: 5,    // Dynamic based on question
                     rows: 8        // Dynamic based on question
                 },
                 defaultCellSize: {
                     rows: 6,    // Same as Grid1
                     columns: 8  // Same as Grid1's R1C2 width
                 },
                 columnOverrides: {
                     // Will be set dynamically by Grid2Utils
                 },
                 rowOverrides: {
                     // Will be set dynamically by Grid2Utils
                 },
                 cellOverrides: {
                     // Page 18 specific cell overrides for tenscarry borders
                     // Will be set dynamically based on number of digits by loadQuestion function
                 },
                 cellStyles: {
                    //  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    //  border: '1px solid rgba(255, 255, 255, 0.5)',
                    //  borderRadius: '4px'
                 },
                 // Special styling for separator row
                 separatorRowStyles: {
                    //  borderTop: '2px solid #ffffff',
                    //  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                 },
                 textStyles: {
                     fontSize: '400gc',  // Same as Grid1
                     fontWeight: 'bold',
                     color: '#ffffff',
                     textAlign: 'center',
                     verticalAlign: 'middle',
                     fontFamily: 'Arial, sans-serif'
                 },
                 // Addition problem configuration
                 currentQuestionIndex: 0,
                 questionData: null, // Will be populated from QUESTIONS array
                 showSeparatorLine: true, // Flag to control separator line visibility
                 // Grid2-specific properties
                 isGrid2: true, // Flag to identify this as Grid2
                 dynamicDimensions: true, // Enable dynamic sizing
                 showCarryRow: true, // Show carry calculations
                 showAdditionalAnswerRow: true, // Show additional answer row if needed
                 // Animation configuration for page 18
                 animateOnLoad: true, // Enable animation on page load
                 animationDelay: 1000, // Delay after grid1 animation
                 animationDuration: 800, // Animation duration in milliseconds
                 animationEasing: 'easeOutQuad', // Animation easing
                 targetPosition: [35, 80] // Target position to animate to (row 35, column 80)
             }
         }
     ],
     
     // Page 19 - Exact replica of page 18
     19: [
         {
             name: 'character',
             ...StandardPositions.character,
             // Override or extend specific props if needed
             props: {
                 ...StandardPositions.character.props,
                 src: 'assets/character_excited.png',
                 alt: 'Excited Character'
             }
         },
         {
             name: 'dialog-bubble',
             ...StandardPositions.dialogBubble,
             props: {
                 ...StandardPositions.dialogBubble.props,
                 get text() {
                     // Use i18n system for dialog text
                     return typeof i18n !== 'undefined' ? i18n.t('dialogs.page19.dialogtext') : 'Welcome to Page 19! This is an exact replica of Page 18.';
                 },
                 get options() {
                     return GridCellFontUtils.processGcStyles({
                         fontSize: '300gc',
                         lineHeight: '1400gc',
                         textAlign: "left",
                         textJustify: "auto",
                         backgroundColor: "#ffffff",
                         textColor: "#000000",
                         borderRadius: '75gc',
                         padding: '50gc',
                         showTail: true,
                         tailBorder: "bottom",
                         tailPlacement: "middle",
                         tailDirection: "south"
                     });
                 }
             }
         },
         {
             name: 'container1',
             ...StandardPositions.container1
         },
         {
             name: 'container2',
             ...StandardPositions.container2
         },
         {
             name: 'instruction-header',
             ...StandardPositions.instructionHeader
         },
         {
             name: 'question-dropdown',
             ...StandardPositions.questionDropdown
         },
         {
             name: 'grid1',
             type: 'grid',
             coordinates: [30, 40], // Start below target position for animation
             zIndex: 400,
             props: {
                 gridStructure: {
                     columns: 2,
                     rows: 4  // Dynamic based on question
                 },
                 defaultCellSize: {
                     rows: 6,    // Default: 6 rows height
                     columns: 6  // Default: 6 columns width
                 },
                 columnOverrides: {
                     'col1': { rows: 6, columns: 4 }, // Column 1 uses 4 columns width
                     'col2': { rows: 6, columns: 8 } // Column 2 uses 8 columns width
                 },
                 rowOverrides: {
                     // Row overrides will be set dynamically by Grid1Utils.loadQuestion()
                 },
                 cellOverrides: {
                     
                 },
                 cellStyles: {
                     // backgroundColor: 'rgba(255, 255, 255, 0.1)',
                     // border: '2px solid rgba(255, 255, 255, 0.3)',
                     // borderRadius: '8px'
                 },
                 // Special styling for separator row
                 separatorRowStyles: {
                     // borderTop: '3px solid #ffffff',
                     // backgroundColor: '#fff000'
                 },
                 textStyles: {
                     fontSize: '400gc',
                     fontWeight: 'bold',
                     color: '#ffffff',
                     textAlign: 'center',
                     verticalAlign: 'middle',
                     fontFamily: 'Arial, sans-serif'
                 },
                 // Addition problem configuration
                 currentQuestionIndex: 0,
                 questionData: null, // Will be populated from QUESTIONS array
                 showSeparatorLine: true, // Flag to control separator line visibility
                 // Animation configuration for page 19
                 animateOnLoad: false, // Enable animation on page load
                 animationDelay: 500, // Delay in milliseconds
                 animationDuration: 2000, // Animation duration in milliseconds
                 animationEasing: 'easeOutQuad', // Animation easing
                 targetPosition: [30, 40] // Target position to animate to - should move left
             }
         },
         {
             name: 'next-button',
             ...StandardPositions.nextButton
         },
         {
             name: 'previous-button',
             ...StandardPositions.previousButton
         },
         {
             name: 'grid2',
             type: 'grid',
             coordinates: [18, 65], // Position to the right of Grid1 (row 35, column 80)
             zIndex: 401,
             props: {
                 gridStructure: {
                     columns: 5,    // Dynamic based on question
                     rows: 8        // Dynamic based on question
                 },
                 defaultCellSize: {
                     rows: 6,    // Same as Grid1
                     columns: 8  // Same as Grid1's R1C2 width
                 },
                 columnOverrides: {
                     // Will be set dynamically by Grid2Utils
                 },
                 rowOverrides: {
                     // Will be set dynamically by Grid2Utils
                 },
                 cellOverrides: {
                     // Page 19 specific cell overrides for tenscarry borders
                     // Will be set dynamically based on number of digits by loadQuestion function
                 },
                 cellStyles: {
                    //  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    //  border: '1px solid rgba(255, 255, 255, 0.5)',
                    //  borderRadius: '4px'
                 },
                 // Special styling for separator row
                 separatorRowStyles: {
                    //  borderTop: '2px solid #ffffff',
                    //  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                 },
                 textStyles: {
                     fontSize: '400gc',  // Same as Grid1
                     fontWeight: 'bold',
                     color: '#ffffff',
                     textAlign: 'center',
                     verticalAlign: 'middle',
                     fontFamily: 'Arial, sans-serif'
                 },
                 // Addition problem configuration
                 currentQuestionIndex: 0,
                 questionData: null, // Will be populated from QUESTIONS array
                 showSeparatorLine: true, // Flag to control separator line visibility
                 // Grid2-specific properties
                 isGrid2: true, // Flag to identify this as Grid2
                 dynamicDimensions: true, // Enable dynamic sizing
                 showCarryRow: true, // Show carry calculations
                 showAdditionalAnswerRow: true, // Show additional answer row if needed
                 // Animation configuration for page 19
                 animateOnLoad: true, // Enable animation on page load
                 animationDelay: 1000, // Delay after grid1 animation
                 animationDuration: 800, // Animation duration in milliseconds
                 animationEasing: 'easeOutQuad', // Animation easing
                 targetPosition: [35, 80] // Target position to animate to (row 35, column 80)
             }
         }
     ],
     
     // Page 20 - Exact replica of page 19
     20: [
         {
             name: 'character',
             ...StandardPositions.character,
             // Override or extend specific props if needed
             props: {
                 ...StandardPositions.character.props,
                 src: 'assets/character_excited.png',
                 alt: 'Excited Character'
             }
         },
         {
             name: 'dialog-bubble',
             ...StandardPositions.dialogBubble,
             props: {
                 ...StandardPositions.dialogBubble.props,
                 get text() {
                     // Use i18n system for dialog text
                     return typeof i18n !== 'undefined' ? i18n.t('dialogs.page20.dialogtext') : 'Welcome to Page 20! This is an exact replica of Page 19.';
                 },
                 get options() {
                     return GridCellFontUtils.processGcStyles({
                         fontSize: '300gc',
                         lineHeight: '1400gc',
                         textAlign: "left",
                         textJustify: "auto",
                         backgroundColor: "#ffffff",
                         textColor: "#000000",
                         borderRadius: '75gc',
                         padding: '50gc',
                         showTail: true,
                         tailBorder: "bottom",
                         tailPlacement: "middle",
                         tailDirection: "south"
                     });
                 }
             }
         },
         {
             name: 'container1',
             ...StandardPositions.container1
         },
         {
             name: 'container2',
             ...StandardPositions.container2
         },
         {
             name: 'instruction-header',
             ...StandardPositions.instructionHeader,
             props: {
                 ...StandardPositions.instructionHeader.props,
                 get text() {
                     // Dynamic text for page 20 - check if more questions are available
                     if (typeof QUESTIONS !== 'undefined') {
                         const currentQuestion = Grid1Utils.getCurrentQuestion();
                         if (currentQuestion) {
                             // Find current question index in QUESTIONS array
                             const currentIndex = QUESTIONS.findIndex(q => 
                                 q.first_number === currentQuestion.first_number && 
                                 q.second_number === currentQuestion.second_number &&
                                 q.third_number === currentQuestion.third_number
                             );
                             
                             // Check if there are more questions available
                             if (currentIndex >= 0 && currentIndex < QUESTIONS.length - 1) {
                                 return typeof i18n !== 'undefined' ? i18n.t('dialogs.instructions.clickTryNew') : 'Click on Try New for the next question..';
                             } else {
                                 return typeof i18n !== 'undefined' ? i18n.t('dialogs.quiz.completedAllQuestions') : 'You have completed all the challenges!';
                             }
                         }
                     }
                     // Fallback text
                     return typeof i18n !== 'undefined' ? i18n.t('dialogs.instructions.clickTryNew') : 'Click on Try New for the next question..';
                 }
             }
         },
         {
             name: 'question-dropdown',
             ...StandardPositions.questionDropdown
         },
         {
             name: 'grid1',
             type: 'grid',
             coordinates: [30, 40], // Start below target position for animation
             zIndex: 400,
             props: {
                 gridStructure: {
                     columns: 2,
                     rows: 4  // Dynamic based on question
                 },
                 defaultCellSize: {
                     rows: 6,    // Default: 6 rows height
                     columns: 6  // Default: 6 columns width
                 },
                 columnOverrides: {
                     'col1': { rows: 6, columns: 4 }, // Column 1 uses 4 columns width
                     'col2': { rows: 6, columns: 8 } // Column 2 uses 8 columns width
                 },
                 rowOverrides: {
                     // Row overrides will be set dynamically by Grid1Utils.loadQuestion()
                 },
                 cellOverrides: {
                     
                 },
                 cellStyles: {
                     // backgroundColor: 'rgba(255, 255, 255, 0.1)',
                     // border: '2px solid rgba(255, 255, 255, 0.3)',
                     // borderRadius: '8px'
                 },
                 // Special styling for separator row
                 separatorRowStyles: {
                     // borderTop: '3px solid #ffffff',
                     // backgroundColor: '#fff000'
                 },
                 textStyles: {
                     fontSize: '400gc',
                     fontWeight: 'bold',
                     color: '#ffffff',
                     textAlign: 'center',
                     verticalAlign: 'middle',
                     fontFamily: 'Arial, sans-serif'
                 },
                 // Addition problem configuration
                 currentQuestionIndex: 0,
                 questionData: null, // Will be populated from QUESTIONS array
                 showSeparatorLine: true, // Flag to control separator line visibility
                 // Animation configuration for page 20
                 animateOnLoad: false, // Enable animation on page load
                 animationDelay: 500, // Delay in milliseconds
                 animationDuration: 2000, // Animation duration in milliseconds
                 animationEasing: 'easeOutQuad', // Animation easing
                 targetPosition: [30, 40] // Target position to animate to - should move left
             }
         },
         {
             name: 'next-button',
             ...StandardPositions.nextButton
         },
         {
             name: 'previous-button',
             ...StandardPositions.previousButton
         },
         {
             name: 'grid2',
             type: 'grid',
             coordinates: [18, 65], // Position to the right of Grid1 (row 35, column 80)
             zIndex: 401,
             props: {
                 gridStructure: {
                     columns: 5,    // Dynamic based on question
                     rows: 8        // Dynamic based on question
                 },
                 defaultCellSize: {
                     rows: 6,    // Same as Grid1
                     columns: 8  // Same as Grid1's R1C2 width
                 },
                 columnOverrides: {
                     // Will be set dynamically by Grid2Utils
                 },
                 rowOverrides: {
                     // Will be set dynamically by Grid2Utils
                 },
                 cellOverrides: {
                     // Page 20 specific cell overrides for tenscarry borders
                     // Will be set dynamically based on number of digits by loadQuestion function
                 },
                 cellStyles: {
                    //  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    //  border: '1px solid rgba(255, 255, 255, 0.5)',
                    //  borderRadius: '4px'
                 },
                 // Special styling for separator row
                 separatorRowStyles: {
                    //  borderTop: '2px solid #ffffff',
                    //  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                 },
                 textStyles: {
                     fontSize: '400gc',  // Same as Grid1
                     fontWeight: 'bold',
                     color: '#ffffff',
                     textAlign: 'center',
                     verticalAlign: 'middle',
                     fontFamily: 'Arial, sans-serif'
                 },
                 // Addition problem configuration
                 currentQuestionIndex: 0,
                 questionData: null, // Will be populated from QUESTIONS array
                 showSeparatorLine: true, // Flag to control separator line visibility
                 // Grid2-specific properties
                 isGrid2: true, // Flag to identify this as Grid2
                 dynamicDimensions: true, // Enable dynamic sizing
                 showCarryRow: true, // Show carry calculations
                 showAdditionalAnswerRow: true, // Show additional answer row if needed
                 // Animation configuration for page 20
                 animateOnLoad: true, // Enable animation on page load
                 animationDelay: 1000, // Delay after grid1 animation
                 animationDuration: 800, // Animation duration in milliseconds
                 animationEasing: 'easeOutQuad', // Animation easing
                 targetPosition: [35, 80] // Target position to animate to (row 35, column 80)
             }
         }
     ]
 };

// Grid2-specific utilities for detailed column addition
const Grid2Utils = {
    // Calculate grid dimensions based on question
    calculateGridDimensions: (questionData, currentPage) => {
        if (!questionData) {
            console.log('🔢 [Grid2] No question data provided');
            return { rows: 5, columns: 3, hasCarries: false };
        }
        
        // Extract numbers from question
        const numbers = [];
        if (questionData.first_number) numbers.push(questionData.first_number);
        if (questionData.second_number) numbers.push(questionData.second_number);
        if (questionData.third_number) numbers.push(questionData.third_number);
        
        console.log('🔢 [Grid2] Numbers in question:', numbers);
        
        // Find maximum number of digits
        const maxDigits = Math.max(...numbers.map(num => num.toString().length));
        console.log('🔢 [Grid2] Maximum digits:', maxDigits);
        
        // Calculate columns: max_digits + (max_digits - 1) for plus positioning
        const columns = 2 * maxDigits - 1;
        
        // Check for carries (but always include carry row regardless)
        const hasCarries = true; // Always include carry row for place value headers
        const actualCarries = Grid2Utils.checkForCarries(numbers);
        console.log('🔢 [Grid2] Has actual carries:', actualCarries, ', but always showing carry row');
        
        // Calculate rows: header + carry + numbers + separator + answer + extra answer
        // Always include extra answer row regardless of carries or page
        const rows = 1 + 1 + numbers.length + 1 + 1 + 1; // header + carry + numbers + separator + answer + extra answer
        
        console.log('🔢 [Grid2] Grid dimensions:', { rows, columns, hasCarries, actualCarries, numberCount: numbers.length, currentPage });
        console.log('🔢 [Grid2] Row structure:');
        console.log('  - 2 numbers: 7 rows (Header, Carry, Num1, Num2, Separator, Answer, Extra Answer)');
        console.log('  - 3 numbers: 8 rows (Header, Carry, Num1, Num2, Num3, Separator, Answer, Extra Answer)');
        
        return { rows, columns, hasCarries, actualCarries, numberCount: numbers.length, maxDigits };
    },
    
    // Calculate page 12 tens column value for border color determination
    calculatePage12TensValue: (questionData, gridDimensions) => {
        if (!questionData || !gridDimensions) return 0;
        
        const { maxDigits, numberCount } = gridDimensions;
        
        // Calculate tenscarry (from ones column overflow)
        const onesSum = (questionData.first_number % 10) + 
                       (questionData.second_number % 10) + 
                       (questionData.third_number ? (questionData.third_number % 10) : 0);
        const tenscarry = Math.floor(onesSum / 10) * 10;
        
        // Calculate tens digits multiplied by 10
        const firstTens = Math.floor(questionData.first_number / 10) % 10;
        const secondTens = Math.floor(questionData.second_number / 10) % 10;
        const thirdTens = questionData.third_number ? Math.floor(questionData.third_number / 10) % 10 : 0;
        
        // Calculate based on question type
        if (maxDigits === 2 && numberCount === 2) {
            // 2-digit 2 numbers: tenscarry + (firstTens * 10) + (secondTens * 10)
            return tenscarry + (firstTens * 10) + (secondTens * 10);
        } else if (maxDigits === 3 && numberCount === 2) {
            // 3-digit 2 numbers: tenscarry + (firstTens * 10) + (secondTens * 10)
            return tenscarry + (firstTens * 10) + (secondTens * 10);
        } else if (maxDigits === 3 && numberCount === 3) {
            // 3-digit 3 numbers: tenscarry + (firstTens * 10) + (secondTens * 10) + (thirdTens * 10)
            return tenscarry + (firstTens * 10) + (secondTens * 10) + (thirdTens * 10);
        }
        
        return 0;
    },

    // Check if any column will have carries
    checkForCarries: (numbers) => {
        if (!numbers || numbers.length === 0) return false;
        
        // Find maximum number of digits to check all positions
        const maxDigits = Math.max(...numbers.map(num => num.toString().length));
        
        // Check each column position (ones, tens, hundreds, etc.)
        for (let position = 0; position < maxDigits; position++) {
            let columnSum = 0;
            
            // Add digits from all numbers at this position
            for (const number of numbers) {
                const numStr = number.toString();
                const digitIndex = numStr.length - 1 - position; // Count from right
                
                if (digitIndex >= 0) {
                    columnSum += parseInt(numStr[digitIndex]);
                }
            }
            
            console.log(`🔢 [Grid2] Column ${position} (${position === 0 ? 'ones' : position === 1 ? 'tens' : position === 2 ? 'hundreds' : 'position ' + position}) sum:`, columnSum);
            
            // If any column sum >= 10, there's a carry
            if (columnSum >= 10) {
                console.log('🔢 [Grid2] Carry detected at position', position);
                return true;
            }
        }
        
        return false;
    },
    
    // Get cell content for grid2 with color information
    getCellContent: (row, col, questionData, gridDimensions, currentPage, onesdigitsum) => {
        console.log(`🔍 [Grid2] getCellContent called for R${row}C${col}, currentPage: ${currentPage}`);
        
        if (!questionData || !gridDimensions) {
            console.log(`🔍 [Grid2] Missing data - questionData: ${!!questionData}, gridDimensions: ${!!gridDimensions}`);
            return { content: '', color: '' };
        }
        
        const { rows, columns, hasCarries, numberCount, maxDigits } = gridDimensions;
        
        // Calculate onesdigitsum from question data if not provided or is 0
        let calculatedOnesdigitsum = onesdigitsum;
        if (!calculatedOnesdigitsum || calculatedOnesdigitsum === 0) {
            calculatedOnesdigitsum = 0;
            if (questionData.first_number) calculatedOnesdigitsum += questionData.first_number % 10;
            if (questionData.second_number) calculatedOnesdigitsum += questionData.second_number % 10;
            if (questionData.third_number) calculatedOnesdigitsum += questionData.third_number % 10;
            console.log(`🔢 [Grid2] Calculated onesdigitsum: ${calculatedOnesdigitsum} from question data (${questionData.first_number}, ${questionData.second_number}, ${questionData.third_number})`);
        } else {
            console.log(`🔢 [Grid2] Using provided onesdigitsum: ${calculatedOnesdigitsum}`);
        }
        
        // Column colors based on position - dynamic based on max digits
        const getColumnColor = (col, maxDigits) => {
            if (maxDigits === 2) {
                // 2-digit numbers: C1 = Tens, C3 = Ones
                if (col === 1) return 'var(--clr-blue)';      // Tens
                if (col === 3) return 'var(--clr-pink)';      // Ones
            } else if (maxDigits === 3) {
                // 3-digit numbers: C1 = Hundreds, C3 = Tens, C5 = Ones
                if (col === 1) return 'var(--clr-orange)';    // Hundreds
                if (col === 3) return 'var(--clr-blue)';      // Tens
                if (col === 5) return 'var(--clr-pink)';      // Ones
            }
            return '#ffffff'; // Default white
        };
        
        // Row mapping:
        // 1: Header (blank in R1C1, R1C3, R1C5)
        // 2: Carry row (place value headers: H, T, O)
        // 3+: Number rows
        // Second-to-last: Separator
        // Last-1: Answer
        // Last: Additional answer (always present)
        
        const headerRow = 1;
        const carryRow = 2; // Always present
        const numberRowStart = 3;
        const numberRowEnd = numberRowStart + numberCount - 1;
        const separatorRow = numberRowEnd + 1;
        const answerRow = separatorRow + 1;
        const additionalAnswerRow = answerRow + 1; // Always present
        
        console.log(`🔢 [Grid2] Row mapping - Header:${headerRow}, Carry:${carryRow}, Numbers:${numberRowStart}-${numberRowEnd}, Separator:${separatorRow}, Answer:${answerRow}, Additional:${additionalAnswerRow}`);
        console.log(`🔢 [Grid2] Current request: R${row}C${col}, maxDigits: ${maxDigits}, numberCount: ${numberCount}`);
        
        // Header row - Page 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, and 20 specific logic for place value headers
        if (row === headerRow) {
            if (currentPage === 9 || currentPage === 10 || currentPage === 11 || currentPage === 12 || currentPage === 13 || currentPage === 14 || currentPage === 15 || currentPage === 16 || currentPage === 17 || currentPage === 18 || currentPage === 19 || currentPage === 20) {
                if (maxDigits === 2) {
                    // 2-digit numbers: C1 = T, C3 = O
                    if (col === 1) return { content: typeof i18n !== 'undefined' ? i18n.t('dialogs.quiz.tensHeader') : 'T', color: getColumnColor(col, maxDigits) };  // Tens column
                    if (col === 3) return { content: typeof i18n !== 'undefined' ? i18n.t('dialogs.quiz.onesHeader') : 'O', color: getColumnColor(col, maxDigits) };  // Ones column
                } else if (maxDigits === 3) {
                    // 3-digit numbers: C1 = H, C3 = T, C5 = O
                    if (col === 1) return { content: typeof i18n !== 'undefined' ? i18n.t('dialogs.quiz.hundredsHeader') : 'H', color: getColumnColor(col, maxDigits) };  // Hundreds column
                    if (col === 3) return { content: typeof i18n !== 'undefined' ? i18n.t('dialogs.quiz.tensHeader') : 'T', color: getColumnColor(col, maxDigits) };  // Tens column
                    if (col === 5) return { content: typeof i18n !== 'undefined' ? i18n.t('dialogs.quiz.onesHeader') : 'O', color: getColumnColor(col, maxDigits) };  // Ones column
                }
            }
            return { content: '', color: '' };
        }
        
        // Carry row - Page 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, and 20 specific logic for tenscarry
        if (row === carryRow) {
            if (currentPage === 9 || currentPage === 10 || currentPage === 11 || currentPage === 12 || currentPage === 13 || currentPage === 14 || currentPage === 15 || currentPage === 16 || currentPage === 17 || currentPage === 18 || currentPage === 19 || currentPage === 20) {
                // Calculate tenscarry as calculatedOnesdigitsum // 10 * 10
                const tenscarry = Math.floor(calculatedOnesdigitsum / 10) * 10;
                console.log(`🔧 [Grid2 Debug Page 9] Carry row R${row}C${col}: calculatedOnesdigitsum=${calculatedOnesdigitsum}, tenscarry=${tenscarry}, maxDigits=${maxDigits}`);
                
                // Page 15, 16, 17, 18, 19, and 20 special logic for hundreds carry in C1
                if ((currentPage === 15 || currentPage === 16 || currentPage === 17 || currentPage === 18 || currentPage === 19 || currentPage === 20) && col === 1) {
                    // Calculate tens digits multiplied by 10
                    const firstTens = Math.floor(questionData.first_number / 10) % 10;
                    const secondTens = Math.floor(questionData.second_number / 10) % 10;
                    const thirdTens = questionData.third_number ? Math.floor(questionData.third_number / 10) % 10 : 0;
                    
                    // Calculate tensdigitsum for all cases
                    const tensDigitSum = tenscarry + (firstTens * 10) + (secondTens * 10) + (thirdTens * 10);
                    const hundredsCarry = Math.floor(tensDigitSum / 100) * 100;
                    
                    console.log(`🔢 [Grid2] Page 15 R2C1: hundreds carry = ${hundredsCarry}`);
                    return { 
                        content: hundredsCarry > 0 ? hundredsCarry.toString() : '', 
                        color: '#ffffff'  // White text color
                    };
                }
                
                if (maxDigits === 2) {
                    // 2-digit numbers: tenscarry in C1 (tens position)
                    if (col === 1) {
                        console.log(`🔧 [Grid2 Debug Page 9] 2-digit: Placing tenscarry=${tenscarry} in R${row}C${col}`);
                        console.log(`🔧 [Grid2 Debug Page 9] This should match cellOverride key '2,1'`);
                        return { 
                            content: tenscarry > 0 ? tenscarry.toString() : '', 
                            color: '#ffffff'
                        };
                    }
                } else if (maxDigits === 3) {
                    // 3-digit numbers: tenscarry in C3 (tens position)
                    if (col === 3) {
                        console.log(`🔧 [Grid2 Debug Page 9] 3-digit: Placing tenscarry=${tenscarry} in R${row}C${col}`);
                        console.log(`🔧 [Grid2 Debug Page 9] This should match cellOverride key '2,3'`);
                        return { 
                            content: tenscarry > 0 ? tenscarry.toString() : '', 
                            color: '#ffffff'
                        };
                    }
                }
            } else {
                // Original logic for other pages
                if (maxDigits === 2) {
                    // 2-digit numbers: C1 = Tens, C3 = Ones
                    if (col === 1) return { content: typeof i18n !== 'undefined' ? i18n.t('dialogs.quiz.tensHeader') : 'T', color: getColumnColor(col, maxDigits) };  // Tens column
                    if (col === 3) return { content: typeof i18n !== 'undefined' ? i18n.t('dialogs.quiz.onesHeader') : 'O', color: getColumnColor(col, maxDigits) };  // Ones column
                } else if (maxDigits === 3) {
                    // 3-digit numbers: C1 = Hundreds, C3 = Tens, C5 = Ones
                    if (col === 1) return { content: typeof i18n !== 'undefined' ? i18n.t('dialogs.quiz.hundredsHeader') : 'H', color: getColumnColor(col, maxDigits) };  // Hundreds column
                    if (col === 3) return { content: typeof i18n !== 'undefined' ? i18n.t('dialogs.quiz.tensHeader') : 'T', color: getColumnColor(col, maxDigits) };  // Tens column
                    if (col === 5) return { content: typeof i18n !== 'undefined' ? i18n.t('dialogs.quiz.onesHeader') : 'O', color: getColumnColor(col, maxDigits) };  // Ones column
                }
            }
            return { content: '', color: '' };
        }
        
        // Number rows
        if (row >= numberRowStart && row <= numberRowEnd) {
            const numberIndex = row - numberRowStart;
            const numbers = [questionData.first_number, questionData.second_number, questionData.third_number].filter(n => n !== undefined);
            
            if (numberIndex < numbers.length) {
                const number = numbers[numberIndex];
                const numStr = number.toString();
                
                // Plus sign columns - positioned in columns 2 and 4 for all number rows
                if (col === 2 || col === 4) {
                    return { content: '+', color: '#ffffff' };
                }
                
                // Number digit columns - position based on place value
                const numDigits = numStr.length;
                
                // Map digit positions to columns based on place value
                let digitCol = -1;
                let digitIndex = -1;
                
                if (maxDigits === 2) {
                    // 2-digit layout: C1 = Tens, C3 = Ones
                    if (numDigits === 1) {
                        // Single digit goes to ones place (C3)
                        if (col === 3) {
                            digitCol = col;
                            digitIndex = 0;
                        }
                    } else if (numDigits === 2) {
                        // Two digits: tens in C1, ones in C3
                        if (col === 1) {
                            digitCol = col;
                            digitIndex = 0; // First digit (tens)
                        } else if (col === 3) {
                            digitCol = col;
                            digitIndex = 1; // Second digit (ones)
                        }
                    }
                } else if (maxDigits === 3) {
                    // 3-digit layout: C1 = Hundreds, C3 = Tens, C5 = Ones
                    if (numDigits === 1) {
                        // Single digit goes to ones place (C5)
                        if (col === 5) {
                            digitCol = col;
                            digitIndex = 0;
                        }
                    } else if (numDigits === 2) {
                        // Two digits: tens in C3, ones in C5
                        if (col === 3) {
                            digitCol = col;
                            digitIndex = 0; // First digit (tens)
                        } else if (col === 5) {
                            digitCol = col;
                            digitIndex = 1; // Second digit (ones)
                        }
                    } else if (numDigits === 3) {
                        // Three digits: hundreds in C1, tens in C3, ones in C5
                        if (col === 1) {
                            digitCol = col;
                            digitIndex = 0; // First digit (hundreds)
                        } else if (col === 3) {
                            digitCol = col;
                            digitIndex = 1; // Second digit (tens)
                        } else if (col === 5) {
                            digitCol = col;
                            digitIndex = 2; // Third digit (ones)
                        }
                    }
                }
                
                if (digitCol !== -1 && digitIndex !== -1 && digitIndex < numStr.length) {
                    const digit = parseInt(numStr[digitIndex]);
                    let displayValue = '';
                    
                    // Convert to place value representation
                    if (maxDigits === 2) {
                        if (col === 1) {
                            // Tens column for 2-digit layout
                            displayValue = digit === 0 ? '' : `${digit * 10}`;
                        } else if (col === 3) {
                            // Ones column - show digit as is
                            displayValue = digit.toString();
                        }
                    } else if (maxDigits === 3) {
                        if (col === 1) {
                            // Hundreds column for 3-digit layout
                            displayValue = digit === 0 ? '' : `${digit * 100}`;
                        } else if (col === 3) {
                            // Tens column for 3-digit layout
                            displayValue = digit === 0 ? '' : `${digit * 10}`;
                        } else if (col === 5) {
                            // Ones column - show digit as is
                            displayValue = digit.toString();
                        }
                    }
                    
                    return { content: displayValue, color: getColumnColor(col, maxDigits) };
                }
            }
            return { content: '', color: '' };
        }
        
        // Separator row
        if (row === separatorRow) {
            return { content: '', color: '' }; // Will be styled with line
        }
        
        // Answer rows
        if (row === answerRow || row === additionalAnswerRow) {
            // Get digit calculation values from global context for pages 6, 8, and 9
            const currentTensCarry = typeof window !== 'undefined' && window.getTensCarry ? window.getTensCarry() : 0;
            const currentOnesdigitanswer = typeof window !== 'undefined' && window.getOnesdigitanswer ? window.getOnesdigitanswer() : 0;
            
            if (currentPage === 6) {
                // Page 6 logic: Show onesdigitsum in correct position
                const onesColumn = maxDigits === 2 ? 3 : 5; // C3 for 2-digit, C5 for 3-digit
                console.log(`🔢 [Grid2] Page 6 logic: checking R${row}C${col} vs answerRow ${answerRow}, onesColumn ${onesColumn}`);
                
                if (col === onesColumn && row === answerRow) {
                    console.log(`🔢 [Grid2] Page 6: Returning onesdigitsum ${calculatedOnesdigitsum} for R${row}C${col}`);
                    return { content: calculatedOnesdigitsum.toString(), color: getColumnColor(col, maxDigits) };
                } else {
                    console.log(`🔢 [Grid2] Page 6: Not matching - col ${col} vs onesColumn ${onesColumn}, row ${row} vs answerRow ${answerRow}`);
                }
            } else if (currentPage === 8) {
                // Page 8 logic: Different display based on number of digits and numbers
                const onesColumn = maxDigits === 2 ? 3 : 5; // C3 for 2-digit, C5 for 3-digit
                
                if (col === onesColumn) {
                    if (maxDigits === 3 && numberCount === 3) {
                        // 3 digits + 3 numbers: R7C5 = tens_carry, R8C5 = "+" + onesdigitanswer
                        if (row === answerRow) {
                            console.log(`🔢 [Grid2] Page 8 (3digits+3numbers): Returning tensCarry ${currentTensCarry} for R${row}C${col}`);
                            return { content: currentTensCarry.toString(), color: getColumnColor(col, maxDigits) };
                        } else if (row === additionalAnswerRow) {
                            console.log(`🔢 [Grid2] Page 8 (3digits+3numbers): Returning +onesdigitanswer +${currentOnesdigitanswer} for R${row}C${col}`);
                            return { content: `+${currentOnesdigitanswer}`, color: getColumnColor(col, maxDigits) };
                        }
                    } else if (maxDigits === 3 && numberCount === 2) {
                        // 3 digits + 2 numbers: R6C5 = formatted ones result, R7C5 = "+" + onesdigitanswer
                        if (row === answerRow) {
                            // Format ones digit result: show carry*10 when carry exists, otherwise show the sum
                            const carry = Math.floor(calculatedOnesdigitsum / 10);
                            const formattedResult = carry > 0 ? (carry * 10).toString() : calculatedOnesdigitsum.toString();
                            console.log(`🔢 [Grid2] Page 8 (3digits+2numbers): Returning formatted ones ${formattedResult} (carry: ${carry}, from ${calculatedOnesdigitsum}) for R${row}C${col}`);
                            return { content: formattedResult, color: getColumnColor(col, maxDigits) };
                        } else if (row === additionalAnswerRow) {
                            console.log(`🔢 [Grid2] Page 8 (3digits+2numbers): Returning +onesdigitanswer +${currentOnesdigitanswer} for R${row}C${col}`);
                            return { content: `+${currentOnesdigitanswer}`, color: getColumnColor(col, maxDigits) };
                        }
                    } else if (maxDigits === 2 && numberCount === 3) {
                        // 2 digits + 3 numbers: R7C3 = formatted ones result, R8C3 = "+" + onesdigitanswer
                        if (row === answerRow) {
                            // Format ones digit result: show carry*10 when carry exists, otherwise show the sum
                            const carry = Math.floor(calculatedOnesdigitsum / 10);
                            const formattedResult = carry > 0 ? (carry * 10).toString() : calculatedOnesdigitsum.toString();
                            console.log(`🔢 [Grid2] Page 8 (2digits+3numbers): Returning formatted ones ${formattedResult} (carry: ${carry}, from ${calculatedOnesdigitsum}) for R${row}C${col}`);
                            return { content: formattedResult, color: getColumnColor(col, maxDigits) };
                        } else if (row === additionalAnswerRow) {
                            console.log(`🔢 [Grid2] Page 8 (2digits+3numbers): Returning +onesdigitanswer +${currentOnesdigitanswer} for R${row}C${col}`);
                            return { content: `+${currentOnesdigitanswer}`, color: getColumnColor(col, maxDigits) };
                        }
                    } else if (maxDigits === 2 && numberCount === 2) {
                        // 2 digits + 2 numbers: R6C3 = formatted ones result, R7C3 = "+" + onesdigitanswer
                        if (row === answerRow) {
                            // Format ones digit result: show carry*10 when carry exists, otherwise show the sum
                            const carry = Math.floor(calculatedOnesdigitsum / 10);
                            const formattedResult = carry > 0 ? (carry * 10).toString() : calculatedOnesdigitsum.toString();
                            console.log(`🔢 [Grid2] Page 8 (2digits+2numbers): Returning formatted ones ${formattedResult} (carry: ${carry}, from ${calculatedOnesdigitsum}) for R${row}C${col}`);
                            return { content: formattedResult, color: getColumnColor(col, maxDigits) };
                        } else if (row === additionalAnswerRow) {
                            console.log(`🔢 [Grid2] Page 8 (2digits+2numbers): Returning +onesdigitanswer +${currentOnesdigitanswer} for R${row}C${col}`);
                            return { content: `+${currentOnesdigitanswer}`, color: getColumnColor(col, maxDigits) };
                        }
                    }
                }
            } else if (currentPage === 9 || currentPage === 10 || currentPage === 11) {
                // Page 9, 10, and 11 logic: Show onesdigitanswer in specific positions
                const onesColumn = maxDigits === 2 ? 3 : 5; // C3 for 2-digit, C5 for 3-digit
                
                if (col === onesColumn) {
                    if (maxDigits === 3 && numberCount === 3) {
                        // 3 digits + 3 numbers: R7C5 = onesdigitanswer, R8C5 = blank
                        if (row === answerRow) {
                            console.log(`🔢 [Grid2] Page 9 (3digits+3numbers): Returning onesdigitanswer ${currentOnesdigitanswer} for R${row}C${col}`);
                            return { content: currentOnesdigitanswer.toString(), color: getColumnColor(col, maxDigits) };
                        } else if (row === additionalAnswerRow) {
                            console.log(`🔢 [Grid2] Page 9 (3digits+3numbers): Returning blank for R${row}C${col}`);
                            return { content: '', color: getColumnColor(col, maxDigits) };
                        }
                    } else if (maxDigits === 3 && numberCount === 2) {
                        // 3 digits + 2 numbers: R6C5 = onesdigitanswer, R7C5 = blank
                        if (row === answerRow) {
                            console.log(`🔢 [Grid2] Page 9 (3digits+2numbers): Returning onesdigitanswer ${currentOnesdigitanswer} for R${row}C${col}`);
                            return { content: currentOnesdigitanswer.toString(), color: getColumnColor(col, maxDigits) };
                        } else if (row === additionalAnswerRow) {
                            console.log(`🔢 [Grid2] Page 9 (3digits+2numbers): Returning blank for R${row}C${col}`);
                            return { content: '', color: getColumnColor(col, maxDigits) };
                        }
                    } else if (maxDigits === 2 && numberCount === 2) {
                        // 2 digits + 2 numbers: R6C3 = onesdigitanswer, R7C3 = blank
                        if (row === answerRow) {
                            console.log(`🔢 [Grid2] Page 9 (2digits+2numbers): Returning onesdigitanswer ${currentOnesdigitanswer} for R${row}C${col}`);
                            return { content: currentOnesdigitanswer.toString(), color: getColumnColor(col, maxDigits) };
                        } else if (row === additionalAnswerRow) {
                            console.log(`🔢 [Grid2] Page 9 (2digits+2numbers): Returning blank for R${row}C${col}`);
                            return { content: '', color: getColumnColor(col, maxDigits) };
                        }
                    }
                }
            } else if (currentPage === 12) {
                // Page 12 logic: Show tens column calculations in specific positions
                const tenscarry = Math.floor(calculatedOnesdigitsum / 10) * 10;
                
                // Calculate tens digits multiplied by 10
                const firstTens = Math.floor(questionData.first_number / 10) % 10;
                const secondTens = Math.floor(questionData.second_number / 10) % 10;
                const thirdTens = questionData.third_number ? Math.floor(questionData.third_number / 10) % 10 : 0;
                
                if (maxDigits === 2 && numberCount === 2) {
                    // 2-digit 2 numbers: R6C1 = tenscarry + (firstTens * 10) + (secondTens * 10)
                    if (col === 1 && row === answerRow) {
                        const tensColumnValue = tenscarry + (firstTens * 10) + (secondTens * 10);
                        console.log(`🔢 [Grid2] Page 12 (2digit+2numbers): R${row}C${col} = ${tenscarry} + ${firstTens * 10} + ${secondTens * 10} = ${tensColumnValue}`);
                        return { content: tensColumnValue.toString(), color: getColumnColor(col, maxDigits) };
                    }
                } else if (maxDigits === 3 && numberCount === 2) {
                    // 3-digit 2 numbers: R6C3 = tenscarry + (firstTens * 10) + (secondTens * 10)
                    if (col === 3 && row === answerRow) {
                        const tensColumnValue = tenscarry + (firstTens * 10) + (secondTens * 10);
                        console.log(`🔢 [Grid2] Page 12 (3digit+2numbers): R${row}C${col} = ${tenscarry} + ${firstTens * 10} + ${secondTens * 10} = ${tensColumnValue}`);
                        return { content: tensColumnValue.toString(), color: getColumnColor(col, maxDigits) };
                    }
                } else if (maxDigits === 3 && numberCount === 3) {
                    // 3-digit 3 numbers: R7C3 = tenscarry + (firstTens * 10) + (secondTens * 10) + (thirdTens * 10)
                    if (col === 3 && row === answerRow) {
                        const tensColumnValue = tenscarry + (firstTens * 10) + (secondTens * 10) + (thirdTens * 10);
                        console.log(`🔢 [Grid2] Page 12 (3digit+3numbers): R${row}C${col} = ${tenscarry} + ${firstTens * 10} + ${secondTens * 10} + ${thirdTens * 10} = ${tensColumnValue}`);
                        return { content: tensColumnValue.toString(), color: getColumnColor(col, maxDigits) };
                    }
                }
                
                // Show onesdigitanswer in ones column like other pages
                const onesColumn = maxDigits === 2 ? 3 : 5; // C3 for 2-digit, C5 for 3-digit
                if (col === onesColumn) {
                    if (maxDigits === 3 && numberCount === 3) {
                        // 3 digits + 3 numbers: R7C5 = onesdigitanswer, R8C5 = blank
                        if (row === answerRow) {
                            console.log(`🔢 [Grid2] Page 12 (3digits+3numbers): Returning onesdigitanswer ${currentOnesdigitanswer} for R${row}C${col}`);
                            return { content: currentOnesdigitanswer.toString(), color: getColumnColor(col, maxDigits) };
                        } else if (row === additionalAnswerRow) {
                            console.log(`🔢 [Grid2] Page 12 (3digits+3numbers): Returning blank for R${row}C${col}`);
                            return { content: '', color: getColumnColor(col, maxDigits) };
                        }
                    } else if (maxDigits === 3 && numberCount === 2) {
                        // 3 digits + 2 numbers: R6C5 = onesdigitanswer, R7C5 = blank
                        if (row === answerRow) {
                            console.log(`🔢 [Grid2] Page 12 (3digits+2numbers): Returning onesdigitanswer ${currentOnesdigitanswer} for R${row}C${col}`);
                            return { content: currentOnesdigitanswer.toString(), color: getColumnColor(col, maxDigits) };
                        } else if (row === additionalAnswerRow) {
                            console.log(`🔢 [Grid2] Page 12 (3digits+2numbers): Returning blank for R${row}C${col}`);
                            return { content: '', color: getColumnColor(col, maxDigits) };
                        }
                    } else if (maxDigits === 2 && numberCount === 2) {
                        // 2 digits + 2 numbers: R6C3 = onesdigitanswer, R7C3 = blank
                        if (row === answerRow) {
                            console.log(`🔢 [Grid2] Page 12 (2digits+2numbers): Returning onesdigitanswer ${currentOnesdigitanswer} for R${row}C${col}`);
                            return { content: currentOnesdigitanswer.toString(), color: getColumnColor(col, maxDigits) };
                        } else if (row === additionalAnswerRow) {
                            console.log(`🔢 [Grid2] Page 12 (2digits+2numbers): Returning blank for R${row}C${col}`);
                            return { content: '', color: getColumnColor(col, maxDigits) };
                        }
                    }
                }
            } else if (currentPage === 13) {
                // Page 13 logic: Replica of page 12 - Show tens column calculations in specific positions
                const tenscarry = Math.floor(calculatedOnesdigitsum / 10) * 10;
                
                // Calculate tens digits multiplied by 10
                const firstTens = Math.floor(questionData.first_number / 10) % 10;
                const secondTens = Math.floor(questionData.second_number / 10) % 10;
                const thirdTens = questionData.third_number ? Math.floor(questionData.third_number / 10) % 10 : 0;
                
                if (maxDigits === 2 && numberCount === 2) {
                    // 2-digit 2 numbers: R6C1 = tenscarry + (firstTens * 10) + (secondTens * 10)
                    if (col === 1 && row === answerRow) {
                        const tensColumnValue = tenscarry + (firstTens * 10) + (secondTens * 10);
                        console.log(`🔢 [Grid2] Page 13 (2digit+2numbers): R${row}C${col} = ${tenscarry} + ${firstTens * 10} + ${secondTens * 10} = ${tensColumnValue}`);
                        return { content: tensColumnValue.toString(), color: getColumnColor(col, maxDigits) };
                    }
                } else if (maxDigits === 3 && numberCount === 2) {
                    // 3-digit 2 numbers: R6C3 = hundreds carry, R7C3 = "+" + (tensdigitsum % 100)
                    if (col === 3) {
                        const tensDigitSum = tenscarry + (firstTens * 10) + (secondTens * 10);
                        if (row === answerRow) {
                            const hundredsCarry = Math.floor(tensDigitSum / 100) * 100;
                            console.log(`🔢 [Grid2] Page 13 (3digit+2numbers): R${row}C${col} = hundreds carry = ${hundredsCarry}`);
                            return { content: hundredsCarry.toString(), color: getColumnColor(col, maxDigits) };
                        } else if (row === additionalAnswerRow) {
                            const remainder = tensDigitSum % 100;
                            console.log(`🔢 [Grid2] Page 13 (3digit+2numbers): R${row}C${col} = "+" + remainder = +${remainder}`);
                            return { content: `+${remainder}`, color: getColumnColor(col, maxDigits) };
                        }
                    }
                } else if (maxDigits === 3 && numberCount === 3) {
                    // 3-digit 3 numbers: R7C3 = hundreds carry, R8C3 = "+" + (tensdigitsum % 100)
                    if (col === 3) {
                        const tensDigitSum = tenscarry + (firstTens * 10) + (secondTens * 10) + (thirdTens * 10);
                        if (row === answerRow) {
                            const hundredsCarry = Math.floor(tensDigitSum / 100) * 100;
                            console.log(`🔢 [Grid2] Page 13 (3digit+3numbers): R${row}C${col} = hundreds carry = ${hundredsCarry}`);
                            return { content: hundredsCarry.toString(), color: getColumnColor(col, maxDigits) };
                        } else if (row === additionalAnswerRow) {
                            const remainder = tensDigitSum % 100;
                            console.log(`🔢 [Grid2] Page 13 (3digit+3numbers): R${row}C${col} = "+" + remainder = +${remainder}`);
                            return { content: `+${remainder}`, color: getColumnColor(col, maxDigits) };
                        }
                    }
                }
                
                // Show onesdigitanswer in ones column like other pages
                const onesColumn = maxDigits === 2 ? 3 : 5; // C3 for 2-digit, C5 for 3-digit
                if (col === onesColumn) {
                    if (maxDigits === 3 && numberCount === 3) {
                        // 3 digits + 3 numbers: R7C5 = onesdigitanswer, R8C5 = blank
                        if (row === answerRow) {
                            console.log(`🔢 [Grid2] Page 13 (3digits+3numbers): Returning onesdigitanswer ${currentOnesdigitanswer} for R${row}C${col}`);
                            return { content: currentOnesdigitanswer.toString(), color: getColumnColor(col, maxDigits) };
                        } else if (row === additionalAnswerRow) {
                            console.log(`🔢 [Grid2] Page 13 (3digits+3numbers): Returning blank for R${row}C${col}`);
                            return { content: '', color: getColumnColor(col, maxDigits) };
                        }
                    } else if (maxDigits === 3 && numberCount === 2) {
                        // 3 digits + 2 numbers: R6C5 = onesdigitanswer, R7C5 = blank
                        if (row === answerRow) {
                            console.log(`🔢 [Grid2] Page 13 (3digits+2numbers): Returning onesdigitanswer ${currentOnesdigitanswer} for R${row}C${col}`);
                            return { content: currentOnesdigitanswer.toString(), color: getColumnColor(col, maxDigits) };
                        } else if (row === additionalAnswerRow) {
                            console.log(`🔢 [Grid2] Page 13 (3digits+2numbers): Returning blank for R${row}C${col}`);
                            return { content: '', color: getColumnColor(col, maxDigits) };
                        }
                    } else if (maxDigits === 2 && numberCount === 2) {
                        // 2 digits + 2 numbers: R6C3 = onesdigitanswer, R7C3 = blank
                        if (row === answerRow) {
                            console.log(`🔢 [Grid2] Page 13 (2digits+2numbers): Returning onesdigitanswer ${currentOnesdigitanswer} for R${row}C${col}`);
                            return { content: currentOnesdigitanswer.toString(), color: getColumnColor(col, maxDigits) };
                        } else if (row === additionalAnswerRow) {
                            console.log(`🔢 [Grid2] Page 13 (2digits+2numbers): Returning blank for R${row}C${col}`);
                            return { content: '', color: getColumnColor(col, maxDigits) };
                        }
                    }
                }
            } else if (currentPage === 14) {
                // Page 14 logic: Exact replica of page 12 - Show tens column calculations in specific positions
                const tenscarry = Math.floor(calculatedOnesdigitsum / 10) * 10;
                
                // Calculate tens digits multiplied by 10
                const firstTens = Math.floor(questionData.first_number / 10) % 10;
                const secondTens = Math.floor(questionData.second_number / 10) % 10;
                const thirdTens = questionData.third_number ? Math.floor(questionData.third_number / 10) % 10 : 0;
                
                if (maxDigits === 2 && numberCount === 2) {
                    // 2-digit 2 numbers: R6C1 = tenscarry + (firstTens * 10) + (secondTens * 10)
                    if (col === 1 && row === answerRow) {
                        const tensColumnValue = tenscarry + (firstTens * 10) + (secondTens * 10);
                        console.log(`🔢 [Grid2] Page 14 (2digit+2numbers): R${row}C${col} = ${tenscarry} + ${firstTens * 10} + ${secondTens * 10} = ${tensColumnValue}`);
                        return { content: tensColumnValue.toString(), color: getColumnColor(col, maxDigits) };
                    }
                } else if (maxDigits === 3 && numberCount === 2) {
                    // 3-digit 2 numbers: R6C3 = hundreds carry, R7C3 = "+" + (tensdigitsum % 100)
                    if (col === 3) {
                        const tensDigitSum = tenscarry + (firstTens * 10) + (secondTens * 10);
                        if (row === answerRow) {
                            const hundredsCarry = Math.floor(tensDigitSum / 100) * 100;
                            console.log(`🔢 [Grid2] Page 14 (3digit+2numbers): R${row}C${col} = hundreds carry = ${hundredsCarry}`);
                            return { content: hundredsCarry.toString(), color: getColumnColor(col, maxDigits) };
                        } else if (row === additionalAnswerRow) {
                            const remainder = tensDigitSum % 100;
                            console.log(`🔢 [Grid2] Page 14 (3digit+2numbers): R${row}C${col} = "+" + remainder = +${remainder}`);
                            return { content: `+${remainder}`, color: getColumnColor(col, maxDigits) };
                        }
                    }
                } else if (maxDigits === 3 && numberCount === 3) {
                    // 3-digit 3 numbers: R7C3 = hundreds carry, R8C3 = "+" + (tensdigitsum % 100)
                    if (col === 3) {
                        const tensDigitSum = tenscarry + (firstTens * 10) + (secondTens * 10) + (thirdTens * 10);
                        if (row === answerRow) {
                            const hundredsCarry = Math.floor(tensDigitSum / 100) * 100;
                            console.log(`🔢 [Grid2] Page 14 (3digit+3numbers): R${row}C${col} = hundreds carry = ${hundredsCarry}`);
                            return { content: hundredsCarry.toString(), color: getColumnColor(col, maxDigits) };
                        } else if (row === additionalAnswerRow) {
                            const remainder = tensDigitSum % 100;
                            console.log(`🔢 [Grid2] Page 14 (3digit+3numbers): R${row}C${col} = "+" + remainder = +${remainder}`);
                            return { content: `+${remainder}`, color: getColumnColor(col, maxDigits) };
                        }
                    }
                }
                
                // Show onesdigitanswer in ones column like other pages
                const onesColumn = maxDigits === 2 ? 3 : 5; // C3 for 2-digit, C5 for 3-digit
                if (col === onesColumn) {
                    if (maxDigits === 3 && numberCount === 3) {
                        // 3 digits + 3 numbers: R7C5 = onesdigitanswer, R8C5 = blank
                        if (row === answerRow) {
                            console.log(`🔢 [Grid2] Page 14 (3digits+3numbers): Returning onesdigitanswer ${currentOnesdigitanswer} for R${row}C${col}`);
                            return { content: currentOnesdigitanswer.toString(), color: getColumnColor(col, maxDigits) };
                        } else if (row === additionalAnswerRow) {
                            console.log(`🔢 [Grid2] Page 14 (3digits+3numbers): Returning blank for R${row}C${col}`);
                            return { content: '', color: getColumnColor(col, maxDigits) };
                        }
                    } else if (maxDigits === 3 && numberCount === 2) {
                        // 3 digits + 2 numbers: R6C5 = onesdigitanswer, R7C5 = blank
                        if (row === answerRow) {
                            console.log(`🔢 [Grid2] Page 14 (3digits+2numbers): Returning onesdigitanswer ${currentOnesdigitanswer} for R${row}C${col}`);
                            return { content: currentOnesdigitanswer.toString(), color: getColumnColor(col, maxDigits) };
                        } else if (row === additionalAnswerRow) {
                            console.log(`🔢 [Grid2] Page 14 (3digits+2numbers): Returning blank for R${row}C${col}`);
                            return { content: '', color: getColumnColor(col, maxDigits) };
                        }
                    } else if (maxDigits === 2 && numberCount === 2) {
                        // 2 digits + 2 numbers: R6C3 = onesdigitanswer, R7C3 = blank
                        if (row === answerRow) {
                            console.log(`🔢 [Grid2] Page 14 (2digits+2numbers): Returning onesdigitanswer ${currentOnesdigitanswer} for R${row}C${col}`);
                            return { content: currentOnesdigitanswer.toString(), color: getColumnColor(col, maxDigits) };
                        } else if (row === additionalAnswerRow) {
                            console.log(`🔢 [Grid2] Page 14 (2digits+2numbers): Returning blank for R${row}C${col}`);
                            return { content: '', color: getColumnColor(col, maxDigits) };
                        }
                    }
                }
            } else if (currentPage === 15 || currentPage === 16 || currentPage === 17) {
                // Page 15, 16, and 17 logic: Modified display for tens column calculations
                const tenscarry = Math.floor(calculatedOnesdigitsum / 10) * 10;
                
                // Calculate tens digits multiplied by 10
                const firstTens = Math.floor(questionData.first_number / 10) % 10;
                const secondTens = Math.floor(questionData.second_number / 10) % 10;
                const thirdTens = questionData.third_number ? Math.floor(questionData.third_number / 10) % 10 : 0;
                
                // Calculate tensdigitsum for all cases
                const tensDigitSum = tenscarry + (firstTens * 10) + (secondTens * 10) + (thirdTens * 10);
                
                if (maxDigits === 2 && numberCount === 2) {
                    // 2-digit 2 numbers: R6C1 = tenscarry + (firstTens * 10) + (secondTens * 10)
                    if (col === 1 && row === answerRow) {
                        const tensColumnValue = tenscarry + (firstTens * 10) + (secondTens * 10);
                        console.log(`🔢 [Grid2] Page 15 (2digit+2numbers): R${row}C${col} = ${tenscarry} + ${firstTens * 10} + ${secondTens * 10} = ${tensColumnValue}`);
                        return { content: tensColumnValue.toString(), color: getColumnColor(col, maxDigits) };
                    }
                } else if (maxDigits === 3 && numberCount === 2) {
                    // 3-digit 2 numbers: R6C3 = tensdigitsum%100, R7C3 = empty
                    if (col === 3) {
                        if (row === answerRow) {
                            const remainder = tensDigitSum % 100;
                            console.log(`🔢 [Grid2] Page 15 (3digit+2numbers): R${row}C${col} = tensdigitsum%100 = ${remainder}`);
                            return { content: remainder.toString(), color: getColumnColor(col, maxDigits) };
                        } else if (row === additionalAnswerRow) {
                            console.log(`🔢 [Grid2] Page 15 (3digit+2numbers): R${row}C${col} = empty`);
                            return { content: '', color: getColumnColor(col, maxDigits) };
                        }
                    }
                } else if (maxDigits === 3 && numberCount === 3) {
                    // 3-digit 3 numbers: R7C3 = tensdigitsum%100, R8C3 = empty
                    if (col === 3) {
                        if (row === answerRow) {
                            const remainder = tensDigitSum % 100;
                            console.log(`🔢 [Grid2] Page 15 (3digit+3numbers): R${row}C${col} = tensdigitsum%100 = ${remainder}`);
                            return { content: remainder.toString(), color: getColumnColor(col, maxDigits) };
                        } else if (row === additionalAnswerRow) {
                            console.log(`🔢 [Grid2] Page 15 (3digit+3numbers): R${row}C${col} = empty`);
                            return { content: '', color: getColumnColor(col, maxDigits) };
                        }
                    }
                }
                
                // Show onesdigitanswer in ones column like other pages
                const onesColumn = maxDigits === 2 ? 3 : 5; // C3 for 2-digit, C5 for 3-digit
                if (col === onesColumn) {
                    if (maxDigits === 3 && numberCount === 3) {
                        // 3 digits + 3 numbers: R7C5 = onesdigitanswer, R8C5 = blank
                        if (row === answerRow) {
                            console.log(`🔢 [Grid2] Page 15 (3digits+3numbers): Returning onesdigitanswer ${currentOnesdigitanswer} for R${row}C${col}`);
                            return { content: currentOnesdigitanswer.toString(), color: getColumnColor(col, maxDigits) };
                        } else if (row === additionalAnswerRow) {
                            console.log(`🔢 [Grid2] Page 15 (3digits+3numbers): Returning blank for R${row}C${col}`);
                            return { content: '', color: getColumnColor(col, maxDigits) };
                        }
                    } else if (maxDigits === 3 && numberCount === 2) {
                        // 3 digits + 2 numbers: R6C5 = onesdigitanswer, R7C5 = blank
                        if (row === answerRow) {
                            console.log(`🔢 [Grid2] Page 15 (3digits+2numbers): Returning onesdigitanswer ${currentOnesdigitanswer} for R${row}C${col}`);
                            return { content: currentOnesdigitanswer.toString(), color: getColumnColor(col, maxDigits) };
                        } else if (row === additionalAnswerRow) {
                            console.log(`🔢 [Grid2] Page 15 (3digits+2numbers): Returning blank for R${row}C${col}`);
                            return { content: '', color: getColumnColor(col, maxDigits) };
                        }
                    } else if (maxDigits === 2 && numberCount === 2) {
                        // 2 digits + 2 numbers: R6C3 = onesdigitanswer, R7C3 = blank
                        if (row === answerRow) {
                            console.log(`🔢 [Grid2] Page 15 (2digits+2numbers): Returning onesdigitanswer ${currentOnesdigitanswer} for R${row}C${col}`);
                            return { content: currentOnesdigitanswer.toString(), color: getColumnColor(col, maxDigits) };
                        } else if (row === additionalAnswerRow) {
                            console.log(`🔢 [Grid2] Page 15 (2digits+2numbers): Returning blank for R${row}C${col}`);
                            return { content: '', color: getColumnColor(col, maxDigits) };
                        }
                    }
                }
            } else if (currentPage === 18) {
                // Page 18 specific logic: C1 calculations for hundreds column
                const tenscarry = Math.floor(calculatedOnesdigitsum / 10) * 10;
                
                // Calculate tens digits multiplied by 10
                const firstTens = Math.floor(questionData.first_number / 10) % 10;
                const secondTens = Math.floor(questionData.second_number / 10) % 10;
                const thirdTens = questionData.third_number ? Math.floor(questionData.third_number / 10) % 10 : 0;
                
                // Calculate tensdigitsum for hundreds carry calculation
                const tensDigitSum = tenscarry + (firstTens * 10) + (secondTens * 10) + (thirdTens * 10);
                const hundredsCarry = Math.floor(tensDigitSum / 100) * 100;
                
                // Calculate hundreds digits multiplied by 100
                const firstHundreds = Math.floor(questionData.first_number / 100) * 100;
                const secondHundreds = Math.floor(questionData.second_number / 100) * 100;
                const thirdHundreds = questionData.third_number ? Math.floor(questionData.third_number / 100) * 100 : 0;
                
                if (maxDigits === 3 && numberCount === 2) {
                    // 3-digit 2 numbers: R6C1 = hundreds carry + first hundreds + second hundreds
                    if (col === 1 && row === answerRow) {
                        const hundredsColumnValue = hundredsCarry + firstHundreds + secondHundreds;
                        console.log(`🔢 [Grid2] Page 18 (3digit+2numbers): R${row}C${col} = ${hundredsCarry} + ${firstHundreds} + ${secondHundreds} = ${hundredsColumnValue}`);
                        return { content: hundredsColumnValue.toString(), color: getColumnColor(col, maxDigits) };
                    }
                } else if (maxDigits === 3 && numberCount === 3) {
                    // 3-digit 3 numbers: R7C1 = hundreds carry + first hundreds + second hundreds + third hundreds
                    if (col === 1 && row === answerRow) {
                        const hundredsColumnValue = hundredsCarry + firstHundreds + secondHundreds + thirdHundreds;
                        console.log(`🔢 [Grid2] Page 18 (3digit+3numbers): R${row}C${col} = ${hundredsCarry} + ${firstHundreds} + ${secondHundreds} + ${thirdHundreds} = ${hundredsColumnValue}`);
                        return { content: hundredsColumnValue.toString(), color: getColumnColor(col, maxDigits) };
                    }
                }
                
                // Show tens column calculations like pages 15-17 for other columns
                if (maxDigits === 3 && numberCount === 2) {
                    // 3-digit 2 numbers: R6C3 = tensdigitsum%100, R7C3 = empty
                    if (col === 3) {
                        if (row === answerRow) {
                            const remainder = tensDigitSum % 100;
                            console.log(`🔢 [Grid2] Page 18 (3digit+2numbers): R${row}C${col} = tensdigitsum%100 = ${remainder}`);
                            return { content: remainder.toString(), color: getColumnColor(col, maxDigits) };
                        } else if (row === additionalAnswerRow) {
                            console.log(`🔢 [Grid2] Page 18 (3digit+2numbers): R${row}C${col} = empty`);
                            return { content: '', color: getColumnColor(col, maxDigits) };
                        }
                    }
                } else if (maxDigits === 3 && numberCount === 3) {
                    // 3-digit 3 numbers: R7C3 = tensdigitsum%100, R8C3 = empty
                    if (col === 3) {
                        if (row === answerRow) {
                            const remainder = tensDigitSum % 100;
                            console.log(`🔢 [Grid2] Page 18 (3digit+3numbers): R${row}C${col} = tensdigitsum%100 = ${remainder}`);
                            return { content: remainder.toString(), color: getColumnColor(col, maxDigits) };
                        } else if (row === additionalAnswerRow) {
                            console.log(`🔢 [Grid2] Page 18 (3digit+3numbers): R${row}C${col} = empty`);
                            return { content: '', color: getColumnColor(col, maxDigits) };
                        }
                    }
                }
                
                // Show onesdigitanswer in ones column like other pages
                const onesColumn = maxDigits === 2 ? 3 : 5; // C3 for 2-digit, C5 for 3-digit
                if (col === onesColumn) {
                    if (maxDigits === 3 && numberCount === 3) {
                        // 3 digits + 3 numbers: R7C5 = onesdigitanswer, R8C5 = blank
                        if (row === answerRow) {
                            console.log(`🔢 [Grid2] Page 18 (3digits+3numbers): Returning onesdigitanswer ${currentOnesdigitanswer} for R${row}C${col}`);
                            return { content: currentOnesdigitanswer.toString(), color: getColumnColor(col, maxDigits) };
                        } else if (row === additionalAnswerRow) {
                            console.log(`🔢 [Grid2] Page 18 (3digits+3numbers): Returning blank for R${row}C${col}`);
                            return { content: '', color: getColumnColor(col, maxDigits) };
                        }
                    } else if (maxDigits === 3 && numberCount === 2) {
                        // 3 digits + 2 numbers: R6C5 = onesdigitanswer, R7C5 = blank
                        if (row === answerRow) {
                            console.log(`🔢 [Grid2] Page 18 (3digits+2numbers): Returning onesdigitanswer ${currentOnesdigitanswer} for R${row}C${col}`);
                            return { content: currentOnesdigitanswer.toString(), color: getColumnColor(col, maxDigits) };
                        } else if (row === additionalAnswerRow) {
                            console.log(`🔢 [Grid2] Page 18 (3digits+2numbers): Returning blank for R${row}C${col}`);
                            return { content: '', color: getColumnColor(col, maxDigits) };
                        }
                                         }
                 }
            } else if (currentPage === 19 || currentPage === 20) {
                // Page 19 and 20 specific logic: C1 calculations for hundreds column (same as page 18)
                const tenscarry = Math.floor(calculatedOnesdigitsum / 10) * 10;
                
                // Calculate tens digits multiplied by 10
                const firstTens = Math.floor(questionData.first_number / 10) % 10;
                const secondTens = Math.floor(questionData.second_number / 10) % 10;
                const thirdTens = questionData.third_number ? Math.floor(questionData.third_number / 10) % 10 : 0;
                
                // Calculate tensdigitsum for hundreds carry calculation
                const tensDigitSum = tenscarry + (firstTens * 10) + (secondTens * 10) + (thirdTens * 10);
                const hundredsCarry = Math.floor(tensDigitSum / 100) * 100;
                
                // Calculate hundreds digits multiplied by 100
                const firstHundreds = Math.floor(questionData.first_number / 100) * 100;
                const secondHundreds = Math.floor(questionData.second_number / 100) * 100;
                const thirdHundreds = questionData.third_number ? Math.floor(questionData.third_number / 100) * 100 : 0;
                
                if (maxDigits === 3 && numberCount === 2) {
                    // 3-digit 2 numbers: R6C1 = hundreds carry + first hundreds + second hundreds
                    if (col === 1 && row === answerRow) {
                        const hundredsColumnValue = hundredsCarry + firstHundreds + secondHundreds;
                        console.log(`🔢 [Grid2] Page ${currentPage} (3digit+2numbers): R${row}C${col} = ${hundredsCarry} + ${firstHundreds} + ${secondHundreds} = ${hundredsColumnValue}`);
                        return { content: hundredsColumnValue.toString(), color: getColumnColor(col, maxDigits) };
                    }
                } else if (maxDigits === 3 && numberCount === 3) {
                    // 3-digit 3 numbers: R7C1 = hundreds carry + first hundreds + second hundreds + third hundreds
                    if (col === 1 && row === answerRow) {
                        const hundredsColumnValue = hundredsCarry + firstHundreds + secondHundreds + thirdHundreds;
                        console.log(`🔢 [Grid2] Page ${currentPage} (3digit+3numbers): R${row}C${col} = ${hundredsCarry} + ${firstHundreds} + ${secondHundreds} + ${thirdHundreds} = ${hundredsColumnValue}`);
                        return { content: hundredsColumnValue.toString(), color: getColumnColor(col, maxDigits) };
                    }
                }
                
                // Show tens column calculations like pages 15-18 for other columns
                if (maxDigits === 3 && numberCount === 2) {
                    // 3-digit 2 numbers: R6C3 = tensdigitsum%100, R7C3 = empty
                    if (col === 3) {
                        if (row === answerRow) {
                            const remainder = tensDigitSum % 100;
                            console.log(`🔢 [Grid2] Page ${currentPage} (3digit+2numbers): R${row}C${col} = tensdigitsum%100 = ${remainder}`);
                            return { content: remainder.toString(), color: getColumnColor(col, maxDigits) };
                        } else if (row === additionalAnswerRow) {
                            console.log(`🔢 [Grid2] Page ${currentPage} (3digit+2numbers): R${row}C${col} = empty`);
                            return { content: '', color: getColumnColor(col, maxDigits) };
                        }
                    }
                } else if (maxDigits === 3 && numberCount === 3) {
                    // 3-digit 3 numbers: R7C3 = tensdigitsum%100, R8C3 = empty
                    if (col === 3) {
                        if (row === answerRow) {
                            const remainder = tensDigitSum % 100;
                            console.log(`🔢 [Grid2] Page ${currentPage} (3digit+3numbers): R${row}C${col} = tensdigitsum%100 = ${remainder}`);
                            return { content: remainder.toString(), color: getColumnColor(col, maxDigits) };
                        } else if (row === additionalAnswerRow) {
                            console.log(`🔢 [Grid2] Page ${currentPage} (3digit+3numbers): R${row}C${col} = empty`);
                            return { content: '', color: getColumnColor(col, maxDigits) };
                        }
                    }
                }
                
                // Page 20 specific: Add plus signs in answer rows
                if (currentPage === 20) {
                    if (maxDigits === 3 && numberCount === 3) {
                        // 3-digit 3-numbers: R7C2 and R7C4 = "+"
                        if (row === answerRow && (col === 2 || col === 4)) {
                            console.log(`🔢 [Grid2] Page ${currentPage} (3digits+3numbers): Returning "+" for R${row}C${col}`);
                            return { content: '+', color: getColumnColor(col, maxDigits) };
                        }
                    } else if (maxDigits === 3 && numberCount === 2) {
                        // 3-digit 2-numbers: R6C2 and R6C4 = "+"
                        if (row === answerRow && (col === 2 || col === 4)) {
                            console.log(`🔢 [Grid2] Page ${currentPage} (3digits+2numbers): Returning "+" for R${row}C${col}`);
                            return { content: '+', color: getColumnColor(col, maxDigits) };
                        }
                    }
                }
                
                // Show onesdigitanswer in ones column like other pages
                const onesColumn = maxDigits === 2 ? 3 : 5; // C3 for 2-digit, C5 for 3-digit
                if (col === onesColumn) {
                    if (maxDigits === 3 && numberCount === 3) {
                        // 3 digits + 3 numbers: R7C5 = onesdigitanswer, R8C5 = blank
                        if (row === answerRow) {
                            console.log(`🔢 [Grid2] Page ${currentPage} (3digits+3numbers): Returning onesdigitanswer ${currentOnesdigitanswer} for R${row}C${col}`);
                            return { content: currentOnesdigitanswer.toString(), color: getColumnColor(col, maxDigits) };
                        } else if (row === additionalAnswerRow) {
                            console.log(`🔢 [Grid2] Page ${currentPage} (3digits+3numbers): Returning blank for R${row}C${col}`);
                            return { content: '', color: getColumnColor(col, maxDigits) };
                        }
                    } else if (maxDigits === 3 && numberCount === 2) {
                        // 3 digits + 2 numbers: R6C5 = onesdigitanswer, R7C5 = blank
                        if (row === answerRow) {
                            console.log(`🔢 [Grid2] Page ${currentPage} (3digits+2numbers): Returning onesdigitanswer ${currentOnesdigitanswer} for R${row}C${col}`);
                            return { content: currentOnesdigitanswer.toString(), color: getColumnColor(col, maxDigits) };
                        } else if (row === additionalAnswerRow) {
                            console.log(`🔢 [Grid2] Page ${currentPage} (3digits+2numbers): Returning blank for R${row}C${col}`);
                            return { content: '', color: getColumnColor(col, maxDigits) };
                        }
                    }
                }
            }
            
            // TODO: Calculate actual answer for other cells
            return { content: '', color: getColumnColor(col, maxDigits) };
        }
        
        return { content: '', color: '' };
    },
    
    // Test function to verify page 6 onesdigitsum calculations
    testPage6OnesdigitSum: () => {
        console.log('🧪 [Grid2] Testing Page 6 Onesdigitsum Calculations...');
        console.log('=====================================================');
        
        const testCases = [
            { name: "267 + 185", data: { first_number: 267, second_number: 185 }, expected: 12, expectedPos: "R6C5" },
            { name: "123 + 234", data: { first_number: 123, second_number: 234 }, expected: 7, expectedPos: "R6C5" },
            { name: "27 + 18", data: { first_number: 27, second_number: 18 }, expected: 15, expectedPos: "R6C3" },
            { name: "12 + 23", data: { first_number: 12, second_number: 23 }, expected: 5, expectedPos: "R6C3" }
        ];
        
        testCases.forEach(testCase => {
            console.log(`\n📋 Testing: ${testCase.name}`);
            
            const dimensions = Grid2Utils.calculateGridDimensions(testCase.data, 6);
            
            // Calculate expected row and column
            const answerRow = 4 + dimensions.numberCount; // 4 + 2 = 6 for both cases
            const onesColumn = dimensions.maxDigits === 2 ? 3 : 5;
            const expectedPosition = `R${answerRow}C${onesColumn}`;
            
            // Test the getCellContent function
            const result = Grid2Utils.getCellContent(answerRow, onesColumn, testCase.data, dimensions, 6, 0);
            
            console.log(`   Numbers: ${testCase.data.first_number} + ${testCase.data.second_number}`);
            console.log(`   Max Digits: ${dimensions.maxDigits}`);
            console.log(`   Expected Position: ${expectedPosition} (actual: ${testCase.expectedPos})`);
            console.log(`   Expected Value: ${testCase.expected}`);
            console.log(`   Actual Value: ${result.content}`);
            console.log(`   Result: ${result.content == testCase.expected ? '✅ PASS' : '❌ FAIL'}`);
        });
        
        console.log('\n✅ [Grid2] Page 6 testing completed!');
    },
    
    // Debug function to see what's happening with Grid2 on current page
    debugCurrentGrid2: () => {
        console.log('🔍 [Grid2] Debugging Current Grid2 State...');
        console.log('============================================');
        
        // Try to get current page
        const currentPage = typeof window !== 'undefined' && window.getCurrentPage ? window.getCurrentPage() : 'unknown';
        console.log(`Current Page: ${currentPage}`);
        
        // Try to get Grid2 element for various pages
        for (let page = 1; page <= 8; page++) {
            const gridElement = GridPositionUtils.getPageElement(page, 'grid2');
            if (gridElement) {
                console.log(`\nPage ${page} Grid2 found:`);
                console.log(`  Grid Structure: ${gridElement.props.gridStructure.rows}x${gridElement.props.gridStructure.columns}`);
                console.log(`  Question Data:`, gridElement.props.questionData);
                console.log(`  Grid Dimensions:`, gridElement.props.gridDimensions);
                
                if (gridElement.props.questionData && page === 6) {
                    console.log(`\n🔬 Testing Page 6 Grid2 getCellContent:`);
                    const qData = gridElement.props.questionData;
                    const dims = gridElement.props.gridDimensions;
                    
                    if (dims) {
                        const answerRow = 4 + dims.numberCount;
                        const onesColumn = dims.maxDigits === 2 ? 3 : 5;
                        
                        console.log(`  Testing cell R${answerRow}C${onesColumn}`);
                        
                        if (gridElement.props.getCellContent) {
                            const result = gridElement.props.getCellContent(answerRow, onesColumn);
                            console.log(`  Result:`, result);
                        } else {
                            console.log(`  No getCellContent function found`);
                        }
                    }
                }
            }
        }
    },
    
    // Simple test to verify the getCellContent function works correctly
    testGetCellContent: () => {
        console.log('🔬 [Grid2] Testing getCellContent Function Directly...');
        console.log('======================================================');
        
        const testCases = [
            { name: "267 + 185", data: { first_number: 267, second_number: 185 }, expected: 12, expectedPos: "R6C5" },
            { name: "123 + 234", data: { first_number: 123, second_number: 234 }, expected: 7, expectedPos: "R6C5" },
            { name: "27 + 18", data: { first_number: 27, second_number: 18 }, expected: 15, expectedPos: "R6C3" },
            { name: "12 + 23", data: { first_number: 12, second_number: 23 }, expected: 5, expectedPos: "R6C3" }
        ];
        
        testCases.forEach(testCase => {
            console.log(`\n📋 Testing: ${testCase.name}`);
            
            const dimensions = Grid2Utils.calculateGridDimensions(testCase.data, 6);
            const answerRow = 4 + dimensions.numberCount;
            const onesColumn = dimensions.maxDigits === 2 ? 3 : 5;
            
            console.log(`  Dimensions: ${dimensions.rows}x${dimensions.columns}, maxDigits: ${dimensions.maxDigits}, numberCount: ${dimensions.numberCount}`);
            console.log(`  Expected position: R${answerRow}C${onesColumn}`);
            
            // Test the getCellContent function directly
            const result = Grid2Utils.getCellContent(answerRow, onesColumn, testCase.data, dimensions, 6, 0);
            
            console.log(`  Expected value: ${testCase.expected}`);
            console.log(`  Actual result:`, result);
            console.log(`  Status: ${result.content == testCase.expected ? '✅ PASS' : '❌ FAIL'}`);
        });
        
        console.log('\n✅ Direct getCellContent test completed!');
    },
    
    // Test function to demonstrate grid2 permutations
    testPermutations: () => {
        console.log('🧪 [Grid2] Testing all permutations...');
        
        const testCases = [
            // 2-digit numbers, no carry
            { name: "2-digit, no carry", data: { first_number: 12, second_number: 23 } },
            
            // 2-digit numbers, with carry
            { name: "2-digit, with carry", data: { first_number: 29, second_number: 37 } },
            
            // 3-digit numbers, no carry
            { name: "3-digit, no carry", data: { first_number: 111, second_number: 222 } },
            
            // 3-digit numbers, with carry
            { name: "3-digit, with carry", data: { first_number: 143, second_number: 278, third_number: 396 } },
            
            // Mixed digit lengths
            { name: "Mixed digits", data: { first_number: 9, second_number: 456 } },
            
            // Large numbers with multiple carries
            { name: "Multiple carries", data: { first_number: 999, second_number: 888, third_number: 777 } }
        ];
        
        testCases.forEach(testCase => {
            console.log(`\n📋 [Grid2] Test: ${testCase.name}`);
            console.log(`   Numbers: ${Object.values(testCase.data).join(' + ')}`);
            
            const dimensions = Grid2Utils.calculateGridDimensions(testCase.data, 6); // Use page 6 as default for tests
            console.log(`   Grid: ${dimensions.rows} rows × ${dimensions.columns} columns`);
            console.log(`   Has carries: ${dimensions.hasCarries}`);
            console.log(`   Layout structure:`);
            
            // Show row structure
            let currentRow = 1;
            console.log(`     Row ${currentRow}: Header (blank)`);
            currentRow++;
            
            console.log(`     Row ${currentRow}: Carry row (H, T, O)`);
            currentRow++;
            
            for (let i = 0; i < dimensions.numberCount; i++) {
                const numbers = Object.values(testCase.data);
                console.log(`     Row ${currentRow}: ${numbers[i]} ${i > 0 ? '(with +)' : ''}`);
                currentRow++;
            }
            
            console.log(`     Row ${currentRow}: Separator line`);
            currentRow++;
            
            console.log(`     Row ${currentRow}: Answer`);
            currentRow++;
            
            if (dimensions.actualCarries) {
                console.log(`     Row ${currentRow}: Additional answer (carry handling)`);
            }
        });
        
        console.log('\n✅ [Grid2] All permutations tested!');
    },
    
    // Debug function for page 9 and 10 border issues
    debugPage9Borders: () => {
        const currentPage = typeof window !== 'undefined' && window.getCurrentPage ? window.getCurrentPage() : 9;
        console.log(`🔧 [Grid2 Debug] Page ${currentPage} Border Debug Report`);
        console.log('===========================================');
        
        // Get current page Grid2 element
        const pageGrid2 = GridPositionUtils.getPageElement(currentPage, 'grid2');
        if (!pageGrid2) {
            console.error(`🔧 [Grid2 Debug] Page ${currentPage} Grid2 element not found!`);
            return false;
        }
        
        console.log(`🔧 [Grid2 Debug] Page ${currentPage} Grid2 element found`);
        console.log('🔧 [Grid2 Debug] Current cellOverrides:', pageGrid2.props.cellOverrides);
        
        // Check the specific border cells
        const borderCells = ['2,1', '2,3'];
        borderCells.forEach(cellKey => {
            if (pageGrid2.props.cellOverrides && pageGrid2.props.cellOverrides[cellKey]) {
                console.log(`🔧 [Grid2 Debug] ✅ Found cellOverride for ${cellKey}:`, pageGrid2.props.cellOverrides[cellKey]);
            } else {
                console.log(`🔧 [Grid2 Debug] ❌ Missing cellOverride for ${cellKey}`);
            }
        });
        
        // Test the getCellStyle function if it exists
        if (pageGrid2.props.getCellStyle) {
            console.log('🔧 [Grid2 Debug] Testing getCellStyle function:');
            console.log('  R2C1 style:', pageGrid2.props.getCellStyle(2, 1));
            console.log('  R2C3 style:', pageGrid2.props.getCellStyle(2, 3));
        } else {
            console.log('🔧 [Grid2 Debug] getCellStyle function not available');
        }
        
        // Test cell content for tenscarry
        if (pageGrid2.props.getCellContent) {
            console.log('🔧 [Grid2 Debug] Testing getCellContent for tenscarry cells:');
            console.log('  R2C1 content:', pageGrid2.props.getCellContent(2, 1));
            console.log('  R2C3 content:', pageGrid2.props.getCellContent(2, 3));
        } else {
            console.log('🔧 [Grid2 Debug] getCellContent function not available');
        }
        
        // Check grid dimensions and question data
        if (pageGrid2.props.questionData && pageGrid2.props.gridDimensions) {
            console.log('🔧 [Grid2 Debug] Question data:', pageGrid2.props.questionData);
            console.log('🔧 [Grid2 Debug] Grid dimensions:', pageGrid2.props.gridDimensions);
            
            // Calculate onesdigitsum for debugging
            let onesdigitsum = 0;
            if (pageGrid2.props.questionData.first_number) onesdigitsum += pageGrid2.props.questionData.first_number % 10;
            if (pageGrid2.props.questionData.second_number) onesdigitsum += pageGrid2.props.questionData.second_number % 10;
            if (pageGrid2.props.questionData.third_number) onesdigitsum += pageGrid2.props.questionData.third_number % 10;
            
            const tenscarry = Math.floor(onesdigitsum / 10) * 10;
            console.log(`🔧 [Grid2 Debug] Calculated onesdigitsum: ${onesdigitsum}, tenscarry: ${tenscarry}`);
            console.log(`🔧 [Grid2 Debug] Expected tenscarry position: ${pageGrid2.props.gridDimensions.maxDigits === 2 ? 'R2C1' : 'R2C3'}`);
        } else {
            console.log('🔧 [Grid2 Debug] Missing question data or grid dimensions');
        }
        
        // Check DOM elements for actual applied styles
        console.log('🔧 [Grid2 Debug] Checking DOM elements...');
        const grid2Container = document.querySelector('[data-grid-position="grid2"]');
        if (grid2Container) {
            console.log('🔧 [Grid2 Debug] Found Grid2 DOM container');
            
            // Look for grid cells
            const gridCells = grid2Container.querySelectorAll('[data-row][data-col]');
            console.log(`🔧 [Grid2 Debug] Found ${gridCells.length} grid cells`);
            
            // Check specific border cells using correct selectors
            const r2c1Cell = grid2Container.querySelector('[data-cell="cell_2_1"]');
            const r2c3Cell = grid2Container.querySelector('[data-cell="cell_2_3"]');
            
            if (r2c1Cell) {
                const r2c1Styles = window.getComputedStyle(r2c1Cell);
                console.log('🔧 [Grid2 Debug] R2C1 DOM border:', r2c1Styles.border);
                console.log('🔧 [Grid2 Debug] R2C1 DOM border-color:', r2c1Styles.borderColor);
                console.log('🔧 [Grid2 Debug] R2C1 DOM border-width:', r2c1Styles.borderWidth);
            } else {
                console.log('🔧 [Grid2 Debug] ❌ R2C1 DOM element not found');
            }
            
            if (r2c3Cell) {
                const r2c3Styles = window.getComputedStyle(r2c3Cell);
                console.log('🔧 [Grid2 Debug] R2C3 DOM border:', r2c3Styles.border);
                console.log('🔧 [Grid2 Debug] R2C3 DOM border-color:', r2c3Styles.borderColor);
                console.log('🔧 [Grid2 Debug] R2C3 DOM border-width:', r2c3Styles.borderWidth);
            } else {
                console.log('🔧 [Grid2 Debug] ❌ R2C3 DOM element not found');
            }
            
            // List all cells with their data attributes
            gridCells.forEach((cell, index) => {
                const cellData = cell.getAttribute('data-cell');
                const computedStyles = window.getComputedStyle(cell);
                if (cellData === 'cell_2_1' || cellData === 'cell_2_3') {
                    console.log(`🔧 [Grid2 Debug] Cell ${cellData} - border: ${computedStyles.border}, classes: ${cell.className}`);
                }
            });
            
        } else {
            console.log('🔧 [Grid2 Debug] ❌ Grid2 DOM container not found');
            
            // Try alternative selectors
            const alternativeSelectors = [
                '[data-grid-element="grid2"]',
                '.grid2',
                '[data-element="grid2"]',
                '.grid-container[data-name="grid2"]'
            ];
            
            alternativeSelectors.forEach(selector => {
                const element = document.querySelector(selector);
                if (element) {
                    console.log(`🔧 [Grid2 Debug] Found Grid2 with selector: ${selector}`);
                }
            });
        }
        
        console.log('🔧 [Grid2 Debug] End of Page 9 Border Debug Report');
        return true;
    },
    
    // Inspect DOM structure for Grid2 debugging
    inspectGrid2DOM: () => {
        console.log('🔍 [Grid2 DOM] Inspecting DOM structure...');
        console.log('=======================================');
        
        // Try multiple selectors to find the grid
        const possibleSelectors = [
            '[data-grid-position="grid2"]',
            '[data-grid-element="grid2"]', 
            '[data-element="grid2"]',
            '.grid2',
            '.grid-container[data-name="grid2"]',
            '[data-grid-name="grid2"]'
        ];
        
        let foundContainer = null;
        possibleSelectors.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                console.log(`🔍 [Grid2 DOM] ✅ Found container with: ${selector}`);
                if (!foundContainer) foundContainer = element;
            } else {
                console.log(`🔍 [Grid2 DOM] ❌ Not found with: ${selector}`);
            }
        });
        
        if (foundContainer) {
            console.log('🔍 [Grid2 DOM] Container element:', foundContainer);
            console.log('🔍 [Grid2 DOM] Container classes:', foundContainer.className);
            console.log('🔍 [Grid2 DOM] Container attributes:');
            
            for (let attr of foundContainer.attributes) {
                console.log(`  ${attr.name}="${attr.value}"`);
            }
            
            // Look for child elements
            const children = foundContainer.children;
            console.log(`🔍 [Grid2 DOM] Found ${children.length} child elements`);
            
            Array.from(children).forEach((child, index) => {
                console.log(`🔍 [Grid2 DOM] Child ${index}:`, child.tagName, child.className);
                
                // Look for data attributes that might indicate row/col
                for (let attr of child.attributes) {
                    if (attr.name.includes('row') || attr.name.includes('col') || attr.name.includes('cell')) {
                        console.log(`    ${attr.name}="${attr.value}"`);
                    }
                }
                
                // Check if this child has grid cells
                const grandChildren = child.children;
                if (grandChildren.length > 0) {
                    console.log(`    Has ${grandChildren.length} grandchildren`);
                    Array.from(grandChildren).slice(0, 5).forEach((grandChild, gIndex) => {
                        const hasRowCol = grandChild.hasAttribute('data-row') || grandChild.hasAttribute('data-col');
                        if (hasRowCol) {
                            console.log(`      GrandChild ${gIndex}: R${grandChild.getAttribute('data-row')}C${grandChild.getAttribute('data-col')}`);
                        }
                    });
                }
            });
            
            // Look specifically for cell-like elements
            const cellSelectors = [
                '[data-row][data-col]',
                '.grid-cell',
                '.cell',
                '[class*="cell"]',
                '[class*="grid"]'
            ];
            
            cellSelectors.forEach(selector => {
                const cells = foundContainer.querySelectorAll(selector);
                if (cells.length > 0) {
                    console.log(`🔍 [Grid2 DOM] Found ${cells.length} elements with: ${selector}`);
                    
                    // Show first few cells
                    Array.from(cells).slice(0, 3).forEach((cell, index) => {
                        console.log(`  Cell ${index}:`, cell.tagName, cell.className);
                        const row = cell.getAttribute('data-row');
                        const col = cell.getAttribute('data-col');
                        if (row && col) {
                            console.log(`    Position: R${row}C${col}`);
                        }
                    });
                }
            });
            
        } else {
            console.log('🔍 [Grid2 DOM] ❌ No Grid2 container found with any selector');
            
            // Show all elements with "grid" in their attributes or classes
            const allGridElements = document.querySelectorAll('[class*="grid"], [data-grid], [data-element*="grid"]');
            console.log(`🔍 [Grid2 DOM] Found ${allGridElements.length} grid-related elements in document`);
            
            Array.from(allGridElements).forEach((el, index) => {
                console.log(`  Grid element ${index}:`, el.tagName, el.className);
                for (let attr of el.attributes) {
                    if (attr.name.includes('grid') || attr.name.includes('data-')) {
                        console.log(`    ${attr.name}="${attr.value}"`);
                    }
                }
            });
        }
        
        console.log('🔍 [Grid2 DOM] End of DOM inspection');
        return foundContainer;
    },
    
    // Force apply border styles directly to DOM (debugging tool)
    forceApplyPage9Borders: () => {
        console.log('🔧 [Grid2 Debug] Force applying Page 9 borders to DOM...');
        
        const grid2Container = document.querySelector('[data-grid-position="grid2"]');
        if (!grid2Container) {
            console.log('🔧 [Grid2 Debug] ❌ Grid2 container not found for direct styling');
            return false;
        }
        
        // Try to find and style the border cells directly using correct selectors
        const borderCells = [
            { selector: '[data-cell="cell_2_1"]', name: 'R2C1' },
            { selector: '[data-cell="cell_2_3"]', name: 'R2C3' }
        ];
        
        borderCells.forEach(cellInfo => {
            const cell = grid2Container.querySelector(cellInfo.selector);
            if (cell) {
                console.log(`🔧 [Grid2 Debug] Applying border to ${cellInfo.name}`);
                cell.style.border = '2px solid #ffffff';
                cell.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                cell.style.borderRadius = '4px';
                cell.style.boxSizing = 'border-box';
                console.log(`🔧 [Grid2 Debug] ✅ Applied styles to ${cellInfo.name}`);
            } else {
                console.log(`🔧 [Grid2 Debug] ❌ ${cellInfo.name} not found with selector: ${cellInfo.selector}`);
            }
        });
        
        return true;
    },
    
    // Load question and configure Grid2 dynamically
    loadQuestion: (questionIndex, pageNumber = 2) => {
        console.log(`🔢 [Grid2] Loading question ${questionIndex + 1} on page ${pageNumber}`);
        
        // Get question data
        const questionData = QUESTIONS[questionIndex];
        if (!questionData) {
            console.error(`🔢 [Grid2] Question ${questionIndex + 1} not found`);
            return false;
        }
        
        // Calculate grid dimensions
        const currentPage = typeof window !== 'undefined' && window.getCurrentPage ? window.getCurrentPage() : pageNumber;
        const dimensions = Grid2Utils.calculateGridDimensions(questionData, currentPage);
        
        // Get grid element
        const gridElement = GridPositionUtils.getPageElement(pageNumber, 'grid2');
        if (!gridElement) {
            console.error(`🔢 [Grid2] Grid2 element not found on page ${pageNumber}`);
            return false;
        }
        
        // Debug log current cellOverrides
        console.log(`🔧 [Grid2 Debug] Current cellOverrides for page ${pageNumber}:`, gridElement.props.cellOverrides);
        
        // Update grid structure
        gridElement.props.gridStructure.rows = dimensions.rows;
        gridElement.props.gridStructure.columns = dimensions.columns;
        
        // Store question data and dimensions
        gridElement.props.questionData = questionData;
        gridElement.props.currentQuestionIndex = questionIndex;
        gridElement.props.gridDimensions = dimensions;
        
        // Configure Page 9, 10, 11, 12, 13, 14, 15, 16, and 17 cellOverrides conditionally based on number of digits
        if (pageNumber === 9 || pageNumber === 10 || pageNumber === 11 || pageNumber === 12 || pageNumber === 13 || pageNumber === 14 || pageNumber === 15 || pageNumber === 16 || pageNumber === 17) {
            // Clear existing cellOverrides
            gridElement.props.cellOverrides = {};
            
            // Apply border to the correct tenscarry cell based on number of digits
            const borderStyle = {
                border: '2px solid #ffffff',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '4px'
            };
            
            if (pageNumber === 9) {
                // Page 9 specific: border depends on number of digits
                if (dimensions.maxDigits === 2) {
                    // 2-digit numbers: border on R2C1
                    gridElement.props.cellOverrides['2,1'] = { style: borderStyle };
                    console.log(`🔧 [Grid2] Applied Page ${pageNumber} border to R2C1 for 2-digit numbers`);
                } else if (dimensions.maxDigits === 3) {
                    // 3-digit numbers: border on R2C3
                    gridElement.props.cellOverrides['2,3'] = { style: borderStyle };
                    console.log(`🔧 [Grid2] Applied Page ${pageNumber} border to R2C3 for 3-digit numbers`);
                }
            } else if (pageNumber === 10) {
                // Page 10 specific: border depends on number of digits
                if (dimensions.maxDigits === 2) {
                    // 2-digit numbers: border on R2C1
                    gridElement.props.cellOverrides['2,1'] = { style: borderStyle };
                    console.log(`🔧 [Grid2] Applied Page ${pageNumber} border to R2C1 for 2-digit numbers`);
                } else if (dimensions.maxDigits === 3) {
                    // 3-digit numbers: border on R2C3
                    gridElement.props.cellOverrides['2,3'] = { style: borderStyle };
                    console.log(`🔧 [Grid2] Applied Page ${pageNumber} border to R2C3 for 3-digit numbers`);
                }
            } else if (pageNumber === 12) {
                // Page 12 specific: border depends on number of digits
                if (dimensions.maxDigits === 2) {
                    // 2-digit numbers: border on R2C1
                    gridElement.props.cellOverrides['2,1'] = { style: borderStyle };
                    console.log(`🔧 [Grid2] Applied Page ${pageNumber} border to R2C1 for 2-digit numbers`);
                } else if (dimensions.maxDigits === 3) {
                    // 3-digit numbers: border on R2C3
                    gridElement.props.cellOverrides['2,3'] = { style: borderStyle };
                    console.log(`🔧 [Grid2] Applied Page ${pageNumber} border to R2C3 for 3-digit numbers`);
                }
            } else if (pageNumber === 14) {
                // Page 14 specific: border depends on number of digits
                if (dimensions.maxDigits === 2) {
                    // 2-digit numbers: border on R2C1
                    gridElement.props.cellOverrides['2,1'] = { style: borderStyle };
                    console.log(`🔧 [Grid2] Applied Page ${pageNumber} border to R2C1 for 2-digit numbers`);
                } else if (dimensions.maxDigits === 3) {
                    // 3-digit numbers: border on R2C3
                    gridElement.props.cellOverrides['2,3'] = { style: borderStyle };
                    console.log(`🔧 [Grid2] Applied Page ${pageNumber} border to R2C3 for 3-digit numbers`);
                }
            } else if (pageNumber === 15) {
                // Page 15: Apply R2C1 border conditionally based on tens column value
                
                // Calculate tens column value using the user's formula
                const tensCarry = window.getTensCarry ? window.getTensCarry() : 0;
                const currentQuestion = questionData;
                const firstTens = Math.floor(currentQuestion.first_number / 10) % 10;
                const secondTens = Math.floor(currentQuestion.second_number / 10) % 10;
                const thirdTens = currentQuestion.third_number ? Math.floor(currentQuestion.third_number / 10) % 10 : 0;
                const tensColumnValue = tensCarry + (firstTens * 10) + (secondTens * 10) + (thirdTens * 10);
                
                console.log(`🔧 [Grid2] Page ${pageNumber} tensColumnValue calculation:`);
                console.log(`   tensCarry: ${tensCarry}`);
                console.log(`   firstTens: ${firstTens} (${firstTens * 10})`);
                console.log(`   secondTens: ${secondTens} (${secondTens * 10})`);
                console.log(`   thirdTens: ${thirdTens} (${thirdTens * 10})`);
                console.log(`   tensColumnValue: ${tensColumnValue}`);
                
                // Page 15: R2C3 always gets border, R2C1 only if tensColumnValue >= 100
                gridElement.props.cellOverrides['2,3'] = { style: borderStyle };
                if (tensColumnValue >= 100) {
                    gridElement.props.cellOverrides['2,1'] = { style: borderStyle };
                    console.log(`🔧 [Grid2] Applied Page ${pageNumber} border to R2C1 and R2C3 (tensColumnValue: ${tensColumnValue} >= 100)`);
                } else {
                    console.log(`🔧 [Grid2] Applied Page ${pageNumber} border to R2C3 only (tensColumnValue: ${tensColumnValue} < 100, R2C1 border skipped)`);
                }
            } else if (pageNumber === 16 || pageNumber === 17) {
                // Pages 16 and 17: Apply R2C1 border conditionally based on tens column value
                
                // Calculate tens column value using the user's formula
                const tensCarry = window.getTensCarry ? window.getTensCarry() : 0;
                const currentQuestion = questionData;
                const firstTens = Math.floor(currentQuestion.first_number / 10) % 10;
                const secondTens = Math.floor(currentQuestion.second_number / 10) % 10;
                const thirdTens = currentQuestion.third_number ? Math.floor(currentQuestion.third_number / 10) % 10 : 0;
                const tensColumnValue = tensCarry + (firstTens * 10) + (secondTens * 10) + (thirdTens * 10);
                
                console.log(`🔧 [Grid2] Page ${pageNumber} tensColumnValue calculation:`);
                console.log(`   tensCarry: ${tensCarry}`);
                console.log(`   firstTens: ${firstTens} (${firstTens * 10})`);
                console.log(`   secondTens: ${secondTens} (${secondTens * 10})`);
                console.log(`   thirdTens: ${thirdTens} (${thirdTens * 10})`);
                console.log(`   tensColumnValue: ${tensColumnValue}`);
                
                // Pages 16 and 17: R2C1 only gets border if tensColumnValue >= 100
                if (tensColumnValue >= 100) {
                    gridElement.props.cellOverrides['2,1'] = { style: borderStyle };
                    console.log(`🔧 [Grid2] Applied Page ${pageNumber} border to R2C1 (tensColumnValue: ${tensColumnValue} >= 100)`);
                } else {
                    console.log(`🔧 [Grid2] Page ${pageNumber} R2C1 border skipped (tensColumnValue: ${tensColumnValue} < 100)`);
                }
            } else {
                // All digit numbers: tenscarry goes in R2C1 (moved 3-digit from C3 to C1)
                gridElement.props.cellOverrides['2,1'] = { style: borderStyle };
                console.log(`🔧 [Grid2] Applied Page ${pageNumber} border to R2C1 for all digit numbers`);
            }
            
            console.log(`🔧 [Grid2] Page ${pageNumber} cellOverrides configured:`, gridElement.props.cellOverrides);
        }
        
        // Set up cell content function
        gridElement.props.getCellContent = (row, col) => {
            // Pass current page and onesdigitsum (will be calculated internally if needed)
            const currentPage = typeof window !== 'undefined' && window.getCurrentPage ? window.getCurrentPage() : pageNumber;
            const onesdigitsum = typeof window !== 'undefined' && window.getOnesdigitsum ? window.getOnesdigitsum() : 0;
            return Grid2Utils.getCellContent(row, col, questionData, dimensions, currentPage, onesdigitsum);
        };
        
        // Debug: Add cell style checker function
        gridElement.props.getCellStyle = (row, col) => {
            const cellKey = `${row},${col}`;
            console.log(`🔧 [Grid2 Debug] Checking style for R${row}C${col} (key: ${cellKey})`);
            
            if (gridElement.props.cellOverrides && gridElement.props.cellOverrides[cellKey]) {
                console.log(`🔧 [Grid2 Debug] Found cellOverride for ${cellKey}:`, gridElement.props.cellOverrides[cellKey]);
                return gridElement.props.cellOverrides[cellKey].style || {};
            }
            
            console.log(`🔧 [Grid2 Debug] No cellOverride found for ${cellKey}, using default cellStyles`);
            return gridElement.props.cellStyles || {};
        };
        
        // Configure separator row styling
        const separatorRow = dimensions.numberCount + 3; // header + carry + numbers (always row 5 for 2 numbers, row 6 for 3 numbers)
        gridElement.props.rowOverrides[`row${separatorRow}`] = {
            rows: 1,
            columns: dimensions.columns,
            style: {
                // borderTop: '2px solid #ffffff',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
        };
        
        console.log(`🔢 [Grid2] Question ${questionIndex + 1} loaded successfully`);
        console.log(`   Grid: ${dimensions.rows} rows × ${dimensions.columns} columns`);
        console.log(`   Has carries: ${dimensions.hasCarries} (always true for place value headers)`);
        console.log(`   Actual carries: ${dimensions.actualCarries}`);
        console.log(`   Numbers: ${Object.values(questionData).filter(v => typeof v === 'number').join(' + ')}`);
        
        // Clear cache to force re-render
        if (typeof gridPositions !== 'undefined') {
            gridPositions.clearCache();
        }
        
        return true;
    },
    
    // Force UI update for Grid2
    forceUIUpdate: (pageNumber = 2) => {
        console.log(`🔢 [Grid2] Forcing UI update on page ${pageNumber}`);
        
        // Clear cache
        if (typeof gridPositions !== 'undefined') {
            gridPositions.clearCache();
        }
        
        // Trigger re-render if possible
        if (typeof window !== 'undefined' && window.dispatchEvent) {
            window.dispatchEvent(new Event('resize'));
        }
        
        console.log('🔢 [Grid2] UI update completed');
    }
};

// Grid1-specific utilities for page-specific grid1 element
const Grid1Utils = {
    // Load question data from constants
    loadQuestion: (questionIndex = 0, pageNumber = 1) => {
        if (typeof QUESTIONS === 'undefined') {
            console.error('🔴 QUESTIONS array not found. Make sure constants.js is loaded.');
            return;
        }
        
        if (questionIndex < 0 || questionIndex >= QUESTIONS.length) {
            console.error(`🔴 Invalid question index: ${questionIndex}. Available: 0-${QUESTIONS.length - 1}`);
            return;
        }
        
        const pageElement = GridPositionUtils.getPageElement(pageNumber, 'grid1');
        if (!pageElement) {
            console.error(`🔴 Grid1 not found on page ${pageNumber}`);
            return;
        }

        const question = QUESTIONS[questionIndex];
        const hasThreeNumbers = question.third_number !== undefined;
        
        // Get current page to check if we need extra row for answer
        const currentPage = typeof window !== 'undefined' && window.getCurrentPage ? window.getCurrentPage() : pageNumber;
        
        // Calculate number of rows - conditionally include answer row based on flag OR page 20
        let numberOfRows;
        const showAnswerRow = (typeof window !== 'undefined' && window.grid1answerflag) || currentPage === 20;
        
        console.log(`🔍 [Grid1Utils DEBUG] loadQuestion called with currentPage: ${currentPage}, pageNumber: ${pageNumber}`);
        console.log(`🔍 [Grid1Utils DEBUG] window.grid1answerflag: ${typeof window !== 'undefined' ? window.grid1answerflag : 'undefined'}`);
        console.log(`🔍 [Grid1Utils DEBUG] currentPage === 20: ${currentPage === 20}`);
        console.log(`🔍 [Grid1Utils DEBUG] showAnswerRow: ${showAnswerRow}`);
        
        if (showAnswerRow) {
            numberOfRows = hasThreeNumbers ? 5 : 4; // 2 or 3 numbers + separator + answer
            console.log(`🔢 [Grid1Utils] Setting ${numberOfRows} rows WITH answer display (${hasThreeNumbers ? '3' : '2'} numbers) - Page: ${currentPage}`);
        } else {
            numberOfRows = hasThreeNumbers ? 4 : 3; // 2 or 3 numbers + separator (no answer)
            console.log(`🔢 [Grid1Utils] Setting ${numberOfRows} rows WITHOUT answer display (${hasThreeNumbers ? '3' : '2'} numbers) - Page: ${currentPage}`);
        }
        
        const separatorRow = hasThreeNumbers ? 4 : 3; // Separator row number
        const answerRow = separatorRow + 1; // Answer row is always after separator
        
        // Update grid structure
        pageElement.props.gridStructure.rows = numberOfRows;
        pageElement.props.currentQuestionIndex = questionIndex;
        pageElement.props.questionData = question;
        
        // Clear old row overrides and set the correct separator row
        pageElement.props.rowOverrides = {};
        pageElement.props.rowOverrides[`row${separatorRow}`] = { rows: 1, columns: 6 }; // Thin separator row
        
        console.log(`🔢 [Grid1Utils] Loaded question ${questionIndex + 1}/${QUESTIONS.length} on page ${pageNumber}:`);
        console.log(`   Numbers: ${question.first_number}, ${question.second_number}${hasThreeNumbers ? ', ' + question.third_number : ''}`);
        console.log(`   Grid: 2 columns × ${numberOfRows} rows${currentPage === 20 ? ' (includes answer row)' : ''}`);
        console.log(`   Separator row: ${separatorRow}${currentPage === 20 ? ', Answer row: ' + (separatorRow + 1) : ''}`);
        console.log(`   Current page from window.getCurrentPage(): ${currentPage}`);
        console.log(`   Page parameter: ${pageNumber}`);
        
        // Clear cache if available
        if (typeof gridPositions !== 'undefined') {
            gridPositions.clearCache();
        }
        
        return question;
    },
    
    // Load next question
    nextQuestion: () => {
        const pageElement = GridPositionUtils.getPageElement(1, 'grid1');
        if (!pageElement) {
            console.error('Grid1 not found on page 1');
            return;
        }

        const currentIndex = pageElement.props.currentQuestionIndex || 0;
        const nextIndex = (currentIndex + 1) % QUESTIONS.length;
        return Grid1Utils.loadQuestion(nextIndex);
    },
    
    // Load previous question
    previousQuestion: () => {
        const pageElement = GridPositionUtils.getPageElement(1, 'grid1');
        if (!pageElement) {
            console.error('Grid1 not found on page 1');
            return;
        }

        const currentIndex = pageElement.props.currentQuestionIndex || 0;
        const prevIndex = (currentIndex - 1 + QUESTIONS.length) % QUESTIONS.length;
        return Grid1Utils.loadQuestion(prevIndex);
    },
    
    // Get current question data
    getCurrentQuestion: () => {
        // Get current page to look at the correct page element
        const currentPage = typeof window !== 'undefined' && window.getCurrentPage ? window.getCurrentPage() : 1;
        const pageElement = GridPositionUtils.getPageElement(currentPage, 'grid1');
        if (!pageElement) {
            console.error(`Grid1 not found on page ${currentPage}`);
            return null;
        }
        return pageElement.props.questionData;
    },
    
    // Get cell content for a specific row and column
    getCellContent: (row, col) => {
        const question = Grid1Utils.getCurrentQuestion();
        if (!question) return '';
        
        const hasThreeNumbers = question.third_number !== undefined;
        
        // Get current page for debugging
        const currentPage = typeof window !== 'undefined' && window.getCurrentPage ? window.getCurrentPage() : 1;
        
        // Calculate answer row (after separator)
        const separatorRow = hasThreeNumbers ? 4 : 3;
        const answerRow = separatorRow + 1;
        
        // Calculate the answer (sum of all numbers)
        const answer = question.first_number + question.second_number + (question.third_number || 0);
        
        // Column 1 (left column)
        if (col === 1) {
            if (hasThreeNumbers && row === 3) {
                return '';
            } else if (!hasThreeNumbers && row === 2) {
                return '';
            }
            // No "=" for answer row - removed
            return '';
        }
        
        // Column 2 (right column)
        if (col === 2) {
            if (row === 1) {
                return question.first_number.toString() + "\u00A0\u00A0\u00A0";
            } else if (row === 2) {
                return question.second_number.toString() + "\u00A0+";
            } else if (row === 3 && hasThreeNumbers) {
                return question.third_number.toString() + "\u00A0";
            } else if (row === answerRow) {
                // Check if answer row should be shown based on flag OR page 20
                const showAnswerRow = (typeof window !== 'undefined' && window.grid1answerflag) || currentPage === 20;
                
                console.log(`🔍 [Grid1Utils getCellContent DEBUG] Answer row check for R${row}C${col}:`);
                console.log(`🔍 [Grid1Utils getCellContent DEBUG] currentPage: ${currentPage}`);
                console.log(`🔍 [Grid1Utils getCellContent DEBUG] window.grid1answerflag: ${typeof window !== 'undefined' ? window.grid1answerflag : 'undefined'}`);
                console.log(`🔍 [Grid1Utils getCellContent DEBUG] currentPage === 20: ${currentPage === 20}`);
                console.log(`🔍 [Grid1Utils getCellContent DEBUG] showAnswerRow: ${showAnswerRow}`);
                
                if (showAnswerRow) {
                    console.log(`🔢 [Grid1Utils] Returning colored answer '${answer}' for R${row}C${col} on page ${currentPage}`);
                    return Grid1Utils.getColoredAnswer(answer); // Show colored answer when flag is true or on page 20
                } else {
                    console.log(`🔍 [Grid1Utils getCellContent DEBUG] NOT showing answer row - conditions not met`);
                }
            }
            return '';
        }
        
        return '';
    },
    
    // Get answer as plain text (coloring will be handled by cell styling)
    getColoredAnswer: (answer) => {
        const answerStr = answer.toString();
        console.log(`🎨 [Grid1Utils] Answer: ${answerStr}`);
        return answerStr; // Return plain text, coloring handled elsewhere
    },
    
    // Get color for a specific digit position in the answer
    getAnswerDigitColor: (digitIndex, totalDigits) => {
        const placeValue = totalDigits - digitIndex - 1; // 0 = ones, 1 = tens, 2 = hundreds
        
        switch (placeValue) {
            case 0: // Ones place
                return '#FF4D6D'; // --clr-pink
            case 1: // Tens place
                return '#3498DB'; // --clr-blue
            case 2: // Hundreds place
                return '#FF7F3F'; // --clr-orange
            default:
                return '#FFFFFF'; // Default color for higher place values
        }
    },
    
    // Check if a row is the separator line
    isSeparatorRow: (row) => {
        const question = Grid1Utils.getCurrentQuestion();
        if (!question) return false;
        
        const hasThreeNumbers = question.third_number !== undefined;
        const separatorRow = hasThreeNumbers ? 4 : 3;
        
        return row === separatorRow;
    },
    
    // Update grid text styles
    updateTextStyles: (newStyles) => {
        const pageElement = GridPositionUtils.getPageElement(1, 'grid1');
        if (!pageElement) {
            console.error('Grid1 not found on page 1');
            return;
        }

        pageElement.props.textStyles = {
            ...pageElement.props.textStyles,
            ...newStyles
        };
        console.log('✅ Grid1 text styles updated:', newStyles);
        
        // Clear cache
        if (typeof gridPositions !== 'undefined') {
            gridPositions.clearCache();
        }
    },
    
    // Get current text styles
    getTextStyles: () => {
        const pageElement = GridPositionUtils.getPageElement(1, 'grid1');
        if (!pageElement) {
            console.error('Grid1 not found on page 1');
            return null;
        }
        return pageElement.props.textStyles;
    },
    
    // Set specific text style property
    setTextStyle: (property, value) => {
        const pageElement = GridPositionUtils.getPageElement(1, 'grid1');
        if (!pageElement) {
            console.error('Grid1 not found on page 1');
            return;
        }

        if (!pageElement.props.textStyles) {
            pageElement.props.textStyles = {};
        }
        pageElement.props.textStyles[property] = value;
        console.log(`✅ Grid1 text ${property} set to: ${value}`);
        
        // Clear cache
        if (typeof gridPositions !== 'undefined') {
            gridPositions.clearCache();
        }
    },
    
    // Print grid configuration
    printConfig: () => {
        const pageElement = GridPositionUtils.getPageElement(1, 'grid1');
        if (!pageElement) {
            console.error('Grid1 not found on page 1');
            return;
        }
        
        console.log('📋 Grid1 Configuration:');
        console.log('========================');
        console.log('Grid Structure:', pageElement.props.gridStructure);
        console.log('Default Cell Size:', pageElement.props.defaultCellSize);
        console.log('Column Overrides:', pageElement.props.columnOverrides);
        console.log('Row Overrides:', pageElement.props.rowOverrides);
        console.log('Cell Overrides:', pageElement.props.cellOverrides);
        console.log('Text Styles:', pageElement.props.textStyles);
        console.log('Show Separator Line:', pageElement.props.showSeparatorLine);
        console.log('Current Question Index:', pageElement.props.currentQuestionIndex);
        console.log('Question Data:', pageElement.props.questionData);
    },
    
    // Set column override
    setColumnOverride: (col, rows, columns) => {
        const pageElement = GridPositionUtils.getPageElement(1, 'grid1');
        if (!pageElement) {
            console.error('Grid1 not found on page 1');
            return;
        }

        pageElement.props.columnOverrides[`col${col}`] = { rows, columns };
        console.log(`✅ Grid1 column ${col} override set: ${rows} rows, ${columns} columns`);
        
        // Clear cache
        if (typeof gridPositions !== 'undefined') {
            gridPositions.clearCache();
        }
    },
    
    // Set row override
    setRowOverride: (row, rows, columns) => {
        const pageElement = GridPositionUtils.getPageElement(1, 'grid1');
        if (!pageElement) {
            console.error('Grid1 not found on page 1');
            return;
        }

        pageElement.props.rowOverrides[`row${row}`] = { rows, columns };
        console.log(`✅ Grid1 row ${row} override set: ${rows} rows, ${columns} columns`);
        
        // Clear cache
        if (typeof gridPositions !== 'undefined') {
            gridPositions.clearCache();
        }
    },
    
    // Set cell override
    setCellOverride: (row, col, rows, columns) => {
        const pageElement = GridPositionUtils.getPageElement(1, 'grid1');
        if (!pageElement) {
            console.error('Grid1 not found on page 1');
            return;
        }

        pageElement.props.cellOverrides[`${row},${col}`] = { rows, columns };
        console.log(`✅ Grid1 cell ${row},${col} override set: ${rows} rows, ${columns} columns`);
        
        // Clear cache
        if (typeof gridPositions !== 'undefined') {
            gridPositions.clearCache();
        }
    },
    
    // Clear all overrides
    clearOverrides: () => {
        const pageElement = GridPositionUtils.getPageElement(1, 'grid1');
        if (!pageElement) {
            console.error('Grid1 not found on page 1');
            return;
        }

        pageElement.props.columnOverrides = {};
        pageElement.props.rowOverrides = {};
        pageElement.props.cellOverrides = {};
        console.log('✅ Grid1 all overrides cleared');
        
        // Clear cache
        if (typeof gridPositions !== 'undefined') {
            gridPositions.clearCache();
        }
    },
    
    // Enable separator line
    enableSeparatorLine: () => {
        const pageElement = GridPositionUtils.getPageElement(1, 'grid1');
        if (!pageElement) {
            console.error('Grid1 not found on page 1');
            return;
        }

        pageElement.props.showSeparatorLine = true;
        console.log('✅ Grid1 separator line enabled');
        
        // Clear cache
        if (typeof gridPositions !== 'undefined') {
            gridPositions.clearCache();
        }
    },
    
    // Disable separator line
    disableSeparatorLine: () => {
        const pageElement = GridPositionUtils.getPageElement(1, 'grid1');
        if (!pageElement) {
            console.error('Grid1 not found on page 1');
            return;
        }

        pageElement.props.showSeparatorLine = false;
        console.log('✅ Grid1 separator line disabled');
        
        // Clear cache
        if (typeof gridPositions !== 'undefined') {
            gridPositions.clearCache();
        }
    },
    
    // Toggle separator line
    toggleSeparatorLine: () => {
        const pageElement = GridPositionUtils.getPageElement(1, 'grid1');
        if (!pageElement) {
            console.error('Grid1 not found on page 1');
            return;
        }

        pageElement.props.showSeparatorLine = !pageElement.props.showSeparatorLine;
        console.log(`✅ Grid1 separator line ${pageElement.props.showSeparatorLine ? 'enabled' : 'disabled'}`);
        
        // Clear cache
        if (typeof gridPositions !== 'undefined') {
            gridPositions.clearCache();
        }
        
        return pageElement.props.showSeparatorLine;
    },
    
    // Get separator line status
    isSeparatorLineEnabled: () => {
        const pageElement = GridPositionUtils.getPageElement(1, 'grid1');
        if (!pageElement) {
            console.error('Grid1 not found on page 1');
            return false;
        }
        return pageElement.props.showSeparatorLine !== false;
    },
    
    // Force UI update after direct prop changes
    forceUIUpdate: () => {
        console.log('🔄 Forcing UI update...');
        const pageElement = GridPositionUtils.getPageElement(1, 'grid1');
        if (pageElement) {
            console.log('Current column overrides:', pageElement.props.columnOverrides);
            console.log('Current row overrides:', pageElement.props.rowOverrides);
            console.log('Separator line enabled:', pageElement.props.showSeparatorLine);
        }
        
        // Clear positioning cache
        if (typeof gridPositions !== 'undefined') {
            gridPositions.clearCache();
            console.log('✅ Cache cleared');
        }
        
        // Force React re-render by reloading the page
        console.log('🔄 Reloading page to force React re-render...');
        setTimeout(() => {
            location.reload();
        }, 1000);
    }
};

// Helper functions for working with grid positions
const GridPositionUtils = {
    // Get all elements for a specific page
    getPageElements: (pageNumber) => {
        return GridPositionPages[pageNumber] || [];
    },

    // Get a specific element from a page
    getPageElement: (pageNumber, elementName) => {
        // console.log(`🔍 [getPageElement] Looking for element "${elementName}" on page ${pageNumber}`);
        const pageElements = GridPositionPages[pageNumber] || [];
        // console.log(`🔍 [getPageElement] Page ${pageNumber} elements:`, pageElements);
        // console.log(`🔍 [getPageElement] Available element names:`, pageElements.map(el => el.name));
        const foundElement = pageElements.find(element => element.name === elementName);
        // console.log(`🔍 [getPageElement] Found element:`, foundElement);
        return foundElement;
    },

    // Convert coordinates to CSS grid area
    coordinatesToCSS: (coordinates) => {
        const [topRow, topCol, bottomRow, bottomCol] = coordinates;
        
        const config = GridPrecisionConfig.precisionSettings[GridPrecisionConfig.currentPrecision];
        
        const left = ((topCol - 1) / config.cols) * 100;
        const top = ((topRow - 1) / config.rows) * 100;
        const width = ((bottomCol - topCol + 1) / config.cols) * 100;
        const height = ((bottomRow - topRow + 1) / config.rows) * 100;
        
        return {
            position: 'absolute',
            left: `${left.toFixed(2)}%`,
            top: `${top.toFixed(2)}%`,
            width: `${width.toFixed(2)}%`,
            height: `${height.toFixed(2)}%`
        };
    },

    // Update element position in StandardPositions
    updateElementPosition: (elementName, coordinates) => {
        if (StandardPositions[elementName]) {
            const element = StandardPositions[elementName];
            
            // For grid elements, only allow updating top coordinates
            if (element.type === 'grid') {
                if (coordinates.length === 2) {
                    element.coordinates = coordinates; // [topRow, topCol]
                } else {
                    console.warn(`Grid elements only accept [topRow, topCol] coordinates. Got:`, coordinates);
                    return;
                }
            } else {
                element.coordinates = coordinates; // [topRow, topCol, bottomRow, bottomCol]
            }
            
            // Clear cache to force recalculation
            if (typeof gridPositions !== 'undefined') {
                gridPositions.clearCache();
            }
        }
    },

    // Add new element to StandardPositions
    addElement: (elementName, elementData) => {
        const newElement = {
            type: elementData.type || 'container',
            coordinates: elementData.coordinates || [1, 1, 2, 2],
            zIndex: elementData.zIndex || 100,
            props: elementData.props || {}
        };
        
        // Validate coordinates based on type
        if (newElement.type === 'grid') {
            if (newElement.coordinates.length === 4) {
                // Convert to grid format [topRow, topCol]
                newElement.coordinates = [newElement.coordinates[0], newElement.coordinates[1]];
                console.log(`🔄 Converted grid coordinates to [${newElement.coordinates.join(', ')}] format`);
            }
        }
        
        StandardPositions[elementName] = newElement;
        
        // Clear cache to force recalculation
        if (typeof gridPositions !== 'undefined') {
            gridPositions.clearCache();
        }
    },

    // Remove element from StandardPositions
    removeElement: (elementName) => {
        if (StandardPositions[elementName]) {
            delete StandardPositions[elementName];
            // Clear cache to force recalculation
            if (typeof gridPositions !== 'undefined') {
                gridPositions.clearCache();
            }
        }
    },

    // Get element by name from StandardPositions
    getElement: (elementName) => {
        return StandardPositions[elementName] || null;
    },

    // Get all available elements
    getAllElements: () => {
        return Object.keys(StandardPositions).map(name => {
            const element = StandardPositions[name];
            const description = typeof i18n !== 'undefined' ? 
                i18n.t(`gridPositions.standardElements.${name}`) : 
                name;
            
            // Show different coordinate format for grids
            let coordinatesDisplay;
            if (element.type === 'grid') {
                coordinatesDisplay = `[${element.coordinates.join(', ')}] (auto-calculated bottom)`;
            } else {
                coordinatesDisplay = `[${element.coordinates.join(', ')}]`;
            }
            
            return {
                name,
                description,
                coordinates: coordinatesDisplay,
                zIndex: element.zIndex,
                elementType: element.type,
                type: 'standard'
            };
        });
    },

    // Validate grid coordinates
    isValidGridCoordinate: (coord) => {
        if (Array.isArray(coord) && coord.length === 2) {
            const [row, col] = coord;
            const config = GridPrecisionConfig.precisionSettings[GridPrecisionConfig.currentPrecision];
            return row >= 1 && row <= config.rows && col >= 1 && col <= config.cols;
        }
        return false;
    },

    // Validate grid coordinate range
    isValidGridRange: (coordinates) => {
        if (Array.isArray(coordinates) && coordinates.length === 4) {
            const [topRow, topCol, bottomRow, bottomCol] = coordinates;
            const config = GridPrecisionConfig.precisionSettings[GridPrecisionConfig.currentPrecision];
            
            return topRow >= 1 && topRow <= config.rows &&
                   topCol >= 1 && topCol <= config.cols &&
                   bottomRow >= 1 && bottomRow <= config.rows &&
                   bottomCol >= 1 && bottomCol <= config.cols &&
                   topRow <= bottomRow && topCol <= bottomCol;
        }
        return false;
    },

    // Create element from StandardPositions with custom text
    createStandardElement: (standardName, customProps = {}) => {
        const standardElement = StandardPositions[standardName];
        if (!standardElement) {
            console.warn(`Standard element "${standardName}" not found`);
            return null;
        }

        return {
            name: standardName,
            ...standardElement,
            props: {
                ...standardElement.props,
                ...customProps
            }
        };
    },

    // Create dialog with i18n text
    createDialogElement: (textKey, customProps = {}) => {
        const dialogElement = StandardPositions.dialogBubble;
        return {
            name: 'dialog-bubble',
            ...dialogElement,
            props: {
                ...dialogElement.props,
                get text() {
                    return typeof i18n !== 'undefined' ? i18n.t(textKey) : `[Missing: ${textKey}]`;
                },
                ...customProps
            }
        };
    },


};

// Debug function to test grid cell font conversion
const testGridCellFontConversion = () => {
    console.log('🧪 Testing Grid Cell Font Conversion');
    console.log('====================================');
    
    const testValues = ['100gc', '190gc', '400gc', '800gc', '1000gc'];
    
    testValues.forEach(value => {
        const converted = GridCellFontUtils.convertGcToPixels(value);
        console.log(`${value} -> ${converted}`);
    });
    
    console.log('\n📊 Current Grid Configuration:');
    console.log(`Precision: ${GridPrecisionConfig.currentPrecision}x`);
    console.log(`Grid: ${GridPrecisionConfig.precisionSettings[GridPrecisionConfig.currentPrecision].cols}x${GridPrecisionConfig.precisionSettings[GridPrecisionConfig.currentPrecision].rows}`);
    console.log(`Screen: ${window.innerWidth}x${window.innerHeight}`);
    console.log(`Cell Height: ${window.innerHeight / GridPrecisionConfig.precisionSettings[GridPrecisionConfig.currentPrecision].rows}px`);
    
    console.log('\n🎯 Dialog Options Test:');
    const dialogOptions = StandardPositions.dialogBubble.props.options;
    console.log('Standard Dialog Options:', dialogOptions);
    
    const pageElement = GridPositionUtils.getPageElement(1, 'dialog-bubble');
    if (pageElement) {
        console.log('Page Dialog Options:', pageElement.props.options);
    }
    
    // Test direct conversion of 800gc
    console.log('\n🧪 Direct 800gc Test:');
    const direct800gc = GridCellFontUtils.convertGcToPixels('800gc');
    console.log('Direct 800gc conversion:', direct800gc);
    
    return true;
};

// Debug function to test column width calculations for page-specific grids
const testColumnWidths = () => {
    console.log('🧪 Testing Column Width Calculations (Page-Specific)');
    console.log('====================================================');
    
    const pageElement = GridPositionUtils.getPageElement(1, 'grid1');
    if (!pageElement) {
        console.error('Grid1 not found on page 1');
        return false;
    }

    const { gridStructure, defaultCellSize, columnOverrides } = pageElement.props;
    
    console.log('Grid Structure:', gridStructure);
    console.log('Default Cell Size:', defaultCellSize);
    console.log('Column Overrides:', columnOverrides);
    
    // Calculate total grid width like the system does
    let totalGridWidthInCells = 0;
    for (let col = 1; col <= gridStructure.columns; col++) {
        const colWidth = columnOverrides[`col${col}`]?.columns || defaultCellSize.columns;
        totalGridWidthInCells += colWidth;
        console.log(`Column ${col} (col${col}): ${colWidth} cells`);
    }
    
    console.log(`Total Grid Width: ${totalGridWidthInCells} cells`);
    
    // Calculate percentages
    for (let col = 1; col <= gridStructure.columns; col++) {
        const colWidth = columnOverrides[`col${col}`]?.columns || defaultCellSize.columns;
        const percentage = (colWidth / totalGridWidthInCells) * 100;
        console.log(`Column ${col} percentage: ${percentage.toFixed(2)}%`);
    }
    
    // Test the actual React component calculation
    console.log('\n🔍 React Component Calculation Test:');
    for (let col = 0; col < gridStructure.columns; col++) {
        const overrideKey = `col${col + 1}`;
        const cellWidth = columnOverrides[overrideKey]?.columns || defaultCellSize.columns;
        const percentage = (cellWidth / totalGridWidthInCells) * 100;
        console.log(`col=${col}, key=${overrideKey}, width=${cellWidth}, percentage=${percentage.toFixed(2)}%`);
    }
    
    return true;
};

// Modular Grid Builder - Build grids from scratch
class GridBuilder {
    constructor() {
        this.grids = new Map();
    }

    // Create a new grid configuration
    createGrid(gridName, options = {}) {
        const defaultOptions = {
            coordinates: [30, 70],
            zIndex: 400,
            gridStructure: {
                columns: 2,
                rows: 4
            },
            defaultCellSize: {
                rows: 6,
                columns: 6
            },
            columnOverrides: {},
            rowOverrides: {},
            cellOverrides: {},
            cellStyles: {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px'
            },
            textStyles: {
                fontSize: '400gc',
                fontWeight: 'bold',
                color: '#ffffff',
                textAlign: 'center',
                verticalAlign: 'middle',
                fontFamily: 'Arial, sans-serif'
            }
        };

        const gridConfig = {
            name: gridName,
            type: 'grid',
            coordinates: options.coordinates || defaultOptions.coordinates,
            zIndex: options.zIndex || defaultOptions.zIndex,
            props: {
                gridStructure: { ...defaultOptions.gridStructure, ...options.gridStructure },
                defaultCellSize: { ...defaultOptions.defaultCellSize, ...options.defaultCellSize },
                columnOverrides: { ...options.columnOverrides },
                rowOverrides: { ...options.rowOverrides },
                cellOverrides: { ...options.cellOverrides },
                cellStyles: { ...defaultOptions.cellStyles, ...options.cellStyles },
                textStyles: { ...defaultOptions.textStyles, ...options.textStyles }
            }
        };

        this.grids.set(gridName, gridConfig);
        console.log(`✅ Created modular grid: ${gridName}`);
        return gridConfig;
    }

    // Get a grid configuration
    getGrid(gridName) {
        return this.grids.get(gridName);
    }

    // List all available modular grids
    listGrids() {
        console.log('📋 Available Modular Grids:');
        console.log('===========================');
        for (const [name, grid] of this.grids) {
            console.log(`• ${name}: ${grid.props.gridStructure.columns}×${grid.props.gridStructure.rows} at [${grid.coordinates.join(', ')}]`);
        }
    }

    // Example: Create a math grid
    createMathGrid(name, rows, columns, columnWidths = []) {
        const columnOverrides = {};
        columnWidths.forEach((width, index) => {
            if (width !== null) {
                columnOverrides[`col${index + 1}`] = { rows: 4, columns: width };
            }
        });

        return this.createGrid(name, {
            gridStructure: { columns, rows },
            columnOverrides
        });
    }
}

// Create global grid builder instance
const gridBuilder = new GridBuilder();

// Page Management Utilities
const PageUtils = {
    // Get available pages
    getAvailablePages: () => {
        return Object.keys(GridPositionPages).map(Number).sort((a, b) => a - b);
    },
    
    // Get page element count
    getPageElementCount: (pageNumber) => {
        const pageElements = GridPositionPages[pageNumber];
        return pageElements ? pageElements.length : 0;
    },
    
    // Get page summary
    getPageSummary: (pageNumber) => {
        const pageElements = GridPositionPages[pageNumber];
        if (!pageElements) return null;
        
        const elementTypes = {};
        pageElements.forEach(element => {
            elementTypes[element.type] = (elementTypes[element.type] || 0) + 1;
        });
        
        return {
            pageNumber,
            elementCount: pageElements.length,
            elementTypes,
            elements: pageElements.map(el => el.name)
        };
    },
    
    // Get all page summaries
    getAllPageSummaries: () => {
        return PageUtils.getAvailablePages().map(pageNumber => 
            PageUtils.getPageSummary(pageNumber)
        );
    },
    
    // Initialize page questions
    initializePageQuestions: (pageNumber = 1, questionIndex = 0) => {
        console.log(`🔄 Initializing page ${pageNumber} with question ${questionIndex + 1}`);
        
        // Load question for the specified page
        if (typeof Grid1Utils !== 'undefined') {
            Grid1Utils.loadQuestion(questionIndex, pageNumber);
        }
        
        // Clear cache
        if (typeof gridPositions !== 'undefined') {
            gridPositions.clearCache();
        }
        
        console.log(`✅ Page ${pageNumber} initialized with question ${questionIndex + 1}`);
    },
    
    // Sync questions between pages
    syncQuestionsBetweenPages: (sourcePageNumber, targetPageNumber) => {
        const sourcePageElement = GridPositionUtils.getPageElement(sourcePageNumber, 'grid1');
        const targetPageElement = GridPositionUtils.getPageElement(targetPageNumber, 'grid1');
        
        if (!sourcePageElement || !targetPageElement) {
            console.error(`Cannot sync questions - missing page elements (source: ${sourcePageNumber}, target: ${targetPageNumber})`);
            return false;
        }
        
        // Get the current question index from source page
        const currentQuestionIndex = sourcePageElement.props.currentQuestionIndex || 0;
        
        // Use Grid1Utils.loadQuestion to properly set up the target page with dynamic behavior
        if (typeof Grid1Utils !== 'undefined') {
            Grid1Utils.loadQuestion(currentQuestionIndex, targetPageNumber);
            console.log(`🔄 Synced Grid1 question ${currentQuestionIndex + 1} from page ${sourcePageNumber} to page ${targetPageNumber} with dynamic behavior`);
        } else {
            // Fallback to basic copy if Grid1Utils is not available
            targetPageElement.props.currentQuestionIndex = sourcePageElement.props.currentQuestionIndex;
            targetPageElement.props.questionData = sourcePageElement.props.questionData;
            targetPageElement.props.gridStructure.rows = sourcePageElement.props.gridStructure.rows;
            console.log(`🔄 Basic sync from page ${sourcePageNumber} to page ${targetPageNumber}`);
        }
        
        // Also sync Grid2 if it exists on the target page
        const targetGrid2Element = GridPositionUtils.getPageElement(targetPageNumber, 'grid2');
        if (targetGrid2Element && typeof Grid2Utils !== 'undefined') {
            Grid2Utils.loadQuestion(currentQuestionIndex, targetPageNumber);
            console.log(`🔄 Synced Grid2 question ${currentQuestionIndex + 1} to page ${targetPageNumber} with dynamic behavior`);
        }
        
        // Clear cache
        if (typeof gridPositions !== 'undefined') {
            gridPositions.clearCache();
        }
        
        return true;
    },
    
    // Get current question for a page
    getCurrentQuestion: (pageNumber = 1) => {
        const pageElement = GridPositionUtils.getPageElement(pageNumber, 'grid1');
        if (!pageElement) {
            console.error(`Grid1 not found on page ${pageNumber}`);
            return null;
        }
        return pageElement.props.questionData;
    },
    
    // Get current question index for a page
    getCurrentQuestionIndex: (pageNumber = 1) => {
        const pageElement = GridPositionUtils.getPageElement(pageNumber, 'grid1');
        if (!pageElement) {
            console.error(`Grid1 not found on page ${pageNumber}`);
            return -1;
        }
        return pageElement.props.currentQuestionIndex || 0;
    },
    
    // Debug page information
    debugPageInfo: (pageNumber = null) => {
        const pages = pageNumber ? [pageNumber] : PageUtils.getAvailablePages();
        
        console.log('📄 Page Information Debug');
        console.log('========================');
        
        pages.forEach(page => {
            const summary = PageUtils.getPageSummary(page);
            console.log(`\n📋 Page ${page}:`);
            console.log(`   Elements: ${summary.elementCount}`);
            console.log(`   Types:`, summary.elementTypes);
            console.log(`   Elements:`, summary.elements.join(', '));
            
            const currentQuestion = PageUtils.getCurrentQuestion(page);
            if (currentQuestion) {
                console.log(`   Current Question: ${PageUtils.getCurrentQuestionIndex(page) + 1}`);
                console.log(`   Question Data:`, currentQuestion);
            }
        });
    }
};

// Create global instances
const gridPositions = new GridPositions();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        GridPositions,
        GridPositionPages,
        GridPositionUtils,
        GridPrecisionConfig,
        StandardPositions,
        CharacterBorderConfig,
        DebugBorderConfig,
        GridCellFontUtils,
        Grid1Utils,
        Grid2Utils,
        GridBuilder,
        PageUtils,
        gridPositions,
        gridBuilder,
        toggleDebugBorders,
        enableDebugBorders,
        disableDebugBorders,
        debugGridPositioning,
        testGridCellFontConversion,
        testColumnWidths
    };
} else {
    window.GridPositions = GridPositions;
    window.GridPositionPages = GridPositionPages;
    window.GridPositionUtils = GridPositionUtils;
    window.GridPrecisionConfig = GridPrecisionConfig;
    window.StandardPositions = StandardPositions;
    window.CharacterBorderConfig = CharacterBorderConfig;
    window.DebugBorderConfig = DebugBorderConfig;
    window.GridCellFontUtils = GridCellFontUtils;
    window.Grid1Utils = Grid1Utils;
    window.GridBuilder = GridBuilder;
    window.PageUtils = PageUtils;
    window.gridPositions = gridPositions;
    window.gridBuilder = gridBuilder;
    window.toggleDebugBorders = toggleDebugBorders;
    window.enableDebugBorders = enableDebugBorders;
    window.disableDebugBorders = disableDebugBorders;
    window.debugGridPositioning = debugGridPositioning;
    window.testGridCellFontConversion = testGridCellFontConversion;
    window.testColumnWidths = testColumnWidths;
    window.Grid2Utils = Grid2Utils;
    window.testPage6OnesdigitSum = Grid2Utils.testPage6OnesdigitSum;
    window.debugCurrentGrid2 = Grid2Utils.debugCurrentGrid2;
    window.testGetCellContent = Grid2Utils.testGetCellContent;
    window.debugPage9Borders = Grid2Utils.debugPage9Borders;
    window.forceApplyPage9Borders = Grid2Utils.forceApplyPage9Borders;
    window.inspectGrid2DOM = Grid2Utils.inspectGrid2DOM;
    
    // Confirm that the grid positioning system is fully loaded
    console.log('✅ Grid Positioning System loaded successfully');
    console.log('📊 System Architecture: PAGE-SPECIFIC + MODULAR');
    console.log('Available utilities:', {
        GridPositions: '✓',
        GridPositionPages: '✓',
        GridPositionUtils: '✓', 
        GridPrecisionConfig: '✓',
        StandardPositions: '✓',
        CharacterBorderConfig: '✓',
        DebugBorderConfig: '✓',
        GridCellFontUtils: '✓',
        Grid1Utils: '✓ (page-specific)',
        GridBuilder: '✓ (modular)',
        gridPositions: '✓',
        gridBuilder: '✓',
        toggleDebugBorders: '✓',
        enableDebugBorders: '✓',
        disableDebugBorders: '✓',
        debugGridPositioning: '✓',
        testGridCellFontConversion: '✓',
        testColumnWidths: '✓'
    });
    
    // Run automatic debugging test
    console.log('');
    console.log('🚀 Running automatic font conversion test...');
    testGridCellFontConversion();
    
    // Test the new page-specific grid system
    console.log('');
    console.log('🚀 Testing page-specific grid configuration...');
    testColumnWidths();
    
    // Instructions for developers
    console.log('');
    console.log('🔧 Debug Commands:');
    console.log('toggleDebugBorders() - Toggle red borders on/off');
    console.log('testColumnWidths() - Test page-specific grid column calculations');
    console.log('testGridCellFontConversion() - Test grid cell font conversion');
    console.log('');
    console.log('📋 Grid1 Commands (Page-Specific):');
    console.log('Grid1Utils.printConfig() - Show grid1 configuration');
    console.log('Grid1Utils.setColumnOverride(col, rows, columns) - Set column size');
    console.log('Grid1Utils.setRowOverride(row, rows, columns) - Set row size');
    console.log('Grid1Utils.setCellOverride(row, col, rows, columns) - Set cell size');
    console.log('Grid1Utils.clearOverrides() - Clear all overrides');
    console.log('Grid1Utils.enableSeparatorLine() - Enable separator line');
    console.log('Grid1Utils.disableSeparatorLine() - Disable separator line');
    console.log('Grid1Utils.toggleSeparatorLine() - Toggle separator line on/off');
    console.log('Grid1Utils.isSeparatorLineEnabled() - Check if separator line is enabled');
    console.log('Grid1Utils.forceUIUpdate() - Force UI update');
    console.log('');
    console.log('🏗️ Modular Grid Builder Commands:');
    console.log('gridBuilder.createGrid(name, options) - Create a new grid');
    console.log('gridBuilder.createMathGrid(name, rows, cols, widths) - Create math-specific grid');
    console.log('gridBuilder.getGrid(name) - Get grid configuration');
    console.log('gridBuilder.listGrids() - List all available grids');
    console.log('');
    console.log('📄 Page Management Commands:');
    console.log('PageUtils.getAvailablePages() - Get list of available pages');
    console.log('PageUtils.getPageSummary(pageNumber) - Get page summary');
    console.log('PageUtils.getAllPageSummaries() - Get all page summaries');
    console.log('PageUtils.initializePageQuestions(pageNumber, questionIndex) - Initialize page with question');
    console.log('PageUtils.syncQuestionsBetweenPages(sourcePage, targetPage) - Sync questions between pages');
    console.log('PageUtils.getCurrentQuestion(pageNumber) - Get current question for page');
    console.log('PageUtils.getCurrentQuestionIndex(pageNumber) - Get current question index for page');
    console.log('PageUtils.debugPageInfo(pageNumber) - Debug page information');
    console.log('');
    console.log('🔢 Grid2 Commands (Column Addition):');
    console.log('Grid2Utils.calculateGridDimensions(questionData) - Calculate grid dimensions');
    console.log('Grid2Utils.checkForCarries(numbers) - Check if numbers have carries');
    console.log('Grid2Utils.getCellContent(row, col, questionData, gridDimensions) - Get cell content');
    console.log('Grid2Utils.loadQuestion(questionIndex, pageNumber) - Load question into Grid2');
    console.log('Grid2Utils.forceUIUpdate(pageNumber) - Force Grid2 UI update');
    console.log('Grid2Utils.testPermutations() - Test all grid2 permutations');
    console.log('testPage6OnesdigitSum() - Test page 6 onesdigitsum calculations');
    console.log('debugCurrentGrid2() - Debug current Grid2 state and test functions');
    console.log('testGetCellContent() - Test getCellContent function directly');
    console.log('debugPage9Borders() - Debug page 9 border styling issues');
    console.log('forceApplyPage9Borders() - Force apply borders directly to DOM (debug tool)');
    console.log('inspectGrid2DOM() - Inspect Grid2 DOM structure and find elements');
    console.log('');
    console.log('⚡ System Benefits:');
    console.log('• Grid1 moved to page-specific configuration');
    console.log('• Grid2 added with dynamic column addition and carry handling');
    console.log('• Modular GridBuilder for creating grids from scratch');
    console.log('• No more hardcoded dependencies in StandardPositions');
    console.log('• Clean separation between page-specific and reusable components');
    console.log('• Flexible grid system with customizable cell sizes');
    console.log('• Page 2 has Grid1 and Grid2 for detailed learning');
    console.log('• Next button enables page navigation');
    console.log('• Page indicator shows current page');
    console.log('• Grid2 dynamically sizes based on question complexity');
    console.log('');
} 
