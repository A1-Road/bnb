import type { Message } from "@/types/message";
import { MessageBubble } from "./MessageBubble";
import type { KeyPair } from "@/utils/encryption";

interface MessageGroupProps {
  date: string;
  messages: Message[];
  keyPair?: KeyPair;
  contactPublicKey?: string;
}

export const MessageGroup = ({
  date,
  messages,
  keyPair,
  contactPublicKey,
}: Readonly<MessageGroupProps>) => {
  return (
    <div>
      <div className="sticky top-2 flex items-center justify-center">
        <div className="px-4 py-1 rounded-full bg-gray-100 text-gray-500 text-xs">
          {date}
        </div>
      </div>
      <div className="space-y-3 mt-3">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            keyPair={keyPair}
            contactPublicKey={contactPublicKey}
          />
        ))}
      </div>
    </div>
  );
};
