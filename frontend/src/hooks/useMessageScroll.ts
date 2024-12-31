import { useRef, useEffect } from "react";
import type { Message } from "@/types/message";

export const useMessageScroll = (messages: Message[], isLoading: boolean) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<string | null>(null);
  const scrollPositionRef = useRef<number>(0);

  // スクロール位置の保存
  const handleScroll = () => {
    if (scrollRef.current) {
      scrollPositionRef.current = scrollRef.current.scrollTop;
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // ローディング後のスクロール位置復元
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || isLoading) return;

    if (scrollPositionRef.current > 0) {
      container.scrollTop = scrollPositionRef.current;
    }
  }, [isLoading]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || isLoading) return;

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) return;

    // 新しいメッセージが追加された場合のみスクロール
    if (lastMessageRef.current !== lastMessage.id) {
      const shouldScroll =
        container.scrollHeight - container.scrollTop <=
        container.clientHeight + 100;

      if (shouldScroll) {
        requestAnimationFrame(() => {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: "smooth",
          });
        });
      }
      lastMessageRef.current = lastMessage.id;
    }
  }, [messages, isLoading]);

  return scrollRef;
};
