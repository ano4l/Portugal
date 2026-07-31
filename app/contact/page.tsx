import type { Metadata } from "next"
import { ContactForm } from "@/components/education/contact-form"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Education in Portugal about family guidance, editorial, directory listings, jobs or partnerships.",
  alternates: { canonical: "/contact" },
}

export default function ContactPage() {
  return (
    <main id="main-content" className="information-page contact-page">
      <header>
        <div className="shell">
          <p>Talk to our team</p>
          <h1>Start with the question you have.</h1>
          <p>
            Contact us about choosing a school, contributing a story, joining
            the directory, recruitment or a general enquiry.
          </p>
        </div>
      </header>
      <div className="shell contact-page-grid">
        <aside>
          <h2>Contact details</h2>
          <p>
            Email <a href="mailto:info@educationinportugal.com">info@educationinportugal.com</a>
            <br />
            Call <a href="tel:+351282341100">+351 282 341 100</a>
          </p>
          <p>English-language support is available Monday-Friday.</p>
        </aside>
        <ContactForm purpose="contact" />
      </div>
    </main>
  )
}
