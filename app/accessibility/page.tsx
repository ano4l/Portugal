import type { Metadata } from "next"
import { InformationPage } from "@/components/education/information-page"

export const metadata: Metadata = {
  title: "Accessibility",
  description: "Accessibility approach and contact details for Education in Portugal.",
}

export default function AccessibilityPage() {
  return (
    <InformationPage
      title="Accessibility"
      introduction="We aim for a clear, keyboard-friendly experience that reflows across small screens and supports assistive technology."
    >
      <h2>What the interface supports</h2>
      <p>
        Pages use semantic landmarks, visible focus indicators, labelled controls,
        accessible dialogs, reduced-motion preferences and layouts designed to
        reflow at 320 CSS pixels.
      </p>
      <h2>Known limitations</h2>
      <p>
        Institution information may include third-party wording or destinations
        outside our control. Contact us if a linked resource creates an access barrier.
      </p>
      <h2>Tell us about a problem</h2>
      <p>
        Email info@educationinportugal.com or call +351 282 341 100. Include the
        page address, the control involved and the assistive technology you were using.
      </p>
    </InformationPage>
  )
}
