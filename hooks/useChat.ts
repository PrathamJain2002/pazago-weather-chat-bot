'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Message, Thread, ChatState, UseChatReturn, WeatherData } from '../types/chat';
import { API_CONFIG } from '../config/api';

// localStorage utility functions
const STORAGE_KEY = 'weather-chat-threads';

const saveThreadsToStorage = (threads: Thread[]): void => {
  try {
    const serializedThreads = threads.map(thread => ({
      ...thread,
      messages: thread.messages.map(msg => ({
        ...msg,
        timestamp: msg.timestamp.toISOString()
      })),
      createdAt: thread.createdAt.toISOString(),
      updatedAt: thread.updatedAt.toISOString()
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializedThreads));
  } catch (error) {
    console.warn('Failed to save threads to localStorage:', error);
  }
};

const loadThreadsFromStorage = (): Thread[] => {
  try {
    // Check if localStorage is available
    if (typeof window === 'undefined' || !window.localStorage) {
      console.warn('localStorage is not available');
      return [];
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const parsedThreads = JSON.parse(stored);
    
    // Validate that parsed data has the expected structure
    if (!Array.isArray(parsedThreads)) {
      console.warn('Invalid threads data in localStorage, clearing...');
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }
    
    return parsedThreads.map((thread: any) => ({
      ...thread,
      messages: thread.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })),
      createdAt: new Date(thread.createdAt),
      updatedAt: new Date(thread.updatedAt)
    }));
  } catch (error) {
    console.warn('Failed to load threads from localStorage:', error);
    // Clear corrupted data
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (clearError) {
      console.warn('Failed to clear corrupted localStorage data:', clearError);
    }
    return [];
  }
};

const clearThreadsFromStorage = (): void => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (error) {
    console.warn('Failed to clear threads from localStorage:', error);
  }
};


export function useChat(): UseChatReturn {
  const [state, setState] = useState<ChatState>({
    threads: [],
    activeThreadId: null,
    isLoading: false,
    error: null,
    isStreaming: false,
  });

  // Initialize with threads from localStorage or create default thread
  useEffect(() => {
    const savedThreads = loadThreadsFromStorage();
    
    if (savedThreads.length > 0) {
      // Load saved threads and set the most recently updated one as active
      const sortedThreads = savedThreads.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      const activeThread = sortedThreads[0];
      
      setState(prev => ({
        ...prev,
        threads: sortedThreads.map(thread => ({
          ...thread,
          isActive: thread.id === activeThread.id
        })),
        activeThreadId: activeThread.id,
      }));
    } else {
      // Create default thread if no saved threads exist
      const defaultThreadId = `thread_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const defaultThread: Thread = {
        id: defaultThreadId,
        name: 'Weather Chat',
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      };
      
      setState(prev => ({
        ...prev,
        threads: [defaultThread],
        activeThreadId: defaultThreadId,
      }));
    }
  }, []);

  // Save threads to localStorage whenever threads change
  useEffect(() => {
    if (state.threads.length > 0) {
      saveThreadsToStorage(state.threads);
    }
  }, [state.threads]);

  const abortControllerRef = useRef<AbortController | null>(null);

  const generateMessageId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const addMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: generateMessageId(),
      timestamp: new Date(),
    };
    
    if (state.activeThreadId) {
      setState(prev => ({
        ...prev,
        threads: prev.threads.map(thread =>
          thread.id === state.activeThreadId
            ? {
                ...thread,
                messages: [...thread.messages, newMessage],
                updatedAt: new Date(),
              }
            : thread
        ),
      }));
    }
    
    return newMessage;
  }, [state.activeThreadId]);

  const updateMessage = useCallback((messageId: string, updates: Partial<Message>) => {
    if (state.activeThreadId) {
      setState(prev => ({
        ...prev,
        threads: prev.threads.map(thread =>
          thread.id === state.activeThreadId
            ? {
                ...thread,
                messages: thread.messages.map(msg =>
                  msg.id === messageId ? { ...msg, ...updates } : msg
                ),
                updatedAt: new Date(),
              }
            : thread
        ),
      }));
    }
  }, [state.activeThreadId]);

  // Helper function to extract weather data from text response
  const extractWeatherData = useCallback((text: string): WeatherData | undefined => {
    // Try to extract weather data from JSON in the response
    try {
      // Look for JSON objects that might contain weather data
      const jsonMatch = text.match(/\{[\s\S]*"temperature"[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.temperature !== undefined) {
          return parsed as WeatherData;
        }
      }
    } catch (error) {
      // If parsing fails, continue without weather data
    }
    return undefined;
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage = addMessage({
      role: 'user',
      content: content.trim(),
    });

    // Add agent message placeholder
    const agentMessage = addMessage({
      role: 'agent',
      content: 'Processing weather data...',
      isStreaming: true,
    });

    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      isStreaming: true,
    }));

    try {
      // Cancel any ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      // Get the conversation history for context
      const activeThread = state.threads.find(t => t.id === state.activeThreadId);
      const conversationHistory = activeThread?.messages || [];

      // Call Next.js API route (server-side) to avoid CORS issues
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: content.trim(),
          conversationHistory: conversationHistory.map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to get response from API');
      }

      const responseText = data.text || 'No response received.';
      
      // Extract weather data if present in the response
      const weatherData = extractWeatherData(responseText);

      // Update the agent message with the complete response
      updateMessage(agentMessage.id, {
        content: responseText,
        weatherData: weatherData,
        isStreaming: false,
      });

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // Request was cancelled, don't show error
        return;
      }

      console.error('Error sending message:', error);
      
      // Extract more detailed error message
      let errorMessage = 'Sorry, I encountered an error. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message;
        // Check for common error types
        if (error.message.includes('API key')) {
          errorMessage = 'API key is missing or invalid. Please configure GOOGLE_GENAI_API_KEY in .env.local';
        } else if (error.message.includes('Connection') || error.message.includes('network')) {
          errorMessage = 'Connection error. Please check your internet connection and API configuration.';
        } else if (error.message.includes('model')) {
          errorMessage = 'Model error. Please check if the model name is correct.';
        }
      }
      
      // Update agent message with error
      updateMessage(agentMessage.id, {
        content: errorMessage,
        isStreaming: false,
      });

      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      }));
    } finally {
      setState(prev => ({
        ...prev,
        isLoading: false,
        isStreaming: false,
      }));
      
      abortControllerRef.current = null;
    }
  }, [addMessage, updateMessage, extractWeatherData, state.threads, state.activeThreadId]);

  const createThread = useCallback((name?: string) => {
    const threadId = `thread_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const threadName = name || `Weather Chat ${state.threads.length + 1}`;
    
    const newThread: Thread = {
      id: threadId,
      name: threadName,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    };
    
    setState(prev => ({
      ...prev,
      threads: prev.threads.map(t => ({ ...t, isActive: false })).concat([newThread]),
      activeThreadId: threadId,
    }));
    
    return threadId;
  }, [state.threads.length]);

  const switchThread = useCallback((threadId: string) => {
    setState(prev => ({
      ...prev,
      threads: prev.threads.map(thread => ({
        ...thread,
        isActive: thread.id === threadId,
      })),
      activeThreadId: threadId,
    }));
  }, []);

  const deleteThread = useCallback((threadId: string) => {
    setState(prev => {
      const remainingThreads = prev.threads.filter(t => t.id !== threadId);
      const newActiveThreadId = prev.activeThreadId === threadId 
        ? (remainingThreads.length > 0 ? remainingThreads[0].id : null)
        : prev.activeThreadId;
      
      return {
        ...prev,
        threads: remainingThreads,
        activeThreadId: newActiveThreadId,
      };
    });
  }, []);

  const renameThread = useCallback((threadId: string, name: string) => {
    setState(prev => ({
      ...prev,
      threads: prev.threads.map(thread =>
        thread.id === threadId ? { ...thread, name } : thread
      ),
    }));
  }, []);

  const clearChat = useCallback(() => {
    if (state.activeThreadId) {
      setState(prev => ({
        ...prev,
        threads: prev.threads.map(thread =>
          thread.id === state.activeThreadId
            ? { ...thread, messages: [], updatedAt: new Date() }
            : thread
        ),
      }));
    }
  }, [state.activeThreadId]);

  const clearAllData = useCallback(() => {
    setState(prev => ({
      ...prev,
      threads: [],
      activeThreadId: null,
    }));
    clearThreadsFromStorage();
  }, []);

  const retryMessage = useCallback(async (messageId: string) => {
    if (!state.activeThreadId) return;
    
    const activeThread = state.threads.find(t => t.id === state.activeThreadId);
    if (!activeThread) return;
    
    const messageToRetry = activeThread.messages.find(msg => msg.id === messageId);
    if (!messageToRetry || messageToRetry.role !== 'user') return;

    // Remove the failed agent response
    setState(prev => ({
      ...prev,
      threads: prev.threads.map(thread =>
        thread.id === state.activeThreadId
          ? {
              ...thread,
              messages: thread.messages.filter(msg => 
                !(msg.role === 'agent' && msg.id > messageId)
              ),
              updatedAt: new Date(),
            }
          : thread
      ),
    }));

    // Retry sending the message
    await sendMessage(messageToRetry.content);
  }, [state.activeThreadId, state.threads, sendMessage]);

  const activeThread = state.threads.find(t => t.id === state.activeThreadId) || null;

  return {
    threads: state.threads,
    activeThread,
    isLoading: state.isLoading,
    error: state.error,
    isStreaming: state.isStreaming,
    sendMessage,
    createThread,
    switchThread,
    deleteThread,
    renameThread,
    clearChat,
    clearAllData,
    retryMessage,
  };
}
