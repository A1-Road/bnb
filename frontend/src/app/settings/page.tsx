"use client";

import { useEffect, useState } from "react";
import WebApp from "@twa-dev/sdk";
import { Button } from "@/components/common/Button";

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("ja");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    WebApp.ready();
    WebApp.expand();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notifications,
          language,
        }),
      });
      WebApp.showAlert("設定を保存しました");
    } catch (err) {
      WebApp.showAlert("設定の保存に失敗しました");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-tg-theme-bg text-tg-theme-text p-4">
      <h1 className="text-2xl font-bold mb-6">設定</h1>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="form-checkbox h-4 w-4"
            />
            <span>通知を受け取る</span>
          </label>
        </div>

        <div className="space-y-2">
          <label className="block">
            <span className="text-sm">言語</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="mt-1 block w-full p-2 bg-tg-theme-bg border border-tg-theme-button rounded-md"
            >
              <option value="ja">日本語</option>
              <option value="en">English</option>
            </select>
          </label>
        </div>

        <Button onClick={handleSave} disabled={isSaving} className="w-full">
          {isSaving ? "保存中..." : "設定を保存"}
        </Button>
      </div>
    </div>
  );
}
