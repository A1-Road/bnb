"use client";

import { useState, useCallback } from "react";
import { MessageFormContainer } from "../chat/MessageFormContainer";
import { MessageInputArea } from "../chat/MessageInputArea";
import { SendButton } from "../chat/SendButton";
import { FilePreview } from "../chat/FilePreview";

interface MessageFormProps {
  onSubmit: (message: string, file?: File) => Promise<void>;
  isLoading?: boolean;
  onTyping?: () => void;
}

export const MessageForm = ({
  onSubmit,
  isLoading,
  onTyping,
}: MessageFormProps) => {
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = useCallback(async () => {
    if (!content.trim() && !selectedFile) return;

    try {
      await onSubmit(content, selectedFile || undefined);
      setContent("");
      setSelectedFile(null);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  }, [content, selectedFile, onSubmit]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
      onTyping?.();
    },
    [handleSubmit, onTyping]
  );

  return (
    <div className="space-y-2">
      {selectedFile && (
        <FilePreview
          file={selectedFile}
          onRemove={() => setSelectedFile(null)}
        />
      )}
      <MessageFormContainer onSubmit={(e) => e.preventDefault()}>
        <MessageInputArea
          message={content}
          onChange={setContent}
          handleKeyDown={handleKeyDown}
        />
        <SendButton
          onClick={handleSubmit}
          disabled={isLoading || (!content.trim() && !selectedFile)}
        />
      </MessageFormContainer>
    </div>
  );
};
