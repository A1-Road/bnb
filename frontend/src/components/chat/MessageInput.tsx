interface MessageInputProps {
  content: string;
  onChange: (content: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  disabled?: boolean;
}

export const MessageInput = ({
  content,
  onChange,
  onKeyDown,
  disabled,
}: MessageInputProps) => {
  return (
    <textarea
      value={content}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      disabled={disabled}
      placeholder="Type a message..."
      className="w-full resize-none rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
      rows={1}
    />
  );
};
