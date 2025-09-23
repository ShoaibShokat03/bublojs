import {
  H1,
  H2,
  H3,
  P,
  Div,
  A,
  Section,
  Ul,
  Li,
  Button,
  Span,
  Input,
  Textarea,
  H4,
} from "../../modules/html.js";
import { useState, useEffect } from "../../modules/hooks.js";
import Config from "../../config/config.js";

export default function Ai() {
  console.log("Ai component rendering...");

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      content:
        "Hello! I'm your BUBLOJS AI assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

   console.log(
     "Messages state:",
     messages,
     "Type:",
     typeof messages,
     "Is Array:",
     Array.isArray(messages)
   );

   // Auto-open sidebar when there are messages
   useEffect(() => {
    //  if (messages.length > 1) {
    //    setIsSidebarOpen(true);
    //  }
   }, [messages.length]);

  // Debug: Check if messages is an array
  if (!Array.isArray(messages)) {
    console.error("Messages is not an array:", messages);
    return Div({}, "Error: Messages state is not properly initialized");
  }
   const askGemini = async (question) => {
     if (!question.trim()) return;

     // Add user message
     const userMessage = {
       id: Date.now(),
       type: "user",
       content: question,
       timestamp: new Date(),
     };
     setMessages(prev => [...prev, userMessage]);

     setIsLoading(true);
     setIsSidebarOpen(true);

    try {
      const response = await fetch(Config.gemini.endpoints.generateContent(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": Config.gemini.apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a helpful assistant for BUBLOJS, a vanilla JavaScript SPA framework. Answer this question about BUBLOJS: ${question}. Keep the answer concise, helpful, and focused on BUBLOJS features and capabilities. Use markdown formatting when appropriate for code examples, lists, and emphasis.`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: Config.gemini.temperature,
            maxOutputTokens: Config.gemini.maxTokens,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from Gemini");
      }

      const data = await response.json();
      const answer =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't generate an answer. Please try again.";

       // Add AI response
       const aiMessage = {
         id: Date.now() + 1,
         type: "ai",
         content: answer,
         timestamp: new Date(),
       };
       setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      const errorMessage = {
        id: Date.now() + 1,
        type: "ai",
        content:
          "Sorry, I'm having trouble connecting to the AI assistant. Please check your internet connection and try again.",
        timestamp: new Date(),
      };
       setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

   const handleSubmit = (e) => {
     if (e && e.preventDefault) {
       e.preventDefault();
     }
     if (inputMessage.trim()) {
       askGemini(inputMessage);
       setInputMessage("");
     }
   };

  const formatMessage = (content) => {
    // For now, return plain text - markdown support can be added later
    return content;
  };

  return Div(
    {},
    // AI Assistant Floating Button
    Button(
      {
        class: "ai-floating-btn",
        onclick: () => setIsSidebarOpen(true),
      },
      Span({ class: "ai-icon" }, "🤖"),
      Span({ class: "ai-text" }, "Chat AI")
    ),

    // AI Chat Sidebar Modal
    Div(
      { class: `ai-sidebar-overlay ${isSidebarOpen ? "active" : ""}` },
      Div(
        { class: `ai-chat-modal ${isSidebarOpen ? "active" : ""}` },

        // Chat Header
        Div(
          { class: "chat-header" },
          Div(
            { class: "chat-header-info" },
            Div({ class: "chat-avatar" }, "🤖"),
            Div(
              { class: "chat-header-text" },
              H3({ class: "chat-title" }, "BUBLOJS AI Assistant"),
              P({ class: "chat-subtitle" }, "Powered by Gemini Flash")
            )
          ),
          Button(
            {
              class: "chat-close-btn",
              onclick: () => setIsSidebarOpen(false),
            },
            "×"
          )
        ),

        // Chat Messages
        Div(
          { class: "chat-messages" },
          ...messages.map((message) =>
            Div(
              {
                class: `message ${
                  message.type === "user" ? "user-message" : "ai-message"
                }`,
              },
              Div(
                { class: "message-content" },
                message.type === "ai"
                  ? Div({ class: "message-avatar" }, "🤖")
                  : Div({ class: "message-avatar user" }, "👤"),
                Div(
                  { class: "message-bubble" },
                  Div(
                    {
                      class: "message-text",
                    },
                    formatMessage(message.content)
                  ),
                  Div(
                    { class: "message-time" },
                    message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  )
                )
              )
            )
          ),
           isLoading? Div(
             { class: "message ai-message" },
             Div(
               { class: "message-content" },
               Div({ class: "message-avatar" }, "🤖"),
               Div(
                 { class: "message-bubble" },
                 Div(
                   { class: "thinking-animation" },
                   Span({ class: "thinking-dot" }),
                   Span({ class: "thinking-dot" }),
                   Span({ class: "thinking-dot" })
                 ),
                 Div({ class: "message-time" }, "Thinking...")
               )
             )
           ): null
        ),

        // Chat Input
        Div(
          { class: "chat-input-container" },
          Div(
            { class: "chat-input-form" },
             Input({
               class: "chat-input",
               placeholder: "Ask about BUBLOJS...",
               value: inputMessage,
               oninput: (e) => setInputMessage(e.target ? e.target.value : e),
               onkeypress: (e) => {
                 if (e.key === "Enter") {
                   handleSubmit(e);
                 }
               },
             }),
            Button(
              {
                class: "chat-send-btn",
                onclick: handleSubmit,
                disabled: isLoading || !inputMessage.trim(),
              },
              isLoading ? "..." : "➤"
            )
          )
        )
      )
    )
  );
}
