import { cookies } from "next/headers";

const SECRET = process.env.JWT_SECRET || "super-secret-peerpilott-key-1234567890";

async function getCryptoKey() {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export interface SessionPayload {
  email: string;
  name: string;
  role: "student" | "mentor" | "admin";
  loginAt: number;
}

export async function createSessionToken(payload: SessionPayload) {
  const enc = new TextEncoder();
  const dataStr = JSON.stringify(payload);
  const key = await getCryptoKey();
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    enc.encode(dataStr)
  );
  
  // Base64Url encoding helper
  const base64Data = btoa(dataStr)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
    
  const base64Sig = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  return `${base64Data}.${base64Sig}`;
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    
    const [base64Data, base64Sig] = parts;
    
    // Base64Url decoding helper
    let rawData = base64Data.replace(/-/g, "+").replace(/_/g, "/");
    while (rawData.length % 4) rawData += "=";
    const dataStr = atob(rawData);
    const payload = JSON.parse(dataStr) as SessionPayload;
    
    let rawSig = base64Sig.replace(/-/g, "+").replace(/_/g, "/");
    while (rawSig.length % 4) rawSig += "=";
    const sigBuffer = new Uint8Array(
      atob(rawSig)
        .split("")
        .map((c) => c.charCodeAt(0))
    );
    
    const key = await getCryptoKey();
    const enc = new TextEncoder();
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBuffer,
      enc.encode(dataStr)
    );
    
    return isValid ? payload : null;
  } catch (err) {
    return null;
  }
}

export async function setSessionCookie(payload: Omit<SessionPayload, "loginAt">) {
  const token = await createSessionToken({
    ...payload,
    loginAt: Date.now(),
  });
  
  const cookieStore = await cookies();
  cookieStore.set("user_session", token, {
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
    httpOnly: false, // httpOnly false allows client scripts to read/clear it on logout
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}
