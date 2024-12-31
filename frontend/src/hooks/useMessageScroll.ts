import { useRef, useEffect } from "react";
import type { Message } from "@/types/message";

export const useMessageScroll = (messages: Message[], isLoading: boolean) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<string | null>(null);

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
