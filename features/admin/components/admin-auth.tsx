"use client"

import { ArrowLeft, Eye, EyeOff, KeyRound, LockKeyhole } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { createClient } from "@/lib/supabase/browser"

export function AdminAuth({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setSubmitting(true)

    try {
      const supabase = createClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })

      if (signInError) {
        setError("Those details could not be authenticated. Check your editorial account and try again.")
        setSubmitting(false)
        return
      }

      onSuccess()
    } catch {
      setError("Supabase authentication has not been configured for this deployment yet.")
      setSubmitting(false)
    }
  }

  return (
    <main className="admin-auth">
      <section className="admin-auth-story" aria-labelledby="admin-auth-title">
        <Image
          src="/education/international-sharing-school.webp"
          alt="Students collaborating at an international school in Portugal"
          fill
          priority
          sizes="(max-width: 860px) 100vw, 56vw"
        />
        <div className="admin-auth-story-overlay" />
        <div className="admin-auth-story-copy">
          <div className="admin-auth-publication">
            <span className="admin-auth-mark">EP</span>
            <span>Education in Portugal</span>
          </div>
          <p className="admin-auth-eyebrow">The private editorial room</p>
          <h1 id="admin-auth-title">Shape the stories families trust.</h1>
          <p>
            Review the guide, prepare new articles and keep opportunities across Portugal current.
          </p>
          <div className="admin-auth-caption">
            <span>Editorial Studio</span>
            <span>Private access</span>
          </div>
        </div>
      </section>

      <section className="admin-auth-entry" aria-label="Editorial Studio sign in">
        <div className="admin-auth-entry-inner">
          <Link className="admin-auth-back" href="/">
            <ArrowLeft aria-hidden="true" />
            Back to the public website
          </Link>

          <div className="admin-auth-heading">
            <span className="admin-auth-icon"><LockKeyhole aria-hidden="true" /></span>
            <p>Private editorial access</p>
            <h2>Welcome to the studio</h2>
            <span>Sign in with your editorial account to enter the publishing workspace.</span>
          </div>

          <form className="admin-auth-form" onSubmit={handleSubmit} noValidate>
            <label>
              <span>Email address</span>
              <input
                autoComplete="username"
                inputMode="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>

            <label>
              <span>Password</span>
              <span className="admin-auth-password">
                <input
                  autoComplete="current-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                </button>
              </span>
            </label>

            <p className="admin-auth-error" role="alert" aria-live="assertive">
              {error}
            </p>

            <button className="admin-auth-submit" type="submit" disabled={submitting}>
              {submitting ? "Opening the studio..." : "Enter Editorial Studio"}
              {submitting ? <span className="admin-auth-spinner" aria-hidden="true" /> : <KeyRound aria-hidden="true" />}
            </button>
          </form>

          <aside className="admin-auth-credentials" aria-label="Editorial access help">
            <div>
              <span>Editorial access</span>
              <p>Accounts are managed securely through Supabase. Ask an administrator to invite you if you do not yet have access.</p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}
