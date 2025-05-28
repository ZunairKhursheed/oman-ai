# Voice Agent - AI-Powered Voice Assistant

A modern, secure voice assistant application built with Next.js, featuring ElevenLabs ConvAI widget integration, MongoDB token management, and secure access control.

## 🚀 Features

- **🎤 Voice Interaction**: Natural conversation using ElevenLabs ConvAI widget
- **🔐 Secure Access**: Token-based authentication with automatic expiration
- **🤖 AI Responses**: Intelligent conversation capabilities powered by ElevenLabs
- **📱 Responsive Design**: Works on desktop and mobile devices
- **🔊 High-Quality Voice**: Powered by ElevenLabs ConvAI technology
- **⏰ Session Management**: 24-hour token expiry with multiple uses allowed
- **🛡️ Privacy-First**: Secure widget integration with minimal data retention

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Server Actions
- **Database**: MongoDB
- **Voice AI**: ElevenLabs ConvAI Widget
- **Icons**: Lucide React
- **Styling**: Tailwind CSS

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- MongoDB database (local or MongoDB Atlas)
- ElevenLabs ConvAI agent ID (from your ElevenLabs dashboard)
- Modern web browser

## 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd voice-agent
   ```

2. **Install dependencies**

   ```bash
   npm install mongodb @types/mongodb uuid @types/uuid bcryptjs @types/bcryptjs lucide-react
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/oman_ai
   # or use MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/oman_ai

   # Application Configuration
   NEXTAUTH_SECRET=your_secret_key_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000

   # Token Configuration
   TOKEN_EXPIRY_HOURS=24
   ```

4. **Configure ElevenLabs ConvAI Agent**

   - Go to your [ElevenLabs dashboard](https://elevenlabs.io/app/conversational-ai)
   - Create or select a ConvAI agent
   - Copy the agent ID and update it in `src/components/VoiceAgent.tsx`

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎯 Usage

### 1. Generate Access Token

- Visit the home page
- Click "Create Access Token"
- Generate a new token
- Copy the token or shareable URL

### 2. Access Voice Agent

- Use the generated token to access the voice agent
- Enter token manually or use the shareable URL
- Start voice or text conversations

### 3. Voice Interaction

- The ElevenLabs ConvAI widget will load automatically
- Click the microphone button in the widget to start voice input
- Speak naturally to the AI assistant
- The widget handles all voice processing and synthesis

## 🔐 Security Features

- **Token-Based Access**: Secure, temporary access tokens
- **Automatic Expiry**: Tokens expire after 24 hours
- **Multiple Uses**: Tokens can be used multiple times within 24-hour validity period
- **Widget Security**: Voice processing handled securely by ElevenLabs
- **Encrypted Storage**: All data is encrypted using bcrypt
- **No Permanent Storage**: Voice data is not permanently stored locally

## 📱 API Endpoints

### Server Actions

- `generateNewToken()`: Creates a new access token
- `validateAccessToken(token)`: Validates token without marking as used
- `useToken(token)`: Validates and marks token as used
- `cleanupTokens()`: Removes expired tokens

### API Routes

- `POST /api/chat`: Process chat messages and generate AI responses

## 🔧 Development

### Project Structure

```
src/
├── app/
│   ├── actions/           # Server actions
│   ├── api/              # API routes
│   ├── agent/            # Voice agent page
│   ├── create-token/     # Token creation page
│   ├── privacy/          # Privacy policy
│   ├── terms/            # Terms & conditions
│   └── page.tsx          # Home page
├── components/           # React components
├── lib/                  # Utility libraries
│   ├── mongodb.ts        # Database connection
│   └── token.ts          # Token management
└── types/               # TypeScript types
```

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🌐 Deployment

### Environment Setup

1. Set up MongoDB Atlas or your preferred MongoDB hosting
2. Create ElevenLabs ConvAI agent from [ElevenLabs](https://elevenlabs.io/app/conversational-ai)
3. Configure environment variables for production
4. Deploy to Vercel, Netlify, or your preferred platform

### Production Considerations

- Use MongoDB Atlas for production database
- Set secure `NEXTAUTH_SECRET`
- Configure proper `NEXT_PUBLIC_APP_URL`
- Enable HTTPS for secure token transmission
- Set up monitoring and logging

## 📄 Legal Pages

The application includes:

- **Privacy Policy**: Comprehensive privacy information with data deletion policy
- **Terms & Conditions**: Legal terms for service usage
- **Data Deletion**: Automatic and manual data deletion procedures

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review the privacy policy and terms

---

**Note**: This application requires modern browser support for speech recognition. Ensure your users have compatible browsers for the best experience.
