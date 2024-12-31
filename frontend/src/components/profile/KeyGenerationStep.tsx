import { Button } from "../common/Button";
import { KeyBackupModal } from "../common/KeyBackupModal";

interface KeyGenerationStepProps {
  isGenerating: boolean;
  showBackupModal: boolean;
  setShowBackupModal: (show: boolean) => void;
  onGenerateKeys: () => void;
  onComplete: () => void;
}

export const KeyGenerationStep = ({
  isGenerating,
  showBackupModal,
  setShowBackupModal,
  onGenerateKeys,
  onComplete,
}: KeyGenerationStepProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-center">Generate Keys</h2>
      <p className="text-center text-gray-600">
        Generate encryption keys to secure your messages
      </p>
      <Button
        onClick={onGenerateKeys}
        disabled={isGenerating}
        className="w-full"
      >
        {isGenerating ? "Generating..." : "Generate Keys"}
      </Button>
      {showBackupModal && (
        <KeyBackupModal
          onClose={() => setShowBackupModal(false)}
          onComplete={onComplete}
        />
      )}
    </div>
  );
};
