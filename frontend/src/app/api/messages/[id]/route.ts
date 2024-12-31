import { NextResponse } from "next/server";
import { mockMessages } from "@/mocks/data";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor");
  const limit = parseInt(searchParams.get("limit") ?? "20");

  // 特定のユーザーとの会話を取得（送信者または受信者が指定されたIDの場合）
  let messages = mockMessages.filter(
    (m) => m.senderId === params.id || m.senderId === "user1"
  );

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
