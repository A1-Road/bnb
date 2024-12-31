import { useRef, useEffect, forwardRef } from "react";
import type { Message } from "@/types/message";
import { groupMessagesByDate } from "@/utils/messageGroups";
import type { KeyPair } from "@/utils/encryption";
import { MessageGroup } from "@/components/chat/MessageGroup";
import { useVirtualizer } from "@tanstack/react-virtual";

interface MessageListProps {
  messages: Message[];
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  keyPair?: KeyPair;
  contactPublicKey?: string;
  isTyping?: boolean;
}

export const MessageList = forwardRef<HTMLDivElement, MessageListProps>(
  (
    {
      messages,
      hasMore,
      isLoading,
      onLoadMore,
      keyPair,
      contactPublicKey,
      isTyping = false,
    },
    ref
  ) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const messageGroups = groupMessagesByDate(messages);

    const rowVirtualizer = useVirtualizer({
      count: messageGroups.length,
      getScrollElement: () => scrollContainerRef.current,
      estimateSize: (index) => {
        const [, messages] = messageGroups[index];
        const baseHeight = 40; // 日付ヘッダーの高さ
        const messageHeight = messages.reduce((height, msg) => {
          if (msg.type === "text") return height + 60;
          if (msg.type === "image") return height + 240;
          return height + 80; // ファイル
        }, 0);
        return baseHeight + messageHeight;
      },
      overscan: 5,
    });

    const observerTarget = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !isLoading) {
            onLoadMore();
          }
        },
        { threshold: 0.1 }
      );

      if (observerTarget.current) {
        observer.observe(observerTarget.current);
      }

      return () => observer.disconnect();
    }, [hasMore, isLoading, onLoadMore]);

    useEffect(() => {
      if (ref && typeof ref === "function") {
        ref(scrollContainerRef.current);
      } else if (ref) {
        ref.current = scrollContainerRef.current;
      }
    }, [ref]);

    return (
      <div
        ref={scrollContainerRef}
        className="absolute inset-0 overflow-y-auto"
      >
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm">
          {hasMore && <div ref={observerTarget} className="h-4" />}
          {isLoading && (
            <div className="text-center py-2 text-gray-500">Loading...</div>
          )}
        </div>
        <div
          className="relative w-full px-4 min-h-full"
          style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const [date, messages] = messageGroups[virtualRow.index];
            return (
              <div
                key={date}
                className="absolute top-0 left-0 w-full"
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                  paddingBottom: "16px",
                }}
              >
                <MessageGroup
                  date={date}
                  messages={messages}
                  keyPair={keyPair}
                  contactPublicKey={contactPublicKey}
                  isTyping={
                    isTyping && virtualRow.index === messageGroups.length - 1
                  }
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

MessageList.displayName = "MessageList";
