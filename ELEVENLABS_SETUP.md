# ElevenLabs Voice Agent Setup Guide

This guide will help you set up the ElevenLabs integration for the voice agent feature.

## Overview

The voice agent now uses:

- **ElevenLabs API** for high-quality text-to-speech
- **Web Speech API** for speech recognition (browser-based)
- **OpenAI API** (optional) for intelligent chat responses

## Prerequisites

1. An ElevenLabs account (free tier available)
2. (Optional) An OpenAI account for better AI responses

## Setup Steps

### 1. Get Your ElevenLabs API Key

1. Sign up at [ElevenLabs](https://elevenlabs.io)
2. Go to your [Profile Settings](https://elevenlabs.io/settings/profile)
3. Copy your API key

### 2. Configure Environment Variables

Create a `.env.local` file in your project root with:

```env
# MongoDB (existing)
MONGODB_URI=your_mongodb_uri
DATABASE_NAME=oman_ai

# ElevenLabs Configuration
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM  # Optional: default voice ID
ELEVENLABS_MODEL_ID=eleven_monolingual_v1  # Optional: model to use

# OpenAI Configuration (optional for better chat responses)
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Available Voice IDs

Some popular ElevenLabs voice IDs:

- `21m00Tcm4TlvDq8ikWAM` - Rachel (default)
- `EXAVITQu4vr4xnSDxMaL` - Bella
- `ErXwobaYiN019PkySvjV` - Antoni
- `MF3mGyEYCl7XYWbV9V6O` - Elli

You can find more voices in your ElevenLabs dashboard.

## Features

### 1. Speech Recognition

- Click the microphone button to start speaking
- Uses browser's Web Speech API
- Real-time transcription display
- Supports multiple languages (configurable)

### 2. Text-to-Speech

- High-quality voice synthesis using ElevenLabs
- Multiple voice options
- Adjustable volume
- Mute/unmute functionality

### 3. Conversation Management

- Full conversation history
- Clear conversation button
- Timestamps for each message
- Visual distinction between user and assistant messages

### 4. Settings Panel

- Voice selection dropdown
- Volume control slider
- Voice preview functionality
- API status indicators

## Usage

1. **Start a conversation**: Click the large microphone button
2. **Stop listening**: Click the button again while it's red
3. **Change voice**: Click settings icon and select a different voice
4. **Test voice**: Use the "Test this voice" button in settings
5. **Adjust volume**: Use the volume slider in settings
6. **Mute/Unmute**: Click the volume icon in the header
7. **Clear chat**: Click the refresh icon in the header

## API Endpoints

### `/api/elevenlabs/text-to-speech`

- **Method**: POST
- **Body**: `{ text: string, voiceId?: string, modelId?: string }`
- **Response**: Audio stream (audio/mpeg)

### `/api/elevenlabs/voices`

- **Method**: GET
- **Response**: `{ voices: Voice[] }`

### `/api/chat`

- **Method**: POST
- **Body**: `{ message: string }`
- **Response**: `{ response: string }`

## Troubleshooting

### "ElevenLabs API key not configured"

- Ensure your `.env.local` file contains `ELEVENLABS_API_KEY`
- Restart your development server after adding environment variables

### "Speech recognition not supported"

- Use a modern browser (Chrome, Edge, Safari)
- Ensure microphone permissions are granted
- Check if your browser supports Web Speech API

### No audio playback

- Check volume settings (both in-app and system)
- Ensure the voice is not muted
- Verify ElevenLabs API key is valid

### Voice not changing

- Try selecting a different voice and testing it
- Check if the selected voice ID is valid
- Ensure you have access to the selected voice in your ElevenLabs plan

## Browser Compatibility

- **Chrome/Edge**: Full support
- **Safari**: Speech recognition may have limitations
- **Firefox**: Limited speech recognition support
- **Mobile**: Works on most modern mobile browsers

## Cost Considerations

- ElevenLabs free tier includes 10,000 characters/month
- Each response typically uses 50-200 characters
- Monitor usage in your ElevenLabs dashboard
- Consider implementing usage limits for production

## Security Notes

- Never expose API keys in client-side code
- Use environment variables for all sensitive data
- Consider implementing rate limiting for production use
- Add authentication before deploying publicly
