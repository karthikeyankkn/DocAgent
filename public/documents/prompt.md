# Project: Local-First Document Agent (Browser AI RAG)

## 1. Project Overview
Build a **serverless, mobile-first web application** that allows users to upload PDF documents, store them locally, and chat with them using a **fully in-browser Large Language Model (LLM)** running via WebAssembly and WebGPU.

**Critical Constraints (Strict Adherence Required):**
- **Zero Backend/API Cost:** All processing (PDF parsing, embedding, LLM inference) runs directly in the browser. **NO API KEY is needed.**
- **Offline Capable:** **DO NOT use CDNs** for libraries or model weights. All assets must be bundled or cached locally by Vite/IndexedDB.
- **Performance:** **All computationally intensive tasks (PDF parsing, embedding, LLM inference) MUST happen in Web Workers** to prevent the UI from freezing.
- **Persistence:** Use IndexedDB (via Dexie.js) for document content and vector embeddings.
- **AI Model Stack:** A small, highly-quantized LLM (e.g., Phi-3 or Gemma 2B variant) and a Sentence Transformer embedding model (e.g., `all-MiniLM-L6-v2`) via **Transformers.js**.

## 2. Tech Stack
- **Framework:** React 18 + Vite (TypeScript)
- **Styling:** Tailwind CSS (Mobile-first, Sidebar Drawer pattern)
- **State/DB:** Dexie.js (IndexedDB wrapper) with `dexie-react-hooks`
- **PDF Engine:** `pdfjs-dist` (bundled locally, NO CDN)
- **AI Client:** **`@xenova/transformers`** (for both RAG embedding and LLM generation)
- **Markdown:** `react-markdown`

## 3. Implementation Requirements

### A. The "Local-First" Compute Worker (Crucial)
You must implement a dedicated Web Worker to handle the PDF parsing, text chunking, and embedding generation.

1.  **File:** Create `src/workers/compute.worker.ts`.
2.  **Configuration:** Configure Vite for local model asset serving.
3.  **Behavior Flow:**
    * **PDF Processing:** The UI sends the `ArrayBuffer` to the worker. The worker extracts raw text. (Use `pdfjs-dist` here, as per original plan).
    * **Text Splitting:** The worker uses a simple text splitter (e.g., based on characters or paragraphs) to break the raw text into `chunks`.
    * **Embedding Generation:** The worker initializes the embedding model (`@xenova/transformers`) and generates a vector for every chunk.
    * **Storage:** The worker sends the original file metadata and the list of `(chunk, vector)` pairs back to the main thread for storage in IndexedDB.
    * **Outcome:** The UI must remain responsive while PDF parsing and embedding (the two slowest initial tasks) are running.

### B. Database Schema & Optimization
**File:** `src/db.ts`

The database must now support storing the vector embeddings needed for the RAG retrieval step.

```typescript
import Dexie, { Table } from 'dexie';

// 1. Stores original file metadata and raw text.
export interface StoredFile {
  id?: number;
  name: string;
  content: string; // The raw text from PDF
  uploadedAt: Date;
}

// 2. Stores the chunks and their vector representations.
export interface FileChunk {
  id?: number;
  fileId: number; // Foreign key to StoredFile
  chunkText: string;
  // Store the embedding as a serializable array of numbers.
  embedding: number[]; 
  tokenCount?: number; 
}

export class DocAgentDB extends Dexie {
  files!: Table<StoredFile>; 
  chunks!: Table<FileChunk>; // New table for vector storage

  constructor() {
    super('DocAgentDB');
    this.version(1).stores({
      files: '++id, name, uploadedAt',
      // Index fileId for quick lookup of all chunks belonging to a document.
      chunks: '++id, fileId, tokenCount' 
      // NOTE: We do NOT index 'embedding' as a standard index; 
      // Vector search will be handled manually in the worker.
    });
  }
}

export const db = new DocAgentDB();