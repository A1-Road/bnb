"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import WebApp from "@twa-dev/sdk";
import { MessageForm } from "@/components/miniapp/MessageForm";
import { MessageList } from "@/components/miniapp/MessageList";
import { useSendMessage } from "@/hooks/useSendMessage";
import { useMessages } from "@/hooks/useMessages";
import type { Contact } from "@/types/contact";
import Image from "next/image";

export default function ChatRoom() {
  const params = useParams();
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

  useEffect(() => {
    WebApp.ready();
    WebApp.expand();
    fetchContact();
  }, []);

  const fetchContact = async () => {
    try {
      const response = await fetch(`/api/contacts/${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch contact");
      const data = await response.json();
      setContact(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async (message: string) => {
    try {
      await sendMessage(message);
      WebApp.showAlert("Message sent successfully");
      refetch();
    } catch (err) {
      WebApp.showAlert("An error occurred");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-tg-theme-bg">
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
                  new Date(contact.lastActive) > new Date(Date.now() - 300000)
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              />
            </div>
            <div>
              <h1 className="font-semibold">{contact.name}</h1>
              <div
                className={`flex items-center gap-1 text-xs ${
                  new Date(contact.lastActive) > new Date(Date.now() - 300000)
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                {new Date(contact.lastActive) > new Date(Date.now() - 300000)
                  ? "Online"
                  : `Last seen ${new Date(
                      contact.lastActive
                    ).toLocaleString()}`}
              </div>
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
        />
      </div>

      {/* 入力エリア - fixed */}
      <div className="fixed bottom-16 left-0 right-0 z-10 bg-[var(--tg-theme-bg-color)] border-t border-tg-border p-4">
        <MessageForm onSubmit={handleSendMessage} isLoading={isSending} />
      </div>
    </div>
  );
}
