import { SetupSteps } from "./SetupSteps";
import { ProfileInfoForm } from "./ProfileInfoForm";
import { KeyGenerationStep } from "./KeyGenerationStep";
import { SetupCompleteModal } from "../common/SetupCompleteModal";
import type { ProfileData } from "@/hooks/useProfileSetup";
import type { KeyPair } from "@/utils/encryption";

interface ProfileSetupContentProps {
  step: number;
  profile: ProfileData;
  isGenerating: boolean;
  showBackupModal: boolean;
  showCompleteModal: boolean;
  keyPair: KeyPair | undefined;
  onProfileChange: (updates: Partial<ProfileData>) => void;
  onPhotoUpload: () => void;
  onStepComplete: () => void;
  setShowBackupModal: (show: boolean) => void;
  onComplete: () => void;
  onGenerateKeys: () => void;
}

export const ProfileSetupContent = ({
  step,
  profile,
  isGenerating,
  showBackupModal,
  showCompleteModal,
  keyPair,
  onProfileChange,
  onPhotoUpload,
  onStepComplete,
  setShowBackupModal,
  onComplete,
  onGenerateKeys,
}: ProfileSetupContentProps) => {
  return (
    <div className="bg-white rounded-lg p-6 w-full max-w-md">
      <SetupSteps currentStep={step} totalSteps={2} />

      {step === 0 && (
        <ProfileInfoForm
          profile={profile}
          onProfileChange={onProfileChange}
          onPhotoUpload={onPhotoUpload}
          onSubmit={onStepComplete}
        />
      )}

      {step === 1 && keyPair && (
        <KeyGenerationStep
          isGenerating={isGenerating}
          showBackupModal={showBackupModal}
          setShowBackupModal={setShowBackupModal}
          onGenerateKeys={onGenerateKeys}
          onComplete={onComplete}
          keyPair={keyPair}
        />
      )}

      {showCompleteModal && <SetupCompleteModal onComplete={onComplete} />}
    </div>
  );
};
