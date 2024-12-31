"use client";

import { useEffect, useState } from "react";
import WebApp from "@twa-dev/sdk";
import type { Contact } from "@/types/contact";
import { SiTelegram, SiLine } from "react-icons/si";
import Link from "next/link";
import { UserAvatar } from "@/components/common/UserAvatar";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

export default function Home() {
  const [chats, setChats] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isUserOnline } = useOnlineStatus();

  useEffect(() => {
    WebApp.ready();
    WebApp.expand();
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const response = await fetch("/api/contacts");
      if (!response.ok) throw new Error("Failed to fetch chats");
      const data = await response.json();
      setChats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-tg-theme-bg">
      <div className="fixed top-0 left-0 right-0 z-10 bg-[var(--tg-theme-bg-color)] border-b border-tg-border">
        <div className="p-4">
          <h1 className="text-xl font-semibold">Chats</h1>
        </div>
      </div>

      {/* ヘッダーの高さ分のスペーサー */}
      <div className="h-[60px]" />

      {/* チャット一覧 */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {chats.map((chat) => (
              <Link
                key={chat.id}
                href={`/chat/${chat.id}`}
                className="flex items-center p-4 w-full text-left hover:bg-tg-theme-text/5 cursor-pointer transition-colors"
              >
                <UserAvatar
                  name={chat.name}
                  avatarUrl={chat.avatarUrl}
                  isOnline={isUserOnline(chat.id)}
                />

                <div className="ml-4 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium truncate">{chat.name}</h3>
                      {chat.platform === "Telegram" ? (
                        <SiTelegram className="w-4 h-4 text-blue-500" />
                      ) : (
                        <SiLine className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(chat.lastActive).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  {chat.lastMessage && (
                    <p className="text-sm text-gray-500 truncate">
                      {chat.lastMessage}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
