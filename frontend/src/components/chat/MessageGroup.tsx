import type { Message } from "@/types/message";
import { MessageBubble } from "./MessageBubble";
import type { KeyPair } from "@/utils/encryption";

interface MessageGroupProps {
  date: string;
  messages: Message[];
  keyPair?: KeyPair;
  contactPublicKey?: string;
  isTyping: boolean;
}

export const MessageGroup = ({
  date,
  messages,
  keyPair,
  contactPublicKey,
  isTyping,
}: Readonly<MessageGroupProps>) => {
  return (
    <div className="space-y-4">
      <div className="text-xs text-center text-gray-500">{date}</div>
      <div className="space-y-2">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            keyPair={keyPair}
            contactPublicKey={contactPublicKey}
          />
        ))}
        {isTyping && (
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="animate-bounce">•</div>
            <div className="animate-bounce delay-100">•</div>
            <div className="animate-bounce delay-200">•</div>
          </div>
        )}
      </div>
    </div>
  );
};
