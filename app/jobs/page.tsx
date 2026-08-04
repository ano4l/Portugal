import type { Metadata } from "next"
import { getPublishedJobs } from "@/features/content/published-content"
import { JobsExplorer } from "@/features/jobs/components/jobs-explorer"

export const metadata: Metadata = {
  title: "Education jobs in Portugal",
  description:
    "Explore teaching, leadership, student support and education operations roles across Portugal.",
  alternates: { canonical: "/jobs" },
}

function createJobsJsonLd(jobs: Awaited<ReturnType<typeof getPublishedJobs>>) { return jobs.map((job) => ({
  "@context": "https://schema.org",
  "@type": "JobPosting",
  title: job.title,
  description: job.summary,
  datePosted: "2026-07-24",
  validThrough: "2026-08-21T23:59:59+01:00",
  employmentType: job.type.toUpperCase().replace(" ", "_"),
  hiringOrganization: {
    "@type": "Organization",
    name: job.institution,
  },
  jobLocation: {
    "@type": "Place",
    address: {
      "@type": "PostalAddress",
      addressLocality: job.location,
      addressCountry: "PT",
    },
  },
})) }

export default async function JobsPage() {
  const jobs = await getPublishedJobs()
  const jobsJsonLd = createJobsJsonLd(jobs)
  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobsJsonLd) }}
      />
      <JobsExplorer listings={jobs} />
    </main>
  )
}
