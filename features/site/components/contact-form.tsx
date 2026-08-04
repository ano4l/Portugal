"use client"

import { ArrowRight } from "lucide-react"
import { FormEvent, useState } from "react"

type FormStatus =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "success"; reference: string }
  | { state: "error"; message: string }

export function ContactForm({ purpose }: { purpose: "contact" | "advertise" }) {
  const [status, setStatus] = useState<FormStatus>({ state: "idle" })
  const isAdvertise = purpose === "advertise"

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus({ state: "submitting" })
    const form = new FormData(event.currentTarget)
    const payload = Object.fromEntries(form.entries())

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, purpose, consent: form.get("consent") === "on" }),
      })
      const result = (await response.json()) as {
        ok?: boolean
        reference?: string
        error?: string
      }

      if (!response.ok || !result.ok) {
        setStatus({
          state: "error",
          message: result.error ?? "We could not send your message online.",
        })
        return
      }

      event.currentTarget.reset()
      setStatus({ state: "success", reference: result.reference ?? "Confirmed" })
    } catch {
      setStatus({
        state: "error",
        message: "We could not connect to the message service.",
      })
    }
  }

  return (
    <form className="enquiry-form contact-form" onSubmit={submit}>
      <div className="field-row">
        <div className="form-field">
          <label htmlFor={`${purpose}-name`}>Your name</label>
          <input id={`${purpose}-name`} name="name" autoComplete="name" required />
        </div>
        <div className="form-field">
          <label htmlFor={`${purpose}-email`}>Email address</label>
          <input id={`${purpose}-email`} name="email" type="email" autoComplete="email" required />
        </div>
      </div>
      <div className="field-row">
        <div className="form-field">
          <label htmlFor={`${purpose}-organisation`}>Organisation</label>
          <input id={`${purpose}-organisation`} name="organisation" autoComplete="organization" required={isAdvertise} />
        </div>
        <div className="form-field">
          <label htmlFor={`${purpose}-interest`}>{isAdvertise ? "Interested in" : "Enquiry type"}</label>
          <select id={`${purpose}-interest`} name="interest" required defaultValue="">
            <option value="" disabled>Select one</option>
            {isAdvertise ? (
              <>
                <option>Magazine advertising</option>
                <option>Directory profile</option>
                <option>Sponsored editorial</option>
                <option>Job listings</option>
                <option>Digital campaign</option>
              </>
            ) : (
              <>
                <option>Family guidance</option>
                <option>Editorial</option>
                <option>Directory listing</option>
                <option>Jobs</option>
                <option>General</option>
              </>
            )}
          </select>
        </div>
      </div>
      <div className="form-field">
        <label htmlFor={`${purpose}-message`}>How can we help?</label>
        <textarea id={`${purpose}-message`} name="message" rows={6} required />
      </div>
      <label className="consent-field">
        <input name="consent" type="checkbox" required />
        <span>I agree that Education in Portugal may use these details to respond to my enquiry.</span>
      </label>
      <div className="contact-form-foot">
        <button className="button button-primary" type="submit" disabled={status.state === "submitting"}>
          {status.state === "submitting" ? "Sending" : "Send enquiry"}
          <ArrowRight aria-hidden="true" />
        </button>
        <div aria-live="polite">
          {status.state === "success" ? (
            <p className="form-success">Message sent. Reference: {status.reference}</p>
          ) : null}
          {status.state === "error" ? (
            <p className="form-error">
              {status.message} You can also email <a href="mailto:info@educationinportugal.com">info@educationinportugal.com</a>.
            </p>
          ) : null}
        </div>
      </div>
    </form>
  )
}
