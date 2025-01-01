import { useState, useRef, useCallback, useEffect } from "react";
import WebApp from "@twa-dev/sdk";
import { useSendMessage } from "./useSendMessage";
import { useMessages } from "./useMessages";
import { useWebSocket } from "./useWebSocket";
import { useOnlineStatus } from "./useOnlineStatus";
import { useEncryption } from "./useEncryption";
import { useMessageScroll } from "./useMessageScroll";
import type { Contact } from "@/types/contact";

export const useChatRoom = (contactId: string) => {
  const [contact, setContact] = useState<Contact | null>(null);
  const {
    sendMessage,
    isLoading: isSending,
    error: sendError,
  } = useSendMessage();
  const {
    messages,
    isLoading: isLoadingMessages,
    error: loadError,
    hasMore,
    loadMore,
    refetch,
  } = useMessages(contactId);
  const { lastMessage, sendMessage: sendWebSocketMessage } =
    useWebSocket(contactId);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { onlineStatus, updateStatus, isUserOnline } = useOnlineStatus();
  const { keyPair } = useEncryption();
  const [contactPublicKey, setContactPublicKey] = useState<string>();
  const scrollRef = useMessageScroll(messages, isLoadingMessages);

  const fetchContact = useCallback(async () => {
    try {
      const response = await fetch(`/api/contacts/${contactId}`);
      if (!response.ok) throw new Error("Failed to fetch contact");
      const data = await response.json();
      setContact(data);
    } catch (error) {
      console.error("Error fetching contact:", error);
      WebApp.showAlert("Failed to load contact information");
    }
  }, [contactId]);

  const fetchContactPublicKey = useCallback(async () => {
    try {
      const response = await fetch(`/api/contacts/${contactId}/public-key`);
      if (!response.ok) throw new Error("Failed to fetch contact's public key");
      const data = await response.json();
      setContactPublicKey(data.publicKey);
    } catch (error) {
      console.error("Error fetching public key:", error);
    }
  }, [contactId]);

  const handleSendMessage = async (message: string, file?: File) => {
    try {
      const result = await sendMessage(message, file, {
        encrypt: true,
        keyPair: keyPair,
        recipientPublicKey: contactPublicKey,
      });
      sendWebSocketMessage("message", {
        userId: contactId,
        message: result,
      });
      refetch();
    } catch (error) {
      console.error("Error sending message:", error);
      WebApp.showAlert("An error occurred");
    }
  };

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      sendWebSocketMessage("typing", { userId: contactId, isTyping: true });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      sendWebSocketMessage("typing", { userId: contactId, isTyping: false });
    }, 3000);
  };

  useEffect(() => {
    WebApp.ready();
    WebApp.expand();
    fetchContact();
  }, [fetchContact]);

  useEffect(() => {
    if (lastMessage?.type === "message") {
      refetch();
    }
  }, [lastMessage, refetch]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (lastMessage?.type === "status") {
      updateStatus(lastMessage);
    }
  }, [lastMessage, updateStatus]);

  useEffect(() => {
    fetchContactPublicKey();
  }, [fetchContactPublicKey]);

  return {
    contact,
    messages,
    isLoadingMessages,
    isSending,
    sendError,
    loadError,
    hasMore,
    loadMore,
    isTyping,
    onlineStatus,
    isUserOnline,
    scrollRef,
    handleSendMessage,
    handleTyping,
  };
};
