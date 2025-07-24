// Gemini AI Configuration
const GEMINI_API_KEY = 'YOUR_API_KEY_HERE';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`;

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

// DOM Elements
const chatMessages = document.getElementById('chatMessages');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const clearBtn = document.getElementById('clearBtn');
const addTurnBtn = document.getElementById('addTurnBtn');
const ai1Status = document.getElementById('ai1Status');
const ai1StatusText = document.getElementById('ai1StatusText');
const ai2Status = document.getElementById('ai2Status');
const ai2StatusText = document.getElementById('ai2StatusText');
const maxTurnsInput = document.getElementById('max-turns');
const topicInput = document.getElementById('topic');
const ai1NameInput = document.getElementById('ai1-name');
const ai2NameInput = document.getElementById('ai2-name');
const ai1PersonaSelect = document.getElementById('ai1-persona');
const ai2PersonaSelect = document.getElementById('ai2-persona');
const charLimitInput = document.getElementById('char-limit');

// Persona toggle elements
const ai1PresetBtn = document.getElementById('ai1-preset-btn');
const ai1CustomBtn = document.getElementById('ai1-custom-btn');
const ai1PresetContainer = document.getElementById('ai1-preset-container');
const ai1CustomContainer = document.getElementById('ai1-custom-container');
const ai1CustomPersona = document.getElementById('ai1-custom-persona');

const ai2PresetBtn = document.getElementById('ai2-preset-btn');
const ai2CustomBtn = document.getElementById('ai2-custom-btn');
const ai2PresetContainer = document.getElementById('ai2-preset-container');
const ai2CustomContainer = document.getElementById('ai2-custom-container');
const ai2CustomPersona = document.getElementById('ai2-custom-persona');

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
				<span class="message-icon">G</span>
				${ai1Name}
				<span class="message-char-count">74 chars</span>
			</div>
			Hello ${ai2Name}! I'm excited to have this conversation with you. How should we begin?
		</div>
		<div class="chat-message ai2">
			<div class="message-header">
				<span class="message-icon">C</span>
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
        messageDiv.innerHTML = `
			<div class="message-header">
				<span class="message-icon">${sender === 'ai1' ? 'G' : 'C'}</span>
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
				<span class="message-icon">${sender === 'ai1' ? 'G' : 'C'}</span>
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
    // Rough estimation: 1 token ≈ 4 characters
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

        if (!res.ok) throw new Error(`API request failed: ${res.status}`);

        const data = await res.json();
        let response = data.candidates[0].content.parts[0].text;

        // Enforce character limit on the response
        if (response.length > characterLimit) {
            // Find a good breaking point (end of sentence)
            const cutoff = characterLimit - 50; // Leave some buffer
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

    // Determine which AI's turn it is
    const sender = currentTurn % 2 === 0 ? 'ai1' : 'ai2';
    const otherSender = sender === 'ai1' ? 'ai2' : 'ai1';

    // Show typing indicator
    addChatMessage("", sender, true);

    // Create prompt based on conversation history
    let prompt = "";
    if (conversationHistory.length <= 2) {
        // First message
        prompt = `Start a conversation about ${topic}. Begin with a greeting and an opening question or statement. Remember to keep your response concise and under ${characterLimit} characters.`;
    } else {
        // Continue the conversation
        const lastMessage = conversationHistory[conversationHistory.length - 1].content;
        prompt = `Continue the conversation. The last message was: "${lastMessage}". Provide a thoughtful response that moves the discussion forward. Keep it under ${characterLimit} characters.`;
    }

    // Get AI response
    const response = await getAIResponse(sender, prompt);

    // Remove typing indicator and add actual response
    chatMessages.removeChild(chatMessages.lastChild);
    addChatMessage(response, sender);

    // Update conversation history
    conversationHistory.push({
        sender: sender,
        content: response
    });

    currentTurn++;

    // Continue conversation after a delay
    if (isConversationActive && currentTurn < maxTurns) {
        setTimeout(takeTurn, 1500);
    } else {
        isConversationActive = false;
        startBtn.textContent = "Start Conversation";
    }
}

// Start conversation
function startConversation() {
    if (isConversationActive) {
        isConversationActive = false;
        startBtn.textContent = "Start Conversation";
        return;
    }

    initConversation();
    isConversationActive = true;
    startBtn.textContent = "Pause Conversation";
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
    if (!isConversationActive) {
        startConversation();
    } else {
        takeTurn();
    }
}

// Event Listeners
startBtn.addEventListener('click', startConversation);
stopBtn.addEventListener('click', stopConversation);
clearBtn.addEventListener('click', clearConversation);
addTurnBtn.addEventListener('click', addOneTurn);

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

// Initialize
setupPersonaToggles();
initConversation();