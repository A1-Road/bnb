import { NextResponse } from "next/server";
import type { Contact } from "@/types/contact";

const mockContacts: Contact[] = [
  {
    id: "1",
    name: "John Doe",
    platform: "Telegram",
    lastActive: new Date().toISOString(),
    lastMessage: "Hello there!",
  },
  {
    id: "2",
    name: "Jane Smith",
    platform: "LINE",
    lastActive: new Date(Date.now() - 3600000).toISOString(), // 1時間前
    lastMessage: "See you tomorrow!",
  },
  {
    id: "3",
    name: "Bob Johnson",
    platform: "Telegram",
    lastActive: new Date(Date.now() - 86400000).toISOString(), // 1日前
  },
];

export async function GET() {
  return NextResponse.json(mockContacts);
}
