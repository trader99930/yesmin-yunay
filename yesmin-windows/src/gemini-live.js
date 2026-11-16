/**
 * Gemini Live & REST Voice Engine for Yesmin AI Assistant (Windows Desktop)
 */

class GeminiService {
  constructor(apiKey, options = {}) {
    this.apiKey = apiKey;
    this.voice = options.voice || 'Puck';
    this.personality = options.personality || 'friendly';
    this.assistantName = options.assistantName || 'Yesmin';
    this.userName = options.userName || 'Sir';
    this.model = options.model || 'models/gemini-2.0-flash';
    this.ws = null;
    this.isConnected = false;
  }

  getSystemInstruction() {
    return `You are Yesmin (यस्मिन), an ultra-intelligent, caring, and loyal AI companion and personal assistant for ${this.userName}.
You speak naturally, warmly, and concisely in Hindi / Hinglish and English.
You are running natively on ${this.userName}'s Windows laptop.
You have real-time audio interaction, vision perception, and system control abilities.
Personality: ${this.personality}.
Always respond affectionately and helpfully. Keep spoken replies crisp, natural, and conversational.`;
  }

  // REST API fallback for text queries or quick questions
  async generateTextReply(promptText) {
    if (!this.apiKey) {
      throw new Error('Gemini API key is not configured. Please open Settings.');
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`;
    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: promptText }]
        }
      ],
      systemInstruction: {
        parts: [{ text: this.getSystemInstruction() }]
      }
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API Error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return reply;
  }

  // Analyze an image (screen capture or webcam snapshot)
  async analyzeImage(base64Jpeg, userQuery = 'Describe what you see on my screen') {
    if (!this.apiKey) {
      throw new Error('Gemini API key is not configured.');
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`;
    const cleanBase64 = base64Jpeg.replace(/^data:image\/\w+;base64,/, '');

    const payload = {
      contents: [
        {
          role: 'user',
          parts: [
            { text: userQuery },
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: cleanBase64
              }
            }
          ]
        }
      ],
      systemInstruction: {
        parts: [{ text: this.getSystemInstruction() }]
      }
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini Vision Error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Vision AI.';
  }
}

module.exports = GeminiService;
