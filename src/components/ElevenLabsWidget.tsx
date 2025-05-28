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

  return (
    <div className="w-full">
      {/* Agent profile and status */}
      <div className="flex flex-col items-center py-8 px-6">
        {/* Agent avatar with status indicator */}
        <div className="relative mb-6">
          <div
            className={`w-24 h-24 rounded-full ${
              isConnected ? "bg-blue-100" : "bg-gray-100"
            } flex items-center justify-center`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`w-16 h-16 ${
                isConnected ? "text-blue-500" : "text-gray-400"
              }`}
              aria-hidden="true"
            >
              <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
            </svg>
          </div>

          {/* Status indicator dot */}
          <div
            className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-white
            ${isConnected ? "bg-green-500" : "bg-gray-300"}`}
          />
        </div>

        {/* Status text */}
        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {isConnected ? "Connected" : "Ready to Connect"}
          </h3>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            {isConnected && isSpeaking && (
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 text-blue-500"
                  aria-hidden="true"
                >
                  <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
                  <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
                </svg>
                <span>Speaking...</span>
              </div>
            )}
            {isConnected && !isSpeaking && (
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 text-blue-500"
                  aria-hidden="true"
                >
                  <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
                  <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
                </svg>
                <span>Listening...</span>
              </div>
            )}
            {!isConnected && (
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 text-gray-400"
                  aria-hidden="true"
                >
                  <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
                  <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
                </svg>
                <span>Ready when you are</span>
              </div>
            )}
          </div>
        </div>

        {/* Connection visualization - animated waveform when speaking */}
        {isConnected && (
          <div className="w-full flex justify-center items-center gap-1 mb-8 h-6">
            {isSpeaking &&
              [1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="bg-blue-500 w-1 rounded-full animate-pulse"
                  style={{
                    height: `${Math.max(
                      8,
                      Math.min(24, 8 + Math.random() * 16)
                    )}px`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
          </div>
        )}

        {/* Action button */}
        <div className="w-full max-w-xs">
          {isConnected ? (
            <button
              type="button"
              onClick={stopConversation}
              className="w-full py-3 px-4 rounded-full font-medium
                bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg
                transition-all duration-200 flex items-center justify-center gap-2"
              aria-label="End conversation"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                  clipRule="evenodd"
                />
              </svg>
              End Call
            </button>
          ) : (
            <button
              type="button"
              onClick={startConversation}
              className="w-full py-3 px-4 rounded-full font-medium
                bg-black hover:bg-gray-800 text-white shadow-md hover:shadow-lg
                transition-all duration-200 flex items-center justify-center gap-2"
              aria-label="Start conversation"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                  clipRule="evenodd"
                />
              </svg>
              Start Call
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
