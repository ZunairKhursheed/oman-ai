import { NextRequest, NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required and must be a string" },
        { status: 400 }
      );
    }

    let response: string;

    // Use OpenAI if API key is configured
    if (OPENAI_API_KEY) {
      try {
        const openaiResponse = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
              model: "gpt-3.5-turbo",
              messages: [
                {
                  role: "system",
                  content:
                    "You are a helpful voice assistant. Keep your responses concise and conversational, as they will be spoken aloud. Be friendly and natural.",
                },
                {
                  role: "user",
                  content: message,
                },
              ],
              temperature: 0.7,
              max_tokens: 150,
            }),
          }
        );

        if (openaiResponse.ok) {
          const data = await openaiResponse.json();
          response = data.choices[0].message.content;
        } else {
          // Fall back to simple responses if OpenAI fails
          response = generateAIResponse(message);
        }
      } catch (error) {
        console.error("OpenAI API error:", error);
        // Fall back to simple responses
        response = generateAIResponse(message);
      }
    } else {
      // Use simple response logic if OpenAI is not configured
      response = generateAIResponse(message);
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function generateAIResponse(message: string): string {
  // Simple response logic - replace with actual AI integration
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
    return "Hello! I'm your voice assistant. How can I help you today?";
  }

  if (lowerMessage.includes("weather")) {
    return "I'd be happy to help with weather information, but I don't have access to real-time weather data at the moment. You might want to check a weather app or website for current conditions.";
  }

  if (lowerMessage.includes("time")) {
    const now = new Date();
    return `The current time is ${now.toLocaleTimeString()}.`;
  }

  if (lowerMessage.includes("date")) {
    const now = new Date();
    return `Today's date is ${now.toLocaleDateString()}.`;
  }

  if (lowerMessage.includes("help")) {
    return "I'm here to assist you! You can ask me about the time, date, or just have a conversation. I can respond with voice or text. What would you like to know?";
  }

  if (lowerMessage.includes("thank")) {
    return "You're welcome! Is there anything else I can help you with?";
  }

  if (lowerMessage.includes("bye") || lowerMessage.includes("goodbye")) {
    return "Goodbye! It was nice talking with you. Have a great day!";
  }

  // Default responses for general conversation
  const responses = [
    "That's interesting! Tell me more about that.",
    "I understand. How can I help you with that?",
    "Thanks for sharing that with me. What else would you like to discuss?",
    "I see. Is there something specific you'd like to know or talk about?",
    "That's a good point. What are your thoughts on that?",
    "I appreciate you telling me that. How can I assist you further?",
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}
