import { NextResponse } from "next/server";
import { generateKeyPair } from "@/utils/encryption";
import { mockKeys } from "@/mocks/data";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!mockKeys.has(params.id)) {
    const keyPair = generateKeyPair();
    mockKeys.set(params.id, keyPair.publicKey);
  }

  return NextResponse.json({ publicKey: mockKeys.get(params.id) });
}
