import { NextResponse } from "next/server";
import { mockContacts } from "@/mocks/data";

export async function GET() {
  return NextResponse.json(mockContacts);
}
