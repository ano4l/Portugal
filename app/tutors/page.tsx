import type { Metadata } from "next"
import { DirectoryExplorer } from "@/components/education/directory-explorer"

export const metadata: Metadata = {
  title: "Tutors and learning support",
  description:
    "Find tutors, bilingual learning centres and specialist education support across Portugal.",
  alternates: { canonical: "/tutors" },
}

export default function TutorsPage() {
  return (
    <main id="main-content">
      <DirectoryExplorer
        initialType="Tutoring centre"
        headerEyebrow="Tutors and learning support"
        title="Find support that meets the learner."
        introduction="Explore private tutoring, bilingual learning centres and specialist support, with filters for language, age and learning needs."
      />
    </main>
  )
}
