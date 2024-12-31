import { generateKeyPair, type KeyPair } from "./encryption";

const KEY_STORAGE_KEY = "encryption_keys";
const BACKUP_KEY_PREFIX = "backup_key_";

export interface KeyBackup {
  keyPair: KeyPair;
  timestamp: string;
  deviceId: string;
}

export const generateDeviceId = () => {
  return `${navigator.userAgent.split(/[()]/)[1]}_${new Date().getTime()}`;
};

export const storeKeyPair = (keyPair: KeyPair) => {
  const deviceId = localStorage.getItem("device_id") ?? generateDeviceId();
  localStorage.setItem("device_id", deviceId);

  const backup: KeyBackup = {
    keyPair,
    timestamp: new Date().toISOString(),
    deviceId,
  };

  // 現在の鍵を保存
  localStorage.setItem(KEY_STORAGE_KEY, JSON.stringify(backup));

  // バックアップとして保存（最大3世代）
  const backupKey = `${BACKUP_KEY_PREFIX}${new Date().getTime()}`;
  localStorage.setItem(backupKey, JSON.stringify(backup));

  // 古いバックアップを削除
  cleanupOldBackups();
};

export const getStoredKeyPair = (): KeyBackup | null => {
  const stored = localStorage.getItem(KEY_STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const rotateKeyPair = (): KeyPair => {
  const newKeyPair = generateKeyPair();
  storeKeyPair(newKeyPair);
  return newKeyPair;
};

export const listBackups = (): KeyBackup[] => {
  const backups: KeyBackup[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(BACKUP_KEY_PREFIX)) {
      const backup = JSON.parse(localStorage.getItem(key) ?? "");
      backups.push(backup);
    }
  }
  return backups.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

const cleanupOldBackups = () => {
  const backups = listBackups();
  if (backups.length > 3) {
    backups.slice(3).forEach((backup) => {
      const key = `${BACKUP_KEY_PREFIX}${new Date(backup.timestamp).getTime()}`;
      localStorage.removeItem(key);
    });
  }
};
