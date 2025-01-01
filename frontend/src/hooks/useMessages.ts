import { useState, useEffect, useCallback } from "react";
import type { Message, MessagesResponse } from "@/types/message";
import { cacheMessages, getCachedMessages } from "@/utils/messageCache";

export const useMessages = (contactId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState<string>();
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  const fetchMessages = useCallback(
    async (cursor?: string) => {
      if (retryCount >= MAX_RETRIES) {
        setError("Maximum retry attempts reached");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const url = `/api/messages/${contactId}`;
        const queryUrl = cursor ? `${url}?cursor=${cursor}` : url;
        const response = await fetch(queryUrl);

        if (!response.ok) throw new Error("Failed to fetch messages");

        const data: MessagesResponse = await response.json();
        setRetryCount(0);

        setMessages((prev) =>
          cursor ? [...prev, ...data.messages] : data.messages
        );
        setHasMore(data.hasMore);
        setNextCursor(data.nextCursor);

        if (!cursor) {
          cacheMessages(contactId, data.messages);
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
        setRetryCount((prev) => prev + 1);

        const cached = getCachedMessages(contactId);
        if (cached) {
          setMessages(cached);
          setHasMore(false);
        }

        setError(err instanceof Error ? err.message : "エラーが発生しました");
      } finally {
        setIsLoading(false);
      }
    },
    [contactId, retryCount]
  );

  useEffect(() => {
    const initializeMessages = async () => {
      setIsLoading(true);
      const cached = getCachedMessages(contactId);

      if (cached) {
        setMessages(cached);
        setIsLoading(false);
      }

      try {
        await fetchMessages();
      } catch (error) {
        console.error("Failed to fetch initial messages:", error);
      }
    };

    initializeMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactId]);

  const loadMore = useCallback(() => {
    if (hasMore && !isLoading && nextCursor) {
      fetchMessages(nextCursor);
    }
  }, [hasMore, isLoading, nextCursor, fetchMessages]);

  return {
    messages,
    isLoading,
    error,
    hasMore,
    loadMore,
    refetch: useCallback(() => {
      setRetryCount(0);
      return fetchMessages();
    }, [fetchMessages]),
  };
};
