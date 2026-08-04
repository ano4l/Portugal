"use client"

import { ArrowRight, MapPin, Navigation } from "lucide-react"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { type SchoolListing } from "@/features/content/fallback-data"
import { ListingMedia } from "./listing-media"

const markerPositions: Record<string, { left: string; top: string }> = {
  "international-sharing-school": { left: "43%", top: "39%" },
  "united-lisbon-international-school": { left: "49%", top: "46%" },
  "ips-cascais": { left: "35%", top: "48%" },
  "nobel-algarve-british-international-school": { left: "48%", top: "77%" },
  "algarve-arts-academy": { left: "59%", top: "80%" },
  "warehouse-mothership": { left: "54%", top: "42%" },
  "porto-bilingual-learning-centre": { left: "48%", top: "18%" },
}

function geographicPosition(school: SchoolListing) {
  if (school.latitude == null || school.longitude == null) return null
  const left = ((school.longitude - -9.6) / (-6.1 - -9.6)) * 100
  const top = ((42.2 - school.latitude) / (42.2 - 36.8)) * 100
  return {
    left: `${Math.min(92, Math.max(8, left))}%`,
    top: `${Math.min(92, Math.max(8, top))}%`,
  }
}

function profileHref(school: SchoolListing) {
  return `/schools/${school.slug}`
}

export function EducationMap({
  listings,
  variant = "directory",
  onSelect,
}: {
  listings: SchoolListing[]
  variant?: "directory" | "home"
  onSelect?: (school: SchoolListing) => void
}) {
  const firstSlug = listings[0]?.slug ?? ""
  const [selectedSlug, setSelectedSlug] = useState(firstSlug)

  useEffect(() => {
    if (!listings.some((school) => school.slug === selectedSlug)) {
      setSelectedSlug(firstSlug)
    }
  }, [firstSlug, listings, selectedSlug])

  const selected = useMemo(
    () => listings.find((school) => school.slug === selectedSlug) ?? listings[0],
    [listings, selectedSlug],
  )

  function selectSchool(school: SchoolListing) {
    setSelectedSlug(school.slug)
    onSelect?.(school)
  }

  if (!selected) return null

  return (
    <div className={`education-map education-map-${variant}`}>
      {variant === "home" ? (
        <aside className="education-map-panel" aria-live="polite">
          <div className="education-map-panel-image">
            <ListingMedia
              src={selected.image}
              alt={`${selected.name} in ${selected.location}`}
              name={selected.name}
              region={selected.region}
              sizes="(max-width: 760px) 100vw, 360px"
            />
          </div>
          <div className="education-map-panel-copy">
            <div className="listing-meta">
              <span>{selected.type}</span>
              <span>{selected.region}</span>
            </div>
            <h3>{selected.name}</h3>
            <p className="education-map-location">
              <MapPin aria-hidden="true" />
              {selected.location}
            </p>
            <p>{selected.differentiator}</p>
            <Link className="text-link" href={profileHref(selected)}>
              View this profile <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </aside>
      ) : null}

      <div className="education-map-stage-wrap">
        <div
          className="education-map-stage"
          role="region"
          aria-label={`Illustrated map showing ${listings.length} education ${listings.length === 1 ? "listing" : "listings"} across Portugal`}
        >
          <span className="education-map-ocean-label" aria-hidden="true">
            Atlantic
          </span>
          <span className="education-map-land" aria-hidden="true" />
          <span className="education-map-region region-north" aria-hidden="true">
            Porto &amp; North
          </span>
          <span className="education-map-region region-centre" aria-hidden="true">
            Lisbon &amp; Cascais
          </span>
          <span className="education-map-region region-south" aria-hidden="true">
            Algarve
          </span>

          {listings.map((school, index) => {
            const position = geographicPosition(school) ?? markerPositions[school.slug] ?? {
              left: `${42 + (index % 3) * 8}%`,
              top: `${28 + (index % 5) * 11}%`,
            }
            const active = school.slug === selected.slug

            return (
              <button
                className={active ? "education-map-marker active" : "education-map-marker"}
                key={school.slug}
                style={position}
                type="button"
                title={school.name}
                onClick={() => selectSchool(school)}
                aria-pressed={active}
                aria-label={`Show ${school.name}, ${school.region}`}
              >
                <span>{index + 1}</span>
                <strong>{school.name}</strong>
              </button>
            )
          })}

          <div className="education-map-key">
            <Navigation aria-hidden="true" />
            <span>
              <strong>{listings.length}</strong>
              {listings.length === 1 ? " place shown" : " places shown"}
            </span>
          </div>
        </div>
        <p className="education-map-note">
          Locations are indicative. Open a profile for address and travel details.
        </p>
      </div>
    </div>
  )
}
