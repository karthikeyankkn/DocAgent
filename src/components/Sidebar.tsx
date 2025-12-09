import { useLiveQuery } from 'dexie-react-hooks';
import { X, FileText, Sparkles } from 'lucide-react';
import { db, StoredFile } from '@/db';
import { DocumentCard } from './DocumentCard';
import { UploadZone } from './UploadZone';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFileId: number | null;
  onSelectFile: (file: StoredFile) => void;
  onUpload: (file: File) => void;
  isProcessing: boolean;
}

export function Sidebar({
  isOpen,
  onClose,
  selectedFileId,
  onSelectFile,
  onUpload,
  isProcessing
}: SidebarProps) {
  const files = useLiveQuery(
    () => db.files.orderBy('uploadedAt').reverse().toArray(),
    []
  );

  const handleDelete = async (fileId: number) => {
    await db.chunks.where('fileId').equals(fileId).delete();
    await db.messages.where('fileId').equals(fileId).delete();
    await db.files.delete(fileId);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed lg:static inset-y-0 left-0 z-50',
        'w-80 bg-sidebar border-r border-sidebar-border',
        'flex flex-col h-full',
        'transform transition-transform duration-300 ease-out',
        'lg:transform-none',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl ai-gradient flex items-center justify-center ai-glow">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-sidebar-foreground">DocAgent</h1>
              <p className="text-xs text-muted-foreground">Local AI RAG</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Zone */}
        <UploadZone onUpload={onUpload} isProcessing={isProcessing} />

        {/* Documents List */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-sidebar-foreground">Documents</h2>
            <span className="text-xs text-muted-foreground">
              {files?.length || 0} files
            </span>
          </div>

          {(!files || files.length === 0) ? (
            <div className="text-center py-8">
              <FileText className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                No documents yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Upload a PDF to get started
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {files.map((file) => (
                <DocumentCard
                  key={file.id}
                  document={file}
                  isSelected={file.id === selectedFileId}
                  onSelect={() => onSelectFile(file)}
                  onDelete={() => file.id && handleDelete(file.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border space-y-3">
          <div className="flex justify-center">
            <ThemeToggle />
          </div>
          <div className="text-xs text-muted-foreground text-center">
            <p>100% Local Processing</p>
            <p className="mt-1">No data leaves your browser</p>
          </div>
        </div>
      </aside>
    </>
  );
}
