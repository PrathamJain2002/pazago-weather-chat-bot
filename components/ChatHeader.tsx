'use client';

import { Cloud, Trash2, MessageCircle } from 'lucide-react';

interface ChatHeaderProps {
  messageCount: number;
  onClearChat: () => void;
  hasMessages: boolean;
}

export default function ChatHeader({ messageCount, onClearChat, hasMessages }: ChatHeaderProps) {
  return (
    // <header className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-b border-blue-700">
    //   <div className="flex items-center space-x-3">
    //     <div className="p-2 bg-white/20 rounded-lg">
    //       <Cloud className="w-6 h-6" />
    //     </div>
    //     <div>
    //       <h1 className="text-xl font-bold">Weather Agent</h1>
    //       <p className="text-sm text-blue-100">Ask me anything about the weather</p>
    //     </div>
    //   </div>
      
    //   <div className="flex items-center space-x-4">
    //     <div className="flex items-center space-x-2 text-blue-100">
    //       <MessageCircle className="w-4 h-4" />
    //       <span className="text-sm">{messageCount} messages</span>
    //     </div>
        
    //     {hasMessages && (
    //       <button
    //         onClick={onClearChat}
    //         className="flex items-center space-x-2 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200"
    //         title="Clear chat history"
    //       >
    //         <Trash2 className="w-4 h-4" />
    //         <span className="text-sm">Clear</span>
    //       </button>
    //     )}
    //   </div>
    // </header>
    <></>
  );
}
