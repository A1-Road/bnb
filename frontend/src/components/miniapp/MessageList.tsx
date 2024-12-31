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
          {message.type === "text" ? (
            <p className="text-sm">{message.content}</p>
          ) : (
            <div className="space-y-2">
              {message.thumbnailUrl && (
                <img
                  src={message.thumbnailUrl}
                  alt="メディアのサムネイル"
                  className="rounded-lg max-w-full"
                />
              )}
              <p className="text-sm">{message.content}</p>
            </div>
          )}
          <div className="text-xs mt-1 opacity-70">
            {new Date(message.timestamp).toLocaleString()}
          </div>
        </div>
      ))}
      <div ref={observerTarget} className="h-4" />
      {isLoading && <div className="text-center py-4">読み込み中...</div>}
    </div>
  );
};
