import { useRef, useEffect, forwardRef, useState, useCallback } from "react";
import type { Message } from "@/types/message";
import { groupMessagesByDate } from "@/utils/messageGroups";
import { MessageGroup } from "@/components/chat/MessageGroup";
import { useVirtualizer } from "@tanstack/react-virtual";

interface MessageListProps {
  messages: Message[];
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  isTyping?: boolean;
}

function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  let lastFunc: (() => void) | null = null;
  let rafId: number | null = null;

  return function throttled(this: unknown, ...args: Parameters<T>): void {
    if (!inThrottle) {
      inThrottle = true;
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(() => {
        func.apply(this, args);
        rafId = null;
      });

      setTimeout(() => {
        inThrottle = false;
        if (lastFunc) {
          lastFunc();
          lastFunc = null;
        }
      }, limit);
    } else {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      lastFunc = () => {
        rafId = requestAnimationFrame(() => {
          func.apply(this, args);
          rafId = null;
        });
      };
    }
  };
}

export const MessageList = forwardRef<HTMLDivElement, MessageListProps>(
  ({ messages, hasMore, isLoading, onLoadMore, isTyping = false }, ref) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const messageGroups = groupMessagesByDate(messages);
    const lastScrollPosition = useRef(0);
    const scrollDirectionRef = useRef<"up" | "down">("down");
    const dateHeaderRef = useRef<HTMLDivElement>(null);

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

    const [currentDate, setCurrentDate] = useState<string>(
      messageGroups[0]?.[0] ?? ""
    );

    const handleScroll = useCallback(() => {
      if (!scrollContainerRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } =
        scrollContainerRef.current;

      const currentScrollPosition = scrollTop;
      scrollDirectionRef.current =
        currentScrollPosition > lastScrollPosition.current ? "down" : "up";
      lastScrollPosition.current = currentScrollPosition;

      const visibleGroups = Array.from(
        scrollContainerRef.current.querySelectorAll("[data-message-group]")
      );

      const stickyHeaderHeight = 40;
      const dateHeaderHeight = dateHeaderRef.current?.offsetHeight ?? 0;

      const visibleGroup = visibleGroups.find((group) => {
        const rect = group.getBoundingClientRect();
        const dateHeader = group.querySelector(".message-date");
        if (!dateHeader) return false;

        const dateHeaderRect = dateHeader.getBoundingClientRect();
        const isDateVisible =
          dateHeaderRect.top < stickyHeaderHeight + dateHeaderHeight;

        return isDateVisible && rect.top < window.innerHeight;
      });

      if (!visibleGroup) {
        setCurrentDate("");
        return;
      }

      if (dateHeaderRef.current) {
        const firstDateHeader =
          scrollContainerRef.current.querySelector(".message-date");
        if (firstDateHeader) {
          const firstDateRect = firstDateHeader.getBoundingClientRect();
          dateHeaderRef.current.style.opacity =
            firstDateRect.top < stickyHeaderHeight ? "1" : "0";
        }
      }

      const scrollProgress = scrollTop / (scrollHeight - clientHeight);
      const groupIndex = Math.min(
        Math.floor(scrollProgress * messageGroups.length),
        messageGroups.length - 1
      );

      if (messageGroups[groupIndex]?.[0] !== currentDate) {
        setCurrentDate(messageGroups[groupIndex]?.[0] ?? messageGroups[0][0]);
      }
    }, [messageGroups, currentDate]);

    const throttledHandleScroll = useCallback(() => {
      const throttledFn = throttle(handleScroll, 16);
      return throttledFn();
    }, [handleScroll]);

    useEffect(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      container.addEventListener("scroll", throttledHandleScroll);
      return () =>
        container.removeEventListener("scroll", throttledHandleScroll);
    }, [throttledHandleScroll]);

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
        <div className="sticky top-0 z-10">
          {hasMore && <div ref={observerTarget} className="h-4" />}
          {isLoading && (
            <div className="text-center py-2 text-gray-500">Loading...</div>
          )}
          {messageGroups.length > 0 && currentDate && (
            <div
              ref={dateHeaderRef}
              className="flex justify-center py-1 pointer-events-none transition-opacity duration-200"
            >
              <span className="text-xs text-gray-500 bg-gray-100/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                {currentDate}
              </span>
            </div>
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
                data-message-group
                className="absolute top-0 left-0 w-full"
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                  paddingBottom: "16px",
                }}
              >
                <MessageGroup
                  key={date}
                  date={date}
                  messages={messages}
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
