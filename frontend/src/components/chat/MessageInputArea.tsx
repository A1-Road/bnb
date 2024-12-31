import { AttachmentButton } from "./AttachmentButton";
import { MessageInput } from "./MessageInput";

interface MessageInputAreaProps {
  content: string;
  setContent: (content: string) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  isLoading?: boolean;
  onFileSelect: (file: File) => void;
}

export const MessageInputArea = ({
  content,
  setContent,
  handleKeyDown,
  isLoading,
  onFileSelect,
}: MessageInputAreaProps) => {
  return (
    <>
      <AttachmentButton onFileSelect={onFileSelect} disabled={isLoading} />
      <MessageInput
        content={content}
        onChange={setContent}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
      />
    </>
  );
};
