// AnimatedSign Component - Displays text inside a pulsating circle
function AnimatedSign({ 
    text = '', 
    className = 'animated-sign',
    size = '100px',
    fontSize = '1.5rem'
}) {
    const circleStyle = {
        width: size === 'auto' ? '100%' : size,
        height: size === 'auto' ? '100%' : size,
        aspectRatio: '1 / 1', // Keep it circular
        maxWidth: size === 'auto' ? '60px' : size, // Limit max size when auto
        maxHeight: size === 'auto' ? '60px' : size,
        borderRadius: '50%',
        backgroundColor: 'black',
        border: '3px solid white',
        color: 'white',
        fontSize: fontSize,
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        animation: 'pulsatingCircle 2s ease-in-out infinite',
        boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
        zIndex: 10,
        position: 'relative'
    };

    return React.createElement('div', {
        className: className,
        style: circleStyle
    }, text);
}

// Export for use in other components
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AnimatedSign };
} 