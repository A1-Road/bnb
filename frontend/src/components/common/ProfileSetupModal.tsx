import { useState } from "react";
import { Button } from "./Button";
import Image from "next/image";
import WebApp from "@twa-dev/sdk";

interface ProfileSetupModalProps {
  onComplete: () => void;
}

interface ProfileData {
  photo: string | null;
  name: string;
  username: string;
  phone: string;
  bio: string;
}

export const ProfileSetupModal = ({ onComplete }: ProfileSetupModalProps) => {
  const [step, setStep] = useState<"setup" | "complete">("setup");
  const [profile, setProfile] = useState<ProfileData>({
    photo: null,
    name: "",
    username: "",
    phone: "",
    bio: "",
  });

  const handlePhotoUpload = () => {
    WebApp.showPopup(
      {
        title: "Upload Photo",
        message: "Choose a profile photo",
        buttons: [
          { id: "camera", type: "default", text: "Take Photo" },
          { id: "gallery", type: "default", text: "Choose from Gallery" },
          { id: "cancel", type: "cancel" },
        ],
      },
      (buttonId) => {
        if (buttonId === "camera" || buttonId === "gallery") {
          // 実際のアプリではここでファイル選択を実装
          setProfile((prev) => ({
            ...prev,
            photo: "https://picsum.photos/200",
          }));
        }
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // ここでプロフィール情報を保存
    setStep("complete");
  };

  if (step === "complete") {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <span className="text-2xl">✓</span>
        </div>
        <h2 className="text-2xl font-semibold mb-2">You&apos;re all set!</h2>
        <p className="text-gray-600 mb-8">Let&apos;s start your journey.</p>
        <Button onClick={onComplete} className="w-full max-w-xs animate-pulse">
          Tap to start
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="max-w-md mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Set up your profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handlePhotoUpload}
              className="relative group"
            >
              {profile.photo ? (
                <Image
                  src={profile.photo}
                  alt="Profile"
                  width={100}
                  height={100}
                  className="rounded-full"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-3xl text-gray-400">+</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white text-sm">Change</span>
              </div>
            </button>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={profile.name}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full p-3 rounded-lg border border-gray-300 focus:border-blue-500 outline-none"
              required
            />
            <input
              type="text"
              placeholder="Username"
              value={profile.username}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, username: e.target.value }))
              }
              className="w-full p-3 rounded-lg border border-gray-300 focus:border-blue-500 outline-none"
              required
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={profile.phone}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, phone: e.target.value }))
              }
              className="w-full p-3 rounded-lg border border-gray-300 focus:border-blue-500 outline-none"
              required
            />
            <textarea
              placeholder="Bio"
              value={profile.bio}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, bio: e.target.value }))
              }
              className="w-full p-3 rounded-lg border border-gray-300 focus:border-blue-500 outline-none resize-none h-24"
            />
          </div>

          <Button type="submit" className="w-full">
            FINISH
          </Button>
        </form>
      </div>
    </div>
  );
};
