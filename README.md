# Dual AI Chat 🤖💬

Watch two AI personalities engage in fascinating conversations on any topic! This interactive web application simulates conversations between two AI assistants with customizable personalities.

## 🌟 Features

- **Dual AI Conversation**: Watch two AI personalities discuss topics in real-time
- **Customizable Personas**: Choose from preset personalities or create your own
- **Character Limit Control**: Set message length limits to ensure complete responses
- **Beautiful UI**: Modern, responsive design with smooth animations
- **Real-time Status**: See when each AI is "thinking" or responding
- **Conversation Control**: Start, pause, stop, and clear conversations easily

## 🌐 Live Demo

Try it instantly in your browser:

👉 [**Launch Dual AI Chat**](https://mahdialaaaldin.github.io/DualAIChat/) 👈

No installation or setup required. Just open the link and enter your Gemini API key through the **API Settings** button to get started.

## 🚀 Quick Start

### Prerequisites

You'll need a Google Gemini API key. [Get one here](https://aistudio.google.com/app/apikey) (it's free!)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mahdialaaaldin/DualAIChat.git
   cd DualAIChat
   ```

2. **Open `index.html` in your web browser**

   The app runs entirely in your browser. No server is needed.

3. **Enter your Gemini API key**

   Click on the **API Settings** button in the interface. A popup will appear where you can paste your Gemini API key.

   Your key is stored securely in your browser's local storage and used only by this app.

## 🎮 How to Use

1. **Set up the AIs**:
   - Give each AI a name (default: Person1 and Person2)
   - Choose preset personalities or create custom ones
   - Select a conversation topic

2. **Configure the conversation**:
   - Set maximum turns (how many times each AI speaks)
   - Adjust character limit per message
   - Click "Start Conversation" to begin!

3. **Control the conversation**:
   - **Start/Pause**: Toggle the conversation flow
   - **Stop**: End the current conversation
   - **Clear**: Reset everything and start fresh
   - **+Add Turn**: Manually trigger one more exchange

## 🎭 Available Personalities

### AI 1 Presets:
- **Optimistic Tech Enthusiast**: Forward-thinking and excited about possibilities
- **Skeptical Analyst**: Critical thinker who examines risks and challenges
- **Creative Visionary**: Imaginative and explores "what if" scenarios
- **Logical Problem Solver**: Systematic and solution-oriented

### AI 2 Presets:
- **Philosophical Thinker**: Explores deep questions and abstract concepts
- **Practical Realist**: Focuses on feasible, actionable insights
- **Inquisitive Explorer**: Curious and asks probing questions
- **Witty Humorist**: Brings levity and clever observations

### Custom Personas:
Click "Custom" and write your own personality description!

## 🔧 Configuration Options

- **Character Limit**: 500-3000 characters per message (default: 1500)
- **Max Turns**: 2-20 conversation turns (default: 10)
- **Temperature**: Adjustable in code for response creativity

## 🛠️ Technical Details

- **API**: Google Gemini 2.0 Flash
- **Frontend**: Pure HTML, CSS, and JavaScript
- **No Dependencies**: Runs entirely in the browser
- **Responsive Design**: Works on desktop and mobile

## ⚠️ Important Security Note

**Never commit your API key to GitHub!** Consider these options:

1. **For personal use**: Add your key directly in the file but never commit it
2. **For sharing**: Use environment variables or prompt users for their key
3. **Add to `.gitignore`**: Create a config file that's not tracked

Example `.gitignore`:
```
config.js
*.key
.env
```

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 💡 Ideas for Enhancement

- [ ] Add more AI models (OpenAI, Anthropic, etc.)
- [ ] Save/load conversations
- [ ] Export conversation history
- [ ] Add voice synthesis
- [ ] Multi-language support
- [ ] Theme customization
- [ ] Group conversations (3+ AIs)

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Google Gemini API for powering the conversations
- The open-source community for inspiration

---

<p align="center">Made with ❤️ by Mahdi Alaa Aldin, for AI enthusiasts</p>

<p align="center">
  <a href="https://github.com/mahdialaaaldin/DualAIChat/issues">Report Bug</a>
  ·
  <a href="https://github.com/mahdialaaaldin/DualAIChat/issues">Request Feature</a>
</p>
