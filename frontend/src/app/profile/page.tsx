"use client";

import { useEffect, useState } from "react";
import WebApp from "@twa-dev/sdk";
import Image from "next/image";

interface Profile {
  id: string;
  name: string;
  username?: string;
  avatarUrl?: string;
  platform: "LINE" | "Telegram";
  bio?: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    WebApp.ready();
    WebApp.expand();
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile");
      if (!response.ok) throw new Error("Failed to fetch profile");
      const data = await response.json();
      setProfile(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!profile) {
    return <div className="p-4">Profile not found</div>;
  }

  return (
    <div className="min-h-screen bg-tg-theme-bg text-tg-theme-text p-4">
      <div className="flex flex-col items-center space-y-4">
        {profile.avatarUrl ? (
          <Image
            src={profile.avatarUrl}
            alt={profile.name}
            width={96}
            height={96}
            className="rounded-full"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-3xl text-gray-500">
              {profile.name.charAt(0)}
            </span>
          </div>
        )}
        <h1 className="text-2xl font-bold">{profile.name}</h1>
        {profile.username && (
          <p className="text-gray-500">@{profile.username}</p>
        )}
        {profile.bio && <p className="text-center">{profile.bio}</p>}
        <div className="text-sm text-gray-500">
          Connected via {profile.platform}
        </div>
      </div>
    </div>
  );
}
