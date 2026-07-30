import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ArrowRight, BadgeCheck, Mail, MapPin } from "lucide-react"
import { notFound } from "next/navigation"
import { ListingMedia } from "@/components/education/listing-media"
import { schools } from "@/lib/education-data"

export function generateStaticParams() {
  return schools
    .filter((school) => school.slug !== "international-sharing-school")
    .map((school) => ({ slug: school.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const school = schools.find((item) => item.slug === slug)

  if (!school) return {}

  return {
    title: school.name,
    description: `${school.differentiator} Read practical notes and request an introduction.`,
    alternates: { canonical: `/schools/${school.slug}` },
  }
}

export default async function SchoolNotesPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const school = schools.find((item) => item.slug === slug)
  if (!school) notFound()

  const emailHref = `mailto:info@educationinportugal.com?subject=${encodeURIComponent(
    `Introduction request: ${school.name}`,
  )}&body=${encodeURIComponent(
    `Hello Education in Portugal,\n\nI would like help making contact with ${school.name}.\n\nParent name:\nChild age:\nPreferred start date:\nQuestions:\n`,
  )}`

  return (
    <main id="main-content" className="generic-profile-page">
      <div className="shell profile-breadcrumb">
        <Link href="/directory">
          <ArrowLeft aria-hidden="true" />
          Back to directory
        </Link>
        <span>{school.region}</span>
      </div>

      <section className="generic-profile-hero">
        <div className="shell generic-profile-grid">
          <div className="generic-profile-media">
            <ListingMedia
              src={school.image}
              alt={`${school.name} in ${school.location}`}
              name={school.name}
              region={school.region}
              sizes="(max-width: 800px) 100vw, 56vw"
            />
          </div>
          <div className="generic-profile-copy">
            <div className="profile-kicker">
              <span>{school.type}</span>
              {school.verified ? (
                <span className="verified">
                  <BadgeCheck aria-hidden="true" />
                  Details checked
                </span>
              ) : null}
            </div>
            <h1>{school.name}</h1>
            <p className="card-location">
              <MapPin aria-hidden="true" />
              {school.location}
            </p>
            <p className="generic-profile-deck">{school.differentiator}</p>
            <dl className="generic-profile-facts">
              <div>
                <dt>Stages</dt>
                <dd>{school.stages.join(", ")}</dd>
              </div>
              <div>
                <dt>Curriculum</dt>
                <dd>{school.curriculum.join(", ")}</dd>
              </div>
              <div>
                <dt>Languages</dt>
                <dd>{school.languages.join(", ")}</dd>
              </div>
              <div>
                <dt>Support</dt>
                <dd>{school.support.length ? school.support.join(", ") : "Ask the provider"}</dd>
              </div>
            </dl>
            <div className="generic-profile-note">
              <h2>Request an introduction</h2>
              <p>
                This profile does not yet have direct online enquiry delivery.
                Email our family team and we will help you find the right contact.
              </p>
              <a className="button button-primary" href={emailHref}>
                Email the family team <Mail aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="generic-profile-more">
        <div className="shell">
          <h2>Keep comparing</h2>
          <p>
            Return to the directory to compare this setting with nearby schools,
            tutoring centres and activities.
          </p>
          <Link className="text-link" href="/directory">
            Browse all places <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  )
}
