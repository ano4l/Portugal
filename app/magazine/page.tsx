import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { articles } from "@/lib/education-data"

export const metadata: Metadata = {
  title: "Magazine",
  description:
    "Practical, independent writing about schools and family education in Portugal.",
  alternates: { canonical: "/magazine" },
}

export default function MagazinePage() {
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
            src="/education/magazine-edition-2.png"
            alt="Education in Portugal magazine edition two"
            width={420}
            height={590}
            priority
          />
        </div>
      </section>
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
