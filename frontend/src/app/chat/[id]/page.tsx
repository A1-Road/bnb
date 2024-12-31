"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import WebApp from "@twa-dev/sdk";
import { MessageForm } from "@/components/miniapp/MessageForm";
import { MessageList } from "@/components/miniapp/MessageList";
import { useSendMessage } from "@/hooks/useSendMessage";
import { useMessages } from "@/hooks/useMessages";
import type { Contact } from "@/types/contact";

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
    <div className="min-h-screen bg-tg-theme-bg text-tg-theme-text p-4">
      {contact && (
        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-xl font-bold">{contact.name}</h1>
          <span
            className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded ${
              contact.platform === "Telegram"
                ? "bg-blue-100 text-blue-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {contact.platform}
          </span>
        </div>
      )}

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

      <MessageForm onSubmit={handleSendMessage} isLoading={isSending} />
    </div>
  );
}
