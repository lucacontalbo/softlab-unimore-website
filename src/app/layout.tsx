import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://softlab.unimore.it";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SoftLab | University of Modena and Reggio Emilia",
    template: "%s | SoftLab UNIMORE",
  },
  description:
    "SoftLab is a research laboratory at the University of Modena and Reggio Emilia focused on Software Engineering, Data Integration, Entity Matching, NLP, and Machine Learning.",
  keywords: [
    "SoftLab",
    "UNIMORE",
    "software engineering",
    "data integration",
    "entity matching",
    "NLP",
    "machine learning",
    "natural language processing",
    "time series",
    "anomaly detection",
    "University of Modena",
  ],
  authors: [{ name: "SoftLab UNIMORE" }],
  creator: "SoftLab UNIMORE",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "SoftLab UNIMORE",
    title: "SoftLab | University of Modena and Reggio Emilia",
    description:
      "Research laboratory at UNIMORE specialising in data integration, entity matching, NLP, and machine learning.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "SoftLab UNIMORE" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SoftLab UNIMORE",
    description: "Research in data integration, entity matching, NLP & ML.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: SITE_URL },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ResearchOrganization",
  name: "SoftLab",
  alternateName: "Software Engineering & Data Analysis Laboratory",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.svg`,
  email: "softlab@unimore.it",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Via Pietro Vivarelli, 10",
    addressLocality: "Modena",
    postalCode: "41125",
    addressCountry: "IT",
  },
  parentOrganization: {
    "@type": "CollegeOrUniversity",
    name: "University of Modena and Reggio Emilia",
    url: "https://www.unimore.it",
  },
  sameAs: ["https://github.com/softlab-unimore"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-slate-900">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
