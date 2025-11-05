/**
 * GRID FONT UTILITIES
 * ===================
 * Handles responsive typography with grid cell (gc) units.
 * Converts 'gc' units to pixel values based on grid cell dimensions.
 */

class GridFontUtils {
    constructor(gridConfig, gridCalculations) {
        this.config = gridConfig;
        this.calculations = gridCalculations;
        
        // Font conversion cache
        this.fontCache = new Map();
        
        // Initialize font processing
        this.initializeFontProcessing();
    }
    
    /**
     * Initialize font processing system
     */
    initializeFontProcessing() {
        // Listen for grid resize events
        window.addEventListener('gridResize', () => {
            this.clearFontCache();
            this.updateAllGcElements();
        });
        
        // Process existing elements on initialization
        this.updateAllGcElements();
    }
    
    /**
     * Convert grid cell units to pixels
     * @param {string} gcValue - Value with 'gc' unit (e.g., '85gc')
     * @param {string} property - CSS property type ('fontSize', 'padding', etc.)
     * @param {object} contextCoords - Grid coordinates for context
     * @returns {number} Pixel value
     */
    convertGcToPixels(gcValue, property = 'fontSize', contextCoords = null) {
        // Parse the gc value
        const gcMatch = String(gcValue).match(/^(\d+(?:\.\d+)?)gc$/);
        if (!gcMatch) {
            // Not a gc value, return as-is
            return gcValue;
        }
        
        const gcNumber = parseFloat(gcMatch[1]);
        
        // Get cell dimensions
        const cellDims = this.calculations.getCellDimensions();
        
        // Cache key for performance
        const cacheKey = `${gcNumber}-${property}-${cellDims.width}-${cellDims.height}`;
        if (this.fontCache.has(cacheKey)) {
            return this.fontCache.get(cacheKey);
        }
        
        // Calculate pixel value based on property type
        let pixelValue;
        
        switch (property.toLowerCase()) {
            case 'fontsize':
                pixelValue = this.calculateFontSize(gcNumber, cellDims, contextCoords);
                break;
            case 'lineheight':
                pixelValue = this.calculateLineHeight(gcNumber, cellDims);
                break;
            case 'padding':
            case 'margin':
                pixelValue = this.calculateSpacing(gcNumber, cellDims);
                break;
            case 'borderradius':
                pixelValue = this.calculateBorderRadius(gcNumber, cellDims);
                break;
            case 'width':
            case 'height':
                pixelValue = this.calculateDimension(gcNumber, cellDims, property);
                break;
            default:
                // Default to font-size calculation
                pixelValue = this.calculateFontSize(gcNumber, cellDims, contextCoords);
        }
        
        // Cache the result
        this.fontCache.set(cacheKey, pixelValue);
        
        return pixelValue;
    }
    
    /**
     * Calculate font size in pixels
     */
    calculateFontSize(gcNumber, cellDims, contextCoords) {
        // Base: 100gc = 100% of cell height
        const baseSize = (gcNumber / 100) * cellDims.height;
        
        // Apply responsive scaling
        const scaleFactor = this.config.getFontScaling();
        const scaledSize = baseSize * scaleFactor;
        
        // Apply minimum/maximum bounds
        const config = this.config.getConfig();
        const minSize = config.gcUnit.minFontSize;
        const maxSize = config.gcUnit.maxFontSize;
        
        return Math.max(minSize, Math.min(maxSize, Math.round(scaledSize)));
    }
    
    /**
     * Calculate line height
     */
    calculateLineHeight(gcNumber, cellDims) {
        // Line height as ratio (no units)
        const baseFontSize = cellDims.height * 0.6; // Assume 60% cell height as base
        const lineHeightPixels = (gcNumber / 100) * cellDims.height;
        
        // Return as unitless ratio
        return (lineHeightPixels / baseFontSize).toFixed(2);
    }
    
    /**
     * Calculate spacing (padding/margin)
     */
    calculateSpacing(gcNumber, cellDims) {
        // Use smaller dimension for spacing to maintain proportions
        const baseDimension = Math.min(cellDims.width, cellDims.height);
        const spacing = (gcNumber / 100) * baseDimension;
        
        return Math.round(spacing);
    }
    
    /**
     * Calculate border radius
     */
    calculateBorderRadius(gcNumber, cellDims) {
        // Use smaller dimension for border radius
        const baseDimension = Math.min(cellDims.width, cellDims.height);
        const radius = (gcNumber / 100) * baseDimension;
        
        return Math.round(radius);
    }
    
    /**
     * Calculate dimensions (width/height)
     */
    calculateDimension(gcNumber, cellDims, property) {
        const dimension = property.toLowerCase() === 'width' ? cellDims.width : cellDims.height;
        const calculatedValue = (gcNumber / 100) * dimension;
        
        return Math.round(calculatedValue);
    }
    
    /**
     * Process styles object and convert gc units
     */
    processStyles(styles, contextCoords = null) {
        if (!styles || typeof styles !== 'object') {
            return styles;
        }
        
        const processedStyles = {};
        
        for (const [property, value] of Object.entries(styles)) {
            if (typeof value === 'string' && value.includes('gc')) {
                // Convert gc units to pixels
                const pixelValue = this.convertGcToPixels(value, property, contextCoords);
                
                // Add appropriate unit suffix
                if (property.toLowerCase() === 'lineheight') {
                    processedStyles[property] = pixelValue; // No unit for line-height
                } else {
                    processedStyles[property] = `${pixelValue}px`;
                }
            } else {
                processedStyles[property] = value;
            }
        }
        
        return processedStyles;
    }
    
    /**
     * Apply styles to element with gc conversion
     */
    applyStylesToElement(element, styles, contextCoords = null) {
        if (!element || !styles) return;
        
        const processedStyles = this.processStyles(styles, contextCoords);
        
        for (const [property, value] of Object.entries(processedStyles)) {
            // Convert camelCase to kebab-case for CSS
            const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();
            element.style.setProperty(cssProperty, value);
        }
    }
    
    /**
     * Update all elements with gc units
     */
    updateAllGcElements() {
        // Find all elements with gc units in their styles
        const elements = document.querySelectorAll('*');
        
        elements.forEach(element => {
            const computedStyle = window.getComputedStyle(element);
            
            // Check for gc units in various properties
            const propertiesToCheck = [
                'fontSize', 'lineHeight', 'padding', 'margin', 
                'borderRadius', 'width', 'height'
            ];
            
            propertiesToCheck.forEach(property => {
                const value = element.style[property];
                if (value && value.includes('gc')) {
                    const pixelValue = this.convertGcToPixels(value, property);
                    element.style[property] = `${pixelValue}px`;
                }
            });
        });
    }
    
    /**
     * Clear font cache
     */
    clearFontCache() {
        this.fontCache.clear();
    }
    
    /**
     * Get optimal font size for text content
     */
    getOptimalFontSize(coordStr, textContent = '', options = {}) {
        try {
            const coords = this.calculations.parseCoordinates(coordStr);
            const pixels = this.calculations.coordinatesToPixels(coords);
            
            // Calculate base font size
            const baseFontSize = Math.min(pixels.width, pixels.height) * 0.6;
            
            // Apply content-based adjustments
            let contentFactor = 1;
            if (textContent.length > 50) {
                contentFactor = 0.6;
            } else if (textContent.length > 20) {
                contentFactor = 0.8;
            }
            
            // Apply responsive scaling
            const scaleFactor = this.config.getFontScaling();
            
            // Apply options
            const optionsFactor = options.scale || 1;
            
            const finalSize = baseFontSize * contentFactor * scaleFactor * optionsFactor;
            
            // Clamp to bounds
            const config = this.config.getConfig();
            const minSize = config.gcUnit.minFontSize;
            const maxSize = config.gcUnit.maxFontSize;
            
            return Math.max(minSize, Math.min(maxSize, Math.round(finalSize)));
        } catch (e) {
            console.warn('Error calculating optimal font size:', e);
            return 16; // Default fallback
        }
    }
    
    /**
     * Create responsive text sizing
     */
    createResponsiveTextSizing(coordStr, textContent = '') {
        const fontSize = this.getOptimalFontSize(coordStr, textContent);
        const lineHeight = Math.round(fontSize * 1.2);
        
        return {
            fontSize: `${fontSize}px`,
            lineHeight: `${lineHeight}px`,
            wordWrap: 'break-word',
            overflow: 'hidden'
        };
    }
    
    /**
     * Get font metrics for debugging
     */
    getFontMetrics(coordStr) {
        try {
            const coords = this.calculations.parseCoordinates(coordStr);
            const pixels = this.calculations.coordinatesToPixels(coords);
            const cellDims = this.calculations.getCellDimensions();
            
            return {
                coordinates: coords,
                pixelArea: pixels,
                cellDimensions: cellDims,
                recommendedFontSize: this.getOptimalFontSize(coordStr),
                scaleFactor: this.config.getFontScaling(),
                breakpoint: this.config.cache.breakpoint
            };
        } catch (e) {
            return null;
        }
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GridFontUtils;
} else {
    window.GridFontUtils = GridFontUtils;
} 