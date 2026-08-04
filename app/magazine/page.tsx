import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getPublishedArticles, getPublishedMagazines } from "@/features/content/published-content"

export const metadata: Metadata = {
  title: "Magazine",
  description:
    "Practical, independent writing about schools and family education in Portugal.",
  alternates: { canonical: "/magazine" },
}

export default async function MagazinePage() {
  const [articles, magazines] = await Promise.all([
    getPublishedArticles(),
    getPublishedMagazines(),
  ])
  const featured = magazines.find((edition) => edition.featured) ?? magazines[0]
  return (
    <main id="main-content" className="magazine-page">
      <section className="magazine-page-hero">
        <div className="shell">
          <div>
            <p className="eyebrow eyebrow-light">Education in Portugal magazine</p>
            <h1>Read the place, not only the prospectus.</h1>
            <p>
              Independent school guidance and family perspectives from across Portugal.
            </p>
          </div>
          <Image
            src={featured?.coverImageUrl || "/education/magazine-edition-2.png"}
            alt={featured?.title || "Education in Portugal magazine edition two"}
            width={420}
            height={590}
            priority
          />
        </div>
      </section>
      {magazines.length ? (
        <section className="digital-editions">
          <div className="shell">
            <p className="eyebrow">Digital editions</p>
            <h2>Read the magazine online.</h2>
            <div className="digital-editions-grid">
              {magazines.map((edition) => {
                const href = edition.externalReaderUrl || edition.documentUrl
                return (
                  <article key={edition.id}>
                    <Image src={edition.coverImageUrl} alt={edition.title} width={240} height={338} />
                    <div>
                      <span>Issue {edition.issueNumber}</span>
                      <h3>{edition.title}</h3>
                      <p>{edition.description}</p>
                      {href ? <a className="button button-primary" href={href} target="_blank" rel="noreferrer">Read digital edition <ArrowRight aria-hidden="true" /></a> : null}
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      ) : null}
      <section className="magazine-index">
        <div className="shell">
          <h2>Latest writing</h2>
          <div className="magazine-index-grid">
            {articles.map((article) => (
              <article key={article.slug}>
                <Link className="magazine-index-image" href={`/articles/${article.slug}`}>
                  <Image src={article.image} alt="" fill sizes="(max-width: 700px) 100vw, 33vw" />
                </Link>
                <p>{article.category}</p>
                <h3>
                  <Link href={`/articles/${article.slug}`}>{article.title}</Link>
                </h3>
                <span>{article.readingTime}</span>
                <Link className="text-link" href={`/articles/${article.slug}`}>
                  Read article <ArrowRight aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
