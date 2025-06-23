// src/components/Footer.jsx
import React from 'react';

function Footer({ authorName, linkedin, github, email }) {
    return (
        <footer>
            <p>Curated by {authorName}</p>
            <div className="social-icons">
                {linkedin && (
                    <a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <i className="fab fa-linkedin"></i>
                    </a>
                )}
                {github && (
                    <a href={github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                        <i className="fab fa-github"></i>
                    </a>
                )}
                {email && (
                    <a href={`mailto:${email}`} aria-label="Email">
                        <i className="fas fa-envelope"></i>
                    </a>
                )}
            </div>
        </footer>
    );
}

export default Footer;