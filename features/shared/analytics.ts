"use client"

export type AnalyticsEvent =
  | "search_submitted"
  | "directory_filter_changed"
  | "listing_viewed"
  | "enquiry_started"
  | "enquiry_submitted"
  | "newsletter_submitted"
  | "job_search_submitted"
  | "job_post_interest_submitted"

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>
  }
}

export function trackEvent(
  event: AnalyticsEvent,
  payload: Record<string, unknown> = {},
) {
  if (typeof window === "undefined") return

  const detail = {
    event,
    ...payload,
    timestamp: new Date().toISOString(),
  }

  window.dataLayer?.push(detail)

  if (process.env.NODE_ENV === "development") {
    console.info("[Education in Portugal]", detail)
  }
}
