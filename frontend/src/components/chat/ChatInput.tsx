"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { FileUpload } from "../common/FileUpload";

interface ChatInputProps {
  onSubmit: (message: string, file?: File) => Promise<void>;
  onTyping?: () => void;
  isLoading?: boolean;
  isTyping?: boolean;
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // テキストエリアの高さを自動調整
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "0px";
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = Math.min(scrollHeight, 100) + "px";
    }
  }, [message]);

  const handleSubmit = useCallback(async () => {
    if (!message.trim() && !selectedFile) return;

    try {
      await onSubmit(message, selectedFile || undefined);
      setMessage("");
      setSelectedFile(null);
      if (textareaRef.current) {
        textareaRef.current.style.height = "40px";
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  }, [message, selectedFile, onSubmit]);

  return (
    <div className="border-y bg-white">
      {selectedFile && (
        <div className="inline-flex items-center mb-3 px-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
            <span className="text-sm text-gray-600 truncate max-w-[200px]">
              {selectedFile.name}
            </span>
            <button
              onClick={() => setSelectedFile(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        </div>
      )}
      <div className="flex items-center gap-2 px-3 py-3">
        <FileUpload
          accept="image/*"
          onChange={setSelectedFile}
          currentFile={selectedFile}
          disabled={isLoading}
          className="flex-shrink-0 flex items-center px-1"
        />
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            onTyping?.();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder={`Message ${contactName || "..."}`}
          className="w-full px-4 py-2.5 max-h-[100px] rounded-2xl bg-gray-100 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
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
