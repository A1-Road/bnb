import { NextResponse } from "next/server";
import { mockProfile } from "@/mocks/data";

export async function GET() {
  return NextResponse.json(mockProfile);
}
