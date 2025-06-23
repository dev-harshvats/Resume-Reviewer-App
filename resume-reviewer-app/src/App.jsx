// src/App.jsx
import { useState } from 'react';
import axios from 'axios'; // For making HTTP requests

import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import UploadSection from './components/UploadSection.jsx';
import ReviewResults from './components/ReviewResults.jsx';

import './App.css'; // Import the main CSS file

// Ensure this matches your backend URL and port
// For local development, this will be your Node.js/Express.js server
const API_BASE_URL = 'http://localhost:5001/api';

function App() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [jobRole, setJobRole] = useState('');
    const [reviewData, setReviewData] = useState(null);
    const [isReviewing, setIsReviewing] = useState(false);
    const [showResults, setShowResults] = useState(false); // Controls the expansion
    const [error, setError] = useState(null);

    const handleFileSelection = (file) => {
        setSelectedFile(file);
        // Reset review data when a new file is selected
        setReviewData(null);
        setShowResults(false); // Collapse results on new file selection
        setError(null);
    };

    const handleJobRoleChange = (role) => {
        setJobRole(role);
    };

    const handleReviewTrigger = async () => {
        if (!selectedFile) {
            // In a real app, use a proper modal/toast instead of alert
            alert('Please upload a resume first!');
            return;
        }

        setIsReviewing(true);
        setReviewData(null); // Clear previous results
        setError(null);
        setShowResults(true); // Immediately set to true to start the slide-down animation

        const formData = new FormData();
        formData.append('resume', selectedFile);
        formData.append('job_role', jobRole);

        try {
            const response = await axios.post(`${API_BASE_URL}/review-resume`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                // You might need to adjust timeout for LLM calls
                timeout: 60000 // 60 seconds
            });
            setReviewData(response.data);
        } catch (err) {
            console.error('Error during resume review:', err);
            // Check if error is from backend response or network
            setError(err.response?.data?.error || err.message || 'An unknown error occurred during review.');
            setReviewData(null); // Ensure reviewData is null on error
        } finally {
            setIsReviewing(false);
        }
    };

    return (
        <div className="App">
            <Header siteName="ResumeFlow" /> {/* Use your chosen name here */}
            
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
                authorName="[Your Name]"  /* IMPORTANT: Replace with your actual name */
                linkedin="https://linkedin.com/in/yourlinkedinprofile"  /* IMPORTANT: Replace with your LinkedIn URL */
                github="https://github.com/yourgithubprofile" /* IMPORTANT: Replace with your GitHub URL */
                email="youremail@example.com" /* IMPORTANT: Replace with your email */
            />
        </div>
    );
}

export default App;