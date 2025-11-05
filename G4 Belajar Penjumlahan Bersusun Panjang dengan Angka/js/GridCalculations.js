/**
 * GRID CALCULATIONS ENGINE
 * ========================
 * Handles all mathematical calculations for grid positioning,
 * coordinate parsing, and responsive sizing.
 */

class GridCalculations {
    constructor(gridConfig) {
        this.config = gridConfig;
        this.containerElement = null;
        this.containerBounds = null;
        
        // Initialize container detection
        this.detectContainer();
        
        // Bind resize handler
        this.handleResize = this.throttle(this.handleResize.bind(this), 150);
        window.addEventListener('resize', this.handleResize);
    }
    
    /**
     * Detect the main container element
     */
    detectContainer() {
        // Try to find existing container
        this.containerElement = 
            document.querySelector('.main-container') ||
            document.querySelector('#react-root') ||
            document.body;
        
        this.updateContainerBounds();
    }
    
    /**
     * Update container bounds
     */
    updateContainerBounds() {
        if (!this.containerElement) return;
        
        // Get the actual container bounds from the DOM
        const rect = this.containerElement.getBoundingClientRect();
        
        // Use the actual container position and dimensions
        this.containerBounds = {
            width: rect.width,
            height: rect.height,
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom
        };
        
        // Update cache
        this.config.cache.containerBounds = this.containerBounds;
        this.config.updateCacheTimestamp();
    }
    
    /**
     * Get container bounds (cached)
     */
    getContainerBounds() {
        if (!this.config.isCacheValid() || !this.containerBounds) {
            this.updateContainerBounds();
        }
        return this.containerBounds;
    }
    
    /**
     * Parse coordinate string (e.g., "R5C10", "R1C1-R10C20")
     */
    parseCoordinates(coordStr) {
        if (!coordStr || typeof coordStr !== 'string') {
            throw new Error('Invalid coordinate string');
        }
        
        const coordStr_clean = coordStr.replace(/\s+/g, '');
        
        // Check for range (contains dash)
        if (coordStr_clean.includes('-')) {
            const parts = coordStr_clean.split('-');
            if (parts.length !== 2) {
                throw new Error('Invalid coordinate range format');
            }
            
            const start = this.parseSingleCoordinate(parts[0]);
            const end = this.parseSingleCoordinate(parts[1]);
            
            return {
                type: 'range',
                start: start,
                end: end,
                width: end.col - start.col + 1,
                height: end.row - start.row + 1
            };
        } else {
            // Single coordinate
            const coord = this.parseSingleCoordinate(coordStr_clean);
            return {
                type: 'single',
                start: coord,
                end: coord,
                width: 1,
                height: 1
            };
        }
    }
    
    /**
     * Parse single coordinate (e.g., "R5C10")
     */
    parseSingleCoordinate(coordStr) {
        const match = coordStr.match(/^R(\d+)C(\d+)$/i);
        if (!match) {
            throw new Error(`Invalid coordinate format: ${coordStr}`);
        }
        
        const row = parseInt(match[1], 10);
        const col = parseInt(match[2], 10);
        
        const gridDims = this.config.getGridDimensions();
        
        if (row < 1 || row > gridDims.rows || col < 1 || col > gridDims.columns) {
            throw new Error(`Coordinate ${coordStr} is out of bounds`);
        }
        
        return { row: row, col: col };
    }
    
    /**
     * Convert grid coordinates to pixel positions
     */
    coordinatesToPixels(coords) {
        const bounds = this.getContainerBounds();
        const gridDims = this.config.getGridDimensions();
        
        const cellWidth = bounds.width / gridDims.columns;
        const cellHeight = bounds.height / gridDims.rows;
        
        // Calculate position (0-based indexing for positioning)
        const left = bounds.left + (coords.start.col - 1) * cellWidth;
        const top = bounds.top + (coords.start.row - 1) * cellHeight;
        const width = coords.width * cellWidth;
        const height = coords.height * cellHeight;
        
        return {
            left: Math.round(left),
            top: Math.round(top),
            width: Math.round(width),
            height: Math.round(height),
            right: Math.round(left + width),
            bottom: Math.round(top + height),
            centerX: Math.round(left + width / 2),
            centerY: Math.round(top + height / 2),
            cellWidth: cellWidth,
            cellHeight: cellHeight
        };
    }
    
    /**
     * Convert pixel position to grid coordinates
     */
    pixelsToCoordinates(x, y) {
        const bounds = this.getContainerBounds();
        const gridDims = this.config.getGridDimensions();
        
        const cellWidth = bounds.width / gridDims.columns;
        const cellHeight = bounds.height / gridDims.rows;
        
        // Calculate grid position (relative to container)
        const relativeX = x - bounds.left;
        const relativeY = y - bounds.top;
        
        const col = Math.floor(relativeX / cellWidth) + 1;
        const row = Math.floor(relativeY / cellHeight) + 1;
        
        // Clamp to grid bounds
        const clampedCol = Math.max(1, Math.min(gridDims.columns, col));
        const clampedRow = Math.max(1, Math.min(gridDims.rows, row));
        
        return {
            row: clampedRow,
            col: clampedCol,
            coordinate: `R${clampedRow}C${clampedCol}`
        };
    }
    
    /**
     * Get grid cell dimensions
     */
    getCellDimensions() {
        const bounds = this.getContainerBounds();
        const gridDims = this.config.getGridDimensions();
        
        return {
            width: bounds.width / gridDims.columns,
            height: bounds.height / gridDims.rows
        };
    }
    
    /**
     * Calculate optimal font size for grid cell
     */
    calculateOptimalFontSize(coords, textContent = '') {
        const pixels = this.coordinatesToPixels(coords);
        const cellDims = this.getCellDimensions();
        
        // Base font size as percentage of cell height
        const baseFontSize = cellDims.height * 0.6; // 60% of cell height
        
        // Apply responsive scaling
        const scaleFactor = this.config.getFontScaling();
        const adjustedFontSize = baseFontSize * scaleFactor;
        
        // Apply content-based scaling
        let contentFactor = 1;
        if (textContent.length > 20) {
            contentFactor = 0.8;
        } else if (textContent.length > 10) {
            contentFactor = 0.9;
        }
        
        const finalFontSize = adjustedFontSize * contentFactor;
        
        // Clamp to reasonable bounds
        const config = this.config.getConfig();
        const minSize = config.gcUnit.minFontSize;
        const maxSize = config.gcUnit.maxFontSize;
        
        return Math.max(minSize, Math.min(maxSize, Math.round(finalFontSize)));
    }
    
    /**
     * Handle window resize
     */
    handleResize() {
        this.config.detectBreakpoint();
        this.updateContainerBounds();
        
        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('gridResize', {
            detail: {
                containerBounds: this.containerBounds,
                breakpoint: this.config.cache.breakpoint
            }
        }));
    }
    
    /**
     * Throttle function
     */
    throttle(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    /**
     * Check if coordinates are valid
     */
    isValidCoordinate(coordStr) {
        try {
            this.parseCoordinates(coordStr);
            return true;
        } catch (e) {
            return false;
        }
    }
    
    /**
     * Get grid information for debugging
     */
    getGridInfo() {
        const bounds = this.getContainerBounds();
        const gridDims = this.config.getGridDimensions();
        const cellDims = this.getCellDimensions();
        
        return {
            containerBounds: bounds,
            gridDimensions: gridDims,
            cellDimensions: cellDims,
            breakpoint: this.config.cache.breakpoint,
            precision: this.config.getConfig().precision
        };
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GridCalculations;
} else {
    window.GridCalculations = GridCalculations;
} 