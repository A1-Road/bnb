import { NextResponse } from "next/server";
import type { Contact } from "@/types/contact";
import { mockMessages } from "../messages/route";
import type { Message } from "@/types/message";

const getMessagePreview = (message: Message | undefined) => {
  if (!message) return undefined;

  switch (message.type) {
    case "text":
      return message.content;
    case "image":
      return "📷 Photo";
    case "video":
      return "🎥 Video";
    case "file":
      return "📎 File";
    default:
      return `📤 Sent a ${message.type}`;
  }
};

export const mockContacts: Contact[] = [
  {
    id: "1",
    name: "John Doe",
    platform: "Telegram",
    lastActive: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Jane Smith",
    platform: "LINE",
    lastActive: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "3",
    name: "Bob Johnson",
    platform: "Telegram",
    lastActive: new Date(Date.now() - 86400000).toISOString(),
  },
];

export async function GET() {
  const contactsWithLastMessage = mockContacts.map((contact) => {
    const contactMessages = mockMessages
      .filter((msg) => msg.userId === contact.id)
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

    const lastMessage = contactMessages[0];

    return {
      ...contact,
      lastMessage: getMessagePreview(contactMessages[0]),
      lastMessageTime: lastMessage?.timestamp,
    };
  });

  contactsWithLastMessage.sort((a, b) => {
    const timeA = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
    const timeB = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
    return timeB - timeA;
  });

  return NextResponse.json(contactsWithLastMessage);
}
