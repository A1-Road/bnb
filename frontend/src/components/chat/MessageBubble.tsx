import type { Message } from "@/types/message";
import Image from "next/image";
import { decryptMessage, decryptFile } from "@/utils/encryption";
import type { KeyPair } from "@/utils/encryption";
import { useState, useEffect } from "react";

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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

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
          const newObjectUrl = URL.createObjectURL(decryptedFile);
          setObjectUrl(newObjectUrl);
          mediaUrl = newObjectUrl;
        }
      }
    }

    switch (message.type) {
      case "image":
        return (
          <div className="space-y-2">
            <div className="relative aspect-video w-full max-w-[240px]">
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
              )}
              <Image
                src={mediaUrl ?? "/placeholder.png"}
                alt={content}
                width={240}
                height={180}
                className={`rounded-lg transition-opacity duration-200 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setImageLoaded(true)}
                loading="lazy"
                sizes="(max-width: 240px) 100vw, 240px"
                quality={75}
              />
            </div>
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

  const renderStatus = () => {
    switch (message.status) {
      case "sending":
        return <span className="ml-1 text-xs text-gray-400">⏳</span>;
      case "sent":
        return <span className="ml-1 text-xs text-gray-400">✓</span>;
      case "delivered":
        return <span className="ml-1 text-xs text-gray-400">✓✓</span>;
      case "read":
        return <span className="ml-1 text-xs text-blue-400">✓✓</span>;
      case "error":
        return (
          <span className="ml-1 text-xs text-red-500" title={message.error}>
            ⚠️
          </span>
        );
      default:
        return null;
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
        {renderStatus()}
      </div>
    </div>
  );
};
