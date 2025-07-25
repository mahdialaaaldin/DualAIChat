// Gemini AI Configuration
let GEMINI_API_KEY = '';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`;

// API Key Management
function initializeAPIKey() {
    GEMINI_API_KEY = localStorage.getItem('gemini_api_key') || '';

    if (!GEMINI_API_KEY) {
        showAPIKeyModal();
        return false;
    }
    return true;
}

// Show API Key Modal
function showAPIKeyModal() {
    const modalHTML = `
        <div id="apiKeyModal" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        ">
            <div style="
                background: white;
                padding: 30px;
                border-radius: 15px;
                max-width: 500px;
                width: 90%;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            ">
                <h2 style="margin-top: 0; color: #4a5c2f;">Welcome to Dual AI Chat! 🤖</h2>
                <p>To start conversations, you'll need a Google Gemini API key.</p>
                <p style="margin-bottom: 20px;">
                    <a href="https://aistudio.google.com/app/apikey" target="_blank" style="color: #4a5c2f;">
                        Get your free API key here →
                    </a>
                </p>
                <input type="password" id="apiKeyInput" placeholder="Enter your Gemini API key" style="
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    font-size: 16px;
                    margin-bottom: 10px;
                    box-sizing: border-box;
                ">
                <div style="display: flex; gap: 10px; margin-top: 20px;">
                    <button onclick="saveAPIKey()" style="
                        flex: 1;
                        padding: 12px;
                        background: linear-gradient(45deg, #4a5c2f, #5f7a3d);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-weight: bold;
                        cursor: pointer;
                        font-size: 16px;
                    ">Save & Continue</button>
                </div>
                <p style="margin-top: 15px; font-size: 12px; color: #666;">
                    Your API key is stored locally in your browser and never sent to our servers.
                </p>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById('apiKeyInput').focus();

    // Allow Enter key to save
    document.getElementById('apiKeyInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') saveAPIKey();
    });
}

// Save API Key
function saveAPIKey() {
    const apiKeyInput = document.getElementById('apiKeyInput');
    const apiKey = apiKeyInput.value.trim();

    if (!apiKey) {
        alert('Please enter a valid API key');
        return;
    }

    // Basic validation - Gemini keys usually start with "AIza"
    if (!apiKey.startsWith('AIza') || apiKey.length < 30) {
        if (!confirm('This doesn\'t look like a valid Gemini API key. Save anyway?')) {
            return;
        }
    }

    GEMINI_API_KEY = apiKey;
    localStorage.setItem('gemini_api_key', apiKey);

    // Remove modal
    document.getElementById('apiKeyModal').remove();

    // Show success message
    showToast('API key saved successfully! You can now start conversations.');
}

// Show toast notification
function showToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #4a5c2f;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        z-index: 10001;
        animation: slideIn 0.3s ease;
    `;
    toast.textContent = message;

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        toast.style.animationFillMode = 'forwards';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Conversation state
let conversationHistory = [];
let isConversationActive = false;
let currentTurn = 0;
let maxTurns = 10;
let ai1Persona = "optimistic";
let ai2Persona = "philosophical";
let ai1UseCustom = false;
let ai2UseCustom = false;
let characterLimit = 1500;

// DOM Elements (initialize after DOM loads)
let chatMessages, startBtn, stopBtn, clearBtn, settingsBtn, addTurnBtn;
let ai1Status, ai1StatusText, ai2Status, ai2StatusText;
let maxTurnsInput, topicInput, ai1NameInput, ai2NameInput;
let ai1PersonaSelect, ai2PersonaSelect, charLimitInput;
let ai1PresetBtn, ai1CustomBtn, ai1PresetContainer, ai1CustomContainer, ai1CustomPersona;
let ai2PresetBtn, ai2CustomBtn, ai2PresetContainer, ai2CustomContainer, ai2CustomPersona;

// Persona configurations
const personas = {
    optimistic: {
        name: "Optimistic Tech Enthusiast",
        context: "You are an optimistic technology enthusiast. You believe in the positive potential of technology to transform society. You're excited about the future and focus on opportunities rather than risks. Your responses are enthusiastic and forward-looking."
    },
    skeptical: {
        name: "Skeptical Analyst",
        context: "You are a skeptical analyst. You critically examine claims and focus on potential risks and challenges. You value evidence-based reasoning and often play devil's advocate. Your responses are measured and analytical."
    },
    creative: {
        name: "Creative Visionary",
        context: "You are a creative visionary. You think outside the box and imagine bold, innovative possibilities. You're not constrained by current limitations and enjoy exploring 'what if' scenarios. Your responses are imaginative and thought-provoking."
    },
    logical: {
        name: "Logical Problem Solver",
        context: "You are a logical problem solver. You approach topics systematically, breaking down complex issues into manageable parts. You prioritize reason and evidence over emotion. Your responses are structured and solution-oriented."
    },
    philosophical: {
        name: "Philosophical Thinker",
        context: "You are a philosophical thinker. You explore deep questions about meaning, ethics, and the human condition. You consider multiple perspectives and enjoy examining abstract concepts. Your responses are reflective and nuanced."
    },
    practical: {
        name: "Practical Realist",
        context: "You are a practical realist. You focus on what's feasible and grounded in reality. You're solution-oriented and prioritize actionable insights over theoretical discussions. Your responses are straightforward and pragmatic."
    },
    curious: {
        name: "Inquisitive Explorer",
        context: "You are an inquisitive explorer. You're driven by curiosity and enjoy asking probing questions. You value learning and discovering new perspectives. Your responses often include follow-up questions and show genuine interest."
    },
    humorous: {
        name: "Witty Humorist",
        context: "You are a witty humorist. You approach conversations with lightheartedness and clever wit. You enjoy wordplay and finding humor in situations without being disrespectful. Your responses are engaging and entertaining."
    }
};

// Initialize DOM elements
function initializeDOMElements() {
    chatMessages = document.getElementById('chatMessages');
    startBtn = document.getElementById('startBtn');
    stopBtn = document.getElementById('stopBtn');
    clearBtn = document.getElementById('clearBtn');
    settingsBtn = document.getElementById('settingsBtn');
    addTurnBtn = document.getElementById('addTurnBtn');
    ai1Status = document.getElementById('ai1Status');
    ai1StatusText = document.getElementById('ai1StatusText');
    ai2Status = document.getElementById('ai2Status');
    ai2StatusText = document.getElementById('ai2StatusText');
    maxTurnsInput = document.getElementById('max-turns');
    topicInput = document.getElementById('topic');
    ai1NameInput = document.getElementById('ai1-name');
    ai2NameInput = document.getElementById('ai2-name');
    ai1PersonaSelect = document.getElementById('ai1-persona');
    ai2PersonaSelect = document.getElementById('ai2-persona');
    charLimitInput = document.getElementById('char-limit');

    // Persona toggle elements
    ai1PresetBtn = document.getElementById('ai1-preset-btn');
    ai1CustomBtn = document.getElementById('ai1-custom-btn');
    ai1PresetContainer = document.getElementById('ai1-preset-container');
    ai1CustomContainer = document.getElementById('ai1-custom-container');
    ai1CustomPersona = document.getElementById('ai1-custom-persona');

    ai2PresetBtn = document.getElementById('ai2-preset-btn');
    ai2CustomBtn = document.getElementById('ai2-custom-btn');
    ai2PresetContainer = document.getElementById('ai2-preset-container');
    ai2CustomContainer = document.getElementById('ai2-custom-container');
    ai2CustomPersona = document.getElementById('ai2-custom-persona');
}

// Toggle functions for persona selection
function setupPersonaToggles() {
    ai1PresetBtn.addEventListener('click', () => {
        ai1UseCustom = false;
        ai1PresetBtn.classList.add('active');
        ai1CustomBtn.classList.remove('active');
        ai1PresetContainer.style.display = 'block';
        ai1CustomContainer.style.display = 'none';
    });

    ai1CustomBtn.addEventListener('click', () => {
        ai1UseCustom = true;
        ai1CustomBtn.classList.add('active');
        ai1PresetBtn.classList.remove('active');
        ai1CustomContainer.style.display = 'block';
        ai1PresetContainer.style.display = 'none';
    });

    ai2PresetBtn.addEventListener('click', () => {
        ai2UseCustom = false;
        ai2PresetBtn.classList.add('active');
        ai2CustomBtn.classList.remove('active');
        ai2PresetContainer.style.display = 'block';
        ai2CustomContainer.style.display = 'none';
    });

    ai2CustomBtn.addEventListener('click', () => {
        ai2UseCustom = true;
        ai2CustomBtn.classList.add('active');
        ai2PresetBtn.classList.remove('active');
        ai2CustomContainer.style.display = 'block';
        ai2PresetContainer.style.display = 'none';
    });
}

// Get persona context
function getPersonaContext(isAI1) {
    if (isAI1) {
        if (ai1UseCustom) {
            const customText = ai1CustomPersona.value.trim();
            return customText || "You are a conversational AI assistant.";
        } else {
            return personas[ai1Persona].context;
        }
    } else {
        if (ai2UseCustom) {
            const customText = ai2CustomPersona.value.trim();
            return customText || "You are a conversational AI assistant.";
        } else {
            return personas[ai2Persona].context;
        }
    }
}

// Get persona name
function getPersonaName(isAI1) {
    if (isAI1) {
        if (ai1UseCustom) {
            return "Custom Persona";
        } else {
            return personas[ai1Persona].name;
        }
    } else {
        if (ai2UseCustom) {
            return "Custom Persona";
        } else {
            return personas[ai2Persona].name;
        }
    }
}

// Initialize conversation
function initConversation() {
    const ai1Name = ai1NameInput.value || "Person1";
    const ai2Name = ai2NameInput.value || "Person2";
    const topic = topicInput.value || "the future of artificial intelligence";

    conversationHistory = [
        {
            role: "system",
            content: `You are ${ai1Name}, an AI assistant with a ${getPersonaName(true)} personality. 
            You are having a conversation with ${ai2Name}, who has a ${getPersonaName(false)} personality.
            You're discussing: ${topic}. ${getPersonaContext(true)}`
        },
        {
            role: "system",
            content: `You are ${ai2Name}, an AI assistant with a ${getPersonaName(false)} personality. 
            You are having a conversation with ${ai1Name}, who has a ${getPersonaName(true)} personality.
            You're discussing: ${topic}. ${getPersonaContext(false)}`
        }
    ];

    maxTurns = parseInt(maxTurnsInput.value) || 10;
    characterLimit = parseInt(charLimitInput.value) || 1500;
    currentTurn = 0;

    // Clear chat messages except the initial two
    chatMessages.innerHTML = `
        <div class="chat-message ai1">
            <div class="message-header">
                <span class="message-icon">1</span>
                ${ai1Name}
                <span class="message-char-count">74 chars</span>
            </div>
            Hello ${ai2Name}! I'm excited to have this conversation with you. How should we begin?
        </div>
        <div class="chat-message ai2">
            <div class="message-header">
                <span class="message-icon">2</span>
                ${ai2Name}
                <span class="message-char-count">118 chars</span>
            </div>
            Greetings ${ai1Name}! I'm looking forward to our discussion. Shall we explore the topic of ${topic}?
        </div>
    `;
}

// Add a message to the chat
function addChatMessage(content, sender, isTyping = false) {
    const ai1Name = ai1NameInput.value || "Person1";
    const ai2Name = ai2NameInput.value || "Person2";

    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;

    if (isTyping) {
        messageDiv.classList.add('typing-indicator');
        messageDiv.innerHTML = `
            <div class="message-header">
                <span class="message-icon">${sender === 'ai1' ? '1' : '2'}</span>
                ${sender === 'ai1' ? ai1Name : ai2Name}
            </div>
            <div class="typing-dots">
                <span></span><span></span><span></span>
            </div>
        `;
    } else {
        const charCount = content.length;
        const formattedContent = content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');

        messageDiv.innerHTML = `
            <div class="message-header">
                <span class="message-icon">${sender === 'ai1' ? '1' : '2'}</span>
                ${sender === 'ai1' ? ai1Name : ai2Name}
                <span class="message-char-count">${charCount} chars</span>
            </div>
            ${formattedContent}
        `;
    }

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Update status indicators
    if (sender === 'ai1') {
        ai1Status.className = "status-dot active";
        ai1StatusText.textContent = `${ai1Name}: Thinking...`;
        setTimeout(() => {
            if (!isConversationActive) return;
            ai1Status.className = "status-dot inactive";
            ai1StatusText.textContent = `${ai1Name}: Inactive`;
        }, 1000);
    } else {
        ai2Status.className = "status-dot active";
        ai2StatusText.textContent = `${ai2Name}: Thinking...`;
        setTimeout(() => {
            if (!isConversationActive) return;
            ai2Status.className = "status-dot inactive";
            ai2StatusText.textContent = `${ai2Name}: Inactive`;
        }, 1000);
    }
}

// Get AI response
async function getAIResponse(sender, prompt) {
    const ai1Name = ai1NameInput.value || "Person1";
    const ai2Name = ai2NameInput.value || "Person2";

    const currentPersonaContext = sender === 'ai1' ?
        getPersonaContext(true) : getPersonaContext(false);

    const otherAI = sender === 'ai1' ? ai2Name : ai1Name;

    // Calculate approximate token count based on character limit
    const maxTokens = Math.floor(characterLimit / 4);

    const context = `You are ${sender === 'ai1' ? ai1Name : ai2Name}. 
        ${currentPersonaContext}
        
        IMPORTANT: Keep your response under ${characterLimit} characters to ensure it's not cut off.
        
        Current conversation:
        ${conversationHistory.slice(2).map(msg => `${msg.sender === 'ai1' ? ai1Name : ai2Name}: ${msg.content}`).join('\n')}
        
        ${sender === 'ai1' ? ai1Name : ai2Name}:`;

    const body = {
        contents: [{ parts: [{ text: context + prompt }] }],
        generationConfig: {
            temperature: sender === 'ai1' ? 0.7 : 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: maxTokens,
            candidateCount: 1
        }
    };

    try {
        const res = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            if (res.status === 401 || res.status === 403) {
                throw new Error('Invalid API key. Please check your settings.');
            }
            throw new Error(`API request failed: ${res.status}`);
        }

        const data = await res.json();
        let response = data.candidates[0].content.parts[0].text;

        // Enforce character limit on the response
        if (response.length > characterLimit) {
            const cutoff = characterLimit - 50;
            const lastPeriod = response.lastIndexOf('.', cutoff);
            const lastQuestion = response.lastIndexOf('?', cutoff);
            const lastExclamation = response.lastIndexOf('!', cutoff);

            const breakPoint = Math.max(lastPeriod, lastQuestion, lastExclamation);

            if (breakPoint > characterLimit * 0.7) {
                response = response.substring(0, breakPoint + 1);
            } else {
                response = response.substring(0, cutoff) + "...";
            }
        }

        return response;
    } catch (error) {
        console.error('Gemini API Error:', error);
        if (error.message.includes('Invalid API key')) {
            showToast('Invalid API key. Please update it in settings.', 5000);
            showAPIKeyModal();
        }
        return "I encountered an error processing your request. Could you try again?";
    }
}

// Take a conversation turn
async function takeTurn() {
    if (!isConversationActive || currentTurn >= maxTurns) {
        isConversationActive = false;
        startBtn.textContent = "Start Conversation";
        return;
    }

    const ai1Name = ai1NameInput.value || "Person1";
    const ai2Name = ai2NameInput.value || "Person2";
    const topic = topicInput.value || "the future of artificial intelligence";

    const sender = currentTurn % 2 === 0 ? 'ai1' : 'ai2';

    // Show typing indicator
    addChatMessage("", sender, true);

    let prompt = "";
    if (conversationHistory.length <= 2) {
        prompt = `Start a conversation about ${topic}. Begin with a greeting and an opening question or statement. Remember to keep your response concise and under ${characterLimit} characters.`;
    } else {
        const lastMessage = conversationHistory[conversationHistory.length - 1].content;
        prompt = `Continue the conversation. The last message was: "${lastMessage}". Provide a thoughtful response that moves the discussion forward. Keep it under ${characterLimit} characters.`;
    }

    const response = await getAIResponse(sender, prompt);

    // Remove typing indicator and add actual response
    chatMessages.removeChild(chatMessages.lastChild);
    addChatMessage(response, sender);

    conversationHistory.push({
        sender: sender,
        content: response
    });

    currentTurn++;

    if (isConversationActive && currentTurn < maxTurns) {
        setTimeout(takeTurn, 1500);
    } else {
        isConversationActive = false;
        startBtn.textContent = "Start Conversation";
    }
}

// Start conversation
function startConversation() {
    if (!initializeAPIKey()) {
        return;
    }

    if (isConversationActive) {
        isConversationActive = false;
        startBtn.textContent = "Start Conversation";
        return;
    }

    initConversation();
    isConversationActive = true;
    startBtn.textContent = "Stop Conversation";
    takeTurn();
}

// Stop conversation
function stopConversation() {
    isConversationActive = false;
    startBtn.textContent = "Start Conversation";
}

// Clear conversation
function clearConversation() {
    stopConversation();
    initConversation();
}

// Add one turn to the conversation
function addOneTurn() {
    if (!initializeAPIKey()) {
        return;
    }

    if (!isConversationActive) {
        startConversation();
    } else {
        takeTurn();
    }
}

// Settings dialog
function showSettings() {
    const currentKey = GEMINI_API_KEY;
    const modalHTML = `
        <div id="settingsModal" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        ">
            <div style="
                background: white;
                padding: 30px;
                border-radius: 15px;
                max-width: 500px;
                width: 90%;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            ">
                <h2 style="margin-top: 0; color: #4a5c2f;">API Settings</h2>
                <p>Current key: ${currentKey ? currentKey.substring(0, 10) + '...' : 'Not set'}</p>
                <input type="password" id="newApiKeyInput" placeholder="Enter new API key (leave blank to keep current)" style="
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    font-size: 16px;
                    margin-bottom: 10px;
                    box-sizing: border-box;
                ">
                <div style="display: flex; gap: 10px; margin-top: 20px;">
                    <button onclick="updateAPIKey()" style="
                        flex: 1;
                        padding: 12px;
                        background: linear-gradient(45deg, #4a5c2f, #5f7a3d);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-weight: bold;
                        cursor: pointer;
                        font-size: 16px;
                    ">Update</button>
                    <button onclick="document.getElementById('settingsModal').remove()" style="
                        flex: 1;
                        padding: 12px;
                        background: linear-gradient(45deg, #7f8c8d, #95a5a6);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-weight: bold;
                        cursor: pointer;
                        font-size: 16px;
                    ">Cancel</button>
                </div>
                <button onclick="removeAPIKey()" style="
                    width: 100%;
                    padding: 12px;
                    background: linear-gradient(45deg, #c0392b, #e74c3c);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: bold;
                    cursor: pointer;
                    font-size: 16px;
                    margin-top: 10px;
                ">Remove API Key</button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Update API Key
function updateAPIKey() {
    const newKeyInput = document.getElementById('newApiKeyInput');
    const newKey = newKeyInput.value.trim();

    if (newKey) {
        GEMINI_API_KEY = newKey;
        localStorage.setItem('gemini_api_key', newKey);
        showToast('API key updated successfully!');
    }

    document.getElementById('settingsModal').remove();
}

// Remove API Key
function removeAPIKey() {
    if (confirm('Are you sure you want to remove the API key?')) {
        localStorage.removeItem('gemini_api_key');
        GEMINI_API_KEY = '';
        document.getElementById('settingsModal').remove();
        showToast('API key removed.');
        showAPIKeyModal();
    }
}

// Initialize app when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    initializeDOMElements();
    setupEventListeners();
    setupPersonaToggles();
    initializeAPIKey();
    initConversation();
});

// Set up all event listeners
function setupEventListeners() {
    startBtn.addEventListener('click', startConversation);
    stopBtn.addEventListener('click', stopConversation);
    clearBtn.addEventListener('click', clearConversation);
    addTurnBtn.addEventListener('click', addOneTurn);
    settingsBtn.addEventListener('click', showSettings);

    // Update personas when selection changes
    ai1PersonaSelect.addEventListener('change', (e) => {
        ai1Persona = e.target.value;
        if (isConversationActive) {
            initConversation();
        }
    });

    ai2PersonaSelect.addEventListener('change', (e) => {
        ai2Persona = e.target.value;
        if (isConversationActive) {
            initConversation();
        }
    });

    // Update character limit
    charLimitInput.addEventListener('change', (e) => {
        characterLimit = parseInt(e.target.value) || 1500;
    });
}