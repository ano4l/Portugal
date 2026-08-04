import { hasPublicSupabaseConfig } from "@/lib/supabase/config"
import { createAdminClient } from "@/lib/supabase/server"

type LeadInput = {
  reference: string
  source: string
  sourcePath?: string
  name: string
  email: string
  telephone?: string
  organisation?: string
  subject?: string
  message: string
  consent: boolean
  metadata?: Record<string, string | boolean | null | undefined>
}

export async function captureLead(input: LeadInput) {
  if (!hasPublicSupabaseConfig() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { captured: false, reason: "not_configured" as const }
  }

  const supabase = createAdminClient()
  const { error } = await supabase.from("leads").insert({
    reference: input.reference,
    source: input.source,
    source_path: input.sourcePath,
    name: input.name,
    email: input.email,
    telephone: input.telephone,
    organisation: input.organisation,
    subject: input.subject,
    message: input.message,
    consent: input.consent,
    metadata: input.metadata ?? {},
  })

  return error
    ? { captured: false, reason: error.message }
    : { captured: true, reason: null }
}
