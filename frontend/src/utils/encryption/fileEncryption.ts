import { randomBytes, createCipheriv, createDecipheriv } from "crypto";
import { KeyManager } from "./keyManagement";

const ALGORITHM = "aes-256-gcm";
const keyManager = KeyManager.getInstance();
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export interface EncryptedFile {
  data: string;
  iv: string;
  authTag: string;
}

export async function encryptFile(file: File): Promise<EncryptedFile> {
  try {
    if (!file || file.size === 0) {
      throw new Error("Invalid file");
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("File too large");
    }
    const key = await keyManager.getEncryptionKey();
    const iv = randomBytes(12);
    const cipher = createCipheriv(ALGORITHM, key, iv);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);

    return {
      data: encrypted.toString("base64"),
      iv: iv.toString("base64"),
      authTag: cipher.getAuthTag().toString("base64"),
    };
  } catch (error) {
    console.error("Failed to encrypt file:", error);
    throw new Error("File encryption failed");
  }
}

export async function decryptFile(
  encryptedData: EncryptedFile,
  mimeType: string
): Promise<File> {
  try {
    const key = await keyManager.getEncryptionKey();
    const iv = Buffer.from(encryptedData.iv, "base64");
    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(Buffer.from(encryptedData.authTag, "base64"));

    const data = Buffer.from(encryptedData.data, "base64");
    const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);

    return new File([decrypted], "decrypted-file", { type: mimeType });
  } catch (error) {
    console.error("Failed to decrypt file:", error);
    throw new Error("File decryption failed");
  }
}
