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
    <form onSubmit={handleSubmit} className="space-y-4">
      {selectedFile && (
        <div className="relative">
          <div className="p-2 bg-gray-100 rounded-lg">
            <p className="text-sm truncate">{selectedFile.name}</p>
          </div>
          <button
            type="button"
            onClick={() => setSelectedFile(null)}
            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"
          >
            ×
          </button>
        </div>
      )}
      <div className="flex items-end space-x-2">
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 rounded-lg bg-tg-theme-bg border border-tg-theme-button text-tg-theme-text"
            placeholder="Type a message..."
            rows={3}
          />
        </div>
        <div className="flex space-x-2">
          <FileUpload onFileSelect={setSelectedFile} disabled={isLoading} />
          <Button
            type="submit"
            disabled={isLoading || (!message.trim() && !selectedFile)}
          >
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </div>
      </div>
    </form>
  );
};
