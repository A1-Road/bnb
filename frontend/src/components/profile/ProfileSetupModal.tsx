import { useState } from "react";
import { SetupSteps } from "./SetupSteps";
import { ProfileInfoForm } from "./ProfileInfoForm";
import { KeyGenerationStep } from "./KeyGenerationStep";
import { SetupCompleteModal } from "../common/SetupCompleteModal";

interface ProfileSetupModalProps {
  onComplete: () => void;
}

export const ProfileSetupModal = ({ onComplete }: ProfileSetupModalProps) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const handleGenerateKeys = async () => {
    setIsGenerating(true);
    try {
      // 鍵生成ロジック
      setShowBackupModal(true);
    } catch (error) {
      console.error("Failed to generate keys:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <SetupSteps currentStep={step} totalSteps={2} />

        {step === 0 && (
          <ProfileInfoForm
            name={name}
            setName={setName}
            avatar={avatar}
            setAvatar={setAvatar}
            onNext={() => setStep(1)}
          />
        )}

        {step === 1 && (
          <KeyGenerationStep
            isGenerating={isGenerating}
            showBackupModal={showBackupModal}
            setShowBackupModal={setShowBackupModal}
            onGenerateKeys={handleGenerateKeys}
            onComplete={() => setShowCompleteModal(true)}
          />
        )}

        {showCompleteModal && <SetupCompleteModal onClose={onComplete} />}
      </div>
    </div>
  );
};
