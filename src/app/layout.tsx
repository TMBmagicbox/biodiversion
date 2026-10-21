import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-nunito",
});

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-fredoka",
});

const TITULO = "Biodiversión | Guardería y estancia infantil en Cancún";
const DESCRIPCION =
  "Guardería y estancia infantil en Cancún (Av. Kohunlich 210, SM 50, Cancún, Q.R.). Atendemos bebés desde los 3 meses hasta los 4 años. Cuidado, alimentación y estimulación temprana. Horarios flexibles, seguridad y contacto con la naturaleza.";

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
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: "Biodiversión",
    images: [
      {
        url: "/images/logo.png",
        width: 1652,
        height: 685,
        alt: "Logotipo de Biodiversión, guardería en Cancún",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${nunito.variable} ${fredoka.variable} h-full antialiased`}>
      <body
        className={`${nunito.className} min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]`}
      >
        <div className="ambient-blobs" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
