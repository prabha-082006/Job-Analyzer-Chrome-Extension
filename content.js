// ============================================================
// EXTRACT PAGE CONTENT
// ============================================================

chrome.runtime.onMessage.addListener(
    (
        message,
        sender,
        sendResponse
    ) => {

        if (
            message?.type !==
            "EXTRACT_PAGE"
        ) {

            return;

        }


        try {

            // ----------------------------------------------------
            // SELECTED TEXT FIRST
            // ----------------------------------------------------

            const selection =
                window
                    .getSelection()
                    ?.toString()
                    ?.trim();


            // ----------------------------------------------------
            // PAGE TEXT
            // ----------------------------------------------------

            let text =
                selection ||
                document.body?.innerText ||
                "";


            // ----------------------------------------------------
            // CLEAN TEXT
            // ----------------------------------------------------

            text =
                text
                    .replace(
                        /\s+/g,
                        " "
                    )
                    .trim();


            // ----------------------------------------------------
            // EMPTY PAGE
            // ----------------------------------------------------

            if (!text) {

                sendResponse({
                    text: ""
                });

                return;

            }


            // ----------------------------------------------------
            // LIMIT CONTENT SIZE
            // ----------------------------------------------------

            const maxLength =
                12000;


            if (
                text.length >
                maxLength
            ) {

                text =
                    text.substring(
                        0,
                        maxLength
                    ) +
                    "\n\n[Content truncated]";

            }


            // ----------------------------------------------------
            // RESPONSE
            // ----------------------------------------------------

            sendResponse({
                text: text
            });

        }

        catch (error) {

            console.error(
                "Page extraction error:",
                error
            );


            sendResponse({
                text: ""
            });

        }


        return true;

    }
);