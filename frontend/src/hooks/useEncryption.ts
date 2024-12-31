import { useState, useEffect } from "react";
import { generateKeyPair, type KeyPair } from "@/utils/encryption";

const KEY_STORAGE_KEY = "encryption_keys";

export const useEncryption = () => {
  const [keyPair, setKeyPair] = useState<KeyPair | null>(null);

  useEffect(() => {
    // ローカルストレージからキーペアを取得
    const storedKeys = localStorage.getItem(KEY_STORAGE_KEY);
    if (storedKeys) {
      setKeyPair(JSON.parse(storedKeys));
    } else {
      // 新しいキーペアを生成
      const newKeyPair = generateKeyPair();
      localStorage.setItem(KEY_STORAGE_KEY, JSON.stringify(newKeyPair));
      setKeyPair(newKeyPair);
    }
  }, []);

  return keyPair;
};
