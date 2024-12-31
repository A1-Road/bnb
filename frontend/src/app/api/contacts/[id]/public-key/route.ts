import { NextResponse } from "next/server";
import { generateKeyPair } from "@/utils/encryption";

const MOCK_KEYS = new Map<string, string>();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!MOCK_KEYS.has(params.id)) {
    const keyPair = generateKeyPair();
    MOCK_KEYS.set(params.id, keyPair.publicKey);
  }

  return NextResponse.json({ publicKey: MOCK_KEYS.get(params.id) });
}
