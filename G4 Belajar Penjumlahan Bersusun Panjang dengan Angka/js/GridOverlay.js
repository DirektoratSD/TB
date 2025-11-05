/**
 * GRID OVERLAY COMPONENT
 * ======================
 * Visual grid overlay for development and debugging.
 * Shows grid lines, coordinates, and positioning helpers.
 */

class GridOverlay {
    constructor(gridConfig, gridCalculations) {
        this.config = gridConfig;
        this.calculations = gridCalculations;
        
        // Overlay elements
        this.overlayContainer = null;
        this.overlayCanvas = null;
        this.infoPanel = null;
        
        // State
        this.isVisible = false;
        this.showNumbers = true;
        this.showInfo = true;
        this.highlightedCell = null;
        
        // Initialize
        this.createOverlay();
        this.bindEvents();
    }
    
    /**
     * Create overlay elements
     */
    createOverlay() {
        // Create overlay container
        this.overlayContainer = document.createElement('div');
        this.overlayContainer.id = 'grid-overlay-container';
        this.overlayContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: ${this.config.getConfig().overlay.zIndex};
            display: none;
        `;
        
        // Create canvas for grid lines
        this.overlayCanvas = document.createElement('canvas');
        this.overlayCanvas.id = 'grid-overlay-canvas';
        this.overlayCanvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
        `;
        
        // Create info panel
        this.infoPanel = document.createElement('div');
        this.infoPanel.id = 'grid-info-panel';
        this.infoPanel.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
            font-size: 12px;
            line-height: 1.4;
            pointer-events: auto;
            max-width: 300px;
        `;
        
        // Assemble overlay
        this.overlayContainer.appendChild(this.overlayCanvas);
        this.overlayContainer.appendChild(this.infoPanel);
        
        // Add to document
        document.body.appendChild(this.overlayContainer);
        
        // Update display
        this.updateOverlay();
    }
    
    /**
     * Bind events
     */
    bindEvents() {
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'g') {
                e.preventDefault();
                this.toggle();
            }
            
            if (e.ctrlKey && e.shiftKey && e.key === 'G') {
                e.preventDefault();
                this.toggleInfo();
            }
        });
        
        // Mouse events for cell highlighting
        document.addEventListener('mousemove', (e) => {
            if (this.isVisible) {
                this.highlightCellAtPosition(e.clientX, e.clientY);
            }
        });
        
        // Resize events
        window.addEventListener('gridResize', () => {
            if (this.isVisible) {
                this.updateOverlay();
            }
        });
        
        // Regular resize fallback
        window.addEventListener('resize', () => {
            if (this.isVisible) {
                setTimeout(() => this.updateOverlay(), 100);
            }
        });
    }
    
    /**
     * Show overlay
     */
    show() {
        if (this.isVisible) return;
        
        this.isVisible = true;
        this.overlayContainer.style.display = 'block';
        this.updateOverlay();
        
        console.log('Grid overlay shown. Press Ctrl+G to hide.');
    }
    
    /**
     * Hide overlay
     */
    hide() {
        if (!this.isVisible) return;
        
        this.isVisible = false;
        this.overlayContainer.style.display = 'none';
        
        console.log('Grid overlay hidden.');
    }
    
    /**
     * Toggle overlay visibility
     */
    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }
    
    /**
     * Toggle info panel
     */
    toggleInfo() {
        this.showInfo = !this.showInfo;
        this.infoPanel.style.display = this.showInfo ? 'block' : 'none';
    }
    
    /**
     * Update overlay display
     */
    updateOverlay() {
        if (!this.isVisible) return;
        
        this.updateCanvas();
        this.updateInfoPanel();
    }
    
    /**
     * Update canvas with grid lines
     */
    updateCanvas() {
        const canvas = this.overlayCanvas;
        const ctx = canvas.getContext('2d');
        
        // Set canvas size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Get grid info
        const bounds = this.calculations.getContainerBounds();
        const gridDims = this.config.getGridDimensions();
        const overlayConfig = this.config.getConfig().overlay;
        
        // Calculate cell dimensions
        const cellWidth = bounds.width / gridDims.columns;
        const cellHeight = bounds.height / gridDims.rows;
        
        // Draw minor grid lines first (all lines)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'; // Light minor lines
        ctx.lineWidth = 0.5;
        
        // Draw all vertical lines (minor)
        for (let i = 0; i <= gridDims.columns; i++) {
            const x = bounds.left + (i * cellWidth);
            ctx.beginPath();
            ctx.moveTo(x, bounds.top);
            ctx.lineTo(x, bounds.bottom);
            ctx.stroke();
        }
        
        // Draw all horizontal lines (minor)
        for (let i = 0; i <= gridDims.rows; i++) {
            const y = bounds.top + (i * cellHeight);
            ctx.beginPath();
            ctx.moveTo(bounds.left, y);
            ctx.lineTo(bounds.right, y);
            ctx.stroke();
        }
        
        // Draw major grid lines (multiples of 5)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)'; // Brighter major lines
        ctx.lineWidth = 1.5;
        
        // Major vertical lines (every 5th column)
        for (let i = 0; i <= gridDims.columns; i += 5) {
            const x = bounds.left + (i * cellWidth);
            ctx.beginPath();
            ctx.moveTo(x, bounds.top);
            ctx.lineTo(x, bounds.bottom);
            ctx.stroke();
        }
        
        // Major horizontal lines (every 5th row)
        for (let i = 0; i <= gridDims.rows; i += 5) {
            const y = bounds.top + (i * cellHeight);
            ctx.beginPath();
            ctx.moveTo(bounds.left, y);
            ctx.lineTo(bounds.right, y);
            ctx.stroke();
        }
        
        // Draw border around entire grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.strokeRect(bounds.left, bounds.top, bounds.width, bounds.height);
        
        // Draw major grid labels
        this.drawMajorGridLabels(ctx, bounds, gridDims, cellWidth, cellHeight);
        
        // Draw numbers if enabled
        if (this.showNumbers) {
            this.drawGridNumbers(ctx, bounds, gridDims, cellWidth, cellHeight);
        }
        
        // Draw highlighted cell
        if (this.highlightedCell) {
            this.drawHighlightedCell(ctx, bounds, cellWidth, cellHeight);
        }
    }
    
    /**
     * Draw major grid labels (for multiples of 5)
     */
    drawMajorGridLabels(ctx, bounds, gridDims, cellWidth, cellHeight) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Draw column labels at the top
        for (let i = 5; i <= gridDims.columns; i += 5) {
            const x = bounds.left + (i * cellWidth);
            const y = bounds.top - 10;
            ctx.fillText(`C${i}`, x, y);
        }
        
        // Draw row labels on the left
        ctx.textAlign = 'right';
        for (let i = 5; i <= gridDims.rows; i += 5) {
            const x = bounds.left - 10;
            const y = bounds.top + (i * cellHeight);
            ctx.fillText(`R${i}`, x, y);
        }
        
        // Draw origin label
        ctx.textAlign = 'right';
        ctx.fillText('R1C1', bounds.left - 10, bounds.top - 10);
    }
    
    /**
     * Draw grid numbers
     */
    drawGridNumbers(ctx, bounds, gridDims, cellWidth, cellHeight) {
        const overlayConfig = this.config.getConfig().overlay;
        
        ctx.fillStyle = overlayConfig.numberColor;
        ctx.font = `${overlayConfig.numberSize} monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Draw numbers intelligently based on grid size
        const totalCells = gridDims.columns * gridDims.rows;
        const shouldShowNumbers = totalCells <= 2000; // Show numbers for grids with <= 2000 cells
        
        if (shouldShowNumbers) {
            // Calculate step size based on grid density
            const stepCol = Math.max(1, Math.floor(gridDims.columns / 16));
            const stepRow = Math.max(1, Math.floor(gridDims.rows / 10));
            
            for (let row = 1; row <= gridDims.rows; row += stepRow) {
                for (let col = 1; col <= gridDims.columns; col += stepCol) {
                    const x = bounds.left + (col - 0.5) * cellWidth;
                    const y = bounds.top + (row - 0.5) * cellHeight;
                    
                    // Adjust font size based on cell size
                    const fontSize = Math.max(8, Math.min(12, cellWidth * 0.15));
                    ctx.font = `${fontSize}px monospace`;
                    
                    ctx.fillText(`R${row}C${col}`, x, y);
                }
            }
        } else {
            // For very high precision grids, show only major grid lines
            const majorStepCol = Math.max(1, Math.floor(gridDims.columns / 8));
            const majorStepRow = Math.max(1, Math.floor(gridDims.rows / 5));
            
            for (let row = 1; row <= gridDims.rows; row += majorStepRow) {
                for (let col = 1; col <= gridDims.columns; col += majorStepCol) {
                    const x = bounds.left + (col - 0.5) * cellWidth;
                    const y = bounds.top + (row - 0.5) * cellHeight;
                    
                    const fontSize = Math.max(10, Math.min(14, cellWidth * 0.2));
                    ctx.font = `${fontSize}px monospace`;
                    
                    ctx.fillText(`R${row}C${col}`, x, y);
                }
            }
        }
    }
    
    /**
     * Draw highlighted cell
     */
    drawHighlightedCell(ctx, bounds, cellWidth, cellHeight) {
        const cell = this.highlightedCell;
        
        const x = bounds.left + (cell.col - 1) * cellWidth;
        const y = bounds.top + (cell.row - 1) * cellHeight;
        
        // Highlight background
        ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
        ctx.fillRect(x, y, cellWidth, cellHeight);
        
        // Highlight border
        ctx.strokeStyle = 'rgba(255, 255, 0, 0.8)';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, cellWidth, cellHeight);
        
        // Draw coordinate
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.font = '14px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(cell.coordinate, x + cellWidth / 2, y + cellHeight / 2);
    }
    
    /**
     * Update info panel
     */
    updateInfoPanel() {
        if (!this.showInfo) return;
        
        const gridInfo = this.calculations.getGridInfo();
        const config = this.config.getConfig();
        
        const info = [
            `<strong>Grid System Info</strong>`,
            `Precision: ${config.precision} (${gridInfo.gridDimensions.columns}×${gridInfo.gridDimensions.rows})`,
            `Breakpoint: ${gridInfo.breakpoint}`,
            `Cell Size: ${Math.round(gridInfo.cellDimensions.width)}×${Math.round(gridInfo.cellDimensions.height)}px`,
            `Container: ${Math.round(gridInfo.containerBounds.width)}×${Math.round(gridInfo.containerBounds.height)}px`,
            ``,
            `<strong>Keyboard Shortcuts</strong>`,
            `Ctrl+G: Toggle Grid`,
            `Ctrl+Shift+G: Toggle Info`,
            ``
        ];
        
        if (this.highlightedCell) {
            info.push(`<strong>Highlighted Cell</strong>`);
            info.push(`Coordinate: ${this.highlightedCell.coordinate}`);
            info.push(`Position: ${this.highlightedCell.row}, ${this.highlightedCell.col}`);
        }
        
        this.infoPanel.innerHTML = info.join('<br>');
    }
    
    /**
     * Highlight cell at mouse position
     */
    highlightCellAtPosition(mouseX, mouseY) {
        const gridCoord = this.calculations.pixelsToCoordinates(mouseX, mouseY);
        
        // Only update if cell changed
        if (!this.highlightedCell || 
            this.highlightedCell.row !== gridCoord.row || 
            this.highlightedCell.col !== gridCoord.col) {
            
            this.highlightedCell = gridCoord;
            this.updateCanvas();
            this.updateInfoPanel();
        }
    }
    
    /**
     * Clear highlighted cell
     */
    clearHighlight() {
        this.highlightedCell = null;
        if (this.isVisible) {
            this.updateCanvas();
            this.updateInfoPanel();
        }
    }
    
    /**
     * Set overlay configuration
     */
    setConfig(newConfig) {
        const overlayConfig = this.config.getConfig().overlay;
        Object.assign(overlayConfig, newConfig);
        
        if (this.isVisible) {
            this.updateOverlay();
        }
    }
    
    /**
     * Get overlay status
     */
    getStatus() {
        return {
            visible: this.isVisible,
            showNumbers: this.showNumbers,
            showInfo: this.showInfo,
            highlightedCell: this.highlightedCell
        };
    }
    
    /**
     * Destroy overlay
     */
    destroy() {
        if (this.overlayContainer && this.overlayContainer.parentNode) {
            this.overlayContainer.parentNode.removeChild(this.overlayContainer);
        }
        
        // Remove event listeners
        // Note: In a real implementation, you'd want to store references to bound functions
        // and remove them properly to prevent memory leaks
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GridOverlay;
} else {
    window.GridOverlay = GridOverlay;
} 