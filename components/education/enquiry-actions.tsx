"use client"

import * as Dialog from "@radix-ui/react-dialog"
import {
  ArrowRight,
  CalendarDays,
  Check,
  ExternalLink,
  Info,
  MessageCircle,
  Phone,
  Send,
  X,
} from "lucide-react"
import { FormEvent, useEffect, useState } from "react"
import { trackEvent } from "@/lib/analytics"

type EnquiryMode = "Enquire" | "Request information" | "Book a visit"

type EnquiryValues = {
  name: string
  email: string
  childAge: string
  startDate: string
  message: string
  consent: boolean
}

const initialValues: EnquiryValues = {
  name: "",
  email: "",
  childAge: "",
  startDate: "",
  message: "",
  consent: false,
}

export function EnquiryActions() {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<EnquiryMode>("Enquire")
  const [values, setValues] = useState<EnquiryValues>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof EnquiryValues, string>>>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [requestError, setRequestError] = useState("")
  const [deliveryReference, setDeliveryReference] = useState("")
  const [deliveryCode, setDeliveryCode] = useState("")
  const [showMobileBar, setShowMobileBar] = useState(false)

  useEffect(() => {
    trackEvent("listing_viewed", { listing: "international-sharing-school" })

    const trigger = document.getElementById("profile-action-trigger")
    if (!trigger) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowMobileBar(!entry.isIntersecting && entry.boundingClientRect.top < 0)
      },
      { threshold: 0 },
    )
    observer.observe(trigger)

    return () => observer.disconnect()
  }, [])

  function begin(nextMode: EnquiryMode) {
    setMode(nextMode)
    setSubmitted(false)
    setRequestError("")
    setDeliveryReference("")
    setDeliveryCode("")
    setOpen(true)
    trackEvent("enquiry_started", {
      listing: "international-sharing-school",
      enquiry_type: nextMode,
    })
  }

  function update<K extends keyof EnquiryValues>(key: K, value: EnquiryValues[K]) {
    setValues((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: Partial<Record<keyof EnquiryValues, string>> = {}

    if (values.name.trim().length < 2) nextErrors.name = "Enter your full name."
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      nextErrors.email = "Enter a valid email address."
    }
    const age = Number(values.childAge)
    if (!values.childAge || age < 1 || age > 21) {
      nextErrors.childAge = "Enter an age between 1 and 21."
    }
    if (!values.startDate) nextErrors.startDate = "Choose a preferred start date."
    if (values.message.trim().length < 12) {
      nextErrors.message = "Tell the school a little more (at least 12 characters)."
    }
    if (!values.consent) nextErrors.consent = "Consent is required to share your enquiry."

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      const firstInvalid = Object.keys(nextErrors)[0]
      document.getElementById(`enquiry-${firstInvalid}`)?.focus()
      return
    }

    setSubmitting(true)
    setRequestError("")

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          enquiryType: mode,
          listing: "International Sharing School",
        }),
      })
      const result = (await response.json()) as {
        ok: boolean
        code?: string
        error?: string
        reference?: string
        admissionsDelivered?: boolean
      }

      setDeliveryReference(result.reference ?? "")

      if (!response.ok || !result.ok) {
        setDeliveryCode(result.code ?? "DELIVERY_FAILED")
        if (result.admissionsDelivered) {
          setRequestError(
            `Admissions accepted your request (reference ${result.reference}), but the confirmation email failed. Please keep this reference.`,
          )
        } else {
          setRequestError(
            result.error ??
              "Nothing was sent. Your details are still here, so you can try again or use direct email.",
          )
        }
        return
      }

      setSubmitted(true)
      trackEvent("enquiry_submitted", {
        listing: "international-sharing-school",
        enquiry_type: mode,
      })
    } catch {
      setDeliveryCode("DELIVERY_UNAVAILABLE")
      setRequestError(
        "Nothing was sent. The delivery service could not be reached, and your entered details are still here.",
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <div
        id="enquire"
        className="profile-action-panel"
        role="region"
        aria-label="Contact International Sharing School"
      >
        <p className="eyebrow">Admissions next step</p>
        <h2>Could this be your school?</h2>
        <p>
          Share a few details and we will confirm whether admissions delivery
          succeeded. If it is unavailable, your form stays intact and a direct
          email option appears.
        </p>
        <button className="button button-coral button-wide" type="button" onClick={() => begin("Enquire")}>
          Enquire now <ArrowRight aria-hidden="true" />
        </button>
        <div className="profile-action-grid">
          <button type="button" onClick={() => begin("Request information")}>
            <Info aria-hidden="true" />
            Request info
          </button>
          <button type="button" onClick={() => begin("Book a visit")}>
            <CalendarDays aria-hidden="true" />
            Book a visit
          </button>
          <a href="tel:+351214876140">
            <Phone aria-hidden="true" />
            Call school
          </a>
          <a
            href="https://wa.me/351282341100?text=Hello%2C%20I%27d%20like%20to%20ask%20about%20International%20Sharing%20School."
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle aria-hidden="true" />
            WhatsApp guide
          </a>
        </div>
        <a
          className="visit-site-link"
            href="https://taguspark.sharingschool.org/"
          target="_blank"
          rel="noreferrer"
        >
          Visit the school website
          <ExternalLink aria-hidden="true" />
        </a>
        <p className="response-note">
          We only show “sent” after the email service confirms delivery.
        </p>
      </div>

      <div
        className={showMobileBar && !open ? "mobile-enquiry-bar visible" : "mobile-enquiry-bar"}
        aria-hidden={!showMobileBar || open}
      >
        <span>
          <strong>International Sharing School</strong>
          <small>Ask admissions</small>
        </span>
        <button
          className="button button-coral"
          type="button"
          onClick={() => begin("Enquire")}
          tabIndex={showMobileBar && !open ? 0 : -1}
        >
          Enquire
        </button>
      </div>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="enquiry-dialog">
            <div className="enquiry-dialog-head">
              <div>
                <p className="eyebrow">International Sharing School</p>
                <Dialog.Title>{mode}</Dialog.Title>
                <Dialog.Description>
                  The form checks your details, then confirms whether the school
                  email and your confirmation email were accepted for delivery.
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button className="icon-button" type="button" aria-label="Close enquiry form">
                  <X aria-hidden="true" />
                </button>
              </Dialog.Close>
            </div>

            {submitted ? (
              <div className="enquiry-success" role="status">
                <span>
                  <Check aria-hidden="true" />
                </span>
                <p className="eyebrow">Enquiry sent</p>
                <h3>It’s with the admissions team.</h3>
                <p>
                  We’ve routed your {mode.toLowerCase()} request to International
                  Sharing School. The email service also accepted a confirmation
                  for <strong>{values.email}</strong>.
                </p>
                <div>
                  <p>
                    <strong>Reference {deliveryReference}</strong>
                    The school will reply directly, usually within two working days.
                  </p>
                </div>
                <Dialog.Close asChild>
                  <button className="button button-primary" type="button">
                    Back to the profile
                  </button>
                </Dialog.Close>
              </div>
            ) : (
              <form className="enquiry-form" onSubmit={handleSubmit} noValidate>
                <div className="field-row">
                  <div className="form-field">
                    <label htmlFor="enquiry-name">Parent or guardian name</label>
                    <input
                      id="enquiry-name"
                      value={values.name}
                      onChange={(event) => update("name", event.target.value)}
                      autoComplete="name"
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? "enquiry-name-error" : undefined}
                      required
                    />
                    {errors.name ? <p className="form-error" id="enquiry-name-error">{errors.name}</p> : null}
                  </div>
                  <div className="form-field">
                    <label htmlFor="enquiry-email">Email address</label>
                    <input
                      id="enquiry-email"
                      value={values.email}
                      onChange={(event) => update("email", event.target.value)}
                      type="email"
                      autoComplete="email"
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? "enquiry-email-error" : undefined}
                      required
                    />
                    {errors.email ? <p className="form-error" id="enquiry-email-error">{errors.email}</p> : null}
                  </div>
                </div>

                <div className="field-row">
                  <div className="form-field">
                    <label htmlFor="enquiry-childAge">Child’s age</label>
                    <input
                      id="enquiry-childAge"
                      value={values.childAge}
                      onChange={(event) => update("childAge", event.target.value)}
                      type="number"
                      inputMode="numeric"
                      min="1"
                      max="21"
                      aria-invalid={Boolean(errors.childAge)}
                      aria-describedby={errors.childAge ? "enquiry-childAge-error" : undefined}
                      required
                    />
                    {errors.childAge ? <p className="form-error" id="enquiry-childAge-error">{errors.childAge}</p> : null}
                  </div>
                  <div className="form-field">
                    <label htmlFor="enquiry-startDate">Preferred start date</label>
                    <input
                      id="enquiry-startDate"
                      value={values.startDate}
                      onChange={(event) => update("startDate", event.target.value)}
                      type="date"
                      aria-invalid={Boolean(errors.startDate)}
                      aria-describedby={errors.startDate ? "enquiry-startDate-error" : undefined}
                      required
                    />
                    {errors.startDate ? <p className="form-error" id="enquiry-startDate-error">{errors.startDate}</p> : null}
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="enquiry-message">What would you like the school to know?</label>
                  <textarea
                    id="enquiry-message"
                    value={values.message}
                    onChange={(event) => update("message", event.target.value)}
                    rows={5}
                    placeholder="For example: curriculum questions, current year group, or dates you could visit."
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? "enquiry-message-error" : "enquiry-message-note"}
                    required
                  />
                  <p className="form-note" id="enquiry-message-note">
                    Please don’t include medical records or other sensitive documents.
                  </p>
                  {errors.message ? <p className="form-error" id="enquiry-message-error">{errors.message}</p> : null}
                </div>

                <div className="consent-field">
                  <input
                    id="enquiry-consent"
                    type="checkbox"
                    checked={values.consent}
                    onChange={(event) => update("consent", event.target.checked)}
                    aria-invalid={Boolean(errors.consent)}
                    aria-describedby={errors.consent ? "enquiry-consent-error" : undefined}
                    required
                  />
                  <label htmlFor="enquiry-consent">
                    I agree that Education in Portugal may share these details with
                    International Sharing School to respond to my enquiry.
                  </label>
                </div>
                {errors.consent ? <p className="form-error" id="enquiry-consent-error">{errors.consent}</p> : null}
                {requestError ? (
                  <div className="request-error" role="alert">
                    <p>{requestError}</p>
                    {deliveryCode !== "CONFIRMATION_DELIVERY_FAILED" ? (
                      <a
                        href={`mailto:admissions@taguspark.sharingschool.org?subject=${encodeURIComponent(
                          `${mode}: International Sharing School${deliveryReference ? ` (${deliveryReference})` : ""}`,
                        )}&body=${encodeURIComponent(
                          `Parent or guardian: ${values.name}\nEmail: ${values.email}\nChild age: ${values.childAge}\nPreferred start date: ${values.startDate}\n\nMessage:\n${values.message}`,
                        )}`}
                      >
                        Email admissions directly
                      </a>
                    ) : null}
                    {deliveryReference ? <small>Reference: {deliveryReference}</small> : null}
                  </div>
                ) : null}

                <div className="enquiry-form-foot">
                  <p>Your details are used only to route and follow up this enquiry.</p>
                  <button className="button button-coral" type="submit" disabled={submitting}>
                    {submitting ? "Sending…" : (
                      <>
                        Send to admissions <Send aria-hidden="true" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}
