"use client";

import { useEffect } from "react";
import WebApp from "@twa-dev/sdk";
import { MessageForm } from "@/components/miniapp/MessageForm";
import { MessageList } from "@/components/miniapp/MessageList";
import { useSendMessage } from "@/hooks/useSendMessage";
import { useMessages } from "@/hooks/useMessages";
import { useNotifications } from "@/hooks/useNotifications";

export default function Home() {
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
  const { isConnected } = useNotifications();

  useEffect(() => {
    WebApp.ready();
    WebApp.expand();
  }, []);

  const handleSendMessage = async (message: string) => {
    try {
      await sendMessage(message);
      WebApp.showAlert("メッセージを送信しました");
      refetch(); // メッセージ一覧を更新
    } catch (err) {
      console.error(err);
      WebApp.showAlert("エラーが発生しました");
    }
  };

  return (
    <div className="min-h-screen bg-tg-theme-bg text-tg-theme-text p-4">
      <h1 className="text-2xl font-bold mb-4">
        LINE-Telegram Bridge
        {!isConnected && (
          <span className="text-red-500 text-sm ml-2">未接続</span>
        )}
      </h1>

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
