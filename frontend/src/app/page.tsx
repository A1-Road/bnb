"use client";

import { useEffect } from "react";
import WebApp from "@twa-dev/sdk";

export default function Home() {
  useEffect(() => {
    WebApp.ready();
    WebApp.expand();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-tg-theme-bg">
      <div className="fixed top-0 left-0 right-0 z-10 bg-tg-theme-bg border-b border-gray-200">
        <div className="p-4">
          <h1 className="text-xl font-semibold">Home</h1>
        </div>
      </div>

      {/* ヘッダーの高さ分のスペーサー */}
      <div className="h-[60px]" />

      {/* コンテンツエリア */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* ここに新しいコンテンツを追加していきます */}
      </div>
    </div>
  );
}
