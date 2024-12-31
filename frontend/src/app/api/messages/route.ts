import { NextResponse } from "next/server";
import type { Message, MessagesResponse } from "@/types/message";

export const mockMessages: Message[] = [
  {
    id: "1",
    content: "Hello! How are you?",
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    platform: "Telegram",
    userId: "1",
    type: "text",
  },
  {
    id: "2",
    content: "I'm doing great, thanks! How about you?",
    timestamp: new Date(Date.now() - 82800000).toISOString(), // 23 hours ago
    platform: "LINE",
    userId: "2",
    type: "text",
  },
  {
    id: "3",
    content: "Check out this photo!",
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    platform: "Telegram",
    userId: "1",
    type: "image",
    mediaUrl: "https://picsum.photos/400/300",
    thumbnailUrl: "https://picsum.photos/400/300",
  },
  {
    id: "4",
    content: "That's amazing!",
    timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    platform: "LINE",
    userId: "2",
    type: "text",
  },
  {
    id: "5",
    content: "Let's meet tomorrow",
    timestamp: new Date().toISOString(),
    platform: "Telegram",
    userId: "1",
    type: "text",
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor");
  const limit = Number(searchParams.get("limit")) || 20;

  let messages = [...mockMessages];

  // If cursor exists, return messages after that cursor
  if (cursor) {
    const cursorIndex = messages.findIndex((m) => m.id === cursor);
    if (cursorIndex !== -1) {
      messages = messages.slice(cursorIndex + 1);
    }
  }

  const hasMore = messages.length > limit;
  const slicedMessages = messages.slice(0, limit);

  const response: MessagesResponse = {
    messages: slicedMessages,
    hasMore,
    nextCursor: hasMore
      ? slicedMessages[slicedMessages.length - 1].id
      : undefined,
  };

  return NextResponse.json(response);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const message = formData.get("message") as string;
  const file = formData.get("file") as File | null;

  const newMessage: Message = {
    id: (mockMessages.length + 1).toString(),
    content: message,
    timestamp: new Date().toISOString(),
    platform: "Telegram",
    userId: "1",
    type: file ? "image" : "text",
    ...(file && {
      mediaUrl: URL.createObjectURL(file),
      thumbnailUrl: URL.createObjectURL(file),
    }),
  };

  mockMessages.push(newMessage);
  return NextResponse.json(newMessage);
}
