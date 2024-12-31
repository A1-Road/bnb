"use client";

import { useState } from "react";
import { Button } from "@/components/common/Button";
import { FileUpload } from "@/components/common/FileUpload";

interface MessageFormProps {
  onSubmit: (message: string, file?: File) => void;
  isLoading?: boolean;
}

export const MessageForm = ({
  onSubmit,
  isLoading = false,
}: Readonly<MessageFormProps>) => {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || selectedFile) {
      onSubmit(message, selectedFile ?? undefined);
      setMessage("");
      setSelectedFile(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <div className="flex-1 relative">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-3 pr-12 rounded-2xl bg-gray-100 text-gray-800 resize-none"
          placeholder="Type a message..."
          rows={1}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <FileUpload
          onFileSelect={setSelectedFile}
          disabled={isLoading}
          className="absolute right-2 bottom-2"
        />
      </div>
      <Button
        type="submit"
        disabled={isLoading || (!message.trim() && !selectedFile)}
        className="rounded-full p-3"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
        </svg>
      </Button>
    </form>
  );
};
