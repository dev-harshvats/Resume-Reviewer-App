// src/App.jsx
import React, { useState } from 'react';
import axios from 'axios';

import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import UploadSection from './components/UploadSection.jsx';
import ReviewResults from './components/ReviewResults.jsx';

import './App.css';

const API_BASE_URL = 'http://localhost:5001/api';

function App() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [jobRole, setJobRole] = useState('');
    const [reviewData, setReviewData] = useState(null);
    const [isReviewing, setIsReviewing] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [error, setError] = useState(null);

    const handleFileSelection = (file) => {
        setSelectedFile(file);
        setReviewData(null);
        setShowResults(false);
        setError(null);
    };

    const handleJobRoleChange = (role) => {
        setJobRole(role);
    };

    const handleReviewTrigger = async () => {
        if (!selectedFile) {
            alert('Please upload a resume first!');
            return;
        }

        setIsReviewing(true);
        setReviewData(null);
        setError(null);
        setShowResults(true); // Always attempt to show results section when reviewing starts

        const formData = new FormData();
        formData.append('resume', selectedFile);
        formData.append('job_role', jobRole);

        try {
            const response = await axios.post(`${API_BASE_URL}/review-resume`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 60000
            });
            // Ensure the backend response matches the expected structure for ReviewResults.jsx
            // The backend's getGroqChatCompletion function is designed to return this structure.
            setReviewData(response.data);
        } catch (err) {
            console.error('Error during resume review:', err);
            setError(err.response?.data?.error || err.message || 'An unknown error occurred during review.');
            setReviewData(null);
        } finally {
            setIsReviewing(false);
        }
    };

    return (
        <div className="App">
            <Header siteName="ResumeFlow" />
            
            <main>
                <UploadSection
                    onFileSelect={handleFileSelection}
                    onJobRoleChange={handleJobRoleChange}
                    onReviewTrigger={handleReviewTrigger}
                    isReviewing={isReviewing}
                />
                
                <ReviewResults
                    reviewData={reviewData}
                    isExpanded={showResults}
                    isLoading={isReviewing}
                    error={error}
                />
            </main>

            <Footer
                authorName="Harsh Vats"
                linkedin="https://linkedin.com/in/vatsharsh"
                github="https://github.com/dev-harshvats"
                email="h.harshvats@gmail.com"
            />
        </div>
    );
}

export default App;