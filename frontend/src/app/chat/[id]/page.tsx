"use client";

import { useParams } from "next/navigation";
import { useChatRoom } from "@/hooks/useChatRoom";
import { ChatLayout } from "@/components/layout/ChatLayout";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatInput } from "@/components/chat/ChatInput";
import { MessageList } from "@/components/miniapp/MessageList";

interface PageParams {
  id: string;
  [key: string]: string | string[];
}

export default function ChatRoom() {
  const params = useParams<PageParams>();
  const {
    contact,
    messages,
    isLoadingMessages,
    isSending,
    sendError,
    loadError,
    hasMore,
    loadMore,
    isTyping,
    onlineStatus,
    isUserOnline,
    scrollRef,
    handleSendMessage,
    handleTyping,
  } = useChatRoom(params.id);

  return (
    <ChatLayout
      header={
        <ChatHeader
          contact={contact}
          isOnline={isUserOnline(contact?.id ?? "")}
          lastSeen={contact ? onlineStatus[contact.id]?.lastSeen : undefined}
        />
      }
      error={
        (sendError ?? loadError) && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-2">
            {sendError ?? loadError}
          </div>
        )
      }
      messages={
        <MessageList
          ref={scrollRef}
          messages={messages}
          hasMore={hasMore}
          isLoading={isLoadingMessages}
          onLoadMore={loadMore}
          isTyping={isTyping}
        />
      }
      input={
        <ChatInput
          contactName={contact?.name ?? ""}
          isLoading={isSending}
          onSubmit={handleSendMessage}
          onTyping={handleTyping}
        />
      }
    />
  );
}
