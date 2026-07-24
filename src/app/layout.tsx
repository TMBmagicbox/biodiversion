import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Biodiversión | Guardería y estancia infantil en Cancún",
  description:
    "Biodiversión es una guardería en Cancún (Av. Kohunlich 210, SM 50) con enfoque en el amor por la naturaleza. Atendemos bebés desde 45 días y niños hasta 8 años. Horarios flexibles, alimentación y seguridad para tu familia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-[var(--foreground)]">
        {children}
      </body>
    </html>
  );
}
