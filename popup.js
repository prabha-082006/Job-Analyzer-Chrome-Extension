// ============================================================
// ELEMENTS
// ============================================================

const extractBtn =
    document.getElementById("extractBtn");

const settingsBtn =
    document.getElementById("settingsBtn");

const clearBtn =
    document.getElementById("clearBtn");

const resultSection =
    document.getElementById("resultSection");

const resultElement =
    document.getElementById("result");

const statusTitle =
    document.getElementById("statusTitle");

const statusText =
    document.getElementById("statusText");

const statusDot =
    document.getElementById("statusDot");


// ============================================================
// STATUS
// ============================================================

function setStatus(
    title,
    text,
    type = "ready"
) {

    statusTitle.textContent =
        title;

    statusText.textContent =
        text;

    statusDot.className =
        "status-dot";

    if (type === "loading") {

        statusDot.classList.add(
            "loading"
        );

    }

    if (type === "error") {

        statusDot.classList.add(
            "error"
        );

    }

}


// ============================================================
// SHOW RESULT MESSAGE
// ============================================================

function showResult(text) {

    resultSection.classList.remove(
        "hidden"
    );

    resultElement.innerHTML = "";

    const card =
        document.createElement("div");

    card.className =
        "loading-card";

    card.textContent =
        text;

    resultElement.appendChild(
        card
    );

}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ============================================================
// CREATE LIST
// ============================================================

function createList(items) {

    if (
        !Array.isArray(items) ||
        items.length === 0
    ) {

        return `
            <p class="summary-text">
                Not specified
            </p>
        `;

    }


    return `
        <ol class="result-list">

            ${items
                .map(
                    item =>
                        `<li>${escapeHTML(item)}</li>`
                )
                .join("")}

        </ol>
    `;

}


// ============================================================
// SHOW STRUCTURED RESULT
// ============================================================

function showStructuredResult(data) {

    resultSection.classList.remove(
        "hidden"
    );


    const matchScore =
        data.match_score !== undefined &&
        data.match_score !== null
            ? data.match_score
            : "Not specified";


    resultElement.innerHTML = `

        <!-- ================================================
             JOB OVERVIEW
        ================================================= -->

        <div class="result-card">

            <h3 class="result-title">
                Job Overview
            </h3>


            <div class="overview-item">

                <span class="overview-label">
                    Job Title
                </span>

                <span class="overview-value">
                    ${escapeHTML(
                        data.job_title ||
                        "Not specified"
                    )}
                </span>

            </div>


            <div class="overview-item">

                <span class="overview-label">
                    Company
                </span>

                <span class="overview-value">
                    ${escapeHTML(
                        data.company ||
                        "Not specified"
                    )}
                </span>

            </div>


            <div class="overview-item">

                <span class="overview-label">
                    Location
                </span>

                <span class="overview-value">
                    ${escapeHTML(
                        data.location ||
                        "Not specified"
                    )}
                </span>

            </div>


            <div class="overview-item">

                <span class="overview-label">
                    Employment Type
                </span>

                <span class="overview-value">
                    ${escapeHTML(
                        data.employment_type ||
                        "Not specified"
                    )}
                </span>

            </div>


            <div class="overview-item">

                <span class="overview-label">
                    Experience
                </span>

                <span class="overview-value">
                    ${escapeHTML(
                        data.experience ||
                        "Not specified"
                    )}
                </span>

            </div>


            <div class="overview-item">

                <span class="overview-label">
                    Salary
                </span>

                <span class="overview-value">
                    ${escapeHTML(
                        data.salary ||
                        "Not specified"
                    )}
                </span>

            </div>


            <div class="overview-item">

                <span class="overview-label">
                    Match Score
                </span>

                <div class="match-score">

                    <span class="score-number">
                        ${escapeHTML(
                            matchScore
                        )}
                    </span>

                    <span class="score-text">
                        / 100
                    </span>

                </div>

            </div>

        </div>


        <!-- ================================================
             SUMMARY
        ================================================= -->

        <div class="result-card">

            <h3 class="result-title">
                Job Summary
            </h3>

            <p class="summary-text">

                ${escapeHTML(
                    data.summary ||
                    "Not specified"
                )}

            </p>

        </div>


        <!-- ================================================
             REQUIRED SKILLS
        ================================================= -->

        <div class="result-card">

            <h3 class="result-title">
                Required Skills
            </h3>

            ${createList(
                data.required_skills
            )}

        </div>


        <!-- ================================================
             RESPONSIBILITIES
        ================================================= -->

        <div class="result-card">

            <h3 class="result-title">
                Responsibilities
            </h3>

            ${createList(
                data.responsibilities
            )}

        </div>


        <!-- ================================================
             REQUIREMENTS
        ================================================= -->

        <div class="result-card">

            <h3 class="result-title">
                Candidate Requirements
            </h3>

            ${createList(
                data.requirements
            )}

        </div>


        <!-- ================================================
             INTERVIEW QUESTIONS
        ================================================= -->

        <div class="result-card">

            <h3 class="result-title">
                Likely Interview Questions
            </h3>

            ${
                Array.isArray(
                    data.interview_questions
                ) &&
                data.interview_questions.length > 0

                ?

                data.interview_questions
                    .map(
                        (question, index) => `
                            <div class="question-item">
                                <strong>
                                    ${index + 1}.
                                </strong>
                                ${escapeHTML(
                                    question
                                )}
                            </div>
                        `
                    )
                    .join("")

                :

                `
                    <p class="summary-text">
                        Not specified
                    </p>
                `
            }

        </div>


        <!-- ================================================
             PREPARATION TIPS
        ================================================= -->

        <div class="result-card">

            <h3 class="result-title">
                Preparation Tips
            </h3>

            ${createList(
                data.preparation_tips
            )}

        </div>

    `;


    setStatus(
        "Analysis Complete",
        "Job page analyzed successfully.",
        "ready"
    );

}


// ============================================================
// ANALYZE CURRENT PAGE
// ============================================================

extractBtn.addEventListener(
    "click",
    async () => {

        extractBtn.disabled = true;


        setStatus(
            "Analyzing...",
            "Reading the current webpage...",
            "loading"
        );


        showResult(
            "Reading the current webpage...\n\n" +
            "AI analysis will start shortly."
        );


        chrome.tabs.query(
            {
                active: true,
                currentWindow: true
            },
            (tabs) => {

                if (
                    chrome.runtime.lastError
                ) {

                    handleError(
                        chrome.runtime.lastError.message
                    );

                    return;

                }


                if (
                    !tabs ||
                    !tabs[0]
                ) {

                    handleError(
                        "Unable to access the current tab."
                    );

                    return;

                }


                const tabId =
                    tabs[0].id;


                // ==================================================
                // GET PAGE TEXT
                // ==================================================

                chrome.tabs.sendMessage(
                    tabId,
                    {
                        type: "EXTRACT_PAGE"
                    },
                    (response) => {

                        if (
                            chrome.runtime.lastError
                        ) {

                            handleError(
                                "Unable to read this page.\n\n" +
                                chrome.runtime.lastError.message
                            );

                            return;

                        }


                        if (
                            !response ||
                            !response.text
                        ) {

                            handleError(
                                "No readable content was found on this page."
                            );

                            return;

                        }


                        const pageText =
                            response.text.trim();


                        if (
                            pageText.length < 100
                        ) {

                            handleError(
                                "Not enough readable content was found on this webpage."
                            );

                            return;

                        }


                        // ==================================================
                        // SEND TO BACKGROUND
                        // ==================================================

                        setStatus(
                            "Analyzing...",
                            "AI is analyzing the job description...",
                            "loading"
                        );


                        showResult(
                            "Page extracted successfully.\n\n" +
                            "AI is analyzing the job description..."
                        );


                        chrome.runtime.sendMessage(
                            {
                                type:
                                    "ANALYZE_PAGE",

                                pageText:
                                    pageText
                            },
                            (aiResponse) => {

                                extractBtn.disabled =
                                    false;


                                if (
                                    chrome.runtime.lastError
                                ) {

                                    handleError(
                                        "AI connection error:\n\n" +
                                        chrome.runtime.lastError.message
                                    );

                                    return;

                                }


                                if (
                                    !aiResponse
                                ) {

                                    handleError(
                                        "No response received from AI."
                                    );

                                    return;

                                }


                                if (
                                    !aiResponse.success
                                ) {

                                    handleError(
                                        aiResponse.error ||
                                        "AI analysis failed."
                                    );

                                    return;

                                }


                                // ==========================================
                                // PARSE JSON
                                // ==========================================

                                try {

                                    let cleanText =
                                        aiResponse.text
                                            .trim();


                                    // Remove markdown fences

                                    cleanText =
                                        cleanText
                                            .replace(
                                                /^```json\s*/i,
                                                ""
                                            )
                                            .replace(
                                                /^```\s*/i,
                                                ""
                                            )
                                            .replace(
                                                /\s*```$/i,
                                                ""
                                            )
                                            .trim();


                                    const parsed =
                                        JSON.parse(
                                            cleanText
                                        );


                                    showStructuredResult(
                                        parsed
                                    );


                                } catch (
                                    parseError
                                ) {

                                    console.error(
                                        "JSON parsing error:",
                                        parseError
                                    );


                                    handleError(
                                        "AI returned an invalid structured response."
                                    );

                                }

                            }
                        );

                    }
                );

            }
        );

    }
);


// ============================================================
// ERROR HANDLER
// ============================================================

function handleError(message) {

    extractBtn.disabled = false;


    setStatus(
        "Error",
        "Unable to complete the analysis.",
        "error"
    );


    resultSection.classList.remove(
        "hidden"
    );


    resultElement.innerHTML = `

        <div class="error-card">

            ${escapeHTML(message)}

        </div>

    `;

}


// ============================================================
// CLEAR
// ============================================================

clearBtn.addEventListener(
    "click",
    () => {

        resultElement.innerHTML = "";

        resultSection.classList.add(
            "hidden"
        );


        setStatus(
            "Ready",
            "Analyze a job page...",
            "ready"
        );

    }
);


// ============================================================
// SETTINGS
// ============================================================

settingsBtn.addEventListener(
    "click",
    () => {

        chrome.runtime.openOptionsPage();

    }
);