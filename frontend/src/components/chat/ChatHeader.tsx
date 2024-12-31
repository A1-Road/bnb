import Image from "next/image";
import { OnlineStatus } from "@/components/common/OnlineStatus";
import type { Contact } from "@/types/contact";

interface ChatHeaderProps {
  contact: Contact | null;
  isOnline: boolean;
  lastSeen?: string;
}

export const ChatHeader = ({ contact, isOnline, lastSeen }: Readonly<ChatHeaderProps>) => {
  if (!contact) return null;

  return (
    <div className="flex items-center gap-3 p-4">
      <div className="relative">
        {contact.avatarUrl ? (
          <Image
            src={contact.avatarUrl}
            alt={contact.name}
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-lg text-gray-500">
              {contact.name.charAt(0)}
            </span>
          </div>
        )}
        <div
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
            isOnline ? "bg-green-500" : "bg-gray-300"
          }`}
        />
      </div>
      <div>
        <h1 className="font-semibold">{contact.name}</h1>
        <OnlineStatus isOnline={isOnline} lastSeen={lastSeen} />
      </div>
    </div>
  );
};
