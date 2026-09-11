import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Profil Resmi XI TKJ 3 | SMK TELKOM MALANG",
  description: "Web Security Practice Lab & Digital Profile XI TKJ 3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}