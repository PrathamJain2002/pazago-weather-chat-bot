'use client';

import { Send, Paperclip } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  disabled: boolean;
  placeholder: string;
}

export default function ChatInput({ 
  value, 
  onChange, 
  onSend, 
  onKeyPress, 
  disabled, 
  placeholder 
}: ChatInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disabled && value.trim()) {
      onSend();
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <form onSubmit={handleSubmit} className="flex items-center space-x-3">
        {/* Attachment Button (Placeholder for future features) */}
        <button
          type="button"
          className="p-3 text-gray-400 hover:text-gray-600 transition-colors duration-200 disabled:opacity-50"
          disabled={disabled}
          title="Attach file (coming soon)"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Input Field */}
        <div className="flex-1">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="chat-input resize-none overflow-hidden"
            style={{
              minHeight: '44px',
              maxHeight: '120px',
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = Math.min(target.scrollHeight, 120) + 'px';
            }}
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="send-button flex items-center justify-center min-w-[44px] h-[44px]"
          title="Send message (Enter)"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>

      {/* Keyboard Shortcuts Hint */}
      <div className="mt-2 text-xs text-gray-400 text-center">
        Press <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Enter</kbd> to send, 
        <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs ml-1">Shift + Enter</kbd> for new line
      </div>
    </div>
  );
}
