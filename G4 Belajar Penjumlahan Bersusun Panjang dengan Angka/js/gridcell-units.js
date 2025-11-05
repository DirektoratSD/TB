/**
 * GRID CELL UNITS SYSTEM (GC)
 * ===========================
 * Provides consistent sizing units based on grid cells
 * 1gc = 1 cell when precision is 10 (160x90 grid)
 * Scales proportionally for other precisions
 */

class GridCellUnits {
    constructor() {
        // Reference precision where 1gc = 1 cell
        this.referencePrecision = 10;
        
        // Current grid precision from GridPositions
        this.currentPrecision = 8; // Default precision
        
        // Base screen dimensions for calculations (16:9 aspect ratio)
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
        
        // Initialize CSS variables when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.updateCSSVariables();
            });
        } else {
            this.updateCSSVariables();
        }
    }
    
    /**
     * Update current precision from grid system
     * @param {number} precision - Current grid precision (1-10)
     */
    setPrecision(precision) {
        if (precision >= 1 && precision <= 10) {
            this.currentPrecision = precision;
            this.cache.clear();
            this.updateCSSVariables();
        }
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
                this.updateCSSVariables(); // Update CSS variables on resize
            }, 100);
        });
    }
    
    /**
     * Calculate gc scaling factor based on current precision
     * @returns {number} Scaling factor where 1.0 = precision 10
     */
    getGcScaleFactor() {
        return this.referencePrecision / this.currentPrecision;
    }
    
    /**
     * Get current grid dimensions
     * @returns {object} Grid dimensions
     */
    getCurrentGridDimensions() {
        const factor = this.currentPrecision;
        return {
            columns: 16 * factor,
            rows: 9 * factor,
            precision: this.currentPrecision
        };
    }
    
    /**
     * Convert gc units to pixels
     * @param {number} gcValue - Value in gc units
     * @param {string} direction - 'width' or 'height' for directional conversion
     * @returns {number} Value in pixels
     */
    gcToPixels(gcValue, direction = 'width') {
        const cacheKey = `px_${gcValue}_${direction}_${this.lastScreenSize.width}x${this.lastScreenSize.height}`;
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        
        const gridDimensions = this.getCurrentGridDimensions();
        const scaleFactor = this.getGcScaleFactor();
        
        // Calculate cell size in pixels
        let cellSizeInPixels;
        if (direction === 'height') {
            cellSizeInPixels = window.innerHeight / gridDimensions.rows;
        } else {
            cellSizeInPixels = window.innerWidth / gridDimensions.columns;
        }
        
        // Apply gc scaling and convert to pixels
        const pixelValue = gcValue * scaleFactor * cellSizeInPixels;
        
        this.cache.set(cacheKey, pixelValue);
        return Math.round(pixelValue * 100) / 100; // Round to 2 decimal places
    }
    
    /**
     * Convert gc units to percentage of container
     * @param {number} gcValue - Value in gc units
     * @param {string} direction - 'width' or 'height' for directional conversion
     * @returns {number} Value as percentage
     */
    gcToPercent(gcValue, direction = 'width') {
        const cacheKey = `pct_${gcValue}_${direction}_${this.currentPrecision}`;
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        
        const gridDimensions = this.getCurrentGridDimensions();
        const scaleFactor = this.getGcScaleFactor();
        
        // Calculate percentage based on grid
        let percentage;
        if (direction === 'height') {
            percentage = (gcValue * scaleFactor / gridDimensions.rows) * 100;
        } else {
            percentage = (gcValue * scaleFactor / gridDimensions.columns) * 100;
        }
        
        this.cache.set(cacheKey, percentage);
        return Math.round(percentage * 100) / 100; // Round to 2 decimal places
    }
    
    /**
     * Convert gc units to rem units (relative to root font size)
     * @param {number} gcValue - Value in gc units
     * @param {number} rootFontSize - Root font size in pixels (default: 16)
     * @returns {number} Value in rem units
     */
    gcToRem(gcValue, rootFontSize = 16) {
        const pixels = this.gcToPixels(gcValue, 'height'); // Use height for font calculations
        return Math.round((pixels / rootFontSize) * 100) / 100;
    }
    
    /**
     * Convert gc units to em units (relative to parent font size)
     * @param {number} gcValue - Value in gc units
     * @param {number} parentFontSize - Parent font size in pixels
     * @returns {number} Value in em units
     */
    gcToEm(gcValue, parentFontSize) {
        const pixels = this.gcToPixels(gcValue, 'height');
        return Math.round((pixels / parentFontSize) * 100) / 100;
    }
    
    /**
     * Convert gc units to viewport units
     * @param {number} gcValue - Value in gc units
     * @param {string} unit - 'vw', 'vh', 'vmin', or 'vmax'
     * @returns {number} Value in viewport units
     */
    gcToViewport(gcValue, unit = 'vw') {
        const cacheKey = `vp_${gcValue}_${unit}_${this.currentPrecision}`;
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        
        const gridDimensions = this.getCurrentGridDimensions();
        const scaleFactor = this.getGcScaleFactor();
        
        let viewportValue;
        switch (unit) {
            case 'vh':
                viewportValue = (gcValue * scaleFactor / gridDimensions.rows) * 100;
                break;
            case 'vmin':
                const minDimension = Math.min(gridDimensions.columns, gridDimensions.rows);
                viewportValue = (gcValue * scaleFactor / minDimension) * 100;
                break;
            case 'vmax':
                const maxDimension = Math.max(gridDimensions.columns, gridDimensions.rows);
                viewportValue = (gcValue * scaleFactor / maxDimension) * 100;
                break;
            case 'vw':
            default:
                viewportValue = (gcValue * scaleFactor / gridDimensions.columns) * 100;
                break;
        }
        
        this.cache.set(cacheKey, viewportValue);
        return Math.round(viewportValue * 100) / 100;
    }
    
    /**
     * Generate CSS with gc units converted to specified unit type
     * @param {object} styles - CSS styles object with gc values
     * @param {string} outputUnit - 'px', 'rem', 'percent', 'vw', 'vh'
     * @returns {object} CSS styles object with converted values
     */
    generateCSS(styles, outputUnit = 'px') {
        const convertedStyles = {};
        
        for (const [property, value] of Object.entries(styles)) {
            if (typeof value === 'number') {
                // Determine direction based on property
                const direction = this.getPropertyDirection(property);
                
                switch (outputUnit) {
                    case 'rem':
                        convertedStyles[property] = `${this.gcToRem(value)}rem`;
                        break;
                    case 'percent':
                        convertedStyles[property] = `${this.gcToPercent(value, direction)}%`;
                        break;
                    case 'vw':
                        convertedStyles[property] = `${this.gcToViewport(value, 'vw')}vw`;
                        break;
                    case 'vh':
                        convertedStyles[property] = `${this.gcToViewport(value, 'vh')}vh`;
                        break;
                    case 'px':
                    default:
                        convertedStyles[property] = `${this.gcToPixels(value, direction)}px`;
                        break;
                }
            } else {
                convertedStyles[property] = value;
            }
        }
        
        return convertedStyles;
    }
    
    /**
     * Determine if a CSS property affects width or height
     * @param {string} property - CSS property name
     * @returns {string} 'width' or 'height'
     */
    getPropertyDirection(property) {
        const heightProperties = [
            'height', 'minHeight', 'maxHeight', 'top', 'bottom',
            'marginTop', 'marginBottom', 'paddingTop', 'paddingBottom',
            'fontSize', 'lineHeight'
        ];
        
        return heightProperties.includes(property) ? 'height' : 'width';
    }
    
    /**
     * Create a CSS custom property for gc units
     * @param {string} name - Custom property name (without --)
     * @param {number} gcValue - Value in gc units
     * @param {string} direction - 'width' or 'height'
     * @returns {string} CSS custom property declaration
     */
    createCSSCustomProperty(name, gcValue, direction = 'width') {
        const pixelValue = this.gcToPixels(gcValue, direction);
        return `--${name}: ${pixelValue}px;`;
    }
    
    /**
     * Get scaling information for debugging
     * @returns {object} Scaling information
     */
    getScalingInfo() {
        const gridDimensions = this.getCurrentGridDimensions();
        return {
            currentPrecision: this.currentPrecision,
            referencePrecision: this.referencePrecision,
            gcScaleFactor: this.getGcScaleFactor(),
            gridDimensions: gridDimensions,
            screenSize: { ...this.lastScreenSize },
            cellSizePixels: {
                width: this.gcToPixels(1, 'width'),
                height: this.gcToPixels(1, 'height')
            }
        };
    }
    
    /**
     * Update CSS variables for gc units
     * This function updates the CSS custom properties to reflect current gc values
     */
    updateCSSVariables() {
        const root = document.documentElement;
        
        // Update font sizes
        root.style.setProperty('--gc-font-tiny', `${this.gcToPixels(1, 'height')}px`);
        root.style.setProperty('--gc-font-small', `${this.gcToPixels(2, 'height')}px`);
        root.style.setProperty('--gc-font-medium', `${this.gcToPixels(3, 'height')}px`);
        root.style.setProperty('--gc-font-large', `${this.gcToPixels(4, 'height')}px`);
        root.style.setProperty('--gc-font-xlarge', `${this.gcToPixels(5, 'height')}px`);
        
        // Update spacing
        root.style.setProperty('--gc-spacing-xs', `${this.gcToPixels(0.5, 'width')}px`);
        root.style.setProperty('--gc-spacing-sm', `${this.gcToPixels(1, 'width')}px`);
        root.style.setProperty('--gc-spacing-md', `${this.gcToPixels(2, 'width')}px`);
        root.style.setProperty('--gc-spacing-lg', `${this.gcToPixels(3, 'width')}px`);
        root.style.setProperty('--gc-spacing-xl', `${this.gcToPixels(4, 'width')}px`);
        
        // Update border radius
        root.style.setProperty('--gc-border-radius-sm', `${this.gcToPixels(0.5, 'width')}px`);
        root.style.setProperty('--gc-border-radius-md', `${this.gcToPixels(1, 'width')}px`);
        root.style.setProperty('--gc-border-radius-lg', `${this.gcToPixels(2, 'width')}px`);
        
        // Update icon sizes
        root.style.setProperty('--gc-icon-sm', `${this.gcToPixels(1.5, 'width')}px`);
        root.style.setProperty('--gc-icon-md', `${this.gcToPixels(2, 'width')}px`);
        root.style.setProperty('--gc-icon-lg', `${this.gcToPixels(3, 'width')}px`);
        
        // Update button sizes
        root.style.setProperty('--gc-button-padding-x', `${this.gcToPixels(2, 'width')}px`);
        root.style.setProperty('--gc-button-padding-y', `${this.gcToPixels(1, 'height')}px`);
        root.style.setProperty('--gc-button-height', `${this.gcToPixels(4, 'height')}px`);
        
        // Update dialog box sizes
        root.style.setProperty('--gc-dialog-padding', `${this.gcToPixels(2, 'width')}px`);
        root.style.setProperty('--gc-dialog-min-width', `${this.gcToPixels(20, 'width')}px`);
        root.style.setProperty('--gc-dialog-min-height', `${this.gcToPixels(10, 'height')}px`);
        
        // Dialog font properties removed - dialog now uses GridCellFontUtils like NextButton
    }
    
    /**
     * Clear cache (useful for debugging or manual refresh)
     */
    clearCache() {
        this.cache.clear();
    }
}

// Create global instance
const gridCellUnits = new GridCellUnits();

// Utility functions for easier usage
const gc = {
    // Convert gc to different units
    toPx: (value, direction = 'width') => gridCellUnits.gcToPixels(value, direction),
    toPercent: (value, direction = 'width') => gridCellUnits.gcToPercent(value, direction),
    toRem: (value) => gridCellUnits.gcToRem(value),
    toVw: (value) => gridCellUnits.gcToViewport(value, 'vw'),
    toVh: (value) => gridCellUnits.gcToViewport(value, 'vh'),
    
    // Generate CSS with automatic conversion
    css: (styles, outputUnit = 'px') => gridCellUnits.generateCSS(styles, outputUnit),
    
    // Utility for setting precision
    setPrecision: (precision) => gridCellUnits.setPrecision(precision),
    
    // Update CSS variables
    updateCSS: () => gridCellUnits.updateCSSVariables(),
    

    
    // Debug information
    info: () => gridCellUnits.getScalingInfo()
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GridCellUnits, gc };
} else {
    window.GridCellUnits = GridCellUnits;
    window.gridCellUnits = gridCellUnits;
    window.gc = gc;
} 