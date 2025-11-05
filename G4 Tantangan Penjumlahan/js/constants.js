// Simplified Constants for the Learning Applet
// Basic layout and responsive design constants

const LAYOUT_CONSTANTS = {
    // Basic responsive sizing ratios
    FONT_SIZE_RATIO: 0.02, // Font size relative to screen width
    PADDING_RATIO: 0.01, // Padding relative to screen dimensions
    MARGIN_RATIO: 0.005, // Margin relative to screen dimensions
    
    // Character sizing
    CHARACTER_SIZE_PERCENTAGE: 0.8, // 80% of character container
    
    // Animation timing
    ANIMATION_DURATION: 300, // milliseconds
    
    // Color scheme (can be used for dynamic theming)
    THEME_COLORS: {
        PRIMARY: '#3498DB',
        SECONDARY: '#2ECC71',
        ACCENT: '#FF7F3F',
        TEXT: '#2C3E50',
        BACKGROUND: '#FFFFFF'
    }
};

// Step 1 Problem Variables
const STEP1_CONSTANTS = {
    first_number: 328,
    second_number: 579,
    current_step: "step 1"
};

// Step Visibility Configuration
const STEP_VISIBILITY = {
    // Set to false to hide steps A, B, C, D and start directly from step 1
    SHOW_INTRODUCTION_STEPS: true,
    
    // Individual step visibility (only applies if SHOW_INTRODUCTION_STEPS is true)
    SHOW_STEP_A: true,  // Problem Statement
    SHOW_STEP_B: true,  // Given Facts
    SHOW_STEP_C: true,  // Understanding Goal
    SHOW_STEP_D: true   // Understanding Goal (final step)
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LAYOUT_CONSTANTS, STEP1_CONSTANTS, STEP_VISIBILITY };
} 