import { useEffect, useRef, useCallback } from "react";
import type { Message } from "@/types/message";
import { groupMessagesByDate } from "@/utils/messageGroups";
import type { KeyPair } from "@/utils/encryption";
import { MessageGroup } from "@/components/chat/MessageGroup";

interface MessageListProps {
  messages: Message[];
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  keyPair?: KeyPair;
  contactPublicKey?: string;
}

export const MessageList = ({
  messages,
  hasMore,
  isLoading,
  onLoadMore,
  keyPair,
  contactPublicKey,
}: Readonly<MessageListProps>) => {
  const observerTarget = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messageGroups = groupMessagesByDate(messages);

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

  // 新しいメッセージが追加された時のみスクロール
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const shouldScrollToBottom =
      !isLoading && // ローディング中はスクロールしない
      scrollContainer.scrollTop + scrollContainer.clientHeight >=
        scrollContainer.scrollHeight - 100; // 下部付近にいる場合のみスクロール

    if (shouldScrollToBottom) {
      requestAnimationFrame(() => {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      });
    }
  }, [messages, isLoading]);

  return (
    <div
      ref={scrollContainerRef}
      className="absolute inset-0 overflow-y-auto flex flex-col"
    >
      {hasMore && <div ref={observerTarget} className="h-4" />}
      {isLoading && (
        <div className="text-center py-4 text-gray-500">Loading...</div>
      )}
      <div className="flex-1" />
      <div className="px-4">
        {messageGroups.map(([date, messages]) => (
          <MessageGroup
            key={date}
            date={date}
            messages={messages}
            keyPair={keyPair}
            contactPublicKey={contactPublicKey}
          />
        ))}
      </div>
    </div>
  );
};
