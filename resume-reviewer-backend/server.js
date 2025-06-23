// server.js
const express = require('express');
const Groq = require('groq-sdk');
const dotenv = require('dotenv');
const multer = require('multer');   // for handling file uploads
const mammoth = require('mammoth');
const pdf = require('pdf-parse');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 5001; // Use port 5001 as previously decided for backend

// Configure CORS to allow requests from your React frontend
// In production, replace '*' with your actual frontend URL (e.g., 'http://localhost:3000' during development)
app.use(cors({
    origin: 'http://localhost:5173' // Your Vite React app's default port
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Set up Multer for file uploads
const upload = multer(); // No disk storage needed, we process in memory

// Initialize Groq SDK with your API key
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// --- Helper Functions for File Parsing ---

async function extractTextFromPdf(buffer) {
    try {
        const data = await pdf(buffer);
        return data.text;
    } catch (error) {
        console.error("Error extracting text from PDF:", error);
        throw new Error("Failed to parse PDF file.");
    }
}

async function extractTextFromDocx(buffer) {
    try {
        const result = await mammoth.extractRawText({ arrayBuffer: buffer });
        return result.value; // The raw text
    } catch (error) {
        console.error("Error extracting text from DOCX:", error);
        throw new Error("Failed to parse DOCX file.");
    }
}

// --- Groq API Call Function ---
async function getGroqChatCompletion(resumeText, jobRole) {
    const systemPrompt = "You are a professional resume reviewer AI, providing constructive and detailed feedback. Your goal is to help the user optimize their resume for a specific job role and general industry standards.";

    const userPrompt = `Review the following resume for the desired job role of "${jobRole}".
Provide a comprehensive analysis including:
1.  **Overall Feedback:** Summarize its strengths and weaknesses.
2.  **Suggestions for Improvement:** Provide specific, actionable suggestions, categorized by sections (e.g., Summary/Objective, Experience, Education, Skills, Projects). Include advice on wording, quantifiable achievements, and common pitfalls.
3.  **Keyword Relevance & Match:** Analyze how well the resume's keywords align with the "${jobRole}" and identify missing or under-emphasized keywords based on typical requirements for such a role.
4.  **ATS (Applicant Tracking System) Compatibility:** Provide an estimated ATS compatibility score (out of 100) and specific reasons why it scored that way (e.g., formatting issues, keyword density, common ATS parsing errors).
5.  **Additions/New Sections:** Recommend any new sections or types of information that could significantly strengthen the resume for this role (e.g., certifications, portfolio link, leadership experience).

Provide the output in a structured JSON format with the following keys:
\`\`\`json
{
  "overall_feedback": "string",
  "suggestions": ["string", "string", ...],
  "keyword_analysis": "string",
  "ats_score": "integer (0-100)",
  "additions_recommendations": ["string", "string", ...]
}
\`\`\`
Ensure the JSON is valid and complete.

Resume Content:\n\`\`\`\n${resumeText}\n\`\`\``;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            model: "llama-3.1-8b-instant", // Using a faster, cheaper model for review, adjust as needed
            response_format: { type: "json_object" }, // Crucial for getting JSON output
            temperature: 0.7, // Adjust creativity
            max_tokens: 2000, // Adjust max output length as needed
        });

        const content = chatCompletion.choices[0]?.message?.content;
        console.log("Raw LLM Response:", content); // Log raw response for debugging

        if (!content) {
            throw new Error("LLM returned empty content.");
        }

        // Attempt to parse the JSON content
        try {
            return JSON.parse(content);
        } catch (jsonError) {
            console.error("Failed to parse LLM JSON response:", jsonError);
            console.error("Problematic LLM output:", content);
            throw new Error("LLM did not return valid JSON. Please try again or check the backend logs.");
        }

    } catch (error) {
        console.error("Error calling Groq API:", error);
        throw new Error(`Groq API call failed: ${error.message}`);
    }
}

// --- API Endpoint for Resume Review ---
app.post('/api/review-resume', upload.single('resume'), async (req, res) => {
    // `upload.single('resume')` makes the file available as `req.file`
    if (!req.file) {
        return res.status(400).json({ error: "No resume file uploaded." });
    }

    const jobRole = req.body.job_role || ''; // Get job_role from form data
    let resumeText = '';

    // Determine file type and extract text
    if (req.file.mimetype === 'application/pdf') {
        try {
            resumeText = await extractTextFromPdf(req.file.buffer);
        } catch (e) {
            return res.status(400).json({ error: e.message });
        }
    } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        try {
            resumeText = await extractTextFromDocx(req.file.buffer);
        } catch (e) {
            return res.status(400).json({ error: e.message });
        }
    } else {
        return res.status(400).json({ error: "Unsupported file type. Please upload a PDF or DOCX." });
    }

    // Basic check for extracted content
    if (!resumeText.trim()) {
        return res.status(400).json({ error: "Could not extract readable text from the resume. Please ensure it's not an image-only PDF." });
    }

    try {
        const review = await getGroqChatCompletion(resumeText, jobRole);
        res.status(200).json(review);
    } catch (error) {
        console.error("Error during resume review process:", error);
        res.status(500).json({ error: error.message || "Failed to get resume review from AI." });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});