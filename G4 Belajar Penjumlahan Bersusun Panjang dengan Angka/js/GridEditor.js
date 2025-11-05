/**
 * VISUAL GRID EDITOR
 * ==================
 * Interactive visual editor for the grid system.
 * Allows drag-and-drop positioning, resizing, and real-time editing.
 */

class GridEditor {
    constructor(gridSystem) {
        this.gridSystem = gridSystem;
        this.config = gridSystem.config;
        this.calculations = gridSystem.calculations;
        this.overlay = gridSystem.overlay;
        
        // Editor state
        this.isEnabled = false;
        this.selectedElement = null;
        this.dragState = null;
        this.resizeState = null;
        
        // Editor elements
        this.editorPanel = null;
        this.toolbox = null;
        this.propertyPanel = null;
        this.snapGuides = [];
        
        // Editor settings
        this.settings = {
            snapToGrid: true,
            showSnapGuides: true,
            showElementInfo: true,
            autoSave: true,
            snapTolerance: 5, // pixels
            minElementSize: 2, // grid cells
            maxElementSize: 20 // grid cells
        };
        
        // Initialize editor
        this.initialize();
    }
    
    /**
     * Initialize the editor
     */
    initialize() {
        this.createEditorUI();
        this.bindEvents();
        console.log('Grid Editor initialized');
    }
    
    /**
     * Create editor UI
     */
    createEditorUI() {
        // Create main editor container
        this.editorPanel = document.createElement('div');
        this.editorPanel.id = 'grid-editor-panel';
        this.editorPanel.style.cssText = `
            position: fixed;
            top: 0;
            right: 0;
            width: 300px;
            height: 100vh;
            background: rgba(30, 30, 30, 0.95);
            backdrop-filter: blur(10px);
            color: white;
            font-family: Arial, sans-serif;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            overflow-y: auto;
            display: none;
        `;
        
        // Create toolbox
        this.createToolbox();
        
        // Create property panel
        this.createPropertyPanel();
        
        // Add to document
        document.body.appendChild(this.editorPanel);
        
        // Create editor toggle button
        this.createEditorToggle();
    }
    
    /**
     * Create toolbox
     */
    createToolbox() {
        const toolbox = document.createElement('div');
        toolbox.style.cssText = `
            padding: 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        `;
        
        toolbox.innerHTML = `
            <h3 style="margin: 0 0 15px 0; color: #ffd700;">🎯 Grid Editor</h3>
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <button id="add-text-btn" style="padding: 10px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    📝 Add Text Box
                </button>
                <button id="add-button-btn" style="padding: 10px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    🔘 Add Button
                </button>
                <button id="add-image-btn" style="padding: 10px; background: #17a2b8; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    🖼️ Add Image
                </button>
                <button id="clear-all-btn" style="padding: 10px; background: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    🗑️ Clear All
                </button>
            </div>
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.2);">
                <h4 style="margin: 0 0 10px 0; color: #ffd700;">📄 Page Manager</h4>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <div id="current-page-info" style="background: rgba(255,255,255,0.1); padding: 8px; border-radius: 4px; font-size: 12px;">
                        Current Page: Main Page
                    </div>
                    <div style="display: flex; gap: 4px;">
                        <button id="prev-page-btn" style="padding: 6px 8px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px; flex: 1;">
                            ← Prev
                        </button>
                        <button id="next-page-btn" style="padding: 6px 8px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px; flex: 1;">
                            Next →
                        </button>
                    </div>
                    <button id="new-page-btn" style="padding: 6px 8px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">
                        ➕ New Page
                    </button>
                </div>
            </div>
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.2);">
                <h4 style="margin: 0 0 10px 0; color: #ffd700;">💾 Save Layout</h4>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <button id="save-layout-btn" style="padding: 8px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
                        📥 Save Layout
                    </button>
                    <button id="copy-code-btn" style="padding: 8px; background: #17a2b8; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
                        📋 Copy Code
                    </button>
                    <button id="reset-layout-btn" style="padding: 8px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
                        🔄 Reset
                    </button>
                </div>
            </div>
            <div style="margin-top: 20px;">
                <h4 style="margin: 0 0 10px 0; color: #ffd700;">Settings</h4>
                <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                    <input type="checkbox" id="snap-to-grid" ${this.settings.snapToGrid ? 'checked' : ''}>
                    <span>Snap to Grid</span>
                </label>
                <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                    <input type="checkbox" id="show-snap-guides" ${this.settings.showSnapGuides ? 'checked' : ''}>
                    <span>Show Snap Guides</span>
                </label>
                <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                    <input type="checkbox" id="show-element-info" ${this.settings.showElementInfo ? 'checked' : ''}>
                    <span>Show Element Info</span>
                </label>
            </div>
        `;
        
        this.editorPanel.appendChild(toolbox);
        this.toolbox = toolbox;
    }
    
    /**
     * Create property panel
     */
    createPropertyPanel() {
        const propertyPanel = document.createElement('div');
        propertyPanel.id = 'property-panel';
        propertyPanel.style.cssText = `
            padding: 20px;
            display: none;
        `;
        
        propertyPanel.innerHTML = `
            <h4 style="margin: 0 0 15px 0; color: #ffd700;">Properties</h4>
            <div id="property-content">
                <p style="color: #ccc; text-align: center; margin: 20px 0;">
                    Select an element to edit properties
                </p>
            </div>
        `;
        
        this.editorPanel.appendChild(propertyPanel);
        this.propertyPanel = propertyPanel;
    }
    
    /**
     * Create editor toggle button
     */
    createEditorToggle() {
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'grid-editor-toggle';
        toggleBtn.innerHTML = '🎨';
        toggleBtn.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 20px;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
        `;
        
        toggleBtn.addEventListener('click', () => this.toggleEditor());
        document.body.appendChild(toggleBtn);
    }
    
    /**
     * Bind events
     */
    bindEvents() {
        // Toolbox events
        document.getElementById('add-text-btn').addEventListener('click', () => this.addTextBox());
        document.getElementById('add-button-btn').addEventListener('click', () => this.addButton());
        document.getElementById('add-image-btn').addEventListener('click', () => this.addImage());
        document.getElementById('clear-all-btn').addEventListener('click', () => this.clearAll());
        
        // Save system events
        document.getElementById('save-layout-btn').addEventListener('click', () => this.saveLayout());
        document.getElementById('copy-code-btn').addEventListener('click', () => this.copyCode());
        document.getElementById('reset-layout-btn').addEventListener('click', () => this.resetLayout());
        
        // Page management events
        document.getElementById('prev-page-btn').addEventListener('click', () => {
            if (window.pageManager) window.pageManager.prevPage();
        });
        document.getElementById('next-page-btn').addEventListener('click', () => {
            if (window.pageManager) window.pageManager.nextPage();
        });
        document.getElementById('new-page-btn').addEventListener('click', () => {
            if (window.pageManager) window.pageManager.createNewPage();
        });
        
        // Settings events
        document.getElementById('snap-to-grid').addEventListener('change', (e) => {
            this.settings.snapToGrid = e.target.checked;
        });
        
        document.getElementById('show-snap-guides').addEventListener('change', (e) => {
            this.settings.showSnapGuides = e.target.checked;
        });
        
        document.getElementById('show-element-info').addEventListener('change', (e) => {
            this.settings.showElementInfo = e.target.checked;
        });
        
        // Global events
        document.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        document.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        
        // Grid resize events
        window.addEventListener('gridResize', () => this.updateAllElements());
    }
    
    /**
     * Toggle editor
     */
    toggleEditor() {
        this.isEnabled = !this.isEnabled;
        
        if (this.isEnabled) {
            this.showEditor();
        } else {
            this.hideEditor();
        }
    }
    
    /**
     * Show editor
     */
    showEditor() {
        this.isEnabled = true;
        this.editorPanel.style.display = 'block';
        this.editorPanel.style.transform = 'translateX(0)';
        this.overlay.show();
        this.makeElementsEditable();
        this.updatePageInfo();
        console.log('Grid Editor enabled');
    }
    
    /**
     * Hide editor
     */
    hideEditor() {
        this.isEnabled = false;
        this.editorPanel.style.transform = 'translateX(100%)';
        setTimeout(() => {
            this.editorPanel.style.display = 'none';
        }, 300);
        this.deselectElement();
        this.makeElementsNonEditable();
        console.log('Grid Editor disabled');
    }
    
    /**
     * Make elements editable
     */
    makeElementsEditable() {
        this.gridSystem.elements.forEach((data, id) => {
            const element = data.element;
            if (element) {
                element.classList.add('grid-editable');
                element.style.cursor = 'move';
                element.style.border = '2px dashed rgba(0, 150, 255, 0.5)';
                element.style.position = 'relative';
                
                // Add resize handles
                this.addResizeHandles(element);
                
                // Add info overlay
                if (this.settings.showElementInfo) {
                    this.addElementInfo(element, data);
                }
            }
        });
    }
    
    /**
     * Make elements non-editable
     */
    makeElementsNonEditable() {
        this.gridSystem.elements.forEach((data, id) => {
            const element = data.element;
            if (element) {
                element.classList.remove('grid-editable');
                element.style.cursor = 'default';
                element.style.border = 'none';
                
                // Remove resize handles
                this.removeResizeHandles(element);
                
                // Remove info overlay
                this.removeElementInfo(element);
            }
        });
    }
    
    /**
     * Add resize handles to element
     */
    addResizeHandles(element) {
        const handles = ['nw', 'ne', 'sw', 'se'];
        
        handles.forEach(handle => {
            const handleElement = document.createElement('div');
            handleElement.className = `resize-handle resize-${handle}`;
            handleElement.style.cssText = `
                position: absolute;
                width: 10px;
                height: 10px;
                background: #007bff;
                border: 2px solid white;
                border-radius: 50%;
                cursor: ${handle}-resize;
                z-index: 1000;
                ${this.getHandlePosition(handle)}
            `;
            
            handleElement.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                this.startResize(element, handle, e);
            });
            
            element.appendChild(handleElement);
        });
    }
    
    /**
     * Remove resize handles
     */
    removeResizeHandles(element) {
        const handles = element.querySelectorAll('.resize-handle');
        handles.forEach(handle => handle.remove());
    }
    
    /**
     * Get handle position CSS
     */
    getHandlePosition(handle) {
        switch (handle) {
            case 'nw': return 'top: -5px; left: -5px;';
            case 'ne': return 'top: -5px; right: -5px;';
            case 'sw': return 'bottom: -5px; left: -5px;';
            case 'se': return 'bottom: -5px; right: -5px;';
            default: return '';
        }
    }
    
    /**
     * Add element info overlay
     */
    addElementInfo(element, data) {
        const info = document.createElement('div');
        info.className = 'element-info';
        info.style.cssText = `
            position: absolute;
            top: -25px;
            left: 0;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 2px 6px;
            font-size: 10px;
            border-radius: 3px;
            white-space: nowrap;
            z-index: 1001;
            pointer-events: none;
        `;
        
        info.textContent = data.coordinates;
        element.appendChild(info);
    }
    
    /**
     * Remove element info overlay
     */
    removeElementInfo(element) {
        const info = element.querySelector('.element-info');
        if (info) info.remove();
    }
    
    /**
     * Handle mouse down
     */
    handleMouseDown(e) {
        if (!this.isEnabled) return;
        
        const element = e.target.closest('.grid-editable');
        if (element && !e.target.classList.contains('resize-handle')) {
            this.startDrag(element, e);
        } else if (!element) {
            this.deselectElement();
        }
    }
    
    /**
     * Handle mouse move
     */
    handleMouseMove(e) {
        if (!this.isEnabled) return;
        
        if (this.dragState) {
            this.updateDrag(e);
        } else if (this.resizeState) {
            this.updateResize(e);
        }
    }
    
    /**
     * Handle mouse up
     */
    handleMouseUp(e) {
        if (!this.isEnabled) return;
        
        if (this.dragState) {
            this.endDrag(e);
        } else if (this.resizeState) {
            this.endResize(e);
        }
    }
    
    /**
     * Handle key down
     */
    handleKeyDown(e) {
        if (!this.isEnabled) return;
        
        if (e.key === 'Delete' && this.selectedElement) {
            this.deleteElement(this.selectedElement);
        } else if (e.key === 'Escape') {
            this.deselectElement();
        } else if (e.key === 'e' && e.ctrlKey) {
            e.preventDefault();
            this.toggleEditor();
        }
    }
    
    /**
     * Start dragging element
     */
    startDrag(element, e) {
        this.selectElement(element);
        
        const rect = element.getBoundingClientRect();
        this.dragState = {
            element: element,
            startX: e.clientX,
            startY: e.clientY,
            offsetX: e.clientX - rect.left,
            offsetY: e.clientY - rect.top,
            originalCoords: this.getElementCoordinates(element)
        };
        
        element.style.zIndex = '1000';
        element.style.opacity = '0.8';
        
        if (this.settings.showSnapGuides) {
            this.showSnapGuides();
        }
    }
    
    /**
     * Update drag
     */
    updateDrag(e) {
        const drag = this.dragState;
        const newX = e.clientX - drag.offsetX;
        const newY = e.clientY - drag.offsetY;
        
        if (this.settings.snapToGrid) {
            const gridCoords = this.calculations.pixelsToCoordinates(newX, newY);
            const snapCoords = this.calculations.coordinatesToPixels(
                this.calculations.parseCoordinates(gridCoords.coordinate)
            );
            
            drag.element.style.left = `${snapCoords.left}px`;
            drag.element.style.top = `${snapCoords.top}px`;
            
            // Update info overlay
            const info = drag.element.querySelector('.element-info');
            if (info) {
                info.textContent = gridCoords.coordinate;
            }
        } else {
            drag.element.style.left = `${newX}px`;
            drag.element.style.top = `${newY}px`;
        }
    }
    
    /**
     * End drag
     */
    endDrag(e) {
        const drag = this.dragState;
        
        // Update element coordinates
        const rect = drag.element.getBoundingClientRect();
        const newCoords = this.calculations.pixelsToCoordinates(rect.left, rect.top);
        
        // Update in grid system
        const elementId = drag.element.id;
        const elementData = this.gridSystem.elements.get(elementId);
        if (elementData) {
            elementData.coordinates = newCoords.coordinate;
            elementData.coords = this.calculations.parseCoordinates(newCoords.coordinate);
        }
        
        // Reset styles
        drag.element.style.zIndex = '';
        drag.element.style.opacity = '';
        
        this.hideSnapGuides();
        this.dragState = null;
        
        console.log(`Element moved to ${newCoords.coordinate}`);
    }
    
    /**
     * Start resizing element
     */
    startResize(element, handle, e) {
        this.selectElement(element);
        
        const rect = element.getBoundingClientRect();
        this.resizeState = {
            element: element,
            handle: handle,
            startX: e.clientX,
            startY: e.clientY,
            originalRect: rect,
            originalCoords: this.getElementCoordinates(element)
        };
        
        element.style.zIndex = '1000';
        element.style.opacity = '0.8';
    }
    
    /**
     * Update resize
     */
    updateResize(e) {
        const resize = this.resizeState;
        const deltaX = e.clientX - resize.startX;
        const deltaY = e.clientY - resize.startY;
        
        let newWidth = resize.originalRect.width;
        let newHeight = resize.originalRect.height;
        let newLeft = resize.originalRect.left;
        let newTop = resize.originalRect.top;
        
        // Calculate new dimensions based on handle
        switch (resize.handle) {
            case 'nw':
                newWidth -= deltaX;
                newHeight -= deltaY;
                newLeft += deltaX;
                newTop += deltaY;
                break;
            case 'ne':
                newWidth += deltaX;
                newHeight -= deltaY;
                newTop += deltaY;
                break;
            case 'sw':
                newWidth -= deltaX;
                newHeight += deltaY;
                newLeft += deltaX;
                break;
            case 'se':
                newWidth += deltaX;
                newHeight += deltaY;
                break;
        }
        
        // Apply constraints
        const minSize = this.settings.minElementSize * this.calculations.getCellDimensions().width;
        const maxSize = this.settings.maxElementSize * this.calculations.getCellDimensions().width;
        
        newWidth = Math.max(minSize, Math.min(maxSize, newWidth));
        newHeight = Math.max(minSize, Math.min(maxSize, newHeight));
        
        // Apply new dimensions
        resize.element.style.width = `${newWidth}px`;
        resize.element.style.height = `${newHeight}px`;
        resize.element.style.left = `${newLeft}px`;
        resize.element.style.top = `${newTop}px`;
    }
    
    /**
     * End resize
     */
    endResize(e) {
        const resize = this.resizeState;
        
        // Update element coordinates
        const rect = resize.element.getBoundingClientRect();
        const startCoords = this.calculations.pixelsToCoordinates(rect.left, rect.top);
        const endCoords = this.calculations.pixelsToCoordinates(rect.right, rect.bottom);
        
        const newCoordinates = `${startCoords.coordinate}-${endCoords.coordinate}`;
        
        // Update in grid system
        const elementId = resize.element.id;
        const elementData = this.gridSystem.elements.get(elementId);
        if (elementData) {
            elementData.coordinates = newCoordinates;
            elementData.coords = this.calculations.parseCoordinates(newCoordinates);
        }
        
        // Reset styles
        resize.element.style.zIndex = '';
        resize.element.style.opacity = '';
        
        this.resizeState = null;
        
        console.log(`Element resized to ${newCoordinates}`);
    }
    
    /**
     * Select element
     */
    selectElement(element) {
        this.deselectElement();
        
        this.selectedElement = element;
        element.style.borderColor = '#007bff';
        element.style.borderStyle = 'solid';
        
        this.updatePropertyPanel(element);
    }
    
    /**
     * Deselect element
     */
    deselectElement() {
        if (this.selectedElement) {
            this.selectedElement.style.borderColor = 'rgba(0, 150, 255, 0.5)';
            this.selectedElement.style.borderStyle = 'dashed';
            this.selectedElement = null;
        }
        
        this.propertyPanel.style.display = 'none';
    }
    
    /**
     * Update property panel
     */
    updatePropertyPanel(element) {
        const elementData = this.getElementData(element);
        const content = this.propertyPanel.querySelector('#property-content');
        
        content.innerHTML = `
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-size: 12px; color: #ccc;">Coordinates:</label>
                <input type="text" id="prop-coordinates" value="${elementData.coordinates}" 
                       style="width: 100%; padding: 5px; border: 1px solid #555; background: #444; color: white; border-radius: 3px;">
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-size: 12px; color: #ccc;">Text Content:</label>
                <textarea id="prop-content" rows="3" 
                          style="width: 100%; padding: 5px; border: 1px solid #555; background: #444; color: white; border-radius: 3px; resize: vertical;">${element.textContent || ''}</textarea>
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-size: 12px; color: #ccc;">Font Size (gc):</label>
                <input type="range" id="prop-font-size" min="20" max="200" value="85" 
                       style="width: 100%; margin-bottom: 5px;">
                <span id="font-size-value" style="font-size: 11px; color: #ccc;">85gc</span>
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-size: 12px; color: #ccc;">Background Color:</label>
                <input type="color" id="prop-bg-color" value="#ffffff" 
                       style="width: 100%; height: 30px; border: none; border-radius: 3px;">
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-size: 12px; color: #ccc;">Border Radius (gc):</label>
                <input type="range" id="prop-border-radius" min="0" max="50" value="25" 
                       style="width: 100%; margin-bottom: 5px;">
                <span id="border-radius-value" style="font-size: 11px; color: #ccc;">25gc</span>
            </div>
            
            <button id="apply-properties" style="width: 100%; padding: 8px; background: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer;">
                Apply Changes
            </button>
            
            <button id="delete-element" style="width: 100%; padding: 8px; background: #dc3545; color: white; border: none; border-radius: 3px; cursor: pointer; margin-top: 10px;">
                Delete Element
            </button>
        `;
        
        this.propertyPanel.style.display = 'block';
        this.bindPropertyEvents();
    }
    
    /**
     * Bind property panel events
     */
    bindPropertyEvents() {
        const fontSizeSlider = document.getElementById('prop-font-size');
        const fontSizeValue = document.getElementById('font-size-value');
        const borderRadiusSlider = document.getElementById('prop-border-radius');
        const borderRadiusValue = document.getElementById('border-radius-value');
        
        fontSizeSlider.addEventListener('input', (e) => {
            fontSizeValue.textContent = `${e.target.value}gc`;
        });
        
        borderRadiusSlider.addEventListener('input', (e) => {
            borderRadiusValue.textContent = `${e.target.value}gc`;
        });
        
        document.getElementById('apply-properties').addEventListener('click', () => {
            this.applyProperties();
        });
        
        document.getElementById('delete-element').addEventListener('click', () => {
            this.deleteElement(this.selectedElement);
        });
    }
    
    /**
     * Apply properties
     */
    applyProperties() {
        if (!this.selectedElement) return;
        
        const coordinates = document.getElementById('prop-coordinates').value;
        const content = document.getElementById('prop-content').value;
        const fontSize = document.getElementById('prop-font-size').value;
        const bgColor = document.getElementById('prop-bg-color').value;
        const borderRadius = document.getElementById('prop-border-radius').value;
        
        // Update element
        this.selectedElement.textContent = content;
        this.selectedElement.style.fontSize = `${fontSize}gc`;
        this.selectedElement.style.backgroundColor = bgColor;
        this.selectedElement.style.borderRadius = `${borderRadius}gc`;
        
        // Update coordinates if changed
        const elementData = this.getElementData(this.selectedElement);
        if (elementData && elementData.coordinates !== coordinates) {
            this.gridSystem.moveElement(this.selectedElement.id, coordinates);
        }
        
        console.log('Properties applied');
    }
    
    /**
     * Add text box
     */
    addTextBox() {
        const coords = this.getRandomCoordinates();
        const textBox = this.gridSystem.createTextBox(coords, 'New Text Box', {
            styles: {
                fontSize: '85gc',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '25gc',
                padding: '30gc',
                textAlign: 'center'
            }
        });
        
        this.updateAllElements();
        this.selectElement(textBox);
        
        // Add to current page if PageManager is available
        if (window.pageManager) {
            window.pageManager.addElementToPage(textBox.id);
        }
    }
    
    /**
     * Add button
     */
    addButton() {
        const coords = this.getRandomCoordinates();
        const button = this.gridSystem.createButton(coords, 'New Button', 
            () => alert('Button clicked!'), {
            styles: {
                fontSize: '75gc',
                backgroundColor: '#007bff',
                borderRadius: '20gc'
            }
        });
        
        this.updateAllElements();
        this.selectElement(button);
        
        // Add to current page if PageManager is available
        if (window.pageManager) {
            window.pageManager.addElementToPage(button.id);
        }
    }
    
    /**
     * Add image
     */
    addImage() {
        const coords = this.getRandomCoordinates();
        const image = this.gridSystem.createImage(coords, 'assets/background.png', {
            alt: 'New Image',
            styles: {
                borderRadius: '15gc'
            }
        });
        
        this.updateAllElements();
        this.selectElement(image);
        
        // Add to current page if PageManager is available
        if (window.pageManager) {
            window.pageManager.addElementToPage(image.id);
        }
    }
    
    /**
     * Get random coordinates
     */
    getRandomCoordinates() {
        const gridDims = this.config.getGridDimensions();
        const startRow = Math.floor(Math.random() * (gridDims.rows - 5)) + 1;
        const startCol = Math.floor(Math.random() * (gridDims.columns - 10)) + 1;
        const endRow = Math.min(startRow + 3, gridDims.rows);
        const endCol = Math.min(startCol + 8, gridDims.columns);
        
        return `R${startRow}C${startCol}-R${endRow}C${endCol}`;
    }
    
    /**
     * Clear all elements
     */
    clearAll() {
        if (confirm('Are you sure you want to clear all elements?')) {
            this.gridSystem.elements.forEach((data, id) => {
                this.gridSystem.removeElement(id);
            });
            this.deselectElement();
            console.log('All elements cleared');
        }
    }
    
    /**
     * Delete element
     */
    deleteElement(element) {
        if (element && confirm('Are you sure you want to delete this element?')) {
            this.gridSystem.removeElement(element.id);
            this.deselectElement();
            console.log('Element deleted');
        }
    }
    
    /**
     * Get element coordinates
     */
    getElementCoordinates(element) {
        const elementData = this.getElementData(element);
        return elementData ? elementData.coordinates : null;
    }
    
    /**
     * Get element data
     */
    getElementData(element) {
        return this.gridSystem.elements.get(element.id);
    }
    
    /**
     * Update all elements
     */
    updateAllElements() {
        if (this.isEnabled) {
            this.makeElementsNonEditable();
            setTimeout(() => {
                this.makeElementsEditable();
            }, 100);
        }
    }
    
    /**
     * Show snap guides
     */
    showSnapGuides() {
        // Implementation for visual snap guides
        console.log('Showing snap guides');
    }
    
    /**
     * Hide snap guides
     */
    hideSnapGuides() {
        // Implementation for hiding snap guides
        console.log('Hiding snap guides');
    }
    
    /**
     * Save layout
     */
    saveLayout() {
        const layout = {
            precision: this.config.getConfig().precision,
            elements: []
        };
        
        this.gridSystem.elements.forEach((data, id) => {
            layout.elements.push({
                id: id,
                coordinates: data.coordinates,
                type: data.element.tagName.toLowerCase(),
                content: data.element.textContent,
                styles: data.options.styles || {}
            });
        });
        
        const json = JSON.stringify(layout, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'grid-layout.json';
        a.click();
        
        URL.revokeObjectURL(url);
        console.log('Layout saved');
    }
    
    /**
     * Load layout
     */
    loadLayout(layoutData) {
        this.clearAll();
        
        if (layoutData.precision) {
            this.gridSystem.setPrecision(layoutData.precision);
        }
        
        layoutData.elements.forEach(elementData => {
            let element;
            
            switch (elementData.type) {
                case 'div':
                    element = this.gridSystem.createTextBox(
                        elementData.coordinates,
                        elementData.content,
                        { styles: elementData.styles }
                    );
                    break;
                case 'button':
                    element = this.gridSystem.createButton(
                        elementData.coordinates,
                        elementData.content,
                        () => alert('Button clicked!'),
                        { styles: elementData.styles }
                    );
                    break;
                default:
                    element = this.gridSystem.createElement(
                        elementData.coordinates,
                        elementData.type,
                        { content: elementData.content, styles: elementData.styles }
                    );
            }
        });
        
        this.updateAllElements();
        console.log('Layout loaded');
    }
    
    /**
     * Export layout as code
     */
    exportCode() {
        let code = '// Generated Grid Layout Code\n\n';
        
        this.gridSystem.elements.forEach((data, id) => {
            const element = data.element;
            const tagName = element.tagName.toLowerCase();
            const content = element.textContent;
            const styles = data.options.styles || {};
            
            if (tagName === 'div') {
                code += `GridSystem.createTextBox('${data.coordinates}', '${content}', {\n`;
                code += `    styles: ${JSON.stringify(styles, null, 8)}\n`;
                code += `});\n\n`;
            } else if (tagName === 'button') {
                code += `GridSystem.createButton('${data.coordinates}', '${content}', \n`;
                code += `    () => alert('Button clicked!'), {\n`;
                code += `    styles: ${JSON.stringify(styles, null, 8)}\n`;
                code += `});\n\n`;
            }
        });
        
        const blob = new Blob([code], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'grid-layout.js';
        a.click();
        
        URL.revokeObjectURL(url);
        console.log('Code exported');
    }

    /**
     * Copy code to clipboard
     */
    copyCode() {
        let code = '// Generated Grid Layout Code\n\n';
        
        this.gridSystem.elements.forEach((data, id) => {
            const element = data.element;
            const tagName = element.tagName.toLowerCase();
            const content = element.textContent;
            const styles = data.options.styles || {};
            
            if (tagName === 'div') {
                code += `GridSystem.createTextBox('${data.coordinates}', '${content}', {\n`;
                code += `    styles: ${JSON.stringify(styles, null, 8)}\n`;
                code += `});\n\n`;
            } else if (tagName === 'button') {
                code += `GridSystem.createButton('${data.coordinates}', '${content}', \n`;
                code += `    () => alert('Button clicked!'), {\n`;
                code += `    styles: ${JSON.stringify(styles, null, 8)}\n`;
                code += `});\n\n`;
            }
        });
        
        // Copy to clipboard
        navigator.clipboard.writeText(code).then(() => {
            console.log('Code copied to clipboard');
            
            // Show feedback
            const btn = document.getElementById('copy-code-btn');
            const originalText = btn.textContent;
            btn.textContent = '✅ Copied!';
            btn.style.background = '#28a745';
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '#17a2b8';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy code:', err);
            alert('Failed to copy code to clipboard');
        });
    }

    /**
     * Reset layout to defaults
     */
    resetLayout() {
        if (confirm('Are you sure you want to reset the layout to defaults? This will restore the original positions.')) {
            // Reset React elements to their original positions
            const characterContainer = document.querySelector('.character-container');
            const dialogContainer = document.querySelector('.dialog-container');
            
            if (characterContainer) {
                // Reset character to original position
                const originalPosition = gridPositions.getScreenElement('characterArea');
                Object.assign(characterContainer.style, originalPosition.css);
                
                // Update in grid system
                if (window.gridSystem.elements.has('react-character')) {
                    const elementData = window.gridSystem.elements.get('react-character');
                    elementData.coordinates = '[11, 3, 67, 32]';
                    elementData.coords = [11, 3, 67, 32];
                }
            }
            
            if (dialogContainer) {
                // Reset dialog to original position
                const originalPosition = gridPositions.getScreenElement('dialogBubble');
                Object.assign(dialogContainer.style, originalPosition.css);
                
                // Update in grid system
                if (window.gridSystem.elements.has('react-dialog')) {
                    const elementData = window.gridSystem.elements.get('react-dialog');
                    elementData.coordinates = '[21, 48, 48, 110]';
                    elementData.coords = [21, 48, 48, 110];
                }
            }
            
            console.log('Layout reset to defaults');
        }
    }

    /**
     * Update page information in the editor panel
     */
    updatePageInfo() {
        const pageInfoElement = document.getElementById('current-page-info');
        if (pageInfoElement && window.pageManager) {
            const info = window.pageManager.getCurrentPageInfo();
            pageInfoElement.innerHTML = `Current Page: ${info.title}<br><small>${info.id} (${info.elementCount} elements)</small>`;
            
            // Update button states
            const prevBtn = document.getElementById('prev-page-btn');
            const nextBtn = document.getElementById('next-page-btn');
            
            if (prevBtn && nextBtn) {
                const disabled = info.totalPages <= 1;
                prevBtn.disabled = disabled;
                nextBtn.disabled = disabled;
                prevBtn.style.opacity = disabled ? '0.5' : '1';
                nextBtn.style.opacity = disabled ? '0.5' : '1';
            }
        }
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GridEditor;
} else {
    window.GridEditor = GridEditor;
} 