import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = process.env.BASE_URL;
  const response = NextResponse.redirect(new URL("/login", baseUrl));
  response.cookies.set("token", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });
  return response;
}

