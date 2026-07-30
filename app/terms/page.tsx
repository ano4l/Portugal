import type { Metadata } from "next"
import { InformationPage } from "@/components/education/information-page"

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms for using the Education in Portugal directory and editorial guidance.",
}

export default function TermsPage() {
  return (
    <InformationPage
      title="Terms of use"
      introduction="The directory supports research and introductions. Admissions decisions and current provider details remain with each institution."
    >
      <h2>Directory information</h2>
      <p>
        Profiles are prepared from information available to the editorial team.
        Fees, availability, transport and admissions requirements can change.
        Confirm important details directly with the institution before making a decision.
      </p>
      <h2>Enquiries</h2>
      <p>
        A successful on-screen delivery message appears only when the configured
        delivery service accepts the request. Where delivery is unavailable, the
        site preserves the entered details in the browser and offers a direct email path.
      </p>
      <h2>Editorial independence</h2>
      <p>
        Paid placements, if introduced, should be identified clearly and should not
        determine the factual content of an institution profile.
      </p>
    </InformationPage>
  )
}
