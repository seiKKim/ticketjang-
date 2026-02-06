
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

// Hashing
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

// JWT
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "default_dev_secret_please_change");
const ALG = "HS256";

export async function signJwt(payload: Record<string, any>) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(SECRET);
}

export async function verifyJwt(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload;
  } catch (e) {
    return null;
  }
}
