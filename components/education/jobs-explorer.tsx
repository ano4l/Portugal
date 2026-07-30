"use client"

import * as Dialog from "@radix-ui/react-dialog"
import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarClock,
  Check,
  Compass,
  FileText,
  MapPin,
  Search,
  Send,
  SlidersHorizontal,
  Users,
  X,
} from "lucide-react"
import { FormEvent, useMemo, useState } from "react"
import { trackEvent } from "@/lib/analytics"
import { jobs } from "@/lib/education-data"

type JobInterestValues = {
  name: string
  email: string
  institution: string
  hiringNeed: string
}

type JobFilterKey = "role" | "location" | "institution" | "type"

type JobFilterValues = Record<JobFilterKey, string>

function JobFilterControls({
  values,
  onChange,
}: {
  values: JobFilterValues
  onChange: (filter: JobFilterKey, value: string) => void
}) {
  return (
    <div className="job-filter-controls">
      <label>
        Role
        <select value={values.role} onChange={(event) => onChange("role", event.target.value)}>
          <option value="">All roles</option>
          <option>Teaching</option>
          <option>Leadership</option>
          <option>Student support</option>
          <option>Operations</option>
        </select>
      </label>
      <label>
        Location
        <select
          value={values.location}
          onChange={(event) => onChange("location", event.target.value)}
        >
          <option value="">Across Portugal</option>
          <option>Lisbon</option>
          <option>Cascais</option>
          <option>Algarve</option>
        </select>
      </label>
      <label>
        Institution
        <select
          value={values.institution}
          onChange={(event) => onChange("institution", event.target.value)}
        >
          <option value="">Every institution</option>
          {Array.from(new Set(jobs.map((job) => job.institution))).map((name) => (
            <option key={name}>{name}</option>
          ))}
        </select>
      </label>
      <label>
        Employment type
        <select value={values.type} onChange={(event) => onChange("type", event.target.value)}>
          <option value="">All arrangements</option>
          <option>Full time</option>
          <option>Part time</option>
          <option>Fixed term</option>
        </select>
      </label>
    </div>
  )
}

export function JobsExplorer() {
  const [query, setQuery] = useState("")
  const [locationQuery, setLocationQuery] = useState("")
  const [committedQuery, setCommittedQuery] = useState("")
  const [committedLocation, setCommittedLocation] = useState("")
  const [role, setRole] = useState("")
  const [location, setLocation] = useState("")
  const [institution, setInstitution] = useState("")
  const [type, setType] = useState("")
  const [postOpen, setPostOpen] = useState(false)
  const [postSubmitted, setPostSubmitted] = useState(false)
  const [interest, setInterest] = useState<JobInterestValues>({
    name: "",
    email: "",
    institution: "",
    hiringNeed: "",
  })
  const [interestErrors, setInterestErrors] = useState<Partial<JobInterestValues>>({})

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setCommittedQuery(query.trim())
    setCommittedLocation(locationQuery.trim())
    trackEvent("job_search_submitted", {
      query: query.trim(),
      location: locationQuery.trim(),
    })
  }

  const results = useMemo(() => {
    const normalizedQuery = committedQuery.toLowerCase()
    const normalizedPlace = committedLocation.toLowerCase()
    return jobs.filter((job) => {
      const searchable = `${job.title} ${job.institution} ${job.role} ${job.summary}`.toLowerCase()
      return (
        (!normalizedQuery || searchable.includes(normalizedQuery)) &&
        (!normalizedPlace || job.location.toLowerCase().includes(normalizedPlace)) &&
        (!role || job.role === role) &&
        (!location || job.location === location) &&
        (!institution || job.institution === institution) &&
        (!type || job.type === type)
      )
    })
  }, [committedLocation, committedQuery, institution, location, role, type])

  function resetJobs() {
    setQuery("")
    setLocationQuery("")
    setCommittedQuery("")
    setCommittedLocation("")
    setRole("")
    setLocation("")
    setInstitution("")
    setType("")
  }

  function submitInterest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: Partial<JobInterestValues> = {}
    if (interest.name.trim().length < 2) nextErrors.name = "Enter your name."
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(interest.email.trim())) {
      nextErrors.email = "Enter a valid work email."
    }
    if (interest.institution.trim().length < 2) {
      nextErrors.institution = "Enter your institution name."
    }
    if (interest.hiringNeed.trim().length < 10) {
      nextErrors.hiringNeed = "Tell us briefly about the role you need to fill."
    }
    setInterestErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setPostSubmitted(true)
    trackEvent("job_post_interest_submitted", {
      institution: interest.institution.trim(),
    })
  }

  function updateInterest(field: keyof JobInterestValues, value: string) {
    setInterest((current) => ({ ...current, [field]: value }))
    setInterestErrors((current) => ({ ...current, [field]: undefined }))
  }

  const selectChanged = (filter: JobFilterKey, value: string) => {
    if (filter === "role") setRole(value)
    if (filter === "location") setLocation(value)
    if (filter === "institution") setInstitution(value)
    if (filter === "type") setType(value)

    trackEvent("directory_filter_changed", {
      context: "jobs",
      filter,
      value,
    })
  }

  const jobFilterValues: JobFilterValues = { role, location, institution, type }
  const activeJobFilters = Object.entries(jobFilterValues).filter(([, value]) => Boolean(value))

  return (
    <>
      <section className="jobs-hero">
        <div className="shell jobs-hero-inner">
          <div className="jobs-hero-copy">
            <p className="eyebrow eyebrow-light">Education careers in Portugal</p>
            <h1>Find the school where your work matters.</h1>
            <p>
              Considered roles at international schools, bilingual settings and
              independent learning communities, edited for educators who care about fit.
            </p>
          </div>
          <div className="jobs-hero-note">
            <span>For schools</span>
            <p>Hiring thoughtfully? Meet educators already interested in Portugal.</p>
            <button
              className="text-link text-link-light"
              type="button"
              onClick={() => {
                setPostSubmitted(false)
                setPostOpen(true)
              }}
            >
              Post a job <ArrowUpRight aria-hidden="true" />
            </button>
          </div>
          <form className="job-search-desk" onSubmit={submitSearch} role="search">
            <div>
              <label htmlFor="job-keyword">Role or subject</label>
              <span>
                <BriefcaseBusiness aria-hidden="true" />
                <input
                  id="job-keyword"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="e.g. English teacher"
                  type="search"
                />
              </span>
            </div>
            <div>
              <label htmlFor="job-place">Location</label>
              <span>
                <MapPin aria-hidden="true" />
                <input
                  id="job-place"
                  value={locationQuery}
                  onChange={(event) => setLocationQuery(event.target.value)}
                placeholder="Lisbon or Algarve"
                  type="search"
                />
              </span>
            </div>
            <button className="button button-coral" type="submit">
              Search roles <Search aria-hidden="true" />
            </button>
          </form>
        </div>
      </section>

      <section className="jobs-workspace" aria-labelledby="open-roles-title">
        <div className="shell">
          <div className="mobile-jobs-filter-bar">
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <button className="button button-outline" type="button">
                  <SlidersHorizontal aria-hidden="true" />
                  Job filters {activeJobFilters.length ? `(${activeJobFilters.length})` : ""}
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="dialog-overlay" />
                <Dialog.Content className="filter-drawer">
                  <div className="drawer-header">
                    <div>
                      <Dialog.Title>Filter education jobs</Dialog.Title>
                      <Dialog.Description className="sr-only">
                        Refine job listings by role, location, institution and employment type.
                      </Dialog.Description>
                      <p>{results.length} {results.length === 1 ? "role matches" : "roles match"}</p>
                    </div>
                    <Dialog.Close asChild>
                      <button className="icon-button" type="button" aria-label="Close job filters">
                        <X aria-hidden="true" />
                      </button>
                    </Dialog.Close>
                  </div>
                  <div className="drawer-content job-filter-drawer-content">
                    <JobFilterControls values={jobFilterValues} onChange={selectChanged} />
                  </div>
                  <div className="drawer-footer">
                    <button className="button button-quiet" type="button" onClick={resetJobs}>
                      Clear all
                    </button>
                    <Dialog.Close asChild>
                      <button className="button button-primary" type="button">
                        Show {results.length} {results.length === 1 ? "role" : "roles"}
                      </button>
                    </Dialog.Close>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
            <span aria-live="polite">{results.length} open {results.length === 1 ? "role" : "roles"}</span>
          </div>

          {activeJobFilters.length ? (
            <div className="mobile-job-chips" aria-label="Applied job filters">
              {activeJobFilters.map(([filter, value]) => (
                <button
                  type="button"
                  key={filter}
                  onClick={() => selectChanged(filter as JobFilterKey, "")}
                >
                  {value} <X aria-hidden="true" />
                </button>
              ))}
            </div>
          ) : null}

          <div className="jobs-layout">
            <aside className="jobs-filter-panel" aria-label="Filter job listings">
              <p className="eyebrow">Refine roles</p>
              <h2>Shape your search</h2>
              <JobFilterControls values={jobFilterValues} onChange={selectChanged} />
              {activeJobFilters.length ? (
                <button className="clear-jobs" type="button" onClick={resetJobs}>
                  Clear filters
                </button>
              ) : null}
              <div className="job-alert-card">
                <Send aria-hidden="true" />
                <h3>Good roles travel fast.</h3>
                <p>Get a concise weekly note when new Portugal education roles open.</p>
                <a href="mailto:info@educationinportugal.com?subject=Weekly job alerts">
                  Start a job alert
                </a>
              </div>
            </aside>

            <div className="jobs-results">
            <div className="jobs-results-head">
              <div>
                <p className="eyebrow">Open now</p>
                <h2 id="open-roles-title">Roles with a sense of place</h2>
              </div>
              <p aria-live="polite">
                <strong>{results.length}</strong> {results.length === 1 ? "role" : "roles"}
              </p>
            </div>

            {results.length ? (
              <div className="job-list">
                {results.map((job) => (
                  <article className={job.featured ? "job-card featured" : "job-card"} key={job.id}>
                    <div className="job-card-main">
                      <div className="job-card-labels">
                        <span>{job.role}</span>
                        {job.featured ? <span>Editor’s pick</span> : null}
                      </div>
                      <h3>{job.title}</h3>
                      <p className="job-institution">{job.institution}</p>
                      <p>{job.summary}</p>
                      <div className="job-meta">
                        <span><MapPin aria-hidden="true" /> {job.location}</span>
                        <span><BriefcaseBusiness aria-hidden="true" /> {job.type}</span>
                        <span><CalendarClock aria-hidden="true" /> Closes {job.closes}</span>
                      </div>
                    </div>
                    <div className="job-card-side">
                      <span>Posted {job.posted}</span>
                      <a
                        className="button button-outline button-small"
                        href={`mailto:info@educationinportugal.com?subject=${encodeURIComponent(`Application enquiry: ${job.title}`)}&body=${encodeURIComponent(`Please help me find the correct application route for ${job.title} at ${job.institution}.`)}`}
                      >
                        Application route <ArrowUpRight aria-hidden="true" />
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state" role="status">
                <span><Search aria-hidden="true" /></span>
                <p className="eyebrow">No exact match today</p>
                <h2>Try a broader role or location.</h2>
                <p>
                  Education hiring changes quickly. Reset your search or ask for a
                  weekly note when relevant roles open.
                </p>
                <button className="button button-primary" type="button" onClick={resetJobs}>
                  Show every role
                </button>
              </div>
            )}
            </div>
          </div>
        </div>
      </section>

      <section className="educator-guide" aria-labelledby="educator-guide-title">
        <div className="shell">
          <div>
            <p className="eyebrow eyebrow-light">Before you apply</p>
            <h2 id="educator-guide-title">A move works better when the life does too.</h2>
          </div>
          <div className="educator-guide-grid">
            <article>
              <Compass aria-hidden="true" />
              <h3>Understand the regions</h3>
              <p>Compare pace, housing patterns and school commutes before choosing a role.</p>
            </article>
            <article>
              <FileText aria-hidden="true" />
              <h3>Prepare your documents</h3>
              <p>Schools may ask for qualification recognition, references and safeguarding checks.</p>
            </article>
            <article>
              <Users aria-hidden="true" />
              <h3>Ask about community</h3>
              <p>Induction, language support and staff culture matter long after the offer letter.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="employer-band" aria-labelledby="employer-title">
        <div className="shell">
          <div>
            <p className="eyebrow">For schools & learning organisations</p>
            <h2 id="employer-title">Reach educators choosing Portugal on purpose.</h2>
          </div>
          <p>
            Editorially presented roles, focused distribution and applicants who
            already understand the setting.
          </p>
          <button
            className="button button-primary"
            type="button"
            onClick={() => {
              setPostSubmitted(false)
              setPostOpen(true)
            }}
          >
            Start a job listing <ArrowRight aria-hidden="true" />
          </button>
        </div>
      </section>

      <Dialog.Root open={postOpen} onOpenChange={setPostOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="job-interest-dialog">
            <div className="enquiry-dialog-head">
              <div>
                <p className="eyebrow">For employers</p>
                <Dialog.Title>Post an education role</Dialog.Title>
                <Dialog.Description>
                  Tell us what you need. Our partnerships editor will reply with
                  format, timing and publication options.
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button className="icon-button" type="button" aria-label="Close post a job form">
                  <X aria-hidden="true" />
                </button>
              </Dialog.Close>
            </div>
            {postSubmitted ? (
              <div className="enquiry-success" role="status">
                <span><Check aria-hidden="true" /></span>
                <p className="eyebrow">Draft complete</p>
                <h3>Your job brief is ready to send.</h3>
                <p>
                  This preview has checked your details but has not emailed them.
                  Send the prepared note to our partnerships team to continue.
                </p>
                <a
                  className="button button-primary"
                  href={`mailto:info@educationinportugal.com?subject=${encodeURIComponent(
                    `Job listing request from ${interest.institution}`,
                  )}&body=${encodeURIComponent(
                    `Name: ${interest.name}\nEmail: ${interest.email}\nInstitution: ${interest.institution}\n\nHiring need:\n${interest.hiringNeed}`,
                  )}`}
                >
                  Email partnerships <Send aria-hidden="true" />
                </a>
              </div>
            ) : (
              <form className="enquiry-form" onSubmit={submitInterest} noValidate>
                <div className="field-row">
                  <div className="form-field">
                    <label htmlFor="interest-name">Your name</label>
                    <input
                      id="interest-name"
                      value={interest.name}
                      onChange={(event) => updateInterest("name", event.target.value)}
                      autoComplete="name"
                      aria-invalid={Boolean(interestErrors.name)}
                      required
                    />
                    {interestErrors.name ? <p className="form-error">{interestErrors.name}</p> : null}
                  </div>
                  <div className="form-field">
                    <label htmlFor="interest-email">Work email</label>
                    <input
                      id="interest-email"
                      type="email"
                      value={interest.email}
                      onChange={(event) => updateInterest("email", event.target.value)}
                      autoComplete="email"
                      aria-invalid={Boolean(interestErrors.email)}
                      required
                    />
                    {interestErrors.email ? <p className="form-error">{interestErrors.email}</p> : null}
                  </div>
                </div>
                <div className="form-field">
                  <label htmlFor="interest-institution">Institution</label>
                  <input
                    id="interest-institution"
                    value={interest.institution}
                    onChange={(event) => updateInterest("institution", event.target.value)}
                    autoComplete="organization"
                    aria-invalid={Boolean(interestErrors.institution)}
                    required
                  />
                  {interestErrors.institution ? <p className="form-error">{interestErrors.institution}</p> : null}
                </div>
                <div className="form-field">
                  <label htmlFor="interest-need">What are you hiring for?</label>
                  <textarea
                    id="interest-need"
                    value={interest.hiringNeed}
                    onChange={(event) => updateInterest("hiringNeed", event.target.value)}
                    rows={5}
                    placeholder="Role, location and ideal publication date"
                    aria-invalid={Boolean(interestErrors.hiringNeed)}
                    required
                  />
                  {interestErrors.hiringNeed ? <p className="form-error">{interestErrors.hiringNeed}</p> : null}
                </div>
                <div className="enquiry-form-foot">
                  <p>No payment is taken at this stage.</p>
                  <button className="button button-coral" type="submit">
                    Send to partnerships <Send aria-hidden="true" />
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
