"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import WebApp from "@twa-dev/sdk";
import { MessageForm } from "@/components/miniapp/MessageForm";
import { MessageList } from "@/components/miniapp/MessageList";
import { useSendMessage } from "@/hooks/useSendMessage";
import { useMessages } from "@/hooks/useMessages";
import type { Contact } from "@/types/contact";
import Image from "next/image";
import { useWebSocket } from "@/hooks/useWebSocket";
import { ConnectionStatus } from "@/components/common/ConnectionStatus";
import { TypingIndicator } from "@/components/common/TypingIndicator";
import { OnlineStatus } from "@/components/common/OnlineStatus";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useEncryption } from "@/hooks/useEncryption";

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
  } = useMessages();
  const {
    isConnected,
    lastMessage,
    sendMessage: sendWebSocketMessage,
  } = useWebSocket(params.id);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { onlineStatus, updateStatus, isUserOnline } = useOnlineStatus();
  const keyPair = useEncryption();
  const [contactPublicKey, setContactPublicKey] = useState<string>();

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
        keyPair,
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
    <div className="flex flex-col h-screen bg-tg-theme-bg">
      <ConnectionStatus isConnected={isConnected} />
      {/* ヘッダー - fixed */}
      {contact && (
        <div className="fixed top-0 left-0 right-0 z-10 bg-[var(--tg-theme-bg-color)] border-b border-tg-border">
          <div className="flex items-center gap-3 p-4">
            <div className="relative">
              {contact.avatarUrl ? (
                <Image
                  src={contact.avatarUrl}
                  alt={contact.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-lg text-gray-500">
                    {contact.name.charAt(0)}
                  </span>
                </div>
              )}
              <div
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                  isUserOnline(contact.id) ? "bg-green-500" : "bg-gray-300"
                }`}
              />
            </div>
            <div>
              <h1 className="font-semibold">{contact.name}</h1>
              <OnlineStatus
                isOnline={isUserOnline(contact.id)}
                lastSeen={onlineStatus[contact.id]?.lastSeen}
              />
            </div>
          </div>
        </div>
      )}

      {/* ヘッダーの高さ分のスペーサー */}
      <div className="h-[72px]" />

      {/* メッセージエリア - スクロール可能 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-[144px]">
        {(sendError ?? loadError) && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {sendError ?? loadError}
          </div>
        )}

        <MessageList
          messages={messages}
          hasMore={hasMore}
          isLoading={isLoadingMessages}
          onLoadMore={loadMore}
          keyPair={keyPair}
          contactPublicKey={contactPublicKey}
        />
      </div>

      {/* 入力エリア - fixed */}
      <div className="fixed bottom-16 left-0 right-0 z-10 bg-[var(--tg-theme-bg-color)] border-t border-tg-border p-4">
        <TypingIndicator isTyping={isTyping} name={contact?.name ?? ""} />
        <MessageForm
          onSubmit={handleSendMessage}
          isLoading={isSending}
          onTyping={handleTyping}
        />
      </div>
    </div>
  );
}
