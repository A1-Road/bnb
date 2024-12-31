import { useState, useEffect, useCallback } from "react";
import type { Message, MessagesResponse } from "@/types/message";
import {
  cacheMessages,
  getCachedMessages,
  updateMessageCache,
} from "@/utils/messageCache";

export const useMessages = (contactId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState<string>();

  const fetchMessages = useCallback(
    async (cursor?: string) => {
      try {
        setIsLoading(true);
        const url = `/api/messages/${contactId}`;
        const queryUrl = cursor ? `${url}?cursor=${cursor}` : url;
        const response = await fetch(queryUrl);

        if (!response.ok) throw new Error("Failed to fetch messages");

        const data: MessagesResponse = await response.json();

        const newMessages = cursor
          ? [...messages, ...data.messages]
          : data.messages;

        setMessages(newMessages);
        setHasMore(data.hasMore);
        setNextCursor(data.nextCursor);

        // 最初のページのみキャッシュ
        if (!cursor) {
          cacheMessages(contactId, data.messages);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "エラーが発生しました");
        // キャッシュからメッセージを読み込む
        const cached = getCachedMessages(contactId);
        if (cached) {
          setMessages(cached);
          setHasMore(false);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [contactId, messages]
  );

  useEffect(() => {
    // まずキャッシュをチェック
    const cached = getCachedMessages(contactId);
    if (cached) {
      setMessages(cached);
      setIsLoading(false);
    }
    // その後APIから最新データを取得
    fetchMessages();
  }, [contactId, fetchMessages]);

  const loadMore = useCallback(() => {
    if (hasMore && !isLoading && nextCursor) {
      fetchMessages(nextCursor);
    }
  }, [hasMore, isLoading, nextCursor, fetchMessages]);

  const addMessage = useCallback(
    (message: Message) => {
      setMessages((prev) => [...prev, message]);
      updateMessageCache(contactId, message);
    },
    [contactId]
  );

  return {
    messages,
    isLoading,
    error,
    hasMore,
    loadMore,
    addMessage,
    refetch: useCallback(() => fetchMessages(), [fetchMessages]),
  };
};
