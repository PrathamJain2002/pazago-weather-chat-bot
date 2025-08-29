'use client';

import { Bot } from 'lucide-react';

export default function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex items-start space-x-3 max-w-[80%]">
        {/* Avatar */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600">
          <Bot className="w-4 h-4" />
        </div>

        {/* Typing Indicator */}
        <div className="flex flex-col space-y-1">
          <div className="chat-message agent-message">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg">🌤️</span>
              <span className="text-xs text-gray-500 font-medium">Weather Agent</span>
            </div>
            
            <div className="typing-indicator">
              <div className="typing-dot"></div>
              <div className="typing-dot" style={{ animationDelay: '0.2s' }}></div>
              <div className="typing-dot" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
