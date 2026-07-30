"use client"

import { ArrowRight, MapPin } from "lucide-react"
import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { trackEvent } from "@/lib/analytics"

export function HomeSearch() {
  const router = useRouter()
  const [region, setRegion] = useState("")
  const [stage, setStage] = useState("")
  const [curriculum, setCurriculum] = useState("")

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const params = new URLSearchParams()
    if (region) params.set("region", region)
    if (stage) params.set("stage", stage)
    if (curriculum) params.set("curriculum", curriculum)
    trackEvent("search_submitted", { region, stage, curriculum, source: "homepage" })
    router.push(`/directory${params.size ? `?${params.toString()}` : ""}`)
  }

  return (
    <form className="search-desk" onSubmit={handleSubmit}>
      <div className="search-desk-title">
        <MapPin aria-hidden="true" size={17} />
        <span>Build your shortlist</span>
      </div>
      <div className="search-field">
        <label htmlFor="home-region">Where in Portugal?</label>
        <select id="home-region" value={region} onChange={(event) => setRegion(event.target.value)}>
          <option value="">Any region</option>
          <option>Lisbon</option>
          <option>Cascais</option>
          <option>Algarve</option>
          <option>Porto & North</option>
        </select>
      </div>
      <div className="search-field">
        <label htmlFor="home-stage">Age or stage</label>
        <select id="home-stage" value={stage} onChange={(event) => setStage(event.target.value)}>
          <option value="">Every stage</option>
          <option>Early years</option>
          <option>Primary</option>
          <option>Secondary</option>
          <option>All ages</option>
        </select>
      </div>
      <div className="search-field">
        <label htmlFor="home-curriculum">Curriculum or interest</label>
        <select
          id="home-curriculum"
          value={curriculum}
          onChange={(event) => setCurriculum(event.target.value)}
        >
          <option value="">Open to options</option>
          <option>IB</option>
          <option>British</option>
          <option>American</option>
          <option>Bilingual</option>
          <option>Portuguese</option>
          <option>Arts enrichment</option>
        </select>
      </div>
      <button className="search-submit" type="submit">
        Show my matches <ArrowRight aria-hidden="true" />
      </button>
    </form>
  )
}
