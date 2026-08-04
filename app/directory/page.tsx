import type { Metadata } from "next"
import { getPublishedSchools } from "@/features/content/published-content"
import { DirectoryExplorer } from "@/features/schools/components/directory-explorer"

export const metadata: Metadata = {
  title: "School & activity directory",
  description:
    "Compare international, bilingual and specialist schools, tutors and activities across Lisbon, Cascais, the Algarve and Porto.",
  alternates: { canonical: "/directory" },
}

type DirectorySearchParams = {
  query?: string | string[]
  region?: string | string[]
  curriculum?: string | string[]
  stage?: string | string[]
  type?: string | string[]
}

function valueOf(value?: string | string[]) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? ""
}

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<DirectorySearchParams>
}) {
  const params = await searchParams
  const listings = await getPublishedSchools()

  return (
    <main id="main-content">
      <DirectoryExplorer
        listings={listings}
        initialQuery={valueOf(params.query)}
        initialRegion={valueOf(params.region)}
        initialCurriculum={valueOf(params.curriculum)}
        initialStage={valueOf(params.stage)}
        initialType={valueOf(params.type)}
      />
    </main>
  )
}
