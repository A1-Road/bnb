import type { Contact } from "@/types/contact";

export const mockContacts: Contact[] = [
  {
    id: "user1",
    name: "John Doe",
    username: "@johndoe",
    lastSeen: new Date().toISOString(),
    lastMessage: "Sure Mike! I've prepared some analytics:",
    unreadCount: 2,
    isOnline: true,
    platform: "Telegram",
    lastActive: new Date().toISOString(),
  },
  {
    id: "user2",
    name: "Jane Smith",
    username: "@janesmith",
    avatarUrl: "https://picsum.photos/200?2",
    lastSeen: new Date(Date.now() - 3600000).toISOString(),
    lastMessage: "Perfect! Let's schedule a meeting to discuss the next steps.",
    unreadCount: 0,
    isOnline: false,
    platform: "LINE",
    lastActive: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "user3",
    name: "Mike Johnson",
    username: "@mikej",
    lastSeen: new Date(Date.now() - 7200000).toISOString(),
    lastMessage: "Hi John, got a minute to discuss the marketing strategy? 📊",
    unreadCount: 1,
    isOnline: true,
    platform: "Telegram",
    lastActive: new Date(Date.now() - 7200000).toISOString(),
  },
];
