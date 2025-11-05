/**
 * PAGE MANAGER
 * ============
 * Manages page-based navigation for grid positioned elements.
 * Allows organizing elements into different pages with next/prev navigation.
 */

class PageManager {
    constructor(gridSystem) {
        this.gridSystem = gridSystem;
        this.pages = new Map(); // Map of pageId -> { elements: Set, title: string, visible: boolean }
        this.currentPage = 'page1'; // Default page
        this.pageHistory = []; // Navigation history
        this.maxHistory = 10;
        
        // Initialize with default page
        this.createPage('page1', 'Main Page', true);
        
        // Create navigation UI
        this.createNavigationUI();
        
        // Bind keyboard shortcuts
        this.bindKeyboardShortcuts();
        
        console.log('PageManager initialized');
    }
    
    /**
     * Create a new page
     */
    createPage(pageId, title = 'New Page', visible = true) {
        if (this.pages.has(pageId)) {
            console.warn(`Page ${pageId} already exists`);
            return false;
        }
        
        this.pages.set(pageId, {
            elements: new Set(),
            title: title,
            visible: visible,
            created: new Date()
        });
        
        this.updateNavigationUI();
        
        // Update grid editor page info if available
        if (window.gridEditor && window.gridEditor.updatePageInfo) {
            window.gridEditor.updatePageInfo();
        }
        
        console.log(`Created page: ${pageId} - ${title}`);
        return true;
    }
    
    /**
     * Delete a page
     */
    deletePage(pageId) {
        if (pageId === 'page1') {
            console.warn('Cannot delete the main page');
            return false;
        }
        
        if (!this.pages.has(pageId)) {
            console.warn(`Page ${pageId} does not exist`);
            return false;
        }
        
        // Move elements to main page
        const page = this.pages.get(pageId);
        page.elements.forEach(elementId => {
            this.moveElementToPage(elementId, 'page1');
        });
        
        this.pages.delete(pageId);
        
        // Switch to main page if current page was deleted
        if (this.currentPage === pageId) {
            this.goToPage('page1');
        }
        
        this.updateNavigationUI();
        console.log(`Deleted page: ${pageId}`);
        return true;
    }
    
    /**
     * Add element to page
     */
    addElementToPage(elementId, pageId = null) {
        const targetPage = pageId || this.currentPage;
        
        if (!this.pages.has(targetPage)) {
            console.warn(`Page ${targetPage} does not exist`);
            return false;
        }
        
        // Remove from other pages first
        this.pages.forEach(page => {
            page.elements.delete(elementId);
        });
        
        // Add to target page
        this.pages.get(targetPage).elements.add(elementId);
        
        // Update visibility
        this.updateElementVisibility();
        
        // Update grid editor page info if available
        if (window.gridEditor && window.gridEditor.updatePageInfo) {
            window.gridEditor.updatePageInfo();
        }
        
        console.log(`Added element ${elementId} to page ${targetPage}`);
        return true;
    }
    
    /**
     * Move element to different page
     */
    moveElementToPage(elementId, pageId) {
        return this.addElementToPage(elementId, pageId);
    }
    
    /**
     * Remove element from current page
     */
    removeElementFromPage(elementId) {
        this.pages.forEach(page => {
            page.elements.delete(elementId);
        });
        
        this.updateElementVisibility();
        console.log(`Removed element ${elementId} from all pages`);
    }
    
    /**
     * Go to specific page
     */
    goToPage(pageId) {
        if (!this.pages.has(pageId)) {
            console.warn(`Page ${pageId} does not exist`);
            return false;
        }
        
        // Add to history
        if (this.currentPage !== pageId) {
            this.pageHistory.push(this.currentPage);
            if (this.pageHistory.length > this.maxHistory) {
                this.pageHistory.shift();
            }
        }
        
        this.currentPage = pageId;
        this.updateElementVisibility();
        this.updateNavigationUI();
        
        // Update grid editor page info if available
        if (window.gridEditor && window.gridEditor.updatePageInfo) {
            window.gridEditor.updatePageInfo();
        }
        
        console.log(`Switched to page: ${pageId}`);
        return true;
    }
    
    /**
     * Go to next page
     */
    nextPage() {
        const pageIds = Array.from(this.pages.keys());
        const currentIndex = pageIds.indexOf(this.currentPage);
        const nextIndex = (currentIndex + 1) % pageIds.length;
        
        this.goToPage(pageIds[nextIndex]);
    }
    
    /**
     * Go to previous page
     */
    prevPage() {
        const pageIds = Array.from(this.pages.keys());
        const currentIndex = pageIds.indexOf(this.currentPage);
        const prevIndex = currentIndex === 0 ? pageIds.length - 1 : currentIndex - 1;
        
        this.goToPage(pageIds[prevIndex]);
    }
    
    /**
     * Go back in history
     */
    goBack() {
        if (this.pageHistory.length > 0) {
            const previousPage = this.pageHistory.pop();
            this.currentPage = previousPage;
            this.updateElementVisibility();
            this.updateNavigationUI();
            
            console.log(`Went back to page: ${previousPage}`);
        }
    }
    
    /**
     * Update element visibility based on current page
     */
    updateElementVisibility() {
        // Hide all elements first
        this.gridSystem.elements.forEach((data, elementId) => {
            if (data.element) {
                data.element.style.display = 'none';
            }
        });
        
        // Show elements on current page
        const currentPageData = this.pages.get(this.currentPage);
        if (currentPageData) {
            currentPageData.elements.forEach(elementId => {
                const elementData = this.gridSystem.elements.get(elementId);
                if (elementData && elementData.element) {
                    elementData.element.style.display = '';
                }
            });
        }
        
        // Always show React elements (they're special)
        const reactElements = ['react-character', 'react-dialog'];
        reactElements.forEach(elementId => {
            const elementData = this.gridSystem.elements.get(elementId);
            if (elementData && elementData.element) {
                elementData.element.style.display = '';
            }
        });
    }
    
    /**
     * Get current page info
     */
    getCurrentPageInfo() {
        const pageData = this.pages.get(this.currentPage);
        return {
            id: this.currentPage,
            title: pageData.title,
            elementCount: pageData.elements.size,
            totalPages: this.pages.size
        };
    }
    
    /**
     * Get all pages
     */
    getAllPages() {
        const pages = [];
        this.pages.forEach((data, id) => {
            pages.push({
                id: id,
                title: data.title,
                elementCount: data.elements.size,
                isCurrent: id === this.currentPage
            });
        });
        return pages;
    }
    
    /**
     * Create navigation UI
     */
    createNavigationUI() {
        // Create navigation container
        this.navContainer = document.createElement('div');
        this.navContainer.id = 'page-navigation';
        this.navContainer.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            font-family: Arial, sans-serif;
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 15px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        `;
        
        // Previous button
        this.prevBtn = document.createElement('button');
        this.prevBtn.innerHTML = '⬅️ Prev';
        this.prevBtn.style.cssText = `
            background: #007bff;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 15px;
            cursor: pointer;
            font-size: 12px;
        `;
        this.prevBtn.addEventListener('click', () => this.prevPage());
        
        // Page info
        this.pageInfo = document.createElement('div');
        this.pageInfo.style.cssText = `
            font-size: 14px;
            font-weight: bold;
            min-width: 120px;
            text-align: center;
        `;
        
        // Next button
        this.nextBtn = document.createElement('button');
        this.nextBtn.innerHTML = 'Next ➡️';
        this.nextBtn.style.cssText = `
            background: #007bff;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 15px;
            cursor: pointer;
            font-size: 12px;
        `;
        this.nextBtn.addEventListener('click', () => this.nextPage());
        
        // Add page button
        this.addPageBtn = document.createElement('button');
        this.addPageBtn.innerHTML = '➕';
        this.addPageBtn.style.cssText = `
            background: #28a745;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 12px;
        `;
        this.addPageBtn.addEventListener('click', () => this.createNewPage());
        
        // Assemble navigation
        this.navContainer.appendChild(this.prevBtn);
        this.navContainer.appendChild(this.pageInfo);
        this.navContainer.appendChild(this.nextBtn);
        this.navContainer.appendChild(this.addPageBtn);
        
        document.body.appendChild(this.navContainer);
        
        this.updateNavigationUI();
    }
    
    /**
     * Update navigation UI
     */
    updateNavigationUI() {
        if (!this.pageInfo) return;
        
        const info = this.getCurrentPageInfo();
        this.pageInfo.innerHTML = `
            <div>${info.title}</div>
            <div style="font-size: 10px; opacity: 0.7;">${info.id} (${info.elementCount} elements)</div>
        `;
        
        // Enable/disable buttons
        this.prevBtn.disabled = this.pages.size <= 1;
        this.nextBtn.disabled = this.pages.size <= 1;
        
        this.prevBtn.style.opacity = this.prevBtn.disabled ? '0.5' : '1';
        this.nextBtn.style.opacity = this.nextBtn.disabled ? '0.5' : '1';
    }
    
    /**
     * Create new page prompt
     */
    createNewPage() {
        const title = prompt('Enter page title:', `Page ${this.pages.size + 1}`);
        if (title) {
            const pageId = `page${this.pages.size + 1}`;
            this.createPage(pageId, title);
        }
    }
    
    /**
     * Bind keyboard shortcuts
     */
    bindKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Only handle if not in input field
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }
            
            if (e.ctrlKey && e.key === 'ArrowRight') {
                e.preventDefault();
                this.nextPage();
            } else if (e.ctrlKey && e.key === 'ArrowLeft') {
                e.preventDefault();
                this.prevPage();
            } else if (e.ctrlKey && e.key === 'ArrowUp') {
                e.preventDefault();
                this.goBack();
            } else if (e.ctrlKey && e.shiftKey && e.key === 'N') {
                e.preventDefault();
                this.createNewPage();
            }
        });
    }
    
    /**
     * Get page elements
     */
    getPageElements(pageId = null) {
        const targetPage = pageId || this.currentPage;
        const pageData = this.pages.get(targetPage);
        return pageData ? Array.from(pageData.elements) : [];
    }
    
    /**
     * Export page data
     */
    exportPages() {
        const pageData = {};
        this.pages.forEach((data, id) => {
            pageData[id] = {
                title: data.title,
                elements: Array.from(data.elements),
                created: data.created
            };
        });
        
        return {
            currentPage: this.currentPage,
            pages: pageData
        };
    }
    
    /**
     * Import page data
     */
    importPages(data) {
        this.pages.clear();
        
        Object.entries(data.pages).forEach(([id, pageData]) => {
            this.pages.set(id, {
                elements: new Set(pageData.elements),
                title: pageData.title,
                visible: true,
                created: new Date(pageData.created)
            });
        });
        
        this.currentPage = data.currentPage || 'page1';
        this.updateElementVisibility();
        this.updateNavigationUI();
        
        console.log('Imported page data');
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PageManager;
} else {
    window.PageManager = PageManager;
} 