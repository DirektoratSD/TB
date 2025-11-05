// Reusable DialogueBox Component
function DialogueBox({ 
    text = '', 
    highlights = [], 
    className = 'dialogue-box',
    showTail = true,
    textAlign = 'center'
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

    return React.createElement('div', { 
        className: className,
        style: { textAlign: textAlign }
    },
        React.createElement('div', { className: 'dialogue-content' },
            React.createElement('p', {
                className: 'dialogue-text',
                dangerouslySetInnerHTML: { __html: processedText }
            })
        ),
        showTail ? React.createElement('div', { className: 'dialogue-tail' }) : null
    );
}

// Predefined highlight types for common use cases
const HighlightTypes = {
    ADDITION: 'highlight-addition',
    NEXT: 'highlight-next',
    UNITS_PLACE: 'highlight-units-place',
    TENS_PLACE: 'highlight-tens-place',
    HUNDREDS_PLACE: 'highlight-hundreds-place',
    ADD_FIRST: 'highlight-add-first',
    DIRECTION: 'highlight-direction',
    PLUS_SIGN: 'highlight-plus-sign',
    NEXT_BUTTON: 'highlight-next-button'
};

// Helper function to create highlight objects
const createHighlight = (type, options = {}) => {
    const baseHighlight = {
        className: type,
        ...options
    };
    
    return baseHighlight;
};

// Export for use in other components
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DialogueBox, HighlightTypes, createHighlight };
} 