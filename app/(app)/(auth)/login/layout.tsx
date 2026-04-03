import { Metadata } from "next";
import "../../../../app/globals.css";

export const metadata: Metadata = {
  title: "ChatBotPro",
  description: "AI-powered chatbot SaaS platform",
  icons: {
    icon: "/favicon.ico", // 👈 browser tab
  },
};
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-[#efeff7]">
      <body>{children}</body>
    </html>
  );
}
