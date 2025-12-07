document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const statusMsg = document.getElementById('contact-status');

    contactForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Reset status
        statusMsg.textContent = 'Sending...';
        statusMsg.style.color = 'var(--text-color)';

        const name = document.getElementById('contact-name').value.trim();
        const surname = document.getElementById('contact-surname').value.trim();
        const email = document.getElementById('contact-email').value.trim();
        const message = document.getElementById('contact-message').value.trim();

        if (!name || !surname || !email || !message) {
            statusMsg.textContent = 'Please fill in all fields.';
            statusMsg.style.color = '#ef4444';
            return;
        }

        // Basic email validation
        if (!email.includes('@')) {
            statusMsg.textContent = 'Please enter a valid email address.';
            statusMsg.style.color = '#ef4444';
            return;
        }

        // 1. Payload for the Team
        const teamPayload = {
            service_id: CONFIG.EMAILJS_SERVICE_ID,
            template_id: CONFIG.EMAILJS_TEMPLATE_TEAM_ID,
            user_id: CONFIG.EMAILJS_PUBLIC_KEY,
            template_params: {
                from_name: `${name} ${surname}`,
                from_email: email,
                message: message
            }
        };

        // 2. Payload for the Client (Auto-reply)
        // Note: Variable names must match EmailJS template placeholders
        const clientPayload = {
            service_id: CONFIG.EMAILJS_SERVICE_ID,
            template_id: CONFIG.EMAILJS_TEMPLATE_CLIENT_ID,
            user_id: CONFIG.EMAILJS_PUBLIC_KEY,
            template_params: {
                name: `${name} ${surname}`,
                email: email, // Matches {{email}} in the template's "To Email" field
                message: message
            }
        };

        // Send both requests concurrently
        const sendTeamEmail = fetch(CONFIG.EMAILJS_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(teamPayload)
        });

        const sendClientEmail = fetch(CONFIG.EMAILJS_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(clientPayload)
        });

        Promise.all([sendTeamEmail, sendClientEmail])
            .then(async ([teamRes, clientRes]) => {
                // Check if both succeeded
                if (teamRes.ok && clientRes.ok) {
                    statusMsg.textContent = 'We have received your concerns. A confirmation email has been sent to you.';
                    statusMsg.style.color = 'var(--secondary-color)';
                    contactForm.reset();
                } else {
                    // Try to extract error text from whichever failed
                    let errorText = 'Failed to send one or more emails.';
                    if (!teamRes.ok) errorText += ` (Team: ${await teamRes.text()})`;
                    if (!clientRes.ok) errorText += ` (Client: ${await clientRes.text()})`;
                    throw new Error(errorText);
                }
            })
            .catch(error => {
                console.error('EmailJS Error:', error);
                statusMsg.textContent = `Error: ${error.message || 'Unknown error'}. (Check console for details)`;
                statusMsg.style.color = '#ef4444';
            });
    });
});
