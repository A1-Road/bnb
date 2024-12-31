import { useState, useEffect } from "react";
import type { Message, MessagesResponse } from "@/types/message";

export const useMessages = (limit = 20) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string>();

  const fetchMessages = async (cursor?: string) => {
    try {
      const url = new URL("/api/messages", window.location.origin);
      url.searchParams.append("limit", limit.toString());
      if (cursor) url.searchParams.append("cursor", cursor);

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch messages");

      const data: MessagesResponse = await response.json();

      if (cursor) {
        setMessages((prev) => [...prev, ...data.messages]);
      } else {
        setMessages(data.messages);
      }

      setHasMore(data.hasMore);
      setNextCursor(data.nextCursor);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = () => {
    if (hasMore && nextCursor) {
      setIsLoading(true);
      fetchMessages(nextCursor);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return {
    messages,
    isLoading,
    error,
    hasMore,
    loadMore,
    refetch: () => fetchMessages(),
  };
};
