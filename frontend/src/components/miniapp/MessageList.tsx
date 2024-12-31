import { useEffect, useRef, useCallback } from "react";
import { Message } from "@/types/message";

interface MessageListProps {
  messages: Message[];
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
}

export const MessageList = ({
  messages,
  hasMore,
  isLoading,
  onLoadMore,
}: Readonly<MessageListProps>) => {
  const observerTarget = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !isLoading) {
        onLoadMore();
      }
    },
    [hasMore, isLoading, onLoadMore]
  );

  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 1.0,
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.platform === "Telegram" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-[75%] rounded-2xl px-4 py-2 ${
              message.platform === "Telegram"
                ? "bg-blue-500 text-white rounded-tr-none"
                : "bg-gray-100 text-gray-800 rounded-tl-none"
            }`}
          >
            {message.type === "text" ? (
              <p className="text-sm whitespace-pre-wrap break-words">
                {message.content}
              </p>
            ) : (
              <div className="space-y-2">
                {message.thumbnailUrl && (
                  <img
                    src={message.thumbnailUrl}
                    alt="Media"
                    className="rounded-lg max-w-full"
                    onClick={() => window.open(message.mediaUrl, "_blank")}
                  />
                )}
                <p className="text-sm">{message.content}</p>
              </div>
            )}
            <div
              className={`text-xs mt-1 ${
                message.platform === "Telegram"
                  ? "text-blue-100"
                  : "text-gray-500"
              }`}
            >
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
      ))}
      <div ref={observerTarget} className="h-4" />
      {isLoading && (
        <div className="text-center py-4 text-gray-500">Loading...</div>
      )}
    </div>
  );
};
