// src/components/ReviewResults.jsx
import React, { useEffect, useState } from 'react';

function ReviewResults({ reviewData, isExpanded, isLoading, error }) {
    const classNames = `results-section container ${isExpanded ? 'expanded' : ''}`;
    const [animatedScore, setAnimatedScore] = useState(0);

    // Effect for animating the ATS score dial
    useEffect(() => {
        if (reviewData && reviewData.ats_score !== undefined) {
            const targetScore = reviewData.ats_score;
            let currentScore = 0;
            const duration = 1000; // milliseconds
            const increment = targetScore / (duration / 10); // roughly 100 increments

            const timer = setInterval(() => {
                currentScore += increment;
                if (currentScore >= targetScore) {
                    setAnimatedScore(targetScore);
                    clearInterval(timer);
                } else {
                    setAnimatedScore(Math.floor(currentScore));
                }
            }, 10);

            return () => clearInterval(timer); // Cleanup on unmount or score change
        } else {
            setAnimatedScore(0); // Reset score when no data
        }
    }, [reviewData]);

    // Calculate background gradient for the dial
    const dialGradient = reviewData && reviewData.ats_score !== undefined
        ? `conic-gradient(var(--primary-accent) ${animatedScore * 3.6}deg, #e0e0e0 ${animatedScore * 3.6}deg)`
        : 'conic-gradient(#e0e0e0 0deg, #e0e0e0 0deg)'; // Default for no score or 0

    if (isLoading) {
        return (
            <section id="results-section" className={classNames}>
                <div id="review-content">
                    <p>Analyzing your resume with AI. This may take a moment...</p>
                    <div className="loading-spinner"></div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section id="results-section" className={classNames}>
                <div id="review-content">
                    <p style={{ color: 'red', textAlign: 'center' }}>Error reviewing your resume: {error}</p>
                    <p style={{ textAlign: 'center', fontSize: '0.9em', color: '#666' }}>Please try again or contact support if the issue persists.</p>
                </div>
            </section>
        );
    }

    if (!reviewData) {
        return null;
    }

    return (
        <section id="results-section" className={classNames}>
            <h2>Your Resume Review Report</h2>
            <div id="review-content">
                {/* ATS Score Dial */}
                <div className="ats-dial-container">
                    <div className="ats-dial" style={{ background: dialGradient }}>
                        <span className="ats-score-text">{animatedScore}%</span>
                    </div>
                    <span className="ats-dial-label">ATS Compatibility Score</span>
                </div>

                <h3>Overall Feedback:</h3>
                <p>{reviewData.overall_feedback || 'No overall feedback provided.'}</p>
                
                {/* Suggestions for Improvement */}
                <h3>Suggestions for Improvement:</h3>
                {reviewData.suggestions && reviewData.suggestions.length > 0 ? (
                    <ul className="suggestions-list"> {/* Added class for specific bullet */}
                        {reviewData.suggestions.map((s, index) => (
                            <li key={`suggestion-${index}`}>{s}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No specific suggestions for improvement at this time. Great job!</p>
                )}
                
                {/* Keyword Analysis */}
                <h3>Keyword Relevance & Match:</h3>
                <p>{reviewData.keyword_analysis || 'No keyword analysis provided.'}</p>

                {/* Additions/New Sections Recommendations */}
                <h3>Recommended Additions/New Sections:</h3>
                {reviewData.additions_recommendations && reviewData.additions_recommendations.length > 0 ? (
                    <ul className="additions-list"> {/* Added class for specific bullet */}
                        {reviewData.additions_recommendations.map((a, index) => (
                            <li key={`addition-${index}`}>{a}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No specific additions recommended. Your resume seems comprehensive!</p>
                )}
            </div>
        </section>
    );
}

export default ReviewResults;