// ============================================================
// GEMINI CONFIGURATION
// ============================================================

const API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent";


// ============================================================
// GET API KEY
// ============================================================

async function getApiKey() {

    const data =
        await chrome.storage.local.get(
            ["geminiApiKey"]
        );


    return data.geminiApiKey || "";

}


// ============================================================
// CALL GEMINI
// ============================================================

async function callGemini(prompt) {

    const apiKey =
        await getApiKey();


    if (!apiKey) {

        throw new Error(
            "Gemini API key is not configured.\n\n" +
            "Open Extension Settings and add your API key."
        );

    }


    const response =
        await fetch(
            `${API_URL}?key=${encodeURIComponent(apiKey)}`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    contents: [

                        {

                            parts: [

                                {
                                    text: prompt
                                }

                            ]

                        }

                    ],

                    generationConfig: {

                        temperature: 0.2,

                        maxOutputTokens: 2500,

                        responseMimeType:
                            "application/json"

                    }

                })

            }
        );


    if (!response.ok) {

        const errorText =
            await response.text();


        if (
            response.status === 429
        ) {

            throw new Error(
                "Gemini API quota exceeded.\n\n" +
                "Your current Gemini API free-tier limit has been reached. " +
                "Please wait for the quota to reset or use another API/project."
            );

        }


        if (
            response.status === 503
        ) {

            throw new Error(
                "Gemini service is temporarily unavailable.\n\n" +
                "Please try again later."
            );

        }


        throw new Error(
            `AI request failed (${response.status}).\n\n${errorText}`
        );

    }


    const data =
        await response.json();


    const text =
        data
            ?.candidates?.[0]
            ?.content
            ?.parts?.[0]
            ?.text;


    if (!text) {

        throw new Error(
            "The AI returned an empty response."
        );

    }


    return text;

}


// ============================================================
// ANALYZE CURRENT PAGE
// ============================================================

async function analyzeCurrentPage(
    pageText
) {

    if (
        !pageText ||
        pageText.trim().length < 100
    ) {

        throw new Error(
            "Not enough readable content was found on the webpage."
        );

    }


    const prompt = `

You are an expert Job Description Analyzer and Interview Preparation Assistant.

The following text was extracted from the CURRENT WEBPAGE.

The webpage may contain:

- Navigation
- Menus
- Job search filters
- Advertisements
- Recommended jobs
- Footer
- Buttons
- Header
- Sidebar
- Unrelated content

Your job is to identify and analyze ONLY the MAIN JOB POSTING.

Ignore unrelated content.

Return ONLY valid JSON.

Do NOT use markdown.

Do NOT use code fences.

Do NOT add any explanation outside the JSON.

Use EXACTLY this structure:

{
    "job_title": "string",
    "company": "string",
    "location": "string",
    "employment_type": "string",
    "experience": "string",
    "salary": "string",
    "match_score": 0,
    "summary": "string",
    "required_skills": [],
    "responsibilities": [],
    "requirements": [],
    "interview_questions": [],
    "preparation_tips": []
}

RULES:

1. Extract the actual main job title.
2. Extract the company name.
3. Extract the job location.
4. Identify employment type.
5. Extract required experience.
6. Extract salary, stipend or compensation if available.
7. If salary is unavailable, use "Not specified".
8. Summarize the main job posting.
9. Extract technical skills.
10. Extract relevant soft skills.
11. Extract responsibilities.
12. Extract candidate requirements.
13. Generate exactly 5 likely interview questions.
14. Questions must be relevant to this specific job.
15. Generate exactly 5 preparation tips.
16. match_score must be a number from 0 to 100.
17. Do not invent information about the company or job.
18. If information is unavailable, use "Not specified".
19. Ignore recommended jobs.
20. Ignore advertisements.
21. Ignore navigation menus.
22. Ignore unrelated page content.
23. Focus on the main job currently being viewed.

IMPORTANT:

The match_score is an estimated interview-preparation relevance score based ONLY on the information present in the job posting.

WEBPAGE TEXT:

${pageText}

`;


    return await callGemini(
        prompt
    );

}


// ============================================================
// MESSAGE LISTENER
// ============================================================

chrome.runtime.onMessage.addListener(
    (
        message,
        sender,
        sendResponse
    ) => {


        // ========================================================
        // ANALYZE PAGE
        // ========================================================

        if (
            message?.type ===
            "ANALYZE_PAGE"
        ) {

            analyzeCurrentPage(
                message.pageText
            )
                .then(
                    (text) => {

                        sendResponse({

                            success: true,

                            text: text

                        });

                    }
                )
                .catch(
                    (error) => {

                        console.error(
                            "Page analysis error:",
                            error
                        );


                        sendResponse({

                            success: false,

                            error:
                                error?.message ||
                                "AI analysis failed."

                        });

                    }
                );


            return true;

        }


        // ========================================================
        // UNKNOWN MESSAGE
        // ========================================================

        sendResponse({

            success: false,

            error:
                "Unknown message type."

        });


        return false;

    }
);