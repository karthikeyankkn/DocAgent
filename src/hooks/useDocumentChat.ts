import { useState, useCallback } from 'react';
import { db, StoredFile, ChatMessage, FileChunk } from '@/db';
import { findRelevantChunks, formatContextForAI } from '@/lib/vectorSearch';
import { supabase } from '@/integrations/supabase/client';

type Message = { role: 'user' | 'assistant'; content: string };

export function useDocumentChat(selectedFile: StoredFile | null) {
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback(async (userMessage: string) => {
    if (!selectedFile?.id || !userMessage.trim()) return;

    setIsTyping(true);

    let relevantChunks: FileChunk[] = [];

    try {
      // Add user message to DB
      await db.messages.add({
        fileId: selectedFile.id,
        role: 'user',
        content: userMessage,
        timestamp: new Date(),
      });

      // Find relevant chunks
      relevantChunks = await findRelevantChunks(selectedFile.id, userMessage, 5);
      const context = formatContextForAI(relevantChunks);

      // Get recent messages for conversation context
      const recentMessages = await db.messages
        .where('fileId')
        .equals(selectedFile.id)
        .sortBy('timestamp');

      const messagesToSend: Message[] = recentMessages
        .slice(-10) // Last 10 messages for context
        .map(m => ({ role: m.role, content: m.content }));

      // Call the edge function with streaming
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/document-chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: messagesToSend,
            context,
            documentName: selectedFile.name,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get AI response');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let assistantContent = '';
      let assistantMessageId: number | undefined;

      // Create initial assistant message
      assistantMessageId = await db.messages.add({
        fileId: selectedFile.id,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        sources: relevantChunks.map(c => c.chunkText),
      });

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process complete SSE lines
        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') continue;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              // Update message in DB
              if (assistantMessageId) {
                await db.messages.update(assistantMessageId, {
                  content: assistantContent,
                });
              }
            }
          } catch {
            // Incomplete JSON, will be handled in next iteration
          }
        }
      }

      // Process any remaining buffer
      if (buffer.trim()) {
        for (let raw of buffer.split('\n')) {
          if (!raw || raw.startsWith(':') || !raw.startsWith('data: ')) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === '[DONE]') continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              if (assistantMessageId) {
                await db.messages.update(assistantMessageId, {
                  content: assistantContent,
                });
              }
            }
          } catch { /* ignore */ }
        }
      }

    } catch (error) {
      console.error('Chat error:', error);

      // Fallback: If AI fails but we found relevant chunks, show them
      if (relevantChunks.length > 0) {
        const fallbackContent = "I'm currently unable to connect to the AI service. However, I found these relevant sections in the document:\n\n" +
          relevantChunks.map((c, i) => `**Section ${i + 1}**\n${c.chunkText}`).join('\n\n');

        await db.messages.add({
          fileId: selectedFile.id,
          role: 'assistant',
          content: fallbackContent,
          timestamp: new Date(),
          sources: relevantChunks.map(c => c.chunkText),
        });
        return;
      }

      // Add error message if no fallback available
      await db.messages.add({
        fileId: selectedFile.id,
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
        timestamp: new Date(),
      });
    } finally {
      setIsTyping(false);
    }
  }, [selectedFile]);

  return { sendMessage, isTyping };
}
