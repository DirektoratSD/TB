// Header Component
function Header({ getText }) {
    return React.createElement('div', { className: 'header-container' },
        React.createElement('img', { 
            src: 'assets/logo.png', 
            alt: 'Logo', 
            className: 'header-logo' 
        }),
        React.createElement('h1', { className: 'header-title' }, getText('headerTitle'))
    );
} 