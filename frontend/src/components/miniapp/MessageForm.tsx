"use client";

import { useState } from "react";
import { Button } from "@/components/common/Button";

interface MessageFormProps {
  onSubmit: (message: string) => void;
  isLoading?: boolean;
}

export const MessageForm = ({
  onSubmit,
  isLoading = false,
}: MessageFormProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSubmit(message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full p-3 rounded-lg bg-tg-theme-bg border border-tg-theme-button text-tg-theme-text"
        placeholder="メッセージを入力..."
        rows={3}
      />
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || !message.trim()}
      >
        {isLoading ? "送信中..." : "メッセージを送信"}
      </Button>
    </form>
  );
};
