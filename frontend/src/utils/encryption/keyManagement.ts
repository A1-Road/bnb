import { randomBytes } from "crypto";
import type { KeyPair } from "./keyGeneration";

interface KeyStore {
  encryptionKey: Buffer;
  keyId: string;
  createdAt: Date;
}

export function storeKeyPair(keyPair: KeyPair): void {
  localStorage.setItem("keyPair", JSON.stringify(keyPair));
}

export function getStoredKeyPair(): { keyPair: KeyPair } | null {
  const stored = localStorage.getItem("keyPair");
  return stored ? { keyPair: JSON.parse(stored) } : null;
}

export class KeyManager {
  private static instance: KeyManager;
  private currentKey: KeyStore | null = null;

  private constructor() {}

  static getInstance(): KeyManager {
    if (!this.instance) {
      this.instance = new KeyManager();
    }
    return this.instance;
  }

  async getEncryptionKey(): Promise<Buffer> {
    if (!this.currentKey || this.isKeyExpired(this.currentKey)) {
      this.currentKey = await this.generateNewKey();
    }
    return this.currentKey.encryptionKey;
  }

  private isKeyExpired(keyStore: KeyStore): boolean {
    const KEY_EXPIRY_HOURS = 24;
    const expiryTime = new Date(keyStore.createdAt);
    expiryTime.setHours(expiryTime.getHours() + KEY_EXPIRY_HOURS);
    return new Date() > expiryTime;
  }

  private async generateNewKey(): Promise<KeyStore> {
    return {
      encryptionKey: randomBytes(32),
      keyId: randomBytes(16).toString("hex"),
      createdAt: new Date(),
    };
  }
}
