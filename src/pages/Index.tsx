import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { ChatInterface } from '@/components/ChatInterface';
import { ThemeToggle } from '@/components/ThemeToggle';
import { usePdfProcessor } from '@/hooks/usePdfProcessor';
import { StoredFile } from '@/db';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<StoredFile | null>(null);
  const { processFile, isProcessing } = usePdfProcessor();

  const handleUpload = async (file: File) => {
    try {
      await processFile(file);
    } catch (error) {
      console.error('Failed to process file:', error);
    }
  };

  const handleSelectFile = (file: StoredFile) => {
    setSelectedFile(file);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        selectedFileId={selectedFile?.id || null}
        onSelectFile={handleSelectFile}
        onUpload={handleUpload}
        isProcessing={isProcessing}
      />

      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center gap-4 px-4 py-3 border-b bg-card/50 backdrop-blur-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 rounded-lg hover:bg-accent text-foreground"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="font-bold text-lg text-foreground flex-1">DocAgent</h1>
          <ThemeToggle />
        </header>

        <ChatInterface selectedFile={selectedFile} />
      </main>
    </div>
  );
};

export default Index;
