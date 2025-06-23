// src/components/ReviewResults.jsx
import React from 'react';

function ReviewResults({ reviewData, isExpanded, isLoading, error }) {
    const classNames = `results-section container ${isExpanded ? 'expanded' : ''}`;

    if (isLoading) {
        return (
            <section id="results-section" className={classNames}>
                <div id="review-content">
                    <p>Analyzing your resume with AI. This may take a moment...</p>
                    <div className="loading-spinner"></div> {/* Optional: Add a CSS spinner */}
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section id="results-section" className={classNames}>
                <div id="review-content">
                    <p style={{ color: 'red' }}>Error reviewing your resume: {error}</p>
                </div>
            </section>
        );
    }

    if (!reviewData) {
        return null; // Don't render if no data and not loading/error
    }

    return (
        <section id="results-section" className={classNames}>
            <h2>Your Resume Review Report</h2>
            <div id="review-content">
                <h3>Overall Feedback:</h3>
                <p>{reviewData.overall_feedback || 'No overall feedback provided.'}</p>
                
                <h3>Suggestions for Improvement:</h3>
                {reviewData.suggestions && reviewData.suggestions.length > 0 ? (
                    <ul>
                        {reviewData.suggestions.map((s, index) => (
                            <li key={index}>{s}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No specific suggestions at this time.</p>
                )}
                
                <h3>Keyword Analysis:</h3>
                <p>{reviewData.keyword_analysis || 'No keyword analysis provided.'}</p>

                <h3>ATS Compatibility Score:</h3>
                <p>{reviewData.ats_score ? `${reviewData.ats_score}%` : 'N/A'}</p>

                {/* Add more sections based on your LLM's structured output */}
            </div>
        </section>
    );
}

export default ReviewResults;