import type { Metadata } from "next";
import { ReactNode } from "react";
import "@/styles/globals.css";

import Providers from "./providers";

export const metadata: Metadata = {
  title: "Simpeka",
  description: "Platform tes TOEFL dengan verifikasi blockchain",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
