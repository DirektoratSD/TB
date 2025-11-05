// Character Component
function Character({ characterState }) {
    const [imageSrc, setImageSrc] = React.useState('');

    React.useEffect(() => {
        const getCharacterImage = (state) => {
            switch (state) {
                case 'curious': return 'assets/character_curious.png';
                case 'excited': return 'assets/character_excited.png';
                case 'smiling': return 'assets/character_smiling.png';
                case 'neutral':
                default: return 'assets/character_neutral.png';
            }
        };

        setImageSrc(getCharacterImage(characterState));
    }, [characterState]);

    return React.createElement('div', { className: 'character-box' },
        React.createElement('img', {
            src: imageSrc,
            alt: `Character ${characterState}`,
            className: 'character-image'
        })
    );
}

// Dialogue Component - Removed, no longer needed for single step

// Character Panel Component - Simplified for single step
function CharacterPanel({ characterState, dialogue, dialogueKey }) {
    // Get highlights for the current dialogue
    const getDialogueHighlights = () => {
        if (dialogueKey) {
            return AppData.getHighlights(dialogueKey);
        }
        return [];
    };

    return React.createElement('div', { className: 'character-panel' },
        React.createElement(DialogueBox, {
            text: dialogue,
            highlights: getDialogueHighlights(),
            className: 'dialogue-box',
            showTail: true,
            textAlign: 'center'
        }),
        React.createElement('div', { className: 'character-box' },
            React.createElement('img', {
                src: `assets/character_${characterState}.png`,
                alt: 'Character',
                className: 'character-image'
            })
        )
    );
} 