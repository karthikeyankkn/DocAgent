import ReactMarkdown from 'react-markdown';
import { Bot, User } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '@/db';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={cn(
      'flex gap-3 fade-in-up',
      isUser ? 'flex-row-reverse' : 'flex-row'
    )}>
      <div className={cn(
        'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
        isUser 
          ? 'bg-primary text-primary-foreground' 
          : 'ai-gradient text-primary-foreground ai-glow'
      )}>
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      <div className={cn(
        'flex-1 max-w-[85%] rounded-2xl px-4 py-3',
        isUser 
          ? 'bg-primary text-primary-foreground rounded-tr-sm' 
          : 'bg-card border rounded-tl-sm document-shadow'
      )}>
        <div className={cn(
          'prose prose-sm max-w-none',
          isUser ? 'prose-invert' : 'prose-neutral dark:prose-invert'
        )}>
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              ul: ({ children }) => <ul className="my-2 pl-4 list-disc">{children}</ul>,
              ol: ({ children }) => <ol className="my-2 pl-4 list-decimal">{children}</ol>,
              li: ({ children }) => <li className="mb-1">{children}</li>,
              code: ({ children, className }) => {
                const isInline = !className;
                return isInline ? (
                  <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs">
                    {children}
                  </code>
                ) : (
                  <code className="block p-3 rounded-lg bg-muted font-mono text-xs overflow-x-auto">
                    {children}
                  </code>
                );
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {message.sources && message.sources.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-2">Sources:</p>
            <div className="space-y-1">
              {message.sources.slice(0, 2).map((source, i) => (
                <p key={i} className="text-xs text-muted-foreground italic truncate">
                  "{source.slice(0, 100)}..."
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex gap-3 fade-in-up">
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ai-gradient text-primary-foreground ai-glow">
        <Bot className="w-4 h-4" />
      </div>
      <div className="bg-card border rounded-2xl rounded-tl-sm px-4 py-3 document-shadow">
        <div className="typing-indicator flex gap-1">
          <span className="w-2 h-2 rounded-full bg-muted-foreground" />
          <span className="w-2 h-2 rounded-full bg-muted-foreground" />
          <span className="w-2 h-2 rounded-full bg-muted-foreground" />
        </div>
      </div>
    </div>
  );
}
