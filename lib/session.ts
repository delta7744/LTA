"use server";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { jwtVerify, SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback_secret_for_development_only"
);

const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  sameSite: "lax" as const,
  expires,
};

export async function createSession(
  refreshToken: string,
  accessToken: string,
  user: any
) {
  // Create a signed JWT token containing user ID and role
  const sessionToken = await new SignJWT({
    userId: user.id,
    role: user.role,
    refreshToken,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);

  const cookieStore = await cookies();

  // Store the signed JWT instead of the raw refresh token
  cookieStore.set("session", sessionToken, cookieOptions);
  cookieStore.set("accessToken", accessToken, {
    ...cookieOptions,
    // Shorter expiration for access token
    expires: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour
  });

  // Store minimal user info, not the entire user object
  const safeUserData = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  cookieStore.set("user", JSON.stringify(safeUserData), cookieOptions);
}

export async function getSession(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("session")?.value;
}

export async function getAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value;
}

export async function getUser(): Promise<any | undefined> {
  const cookieStore = await cookies();
  const user = cookieStore.get("user")?.value;
  return user ? JSON.parse(user) : undefined;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  cookieStore.delete("accessToken");
  cookieStore.delete("user");
}

export async function verifySession(token: string) {
  try {
    // Verify the JWT signature and decode its payload
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      algorithms: ["HS256"],
    });

    return {
      verified: true,
      payload,
    };
  } catch (error) {
    console.error("Session verification failed:", error);
    return {
      verified: false,
      error,
    };
  }
}

export async function authorize() {
  const token = await getSession();

  if (!token) {
    return {
      authorized: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  // Verify the token's signature and expiration
  const { verified, payload } = await verifySession(token);

  if (!verified) {
    // Token is invalid or expired
    await deleteSession(); // Clear invalid session
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Invalid session" },
        { status: 401 }
      ),
    };
  }

  return {
    authorized: true,
    token,
    userId: payload.userId,
    role: payload.role,
  };
}
