'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '../hooks/useChat';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import ErrorBoundary from './ErrorBoundary';

export default function ChatInterface() {
  const {
    messages,
    isLoading,
    error,
    isStreaming,
    sendMessage,
    clearChat,
    retryMessage,
  } = useChat();

  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    const messageContent = inputValue.trim();
    setInputValue('');
    await sendMessage(messageContent);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    if (messages.length > 0) {
      clearChat();
    }
  };

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white shadow-xl">
        <ChatHeader 
          messageCount={messages.length}
          onClearChat={handleClearChat}
          hasMessages={messages.length > 0}
        />
        
        <ChatMessages
          messages={messages}
          isLoading={isLoading}
          isStreaming={isStreaming}
          onRetryMessage={retryMessage}
        />
        
        <div ref={messagesEndRef} />
        
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSendMessage}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          placeholder="Ask about the weather..."
        />
        
        {error && (
          <div className="px-4 py-2 bg-red-50 border-t border-red-200">
            <p className="text-sm text-red-600">
              Error: {error}
            </p>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
