import { NextResponse } from "next/server";

const mockProfile = {
  id: "1",
  name: "John Doe",
  username: "johndoe",
  platform: "Telegram",
  bio: "Hello, I'm using LINE-Telegram Bridge!",
};

export async function GET() {
  return NextResponse.json(mockProfile);
}
