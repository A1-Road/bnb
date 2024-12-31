import type { Message } from "@/types/message";
import { TextMessage } from "./TextMessage";
import { ImageMessage } from "./ImageMessage";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export const MessageBubble = ({ message, isOwn }: MessageBubbleProps) => {
  return (
    <div
      className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-2 px-1`}
    >
      {message.type === "image" && message.mediaUrl ? (
        <ImageMessage
          mediaUrl={message.mediaUrl}
          timestamp={message.timestamp}
          isOwn={isOwn}
          isEncrypted={message.isEncrypted}
          status={message.status}
        />
      ) : (
        <TextMessage
          content={message.content || ""}
          timestamp={message.timestamp}
          isOwn={isOwn}
          isEncrypted={message.isEncrypted}
          status={message.status}
        />
      )}
    </div>
  );
};
