// src/components/Footer.jsx
import React from 'react';

function Footer({ authorName, linkedin, github, email }) {
    return (
        <footer>
            <p>Created/Curated by {authorName}</p>
            <div className="social-links">
                {linkedin && <a href={linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
                {github && <a href={github} target="_blank" rel="noopener noreferrer">GitHub</a>}
                {email && <a href={`mailto:${email}`}>Email</a>}
            </div>
        </footer>
    );
}

export default Footer;