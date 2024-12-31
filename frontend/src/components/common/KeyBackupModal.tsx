import { useState } from "react";
import { Button } from "./Button";
import type { KeyPair } from "@/utils/encryption";

interface KeyBackupModalProps {
  keyPair: KeyPair;
  onClose: () => void;
}

export const KeyBackupModal = ({
  keyPair,
  onClose,
}: Readonly<KeyBackupModalProps>) => {
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full space-y-4">
        <h2 className="text-xl font-semibold text-center">
          Keep your private account key
        </h2>
        <p className="text-gray-600 text-center">
          This key will be used to login your Social Account
        </p>

        {!showKey ? (
          <div className="flex justify-center gap-2">
            <Button onClick={() => setShowKey(true)}>Show</Button>
            <Button
              variant="secondary"
              onClick={() => {
                localStorage.setItem("key_backup_later", "true");
                onClose();
              }}
            >
              Later
            </Button>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </div>
        ) : (
          <>
            <div className="bg-gray-100 p-4 rounded-lg break-all text-sm font-mono">
              {keyPair.privateKey}
            </div>
            <div className="flex justify-center">
              <Button onClick={onClose}>Done</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
