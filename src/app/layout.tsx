import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://dtalab.unimore.it";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "DTALab | University of Modena and Reggio Emilia",
    template: "%s | DTALab UNIMORE",
  },
  description:
    "DTALab is a research laboratory at the University of Modena and Reggio Emilia focused on Data Analytics, Text Analytics, Entity Matching, NLP, and Machine Learning.",
  keywords: [
    "DTALab",
    "UNIMORE",
    "data analytics",
    "text analytics",
    "data integration",
    "entity matching",
    "NLP",
    "machine learning",
    "natural language processing",
    "big data",
    "University of Modena",
  ],
  authors: [{ name: "DTALab UNIMORE" }],
  creator: "DTALab UNIMORE",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "DTALab UNIMORE",
    title: "DTALab | University of Modena and Reggio Emilia",
    description:
      "Research laboratory at UNIMORE specialising in data analytics, text analytics, entity matching, and machine learning.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "DTALab UNIMORE" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DTALab UNIMORE",
    description: "Research in data analytics, text analytics, entity matching & ML.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: SITE_URL },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ResearchOrganization",
  name: "DTALab",
  alternateName: "Data and Text Analytics Laboratory",
  url: SITE_URL,
  logo: `${SITE_URL}/images/unimore-logo.svg`,
  email: "dtalab@unimore.it",
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
        <ConditionalLayout navbar={<Navbar />} footer={<Footer />}>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
