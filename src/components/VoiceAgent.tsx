"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  AlertCircle,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Settings,
  Loader2,
  Phone,
  PhoneOff,
} from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { AudioPlayer } from "@/utils/audioPlayer";

interface VoiceAgentProps {
  onTokenExpired?: () => void;
}

interface Voice {
  voice_id: string;
  name: string;
  category: string;
  labels: Record<string, string>;
  preview_url?: string;
}

export default function VoiceAgent({ onTokenExpired }: VoiceAgentProps) {
  // State management
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<string>(
    "21m00Tcm4TlvDq8ikWAM"
  );
  const [voices, setVoices] = useState<Voice[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isElevenLabsConfigured, setIsElevenLabsConfigured] = useState(true);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [isInCall, setIsInCall] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Refs
  const audioPlayerRef = useRef<AudioPlayer>(new AudioPlayer());
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Speech recognition hook with continuous listening
  const {
    isListening,
    interimTranscript,
    error: speechError,
    isSupported: isSpeechSupported,
    startListening,
    stopListening,
  } = useSpeechRecognition({
    onResult: handleSpeechResult,
    onError: (error) => setError(error),
    continuous: true, // Enable continuous listening
    interimResults: true,
  });

  // Initialize audio player volume and callbacks
  useEffect(() => {
    audioPlayerRef.current.setVolume(volume);

    // Set up audio player callbacks
    audioPlayerRef.current.onEnd(() => {
      setIsAudioPlaying(false);
      // Resume listening after audio finishes if in call
      if (isInCall && !isListening) {
        setTimeout(() => {
          startListening();
        }, 500);
      }
    });
  }, [volume, isInCall, isListening, startListening]);

  // Fetch available voices on mount
  useEffect(() => {
    fetchVoices();
  }, []);

  // Auto-start listening when call begins
  useEffect(() => {
    if (isInCall && !isListening && !isProcessing && !isAudioPlaying) {
      startListening();
    }
  }, [isInCall, isListening, isProcessing, isAudioPlaying, startListening]);

  // Fetch available voices from ElevenLabs
  async function fetchVoices() {
    try {
      const response = await fetch("/api/elevenlabs/voices");
      if (!response.ok) {
        if (response.status === 500) {
          setIsElevenLabsConfigured(false);
          setError(
            "ElevenLabs API key not configured. Please add your API key to use voice features."
          );
        }
        return;
      }
      const data = await response.json();
      setVoices(data.voices || []);
    } catch (error) {
      console.error("Error fetching voices:", error);
      setError("Failed to fetch available voices");
    }
  }

  // Handle speech recognition result with silence detection
  async function handleSpeechResult(transcript: string) {
    if (!transcript.trim()) return;

    console.log("Speech result:", transcript);
    setCurrentTranscript(transcript);

    // Clear any existing silence timeout
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }

    // Set a timeout to process the speech after a pause
    silenceTimeoutRef.current = setTimeout(async () => {
      if (transcript.trim()) {
        console.log("Processing speech after silence:", transcript);
        await processUserMessage(transcript);
      }
    }, 2000); // 2 second pause before processing
  }

  // Process user message and get AI response
  async function processUserMessage(message: string) {
    setIsProcessing(true);
    setError(null);

    // Stop listening while processing
    if (isListening) {
      stopListening();
    }

    try {
      // Get AI response from chat API
      const chatResponse = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!chatResponse.ok) {
        throw new Error("Failed to get AI response");
      }

      const { response } = await chatResponse.json();

      // Convert response to speech if not muted
      if (!isMuted && isElevenLabsConfigured) {
        setIsAudioPlaying(true);
        await textToSpeech(response);
      }
    } catch (error) {
      console.error("Error processing message:", error);
      setError("Failed to process your message. Please try again.");
    } finally {
      setIsProcessing(false);
      setCurrentTranscript(""); // Clear transcript after processing
    }
  }

  // Convert text to speech using ElevenLabs
  async function textToSpeech(text: string) {
    try {
      const response = await fetch("/api/elevenlabs/text-to-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          voiceId: selectedVoice,
        }),
      });

      if (!response.ok) {
        if (response.status === 500) {
          setIsElevenLabsConfigured(false);
          setError("ElevenLabs API key not configured");
        }
        throw new Error("Failed to generate speech");
      }

      const audioData = await response.arrayBuffer();
      await audioPlayerRef.current.playAudioFromArrayBuffer(audioData);
    } catch (error) {
      console.error("Error in text-to-speech:", error);
      setError("Failed to generate speech. Audio response will be disabled.");
      setIsAudioPlaying(false);
    }
  }

  // Start/End call
  const toggleCall = useCallback(() => {
    if (isInCall) {
      // End call
      setIsInCall(false);
      if (isListening) {
        stopListening();
      }
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      setCurrentTranscript("");
      setError(null);
      setIsAudioPlaying(false);
    } else {
      // Start call
      setIsInCall(true);
      setError(null);
    }
  }, [isInCall, isListening, stopListening]);

  // Test voice preview
  async function testVoice() {
    try {
      await textToSpeech(
        "Hello! This is a preview of my voice. How does it sound?"
      );
    } catch (error) {
      console.error("Error testing voice:", error);
    }
  }

  // Get the current state for the circular interface
  const getCallState = () => {
    if (!isInCall) return "idle";
    if (isAudioPlaying) return "speaking";
    if (isProcessing) return "processing";
    if (isListening) return "listening";
    return "waiting";
  };

  const callState = getCallState();

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/20">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Agent</h2>
          <p className="text-sm text-gray-600 mt-1">
            {!isInCall
              ? "Click to start talking with your AI agent"
              : callState === "listening"
              ? "Listening..."
              : callState === "processing"
              ? "Processing..."
              : callState === "speaking"
              ? "Speaking..."
              : "Ready"}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {/* Volume Control */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title={isMuted ? "Unmute" : "Mute"}
            disabled={!isInCall}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-gray-600" />
            ) : (
              <Volume2 className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {/* Settings */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-20 right-6 bg-white rounded-xl shadow-xl p-6 w-96 z-10 border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Voice Settings
          </h3>

          {/* Voice Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Voice Selection
            </label>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!isElevenLabsConfigured}
            >
              <option value="">Select a voice</option>
              {voices.map((voice) => (
                <option key={voice.voice_id} value={voice.voice_id}>
                  {voice.name} ({voice.category})
                </option>
              ))}
            </select>
            {selectedVoice && isElevenLabsConfigured && (
              <button
                onClick={() => testVoice()}
                className="mt-2 text-sm text-blue-600 hover:text-blue-700"
              >
                Test this voice
              </button>
            )}
          </div>

          {/* Volume Control */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Volume: {Math.round(volume * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* API Status */}
          {!isElevenLabsConfigured && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ElevenLabs API key not configured. Voice features are disabled.
              </p>
            </div>
          )}

          <button
            onClick={() => setShowSettings(false)}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close Settings
          </button>
        </div>
      )}

      {/* Main Circular Interface */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {/* Large Circular Interface */}
        <div className="relative">
          {/* Main Circle with Gradient */}
          <div
            className={`w-80 h-80 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${
              callState === "idle"
                ? "bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500"
                : callState === "listening"
                ? "bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 animate-pulse"
                : callState === "processing"
                ? "bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500"
                : callState === "speaking"
                ? "bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 animate-pulse"
                : "bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600"
            }`}
          >
            {/* Inner Circle */}
            <div className="w-72 h-72 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              {/* Center Content */}
              <div className="text-center">
                {!isInCall ? (
                  /* Start Call Button */
                  <button
                    onClick={toggleCall}
                    className="w-32 h-32 rounded-full bg-white/40 hover:bg-white/50 flex items-center justify-center transition-all transform hover:scale-105"
                  >
                    <Phone className="w-12 h-12 text-white" />
                  </button>
                ) : (
                  /* Call Active State */
                  <div className="w-32 h-32 rounded-full bg-white/30 flex items-center justify-center">
                    {callState === "processing" ? (
                      <Loader2 className="w-12 h-12 text-white animate-spin" />
                    ) : callState === "listening" ? (
                      <Mic className="w-12 h-12 text-white" />
                    ) : callState === "speaking" ? (
                      <Volume2 className="w-12 h-12 text-white" />
                    ) : (
                      <Mic className="w-12 h-12 text-white opacity-50" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Animated Rings for Active States */}
          {isInCall &&
            (callState === "listening" || callState === "speaking") && (
              <>
                <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping" />
                <div className="absolute inset-4 rounded-full border-2 border-white/20 animate-ping animation-delay-200" />
              </>
            )}
        </div>

        {/* Status Text */}
        <div className="mt-8 text-center">
          {!isInCall ? (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Call AI Agent
              </h3>
              <p className="text-gray-600 max-w-md">
                Click the button above to start a conversation with your AI
                agent. The agent will continuously listen and respond to your
                voice.
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-lg font-medium text-gray-900">
                  {callState === "listening" && "Listening for your voice..."}
                  {callState === "processing" && "Processing your message..."}
                  {callState === "speaking" && "AI is responding..."}
                  {callState === "waiting" && "Ready to listen"}
                </span>
              </div>

              {/* Current Transcript */}
              {(currentTranscript || interimTranscript) && (
                <div className="mb-4 p-4 bg-white/80 rounded-xl border max-w-md">
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    {interimTranscript ? "You're saying..." : "You said:"}
                  </p>
                  <p className="text-gray-900">
                    {currentTranscript || interimTranscript}
                  </p>
                </div>
              )}

              {/* End Call Button */}
              <button
                onClick={toggleCall}
                className="mt-4 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors flex items-center space-x-2 mx-auto"
              >
                <PhoneOff className="w-5 h-5" />
                <span>End Call</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {(error || speechError) && (
        <div className="mx-6 mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Error</p>
              <p className="text-sm">{error || speechError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Debug Info (development only) */}
      {process.env.NODE_ENV === "development" && (
        <div className="p-4 bg-white/50 border-t">
          <div className="text-center text-xs text-gray-500">
            <p>
              State: {callState} | Listening: {isListening.toString()} |
              Processing: {isProcessing.toString()} | Audio:{" "}
              {isAudioPlaying.toString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
