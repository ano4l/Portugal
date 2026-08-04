import { articles as fallbackArticles, jobs as fallbackJobs, schools as fallbackSchools, type EducationJob, type SchoolListing } from "./fallback-data"
import { hasPublicSupabaseConfig } from "@/lib/supabase/config"
import { createClient } from "@/lib/supabase/server"

export type PublishedArticle = (typeof fallbackArticles)[number] & {
  body?: string
  author?: string
  linkPolicy?: "follow" | "nofollow"
}

export async function getPublishedArticles(): Promise<PublishedArticle[]> {
  if (!hasPublicSupabaseConfig()) return fallbackArticles

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false })

    if (error || !data?.length) return fallbackArticles
    return data.map((record) => ({
      slug: record.slug,
      category: record.category,
      title: record.title?.en ?? "",
      excerpt: record.excerpt?.en ?? "",
      image: record.hero_image_url ?? "/education/article-moving-schools.webp",
      readingTime: record.reading_time ?? "4 min read",
      body: record.body?.en ?? "",
      author: record.author,
      linkPolicy: record.link_policy === "nofollow" ? "nofollow" : "follow",
    }))
  } catch {
    return fallbackArticles
  }
}

export type PublishedMagazine = {
  id: string
  slug: string
  title: string
  description: string
  issueNumber: string
  coverDate: string
  coverImageUrl: string
  documentUrl: string
  externalReaderUrl: string
  allowDownload: boolean
  featured: boolean
}

export async function getPublishedMagazines(): Promise<PublishedMagazine[]> {
  if (!hasPublicSupabaseConfig()) return []
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("magazines")
      .select("*")
      .eq("status", "published")
      .order("cover_date", { ascending: false })
    if (error || !data) return []
    return data.map((record) => ({
      id: record.id,
      slug: record.slug,
      title: record.title?.en ?? "",
      description: record.description?.en ?? "",
      issueNumber: record.issue_number,
      coverDate: record.cover_date ?? "",
      coverImageUrl: record.cover_image_url ?? "/education/magazine-edition-2.png",
      documentUrl: record.document_url ?? "",
      externalReaderUrl: record.external_reader_url ?? "",
      allowDownload: record.allow_download,
      featured: record.featured,
    }))
  } catch {
    return []
  }
}

export async function getPublishedSchools(): Promise<SchoolListing[]> {
  if (!hasPublicSupabaseConfig()) return fallbackSchools
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("schools").select("*").eq("status", "published").order("featured", { ascending: false })
    if (error || !data?.length) return fallbackSchools
    return data.map((record) => ({
      slug: record.slug, name: record.name, location: record.address,
      region: record.region as SchoolListing["region"], stages: record.stages ?? [],
      curriculum: record.curricula ?? [], languages: record.languages ?? [],
      type: record.provider_type, support: record.support_services ?? [],
      differentiator: record.summary?.en ?? "", image: record.cover_image_url ?? "",
      verified: record.verified, featured: record.featured,
      tuitionFrom: record.tuition_from ?? undefined, tuitionTo: record.tuition_to ?? undefined,
      latitude: record.latitude ?? undefined, longitude: record.longitude ?? undefined,
      websiteUrl: record.website_url ?? undefined, admissionsEmail: record.admissions_email ?? undefined,
      telephone: record.telephone ?? undefined, feeYear: record.fee_year ?? undefined,
      prospectusUrl: record.prospectus_url ?? undefined,
    }))
  } catch { return fallbackSchools }
}

export async function getPublishedJobs(): Promise<EducationJob[]> {
  if (!hasPublicSupabaseConfig()) return fallbackJobs
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("jobs").select("*").eq("status", "published").order("featured", { ascending: false })
    if (error || !data?.length) return fallbackJobs
    return data.map((record) => ({
      id: record.slug, title: record.title?.en ?? "", institution: record.institution,
      location: record.location, role: record.category, type: record.employment_type,
      posted: new Date(record.created_at).toLocaleDateString("en-GB"), closes: record.closes_at ?? "Open",
      summary: record.summary?.en ?? "", featured: record.featured, salary: record.salary ?? undefined,
      applicationEmail: record.application_email ?? undefined, applicationUrl: record.application_url ?? undefined,
      descriptionPt: record.description?.pt ?? undefined,
    }))
  } catch { return fallbackJobs }
}
