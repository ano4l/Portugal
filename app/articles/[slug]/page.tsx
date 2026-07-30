import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { notFound } from "next/navigation"
import { articles } from "@/lib/education-data"

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = articles.find((item) => item.slug === slug)
  if (!article) return {}

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/articles/${article.slug}` },
    openGraph: { images: [article.image] },
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = articles.find((item) => item.slug === slug)
  if (!article) notFound()

  const related = articles.filter((item) => item.slug !== article.slug).slice(0, 2)
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: `https://educationinportugal.com${article.image}`,
    author: { "@type": "Organization", name: "Education in Portugal" },
    publisher: { "@type": "Organization", name: "Education in Portugal" },
  }

  return (
    <main id="main-content" className="article-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <div className="shell profile-breadcrumb">
        <Link href="/magazine">
          <ArrowLeft aria-hidden="true" />
          Back to magazine
        </Link>
        <span>{article.readingTime}</span>
      </div>
      <article>
        <header className="article-header shell">
          <p className="article-category">{article.category}</p>
          <h1>{article.title}</h1>
          <p>{article.excerpt}</p>
          <div className="article-meta">
            <span>Education in Portugal editorial team</span>
            <span>Updated July 2026</span>
          </div>
        </header>
        <div className="article-hero-image">
          <Image
            src={article.image}
            alt=""
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="article-body shell">
          <p>
            Choosing education in Portugal becomes easier when the practical
            questions come first. Think about the school day, travel time,
            language balance and the support your child will need while settling in.
          </p>
          <h2>Start with daily life</h2>
          <p>
            A curriculum may attract your attention, but the everyday rhythm often
            decides whether a school works. Map the journey at the times you would
            actually travel, ask how new students are welcomed, and understand
            which languages are used beyond the classroom.
          </p>
          <blockquote>
            The most useful shortlist is not the longest one. It is the group of
            schools you can picture becoming part of family life.
          </blockquote>
          <h2>Questions worth taking to a visit</h2>
          <ul>
            <li>How does the school support children entering mid-year?</li>
            <li>What does communication with families look like week to week?</li>
            <li>Which costs sit outside the published annual fee?</li>
            <li>How are language and learning support needs reviewed?</li>
          </ul>
          <p>
            Use our directory to compare the details, then contact the school
            directly for current admissions information.
          </p>
          <Link className="button button-primary" href="/directory">
            Explore the directory <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </article>
      <section className="article-related">
        <div className="shell">
          <h2>Read next</h2>
          <div>
            {related.map((item) => (
              <Link href={`/articles/${item.slug}`} key={item.slug}>
                <span>{item.category}</span>
                <strong>{item.title}</strong>
                <ArrowRight aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
