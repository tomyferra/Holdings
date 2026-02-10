import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Holdings - Mi Camino a Casa",
  description: "Seguimiento de ahorros para mi futura casa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}
