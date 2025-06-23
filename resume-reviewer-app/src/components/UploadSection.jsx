// src/components/UploadSection.jsx
import React, { useState, useRef } from 'react';

function UploadSection({ onFileSelect, onJobRoleChange, onReviewTrigger, isReviewing }) {
    const [fileName, setFileName] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
            onFileSelect(file); // Pass the file up to the parent App component
        } else {
            setFileName(null);
            onFileSelect(null);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        event.currentTarget.style.backgroundColor = '#eaf2f8'; // Highlight on drag over
    };

    const handleDragLeave = (event) => {
        event.currentTarget.style.backgroundColor = '#f9f9f9'; // Revert on drag leave
    };

    const handleDrop = (event) => {
        event.preventDefault();
        event.currentTarget.style.backgroundColor = '#f9f9f9'; // Revert on drop
        const file = event.dataTransfer.files[0];
        if (file) {
            setFileName(file.name);
            onFileSelect(file);
        } else {
            setFileName(null);
            onFileSelect(null);
        }
    };

    return (
        <section id="upload-section" className="container">
            <h2>Get Your Resume Reviewed!</h2>
            <p className="description">Drag and drop your resume (PDF or DOCX) here, or click to upload.</p>
            <div
                id="drag-drop-area"
                onClick={() => fileInputRef.current.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <p>{fileName ? `File Selected: ${fileName}` : 'Drag & Drop your document here'}</p>
                <input
                    type="file"
                    id="upload-document"
                    ref={fileInputRef}
                    accept=".pdf,.docx"
                    onChange={handleFileChange}
                    style={{ display: 'none' }} // Hide the default input
                />
                {!fileName && <button onClick={(e) => { e.stopPropagation(); fileInputRef.current.click(); }}>Upload Document</button>}
            </div>

            <div className="input-group">
                <label htmlFor="job-role">Desired Job Role (e.g., "Software Development Engineer", "Data Scientist"):</label>
                <input
                    type="text"
                    id="job-role"
                    placeholder="Enter job role (optional for general review)"
                    onChange={(e) => onJobRoleChange(e.target.value)}
                />
            </div>
            <button onClick={onReviewTrigger} disabled={!fileName || isReviewing}>
                {isReviewing ? 'Reviewing...' : 'Review My Resume'}
            </button>
        </section>
    );
}

export default UploadSection;