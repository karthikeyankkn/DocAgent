import { FileText, Trash2, MessageSquare, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { StoredFile } from '@/db';
import { cn } from '@/lib/utils';

interface DocumentCardProps {
  document: StoredFile;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export function DocumentCard({ document, isSelected, onSelect, onDelete }: DocumentCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const StatusIcon = {
    processing: Loader2,
    ready: CheckCircle,
    error: AlertCircle,
  }[document.status];

  const statusColors = {
    processing: 'text-processing',
    ready: 'text-success',
    error: 'text-destructive',
  };

  return (
    <div
      onClick={onSelect}
      className={cn(
        'group relative p-4 rounded-lg cursor-pointer transition-all duration-200',
        'border bg-card hover:bg-accent/50',
        'document-shadow hover:shadow-lg',
        isSelected && 'ring-2 ring-primary bg-accent'
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
          'bg-document text-document-foreground'
        )}>
          <FileText className="w-5 h-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm text-foreground truncate pr-8">
            {document.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <StatusIcon 
              className={cn(
                'w-3.5 h-3.5',
                statusColors[document.status],
                document.status === 'processing' && 'animate-spin'
              )} 
            />
            <span className="text-xs text-muted-foreground">
              {document.status === 'processing' ? 'Processing...' : formatDate(document.uploadedAt)}
            </span>
          </div>
          {document.pageCount && (
            <span className="text-xs text-muted-foreground">
              {document.pageCount} pages
            </span>
          )}
        </div>
      </div>

      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {isSelected && (
        <div className="absolute -left-px top-2 bottom-2 w-1 bg-primary rounded-full" />
      )}
    </div>
  );
}
