const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/", async (req, res) => {
  const { message, conversationHistory } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: "Message content cannot be empty." });
  }

  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.API_KEY ||
    process.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === "" || apiKey.includes("placeholder")) {
    return res.status(500).json({
      error: "Gemini API Key is missing or invalid.",
      reply: "Sorry, my AI capabilities are currently offline. Please configure a valid Gemini API key in the server.",
    });
  }

  // Build conversation context
  let historyText = "";
  if (conversationHistory && Array.isArray(conversationHistory)) {
    conversationHistory.slice(-5).forEach((msg) => {
      historyText += `${msg.type === "user" ? "User" : "BharatDarshi Guide"}: ${msg.content}\n`;
    });
  }

  const systemPrompt = `You are the 'BharatDarshi AI Guide', an expert and friendly AI companion for exploring India.
Your goal is to assist users with their queries regarding India's culture, history, temples, tourism, and travel tips.
Always be polite, welcoming, and deeply knowledgeable about Indian heritage.

Recent Conversation History:
${historyText}

User's New Message: ${message}

Respond directly to the user's new message as the BharatDarshi AI Guide.`;

  try {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey.trim()}`;
    
    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: systemPrompt }] }] }),
    });

    if (!response.ok) {
      console.error("Gemini Chat API HTTP Error:", response.status, await response.text());
      return res.status(502).json({
        error: `Gemini API returned error status ${response.status}`,
        reply: "Sorry, I encountered an issue connecting to my brain. Please try again later.",
      });
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      return res.status(500).json({
        error: "Empty response from Gemini API.",
        reply: "I couldn't formulate a response right now. Please ask another question.",
      });
    }

    return res.json({
      reply: candidateText.trim(),
      success: true,
    });
  } catch (error) {
    console.error("[Gemini Chatbot Integration Error]:", error.message);
    return res.status(502).json({
      error: `Failed to communicate with AI endpoint (${error.message})`,
      reply: "My AI services are currently unreachable. Please try again.",
    });
  }
});

module.exports = router;
