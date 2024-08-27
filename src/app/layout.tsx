import type { Metadata } from "next";
import "@/assets/scss/globals.scss";


export const metadata: Metadata = {
  title: "Movies List",
  description: "Favourite movies list",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
