"use client"

import * as Dialog from "@radix-ui/react-dialog"
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  List,
  Map as MapIcon,
  MapPin,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react"
import Link from "next/link"
import { FormEvent, useMemo, useState } from "react"
import { trackEvent } from "@/lib/analytics"
import { schools, type SchoolListing } from "@/lib/education-data"
import { ListingMedia } from "./listing-media"

type FilterState = {
  regions: string[]
  curricula: string[]
  stages: string[]
  languages: string[]
  types: string[]
  support: string[]
}

const filterGroups: Array<{
  key: keyof FilterState
  label: string
  options: string[]
}> = [
  {
    key: "regions",
    label: "Region",
    options: ["Lisbon", "Cascais", "Algarve", "Porto & North"],
  },
  {
    key: "curricula",
    label: "Curriculum",
    options: ["IB", "British", "American", "Bilingual", "Portuguese", "Arts enrichment"],
  },
  {
    key: "stages",
    label: "Age group",
    options: ["Early years", "Primary", "Secondary", "All ages"],
  },
  {
    key: "languages",
    label: "Language",
    options: ["English", "Portuguese", "French"],
  },
  {
    key: "types",
    label: "Institution type",
    options: ["International school", "Tutoring centre", "Activity provider"],
  },
  {
    key: "support",
    label: "Special needs & support",
    options: ["SEN support", "Learning support", "English language support", "Inclusive provision"],
  },
]

function FilterControls({
  filters,
  onToggle,
}: {
  filters: FilterState
  onToggle: (group: keyof FilterState, value: string) => void
}) {
  return (
    <div className="filter-groups">
      {filterGroups.map((group) => (
        <details className="filter-group" key={group.key} open={group.key === "regions" || group.key === "curricula"}>
          <summary>
            <span>{group.label}</span>
            {filters[group.key].length ? <em>{filters[group.key].length}</em> : null}
            <ChevronDown aria-hidden="true" />
          </summary>
          <div className="filter-options">
            {group.options.map((option) => {
              const checked = filters[group.key].includes(option)
              return (
                <label key={option}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(group.key, option)}
                  />
                  <span className="custom-checkbox" aria-hidden="true">
                    {checked ? <Check size={14} /> : null}
                  </span>
                  <span>{option}</span>
                </label>
              )
            })}
          </div>
        </details>
      ))}
    </div>
  )
}

function SchoolCard({ school }: { school: SchoolListing }) {
  const profileHref = `/schools/${school.slug}`

  return (
    <article className="directory-card">
      <Link className="directory-card-image" href={profileHref} aria-label={`View ${school.name}`}>
        <ListingMedia
          src={school.image}
          alt={`${school.name} campus in ${school.location}`}
          name={school.name}
          region={school.region}
          sizes="(max-width: 720px) 100vw, 310px"
        />
        {school.verified ? (
          <span className="image-badge">
            <BadgeCheck aria-hidden="true" />
            Checked profile
          </span>
        ) : null}
      </Link>
      <div className="directory-card-copy">
        <div className="listing-meta">
          <span>{school.type}</span>
          <span>{school.region}</span>
        </div>
        <h2>
          <Link href={profileHref}>{school.name}</Link>
        </h2>
        <p className="card-location">
          <MapPin aria-hidden="true" />
          {school.location}
        </p>
        <p>{school.differentiator}</p>
        <dl className="card-facts">
          <div>
            <dt>Stages</dt>
            <dd>{school.stages.join(", ")}</dd>
          </div>
          <div>
            <dt>Curriculum</dt>
            <dd>{school.curriculum.join(", ")}</dd>
          </div>
          <div>
            <dt>Languages</dt>
            <dd>{school.languages.join(", ")}</dd>
          </div>
        </dl>
        <div className="directory-card-actions">
          <Link className="button button-primary button-small" href={profileHref}>
            {school.slug === "international-sharing-school" ? "View full profile" : "View school notes"}{" "}
            <ArrowRight aria-hidden="true" />
          </Link>
          {school.slug === "international-sharing-school" ? (
            <Link className="button button-quiet button-small" href={`${profileHref}#enquire`}>
              Enquire
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  )
}

export function DirectoryExplorer({
  initialQuery = "",
  initialRegion = "",
  initialCurriculum = "",
  initialStage = "",
  initialType = "",
}: {
  initialQuery?: string
  initialRegion?: string
  initialCurriculum?: string
  initialStage?: string
  initialType?: string
}) {
  const [query, setQuery] = useState(initialQuery)
  const [committedQuery, setCommittedQuery] = useState(initialQuery)
  const [filters, setFilters] = useState<FilterState>({
    regions: initialRegion ? [initialRegion] : [],
    curricula: initialCurriculum ? [initialCurriculum] : [],
    stages: initialStage ? [initialStage] : [],
    languages: [],
    types: initialType ? [initialType] : [],
    support: [],
  })
  const [sort, setSort] = useState("recommended")
  const [view, setView] = useState<"list" | "map">("list")

  function toggleFilter(group: keyof FilterState, value: string) {
    setFilters((current) => {
      const isSelected = current[group].includes(value)
      const next = {
        ...current,
        [group]: isSelected
          ? current[group].filter((item) => item !== value)
          : [...current[group], value],
      }
      trackEvent("directory_filter_changed", {
        filter: group,
        value,
        selected: !isSelected,
      })
      return next
    })
  }

  function resetAll() {
    setQuery("")
    setCommittedQuery("")
    setFilters({
      regions: [],
      curricula: [],
      stages: [],
      languages: [],
      types: [],
      support: [],
    })
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setCommittedQuery(query.trim())
    trackEvent("search_submitted", { query: query.trim(), source: "directory" })
  }

  const results = useMemo(() => {
    const normalizedQuery = committedQuery.toLocaleLowerCase()
    const filtered = schools.filter((school) => {
      const text = [
        school.name,
        school.location,
        school.region,
        school.type,
        school.differentiator,
        ...school.curriculum,
        ...school.languages,
        ...school.stages,
      ]
        .join(" ")
        .toLocaleLowerCase()

      return (
        (!normalizedQuery || text.includes(normalizedQuery)) &&
        (!filters.regions.length || filters.regions.includes(school.region)) &&
        (!filters.curricula.length ||
          filters.curricula.some((item) => school.curriculum.includes(item))) &&
        (!filters.stages.length ||
          filters.stages.some((item) => school.stages.includes(item))) &&
        (!filters.languages.length ||
          filters.languages.some((item) => school.languages.includes(item))) &&
        (!filters.types.length || filters.types.includes(school.type)) &&
        (!filters.support.length ||
          filters.support.some((item) => school.support.includes(item)))
      )
    })

    if (sort === "name") {
      return [...filtered].sort((a, b) => a.name.localeCompare(b.name))
    }
    if (sort === "region") {
      return [...filtered].sort((a, b) => a.region.localeCompare(b.region))
    }
    return [...filtered].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
  }, [committedQuery, filters, sort])

  const applied = (Object.entries(filters) as Array<[keyof FilterState, string[]]>).flatMap(
    ([group, values]) => values.map((value) => ({ group, value })),
  )

  return (
    <>
      <section className="directory-header">
        <div className="shell directory-header-inner">
          <div>
            <p className="eyebrow eyebrow-light">The Portugal education directory</p>
            <h1>Find a place where your child can belong.</h1>
            <p>
              Compare verified schools, specialist support and enriching
              activities, with practical detail and a clear contact path.
            </p>
          </div>
          <form className="directory-search" onSubmit={submitSearch} role="search">
            <label htmlFor="directory-query">Search by school, place or curriculum</label>
            <div>
              <Search aria-hidden="true" />
              <input
                id="directory-query"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Try “IB in Lisbon”"
                type="search"
              />
              <button className="button button-coral" type="submit">
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="directory-workspace" aria-label="School search results">
        <div className="shell">
          <div className="mobile-directory-bar">
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <button className="button button-outline" type="button">
                  <SlidersHorizontal aria-hidden="true" />
                  Filters {applied.length ? `(${applied.length})` : ""}
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="dialog-overlay" />
                <Dialog.Content className="filter-drawer">
                  <div className="drawer-header">
                    <div>
                      <Dialog.Title>Refine your search</Dialog.Title>
                      <Dialog.Description className="sr-only">
                        Filter directory results by region, curriculum, age group,
                        language, institution type and learning support.
                      </Dialog.Description>
                      <p>{results.length} places currently match</p>
                    </div>
                    <Dialog.Close asChild>
                      <button className="icon-button" type="button" aria-label="Close filters">
                        <X aria-hidden="true" />
                      </button>
                    </Dialog.Close>
                  </div>
                  <div className="drawer-content">
                    <FilterControls filters={filters} onToggle={toggleFilter} />
                  </div>
                  <div className="drawer-footer">
                    <button className="button button-quiet" type="button" onClick={resetAll}>
                      Clear all
                    </button>
                    <Dialog.Close asChild>
                      <button className="button button-primary" type="button">
                        Show {results.length} matches
                      </button>
                    </Dialog.Close>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>

            <label>
              <span className="sr-only">Sort results</span>
              <select value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="recommended">Recommended</option>
                <option value="name">Name A-Z</option>
                <option value="region">Region</option>
              </select>
            </label>
          </div>

          <div className="directory-grid">
            <aside className="filter-rail" aria-label="Filter directory results">
              <div className="filter-rail-head">
                <h2>Refine your search</h2>
                {applied.length ? (
                  <button type="button" onClick={resetAll}>
                    Clear all
                  </button>
                ) : null}
              </div>
              <FilterControls filters={filters} onToggle={toggleFilter} />
              <div className="filter-help">
                <p>Not sure what to choose?</p>
                <a href="tel:+351282341100">Talk to our family team</a>
              </div>
            </aside>

            <div className="results-panel">
              <div className="results-toolbar">
                <div aria-live="polite">
                  <p className="eyebrow">Your considered matches</p>
                  <strong>{results.length} {results.length === 1 ? "place" : "places"} found</strong>
                </div>
                <div className="toolbar-controls">
                  <label className="sort-control">
                    <span>Sort by</span>
                    <select value={sort} onChange={(event) => setSort(event.target.value)}>
                      <option value="recommended">Recommended</option>
                      <option value="name">Name A-Z</option>
                      <option value="region">Region</option>
                    </select>
                  </label>
                  <div className="view-toggle" role="group" aria-label="View results as list or map">
                    <button
                      className={view === "list" ? "active" : ""}
                      type="button"
                      onClick={() => setView("list")}
                      aria-pressed={view === "list"}
                    >
                      <List aria-hidden="true" /> List
                    </button>
                    <button
                      className={view === "map" ? "active" : ""}
                      type="button"
                      onClick={() => setView("map")}
                      aria-pressed={view === "map"}
                    >
                      <MapIcon aria-hidden="true" /> Map
                    </button>
                  </div>
                </div>
              </div>

              {committedQuery || applied.length ? (
                <div className="applied-filters" aria-label="Applied filters">
                  {committedQuery ? (
                    <button type="button" onClick={() => { setQuery(""); setCommittedQuery("") }}>
                      Search: {committedQuery} <X aria-hidden="true" />
                    </button>
                  ) : null}
                  {applied.map(({ group, value }) => (
                    <button type="button" onClick={() => toggleFilter(group, value)} key={`${group}-${value}`}>
                      {value} <X aria-hidden="true" />
                    </button>
                  ))}
                  <button className="clear-chip" type="button" onClick={resetAll}>
                    Clear all
                  </button>
                </div>
              ) : null}

              {results.length === 0 ? (
                <div className="empty-state" role="status">
                  <span>
                    <Search aria-hidden="true" />
                  </span>
                  <p className="eyebrow">A narrower search than expected</p>
                  <h2>No places match every choice.</h2>
                  <p>
                    Try removing one filter or start again. We can also help you
                    think through nearby regions and curriculum alternatives.
                  </p>
                  <div>
                    <button className="button button-primary" type="button" onClick={resetAll}>
                      Reset the search
                    </button>
                    <a className="button button-outline" href="tel:+351282341100">
                      Call the family team
                    </a>
                  </div>
                </div>
              ) : view === "list" ? (
                <div className="directory-results">
                  {results.map((school) => (
                    <SchoolCard key={school.slug} school={school} />
                  ))}
                </div>
              ) : (
                <div className="map-view" aria-label="Map showing matching institutions across Portugal">
                  <div className="map-surface">
                    <span className="map-coast" aria-hidden="true" />
                    {results.map((school, index) => (
                      <button
                        className={`map-marker marker-${(index % 6) + 1}`}
                        key={school.slug}
                        type="button"
                        title={school.name}
                        onClick={() => setCommittedQuery(school.name)}
                      >
                        <span>{index + 1}</span>
                        <strong>{school.name}</strong>
                      </button>
                    ))}
                    <div className="map-key">
                      <MapPin aria-hidden="true" />
                      {results.length} matching {results.length === 1 ? "place" : "places"}
                    </div>
                  </div>
                  <p>
                    Select a numbered place to focus the results. Locations are
                    indicative; open a profile for practical travel details.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
