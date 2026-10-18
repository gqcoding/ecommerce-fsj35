import { NextResponse } from "next/server";
import { cookies } from "next/headers";
export async function GET() {
  const store = await cookies();
  const token = store.get(process.env.AUTH_COOKIE_NAME || "ecommerce_token")?.value;
  return NextResponse.json({ authenticated: Boolean(token) });
}
export async function DELETE() {
  const store = await cookies();
  store.delete(process.env.AUTH_COOKIE_NAME || "ecommerce_token");
  return NextResponse.json({ success: true });
}