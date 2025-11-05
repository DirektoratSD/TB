// SecondDialogBox Component - Specialized for bottom dialogue area
function SecondDialogBox({ 
    text = '', 
    highlights = [], 
    className = 'second-dialog-box',
    textAlign = 'center',
    showBorder = true,
    backgroundColor = 'rgba(255, 255, 255, 0.95)'
}) {
    /**
     * Process text with highlights
     * @param {string} text - The base text
     * @param {Array} highlights - Array of highlight objects
     * @returns {string} - HTML string with highlights applied
     */
    const processTextWithHighlights = (text, highlights) => {
        if (!highlights || highlights.length === 0) {
            return text;
        }

        let processedText = text;
        
        // Sort highlights by position (descending) to avoid index shifting
        const sortedHighlights = [...highlights].sort((a, b) => {
            if (a.start !== undefined && b.start !== undefined) {
                return b.start - a.start;
            }
            return 0;
        });

        sortedHighlights.forEach(highlight => {
            if (highlight.word) {
                // Word-based highlighting
                const regex = new RegExp(`\\b${highlight.word}\\b`, 'gi');
                processedText = processedText.replace(regex, (match) => {
                    return `<span class="${highlight.className || 'highlight'}">${match}</span>`;
                });
            } else if (highlight.start !== undefined && highlight.end !== undefined) {
                // Position-based highlighting
                const before = processedText.substring(0, highlight.start);
                const highlightedText = processedText.substring(highlight.start, highlight.end);
                const after = processedText.substring(highlight.end);
                processedText = before + 
                    `<span class="${highlight.className || 'highlight'}">${highlightedText}</span>` + 
                    after;
            } else if (highlight.phrase) {
                // Phrase-based highlighting
                const regex = new RegExp(highlight.phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
                processedText = processedText.replace(regex, (match) => {
                    return `<span class="${highlight.className || 'highlight'}">${match}</span>`;
                });
            }
        });

        return processedText;
    };

    const processedText = processTextWithHighlights(text, highlights);

    const containerStyle = {
        textAlign: textAlign,
        backgroundColor: backgroundColor,
        border: showBorder ? '2px solid rgba(0, 0, 0, 0.1)' : 'none'
    };

    return React.createElement('div', { 
        className: className,
        style: containerStyle
    },
        React.createElement('div', { className: 'second-dialog-content' },
            React.createElement('p', {
                className: 'second-dialog-text',
                dangerouslySetInnerHTML: { __html: processedText }
            })
        )
    );
}

// Predefined styles for different bottom dialogue types
const SecondDialogStyles = {
    DEFAULT: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        showBorder: true
    },
    SUCCESS: {
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        showBorder: true
    },
    WARNING: {
        backgroundColor: 'rgba(255, 193, 7, 0.1)',
        showBorder: true
    },
    INFO: {
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        showBorder: true
    },
    TRANSPARENT: {
        backgroundColor: 'transparent',
        showBorder: false
    }
};

// Helper function to create SecondDialogBox with predefined styles
const createSecondDialog = (text, highlights = [], styleType = 'DEFAULT', options = {}) => {
    const style = SecondDialogStyles[styleType] || SecondDialogStyles.DEFAULT;
    
    return React.createElement(SecondDialogBox, {
        text: text,
        highlights: highlights,
        backgroundColor: style.backgroundColor,
        showBorder: style.showBorder,
        ...options
    });
};

// Export for use in other components
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SecondDialogBox, SecondDialogStyles, createSecondDialog };
} 