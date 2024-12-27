document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('slider');
    const sliderValue = document.getElementById('sliderValue');
    const questionInput = document.getElementById('question');
    const submitButton = document.getElementById('submit');
    const clearButton = document.getElementById('clear-question');
    const responseContainer = document.getElementById('responseContainer');
    const loadingAnimation = document.getElementById('loadingMessage');
    const errorMessage = document.getElementById('errorMessage');

    // Update slider value display
    slider.addEventListener('input', () => {
        sliderValue.textContent = slider.value;
    });

    // Clear input field
    clearButton.addEventListener('click', () => {
        questionInput.value = '';
        errorMessage.classList.add('hidden');
    });

    // Function to display loading animation
    const showLoading = () => {
        loadingAnimation.style.display = 'flex';
        responseContainer.classList.add('hidden');
    };

    // Function to hide loading animation
    const hideLoading = () => {
        loadingAnimation.style.display = 'none';
    };

    // Function to display an error message
    const displayError = (message) => {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    };

    // Function to display the API response
    const displayResponse = (answer, documents) => {
        responseContainer.innerHTML = `
            <div class="answer-section">
                <h2>Answer:</h2>
                <p>${answer}</p>
                <h3>Relevant Documents:</h3>
                <ul>
                    ${documents.map(doc => `<li>${doc}</li>`).join('')}
                </ul>
            </div>
        `;
        responseContainer.classList.remove('hidden');
    };

    // Handle submit button click
    submitButton.addEventListener('click', async () => {
        const question = questionInput.value.trim();
        const numResponses = slider.value;

        // Validate input
        if (!question) {
            displayError('You must enter a question before submitting.');
            return;
        }

        // Reset UI and show loading
        errorMessage.classList.add('hidden');
        showLoading();

        try {
            // Make API call
            const response = await fetch('http://192.168.1.29:8001/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question,
                    num_responses: parseInt(numResponses, 10),
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch responses: ${response.statusText}`);
            }

            const data = await response.json();

            if (!data.Answer || !data.RelevantDocuments) {
                throw new Error('Invalid response format received.');
            }

            // Display response
            displayResponse(data.Answer || 'No answer available.', data.RelevantDocuments || []);
        } catch (error) {
            console.error('Error:', error);
            responseContainer.innerHTML = `<p style="color: red;">Error fetching responses: ${error.message}. Please try again later.</p>`;
            responseContainer.classList.remove('hidden');
        } finally {
            hideLoading();
        }
    });
});
