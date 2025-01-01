import { generateKeyPair as generateRSAKeyPair } from "crypto";
import { promisify } from "util";

export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

const generateRSAKeyPairAsync = promisify(generateRSAKeyPair);

export async function generateKeyPair(): Promise<KeyPair> {
  try {
    const { publicKey, privateKey } = await generateRSAKeyPairAsync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    });

    return { publicKey, privateKey };
  } catch (error) {
    console.error("Failed to generate key pair:", error);
    throw new Error("Key generation failed");
  }
}
