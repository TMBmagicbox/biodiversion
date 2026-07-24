import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://biodiversion.vercel.app";
const TITULO =
  "Biodiversión | Guardería y estancia infantil en Cancún";
const DESCRIPCION =
  "Guardería y estancia infantil en Cancún (Av. Kohunlich 210, SM 50, Cancún, Q.R.). Cuidado, alimentación y estimulación temprana para bebés desde 45 días y niños hasta 4 años. Horarios flexibles, seguridad y contacto con la naturaleza.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITULO,
    template: "%s | Biodiversión",
  },
  description: DESCRIPCION,
  keywords: [
    "guardería en Cancún",
    "estancia infantil Cancún",
    "biodiversion",
    "biodiversión guardería",
    "guardería Cancún Quintana Roo",
    "cuidado de niños Cancún",
    "estancia infantil SM 50",
    "guardería para bebés Cancún",
  ],
  authors: [{ name: "Biodiversión" }],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: SITE_URL,
    siteName: "Biodiversión",
    title: TITULO,
    description: DESCRIPCION,
    images: [{ url: "/images/logo.png", width: 1652, height: 685, alt: "Biodiversión" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITULO,
    description: DESCRIPCION,
    images: ["/images/logo.png"],
  },
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
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <div className="ambient-blobs" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
