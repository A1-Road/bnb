import { NextResponse } from "next/server";
import { mockMessages } from "@/mocks/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor");
  const limit = parseInt(searchParams.get("limit") ?? "20");

  let messages = [...mockMessages];
  if (cursor) {
    const cursorIndex = messages.findIndex((m) => m.id === cursor);
    if (cursorIndex !== -1) {
      messages = messages.slice(cursorIndex + 1);
    }
  }

  const hasMore = messages.length > limit;
  const nextCursor = hasMore ? messages[limit - 1].id : undefined;
  messages = messages.slice(0, limit);

  return NextResponse.json({
    messages,
    hasMore,
    nextCursor,
  });
}
