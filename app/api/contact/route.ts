import { NextResponse } from "next/server"
import { captureLead } from "@/features/leads/capture-lead"

type ContactPayload = {
  name: string
  email: string
  organisation?: string
  interest: string
  message: string
  purpose: "contact" | "advertise"
  consent: boolean
}

function createReference() {
  return `EIP-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`
}

export async function POST(request: Request) {
  const reference = createReference()
  let body: ContactPayload

  try {
    body = (await request.json()) as ContactPayload
  } catch {
    return NextResponse.json({ ok: false, error: "The submitted message was not valid.", reference }, { status: 400 })
  }

  const required = [body.name, body.email, body.interest, body.message]
  if (required.some((value) => !String(value ?? "").trim()) || body.consent !== true) {
    return NextResponse.json({ ok: false, error: "Please complete every required field.", reference }, { status: 400 })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return NextResponse.json({ ok: false, error: "A valid email address is required.", reference }, { status: 400 })
  }

  const lead = await captureLead({
    reference,
    source: body.purpose === "advertise" ? "advertising_form" : "contact_form",
    sourcePath: body.purpose === "advertise" ? "/advertise" : "/contact",
    name: body.name,
    email: body.email,
    organisation: body.organisation,
    subject: body.interest,
    message: body.message,
    consent: body.consent,
  })

  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.ENQUIRY_FROM_EMAIL
  const to = process.env.CONTACT_EMAIL ?? "info@educationinportugal.com"

  if (!apiKey || !from) {
    return NextResponse.json({ ok: false, leadCaptured: lead.captured, error: "Your enquiry was recorded, but email delivery is not connected yet.", reference }, { status: 503 })
  }

  let response: Response
  try {
    response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: body.email,
        subject: `${body.purpose === "advertise" ? "Advertising" : "Website"} enquiry: ${body.interest} (${reference})`,
        text: [
          `Reference: ${reference}`,
          `Name: ${body.name}`,
          `Email: ${body.email}`,
          `Organisation: ${body.organisation || "Not supplied"}`,
          `Interest: ${body.interest}`,
          "",
          body.message,
          "",
          "Consent to respond was confirmed in the form.",
        ].join("\n"),
      }),
      cache: "no-store",
    })
  } catch {
    return NextResponse.json({ ok: false, error: "The message service is currently unavailable.", reference }, { status: 502 })
  }

  if (!response.ok) {
    return NextResponse.json({ ok: false, error: "The message service did not accept this enquiry.", reference }, { status: 502 })
  }

  return NextResponse.json({ ok: true, leadCaptured: lead.captured, reference })
}
