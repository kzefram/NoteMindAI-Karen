document.addEventListener('DOMContentLoaded', function() {

    // function to clear note AI features content
    const clearAIFeaturesBtn = document.getElementById('clear-ai-features-btn');
    clearAIFeaturesBtn.addEventListener('click', function() {
        // Clears content of AI features editor
        quillAIFeatures.setContents([]);
    });

    // Add event listener for "New Note" button
    const newNoteButton = document.getElementById('new-note');
    if (newNoteButton) {
        // Event listener for the "New Note" button
        newNoteButton.addEventListener('click', function() {

            // Default data for a new note
            const newNoteData = {
                title: 'New Note Title',
                // format content to remove html tags
                content: stripHtml('New note content...'),
                categoryId: 1
            };
            
            // Check again for token before creating a new note
            if (!sessionStorage.getItem('token')) {
                alert('Your session has expired. Please log in again.');
                window.location.href = '/';
                return;
            }

            // POST request to create a new note
            fetch('/api/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                },
                body: JSON.stringify(newNoteData)
            })
            .then(handleResponse)
            .then(data => {
                console.log('Note created successfully', data);
                // returns the newly created note's ID
                const noteId = data.id;
                const newNoteAIFeatures = {
                    summary: stripHtml('New content...'),
                    noteId: noteId
                };

            // POST request to create new AI feature content using the newly created note's ID
            return fetch('/api/summaries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                },
                body: JSON.stringify(newNoteAIFeatures)
            })
            // Process the response from creating the AI features
            .then(handleResponse);
            })
            .then(summaryData => {
                console.log('AI Features created successfully', summaryData);
                // redirect user to new note's editing page
                window.location.href = `/editor?noteId=${summaryData.noteId}`;
            })
            .catch(error => {
                console.error('Error creating new note or AI features:', error);
            });
        });
    }

    // function to remove HTML tags 
    function stripHtml(html) {
        // Create a new div element
        var temporalDivElement = document.createElement("div");
        // Set the HTML content with the provided
        temporalDivElement.innerHTML = html;
        // Retrieve the text property of the element (cross-browser support)
        return temporalDivElement.textContent || temporalDivElement.innerText || "";
    }

    // function to handle response
    function handleResponse(response) {
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        return response.json();
    }

    // function to call OpenAI summary
    const summaryBtn = document.querySelector('.ai-feature-btn');
    summaryBtn.addEventListener('click', async function() {
        // Gets text content from Quill editor
        const noteContent = quill.getText();

        fetch('/api/ai-features/summarize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}` // Include this only if your route is protected
            },
            body: JSON.stringify({ content: noteContent })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not OK');
            }
            return response.json();
        })
        .then(data => {
            quillAIFeatures.setText(data.summary); // Assuming quillAIFeatures is your Quill instance for AI features
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

});