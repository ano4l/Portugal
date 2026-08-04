import type { Metadata } from "next"
import { InformationPage } from "@/features/site/components/information-page"

export const metadata: Metadata = {
  title: "Privacy",
  description: "How Education in Portugal handles information submitted through this website.",
}

export default function PrivacyPage() {
  return (
    <InformationPage
      title="Privacy"
      introduction="A plain-language summary of the information this website uses and the choices available to you."
    >
      <h2>Information you choose to share</h2>
      <p>
        Enquiry and newsletter forms ask only for information needed to respond.
        Online email delivery is not active in this preview unless a configured
        delivery service is available. The interface states the delivery result
        before claiming that any message was sent.
      </p>
      <h2>Analytics</h2>
      <p>
        The site records named interaction events to understand searches, filters
        and form completion. These events should not include sensitive details from
        free-text messages.
      </p>
      <h2>Your choices</h2>
      <p>
        You may contact info@educationinportugal.com to ask about information you
        have submitted or to request its removal from a connected service.
      </p>
    </InformationPage>
  )
}
