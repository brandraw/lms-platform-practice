import "server-only";

import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface sessionProps {
  id?: number;
}

export function getSession() {
  return getIronSession<sessionProps>(cookies(), {
    cookieName: "session",
    password: process.env.COOKIE_PASSWORD!,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 60 * 60 * 6,
    },
  });
}
