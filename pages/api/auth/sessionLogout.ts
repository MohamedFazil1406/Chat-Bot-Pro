import type { NextApiRequest, NextApiResponse } from "next";

export default async function sessionLogout(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  res.setHeader("Set-Cookie", [
    `session=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax; ${
      process.env.NODE_ENV === "production" ? "Secure" : ""
    }`,
  ]);

  return res.status(200).json({ message: "Session cookie cleared" });
}
