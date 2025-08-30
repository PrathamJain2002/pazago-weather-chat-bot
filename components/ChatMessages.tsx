'use client';

import { Message } from '../types/chat';
import ChatMessage from './ChatMessage';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  isStreaming: boolean;
  onRetryMessage: (messageId: string) => Promise<void>;
  containerRef?: React.RefObject<HTMLDivElement>;
}

export default function ChatMessages({ messages, isLoading, isStreaming, onRetryMessage, containerRef }: ChatMessagesProps) {
  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.004 5.004 0 00-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Welcome to Weather Agent!</h3>
        <p className="text-gray-500 max-w-md">
          I&apos;m here to help you with weather information. Try asking me about the weather in your city, 
          upcoming forecasts, or any weather-related questions.
        </p>
        <div className="mt-6 space-y-2">
          <p className="text-sm text-gray-400">Example questions:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              "What's the weather in London?",
              "Will it rain tomorrow?",
              "Weather forecast for next week"
            ].map((example, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
              >
                {example}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
          onRetry={onRetryMessage}
        />
      ))}
      
      {isLoading && !isStreaming && (
        <div className="flex justify-center">
          <div className="flex items-center space-x-4 text-gray-500">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm">Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
}
