"use client";

import { useEffect } from "react";
import WebApp from "@twa-dev/sdk";
import { MessageForm } from "@/components/miniapp/MessageForm";
import { useSendMessage } from "@/hooks/useSendMessage";

export default function Home() {
  const { sendMessage, isLoading, error } = useSendMessage();

  useEffect(() => {
    if (WebApp.isReady) {
      WebApp.ready();
      WebApp.expand();
    }
  }, []);

  const handleSendMessage = async (message: string) => {
    try {
      await sendMessage(message);
      WebApp.showAlert("メッセージを送信しました");
    } catch (err) {
      WebApp.showAlert("エラーが発生しました");
    }
  };

  return (
    <div className="min-h-screen bg-tg-theme-bg text-tg-theme-text p-4">
      <h1 className="text-2xl font-bold mb-4">LINE-Telegram Bridge</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <MessageForm onSubmit={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}
