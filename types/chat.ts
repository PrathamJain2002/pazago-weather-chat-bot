export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windGust: number;
  conditions: string;
  location: string;
}

export interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  weatherData?: WeatherData;
}

export interface ChatRequest {
  messages: Array<{
    role: 'user';
    content: string;
  }>;
  runId: string;
  maxRetries: number;
  maxSteps: number;
  temperature: number;
  topP: number;
  runtimeContext: Record<string, any>;
  threadId: string;
  resourceId: string;
}

export interface ChatResponse {
  success: boolean;
  data?: string;
  error?: string;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  isStreaming: boolean;
}

export interface UseChatReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  isStreaming: boolean;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
  retryMessage: (messageId: string) => Promise<void>;
}
