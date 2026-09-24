import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "kalaso-super-secret-jwt-key-prediction-app-2026";

export interface TokenPayload {
  userId: number;
  email: string;
  name: string;
  phone: string;
  role: "USER" | "SUPER_ADMIN";
}

export function signToken(payload: TokenPayload, expiresIn: string | number = "7d"): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as jwt.SignOptions);
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}
