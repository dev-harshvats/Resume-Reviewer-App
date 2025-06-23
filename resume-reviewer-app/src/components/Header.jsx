// src/components/Header.jsx
import React from 'react';
// No need to import App.css directly if it's imported in App.jsx or main.jsx
// Styles are assumed to be global or imported by the parent.

function Header({ siteName }) {
    return (
        <header>
            <h1>{siteName}</h1>
            <p className="tagline">AI-Powered Resume Analysis for Your Dream Job</p>
        </header>
    );
}

export default Header;