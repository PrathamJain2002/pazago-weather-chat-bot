'use client';

import { useState } from 'react';
import { Plus, MessageCircle, Trash2, Edit2, Check, X } from 'lucide-react';
import { Thread } from '../types/chat';

interface ThreadSidebarProps {
  threads: Thread[];
  activeThreadId: string | null;
  onSwitchThread: (threadId: string) => void;
  onCreateThread: (name?: string) => string;
  onDeleteThread: (threadId: string) => void;
  onRenameThread: (threadId: string, name: string) => void;
}

export default function ThreadSidebar({
  threads,
  activeThreadId,
  onSwitchThread,
  onCreateThread,
  onDeleteThread,
  onRenameThread,
}: ThreadSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingThreadId, setEditingThreadId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleCreateThread = () => {
    onCreateThread();
    setIsOpen(true);
  };

  const handleSwitchThread = (threadId: string) => {
    onSwitchThread(threadId);
    setIsOpen(false); // Close sidebar when switching threads
  };

  const handleRenameStart = (thread: Thread) => {
    setEditingThreadId(thread.id);
    setEditingName(thread.name);
  };

  const handleRenameSave = () => {
    if (editingThreadId && editingName.trim()) {
      onRenameThread(editingThreadId, editingName.trim());
    }
    setEditingThreadId(null);
    setEditingName('');
  };

  const handleRenameCancel = () => {
    setEditingThreadId(null);
    setEditingName('');
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
        title="Toggle Threads"
      >
        <MessageCircle className="w-5 h-5" />
      </button>

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 z-40 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Chat Threads</h2>
            <button
              onClick={handleCreateThread}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="New Thread"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Thread List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {threads.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No threads yet</p>
            ) : (
              threads.map((thread) => (
                <div
                  key={thread.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    thread.id === activeThreadId
                      ? 'bg-blue-100 border border-blue-300'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                  onClick={() => handleSwitchThread(thread.id)}
                >
                  {editingThreadId === thread.id ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleRenameSave();
                          if (e.key === 'Escape') handleRenameCancel();
                        }}
                      />
                      <button
                        onClick={handleRenameSave}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleRenameCancel}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-800 truncate">
                          {thread.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {thread.messages.length} messages
                        </p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRenameStart(thread);
                          }}
                          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                          title="Rename thread"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        {threads.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteThread(thread.id);
                            }}
                            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Delete thread"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              {threads.length} thread{threads.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
