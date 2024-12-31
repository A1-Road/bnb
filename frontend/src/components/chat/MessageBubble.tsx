import type { Message } from "@/types/message";
import Image from "next/image";
import { decryptMessage, decryptFile } from "@/utils/encryption";
import type { KeyPair } from "@/utils/encryption";

interface MessageBubbleProps {
  message: Message;
  keyPair?: KeyPair;
  contactPublicKey?: string;
}

export const MessageBubble = ({
  message,
  keyPair,
  contactPublicKey,
}: Readonly<MessageBubbleProps>) => {
  const renderContent = () => {
    let content = message.content ?? "";
    let mediaUrl = message.mediaUrl;

    if (
      message.isEncrypted &&
      message.publicKey &&
      keyPair &&
      contactPublicKey
    ) {
      const decrypted = decryptMessage(
        content,
        keyPair.privateKey,
        message.publicKey
      );
      if (decrypted) content = decrypted;

      if (message.encryptedMedia) {
        const decryptedFile = decryptFile(
          message.encryptedMedia.data,
          message.encryptedMedia.mimeType,
          keyPair.privateKey,
          message.publicKey
        );
        if (decryptedFile) {
          mediaUrl = URL.createObjectURL(decryptedFile);
        }
      }
    }

    switch (message.type) {
      case "image":
        return (
          <div className="space-y-2">
            <Image
              src={mediaUrl ?? "/placeholder.png"}
              alt={content}
              width={240}
              height={180}
              className="rounded-lg"
            />
            {content && (
              <p className="text-sm whitespace-pre-wrap break-words">
                {content}
                {message.isEncrypted && (
                  <span className="ml-1 text-xs text-gray-400">🔒</span>
                )}
              </p>
            )}
          </div>
        );
      case "file":
        return (
          <div className="flex items-center gap-2">
            <a
              href={mediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              📎 {content}
            </a>
          </div>
        );
      default:
        return (
          <p className="text-sm whitespace-pre-wrap break-words">
            {content}
            {message.isEncrypted && (
              <span className="ml-1 text-xs text-gray-400">🔒</span>
            )}
          </p>
        );
    }
  };

  return (
    <div
      className={`flex ${
        message.senderId === "user1" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2 ${
          message.senderId === "user1"
            ? "bg-blue-500 text-white rounded-tr-none"
            : "bg-gray-100 text-gray-800 rounded-tl-none"
        }`}
      >
        {renderContent()}
      </div>
    </div>
  );
};
