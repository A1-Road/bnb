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
}

export const useEncryption = (): EncryptionState => {
  const [keyPair, setKeyPair] = useState<KeyPair | undefined>(undefined);
  const [backups, setBackups] = useState<KeyBackup[]>([]);

  useEffect(() => {
    // 保存された鍵を取得
    const stored = getStoredKeyPair();
    if (stored) {
      setKeyPair(stored.keyPair);
      setBackups(listBackups());
    } else {
      // 新しい鍵ペアを生成
      const newKeyPair = generateKeyPair();
      storeKeyPair(newKeyPair);
      setKeyPair(newKeyPair);
      setBackups(listBackups());
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
  };
};
