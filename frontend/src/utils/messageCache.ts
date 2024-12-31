import type { Message } from "@/types/message";

const MESSAGE_CACHE_PREFIX = "msg_cache_";
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24時間

interface MessageCache {
  messages: Message[];
  timestamp: number;
}

export const cacheMessages = (contactId: string, messages: Message[]) => {
  const cache: MessageCache = {
    messages,
    timestamp: Date.now(),
  };
  localStorage.setItem(`${MESSAGE_CACHE_PREFIX}${contactId}`, JSON.stringify(cache));
};

export const getCachedMessages = (contactId: string): Message[] | null => {
  const cached = localStorage.getItem(`${MESSAGE_CACHE_PREFIX}${contactId}`);
  if (!cached) return null;

  const cache: MessageCache = JSON.parse(cached);

  // キャッシュの有効期限をチェック
  if (Date.now() - cache.timestamp > CACHE_EXPIRY) {
    localStorage.removeItem(`${MESSAGE_CACHE_PREFIX}${contactId}`);
    return null;
  }

  return cache.messages;
};

export const updateMessageCache = (contactId: string, message: Message) => {
  const cached = getCachedMessages(contactId);
  if (cached) {
    cacheMessages(contactId, [...cached, message]);
  }
};

export const clearMessageCache = (contactId: string) => {
  localStorage.removeItem(`${MESSAGE_CACHE_PREFIX}${contactId}`);
};
