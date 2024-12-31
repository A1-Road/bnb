"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import WebApp from "@twa-dev/sdk";
import { MessageList } from "@/components/miniapp/MessageList";
import { useSendMessage } from "@/hooks/useSendMessage";
import { useMessages } from "@/hooks/useMessages";
import type { Contact } from "@/types/contact";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useEncryption } from "@/hooks/useEncryption";
import { ChatLayout } from "@/components/layout/ChatLayout";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatInput } from "@/components/chat/ChatInput";
import { useMessageScroll } from "@/hooks/useMessageScroll";

interface PageParams {
  id: string;
  [key: string]: string | string[];
}

export default function ChatRoom() {
  const params = useParams<PageParams>();
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
  } = useMessages(params.id);
  const { lastMessage, sendMessage: sendWebSocketMessage } = useWebSocket(
    params.id
  );
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { onlineStatus, updateStatus, isUserOnline } = useOnlineStatus();
  const { keyPair } = useEncryption();
  const [contactPublicKey, setContactPublicKey] = useState<string>();
  const scrollRef = useMessageScroll(messages, isLoadingMessages);

  const fetchContact = useCallback(async () => {
    try {
      const response = await fetch(`/api/contacts/${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch contact");
      const data = await response.json();
      setContact(data);
    } catch (error) {
      console.error("Error fetching contact:", error);
      WebApp.showAlert("Failed to load contact information");
    }
  }, [params.id]);

  const fetchContactPublicKey = useCallback(async () => {
    try {
      const response = await fetch(`/api/contacts/${params.id}/public-key`);
      if (!response.ok) throw new Error("Failed to fetch contact's public key");
      const data = await response.json();
      setContactPublicKey(data.publicKey);
    } catch (error) {
      console.error("Error fetching public key:", error);
    }
  }, [params.id]);

  useEffect(() => {
    WebApp.ready();
    WebApp.expand();
    fetchContact();
  }, [fetchContact, params.id]);

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

  const handleSendMessage = async (message: string, file?: File) => {
    try {
      const result = await sendMessage(message, file, {
        encrypt: true,
        keyPair: keyPair,
        recipientPublicKey: contactPublicKey,
      });
      sendWebSocketMessage("message", {
        userId: params.id,
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
      sendWebSocketMessage("typing", { userId: params.id, isTyping: true });
    }

    // 3秒間タイピングがないとタイピング状態を解除
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      sendWebSocketMessage("typing", { userId: params.id, isTyping: false });
    }, 3000);
  };

  return (
    <ChatLayout
      header={
        <ChatHeader
          contact={contact}
          isOnline={isUserOnline(contact?.id ?? "")}
          lastSeen={contact ? onlineStatus[contact.id]?.lastSeen : undefined}
        />
      }
      error={
        (sendError ?? loadError) && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-2">
            {sendError ?? loadError}
          </div>
        )
      }
      messages={
        <MessageList
          ref={scrollRef}
          messages={messages}
          hasMore={hasMore}
          isLoading={isLoadingMessages}
          onLoadMore={loadMore}
          isTyping={isTyping}
        />
      }
      input={
        <ChatInput
          isTyping={isTyping}
          contactName={contact?.name ?? ""}
          isLoading={isSending}
          onSubmit={handleSendMessage}
          onTyping={handleTyping}
        />
      }
    />
  );
}
