import type { Message } from "@/types/message";

type MessageGroup = [string, Message[]];

export function groupMessagesByDate(messages: Message[] = []): MessageGroup[] {
  if (!messages?.length) return [];

  const groups = messages.reduce((acc, message) => {
    const date = new Date(message.timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let dateString: string;
    if (date.toDateString() === today.toDateString()) {
      dateString = "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateString = "Yesterday";
    } else {
      dateString = date.toLocaleDateString();
    }

    if (!acc[dateString]) {
      acc[dateString] = [];
    }
    acc[dateString].push(message);
    return acc;
  }, {} as Record<string, Message[]>);

  return Object.entries(groups).sort((a, b) => {
    if (a[0] === "Today") return 1;
    if (b[0] === "Today") return -1;
    if (a[0] === "Yesterday") return 1;
    if (b[0] === "Yesterday") return -1;
    return new Date(b[0]).getTime() - new Date(a[0]).getTime();
  });
}
