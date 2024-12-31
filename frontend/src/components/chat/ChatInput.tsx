import { TypingIndicator } from "@/components/common/TypingIndicator";
import { MessageForm } from "@/components/miniapp/MessageForm";

interface ChatInputProps {
  isTyping: boolean;
  contactName: string;
  isLoading: boolean;
  onSubmit: (message: string, file?: File) => Promise<void>;
  onTyping: () => void;
}

export const ChatInput = ({
  isTyping,
  contactName,
  isLoading,
  onSubmit,
  onTyping,
}: Readonly<ChatInputProps>) => {
  return (
    <div className="px-4 py-3">
      <TypingIndicator isTyping={isTyping} name={contactName} />
      <MessageForm
        onSubmit={onSubmit}
        isLoading={isLoading}
        onTyping={onTyping}
      />
    </div>
  );
};
