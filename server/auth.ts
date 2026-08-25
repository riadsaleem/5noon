import { parse as parseCookieHeader } from "cookie";
import type { Request } from "express";
import { jwtVerify } from "jose";
import { COOKIE_NAME, ONE_YEAR_MS } from "../shared/const";
import type { User } from "../drizzle/schema";
import * as db from "./db";

// JWT secret: same value as before, overridable via env.
export const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "khamsanoon-secret-key-2024"
);

export const SESSION_MAX_AGE_MS = ONE_YEAR_MS;

type SessionPayload = {
  openId: string;
  appId: string;
  name: string;
};

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.length > 0;

function parseCookies(cookieHeader: string | undefined) {
  if (!cookieHeader) {
    return new Map<string, string>();
  }
  const parsed = parseCookieHeader(cookieHeader);
  return new Map(Object.entries(parsed));
}

async function verifySession(
  cookieValue: string | undefined | null
): Promise<SessionPayload | null> {
  if (!cookieValue) return null;

  try {
    const { payload } = await jwtVerify(cookieValue, JWT_SECRET, {
      algorithms: ["HS256"],
    });
    const { openId, appId, name } = payload as Record<string, unknown>;

    if (!isNonEmptyString(openId) || !isNonEmptyString(appId)) {
      return null;
    }

    return { openId, appId, name: isNonEmptyString(name) ? name : "" };
  } catch {
    return null;
  }
}

/**
 * Resolve the logged-in user from the session cookie.
 * Returns null when there is no valid session (public routes keep working).
 */
export async function getUserFromRequest(req: Request): Promise<User | null> {
  const cookies = parseCookies(req.headers.cookie);
  const session = await verifySession(cookies.get(COOKIE_NAME));
  if (!session) return null;

  const user = await db.getUserByOpenId(session.openId);
  if (!user) return null;

  // Keep lastSignedIn fresh (same behavior as before).
  await db.upsertUser({ openId: user.openId, lastSignedIn: new Date() });

  return user;
}
