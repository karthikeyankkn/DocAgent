import Dexie, { Table } from 'dexie';

// Stores original file metadata and raw text
export interface StoredFile {
  id?: number;
  name: string;
  content: string; // The raw text from PDF
  uploadedAt: Date;
  pageCount?: number;
  status: 'processing' | 'ready' | 'error';
}

// Stores the chunks and their vector representations
export interface FileChunk {
  id?: number;
  fileId: number; // Foreign key to StoredFile
  chunkText: string;
  embedding: number[]; // Vector embedding
  tokenCount?: number;
}

// Chat messages
export interface ChatMessage {
  id?: number;
  fileId: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: string[]; // Relevant chunk texts used for context
}

export class DocAgentDB extends Dexie {
  files!: Table<StoredFile>;
  chunks!: Table<FileChunk>;
  messages!: Table<ChatMessage>;

  constructor() {
    super('DocAgentDB');
    this.version(1).stores({
      files: '++id, name, uploadedAt, status',
      chunks: '++id, fileId, tokenCount',
      messages: '++id, fileId, timestamp',
    });
  }
}

export const db = new DocAgentDB();
