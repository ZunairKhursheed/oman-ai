"use client";

import { useConversation } from "@11labs/react";
import { useCallback } from "react";

// Fix interface to match ElevenLabs API
interface MessageProps {
  message: string;
  source: string;
}

export function FullScreenWidget({ agentId }: { agentId: string }) {
  const conversation = useConversation({
    onConnect: () => console.log("Connected"),
    onDisconnect: () => console.log("Disconnected"),
    onMessage: (props: MessageProps) => console.log("Message:", props),
    onError: (error: unknown) => console.error("Error:", error),
  });

  const startConversation = useCallback(async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Start the conversation with your agent
      await conversation.startSession({
        agentId,
      });
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  }, [conversation, agentId]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  // Status to determine the UI elements
  const isConnected = conversation.status === "connected";
  const isSpeaking = conversation.isSpeaking;

  // Determine orb state and colors
  const getOrbState = () => {
    if (!isConnected) return "idle";
    if (isSpeaking) return "speaking";
    return "listening";
  };

  const orbState = getOrbState();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center ">
      {/* Background ambient glow */}
      <div className="absolute inset-0 opacity-30">
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-all duration-1000 ${
            orbState === "idle"
              ? "w-96 h-96 bg-gray-600"
              : orbState === "listening"
              ? "w-[500px] h-[500px] bg-blue-500"
              : "w-[600px] h-[600px] bg-purple-500"
          }`}
        />
      </div>

      {/* Main orb container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Orb with waves */}
        <div className="relative mb-8">
          {/* Main orb */}
          <div
            className={`relative w-48 h-48 rounded-full transition-all duration-500 cursor-pointer transform hover:scale-105 ${
              orbState === "idle"
                ? "bg-gradient-to-br from-gray-600 to-gray-800 shadow-lg shadow-gray-600/20"
                : orbState === "listening"
                ? "bg-gradient-to-br from-blue-400 to-blue-600 shadow-xl shadow-blue-500/40 animate-pulse"
                : "bg-gradient-to-br from-purple-400 via-pink-500 to-purple-600 shadow-xl shadow-purple-500/40"
            }`}
            onClick={isConnected ? stopConversation : startConversation}
          >
            {/* Inner glow */}
            <div
              className={`absolute inset-2 rounded-full transition-all duration-500 ${
                orbState === "idle"
                  ? "bg-gradient-to-br from-gray-500/50 to-transparent"
                  : orbState === "listening"
                  ? "bg-gradient-to-br from-blue-300/60 to-transparent animate-pulse"
                  : "bg-gradient-to-br from-purple-300/60 via-pink-300/40 to-transparent"
              }`}
            />

            {/* Center highlight */}
            <div
              className={`absolute top-6 left-6 w-16 h-16 rounded-full transition-all duration-500 ${
                orbState === "idle"
                  ? "bg-gray-400/30"
                  : orbState === "listening"
                  ? "bg-blue-200/50"
                  : "bg-purple-200/60"
              }`}
            />

            {/* Speaking animation bars inside orb */}
            {orbState === "speaking" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="bg-white/80 w-1 rounded-full animate-pulse"
                      style={{
                        height: `${Math.max(
                          8,
                          Math.min(32, 8 + Math.random() * 24)
                        )}px`,
                        animationDelay: `${i * 0.1}s`,
                        animationDuration: "0.8s",
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Microphone icon for listening state */}
            {orbState === "listening" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-12 h-12 text-white/80"
                  aria-hidden="true"
                >
                  <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
                  <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
                </svg>
              </div>
            )}

            {/* Power icon for idle state */}
            {orbState === "idle" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-12 h-12 text-white/60"
                  aria-hidden="true"
                >
                  <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                  <line x1="12" y1="2" x2="12" y2="12" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Status text */}
        <div className="text-center mb-8">
          <h2
            className={`text-2xl font-light mb-2 transition-all duration-500 ${
              orbState === "idle"
                ? "text-gray-400"
                : orbState === "listening"
                ? "text-blue-300"
                : "text-purple-300"
            }`}
          >
            {orbState === "idle"
              ? "Tap to start"
              : orbState === "listening"
              ? "Listening..."
              : "Speaking..."}
          </h2>

          <p className="text-gray-500 text-sm">
            {orbState === "idle"
              ? "Voice assistant ready"
              : orbState === "listening"
              ? "I'm listening to you"
              : "AI is responding"}
          </p>
        </div>

        {/* Action hint */}
        {isConnected && (
          <div className="text-center">
            <p className="text-gray-600 text-xs">
              Tap the orb to end conversation
            </p>
          </div>
        )}
      </div>

      {/* Floating particles effect */}
      {isConnected && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 rounded-full animate-float ${
                orbState === "listening" ? "bg-blue-400/30" : "bg-purple-400/30"
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 1;
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
