import { useState, useCallback, useRef } from 'react';
import { Message, ChatRequest, ChatState, UseChatReturn, WeatherData } from '../types/chat';
import { API_CONFIG } from '../config/api';

interface ParsedResponse {
  weatherData?: WeatherData;
  conversationalText: string;
  messageId?: string;
}

export function useChat(): UseChatReturn {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
    isStreaming: false,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const generateMessageId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const addMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: generateMessageId(),
      timestamp: new Date(),
    };
    
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));
    
    return newMessage;
  }, []);

  const updateMessage = useCallback((messageId: string, updates: Partial<Message>) => {
    setState(prev => ({
      ...prev,
      messages: prev.messages.map(msg =>
        msg.id === messageId ? { ...msg, ...updates } : msg
      ),
    }));
  }, []);

  const parseStreamingResponse = useCallback((chunk: string): ParsedResponse => {
    const lines = chunk.split('\n').filter(line => line.trim());
    let weatherData: WeatherData | undefined;
    let conversationalText = '';
    let messageId: string | undefined;

    for (const line of lines) {
      try {
        if (line.startsWith('9:')) {
          // Tool call with weather data
          const toolCall = JSON.parse(line.substring(2));
          if (toolCall.toolName === 'weatherTool' && toolCall.args?.location) {
            // Weather tool call - we'll get the result in the next chunk
          }
        } else if (line.startsWith('a:')) {
          // Tool result with detailed weather info
          const result = JSON.parse(line.substring(2));
          if (result.result && result.result.temperature !== undefined) {
            weatherData = result.result;
          }
        } else if (line.startsWith('0:')) {
          // Text chunk for conversational response
          const text = line.substring(2).replace(/"/g, '');
          conversationalText += text;
        } else if (line.startsWith('f:')) {
          // Message ID
          const messageInfo = JSON.parse(line.substring(2));
          messageId = messageInfo.messageId;
        }
      } catch (error) {
        console.log('Error parsing line:', line, error);
      }
    }

    return { weatherData, conversationalText, messageId };
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

      const requestBody = {
        messages: [
          {
            role: 'user',
            content: content.trim(),
          },
        ],
        runId: API_CONFIG.REQUEST.runId,
        maxRetries: API_CONFIG.REQUEST.maxRetries,
        maxSteps: API_CONFIG.REQUEST.maxSteps,
        temperature: API_CONFIG.REQUEST.temperature,
        topP: API_CONFIG.REQUEST.topP,
        runtimeContext: {},
        threadId: API_CONFIG.THREAD_ID,
        resourceId: API_CONFIG.REQUEST.resourceId,
      };

      const headers = {
        'Accept': '*/*',
        'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8,fr;q=0.7',
        'Connection': 'keep-alive',
        'Content-Type': 'application/json',
        'x-mastra-dev-playground': 'true',
      };

      const response = await fetch(API_CONFIG.EXTERNAL.endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response body received');
      }

      // Handle streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedChunks = '';
      let finalWeatherData: WeatherData | undefined;
      let finalConversationalText = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          accumulatedChunks += chunk;
          
          // Parse the accumulated chunks
          const parsed = parseStreamingResponse(accumulatedChunks);
          
          if (parsed.weatherData) {
            finalWeatherData = parsed.weatherData;
          }
          
          if (parsed.conversationalText) {
            finalConversationalText = parsed.conversationalText;
            
            // Only update the message content if we have actual text
            if (finalConversationalText.trim()) {
              updateMessage(agentMessage.id, {
                content: finalConversationalText,
                weatherData: finalWeatherData,
                isStreaming: true,
              });
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      // Finalize the agent message with complete response and weather data
      const finalContent = finalConversationalText || 'Weather information received.';
      updateMessage(agentMessage.id, {
        content: finalContent,
        weatherData: finalWeatherData,
        isStreaming: false,
      });

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // Request was cancelled, don't show error
        return;
      }

      console.error('Error sending message:', error);
      
      // Update agent message with error
      updateMessage(agentMessage.id, {
        content: 'Sorry, I encountered an error. Please try again.',
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
  }, [addMessage, updateMessage, parseStreamingResponse]);

  const clearChat = useCallback(() => {
    setState({
      messages: [],
      isLoading: false,
      error: null,
      isStreaming: false,
    });
  }, []);

  const retryMessage = useCallback(async (messageId: string) => {
    const messageToRetry = state.messages.find(msg => msg.id === messageId);
    if (!messageToRetry || messageToRetry.role !== 'user') return;

    // Remove the failed agent response
    setState(prev => ({
      ...prev,
      messages: prev.messages.filter(msg => 
        !(msg.role === 'agent' && msg.id > messageId)
      ),
    }));

    // Retry sending the message
    await sendMessage(messageToRetry.content);
  }, [state.messages, sendMessage]);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    isStreaming: state.isStreaming,
    sendMessage,
    clearChat,
    retryMessage,
  };
}
