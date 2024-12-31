import { ReactNode } from "react";

export const CHAT_LAYOUT = {
  HEADER_HEIGHT: 72,
  INPUT_HEIGHT: 88,
  BOTTOM_NAV_HEIGHT: 64,
} as const;

interface ChatLayoutProps {
  header: ReactNode;
  messages: ReactNode;
  input: ReactNode;
  error?: ReactNode;
}

export const ChatLayout = ({
  header,
  messages,
  input,
  error,
}: Readonly<ChatLayoutProps>) => {
  return (
    <div className="flex flex-col h-screen bg-tg-theme-bg">
      {/* ヘッダー - fixed */}
      <div className="fixed top-0 left-0 right-0 z-10 h-[72px] bg-[var(--tg-theme-bg-color)] border-b border-tg-border">
        {header}
      </div>

      {/* メッセージエリア - fixed boundaries */}
      <div className="fixed top-[72px] bottom-[104px] left-0 right-0 z-0">
        {error}
        {messages}
      </div>

      {/* 入力エリア - fixed */}
      <div className="fixed bottom-16 left-0 right-0 z-10 border-t border-tg-border">
        <div className="bg-[var(--tg-theme-bg-color)]">{input}</div>
      </div>
    </div>
  );
};
