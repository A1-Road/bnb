"use client";

import { useEffect, useState } from "react";
import WebApp from "@twa-dev/sdk";
import { Button } from "@/components/common/Button";

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
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
        }),
      });
      WebApp.showAlert("Settings saved successfully");
    } catch (err) {
      console.error(err);
      WebApp.showAlert("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-tg-theme-bg text-tg-theme-text p-4">
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="form-checkbox h-4 w-4"
            />
            <span>Receive notifications</span>
          </label>
        </div>

        <Button onClick={handleSave} disabled={isSaving} className="w-full">
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}
