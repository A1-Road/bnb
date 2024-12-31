import { useState, useEffect } from "react";
import { generateKeyPair, type KeyPair } from "@/utils/encryption";
import {
  getStoredKeyPair,
  storeKeyPair,
  rotateKeyPair,
  listBackups,
  type KeyBackup,
} from "@/utils/keyManagement";

interface EncryptionState {
  keyPair: KeyPair | undefined;
  backups: KeyBackup[];
  rotateKeys: () => void;
  restoreBackup: (backup: KeyBackup) => void;
  showInitialBackup: boolean;
  setShowInitialBackup: (show: boolean) => void;
}

export const useEncryption = (): EncryptionState => {
  const [keyPair, setKeyPair] = useState<KeyPair | undefined>(undefined);
  const [backups, setBackups] = useState<KeyBackup[]>([]);
  const [showInitialBackup, setShowInitialBackup] = useState(false);

  useEffect(() => {
    const stored = getStoredKeyPair();
    const hasSeenBackup = localStorage.getItem("key_backup_seen") === "true";
    const backupLater = localStorage.getItem("key_backup_later") === "true";

    if (stored) {
      setKeyPair(stored.keyPair);
      setBackups(listBackups());
    } else {
      const newKeyPair = generateKeyPair();
      storeKeyPair(newKeyPair);
      setKeyPair(newKeyPair);
      setBackups(listBackups());
      if (!hasSeenBackup && !backupLater) {
        setShowInitialBackup(true);
      }
    }
  }, []);

  const handleRotateKeys = () => {
    const newKeyPair = rotateKeyPair();
    setKeyPair(newKeyPair);
    setBackups(listBackups());
  };

  const restoreBackup = (backup: KeyBackup) => {
    storeKeyPair(backup.keyPair);
    setKeyPair(backup.keyPair);
  };

  return {
    keyPair,
    backups,
    rotateKeys: handleRotateKeys,
    restoreBackup,
    showInitialBackup,
    setShowInitialBackup,
  };
};
