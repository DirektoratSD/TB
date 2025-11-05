/**
 * GRID CONFIGURATION SYSTEM
 * =========================
 * Core configuration for the responsive grid positioning system.
 * Defines grid dimensions, breakpoints, and layout constants.
 */

class GridConfig {
    constructor() {
        // Default grid configuration
        this.config = {
            // Grid dimensions based on precision level
            precision: 8, // 1=16x9, 2=32x18, 3=48x27, 4=64x36, 5=80x45, 6=96x54, 7=112x63, 8=128x72, 9=144x81, 10=160x90
            
            // Aspect ratio (16:9 for standard widescreen)
            aspectRatio: {
                width: 16,
                height: 9
            },
            
            // Responsive breakpoints
            breakpoints: {
                mobile: 768,
                tablet: 1024,
                desktop: 1440,
                ultrawide: 1920
            },
            
            // Font scaling factors for different screen sizes
            fontScaling: {
                mobile: 0.85,
                tablet: 0.9,
                desktop: 1.0,
                ultrawide: 1.1
            },
            
            // Grid overlay settings
            overlay: {
                enabled: false,
                color: 'rgba(0, 150, 255, 0.3)',
                lineWidth: 1,
                numberColor: 'rgba(0, 100, 200, 0.7)',
                numberSize: '10px',
                zIndex: 9999
            },
            
            // Default styling
            defaultStyles: {
                position: 'absolute',
                boxSizing: 'border-box',
                fontFamily: 'Arial, sans-serif',
                transition: 'all 0.3s ease'
            },
            
            // Grid cell font unit settings
            gcUnit: {
                baseFontSize: 16, // Base font size in pixels
                scaleFactor: 0.01, // How much of grid cell height = 1gc
                minFontSize: 8,
                maxFontSize: 100
            },
            
            // Performance settings
            performance: {
                cacheTimeout: 5000, // Cache calculations for 5 seconds
                throttleResize: 150, // Throttle resize events
                enableOptimizations: true
            }
        };
        
        // Calculated values cache
        this.cache = {
            gridDimensions: null,
            containerBounds: null,
            lastUpdate: 0,
            breakpoint: null
        };
        
        // Initialize
        this.updateGridDimensions();
        this.detectBreakpoint();
    }
    
    /**
     * Set grid precision level
     * @param {number} level - 1 to 10 (higher = more precise)
     */
    setPrecision(level) {
        if (level < 1 || level > 10) {
            console.warn('Grid precision must be between 1 and 10');
            return;
        }
        
        this.config.precision = level;
        this.updateGridDimensions();
        this.clearCache();
    }
    
    /**
     * Update grid dimensions based on precision
     */
    updateGridDimensions() {
        const precision = this.config.precision;
        const base = this.config.aspectRatio;
        
        this.config.gridColumns = base.width * precision;
        this.config.gridRows = base.height * precision;
        
        // Update cache
        this.cache.gridDimensions = {
            columns: this.config.gridColumns,
            rows: this.config.gridRows,
            precision: precision
        };
    }
    
    /**
     * Detect current breakpoint
     */
    detectBreakpoint() {
        const width = window.innerWidth;
        const bp = this.config.breakpoints;
        
        if (width < bp.mobile) {
            this.cache.breakpoint = 'mobile';
        } else if (width < bp.tablet) {
            this.cache.breakpoint = 'tablet';
        } else if (width < bp.desktop) {
            this.cache.breakpoint = 'desktop';
        } else {
            this.cache.breakpoint = 'ultrawide';
        }
        
        return this.cache.breakpoint;
    }
    
    /**
     * Get current font scaling factor
     */
    getFontScaling() {
        const breakpoint = this.cache.breakpoint || this.detectBreakpoint();
        return this.config.fontScaling[breakpoint] || 1.0;
    }
    
    /**
     * Get grid dimensions
     */
    getGridDimensions() {
        if (!this.cache.gridDimensions) {
            this.updateGridDimensions();
        }
        return this.cache.gridDimensions;
    }
    
    /**
     * Update configuration
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.updateGridDimensions();
        this.clearCache();
    }
    
    /**
     * Get current configuration
     */
    getConfig() {
        return { ...this.config };
    }
    
    /**
     * Clear cache
     */
    clearCache() {
        this.cache.containerBounds = null;
        this.cache.lastUpdate = 0;
    }
    
    /**
     * Check if cache is valid
     */
    isCacheValid() {
        if (!this.config.performance.enableOptimizations) return false;
        
        const now = Date.now();
        const timeout = this.config.performance.cacheTimeout;
        
        return (now - this.cache.lastUpdate) < timeout;
    }
    
    /**
     * Update cache timestamp
     */
    updateCacheTimestamp() {
        this.cache.lastUpdate = Date.now();
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GridConfig;
} else {
    window.GridConfig = GridConfig;
} 