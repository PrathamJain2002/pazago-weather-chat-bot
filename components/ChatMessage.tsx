'use client';

import { Message } from '../types/chat';
import { User, Bot, RefreshCw, Clock, Thermometer, Droplets, Wind, Cloud } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  onRetry: (messageId: string) => Promise<void>;
}

export default function ChatMessage({ message, onRetry }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const isAgent = message.role === 'agent';
  const hasError = message.content.includes('Sorry, I encountered an error');
  const hasWeatherData = message.weatherData && isAgent;

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getWeatherIcon = (content: string, conditions?: string) => {
    if (conditions) {
      const lowerConditions = conditions.toLowerCase();
      if (lowerConditions.includes('thunder') || lowerConditions.includes('storm')) {
        return '⛈️';
      } else if (lowerConditions.includes('rain') || lowerConditions.includes('shower')) {
        return '🌧️';
      } else if (lowerConditions.includes('cloud') || lowerConditions.includes('overcast')) {
        return '☁️';
      } else if (lowerConditions.includes('sunny') || lowerConditions.includes('clear')) {
        return '☀️';
      } else if (lowerConditions.includes('snow')) {
        return '❄️';
      }
    }
    
    // Fallback to content-based detection
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes('sunny') || lowerContent.includes('clear')) {
      return '☀️';
    } else if (lowerContent.includes('rain') || lowerContent.includes('shower')) {
      return '🌧️';
    } else if (lowerContent.includes('cloud') || lowerContent.includes('overcast')) {
      return '☁️';
    } else if (lowerContent.includes('snow')) {
      return '❄️';
    } else if (lowerContent.includes('storm') || lowerContent.includes('thunder')) {
      return '⛈️';
    }
    return '🌤️';
  };

  const WeatherDataDisplay = ({ weatherData }: { weatherData: NonNullable<Message['weatherData']> }) => (
    <div className="mt-3 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
        <div className="flex items-center space-x-2">
          <Thermometer className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 flex-shrink-0" />
          <span className="font-medium min-w-0">Temperature:</span>
          <span className="font-semibold">{weatherData.temperature}°C</span>
        </div>
        <div className="flex items-center space-x-2">
          <Thermometer className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500 flex-shrink-0" />
          <span className="font-medium min-w-0">Feels like:</span>
          <span className="font-semibold">{weatherData.feelsLike}°C</span>
        </div>
        <div className="flex items-center space-x-2">
          <Droplets className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
          <span className="font-medium min-w-0">Humidity:</span>
          <span className="font-semibold">{weatherData.humidity}%</span>
        </div>
        <div className="flex items-center space-x-2">
          <Wind className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
          <span className="font-medium min-w-0">Wind:</span>
          <span className="font-semibold">{weatherData.windSpeed} km/h</span>
        </div>
        {weatherData.windGust > weatherData.windSpeed && (
          <div className="flex items-center space-x-2 col-span-1 sm:col-span-2">
            <Wind className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 flex-shrink-0" />
            <span className="font-medium min-w-0">Wind gusts:</span>
            <span className="font-semibold">{weatherData.windGust} km/h</span>
          </div>
        )}
        <div className="flex items-center space-x-2 col-span-1 sm:col-span-2">
          <Cloud className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
          <span className="font-medium min-w-0">Conditions:</span>
          <span className="capitalize font-semibold">{weatherData.conditions}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start space-x-3 max-w-[80%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser 
            ? 'bg-primary-500 text-white' 
            : 'bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600'
        }`}>
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </div>

        {/* Message Content */}
        <div className={`flex flex-col space-y-1 ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`chat-message ${isUser ? 'user-message' : 'agent-message'}`}>
            {isAgent && !isUser && (
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">{getWeatherIcon(message.content, message.weatherData?.conditions)}</span>
                <span className="text-xs text-gray-500 font-medium">Weather Agent</span>
              </div>
            )}
            
            <div className="whitespace-pre-wrap break-words">
              {message.content || (message.isStreaming ? '...' : '')}
            </div>
            
            {/* Display structured weather data if available */}
            {hasWeatherData && <WeatherDataDisplay weatherData={message.weatherData!} />}
            
            {message.isStreaming && (
              <div className="mt-2">
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot" style={{ animationDelay: '0.2s' }}></div>
                  <div className="typing-dot" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
          </div>

          {/* Timestamp and Actions */}
          <div className={`flex items-center space-x-2 text-xs text-gray-500 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{formatTimestamp(message.timestamp)}</span>
            </div>
            
            {isAgent && hasError && (
              <button
                onClick={() => onRetry(message.id)}
                className="flex items-center space-x-1 text-red-500 hover:text-red-600 transition-colors duration-200"
                title="Retry message"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Retry</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
