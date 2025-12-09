import { useState, useCallback } from 'react';
import { db } from '@/db';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

const CHUNK_SIZE = 500; // characters per chunk

function splitTextIntoChunks(text: string, chunkSize: number = CHUNK_SIZE): string[] {
  const chunks: string[] = [];
  const paragraphs = text.split(/\n\n+/);
  let currentChunk = '';

  for (const paragraph of paragraphs) {
    if (currentChunk.length + paragraph.length > chunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = paragraph;
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

// Simple placeholder embedding (in production, use Transformers.js)
function generatePlaceholderEmbedding(): number[] {
  return Array.from({ length: 384 }, () => Math.random() * 2 - 1);
}

export function usePdfProcessor() {
  const [isProcessing, setIsProcessing] = useState(false);

  const processFile = useCallback(async (file: File) => {
    setIsProcessing(true);

    try {
      // Create file record with processing status
      const fileId = await db.files.add({
        name: file.name,
        content: '',
        uploadedAt: new Date(),
        status: 'processing',
      });

      // Read file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Load PDF
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      
      // Extract text from all pages
      let fullText = '';
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n\n';
      }

      // Split into chunks
      const chunks = splitTextIntoChunks(fullText);

      // Generate embeddings (placeholder - would use Transformers.js in production)
      const chunkRecords = chunks.map((chunkText) => ({
        fileId,
        chunkText,
        embedding: generatePlaceholderEmbedding(),
        tokenCount: Math.ceil(chunkText.length / 4),
      }));

      // Store chunks
      await db.chunks.bulkAdd(chunkRecords);

      // Update file with extracted content
      await db.files.update(fileId, {
        content: fullText,
        pageCount: numPages,
        status: 'ready',
      });

      return fileId;
    } catch (error) {
      console.error('Error processing PDF:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return { processFile, isProcessing };
}
