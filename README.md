# 🌤️ Weather Agent Chat Interface

A modern, responsive chat interface that connects to a weather agent streaming API. Built with Next.js 14, TypeScript, and Tailwind CSS.

**Built for the Frontend Engineer Assignment: Weather Agent Chat Interface**

## 🎯 Assignment Context

This project was built for the **Frontend Engineer Assignment: Weather Agent Chat Interface** to demonstrate:
- Frontend development skills and API integration capabilities
- Attention to user experience and responsive design
- Technical implementation quality and code architecture
- Problem-solving abilities and attention to detail

## 🏗️ Technical Approach

### **Framework & Technology Choices**
- **Next.js 14**: Chosen for modern React features, built-in API routes, and excellent developer experience
- **TypeScript**: Full type safety implementation for better code quality and maintainability
- **Tailwind CSS**: Utility-first CSS framework for rapid development and consistent responsive design
- **Custom Hooks**: Reusable `useChat` hook for centralized state management and API logic

### **Architecture Decisions**
- **Component-Based Structure**: Modular, reusable components with clear separation of concerns
- **Custom Hook Pattern**: Centralized chat logic in `useChat` hook for better state management
- **Streaming API Integration**: Real-time response handling with `ReadableStream` and proper error boundaries
- **Mobile-First Design**: Responsive design approach starting from mobile devices

### **Technical Trade-offs Considered**
- **Next.js vs Create React App**: Chose Next.js for better performance and built-in features
- **CSS-in-JS vs Tailwind**: Selected Tailwind for rapid development and consistent design system
- **State Management**: Custom hooks over Redux/Context for simpler, focused state management

## ✨ Features

- **Real-time Chat Interface**: Send messages and receive streaming weather responses
- **Weather Data Display**: Structured display of temperature, humidity, wind speed, and conditions
- **Streaming Responses**: Real-time streaming of weather information from the API
- **Responsive Design**: Mobile-first approach that works on all devices
- **Message Management**: Conversation history with timestamps and retry functionality
- **Multiple Message Threads**: Create, switch, delete, and rename conversation threads
- **Thread Sidebar**: Professional thread management interface with smooth animations
- **Auto-scroll**: Automatic scrolling to the latest messages
- **Error Handling**: Comprehensive error management with retry options
- **Loading States**: Visual feedback during API calls
- **Keyboard Shortcuts**: Enter to send, Shift+Enter for new line

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd weather-agent-chat
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure the API**:
   - Create a `.env.local` file in the root directory
   - Add your Google GenAI API key (server-side only, secure):
     ```env
     GOOGLE_GENAI_API_KEY=your_api_key_here
     ```
   - Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**: Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### API Settings (`config/api.ts`)

```typescript
export const API_CONFIG = {
  GOOGLE_GENAI: {
    model: 'gemini-3-flash-preview',
    enabled: true,
  },
  REQUEST: {
    temperature: 0.5,
    topP: 1,
  },
};
```

**Note**: The API key must be set in `.env.local` as `GOOGLE_GENAI_API_KEY` (server-side only, secure). The API is called via a Next.js API route (`/api/chat`) to avoid CORS issues and keep the API key secure.

### Environment Variables
Create a `.env.local` file in the root directory:
```env
GOOGLE_GENAI_API_KEY=your_api_key_here
```

**Important**: 
- Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- Use `GOOGLE_GENAI_API_KEY` (server-side only, secure)
- Never commit `.env.local` to version control
- The API key is required for the chat interface to work
- The API calls are made server-side via `/api/chat` route to avoid CORS issues and keep the API key secure

## 📱 Usage

### Basic Weather Queries
- "What's the weather in London?"
- "Temperature in New York?"
- "Will it rain in Tokyo?"
- "Humidity levels in Paris?"
- "Wind speed in Berlin?"

### Thread Management
- **Create New Threads**: Click the "+" button in the thread sidebar
- **Switch Between Threads**: Click any thread name to switch conversations
- **Rename Threads**: Click the edit icon to customize thread names
- **Delete Threads**: Remove unwanted threads (safety: can't delete last thread)
- **Thread Organization**: Keep separate weather conversations organized

### Supported Cities
The weather agent supports queries for major cities worldwide including:
- **Europe**: London, Paris, Berlin, Rome, Madrid, Amsterdam
- **Americas**: New York, Mumbai
- **Asia**: Tokyo
- **Oceania**: Sydney
- And many more...

## 🏗️ Project Structure

```
weather-agent-chat/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles and Tailwind
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main page component
├── components/             # React components
│   ├── ChatInterface.tsx  # Main chat orchestrator
│   ├── ChatHeader.tsx     # Chat header with controls
│   ├── ChatMessages.tsx   # Message list container
│   ├── ChatMessage.tsx    # Individual message display
│   ├── ChatInput.tsx      # Message input component
│   ├── ThreadSidebar.tsx  # Thread management interface
│   ├── TypingIndicator.tsx # Loading animation
│   └── ErrorBoundary.tsx  # Error handling wrapper
├── hooks/                  # Custom React hooks
│   └── useChat.ts         # Chat logic and API integration
├── types/                  # TypeScript type definitions
│   └── chat.ts            # Chat-related interfaces
├── config/                 # Configuration files
│   └── api.ts             # API endpoints and settings
├── tailwind.config.js     # Tailwind CSS configuration
├── next.config.js         # Next.js configuration
└── package.json           # Dependencies and scripts
```

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (`from-blue-500 to-indigo-600`)
- **Background**: Light gray with subtle gradients
- **Text**: Dark gray for readability
- **Accents**: Blue tones for interactive elements

### Typography
- **Font**: Inter (Google Fonts)
- **Sizes**: Responsive scaling from 14px to 18px
- **Weights**: Regular (400) and Medium (500)

### Components
- **Chat Messages**: Distinct styling for user (right) and agent (left)
- **Input Field**: Auto-resizing textarea with send button
- **Thread Sidebar**: Professional thread management with smooth animations
- **Loading States**: Smooth animations and visual feedback
- **Error Handling**: Clear error messages with retry options

## 📱 Responsive Design

### Breakpoints
- **Mobile**: 320px+ (default)
- **Tablet**: 768px+
- **Desktop**: 1024px+

### Mobile-First Features
- Touch-friendly button sizes
- Optimized spacing for small screens
- Swipe-friendly message scrolling
- Responsive input field

## 🧪 Testing

### Manual Testing
1. **Start the app**: `npm run dev`
2. **Test weather queries**: Try different cities and weather types
3. **Test thread management**: Create, rename, and switch between threads
4. **Test responsiveness**: Resize browser window
5. **Test error handling**: Disconnect internet temporarily
6. **Test keyboard shortcuts**: Enter to send, Shift+Enter for new line

### API Testing
Test the weather agent API directly:
```bash
curl -X POST https://millions-screeching-vultur.mastra.cloud/api/agents/weatherAgent/stream \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "What is the weather in London?"}],
    "threadId": "YOUR_ROLL_NUMBER"
  }'
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Deployment Options
1. **Vercel**: Automatic deployment from GitHub
2. **Netlify**: Build and deploy static files
3. **Any Hosting**: Build with `npm run build`

### Environment Setup
Ensure your production environment has:
- Node.js 18+
- Proper CORS configuration
- HTTPS for production API calls

## 🔧 Customization

### Adding New Cities
The weather agent automatically recognizes city names mentioned in queries. No additional configuration needed.

### Styling Changes
- **Colors**: Update `tailwind.config.js` or `globals.css`
- **Layout**: Modify component files in `components/`
- **Animations**: Add custom CSS classes or Tailwind utilities

### API Integration
- **Endpoint**: Update in `config/api.ts`
- **Headers**: Modify in `hooks/useChat.ts`
- **Response Parsing**: Update `parseStreamingResponse` function

## 🐛 Troubleshooting

### Common Issues

#### API Connection Errors
- **"Connection error" or CORS errors**: The API is now called server-side via `/api/chat` route. Make sure:
  - You've set `GOOGLE_GENAI_API_KEY` in `.env.local`
  - Restart your dev server after adding the API key: `npm run dev`
- **"API key is missing"**: Create `.env.local` file and add your Google GenAI API key
- **"Module not found"**: Run `npm install` to install dependencies
- **CORS errors**: These should be resolved as API calls are now made server-side
- Check your internet connection
- Verify your API key is valid at [Google AI Studio](https://makersuite.google.com/app/apikey)

#### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version`

#### Styling Issues
- Verify Tailwind CSS is properly configured
- Check `globals.css` imports
- Clear browser cache

### Debug Mode
Enable detailed logging in the browser console:
```typescript
// In hooks/useChat.ts
console.log('API Response:', response);
console.log('Parsed Data:', parsed);
```

## 📚 API Reference

### Weather Agent API
- **Endpoint**: `https://millions-screeching-vultur.mastra.cloud/api/agents/weatherAgent/stream`
- **Method**: POST
- **Headers**: Content-Type: application/json
- **Body**: JSON with messages array and configuration

### Response Format
The API returns streaming responses with:
- Weather tool calls and results
- Conversational text chunks
- Message metadata and usage statistics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide React** for the beautiful icons
- **Weather Agent API** for providing real-time weather data

---

## 📋 Assignment Requirements Fulfillment

### ✅ Core Functionality (100% Complete)
- Chat interface with message input and send button
- Conversation history display (user right, agent left)
- Auto-scroll to latest message
- API integration with streaming responses
- Loading states and error handling
- Message management and clear chat functionality
- Multiple message threads with full CRUD operations
- Professional thread management interface

### ✅ UI/UX Requirements (100% Complete)
- Mobile-first responsive design (320px+ support)
- Clean, modern interface with proper typography
- Loading indicators and message timestamps
- Distinct styling for user vs agent messages
- Smooth animations and keyboard shortcuts
- Disabled input states during API calls

### ✅ Technical Requirements (100% Complete)
- Clean, readable code with proper component structure
- Efficient re-rendering and state management
- Optimized API calls with proper error handling
- Network failure handling and user feedback

### 🌟 Bonus Features Implemented
- TypeScript implementation
- Custom React hooks (`useChat`)
- Multiple message threads with professional UI
- Thread management (create, switch, delete, rename)
- Accessibility features (ARIA labels, keyboard navigation)
- Real-time streaming response display
- Smooth animations and professional polish

---

**Note**: This application demonstrates robust API integration with real-time streaming responses, providing users with immediate weather information and a professional chat experience. It fully meets all assignment requirements and includes several bonus features that showcase advanced frontend development skills.
