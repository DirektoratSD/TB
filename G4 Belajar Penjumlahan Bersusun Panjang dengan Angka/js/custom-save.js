/**
 * CUSTOM SAVE SYSTEM FOR REACT ELEMENTS
 * ====================================
 * Extends the grid editor to save React element positions
 */

window.customSaveSystem = {
    
    /**
     * Save current layout including React elements
     */
    saveLayout() {
        const layout = {
            timestamp: new Date().toISOString(),
            precision: 8, // Current precision
            reactElements: {},
            gridElements: []
        };
        
        // Save React element positions
        const characterContainer = document.querySelector('.character-container');
        const dialogContainer = document.querySelector('.dialog-container');
        
        if (characterContainer) {
            layout.reactElements.characterArea = this.getElementCoordinates(characterContainer);
        }
        
        if (dialogContainer) {
            layout.reactElements.dialogBubble = this.getElementCoordinates(dialogContainer);
        }
        
        // Save GridSystem elements (if any)
        if (window.GridSystem && window.GridSystem.getInstance().elements) {
            window.GridSystem.getInstance().elements.forEach((data, id) => {
                layout.gridElements.push({
                    id: id,
                    coordinates: data.coordinates,
                    type: data.element.tagName.toLowerCase(),
                    content: data.element.textContent,
                    styles: data.options.styles || {}
                });
            });
        }
        
        // Create download
        const json = JSON.stringify(layout, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `math-app-layout-${Date.now()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        
        console.log('✅ Layout saved!', layout);
        return layout;
    },
    
    /**
     * Generate code for current positions
     */
    generateCode() {
        let code = '// Generated Layout Code\n';
        code += '// Copy this to js/gridpositions.js\n\n';
        
        const characterContainer = document.querySelector('.character-container');
        const dialogContainer = document.querySelector('.dialog-container');
        
        if (characterContainer) {
            const coords = this.getElementCoordinates(characterContainer);
            code += `characterArea: [${coords.join(', ')}], // Character position\n`;
        }
        
        if (dialogContainer) {
            const coords = this.getElementCoordinates(dialogContainer);
            code += `dialogBubble: [${coords.join(', ')}], // Dialog position\n`;
        }
        
        // Copy to clipboard
        navigator.clipboard.writeText(code).then(() => {
            console.log('📋 Code copied to clipboard!');
        });
        
        // Also download as file
        const blob = new Blob([code], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'grid-coordinates.js';
        a.click();
        
        URL.revokeObjectURL(url);
        
        console.log('💾 Code downloaded and copied to clipboard!');
        console.log(code);
        
        return code;
    },
    
    /**
     * Get coordinates from element position
     */
    getElementCoordinates(element) {
        if (!element) return null;
        
        const rect = element.getBoundingClientRect();
        const container = document.querySelector('.main-container').getBoundingClientRect();
        
        // Calculate relative position
        const leftPercent = ((rect.left - container.left) / container.width) * 100;
        const topPercent = ((rect.top - container.top) / container.height) * 100;
        const widthPercent = (rect.width / container.width) * 100;
        const heightPercent = (rect.height / container.height) * 100;
        
        // Convert to grid coordinates (128x72 grid)
        const gridCols = 128;
        const gridRows = 72;
        
        const topRow = Math.round((topPercent / 100) * gridRows) + 1;
        const topCol = Math.round((leftPercent / 100) * gridCols) + 1;
        const bottomRow = Math.round(((topPercent + heightPercent) / 100) * gridRows);
        const bottomCol = Math.round(((leftPercent + widthPercent) / 100) * gridCols);
        
        // Ensure coordinates are within bounds
        const coords = [
            Math.max(1, Math.min(topRow, gridRows)),
            Math.max(1, Math.min(topCol, gridCols)),
            Math.max(1, Math.min(bottomRow, gridRows)),
            Math.max(1, Math.min(bottomCol, gridCols))
        ];
        
        return coords;
    },
    
    /**
     * Apply saved layout
     */
    applyLayout(layoutData) {
        if (layoutData.reactElements) {
            // Update gridpositions.js coordinates
            if (layoutData.reactElements.characterArea) {
                gridPositions.screenElements.characterArea = layoutData.reactElements.characterArea;
            }
            
            if (layoutData.reactElements.dialogBubble) {
                gridPositions.screenElements.dialogBubble = layoutData.reactElements.dialogBubble;
            }
            
            // Clear cache and reload
            gridPositions.clearCache();
            location.reload();
        }
    },
    
    /**
     * Auto-save current positions to localStorage
     */
    autoSave() {
        const layout = {
            characterArea: this.getElementCoordinates(document.querySelector('.character-container')),
            dialogBubble: this.getElementCoordinates(document.querySelector('.dialog-container')),
            timestamp: Date.now()
        };
        
        localStorage.setItem('mathAppLayout', JSON.stringify(layout));
        console.log('🔄 Auto-saved current positions');
    },
    
    /**
     * Load auto-saved positions
     */
    loadAutoSaved() {
        const saved = localStorage.getItem('mathAppLayout');
        if (saved) {
            const layout = JSON.parse(saved);
            console.log('📥 Found auto-saved layout:', layout);
            return layout;
        }
        return null;
    },
    
    /**
     * Reset to default positions
     */
    resetToDefaults() {
        if (confirm('Reset to default positions?')) {
            gridPositions.screenElements.characterArea = [11, 3, 67, 32];
            gridPositions.screenElements.dialogBubble = [21, 48, 48, 110];
            gridPositions.clearCache();
            localStorage.removeItem('mathAppLayout');
            location.reload();
        }
    }
};

// Add save buttons to the grid editor when it's available
document.addEventListener('DOMContentLoaded', function() {
    const addSaveButtons = () => {
        if (window.gridEditor && window.gridEditor.toolbox) {
            const saveSection = document.createElement('div');
            saveSection.innerHTML = `
                <h4 style="color: #ffd700; margin: 20px 0 10px 0;">💾 Save Layout</h4>
                <button id="save-layout-btn" style="width: 100%; margin: 5px 0; padding: 8px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    💾 Save Layout
                </button>
                <button id="export-code-btn" style="width: 100%; margin: 5px 0; padding: 8px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    📋 Copy Code
                </button>
                <button id="reset-layout-btn" style="width: 100%; margin: 5px 0; padding: 8px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    🔄 Reset
                </button>
            `;
            
            window.gridEditor.toolbox.appendChild(saveSection);
            
            // Bind events
            document.getElementById('save-layout-btn').addEventListener('click', () => {
                customSaveSystem.saveLayout();
                alert('✅ Layout saved to downloads!');
            });
            
            document.getElementById('export-code-btn').addEventListener('click', () => {
                customSaveSystem.generateCode();
                alert('📋 Code copied to clipboard and downloaded!');
            });
            
            document.getElementById('reset-layout-btn').addEventListener('click', () => {
                customSaveSystem.resetToDefaults();
            });
            
            console.log('💾 Save system ready!');
        }
    };
    
    // Wait for grid editor
    const checkEditor = setInterval(() => {
        if (window.gridEditor) {
            setTimeout(addSaveButtons, 500);
            clearInterval(checkEditor);
        }
    }, 100);
});

// Auto-save positions every 10 seconds when editor is active
setInterval(() => {
    if (window.gridEditor && window.gridEditor.isEnabled) {
        customSaveSystem.autoSave();
    }
}, 10000);

console.log('🎯 Custom save system loaded!'); 