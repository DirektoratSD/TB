// Simplified Constants for the Learning Applet
// Most constants have been removed since interactive panels were removed

const LAYOUT_CONSTANTS = {
    // Basic responsive sizing ratios (kept for potential future use)
    FONT_SIZE_RATIO: 0.02, // Font size relative to screen width
    PADDING_RATIO: 0.01, // Padding relative to screen dimensions
    MARGIN_RATIO: 0.005, // Margin relative to screen dimensions
    
    // Character panel settings (disabled)
    SHOW_CHARACTER_PANEL: false, // Set to false to hide character panel and use full width
    
    // Language settings (disabled)
    SHOW_LANGUAGE_DROPDOWN: false, // Set to false to hide language selector in header
    
    // Color scheme (kept for potential future use)
    THEME_COLORS: {
        PRIMARY: '#3498DB',
        SECONDARY: '#2ECC71',
        ACCENT: '#FF7F3F',
        TEXT: '#2C3E50',
        BACKGROUND: '#FFFFFF'
    },
    
    // Grid System Configuration
    GRID_SYSTEM: {
        // Enable grid system
        ENABLED: true,
        
        // Default grid precision (1-10)
        DEFAULT_PRECISION: 8, // 128x72 grid
        
        // Grid overlay settings
        OVERLAY: {
            SHOW_ON_STARTUP: true, // Grid overlay on by default (can be overridden by APP_CONFIG)
            KEYBOARD_SHORTCUTS: true, // Enable Ctrl+G shortcuts
            SHOW_COORDINATES: true, // Show coordinates on hover
            SHOW_INFO_PANEL: true // Show info panel
        },
        
        // Grid positioning presets for common elements (128x72 grid)
        PRESETS: {
            // Header area
            HEADER: 'R1C1-R8C128',
            
            // Main content area
            MAIN_CONTENT: 'R9C1-R67C128',
            
            // Footer area
            FOOTER: 'R68C1-R72C128',
            
            // Sidebar (if needed)
            SIDEBAR_LEFT: 'R9C1-R67C32',
            SIDEBAR_RIGHT: 'R9C97-R67C128',
            
            // Modal/dialog center
            MODAL_CENTER: 'R21C32-R54C96',
            
            // Button groups
            BUTTON_GROUP_HORIZONTAL: 'R64C40-R67C88',
            BUTTON_GROUP_VERTICAL: 'R40C117-R59C125',
            
            // Character area (if re-enabled)
            CHARACTER_AREA: 'R11C3-R67C32',
            
            // Activity area
            ACTIVITY_AREA: 'R11C35-R67C128'
        }
    }
};

// Questions array for addition problems
const QUESTIONS = [    
    {
        first_number: 267,
        second_number: 185,
    },
    {
        first_number: 379,
        second_number: 486,
    },
];

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LAYOUT_CONSTANTS, QUESTIONS };
} else {
    window.LAYOUT_CONSTANTS = LAYOUT_CONSTANTS;
    window.QUESTIONS = QUESTIONS;
} 