// src/components/Header.jsx
import React from 'react';

function Header({ siteName }) {
    return (
        <header>
            <h1>{siteName}</h1>
            <p className="tagline">AI-Powered Resume Analysis for Your Dream Job</p>
        </header>
    );
}

export default Header;