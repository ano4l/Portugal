import type { Metadata } from "next"
import { Cormorant_Garamond, Manrope } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SiteShell } from "@/components/education/site-shell"
import "./globals.css"

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
})

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://educationinportugal.com"),
  title: {
    default: "Education in Portugal | Find the right school and life fit",
    template: "%s | Education in Portugal",
  },
  description:
    "The independent guide to schools, tutors, activities and education jobs across Portugal.",
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "Education in Portugal",
    title: "Education in Portugal",
    description:
      "Curated school profiles, practical local guidance and a human enquiry service for families in Portugal.",
    images: [
      {
        url: "/education/international-sharing-school.webp",
        width: 1000,
        height: 600,
        alt: "Students learning together at an international school in Portugal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Education in Portugal",
    description:
      "Find schools, tutors, activities and education jobs across Portugal.",
    images: ["/education/international-sharing-school.webp"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${sans.variable}`}>
        <SiteShell>{children}</SiteShell>
        {process.env.VERCEL ? <Analytics /> : null}
      </body>
    </html>
  )
}
