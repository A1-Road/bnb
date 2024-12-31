declare module "tweetnacl" {
  export const box: {
    (
      message: Uint8Array,
      nonce: Uint8Array,
      theirPublicKey: Uint8Array,
      myPrivateKey: Uint8Array
    ): Uint8Array;
    keyPair(): { publicKey: Uint8Array; secretKey: Uint8Array };
    nonceLength: number;
    open(
      message: Uint8Array,
      nonce: Uint8Array,
      theirPublicKey: Uint8Array,
      myPrivateKey: Uint8Array
    ): Uint8Array | null;
  };
  export function randomBytes(length: number): Uint8Array;
}

declare module "tweetnacl-util" {
  export function encodeBase64(input: Uint8Array): string;
  export function decodeBase64(input: string): Uint8Array;
}
