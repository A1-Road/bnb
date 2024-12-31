import { useEffect, useRef, useCallback } from "react";
import { Message } from "@/types/message";
import { groupMessagesByDate } from "@/utils/messageGroups";
import { decryptMessage, decryptFile } from "@/utils/encryption";
import type { KeyPair } from "@/utils/encryption";
import Image from "next/image";

interface MessageListProps {
  messages: Message[];
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  keyPair?: KeyPair;
  contactPublicKey?: string;
}

export const MessageList = ({
  messages,
  hasMore,
  isLoading,
  onLoadMore,
  keyPair,
  contactPublicKey,
}: Readonly<MessageListProps>) => {
  const observerTarget = useRef<HTMLDivElement>(null);
  const messageGroups = groupMessagesByDate(messages);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !isLoading) {
        onLoadMore();
      }
    },
    [hasMore, isLoading, onLoadMore]
  );

  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 1.0,
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [handleObserver]);

  const renderMessageContent = (message: Message) => {
    let content = message.content;
    let mediaUrl = message.mediaUrl;

    // メッセージの復号化
    if (message.encrypted && message.publicKey && keyPair && contactPublicKey) {
      // テキストの復号化
      const decrypted = decryptMessage(
        content,
        keyPair.privateKey,
        message.publicKey
      );
      if (decrypted) content = decrypted;

      // メディアの復号化
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
            <button
              onClick={() => window.open(message.mediaUrl, "_blank")}
              className="block"
            >
              <Image
                src={mediaUrl ?? "/placeholder.png"}
                alt={message.content}
                width={240}
                height={180}
                className="rounded-lg hover:opacity-90 transition-opacity"
              />
            </button>
            {message.content && (
              <p className="text-sm whitespace-pre-wrap break-words">
                {content}
                {message.encrypted && (
                  <span className="ml-1 text-xs text-gray-400">🔒</span>
                )}
              </p>
            )}
          </div>
        );
      case "video":
        return (
          <div className="space-y-2">
            <video src={mediaUrl} controls className="rounded-lg max-w-[240px]">
              <track
                kind="captions"
                src="/captions/default.vtt"
                srcLang="en"
                label="English"
                default
              />
            </video>
            {message.content && (
              <p className="text-sm whitespace-pre-wrap break-words">
                {content}
                {message.encrypted && (
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
              href={message.mediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              📎 {message.content}
            </a>
          </div>
        );
      default:
        return (
          <p className="text-sm whitespace-pre-wrap break-words">
            {content}
            {message.encrypted && (
              <span className="ml-1 text-xs text-gray-400">🔒</span>
            )}
          </p>
        );
    }
  };

  return (
    <div className="space-y-6">
      {messageGroups.map(({ date, messages }) => (
        <div key={date} className="space-y-4">
          <div className="flex items-center justify-center">
            <div className="px-4 py-1 rounded-full bg-gray-100 text-gray-500 text-xs">
              {date}
            </div>
          </div>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.platform === "Telegram"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                  message.platform === "Telegram"
                    ? "bg-blue-500 text-white rounded-tr-none"
                    : "bg-gray-100 text-gray-800 rounded-tl-none"
                }`}
              >
                {renderMessageContent(message)}
                <div
                  className={`text-xs mt-1 ${
                    message.platform === "Telegram"
                      ? "text-blue-100"
                      : "text-gray-500"
                  }`}
                >
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
      <div ref={observerTarget} className="h-4" />
      {isLoading && (
        <div className="text-center py-4 text-gray-500">Loading...</div>
      )}
    </div>
  );
};
