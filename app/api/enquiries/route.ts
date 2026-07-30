import { NextResponse } from "next/server"

type EnquiryPayload = {
  name: string
  email: string
  childAge: string
  startDate: string
  message: string
  listing: string
  enquiryType: string
  consent: boolean
}

function createReference() {
  return `EIP-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`
}

async function sendEmail({
  apiKey,
  from,
  to,
  subject,
  text,
}: {
  apiKey: string
  from: string
  to: string
  subject: string
  text: string
}) {
  return fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [to], subject, text }),
    cache: "no-store",
  })
}

export async function POST(request: Request) {
  const reference = createReference()
  let body: EnquiryPayload

  try {
    body = (await request.json()) as EnquiryPayload
  } catch {
    return NextResponse.json(
      { ok: false, code: "INVALID_JSON", reference },
      { status: 400 },
    )
  }

  const required: Array<keyof EnquiryPayload> = [
    "name",
    "email",
    "childAge",
    "startDate",
    "message",
    "listing",
    "enquiryType",
  ]
  const missing = required.filter((field) => !String(body[field] ?? "").trim())

  if (missing.length || body.consent !== true) {
    return NextResponse.json(
      {
        ok: false,
        code: "VALIDATION_FAILED",
        error: "Please complete every required field.",
        reference,
      },
      { status: 400 },
    )
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return NextResponse.json(
      {
        ok: false,
        code: "VALIDATION_FAILED",
        error: "A valid email address is required.",
        reference,
      },
      { status: 400 },
    )
  }

  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.ENQUIRY_FROM_EMAIL
  const admissionsRecipient =
    process.env.INTERNATIONAL_SHARING_SCHOOL_ENQUIRY_EMAIL ??
    "admissions@taguspark.sharingschool.org"

  if (!apiKey || !from || !admissionsRecipient) {
    return NextResponse.json(
      {
        ok: false,
        code: "DELIVERY_NOT_CONFIGURED",
        error: "Online admissions delivery is not connected in this build.",
        reference,
      },
      { status: 503 },
    )
  }

  const admissionsText = [
    `Education in Portugal enquiry reference: ${reference}`,
    `Enquiry type: ${body.enquiryType}`,
    `Listing: ${body.listing}`,
    "",
    `Parent or guardian: ${body.name}`,
    `Email: ${body.email}`,
    `Child age: ${body.childAge}`,
    `Preferred start date: ${body.startDate}`,
    "",
    "Message:",
    body.message,
    "",
    "Consent to share these details was confirmed in the form.",
  ].join("\n")

  try {
    const admissionsResponse = await sendEmail({
      apiKey,
      from,
      to: admissionsRecipient,
      subject: `${body.enquiryType}: ${body.listing} (${reference})`,
      text: admissionsText,
    })

    if (!admissionsResponse.ok) {
      return NextResponse.json(
        {
          ok: false,
          code: "ADMISSIONS_DELIVERY_FAILED",
          error: "The admissions email service did not accept the request.",
          reference,
        },
        { status: 502 },
      )
    }

    const confirmationResponse = await sendEmail({
      apiKey,
      from,
      to: body.email,
      subject: `Your Education in Portugal enquiry (${reference})`,
      text: [
        `Hello ${body.name},`,
        "",
        `International Sharing School has received your ${body.enquiryType.toLowerCase()} request through Education in Portugal.`,
        `Reference: ${reference}`,
        "",
        "Your message:",
        body.message,
        "",
        "The admissions team will respond directly. Typical response time is two working days.",
      ].join("\n"),
    })

    if (!confirmationResponse.ok) {
      return NextResponse.json(
        {
          ok: false,
          code: "CONFIRMATION_DELIVERY_FAILED",
          error:
            "Admissions received the request, but the confirmation email could not be delivered.",
          reference,
          admissionsDelivered: true,
        },
        { status: 502 },
      )
    }

    return NextResponse.json({
      ok: true,
      deliveryStatus: "sent",
      reference,
    })
  } catch {
    return NextResponse.json(
      {
        ok: false,
        code: "DELIVERY_UNAVAILABLE",
        error: "The email delivery service is currently unavailable.",
        reference,
      },
      { status: 502 },
    )
  }
}
