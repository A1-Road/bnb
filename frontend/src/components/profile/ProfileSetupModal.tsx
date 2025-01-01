"use client";

import { useProfileSetup } from "@/hooks/useProfileSetup";
import { ProfileSetupContent } from "./ProfileSetupContent";

interface ProfileSetupModalProps {
  onComplete: () => void;
}

export const ProfileSetupModal = ({ onComplete }: ProfileSetupModalProps) => {
  const {
    step,
    setStep,
    profile,
    setProfile,
    isGenerating,
    showBackupModal,
    setShowBackupModal,
    showCompleteModal,
    keyPair,
    handlePhotoUpload,
    handleGenerateKeys,
  } = useProfileSetup();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <ProfileSetupContent
        step={step}
        profile={profile}
        isGenerating={isGenerating}
        showBackupModal={showBackupModal}
        showCompleteModal={showCompleteModal}
        keyPair={keyPair}
        onProfileChange={(updates) =>
          setProfile((prev) => ({ ...prev, ...updates }))
        }
        onPhotoUpload={handlePhotoUpload}
        onStepComplete={() => setStep(1)}
        setShowBackupModal={setShowBackupModal}
        onComplete={onComplete}
        onGenerateKeys={handleGenerateKeys}
      />
    </div>
  );
};
