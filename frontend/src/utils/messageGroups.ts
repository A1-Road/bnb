import type { Message } from "@/types/message";

type MessageGroup = {
  date: string;
  messages: Message[];
};

export const groupMessagesByDate = (messages: Message[]): MessageGroup[] => {
  const groups: { [key: string]: Message[] } = {};

  messages.forEach((message) => {
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
      dateString = date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }

    if (!groups[dateString]) {
      groups[dateString] = [];
    }
    groups[dateString].push(message);
  });

  return Object.entries(groups).map(([date, messages]) => ({
    date,
    messages,
  }));
};
