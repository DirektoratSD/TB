/**
 * MAIN GRID SYSTEM API
 * ====================
 * Main API that ties all grid components together.
 * Provides public interface for grid positioning and element creation.
 */

class GridSystem {
    constructor() {
        // Initialize components
        this.config = new GridConfig();
        this.calculations = new GridCalculations(this.config);
        this.fontUtils = new GridFontUtils(this.config, this.calculations);
        this.overlay = new GridOverlay(this.config, this.calculations);
        
        // Element tracking
        this.elements = new Map();
        this.elementCounter = 0;
        
        // Initialize
        this.initialize();
    }
    
    /**
     * Initialize the grid system
     */
    initialize() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.onDOMReady();
            });
        } else {
            this.onDOMReady();
        }
    }
    
    /**
     * Called when DOM is ready
     */
    onDOMReady() {
        console.log('Grid System initialized');
        
        // Update existing elements
        this.updateAllElements();
        
        // Set up auto-update
        window.addEventListener('gridResize', () => {
            this.updateAllElements();
        });
    }
    
    /**
     * Create a positioned element
     */
    createElement(coordStr, tagName = 'div', options = {}) {
        try {
            const coords = this.calculations.parseCoordinates(coordStr);
            const pixels = this.calculations.coordinatesToPixels(coords);
            
            // Create element
            const element = document.createElement(tagName);
            const elementId = options.id || `grid-element-${++this.elementCounter}`;
            element.id = elementId;
            
            // Apply positioning
            this.applyPositioning(element, pixels, options.styles);
            
            // Apply content
            if (options.content) {
                element.innerHTML = options.content;
            }
            
            // Add to parent
            const parent = this.getParent(options.parent);
            parent.appendChild(element);
            
            // Track element
            this.elements.set(elementId, {
                element: element,
                coordinates: coordStr,
                coords: coords,
                options: options
            });
            
            return element;
            
        } catch (e) {
            console.error('Error creating element:', e);
            return null;
        }
    }
    
    /**
     * Create a text box
     */
    createTextBox(coordStr, text, options = {}) {
        const defaultOptions = {
            styles: {
                padding: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '5px',
                fontSize: '85gc',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                wordWrap: 'break-word',
                overflow: 'hidden'
            },
            content: text,
            ...options
        };
        
        return this.createElement(coordStr, 'div', defaultOptions);
    }
    
    /**
     * Create a button
     */
    createButton(coordStr, text, clickHandler, options = {}) {
        const defaultOptions = {
            styles: {
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontSize: '75gc',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                ...options.styles
            },
            content: text,
            ...options
        };
        
        const button = this.createElement(coordStr, 'button', defaultOptions);
        
        if (button && clickHandler) {
            button.addEventListener('click', clickHandler);
        }
        
        return button;
    }
    
    /**
     * Create an image
     */
    createImage(coordStr, src, options = {}) {
        const defaultOptions = {
            styles: {
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '5px',
                ...options.styles
            },
            ...options
        };
        
        const container = this.createElement(coordStr, 'div', defaultOptions);
        
        if (container) {
            const img = document.createElement('img');
            img.src = src;
            img.alt = options.alt || '';
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = defaultOptions.styles.objectFit;
            container.appendChild(img);
        }
        
        return container;
    }
    
    /**
     * Apply positioning to element
     */
    applyPositioning(element, pixels, styles = {}) {
        // Base positioning
        element.style.position = 'absolute';
        element.style.left = `${pixels.left}px`;
        element.style.top = `${pixels.top}px`;
        element.style.width = `${pixels.width}px`;
        element.style.height = `${pixels.height}px`;
        
        // Apply additional styles with gc conversion
        if (styles && Object.keys(styles).length > 0) {
            this.fontUtils.applyStylesToElement(element, styles);
        }
    }
    
    /**
     * Get parent element
     */
    getParent(parent) {
        if (!parent) {
            return document.querySelector('.main-container') || 
                   document.querySelector('#react-root') || 
                   document.body;
        }
        
        if (typeof parent === 'string') {
            return document.querySelector(parent);
        }
        
        return parent;
    }
    
    /**
     * Update all tracked elements
     */
    updateAllElements() {
        this.elements.forEach((data, id) => {
            try {
                const coords = this.calculations.parseCoordinates(data.coordinates);
                const pixels = this.calculations.coordinatesToPixels(coords);
                
                // Update positioning
                this.applyPositioning(data.element, pixels, data.options.styles);
                
            } catch (e) {
                console.warn(`Error updating element ${id}:`, e);
            }
        });
    }
    
    /**
     * Remove element
     */
    removeElement(elementId) {
        const data = this.elements.get(elementId);
        if (data && data.element && data.element.parentNode) {
            data.element.parentNode.removeChild(data.element);
            this.elements.delete(elementId);
            return true;
        }
        return false;
    }
    
    /**
     * Move element to new coordinates
     */
    moveElement(elementId, newCoordStr) {
        const data = this.elements.get(elementId);
        if (!data) return false;
        
        try {
            const coords = this.calculations.parseCoordinates(newCoordStr);
            const pixels = this.calculations.coordinatesToPixels(coords);
            
            // Update positioning
            this.applyPositioning(data.element, pixels, data.options.styles);
            
            // Update stored coordinates
            data.coordinates = newCoordStr;
            data.coords = coords;
            
            return true;
            
        } catch (e) {
            console.error('Error moving element:', e);
            return false;
        }
    }
    
    /**
     * Get element information
     */
    getElementInfo(elementId) {
        return this.elements.get(elementId);
    }
    
    /**
     * Show grid overlay
     */
    showGrid() {
        this.overlay.show();
    }
    
    /**
     * Hide grid overlay
     */
    hideGrid() {
        this.overlay.hide();
    }
    
    /**
     * Toggle grid overlay
     */
    toggleGrid() {
        this.overlay.toggle();
    }
    
    /**
     * Set grid precision
     */
    setPrecision(level) {
        this.config.setPrecision(level);
        this.updateAllElements();
    }
    
    /**
     * Get grid information
     */
    getGridInfo() {
        return this.calculations.getGridInfo();
    }
    
    /**
     * Debug element
     */
    debugElement(elementId) {
        const data = this.elements.get(elementId);
        if (!data) {
            console.warn(`Element ${elementId} not found`);
            return null;
        }
        
        const info = {
            id: elementId,
            coordinates: data.coordinates,
            coords: data.coords,
            element: data.element,
            boundingRect: data.element.getBoundingClientRect(),
            computedStyle: window.getComputedStyle(data.element),
            options: data.options
        };
        
        console.log('Element Debug Info:', info);
        return info;
    }
    
    /**
     * Convert coordinates to pixels
     */
    coordinatesToPixels(coordStr) {
        const coords = this.calculations.parseCoordinates(coordStr);
        return this.calculations.coordinatesToPixels(coords);
    }
    
    /**
     * Convert pixels to coordinates
     */
    pixelsToCoordinates(x, y) {
        return this.calculations.pixelsToCoordinates(x, y);
    }
    
    /**
     * Validate coordinates
     */
    isValidCoordinate(coordStr) {
        return this.calculations.isValidCoordinate(coordStr);
    }
    
    /**
     * Get help information
     */
    help() {
        console.log(`
Grid System Help
================

Basic Usage:
- GridSystem.createElement('R1C1', 'div', options)
- GridSystem.createTextBox('R2C2-R4C10', 'Hello World')
- GridSystem.createButton('R5C1-R6C5', 'Click Me', () => alert('Clicked!'))

Grid Overlay:
- Press Ctrl+G to toggle grid overlay
- Press Ctrl+Shift+G to toggle info panel

Coordinates:
- Single cell: 'R5C10' (Row 5, Column 10)
- Range: 'R1C1-R10C20' (Rectangle from R1C1 to R10C20)

Grid Cell Units (gc):
- fontSize: '85gc' = 85% of grid cell height
- padding: '50gc' = 50% of smaller cell dimension
- borderRadius: '25gc' = 25% of smaller cell dimension

Precision Levels:
- 1: 16×9 grid (coarse)
- 2: 32×18 grid
- 3: 48×27 grid (recommended)
- 4: 64×36 grid
- 5: 80×45 grid (very fine)
- 6: 96×54 grid (ultra fine)
- 7: 112×63 grid (extremely fine)
- 8: 128×72 grid (pixel-perfect)
- 9: 144×81 grid (maximum)
- 10: 160×90 grid (ultra precision)

Examples:
GridSystem.createTextBox('R2C2-R8C20', 'Hello World!', {
    styles: {
        fontSize: '85gc',
        padding: '50gc',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '75gc'
    }
});

GridSystem.createButton('R10C5-R12C15', 'Click Me', 
    () => alert('Button clicked!'),
    { styles: { backgroundColor: '#28a745' } }
);
        `);
    }
}

// Create global instance
let gridSystemInstance = null;

// Static methods for easy access
GridSystem.create = function() {
    if (!gridSystemInstance) {
        gridSystemInstance = new GridSystem();
    }
    return gridSystemInstance;
};

GridSystem.getInstance = function() {
    return gridSystemInstance || GridSystem.create();
};

// Convenience static methods
GridSystem.createElement = function(...args) {
    return GridSystem.getInstance().createElement(...args);
};

GridSystem.createTextBox = function(...args) {
    return GridSystem.getInstance().createTextBox(...args);
};

GridSystem.createButton = function(...args) {
    return GridSystem.getInstance().createButton(...args);
};

GridSystem.createImage = function(...args) {
    return GridSystem.getInstance().createImage(...args);
};

GridSystem.showGrid = function() {
    return GridSystem.getInstance().showGrid();
};

GridSystem.hideGrid = function() {
    return GridSystem.getInstance().hideGrid();
};

GridSystem.toggleGrid = function() {
    return GridSystem.getInstance().toggleGrid();
};

GridSystem.setPrecision = function(level) {
    return GridSystem.getInstance().setPrecision(level);
};

GridSystem.getGridInfo = function() {
    return GridSystem.getInstance().getGridInfo();
};

GridSystem.debugElement = function(id) {
    return GridSystem.getInstance().debugElement(id);
};

GridSystem.help = function() {
    return GridSystem.getInstance().help();
};

// Visual Editor convenience methods
GridSystem.openEditor = function() {
    if (window.gridEditor) {
        window.gridEditor.showEditor();
    } else {
        console.warn('Visual editor not available. Make sure GridEditor.js is loaded.');
    }
};

GridSystem.closeEditor = function() {
    if (window.gridEditor) {
        window.gridEditor.hideEditor();
    }
};

GridSystem.toggleEditor = function() {
    if (window.gridEditor) {
        window.gridEditor.toggleEditor();
    } else {
        console.warn('Visual editor not available. Make sure GridEditor.js is loaded.');
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GridSystem;
} else {
    window.GridSystem = GridSystem;
    
    // Auto-initialize when DOM is ready
    GridSystem.create();
} 