import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  GraduationCap,
  HeartHandshake,
  Map,
  Sparkles,
} from "lucide-react"
import { articles, schools } from "@/features/content/fallback-data"
import { EducationMap } from "@/features/schools/components/education-map"
import { HomeHero } from "@/features/site/components/home-hero"
import { HomeProcessStory } from "@/features/site/components/home-process-story"
import { NewsletterForm } from "@/features/site/components/newsletter-form"
import { Reveal } from "@/features/site/components/reveal"

const featuredSchools = schools.filter((school) => school.featured).slice(0, 4)

const organisationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Education in Portugal",
  url: "https://educationinportugal.com",
  telephone: "+351 282 341 100",
  email: "info@educationinportugal.com",
  areaServed: "Portugal",
  description:
    "An independent discovery and enquiry guide to schools, activities and education jobs in Portugal.",
}

export default function HomePage() {
  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organisationJsonLd) }}
      />

      <HomeHero />

      <section className="section featured-section" aria-labelledby="featured-title">
        <div className="shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">The considered shortlist</p>
              <h2 id="featured-title">Places worth knowing</h2>
            </div>
            <p>
              Schools and learning communities selected for distinctive teaching,
              thoughtful culture and a clear sense of place.
            </p>
            <Link className="text-link" href="/directory">
              Explore all listings <ArrowRight aria-hidden="true" />
            </Link>
          </div>

          <Reveal className="editorial-listing-grid">
            {featuredSchools.map((school, index) => (
              <article className={index === 0 ? "editorial-card lead" : "editorial-card"} key={school.slug}>
                <Link
                  className="editorial-card-image"
                  href={
                    school.slug === "international-sharing-school"
                      ? "/schools/international-sharing-school"
                      : "/directory"
                  }
                  aria-label={`View ${school.name}`}
                >
                  <Image
                    src={school.image}
                    alt={`${school.name} in ${school.location}`}
                    fill
                    sizes={index === 0 ? "(max-width: 700px) 100vw, 48vw" : "(max-width: 700px) 100vw, 25vw"}
                  />
                </Link>
                <div className="editorial-card-body">
                  <div className="listing-meta">
                    <span>{school.region}</span>
                    <span>{school.curriculum.join(", ")}</span>
                  </div>
                  <h3>
                    <Link
                      href={
                        school.slug === "international-sharing-school"
                          ? "/schools/international-sharing-school"
                          : "/directory"
                      }
                    >
                      {school.name}
                    </Link>
                  </h3>
                  <p>{school.differentiator}</p>
                  <div className="listing-foot">
                    <span>{school.stages.join(", ")}</span>
                    {school.verified ? (
                      <span className="verified">
                        <BadgeCheck aria-hidden="true" /> Profile checked
                      </span>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="audience-section" aria-labelledby="audience-title">
        <div className="shell">
          <div className="audience-intro">
            <h2 id="audience-title">One guide, four points of view.</h2>
          </div>
          <Reveal className="audience-grid">
            {[
              {
                title: "Families",
                text: "Compare schools, ask better questions and build a shortlist that fits real family life.",
                icon: HeartHandshake,
                href: "/directory",
              },
              {
                title: "Schools",
                text: "Present your learning culture clearly and speak with families already considering Portugal.",
                icon: Building2,
                href: "/advertise",
              },
              {
                title: "Tutors",
                text: "Help families find trusted academic, language, arts and specialist learning support.",
                icon: GraduationCap,
                href: "/tutors",
              },
              {
                title: "Recruiters",
                text: "Reach international educators through a focused, editorially trusted jobs platform.",
                icon: BriefcaseBusiness,
                href: "/jobs",
              },
            ].map((pathway) => (
              <Link className="audience-card" href={pathway.href} key={pathway.title}>
                <pathway.icon aria-hidden="true" />
                <h3>{pathway.title}</h3>
                <p>{pathway.text}</p>
                <span className="round-arrow" aria-hidden="true">
                  <ArrowUpRight />
                </span>
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section place-section" aria-labelledby="place-title">
        <div className="shell">
          <div className="section-heading place-heading">
            <div>
              <h2 id="place-title">Education is part of the neighbourhood.</h2>
            </div>
            <p>
              Commutes, coastlines and community shape the school day as much as
              curriculum does. Start with where you want life to happen.
            </p>
          </div>
          <Reveal className="place-grid">
            {[
              {
                name: "Lisbon",
                kicker: "City energy, global choice",
                count: "18 considered listings",
                image: "/education/united-lisbon.webp",
              },
              {
                name: "Algarve",
                kicker: "Coastal pace, close community",
                count: "12 considered listings",
                image: "/education/nobel-algarve.webp",
              },
              {
                name: "Porto & North",
                kicker: "Creative city, deep roots",
                count: "9 considered listings",
                image: "/education/lisbon-mba.webp",
              },
            ].map((place, index) => (
              <Link
                className={`place-card place-card-${index + 1}`}
                href={`/directory?region=${encodeURIComponent(place.name)}`}
                key={place.name}
              >
                <Image src={place.image} alt="" fill sizes="(max-width: 700px) 100vw, 33vw" />
                <span className="place-shade" />
                <div>
                  <span>{place.kicker}</span>
                  <h3>{place.name}</h3>
                  <p>{place.count}</p>
                </div>
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section home-map-section" aria-labelledby="home-map-title">
        <div className="shell">
          <div className="home-map-heading">
            <h2 id="home-map-title">See where a school day could begin.</h2>
            <p>
              Explore our current directory across Portugal, then open a profile
              for the practical details behind each location.
            </p>
            <Link className="text-link" href="/directory">
              Open the full directory <ArrowRight aria-hidden="true" />
            </Link>
          </div>
          <Reveal>
            <EducationMap listings={schools} variant="home" />
          </Reveal>
        </div>
      </section>

      <section className="magazine-section" id="magazine" aria-labelledby="magazine-title">
        <Reveal className="shell magazine-spread">
          <div className="magazine-lead-image">
            <Image
              src={articles[0].image}
              alt="A family exploring education options together"
              fill
              sizes="(max-width: 800px) 100vw, 48vw"
            />
            <span>Family guidance</span>
          </div>
          <div className="magazine-copy">
            <h2 id="magazine-title">{articles[0].title}</h2>
            <p>{articles[0].excerpt}</p>
            <div className="article-byline">
              <span>{articles[0].category}</span>
              <span>{articles[0].readingTime}</span>
            </div>
            <Link className="button button-outline" href={`/articles/${articles[0].slug}`}>
              Read the field guide <ArrowRight aria-hidden="true" />
            </Link>
          </div>
          <div className="magazine-side" id="latest-stories">
            {articles.slice(1).map((article) => (
              <article key={article.title}>
                <Image src={article.image} alt="" width={160} height={120} />
                <div>
                  <span>{article.category}</span>
                  <h3>
                    <Link href={`/articles/${article.slug}`}>{article.title}</Link>
                  </h3>
                  <p>{article.readingTime}</p>
                </div>
              </article>
            ))}
          </div>
        </Reveal>
      </section>

      <HomeProcessStory />

      <section className="jobs-teaser" aria-labelledby="jobs-teaser-title">
        <div className="shell jobs-teaser-inner">
          <div>
            <p className="eyebrow eyebrow-light">Teach in Portugal</p>
            <h2 id="jobs-teaser-title">A good school begins with remarkable people.</h2>
            <p>
              Discover roles at international schools, bilingual settings and
              independent learning communities across the country.
            </p>
            <Link className="button button-coral" href="/jobs">
              Explore education jobs <ArrowRight aria-hidden="true" />
            </Link>
          </div>
          <div className="jobs-teaser-list">
            {[
              ["Head of Primary", "Lisbon, Full time"],
              ["Learning Support Specialist", "Algarve, Full time"],
              ["Early Years Educator", "Cascais, Fixed term"],
            ].map(([title, meta]) => (
              <Link href="/jobs" key={title}>
                <BriefcaseBusiness aria-hidden="true" />
                <span>
                  <strong>{title}</strong>
                  <small>{meta}</small>
                </span>
                <ArrowUpRight aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="newsletter-section" aria-labelledby="newsletter-title">
        <div className="shell newsletter-inner">
          <div className="newsletter-mark">
            <Sparkles aria-hidden="true" />
          </div>
          <div>
            <h2 id="newsletter-title">Useful insight, once a month.</h2>
            <p>
              New schools, open days, admissions dates and thoughtful guidance
              for family life in Portugal.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </section>

      <section className="partner-strip" id="partners" aria-label="Information for education partners">
        <div className="shell">
          <div>
            <Map aria-hidden="true" />
            <span>
              <strong>Part of Portugal’s education story?</strong>
              Put your institution in front of families who are ready to ask.
            </span>
          </div>
          <Link className="text-link text-link-light" href="/advertise">
            Talk to our partnerships editor <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  )
}
