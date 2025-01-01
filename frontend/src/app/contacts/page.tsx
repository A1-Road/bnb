"use client";

import { useEffect, useState } from "react";
import WebApp from "@twa-dev/sdk";
import Image from "next/image";
import Link from "next/link";
import type { Contact } from "@/types/contact";
import { SiTelegram, SiLine } from "react-icons/si";

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    WebApp.ready();
    WebApp.expand();
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch("/api/contacts");
      if (!response.ok) throw new Error("Failed to fetch contacts");
      const data = await response.json();
      setContacts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-tg-theme-bg">
      <div className="fixed top-0 left-0 right-0 z-10 bg-tg-theme-bg border-b border-gray-200">
        <div className="p-4">
          <h1 className="text-xl font-semibold">Friends</h1>
        </div>
      </div>

      {/* ヘッダーの高さ分のスペーサー */}
      <div className="h-[60px]" />

      {/* 連絡先一覧 */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {contacts.map((contact) => (
              <Link
                key={contact.id}
                href={`/chat/${contact.id}`}
                className="flex items-center p-4 w-full text-left hover:bg-tg-theme-text/5 cursor-pointer transition-colors"
              >
                <div className="relative">
                  {contact.avatarUrl ? (
                    <Image
                      src={contact.avatarUrl}
                      alt={contact.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-lg text-gray-500">
                        {contact.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                      new Date(contact.lastActive) >
                      new Date(Date.now() - 300000)
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  />
                </div>

                <div className="ml-4 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium truncate">{contact.name}</h3>
                      <span
                        className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded ${
                          contact.platform === "Telegram"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {contact.platform === "Telegram" ? (
                          <SiTelegram className="w-3.5 h-3.5" />
                        ) : (
                          <SiLine className="w-3.5 h-3.5" />
                        )}
                        {contact.platform}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(contact.lastActive).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  {contact.lastMessage && (
                    <p className="text-sm text-gray-500 truncate">
                      {contact.lastMessage}
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
