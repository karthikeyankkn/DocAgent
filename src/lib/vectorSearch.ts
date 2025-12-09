import { db, FileChunk } from '@/db';

// Cosine similarity between two vectors
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
  return magnitude === 0 ? 0 : dotProduct / magnitude;
}

// Simple text-based similarity (fallback when embeddings aren't available)
function textSimilarity(query: string, text: string): number {
  const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  const textLower = text.toLowerCase();
  
  let matches = 0;
  for (const word of queryWords) {
    if (textLower.includes(word)) {
      matches++;
    }
  }
  
  return queryWords.length > 0 ? matches / queryWords.length : 0;
}

export async function findRelevantChunks(
  fileId: number,
  query: string,
  topK: number = 5
): Promise<FileChunk[]> {
  const chunks = await db.chunks.where('fileId').equals(fileId).toArray();
  
  if (chunks.length === 0) return [];
  
  // Check if we have real embeddings (not placeholder zeros)
  const hasRealEmbeddings = chunks.some(c => 
    c.embedding && c.embedding.length > 0 && c.embedding.some(v => v !== 0)
  );
  
  let scoredChunks: { chunk: FileChunk; score: number }[];
  
  if (hasRealEmbeddings) {
    // Use vector similarity if we have real embeddings
    // For now, use text similarity as we don't have query embeddings yet
    scoredChunks = chunks.map(chunk => ({
      chunk,
      score: textSimilarity(query, chunk.chunkText),
    }));
  } else {
    // Fallback to text-based similarity
    scoredChunks = chunks.map(chunk => ({
      chunk,
      score: textSimilarity(query, chunk.chunkText),
    }));
  }
  
  // Sort by score descending and take top K
  scoredChunks.sort((a, b) => b.score - a.score);
  
  return scoredChunks.slice(0, topK).map(sc => sc.chunk);
}

export function formatContextForAI(chunks: FileChunk[]): string {
  if (chunks.length === 0) return '';
  
  return chunks
    .map((chunk, i) => `[Section ${i + 1}]\n${chunk.chunkText}`)
    .join('\n\n---\n\n');
}
