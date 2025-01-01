import { publicEncrypt, privateDecrypt } from "crypto";

export function encryptMessage(message: string, publicKey: string): string {
  try {
    if (!message) {
      throw new Error("Message is required");
    }
    if (!publicKey) {
      throw new Error("Public key is required");
    }
    const buffer = Buffer.from(message, "utf8");
    const encrypted = publicEncrypt(publicKey, buffer);
    return encrypted.toString("base64");
  } catch (error) {
    console.error("Failed to encrypt message:", error);
    throw new Error(
      error instanceof Error
        ? `Encryption failed: ${error.message}`
        : "Message encryption failed"
    );
  }
}

export function decryptMessage(
  encryptedMessage: string,
  privateKey: string
): string {
  try {
    if (!encryptedMessage) {
      throw new Error("Encrypted message is required");
    }
    if (!privateKey) {
      throw new Error("Private key is required");
    }
    const buffer = Buffer.from(encryptedMessage, "base64");
    const decrypted = privateDecrypt(privateKey, buffer);
    return decrypted.toString("utf8");
  } catch (error) {
    console.error("Failed to decrypt message:", error);
    throw new Error("Message decryption failed");
  }
}
