import { firebaseAdmin } from "./../../../libs/firebaseAdmin";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function sessionLogin(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ error: "ID token is required" });
  }

  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    const { uid } = decodedToken;
    const expiresIn = 60 * 60 * 24 * 7 * 1000;
    const sessionCookie = await firebaseAdmin
      .auth()
      .createSessionCookie(idToken, {
        expiresIn,
      });

    const Cookie = [
      `session=${sessionCookie}`,
      `Max-Age=${Math.floor(expiresIn / 1000)}`,
      `Path=/`,
      `HttpOnly`,
      `SameSite=Lax`,
      process.env.NODE_ENV === "production" ? "Secure" : "",
    ]
      .filter(Boolean)
      .join("; ");

    res.setHeader("Set-Cookie", Cookie);
    return res.status(200).json({ message: "Session cookie created" });
  } catch (error) {
    res.status(401).json({ error: "Invalid ID token" });
  }
}
