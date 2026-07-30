export type SchoolListing = {
  slug: string
  name: string
  location: string
  region: "Lisbon" | "Algarve" | "Porto & North" | "Cascais"
  stages: string[]
  curriculum: string[]
  languages: string[]
  type: string
  support: string[]
  differentiator: string
  image: string
  verified: boolean
  featured?: boolean
}

export const schools: SchoolListing[] = [
  {
    slug: "international-sharing-school",
    name: "International Sharing School",
    location: "Taguspark, Greater Lisbon",
    region: "Lisbon",
    stages: ["Primary", "Secondary"],
    curriculum: ["IB"],
    languages: ["English", "Portuguese"],
    type: "International school",
    support: ["Learning support"],
    differentiator:
      "An IB continuum school shaped around collaboration, design and student agency.",
    image: "/education/international-sharing-school.webp",
    verified: true,
    featured: true,
  },
  {
    slug: "united-lisbon-international-school",
    name: "United Lisbon International School",
    location: "Parque das Nações, Lisbon",
    region: "Lisbon",
    stages: ["Early years", "Primary", "Secondary"],
    curriculum: ["IB", "American"],
    languages: ["English", "Portuguese"],
    type: "International school",
    support: ["Learning support", "English language support"],
    differentiator:
      "A future-facing campus with technology, arts and global citizenship at its centre.",
    image: "/education/united-lisbon.webp",
    verified: true,
    featured: true,
  },
  {
    slug: "ips-cascais",
    name: "IPS Cascais British International School",
    location: "Alcabideche, Cascais",
    region: "Cascais",
    stages: ["Early years", "Primary"],
    curriculum: ["British"],
    languages: ["English", "Portuguese"],
    type: "International school",
    support: ["Learning support"],
    differentiator:
      "A close-knit British primary community with a strong outdoor-learning culture.",
    image: "/education/ips-cascais.webp",
    verified: true,
    featured: true,
  },
  {
    slug: "nobel-algarve-british-international-school",
    name: "Nobel Algarve British International School",
    location: "Lagoa, Algarve",
    region: "Algarve",
    stages: ["Early years", "Primary", "Secondary"],
    curriculum: ["British", "Portuguese"],
    languages: ["English", "Portuguese"],
    type: "International school",
    support: ["Learning support", "English language support"],
    differentiator:
      "One of the Algarve’s longest-established international school communities.",
    image: "/education/nobel-algarve.webp",
    verified: true,
    featured: true,
  },
  {
    slug: "algarve-arts-academy",
    name: "Algarve Arts Academy",
    location: "Loulé, Algarve",
    region: "Algarve",
    stages: ["All ages"],
    curriculum: ["Arts enrichment"],
    languages: ["English", "Portuguese"],
    type: "Activity provider",
    support: [],
    differentiator:
      "Small-group music, theatre and visual arts programmes led by working practitioners.",
    image: "/education/algarve-arts-academy.webp",
    verified: true,
  },
  {
    slug: "warehouse-mothership",
    name: "Warehouse Mothership",
    location: "Marvila, Lisbon",
    region: "Lisbon",
    stages: ["All ages"],
    curriculum: ["Arts enrichment"],
    languages: ["English", "Portuguese"],
    type: "Activity provider",
    support: ["Inclusive provision"],
    differentiator:
      "Creative workshops that bring families, artists and Lisbon’s maker community together.",
    image: "/education/warehouse-mothership.webp",
    verified: true,
  },
  {
    slug: "porto-bilingual-learning-centre",
    name: "Porto Bilingual Learning Centre",
    location: "Foz do Douro, Porto",
    region: "Porto & North",
    stages: ["Primary", "Secondary"],
    curriculum: ["Bilingual", "Portuguese"],
    languages: ["English", "Portuguese", "French"],
    type: "Tutoring centre",
    support: ["SEN support", "English language support"],
    differentiator:
      "Individual learning plans with bilingual tutoring and specialist study support.",
    image: "",
    verified: true,
  },
]

export const articles = [
  {
    slug: "changing-schools-without-losing-your-family-rhythm",
    category: "Settling in",
    title: "Changing schools without losing your family’s rhythm",
    excerpt:
      "A practical timeline for admissions, visits and the first weeks in a new classroom.",
    image: "/education/article-moving-schools.webp",
    readingTime: "7 min read",
  },
  {
    slug: "bilingual-international-or-portuguese",
    category: "How to choose",
    title: "Bilingual, international or Portuguese: what really differs?",
    excerpt:
      "Look beyond the labels to understand language balance, assessment and school culture.",
    image: "/education/article-bilingual.webp",
    readingTime: "9 min read",
  },
  {
    slug: "family-education-map-central-algarve",
    category: "Algarve guide",
    title: "A family’s education map of the central Algarve",
    excerpt:
      "Schools, activities and the everyday travel patterns that shape family life.",
    image: "/education/article-algarve.webp",
    readingTime: "6 min read",
  },
]

export type EducationJob = {
  id: string
  title: string
  institution: string
  location: string
  role: string
  type: string
  posted: string
  closes: string
  summary: string
  featured?: boolean
}

export const jobs: EducationJob[] = [
  {
    id: "head-primary-lisbon",
    title: "Head of Primary",
    institution: "United Lisbon International School",
    location: "Lisbon",
    role: "Leadership",
    type: "Full time",
    posted: "24 July 2026",
    closes: "21 August 2026",
    summary:
      "Lead an ambitious, inclusive primary programme in a multilingual international community.",
    featured: true,
  },
  {
    id: "ib-english-teacher",
    title: "IB English Language & Literature Teacher",
    institution: "International Sharing School",
    location: "Lisbon",
    role: "Teaching",
    type: "Full time",
    posted: "22 July 2026",
    closes: "14 August 2026",
    summary:
      "Join a collaborative secondary team teaching MYP and Diploma Programme learners.",
  },
  {
    id: "sen-learning-support",
    title: "Learning Support Specialist",
    institution: "Nobel Algarve British International School",
    location: "Algarve",
    role: "Student support",
    type: "Full time",
    posted: "18 July 2026",
    closes: "8 August 2026",
    summary:
      "Coordinate individual support plans and work closely with teachers and families.",
  },
  {
    id: "early-years-educator",
    title: "Early Years Educator",
    institution: "IPS Cascais British International School",
    location: "Cascais",
    role: "Teaching",
    type: "Fixed term",
    posted: "16 July 2026",
    closes: "11 August 2026",
    summary:
      "Create a playful, language-rich environment for children aged three to five.",
  },
  {
    id: "arts-programme-coordinator",
    title: "Youth Arts Programme Coordinator",
    institution: "Algarve Arts Academy",
    location: "Algarve",
    role: "Operations",
    type: "Part time",
    posted: "12 July 2026",
    closes: "2 August 2026",
    summary:
      "Coordinate term-time workshops, visiting artists and family performances.",
  },
]
