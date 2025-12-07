document.addEventListener('DOMContentLoaded', () => {
    const chatWindow = document.getElementById('chat-window');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');

    // Optional: Load chat history
    // For simplicity, we restart chat on reload, or you could implement loading 'tripplanner_ai_chat' here.

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userText = chatInput.value.trim();
        if (!userText) return;

        // Add User Message
        appendMessage('user', userText);
        chatInput.value = '';

        // Call Gemini
        getGeminiSuggestion(userText)
            .then(aiText => {
                appendMessage('ai', aiText);
            })
            .catch(err => {
                // Show the actual error message for debugging
                let errorMessage = `Error: ${err.message || 'Unknown error occurred'}`;

                // If it's a 404 model not found error, provide helpful guidance
                if (err.message && err.message.includes('404')) {
                    errorMessage += '\n\nYour API key may not have access to Gemini models. Please:\n1. Go to https://aistudio.google.com/app/apikey\n2. Delete your current key\n3. Create a new API key\n4. Update the key in scripts/main.js';
                }

                appendMessage('ai', errorMessage);
                console.error(err);
            });
    });

    function appendMessage(sender, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        // Basic Markdown-ish rendering: replace newlines with <br>
        msgDiv.innerHTML = text.replace(/\n/g, '<br>');
        chatWindow.appendChild(msgDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function getGeminiSuggestion(userMessage) {
        // Use Gemini 2.5 Flash (confirmed available)
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${CONFIG.GEMINI_API_KEY}`;

        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: userMessage }]
                }]
            })
        })
            .then(response => {
                if (!response.ok) {
                    // Try to get error text
                    return response.text().then(text => {
                        throw new Error(`Gemini API Error: ${response.status} - ${text}`);
                    });
                }
                return response.json();
            })
            .then(data => {
                // Extract text from Gemini response structure
                try {
                    const text = data.candidates[0].content.parts[0].text;
                    return text;
                } catch (e) {
                    throw new Error('Unexpected response format from Gemini');
                }
            });
    }
});
