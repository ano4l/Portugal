import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CalendarDays,
  Languages,
  MapPin,
  Quote,
  Ruler,
  Users,
  WalletCards,
} from "lucide-react"
import { schools } from "@/features/content/fallback-data"
import { EnquiryActions } from "@/features/schools/components/enquiry-actions"

const school = schools[0]

export const metadata: Metadata = {
  title: "International Sharing School",
  description:
    "Explore International Sharing School in Greater Lisbon: IB curriculum, ages, language, fees guidance, visits and direct admissions enquiry.",
  alternates: { canonical: "/schools/international-sharing-school" },
  openGraph: {
    title: "International Sharing School",
    description:
      "A checked profile with practical admissions detail and direct enquiry.",
    images: [school.image],
  },
}

const schoolJsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "International Sharing School",
  url: "https://www.sharingschool.org/",
  image: "https://educationinportugal.com/uploads/provider/5/79469311-e030-47f7-b9a9-2c3b33323b62.webp",
  telephone: "+351 214 876 140",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Taguspark",
    addressRegion: "Greater Lisbon",
    addressCountry: "PT",
  },
}

export default function InternationalSharingSchoolPage() {
  return (
    <main id="main-content" className="profile-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schoolJsonLd) }}
      />

      <div className="shell profile-breadcrumb">
        <Link href="/directory">
          <ArrowLeft aria-hidden="true" />
          Back to directory
        </Link>
        <span>Schools / Greater Lisbon</span>
      </div>

      <section className="profile-intro" aria-labelledby="profile-title">
        <div className="shell">
          <div className="profile-title-row">
            <div>
              <div className="profile-kicker">
                <span>International school</span>
                <span className="verified">
                  <BadgeCheck aria-hidden="true" />
                  Profile checked July 2026
                </span>
              </div>
              <h1 id="profile-title">International Sharing School</h1>
              <p>
                <MapPin aria-hidden="true" />
                Taguspark, Greater Lisbon
              </p>
            </div>
            <p className="profile-deck">
              An IB learning community where thoughtful architecture, student
              agency and an international outlook meet.
            </p>
          </div>

          <span id="profile-action-trigger" className="profile-action-trigger" aria-hidden="true" />

          <div className="profile-gallery">
            <div className="profile-gallery-main">
              <Image
                src={school.image}
                alt="Students sharing a flexible learning space at International Sharing School"
                fill
                priority
                sizes="(max-width: 800px) 100vw, 67vw"
              />
            </div>
            <div className="profile-gallery-crop top">
              <Image
                src={school.image}
                alt="Collaborative seating area inside the school"
                fill
                sizes="(max-width: 800px) 50vw, 25vw"
              />
            </div>
            <div className="profile-gallery-crop bottom">
              <Image
                src={school.image}
                alt="Students working independently in a shared classroom"
                fill
                sizes="(max-width: 800px) 50vw, 25vw"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="shell profile-layout">
        <article className="profile-content">
          <section className="profile-facts" aria-labelledby="at-glance">
            <p className="eyebrow">At a glance</p>
            <h2 className="sr-only" id="at-glance">International Sharing School at a glance</h2>
            <dl>
              <div>
                <BookOpen aria-hidden="true" />
                <dt>Curriculum</dt>
                <dd>IB PYP, MYP & Diploma</dd>
              </div>
              <div>
                <Users aria-hidden="true" />
                <dt>Ages</dt>
                <dd>3-18 years</dd>
              </div>
              <div>
                <Languages aria-hidden="true" />
                <dt>Language</dt>
                <dd>English, with Portuguese</dd>
              </div>
              <div>
                <WalletCards aria-hidden="true" />
                <dt>Fees indication</dt>
                <dd>€10,800-€19,700 / year</dd>
              </div>
              <div>
                <Ruler aria-hidden="true" />
                <dt>Typical class</dt>
                <dd>18-22 students</dd>
              </div>
              <div>
                <CalendarDays aria-hidden="true" />
                <dt>Admissions</dt>
                <dd>Rolling, subject to space</dd>
              </div>
            </dl>
            <p className="facts-note">
              Fees are indicative and may exclude registration, meals and transport.
              Confirm current figures directly with admissions.
            </p>
          </section>

          <section className="profile-story" aria-labelledby="overview-title">
            <p className="eyebrow">The overview</p>
            <h2 id="overview-title">Learning designed to be shared.</h2>
            <div className="story-columns">
              <p>
                International Sharing School’s Taguspark campus is deliberately
                open and fluid. Students move between collaborative areas, studios
                and quieter corners, with the environment supporting the way each
                project needs to unfold.
              </p>
              <p>
                The school offers the full International Baccalaureate continuum.
                Inquiry, multilingualism and student ownership connect the early
                years through to the Diploma Programme, while a diverse family
                community brings a genuinely international texture to everyday life.
              </p>
            </div>
          </section>

          <section className="family-reasons" aria-labelledby="reasons-title">
            <div className="reasons-heading">
              <p className="eyebrow">Why families choose it</p>
              <h2 id="reasons-title">A contemporary school with a close human scale.</h2>
            </div>
            <ol>
              <li>
                <span>01</span>
                <div>
                  <h3>A complete IB pathway</h3>
                  <p>One educational philosophy connects the primary, middle years and diploma experience.</p>
                </div>
              </li>
              <li>
                <span>02</span>
                <div>
                  <h3>Purpose-built for collaboration</h3>
                  <p>Flexible studios and shared spaces make interdisciplinary work visible and natural.</p>
                </div>
              </li>
              <li>
                <span>03</span>
                <div>
                  <h3>International, without feeling anonymous</h3>
                  <p>A diverse community and considered pastoral structure help new families settle in.</p>
                </div>
              </li>
            </ol>
          </section>

          <section className="location-context" aria-labelledby="location-title">
            <div className="location-map" aria-hidden="true">
              <span className="location-road road-one" />
              <span className="location-road road-two" />
              <span className="location-road road-three" />
              <span className="location-water" />
              <span className="school-pin">
                <MapPin />
              </span>
              <span className="map-label label-lisbon">Lisbon</span>
              <span className="map-label label-cascais">Cascais</span>
              <span className="map-label label-sintra">Sintra</span>
            </div>
            <div>
              <p className="eyebrow">Location & daily life</p>
              <h2 id="location-title">Connected to Lisbon, Cascais and Sintra.</h2>
              <p>
                Taguspark sits west of central Lisbon, making the campus a practical
                option for families living along the A5 corridor. Ask admissions
                about current transport routes before choosing a neighbourhood.
              </p>
              <dl>
                <div>
                  <dt>From central Lisbon</dt>
                  <dd>Approx. 25-40 min by car</dd>
                </div>
                <div>
                  <dt>From Cascais</dt>
                  <dd>Approx. 20-30 min by car</dd>
                </div>
                <div>
                  <dt>School transport</dt>
                  <dd>Routes available; confirm annually</dd>
                </div>
              </dl>
            </div>
          </section>

          <figure className="family-quote">
            <Quote aria-hidden="true" />
            <blockquote>
              “Our children were known quickly, not only by name, but by what made
              them curious. That changed the whole move for us.”
            </blockquote>
            <figcaption>
              <strong>Parent of two students</strong>
              <span>Moved from London to Cascais in 2025</span>
            </figcaption>
          </figure>
        </article>

        <aside className="profile-sidebar">
          <EnquiryActions />
        </aside>
      </div>

      <section className="related-section" aria-labelledby="related-title">
        <div className="shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Continue your shortlist</p>
              <h2 id="related-title">Other places to consider</h2>
            </div>
            <p>Different in character, close enough to compare.</p>
            <Link className="text-link" href="/directory">
              View the full directory <ArrowRight aria-hidden="true" />
            </Link>
          </div>
          <div className="related-grid">
            {schools.slice(1, 4).map((related) => (
              <article key={related.slug}>
                <Link
                  href={`/schools/${related.slug}`}
                  className="related-image"
                  aria-label={`View ${related.name} profile`}
                >
                  <Image src={related.image} alt="" fill sizes="(max-width: 700px) 100vw, 33vw" />
                </Link>
                <div className="listing-meta">
                  <span>{related.region}</span>
                  <span>{related.curriculum.join(", ")}</span>
                </div>
                <h3>
                  <Link href={`/schools/${related.slug}`}>{related.name}</Link>
                </h3>
                <p>{related.differentiator}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
