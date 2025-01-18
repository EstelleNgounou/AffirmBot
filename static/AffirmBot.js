class Chat {
    constructor() {
        this.args = {
            chatBox: document.querySelector('.container'), // Correct selector for class
            sendButton: document.querySelector('.chatbox_send') // Correct selector for class
        };
        this.messages = [];
    }

    display() {
        const { chatBox, sendButton } = this.args;

        sendButton.addEventListener('click', () => this.onSendButton(chatBox));

        const node = chatBox.querySelector('input');
        node.addEventListener("keyup", ({ key }) => {
            if (key === "Enter") {
                this.onSendButton(chatBox); // Correct argument passed
            }
        });
    }

    onSendButton(chatBox) {
        var textField = this.args.chatBox.querySelector('input');
        let userMessage = textField.value.trim();
        if (userMessage === "") {
            return;
        }

        // Push the user's message to the messages array
        this.messages.push({ name: "User", message: userMessage });
        this.updateChat(chatBox);

        textField.value = ""; // Clear input field

        // Send the m3essage to Node.js backend (which is connected to Dialogflow)
        fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify( {message: userMessage}),
            mode: 'cors'

        })
        .then(r => r.json())
        .then(r => {
            let msg = { name: "AffirmBot", message: r.answer};
            this.messages.push(msg);
            this.updateChat(chatBox)
            textField.value = ''
        })
        .catch((error) =>{
            console.error('Error:', error);
            this.updateChat(chatBox);
            textField.value = '';
        })
        
    }        

    updateChat(chatBox) {
        const messagesContainer = chatBox.querySelector('.chatbox_messages'); // Correct class selector
        messagesContainer.innerHTML = ""; // Clear existing messages

        // Loop through the messages and display them
        this.messages.forEach(msg => {
            const element = document.createElement('div');
            element.className = msg.name === "User" ? "user-message" : "AffirmBot-message";
            element.textContent = msg.message;
            messagesContainer.appendChild(element);
        });

        messagesContainer.scrollTop = messagesContainer.scrollHeight; // Auto-scroll to the latest message
    }
}

// Create a new Chat instance and display the chat
const chat = new Chat();
chat.display();
