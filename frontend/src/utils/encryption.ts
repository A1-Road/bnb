import { box, randomBytes } from "tweetnacl";
import { encodeBase64, decodeBase64 } from "tweetnacl-util";

export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

export const generateKeyPair = (): KeyPair => {
  const keyPair = box.keyPair();
  return {
    publicKey: encodeBase64(keyPair.publicKey),
    privateKey: encodeBase64(keyPair.secretKey),
  };
};

export const encryptMessage = (
  message: string,
  myPrivateKey: string,
  theirPublicKey: string
): string => {
  const nonce = randomBytes(box.nonceLength);
  const messageUint8 = new TextEncoder().encode(message);

  const encryptedMessage = box(
    messageUint8,
    nonce,
    decodeBase64(theirPublicKey),
    decodeBase64(myPrivateKey)
  );

  const fullMessage = new Uint8Array(nonce.length + encryptedMessage.length);
  fullMessage.set(nonce);
  fullMessage.set(encryptedMessage, nonce.length);

  return encodeBase64(fullMessage);
};

export const decryptMessage = (
  encryptedMessage: string,
  myPrivateKey: string,
  theirPublicKey: string
): string | null => {
  try {
    const messageWithNonceAsUint8 = decodeBase64(encryptedMessage);
    const nonce = messageWithNonceAsUint8.slice(0, box.nonceLength);
    const message = messageWithNonceAsUint8.slice(box.nonceLength);

    const decryptedMessage = box.open(
      message,
      nonce,
      decodeBase64(theirPublicKey),
      decodeBase64(myPrivateKey)
    );

    if (!decryptedMessage) return null;

    return new TextDecoder().decode(decryptedMessage);
  } catch (err) {
    console.error("Failed to decrypt message:", err);
    return null;
  }
};

export const encryptFile = async (
  file: File,
  myPrivateKey: string,
  theirPublicKey: string
): Promise<{ encryptedData: string; mimeType: string }> => {
  const buffer = await file.arrayBuffer();
  const fileData = new Uint8Array(buffer);
  const nonce = randomBytes(box.nonceLength);

  const encryptedFile = box(
    fileData,
    nonce,
    decodeBase64(theirPublicKey),
    decodeBase64(myPrivateKey)
  );

  const fullMessage = new Uint8Array(nonce.length + encryptedFile.length);
  fullMessage.set(nonce);
  fullMessage.set(encryptedFile, nonce.length);

  return {
    encryptedData: encodeBase64(fullMessage),
    mimeType: file.type,
  };
};

export const decryptFile = (
  encryptedData: string,
  mimeType: string,
  myPrivateKey: string,
  theirPublicKey: string
): Blob | null => {
  try {
    const messageWithNonceAsUint8 = decodeBase64(encryptedData);
    const nonce = messageWithNonceAsUint8.slice(0, box.nonceLength);
    const message = messageWithNonceAsUint8.slice(box.nonceLength);

    const decryptedData = box.open(
      message,
      nonce,
      decodeBase64(theirPublicKey),
      decodeBase64(myPrivateKey)
    );

    if (!decryptedData) return null;

    return new Blob([decryptedData], { type: mimeType });
  } catch (err) {
    console.error("Failed to decrypt file:", err);
    return null;
  }
};
