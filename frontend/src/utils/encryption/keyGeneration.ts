export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

export async function generateKeyPair(): Promise<KeyPair> {
  try {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["encrypt", "decrypt"]
    );

    const publicKey = await window.crypto.subtle.exportKey(
      "spki",
      keyPair.publicKey
    );
    const privateKey = await window.crypto.subtle.exportKey(
      "pkcs8",
      keyPair.privateKey
    );

    return {
      publicKey: btoa(String.fromCharCode(...new Uint8Array(publicKey))),
      privateKey: btoa(String.fromCharCode(...new Uint8Array(privateKey))),
    };
  } catch (error) {
    console.error("Failed to generate key pair:", error);
    throw new Error("Key generation failed");
  }
}
