import { NextResponse } from "next/server";
import { mockContacts } from "@/mocks/data";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const contact = mockContacts.find((c) => c.id === params.id);

  if (!contact) {
    return new NextResponse("Contact not found", { status: 404 });
  }

  return NextResponse.json(contact);
}
