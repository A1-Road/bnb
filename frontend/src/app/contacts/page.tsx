"use client";

import { useEffect, useState } from "react";
import WebApp from "@twa-dev/sdk";
import type { Contact } from "@/types/contact";
import Image from "next/image";
import { SiTelegram, SiLine } from "react-icons/si";
import { useRouter } from "next/navigation";

export default function Contacts() {
  const router = useRouter();
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

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-tg-theme-bg text-tg-theme-text">
      <h1 className="p-4 text-2xl font-bold">List of Friends</h1>
      <div className="divide-y divide-gray-200">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            onClick={() => router.push(`/chat/${contact.id}`)}
            className={`flex items-center p-4 cursor-pointer ${
              contact.platform === "Telegram"
                ? "hover:bg-blue-50"
                : "hover:bg-green-50"
            }`}
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
                  <span className="text-xl text-gray-500">
                    {contact.name.charAt(0)}
                  </span>
                </div>
              )}
              <div
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                  new Date(contact.lastActive) > new Date(Date.now() - 300000)
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              />
            </div>
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{contact.name}</h3>
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
                  {new Date(contact.lastActive).toLocaleString()}
                </span>
              </div>
              {contact.lastMessage && (
                <p className="text-sm text-gray-500 truncate">
                  {contact.lastMessage}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
