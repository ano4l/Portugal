import type { Metadata } from "next"
import Link from "next/link"
import { InformationPage } from "@/features/site/components/information-page"

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about the Education in Portugal magazine, our editorial mission and how to contact the team.",
  alternates: { canonical: "/about" },
}

export default function AboutPage() {
  return (
    <InformationPage
      title="Independent guidance for education in Portugal."
      introduction="Education in Portugal connects considered editorial guidance with a practical directory for families, educators and schools."
    >
      <h2>About the magazine</h2>
      <p>
        Our print and digital magazine brings together school profiles, family
        guidance, education news and informed local perspectives from across
        Portugal.
      </p>
      <h2>Our editorial mission</h2>
      <p>
        We help families understand their options without reducing an important
        choice to a ranking. Clear information, useful questions and transparent
        profiles guide every story we publish.
      </p>
      <h2>Who we serve</h2>
      <p>
        We work for Portuguese and international families, educators exploring
        opportunities, and institutions that want to present their work with
        clarity and substance.
      </p>
      <h2>Talk to the team</h2>
      <p>
        Visit our <Link href="/contact">contact page</Link> for editorial,
        directory and family enquiries, or learn about
        our <Link href="/advertise">advertising opportunities</Link>.
      </p>
    </InformationPage>
  )
}
