const apiKeyInput =
    document.getElementById("apiKey");

const saveBtn =
    document.getElementById("saveBtn");

const message =
    document.getElementById("message");


async function loadSettings() {

    const data =
        await chrome.storage.local.get(
            ["geminiApiKey"]
        );

    if (data.geminiApiKey) {

        apiKeyInput.value =
            data.geminiApiKey;

    }

}


saveBtn.addEventListener(
    "click",
    async () => {

        const apiKey =
            apiKeyInput.value.trim();


        if (!apiKey) {

            message.textContent =
                "Please enter your Gemini API key.";

            message.style.color =
                "#dc2626";

            return;
        }


        await chrome.storage.local.set({
            geminiApiKey: apiKey
        });


        message.textContent =
            "Settings saved successfully.";

        message.style.color =
            "#16a34a";

    }
);


loadSettings();