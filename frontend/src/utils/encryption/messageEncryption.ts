import { publicEncrypt, privateDecrypt } from "crypto";

export function encryptMessage(message: string, publicKey: string): string {
  try {
    const buffer = Buffer.from(message, "utf8");
    if (!publicKey) {
      throw new Error("Public key is required");
    }
    const encrypted = publicEncrypt(publicKey, buffer);
    return encrypted.toString("base64");
  } catch (error) {
    console.error("Failed to encrypt message:", error);
    throw new Error("Message encryption failed");
  }
}

export function decryptMessage(
  encryptedMessage: string,
  privateKey: string
): string {
  try {
    const buffer = Buffer.from(encryptedMessage, "base64");
    const decrypted = privateDecrypt(privateKey, buffer);
    return decrypted.toString("utf8");
  } catch (error) {
    console.error("Failed to decrypt message:", error);
    throw new Error("Message decryption failed");
  }
}
