import { Button } from "./Button";

interface SetupCompleteModalProps {
  onComplete: () => void;
}

export const SetupCompleteModal = ({ onComplete }: SetupCompleteModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full space-y-4 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl">✓</span>
        </div>
        <h2 className="text-2xl font-semibold">You&apos;re all set!</h2>
        <p className="text-gray-600">Let&apos;s start your journey.</p>
        <Button onClick={onComplete} className="w-full max-w-xs animate-pulse">
          Tap to start
        </Button>
      </div>
    </div>
  );
};
