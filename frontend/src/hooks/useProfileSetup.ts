import { useState } from "react";
import type { KeyPair } from "@/utils/encryption";

export interface ProfileData {
  photo: string | null;
  name: string;
  username: string;
  phone: string;
  bio: string;
}

export const useProfileSetup = () => {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<ProfileData>({
    photo: null,
    name: "",
    username: "",
    phone: "",
    bio: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [keyPair, setKeyPair] = useState<KeyPair>();

  const handlePhotoUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setProfile((prev) => ({ ...prev, photo: url }));
      }
    };
    input.click();
  };

  const handleGenerateKeys = async () => {
    setIsGenerating(true);
    try {
      const generatedKeyPair = { privateKey: "dummy", publicKey: "dummy" };
      setKeyPair(generatedKeyPair);
      setShowBackupModal(true);
    } catch (error) {
      console.error("Failed to generate keys:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    step,
    setStep,
    profile,
    setProfile,
    isGenerating,
    showBackupModal,
    setShowBackupModal,
    showCompleteModal,
    setShowCompleteModal,
    keyPair,
    handlePhotoUpload,
    handleGenerateKeys,
  };
};
