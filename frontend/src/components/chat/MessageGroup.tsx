import type { Message } from "@/types/message";
import { MessageBubble } from "./MessageBubble";

interface MessageGroupProps {
  date: string;
  messages: Message[];
  isTyping: boolean;
}

export const MessageGroup = ({
  date,
  messages,
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
            isOwn={message.senderId === "me"}
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
