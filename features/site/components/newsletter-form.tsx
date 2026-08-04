"use client"

import { ArrowRight, Check } from "lucide-react"
import { FormEvent, useState } from "react"
import { trackEvent } from "@/features/shared/analytics"

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalized = email.trim()

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      setError("Enter a valid email address.")
      return
    }

    setError("")
    setSubmitted(true)
    trackEvent("newsletter_submitted", { placement: compact ? "footer" : "homepage" })
  }

  if (submitted) {
    return (
      <div className="newsletter-success" role="status">
        <span>
          <Check aria-hidden="true" size={18} />
        </span>
        <div>
          <strong>Your address is ready.</strong>
          <p>
            This preview does not connect to a mailing service, so no confirmation
            email has been sent.
          </p>
          <a
            href={`mailto:info@educationinportugal.com?subject=Newsletter signup&body=${encodeURIComponent(
              `Please add ${email} to the Education in Portugal newsletter.`,
            )}`}
          >
            Ask the editorial team to add me
          </a>
        </div>
      </div>
    )
  }

  return (
    <form className={compact ? "newsletter-form compact" : "newsletter-form"} onSubmit={handleSubmit} noValidate>
      <div className="newsletter-field">
        <label htmlFor={compact ? "footer-email" : "newsletter-email"}>Email address</label>
        <input
          id={compact ? "footer-email" : "newsletter-email"}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${compact ? "footer" : "home"}-email-error` : undefined}
          required
        />
        <button type="submit" aria-label="Join the Education in Portugal newsletter">
          <ArrowRight aria-hidden="true" />
        </button>
      </div>
      {error ? (
        <p className="form-error" id={`${compact ? "footer" : "home"}-email-error`}>
          {error}
        </p>
      ) : null}
      {!compact ? (
        <p className="form-note">
          One considered email a month. Unsubscribe whenever you like.
        </p>
      ) : null}
    </form>
  )
}
