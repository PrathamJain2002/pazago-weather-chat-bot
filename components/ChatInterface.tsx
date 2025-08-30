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
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Scroll to bottom immediately when send button is clicked
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  // Scroll to bottom instantly (for immediate response)
  const scrollToBottomInstant = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    const messageContent = inputValue.trim();
    setInputValue('');
    
    // Scroll to bottom immediately when sending message
    // Use setTimeout to ensure it runs after state update
    setTimeout(() => scrollToBottomInstant(), 0);
    
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
          containerRef={messagesContainerRef}
        />
        
        <div ref={messagesEndRef} />
        
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSendMessage}
          onKeyPress={handleKeyPress}
          onScrollToBottom={scrollToBottom}
          disabled={isLoading}
          placeholder="Ask about weather..."
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
