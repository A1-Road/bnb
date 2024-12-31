import { Message } from "@/types/message";

interface MessageListProps {
  messages: Message[];
}

export const MessageList = ({ messages }: Readonly<MessageListProps>) => {
  return (
    <div className="space-y-4 mb-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`p-3 rounded-lg ${
            message.platform === "Telegram"
              ? "bg-tg-theme-button text-tg-theme-button-text ml-auto"
              : "bg-gray-100 text-gray-800"
          } max-w-[80%]`}
        >
          <p className="text-sm">{message.content}</p>
          <div className="text-xs mt-1 opacity-70">
            {new Date(message.timestamp).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
};
