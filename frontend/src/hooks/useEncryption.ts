import { useState, useEffect } from "react";
import type { KeyPair } from "@/utils/encryption";
import {
  getStoredKeyPair,
  storeKeyPair,
} from "@/utils/encryption/keyManagement";

interface EncryptionState {
  keyPair: KeyPair | undefined;
  showInitialBackup: boolean;
  setShowInitialBackup: (show: boolean) => void;
}

export const useEncryption = (): EncryptionState => {
  const [keyPair, setKeyPair] = useState<KeyPair | undefined>(undefined);
  const [showInitialBackup, setShowInitialBackup] = useState(false);

  useEffect(() => {
    const stored = getStoredKeyPair();
    const hasSeenBackup = localStorage.getItem("key_backup_seen") === "true";
    const backupLater = localStorage.getItem("key_backup_later") === "true";

    if (stored) {
      setKeyPair(stored.keyPair);
    } else {
      const dummyKeyPair: KeyPair = {
        publicKey: "dummy-public-key",
        privateKey: "dummy-private-key",
      };
      storeKeyPair(dummyKeyPair);
      setKeyPair(dummyKeyPair);
      if (!hasSeenBackup && !backupLater) {
        setShowInitialBackup(true);
      }
    }
  }, []);

  return {
    keyPair,
    showInitialBackup,
    setShowInitialBackup,
  };
};
