import { useEffect, useRef } from "react";

interface MessageInputAreaProps {
  message: string;
  onChange: (message: string) => void;
  onTyping?: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const MessageInputArea = ({
  message,
  onChange,
  onTyping,
  handleKeyDown,
  placeholder,
  disabled,
}: MessageInputAreaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "0px";
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = Math.min(scrollHeight, 100) + "px";
    }
  }, [message]);

  return (
    <textarea
      ref={textareaRef}
      value={message}
      onChange={(e) => {
        onChange(e.target.value);
        onTyping?.();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handleKeyDown(e);
        }
      }}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 max-h-[100px] rounded-2xl bg-gray-100 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
      disabled={disabled}
    />
  );
};
