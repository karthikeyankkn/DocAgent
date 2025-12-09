import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, FileText } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, StoredFile } from '@/db';
import { ChatMessage, TypingIndicator } from './ChatMessage';
import { useDocumentChat } from '@/hooks/useDocumentChat';
import { cn } from '@/lib/utils';

interface ChatInterfaceProps {
  selectedFile: StoredFile | null;
}

export function ChatInterface({ selectedFile }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage, isTyping } = useDocumentChat(selectedFile);

  const messages = useLiveQuery(
    () => selectedFile?.id
      ? db.messages.where('fileId').equals(selectedFile.id).sortBy('timestamp')
      : [],
    [selectedFile?.id]
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedFile?.id || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    
    await sendMessage(userMessage);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!selectedFile) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-accent flex items-center justify-center">
            <FileText className="w-10 h-10 text-accent-foreground" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-3">
            Select a Document
          </h2>
          <p className="text-muted-foreground">
            Choose a document from the sidebar or upload a new PDF to start chatting with your documents using local AI.
          </p>
        </div>
      </div>
    );
  }

  if (selectedFile.status === 'processing') {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl ai-gradient ai-glow flex items-center justify-center processing-pulse">
            <Sparkles className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-3">
            Processing Document
          </h2>
          <p className="text-muted-foreground">
            Extracting text and generating embeddings for "{selectedFile.name}"...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-document flex items-center justify-center">
            <FileText className="w-5 h-5 text-document-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground truncate max-w-[200px] sm:max-w-none">
              {selectedFile.name}
            </h2>
            <p className="text-xs text-muted-foreground">
              {selectedFile.pageCount ? `${selectedFile.pageCount} pages • ` : ''}
              Ready for questions
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {(!messages || messages.length === 0) && (
          <div className="text-center py-12">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary/50" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Start a Conversation
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Ask questions about this document. The AI will search through the content and provide relevant answers.
            </p>
          </div>
        )}
        
        {messages?.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {isTyping && <TypingIndicator />}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 p-4 border-t bg-card/50 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about this document..."
              rows={1}
              className={cn(
                'w-full px-4 py-3 pr-12 rounded-xl resize-none',
                'bg-background border border-input',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
                'placeholder:text-muted-foreground text-sm',
                'transition-all duration-200'
              )}
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className={cn(
              'flex-shrink-0 w-12 h-12 rounded-xl',
              'flex items-center justify-center',
              'transition-all duration-200',
              input.trim() && !isTyping
                ? 'ai-gradient text-primary-foreground ai-glow hover:scale-105'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            )}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
