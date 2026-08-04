import type { Metadata } from "next"
import { ContactForm } from "@/features/site/components/contact-form"

export const metadata: Metadata = {
  title: "Advertise with us",
  description:
    "Reach families and educators through Education in Portugal magazine, directory, editorial and job advertising.",
  alternates: { canonical: "/advertise" },
}

export default function AdvertisePage() {
  return (
    <main id="main-content" className="information-page contact-page">
      <header>
        <div className="shell">
          <p>For education partners</p>
          <h1>Reach people already thinking about education.</h1>
          <p>
            Discuss magazine placements, directory profiles, sponsored content,
            digital campaigns and unlimited education job listings.
          </p>
        </div>
      </header>
      <div className="shell contact-page-grid">
        <aside>
          <h2>Build a considered campaign</h2>
          <p>
            Tell us who you need to reach and what success looks like. Our team
            will recommend the right mix across print and digital channels.
          </p>
          <ul>
            <li>Print and rotating digital banners</li>
            <li>Enhanced directory profiles</li>
            <li>Sponsored editorial partnerships</li>
            <li>Education recruitment campaigns</li>
          </ul>
        </aside>
        <ContactForm purpose="advertise" />
      </div>
    </main>
  )
}
