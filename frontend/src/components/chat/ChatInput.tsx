"use client";

import { useState, useCallback } from "react";
import { FileUpload } from "../common/FileUpload";
import { FilePreviewBadge } from "./FilePreviewBadge";
import { MessageInputArea } from "./MessageInputArea";

interface ChatInputProps {
  onSubmit: (message: string, file?: File) => Promise<void>;
  onTyping?: () => void;
  isLoading?: boolean;
  contactName?: string;
}

export const ChatInput = ({
  onSubmit,
  onTyping,
  isLoading,
  contactName,
}: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = useCallback(async () => {
    if (!message.trim() && !selectedFile) return;

    try {
      await onSubmit(message, selectedFile || undefined);
      setMessage("");
      setSelectedFile(null);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  }, [message, selectedFile, onSubmit]);

  return (
    <div className="border-y bg-white">
      {selectedFile && (
        <FilePreviewBadge
          fileName={selectedFile.name}
          onRemove={() => setSelectedFile(null)}
        />
      )}
      <div className="flex items-center gap-2 px-3 py-3">
        <FileUpload
          accept="image/*"
          onChange={setSelectedFile}
          currentFile={selectedFile}
          disabled={isLoading}
          className="flex-shrink-0 flex items-center px-1"
        />
        <MessageInputArea
          message={message}
          onChange={setMessage}
          onSubmit={handleSubmit}
          onTyping={onTyping}
          placeholder={`Message ${contactName ?? "..."}`}
          disabled={isLoading}
        />
        <button
          onClick={handleSubmit}
          disabled={isLoading || (!message.trim() && !selectedFile)}
          className="flex-shrink-0 text-black hover:text-gray-800 disabled:opacity-50 disabled:hover:text-black flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-9 h-9"
          >
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </div>
    </div>
  );
};
