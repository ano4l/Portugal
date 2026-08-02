"use client"

import * as Dialog from "@radix-ui/react-dialog"
import {
  ArrowLeft,
  BarChart3,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Copy,
  Download,
  Eye,
  FilePenLine,
  Filter,
  Globe2,
  ImagePlus,
  Inbox,
  Languages,
  LayoutDashboard,
  Megaphone,
  Menu,
  MessageSquare,
  MoreHorizontal,
  Plus,
  RotateCcw,
  Save,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  UsersRound,
  X,
  type LucideIcon,
} from "lucide-react"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { articles, jobs, schools, type SchoolListing, type EducationJob } from "@/lib/education-data"

type View = "overview" | "articles" | "editor" | "directory" | "jobs" | "advertising" | "enquiries" | "settings"
type ArticleStatus = "Published" | "Draft"

type EditableArticle = {
  slug: string
  title: string
  category: string
  excerpt: string
  image: string
  readingTime: string
  author: string
  body: string
  seoTitle: string
  seoDescription: string
  status: ArticleStatus
  updated: string
}

type EnquiryReply = {
  author: string
  time: string
  message: string
}

type Enquiry = {
  id: number
  name: string
  email: string
  subject: string
  type: "Family enquiry" | "Partnership" | "Recruitment"
  time: string
  unread: boolean
  starred: boolean
  replied: boolean
  message: string
  replies: EnquiryReply[]
}

type CalendarEvent = {
  id: string
  dateDay: string
  weekday: string
  title: string
  timeAndLocation: string
}

type AdPlacement = {
  id: string
  title: string
  partner: string
  type: string
  placementSlot: string
  status: "Active" | "In review" | "Paused"
  impressions: string
  clickRate: string
}

const initialArticles: EditableArticle[] = articles.map((article, index) => ({
  ...article,
  author: index === 0 ? "Marta Almeida" : index === 1 ? "Clara Monteiro" : "Sofia Mendes",
  body: `${article.excerpt}\n\nChoosing an education path in Portugal is about more than comparing curricula. It is about understanding how a school fits the rhythm, language and ambitions of your family.\n\nStart with the practical questions, visit with an open mind and give children space to share what they notice. The right environment should feel both reassuring and full of possibility.`,
  seoTitle: article.title,
  seoDescription: article.excerpt,
  status: index === 2 ? "Draft" : "Published",
  updated: index === 0 ? "Today, 10:24" : index === 1 ? "Yesterday, 16:40" : "28 July 2026",
}))

const initialEnquiries: Enquiry[] = [
  {
    id: 1,
    name: "James Whitmore",
    email: "james.whitmore@example.com",
    subject: "School search in Cascais",
    type: "Family enquiry",
    time: "09:42 Today",
    unread: true,
    starred: true,
    replied: false,
    message: "We are relocating from London in October and would appreciate guidance on bilingual primary schools near Cascais for our two children.",
    replies: [],
  },
  {
    id: 2,
    name: "Beatriz Ferreira",
    email: "b.ferreira@sharing-school.pt",
    subject: "Featured school profile",
    type: "Partnership",
    time: "Yesterday, 16:15",
    unread: true,
    starred: false,
    replied: false,
    message: "Our admissions team would like to learn more about a featured profile and the next print edition.",
    replies: [],
  },
  {
    id: 3,
    name: "Tomás Martins",
    email: "t.martins@nobel.pt",
    subject: "Teaching vacancy package",
    type: "Recruitment",
    time: "29 July 2026",
    unread: false,
    starred: false,
    replied: true,
    message: "Could you share the options for publishing several teaching vacancies ahead of the autumn term?",
    replies: [
      {
        author: "Marta Almeida (Editorial)",
        time: "29 July 2026, 14:30",
        message: "Hello Tomás, thank you for reaching out. I have attached our recruitment media pack outlining options for multiple vacancy listings.",
      },
    ],
  },
  {
    id: 4,
    name: "Elena Rossi",
    email: "elena.rossi@example.com",
    subject: "SEN support near Lisbon",
    type: "Family enquiry",
    time: "28 July 2026",
    unread: false,
    starred: true,
    replied: false,
    message: "We are looking for specialist learning support for a 10 year old moving into an international curriculum.",
    replies: [],
  },
]

const initialCalendarEvents: CalendarEvent[] = [
  { id: "cal-1", dateDay: "01", weekday: "Friday", title: "Edition 03 planning meeting", timeAndLocation: "10:00 · Editorial Desk" },
  { id: "cal-2", dateDay: "04", weekday: "Monday", title: "Algarve International School verification check", timeAndLocation: "14:30 · Virtual review" },
  { id: "cal-3", dateDay: "07", weekday: "Thursday", title: "Publication deadline for Autumn recruitment feature", timeAndLocation: "17:00 · Submission desk" },
]

const initialAdPlacements: AdPlacement[] = [
  {
    id: "ad-1",
    title: "Homepage leader banner",
    partner: "International Sharing School",
    type: "Leader Banner",
    placementSlot: "Homepage · Premium top slot",
    status: "Active",
    impressions: "14.2k",
    clickRate: "3.8%",
  },
  {
    id: "ad-2",
    title: "Square banner rotation",
    partner: "IPS Cascais",
    type: "Square Banner",
    placementSlot: "Homepage & Directory footers",
    status: "Active",
    impressions: "8.9k",
    clickRate: "2.4%",
  },
  {
    id: "ad-3",
    title: "Sponsored insight: Welcoming International Families",
    partner: "United Lisbon International School",
    type: "Sponsored Article",
    placementSlot: "Magazine & Editorial Index",
    status: "In review",
    impressions: "—",
    clickRate: "—",
  },
]

const navigation: { id: View; label: string; icon: LucideIcon }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "articles", label: "Articles", icon: BookOpen },
  { id: "directory", label: "Directory", icon: UsersRound },
  { id: "jobs", label: "Jobs", icon: BriefcaseBusiness },
  { id: "advertising", label: "Advertising", icon: Megaphone },
  { id: "enquiries", label: "Enquiries", icon: Inbox },
  { id: "settings", label: "Settings", icon: Settings },
]

function BrandMark() {
  return <span className="admin-brand-mark">EP</span>
}

function StatusPill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "success" | "warning" }) {
  return <span className={`admin-status admin-status-${tone}`}>{children}</span>
}

function EmptyMessage({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="admin-empty">
      <Search aria-hidden="true" />
      <strong>{title}</strong>
      <p>{copy}</p>
    </div>
  )
}

export function AdminWorkspace() {
  const [view, setView] = useState<View>("overview")
  const [mobileOpen, setMobileOpen] = useState(false)

  // State collections
  const [articleLibrary, setArticleLibrary] = useState<EditableArticle[]>(initialArticles)
  const [editingArticle, setEditingArticle] = useState<EditableArticle>(initialArticles[0])
  const [schoolsList, setSchoolsList] = useState<SchoolListing[]>(schools)
  const [jobsList, setJobsList] = useState<EducationJob[]>(jobs)
  const [enquiryList, setEnquiryList] = useState<Enquiry[]>(initialEnquiries)
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(initialCalendarEvents)
  const [adPlacements, setAdPlacements] = useState<AdPlacement[]>(initialAdPlacements)

  // Settings State
  const [settingsData, setSettingsData] = useState({
    name: "Education in Portugal",
    email: "editorial@educationinportugal.com",
    timezone: "Lisbon (WET/WEST, UTC+0/+1)",
    currency: "EUR (€)",
    notifyEnquiries: true,
    notifyJobs: true,
    weeklyDigest: false,
  })

  // Filters and searches
  const [articleSearch, setArticleSearch] = useState("")
  const [articleFilter, setArticleFilter] = useState("All")
  const [directorySearch, setDirectorySearch] = useState("")
  const [directoryRegion, setDirectoryRegion] = useState("All")
  const [jobSearch, setJobSearch] = useState("")
  const [jobRoleFilter, setJobRoleFilter] = useState("All")
  const [enquirySearch, setEnquirySearch] = useState("")
  const [enquiryFilter, setEnquiryFilter] = useState("All")

  // Modals & Active Selections
  const [activeModal, setActiveModal] = useState<
    | null
    | "add-article"
    | "add-school"
    | "edit-school"
    | "add-job"
    | "edit-job"
    | "add-event"
    | "add-placement"
    | "compose-enquiry"
  >(null)

  const [selectedSchool, setSelectedSchool] = useState<SchoolListing | null>(null)
  const [selectedJob, setSelectedJob] = useState<EducationJob | null>(null)
  const [selectedEnquiryId, setSelectedEnquiryId] = useState<number>(initialEnquiries[0].id)
  const [replyMessageText, setReplyMessageText] = useState("")

  const [toast, setToast] = useState("")
  const [previewOpen, setPreviewOpen] = useState(false)

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(""), 3600)
    return () => window.clearTimeout(timer)
  }, [toast])

  // Unread Enquiries Count
  const unreadCount = useMemo(() => enquiryList.filter((e) => e.unread).length, [enquiryList])

  // Active Enquiry
  const selectedEnquiry = useMemo(
    () => enquiryList.find((e) => e.id === selectedEnquiryId) || enquiryList[0],
    [enquiryList, selectedEnquiryId]
  )

  // Filtered queries
  const filteredArticles = useMemo(() => {
    return articleLibrary.filter((article) => {
      const matchesSearch = `${article.title} ${article.category} ${article.author}`
        .toLowerCase()
        .includes(articleSearch.toLowerCase())
      const matchesFilter = articleFilter === "All" || article.status === articleFilter
      return matchesSearch && matchesFilter
    })
  }, [articleFilter, articleLibrary, articleSearch])

  const filteredSchools = useMemo(() => {
    return schoolsList.filter((school) => {
      const matchesSearch = `${school.name} ${school.location} ${school.type}`
        .toLowerCase()
        .includes(directorySearch.toLowerCase())
      const matchesRegion = directoryRegion === "All" || school.region === directoryRegion
      return matchesSearch && matchesRegion
    })
  }, [directoryRegion, directorySearch, schoolsList])

  const filteredJobs = useMemo(() => {
    return jobsList.filter((job) => {
      const matchesSearch = `${job.title} ${job.institution} ${job.location}`
        .toLowerCase()
        .includes(jobSearch.toLowerCase())
      const matchesRole =
        jobRoleFilter === "All" || job.role.toLowerCase().includes(jobRoleFilter.toLowerCase())
      return matchesSearch && matchesRole
    })
  }, [jobRoleFilter, jobSearch, jobsList])

  const filteredEnquiries = useMemo(() => {
    return enquiryList.filter((enquiry) => {
      const matchesSearch = `${enquiry.name} ${enquiry.subject} ${enquiry.message}`
        .toLowerCase()
        .includes(enquirySearch.toLowerCase())
      if (!matchesSearch) return false
      if (enquiryFilter === "Unread") return enquiry.unread
      if (enquiryFilter === "Starred") return enquiry.starred
      if (enquiryFilter === "Family enquiry") return enquiry.type === "Family enquiry"
      if (enquiryFilter === "Partnership") return enquiry.type === "Partnership"
      if (enquiryFilter === "Recruitment") return enquiry.type === "Recruitment"
      return true
    })
  }, [enquiryFilter, enquiryList, enquirySearch])

  function navigate(nextView: View) {
    setView(nextView)
    setMobileOpen(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Article handlers
  function editArticle(article: EditableArticle) {
    setEditingArticle({ ...article })
    navigate("editor")
  }

  function createArticle() {
    const newArt: EditableArticle = {
      slug: `story-${Date.now()}`,
      title: "Untitled editorial guide",
      category: "Family guide",
      excerpt: "Add a clear introduction for readers.",
      image: "/education/article-moving-schools.webp",
      readingTime: "4 min read",
      author: "Marta Almeida",
      body: "Choosing an education path in Portugal starts with asking the right questions.",
      seoTitle: "Untitled editorial guide",
      seoDescription: "Add a clear introduction for readers.",
      status: "Draft",
      updated: "Just created",
    }
    setEditingArticle(newArt)
    setArticleLibrary((current) => [newArt, ...current])
    navigate("editor")
    setToast("New article draft created")
  }

  function saveArticle() {
    const updated = { ...editingArticle, updated: "Just now" }
    setEditingArticle(updated)
    setArticleLibrary((current) =>
      current.map((item) => (item.slug === updated.slug ? updated : item))
    )
    setToast("Article changes saved")
  }

  function duplicateArticle(article: EditableArticle) {
    const copy: EditableArticle = {
      ...article,
      slug: `${article.slug}-copy-${Date.now().toString().slice(-4)}`,
      title: `${article.title} (Copy)`,
      status: "Draft",
      updated: "Just created",
    }
    setArticleLibrary((current) => [copy, ...current])
    setToast(`Duplicated "${article.title}"`)
  }

  function deleteArticle(slug: string) {
    setArticleLibrary((current) => current.filter((item) => item.slug !== slug))
    setToast("Article removed from library")
  }

  // School handlers
  function handleSaveSchool(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const name = (form.get("name") as string) || "Untitled School"
    const location = (form.get("location") as string) || "Lisbon, Portugal"
    const region = (form.get("region") as SchoolListing["region"]) || "Lisbon"
    const type = (form.get("type") as string) || "International school"
    const differentiator = (form.get("differentiator") as string) || "Verified education provider record."

    if (selectedSchool) {
      // Edit existing
      setSchoolsList((current) =>
        current.map((item) =>
          item.slug === selectedSchool.slug
            ? { ...item, name, location, region, type, differentiator, verified: true }
            : item
        )
      )
      setToast(`Updated listing for ${name}`)
    } else {
      // Create new
      const newSchool: SchoolListing = {
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        name,
        location,
        region,
        stages: ["Primary", "Secondary"],
        curriculum: ["IB"],
        languages: ["English", "Portuguese"],
        type,
        support: ["Learning support"],
        differentiator,
        image: "/education/international-sharing-school.webp",
        verified: true,
      }
      setSchoolsList((current) => [newSchool, ...current])
      setToast(`Added new directory listing for ${name}`)
    }
    setActiveModal(null)
    setSelectedSchool(null)
  }

  function toggleSchoolVerified(slug: string) {
    setSchoolsList((current) =>
      current.map((item) =>
        item.slug === slug ? { ...item, verified: !item.verified } : item
      )
    )
    setToast("Listing verification status updated")
  }

  function deleteSchool(slug: string) {
    setSchoolsList((current) => current.filter((item) => item.slug !== slug))
    setToast("Listing removed from directory")
  }

  // Job handlers
  function handleSaveJob(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const title = (form.get("title") as string) || "Education Role"
    const institution = (form.get("institution") as string) || "Partner Institution"
    const location = (form.get("location") as string) || "Lisbon"
    const role = (form.get("role") as string) || "Teaching"
    const closes = (form.get("closes") as string) || "31 Aug 2026"
    const salary = (form.get("salary") as string) || "Competitive"

    if (selectedJob) {
      setJobsList((current) =>
        current.map((item) =>
          item.id === selectedJob.id
            ? { ...item, title, institution, location, role, closes }
            : item
        )
      )
      setToast(`Updated job role: ${title}`)
    } else {
      const newJob: EducationJob = {
        id: `job-${Date.now()}`,
        title,
        institution,
        location,
        role,
        type: "Full time",
        posted: "Today",
        closes,
        summary: `${title} position at ${institution}.`,
      }
      setJobsList((current) => [newJob, ...current])
      setToast(`Posted new vacancy for ${title}`)
    }
    setActiveModal(null)
    setSelectedJob(null)
  }

  function deleteJob(id: string) {
    setJobsList((current) => current.filter((item) => item.id !== id))
    setToast("Job vacancy removed")
  }

  // Enquiry handlers
  function handleSendReply() {
    if (!replyMessageText.trim() || !selectedEnquiry) return
    const reply: EnquiryReply = {
      author: "Marta Almeida (Editorial Desk)",
      time: "Just now",
      message: replyMessageText.trim(),
    }
    setEnquiryList((current) =>
      current.map((item) =>
        item.id === selectedEnquiry.id
          ? { ...item, unread: false, replied: true, replies: [...item.replies, reply] }
          : item
      )
    )
    setReplyMessageText("")
    setToast("Reply dispatched to reader")
  }

  function toggleEnquiryStar(id: number) {
    setEnquiryList((current) =>
      current.map((item) => (item.id === id ? { ...item, starred: !item.starred } : item))
    )
  }

  function toggleEnquiryUnread(id: number) {
    setEnquiryList((current) =>
      current.map((item) => (item.id === id ? { ...item, unread: !item.unread } : item))
    )
  }

  // Export JSON snapshot
  function exportWorkspaceData() {
    const data = {
      version: "1.0.0",
      exportedAt: new Date().toISOString(),
      articles: articleLibrary,
      schools: schoolsList,
      jobs: jobsList,
      enquiries: enquiryList,
      settings: settingsData,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `education-in-portugal-admin-export-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
    setToast("Workspace snapshot downloaded (JSON)")
  }

  const viewTitle =
    view === "editor"
      ? "Article editor"
      : navigation.find((item) => item.id === view)?.label ?? "Overview"

  return (
    <div className="admin-root">
      <a className="admin-skip-link" href="#admin-main">
        Skip to workspace
      </a>

      {/* Sidebar */}
      <aside className="admin-sidebar" aria-label="Editorial studio navigation">
        <div className="admin-brand">
          <BrandMark />
          <div>
            <strong>Education</strong>
            <span>in Portugal</span>
          </div>
        </div>

        <div className="admin-studio-label">
          <span>Editorial studio</span>
          <StatusPill tone="success">Active</StatusPill>
        </div>

        <nav className="admin-nav">
          {navigation.map((item) => (
            <button
              className={
                view === item.id || (view === "editor" && item.id === "articles") ? "active" : ""
              }
              key={item.id}
              onClick={() => navigate(item.id)}
              type="button"
            >
              <item.icon aria-hidden="true" />
              <span>{item.label}</span>
              {item.id === "enquiries" && unreadCount > 0 ? <b>{unreadCount}</b> : null}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-foot">
          <div className="admin-avatar">MA</div>
          <div>
            <strong>Marta Almeida</strong>
            <span>Managing editor</span>
          </div>
          <MoreHorizontal aria-hidden="true" />
        </div>
      </aside>

      {/* Sticky Topbar */}
      <header className="admin-topbar">
        <button
          className="admin-mobile-menu"
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open workspace navigation"
        >
          <Menu aria-hidden="true" />
        </button>

        <div>
          <span className="admin-breadcrumb">Studio /</span>
          <strong>{viewTitle}</strong>
        </div>

        <div className="admin-top-actions">
          <button
            type="button"
            onClick={() => navigate("enquiries")}
            aria-label="View notifications"
            title={`${unreadCount} unread enquiries`}
          >
            <Bell aria-hidden="true" />
            {unreadCount > 0 ? <span /> : null}
          </button>
          <a href="/" target="_blank" rel="noreferrer">
            <Globe2 aria-hidden="true" />
            View website
          </a>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen ? (
        <div className="admin-mobile-overlay" role="presentation" onMouseDown={() => setMobileOpen(false)}>
          <aside
            className="admin-mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Workspace navigation"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="admin-drawer-head">
              <div className="admin-brand">
                <BrandMark />
                <div>
                  <strong>Education</strong>
                  <span>in Portugal</span>
                </div>
              </div>
              <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close navigation">
                <X aria-hidden="true" />
              </button>
            </div>
            <nav className="admin-nav">
              {navigation.map((item) => (
                <button
                  className={view === item.id ? "active" : ""}
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  type="button"
                >
                  <item.icon aria-hidden="true" />
                  {item.label}
                  {item.id === "enquiries" && unreadCount > 0 ? <b>{unreadCount}</b> : null}
                </button>
              ))}
            </nav>
          </aside>
        </div>
      ) : null}

      {/* Main Content Workspace */}
      <main className="admin-main" id="admin-main">
        {view === "overview" ? (
          <Overview
            onNavigate={navigate}
            onCreateArticle={createArticle}
            onOpenAddSchool={() => {
              setSelectedSchool(null)
              setActiveModal("add-school")
            }}
            onOpenAddJob={() => {
              setSelectedJob(null)
              setActiveModal("add-job")
            }}
            onOpenAddEvent={() => setActiveModal("add-event")}
            articles={articleLibrary}
            schoolsCount={schoolsList.length}
            jobsCount={jobsList.length}
            unreadEnquiriesCount={unreadCount}
            events={calendarEvents}
            latestEnquiry={enquiryList[0]}
          />
        ) : null}

        {view === "articles" ? (
          <ArticlesView
            articles={filteredArticles}
            search={articleSearch}
            filter={articleFilter}
            onSearch={setArticleSearch}
            onFilter={setArticleFilter}
            onEdit={editArticle}
            onCreate={createArticle}
            onDuplicate={duplicateArticle}
            onDelete={deleteArticle}
          />
        ) : null}

        {view === "editor" ? (
          <ArticleEditor
            article={editingArticle}
            setArticle={setEditingArticle}
            onBack={() => navigate("articles")}
            onSave={saveArticle}
            onPreview={() => setPreviewOpen(true)}
          />
        ) : null}

        {view === "directory" ? (
          <DirectoryView
            records={filteredSchools}
            search={directorySearch}
            regionFilter={directoryRegion}
            onSearch={setDirectorySearch}
            onRegionChange={setDirectoryRegion}
            onAdd={() => {
              setSelectedSchool(null)
              setActiveModal("add-school")
            }}
            onEdit={(school) => {
              setSelectedSchool(school)
              setActiveModal("edit-school")
            }}
            onToggleVerified={toggleSchoolVerified}
            onDelete={deleteSchool}
          />
        ) : null}

        {view === "jobs" ? (
          <JobsView
            records={filteredJobs}
            search={jobSearch}
            roleFilter={jobRoleFilter}
            onSearch={setJobSearch}
            onRoleChange={setJobRoleFilter}
            onAdd={() => {
              setSelectedJob(null)
              setActiveModal("add-job")
            }}
            onEdit={(job) => {
              setSelectedJob(job)
              setActiveModal("edit-job")
            }}
            onDelete={deleteJob}
          />
        ) : null}

        {view === "advertising" ? (
          <AdvertisingView
            placements={adPlacements}
            setPlacements={setAdPlacements}
            onAdd={() => setActiveModal("add-placement")}
            onNotify={setToast}
          />
        ) : null}

        {view === "enquiries" ? (
          <EnquiriesView
            enquiries={filteredEnquiries}
            selected={selectedEnquiry}
            search={enquirySearch}
            filter={enquiryFilter}
            replyText={replyMessageText}
            onSearch={setEnquirySearch}
            onFilter={setEnquiryFilter}
            onSelect={(item) => {
              setSelectedEnquiryId(item.id)
              if (item.unread) toggleEnquiryUnread(item.id)
            }}
            onReplyTextChange={setReplyMessageText}
            onSendReply={handleSendReply}
            onToggleStar={(id) => toggleEnquiryStar(id)}
            onToggleUnread={(id) => toggleEnquiryUnread(id)}
            onCompose={() => setActiveModal("compose-enquiry")}
          />
        ) : null}

        {view === "settings" ? (
          <SettingsView
            settings={settingsData}
            setSettings={setSettingsData}
            onSave={() => setToast("Publication settings saved successfully")}
            onExport={exportWorkspaceData}
            onReset={() => {
              setArticleLibrary(initialArticles)
              setSchoolsList(schools)
              setJobsList(jobs)
              setEnquiryList(initialEnquiries)
              setCalendarEvents(initialCalendarEvents)
              setToast("Workspace reset to initial demo defaults")
            }}
          />
        ) : null}
      </main>

      {/* Modal Dialogs */}

      {/* Add / Edit School Listing Modal */}
      <Dialog.Root
        open={activeModal === "add-school" || activeModal === "edit-school"}
        onOpenChange={(open) => !open && setActiveModal(null)}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="admin-dialog-overlay" />
          <Dialog.Content className="admin-dialog">
            <div className="admin-dialog-head">
              <div>
                <span className="admin-kicker">Directory Management</span>
                <Dialog.Title>
                  {selectedSchool ? "Edit school listing" : "Add directory listing"}
                </Dialog.Title>
              </div>
              <Dialog.Close asChild>
                <button type="button" aria-label="Close dialog">
                  <X aria-hidden="true" />
                </button>
              </Dialog.Close>
            </div>
            <Dialog.Description>
              Provide verified school details. These facts feed directory search, filter matching, and maps.
            </Dialog.Description>
            <form onSubmit={handleSaveSchool} className="admin-form-grid">
              <label className="admin-field-wide">
                <span>School / Provider Name</span>
                <input
                  name="name"
                  required
                  defaultValue={selectedSchool?.name || ""}
                  placeholder="e.g. International Sharing School"
                />
              </label>

              <label><span>Region</span>
                <select name="region" defaultValue={selectedSchool?.region || "Lisbon"}>
                  <option value="Lisbon">Lisbon</option>
                  <option value="Cascais">Cascais</option>
                  <option value="Algarve">Algarve</option>
                  <option value="Porto & North">Porto & North</option>
                </select>
              </label>

              <label><span>Provider Type</span>
                <input
                  name="type"
                  defaultValue={selectedSchool?.type || "International school"}
                  placeholder="e.g. International school"
                />
              </label>

              <label className="admin-field-wide"><span>Location / Address</span>
                <input
                  name="location"
                  defaultValue={selectedSchool?.location || ""}
                  placeholder="e.g. Taguspark, Greater Lisbon"
                />
              </label>

              <label className="admin-field-wide"><span>Key Differentiator / Summary</span>
                <textarea
                  name="differentiator"
                  rows={3}
                  defaultValue={selectedSchool?.differentiator || ""}
                  placeholder="e.g. An IB continuum school shaped around collaboration, design and student agency."
                />
              </label>

              <div className="admin-dialog-actions admin-field-wide">
                <Dialog.Close asChild>
                  <button className="admin-button admin-button-quiet" type="button">
                    Cancel
                  </button>
                </Dialog.Close>
                <button className="admin-button admin-button-primary" type="submit">
                  <Save aria-hidden="true" />
                  {selectedSchool ? "Save changes" : "Create listing"}
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Add / Edit Job Modal */}
      <Dialog.Root
        open={activeModal === "add-job" || activeModal === "edit-job"}
        onOpenChange={(open) => !open && setActiveModal(null)}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="admin-dialog-overlay" />
          <Dialog.Content className="admin-dialog">
            <div className="admin-dialog-head">
              <div>
                <span className="admin-kicker">Recruitment Desk</span>
                <Dialog.Title>{selectedJob ? "Edit vacancy" : "Post a job vacancy"}</Dialog.Title>
              </div>
              <Dialog.Close asChild>
                <button type="button" aria-label="Close dialog">
                  <X aria-hidden="true" />
                </button>
              </Dialog.Close>
            </div>
            <Dialog.Description>
              Jobs are displayed in the recruitment hub and syndicated across RSS feeds for educators.
            </Dialog.Description>
            <form onSubmit={handleSaveJob} className="admin-form-grid">
              <label className="admin-field-wide">
                <span>Job Title</span>
                <input
                  name="title"
                  required
                  defaultValue={selectedJob?.title || ""}
                  placeholder="e.g. Head of Primary"
                />
              </label>

              <label><span>Institution</span>
                <input
                  name="institution"
                  required
                  defaultValue={selectedJob?.institution || ""}
                  placeholder="e.g. United Lisbon International School"
                />
              </label>

              <label><span>Location</span>
                <input
                  name="location"
                  defaultValue={selectedJob?.location || "Lisbon"}
                  placeholder="e.g. Lisbon"
                />
              </label>

              <label><span>Role Category</span>
                <select name="role" defaultValue={selectedJob?.role || "Leadership"}>
                  <option value="Leadership">Leadership</option>
                  <option value="Teaching">Teaching</option>
                  <option value="Support & Operations">Support & Operations</option>
                </select>
              </label>

              <label><span>Closes Date</span>
                <input
                  name="closes"
                  defaultValue={selectedJob?.closes || "31 August 2026"}
                  placeholder="e.g. 31 August 2026"
                />
              </label>

              <label className="admin-field-wide"><span>Salary & Package</span>
                <input
                  name="salary"
                  defaultValue="Competitive international package"
                  placeholder="e.g. €45,000 - €55,000 + benefits"
                />
              </label>

              <div className="admin-dialog-actions admin-field-wide">
                <Dialog.Close asChild>
                  <button className="admin-button admin-button-quiet" type="button">
                    Cancel
                  </button>
                </Dialog.Close>
                <button className="admin-button admin-button-primary" type="submit">
                  <Save aria-hidden="true" />
                  {selectedJob ? "Save vacancy" : "Publish vacancy"}
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Add Calendar Event Modal */}
      <Dialog.Root
        open={activeModal === "add-event"}
        onOpenChange={(open) => !open && setActiveModal(null)}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="admin-dialog-overlay" />
          <Dialog.Content className="admin-dialog">
            <div className="admin-dialog-head">
              <div>
                <span className="admin-kicker">Editorial Calendar</span>
                <Dialog.Title>Add key date or meeting</Dialog.Title>
              </div>
              <Dialog.Close asChild>
                <button type="button" aria-label="Close dialog">
                  <X aria-hidden="true" />
                </button>
              </Dialog.Close>
            </div>
            <Dialog.Description>
              Keep key deadlines, reviews, and visits visible for the editorial desk.
            </Dialog.Description>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const form = new FormData(e.currentTarget)
                const title = (form.get("title") as string) || "Editorial Task"
                const dateDay = (form.get("dateDay") as string) || "12"
                const weekday = (form.get("weekday") as string) || "Wednesday"
                const timeAndLocation = (form.get("timeAndLocation") as string) || "10:00 · Virtual"

                setCalendarEvents((current) => [
                  ...current,
                  { id: `cal-${Date.now()}`, dateDay, weekday, title, timeAndLocation },
                ])
                setActiveModal(null)
                setToast("Added calendar event")
              }}
              className="admin-form-grid"
            >
              <label className="admin-field-wide"><span>Event Title</span><input name="title" required placeholder="e.g. Autumn recruitment feature review" /></label>
              <label><span>Day Number</span><input name="dateDay" required placeholder="e.g. 15" /></label>
              <label><span>Weekday</span><input name="weekday" required placeholder="e.g. Tuesday" /></label>
              <label className="admin-field-wide"><span>Time & Location / Desk</span><input name="timeAndLocation" defaultValue="11:00 · Editorial Desk" /></label>

              <div className="admin-dialog-actions admin-field-wide">
                <Dialog.Close asChild><button className="admin-button admin-button-quiet" type="button">Cancel</button></Dialog.Close>
                <button className="admin-button admin-button-primary" type="submit"><Plus aria-hidden="true" />Add to calendar</button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Add Ad Placement Modal */}
      <Dialog.Root
        open={activeModal === "add-placement"}
        onOpenChange={(open) => !open && setActiveModal(null)}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="admin-dialog-overlay" />
          <Dialog.Content className="admin-dialog">
            <div className="admin-dialog-head">
              <div>
                <span className="admin-kicker">Partnership Hub</span>
                <Dialog.Title>New advertising campaign</Dialog.Title>
              </div>
              <Dialog.Close asChild>
                <button type="button" aria-label="Close dialog">
                  <X aria-hidden="true" />
                </button>
              </Dialog.Close>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const form = new FormData(e.currentTarget)
                const title = (form.get("title") as string) || "Partner Campaign"
                const partner = (form.get("partner") as string) || "Education Partner"
                const type = (form.get("type") as string) || "Leader Banner"

                const newAd: AdPlacement = {
                  id: `ad-${Date.now()}`,
                  title,
                  partner,
                  type,
                  placementSlot: "Homepage · Primary Rotation",
                  status: "In review",
                  impressions: "—",
                  clickRate: "—",
                }
                setAdPlacements((current) => [newAd, ...current])
                setActiveModal(null)
                setToast("Created campaign proposal")
              }}
              className="admin-form-grid"
            >
              <label className="admin-field-wide"><span>Campaign Title</span><input name="title" required placeholder="e.g. Open Day Special Spotlight" /></label>
              <label><span>Partner Name</span><input name="partner" required placeholder="e.g. St. Julian's School" /></label>
              <label><span>Placement Type</span>
                <select name="type">
                  <option value="Leader Banner">Leader Banner</option>
                  <option value="Square Banner">Square Banner</option>
                  <option value="Sponsored Article">Sponsored Article</option>
                </select>
              </label>

              <div className="admin-dialog-actions admin-field-wide">
                <Dialog.Close asChild><button className="admin-button admin-button-quiet" type="button">Cancel</button></Dialog.Close>
                <button className="admin-button admin-button-primary" type="submit"><Plus aria-hidden="true" />Create proposal</button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Compose Outbound Message Modal */}
      <Dialog.Root
        open={activeModal === "compose-enquiry"}
        onOpenChange={(open) => !open && setActiveModal(null)}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="admin-dialog-overlay" />
          <Dialog.Content className="admin-dialog">
            <div className="admin-dialog-head">
              <div>
                <span className="admin-kicker">Reader Care</span>
                <Dialog.Title>Compose message</Dialog.Title>
              </div>
              <Dialog.Close asChild>
                <button type="button" aria-label="Close dialog">
                  <X aria-hidden="true" />
                </button>
              </Dialog.Close>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const form = new FormData(e.currentTarget)
                const name = (form.get("name") as string) || "Family"
                const email = (form.get("email") as string) || "family@example.com"
                const subject = (form.get("subject") as string) || "Education guidance follow-up"
                const message = (form.get("message") as string) || "Message text..."

                const newEnquiry: Enquiry = {
                  id: Date.now(),
                  name,
                  email,
                  subject,
                  type: "Family enquiry",
                  time: "Just now",
                  unread: false,
                  starred: false,
                  replied: true,
                  message,
                  replies: [],
                }
                setEnquiryList((current) => [newEnquiry, ...current])
                setSelectedEnquiryId(newEnquiry.id)
                setActiveModal(null)
                setToast(`Outbound message sent to ${name}`)
              }}
              className="admin-form-grid"
            >
              <label><span>Recipient Name</span><input name="name" required placeholder="e.g. Sarah Jenkins" /></label>
              <label><span>Recipient Email</span><input name="email" type="email" required placeholder="e.g. sarah@example.com" /></label>
              <label className="admin-field-wide"><span>Subject</span><input name="subject" required placeholder="e.g. Following up on your Lisbon school search" /></label>
              <label className="admin-field-wide"><span>Message Body</span><textarea name="message" rows={4} required placeholder="Dear Sarah, thank you for writing to Education in Portugal..." /></label>

              <div className="admin-dialog-actions admin-field-wide">
                <Dialog.Close asChild><button className="admin-button admin-button-quiet" type="button">Cancel</button></Dialog.Close>
                <button className="admin-button admin-button-primary" type="submit"><Send aria-hidden="true" />Send message</button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Article Preview Modal */}
      <Dialog.Root open={previewOpen} onOpenChange={setPreviewOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="admin-dialog-overlay" />
          <Dialog.Content className="admin-preview-dialog">
            <div className="admin-preview-toolbar">
              <div>
                <span>Article preview</span>
                <strong>Live Reader View</strong>
              </div>
              <Dialog.Close asChild>
                <button type="button" aria-label="Close preview">
                  <X aria-hidden="true" />
                </button>
              </Dialog.Close>
            </div>
            <article className="admin-article-preview">
              <div className="admin-preview-image">
                <Image
                  src={editingArticle.image}
                  alt=""
                  fill
                  sizes="(max-width: 900px) 100vw, 760px"
                />
              </div>
              <div className="admin-preview-copy">
                <span className="admin-kicker">{editingArticle.category}</span>
                <Dialog.Title>{editingArticle.title}</Dialog.Title>
                <p className="admin-preview-deck">{editingArticle.excerpt}</p>
                <div className="admin-preview-byline">
                  By {editingArticle.author} · {editingArticle.readingTime}
                </div>
                {editingArticle.body.split("\n\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </article>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Toast Notification */}
      {toast ? (
        <div className="admin-toast" role="status">
          <CheckCircle2 aria-hidden="true" />
          <span>{toast}</span>
          <button type="button" onClick={() => setToast("")} aria-label="Dismiss notification">
            <X aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </div>
  )
}

function PageHeading({
  eyebrow,
  title,
  copy,
  action,
}: {
  eyebrow: string
  title: string
  copy: string
  action?: React.ReactNode
}) {
  return (
    <div className="admin-page-heading">
      <div>
        <span className="admin-kicker">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{copy}</p>
      </div>
      {action}
    </div>
  )
}

/* Sub-View Components */

function Overview({
  onNavigate,
  onCreateArticle,
  onOpenAddSchool,
  onOpenAddJob,
  onOpenAddEvent,
  articles,
  schoolsCount,
  jobsCount,
  unreadEnquiriesCount,
  events,
  latestEnquiry,
}: {
  onNavigate: (view: View) => void
  onCreateArticle: () => void
  onOpenAddSchool: () => void
  onOpenAddJob: () => void
  onOpenAddEvent: () => void
  articles: EditableArticle[]
  schoolsCount: number
  jobsCount: number
  unreadEnquiriesCount: number
  events: CalendarEvent[]
  latestEnquiry?: Enquiry
}) {
  return (
    <>
      <PageHeading
        eyebrow="Thursday, 31 July"
        title="Good afternoon, Marta."
        copy="Here is what is moving across the publication today."
        action={
          <button className="admin-button admin-button-primary" onClick={onCreateArticle} type="button">
            <FilePenLine aria-hidden="true" />
            New article
          </button>
        }
      />

      <section className="admin-metric-strip" aria-label="Publishing summary">
        <div>
          <span>Published articles</span>
          <strong>{articles.filter((a) => a.status === "Published").length}</strong>
          <small>{articles.filter((a) => a.status === "Draft").length} draft(s) in progress</small>
        </div>
        <div>
          <span>Directory listings</span>
          <strong>{schoolsCount}</strong>
          <small>All records verified</small>
        </div>
        <div>
          <span>Live jobs</span>
          <strong>{jobsCount}</strong>
          <small>Active employer roles</small>
        </div>
        <div className="admin-metric-note">
          <Sparkles aria-hidden="true" />
          <div>
            <p>
              <strong>Reader Care Desk:</strong> {unreadEnquiriesCount} unread message(s) requiring response.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Action Strip */}
      <section className="admin-quick-actions" aria-label="Quick workspace actions">
        <div>
          <span className="admin-kicker">Shortcuts</span>
          <h2>Quick Actions</h2>
        </div>
        <button type="button" onClick={onCreateArticle}>
          <FilePenLine aria-hidden="true" />
          <span>
            <strong>New Article</strong>
            <small>Write editorial guide</small>
          </span>
          <ChevronRight aria-hidden="true" />
        </button>
        <button type="button" onClick={onOpenAddSchool}>
          <UsersRound aria-hidden="true" />
          <span>
            <strong>Add School Listing</strong>
            <small>Verify provider facts</small>
          </span>
          <ChevronRight aria-hidden="true" />
        </button>
        <button type="button" onClick={onOpenAddJob}>
          <BriefcaseBusiness aria-hidden="true" />
          <span>
            <strong>Post Vacancy</strong>
            <small>Publish teaching role</small>
          </span>
          <ChevronRight aria-hidden="true" />
        </button>
      </section>

      <div className="admin-overview-grid" style={{ marginTop: "1.5rem" }}>
        {/* Recent Content */}
        <section className="admin-panel admin-recent">
          <div className="admin-panel-title">
            <div>
              <span className="admin-kicker">Editorial desk</span>
              <h2>Recent content</h2>
            </div>
            <button type="button" onClick={() => onNavigate("articles")}>
              View library <ChevronRight aria-hidden="true" />
            </button>
          </div>
          {articles.slice(0, 3).map((article) => (
            <button
              className="admin-recent-row"
              type="button"
              key={article.slug}
              onClick={() => onNavigate("articles")}
            >
              <div className="admin-row-thumb">
                <Image src={article.image} alt="" fill sizes="72px" />
              </div>
              <div>
                <StatusPill tone={article.status === "Published" ? "success" : "warning"}>
                  {article.status}
                </StatusPill>
                <h3>{article.title}</h3>
                <span>
                  {article.category} · {article.updated}
                </span>
              </div>
              <ChevronRight aria-hidden="true" />
            </button>
          ))}
        </section>

        {/* Editorial Calendar */}
        <aside className="admin-panel admin-calendar">
          <div className="admin-panel-title">
            <div>
              <span className="admin-kicker">This week</span>
              <h2>Editorial calendar</h2>
            </div>
            <button type="button" onClick={onOpenAddEvent} title="Add calendar event">
              <Plus aria-hidden="true" />
              Add
            </button>
          </div>
          {events.map((event) => (
            <div className="admin-date-card" key={event.id}>
              <span>{event.dateDay}</span>
              <div>
                <strong>{event.weekday}</strong>
                <p>{event.title}</p>
                <small>{event.timeAndLocation}</small>
              </div>
            </div>
          ))}
        </aside>
      </div>

      {/* Latest Enquiry Widget */}
      {latestEnquiry ? (
        <section className="admin-panel" style={{ marginTop: "1.5rem" }}>
          <div className="admin-panel-title">
            <div>
              <span className="admin-kicker">Latest Reader Message</span>
              <h2>{latestEnquiry.subject}</h2>
            </div>
            <button type="button" onClick={() => onNavigate("enquiries")}>
              Go to Inbox <ChevronRight aria-hidden="true" />
            </button>
          </div>
          <p style={{ margin: 0, color: "#4e4641", fontSize: "0.85rem" }}>
            <strong>From {latestEnquiry.name}:</strong> "{latestEnquiry.message}"
          </p>
        </section>
      ) : null}
    </>
  )
}

function ArticlesView({
  articles: records,
  search,
  filter,
  onSearch,
  onFilter,
  onEdit,
  onCreate,
  onDuplicate,
  onDelete,
}: {
  articles: EditableArticle[]
  search: string
  filter: string
  onSearch: (value: string) => void
  onFilter: (value: string) => void
  onEdit: (article: EditableArticle) => void
  onCreate: () => void
  onDuplicate: (article: EditableArticle) => void
  onDelete: (slug: string) => void
}) {
  return (
    <>
      <PageHeading
        eyebrow="Editorial library"
        title="Articles"
        copy="Shape stories, prepare search details and control what readers see."
        action={
          <button className="admin-button admin-button-primary" type="button" onClick={onCreate}>
            <Plus aria-hidden="true" />
            New article
          </button>
        }
      />

      <div className="admin-toolbar">
        <label className="admin-search">
          <Search aria-hidden="true" />
          <span className="sr-only">Search articles</span>
          <input
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search by title, author or category"
          />
        </label>
        <label className="admin-filter">
          <span>Status</span>
          <select value={filter} onChange={(event) => onFilter(event.target.value)}>
            <option>All</option>
            <option>Published</option>
            <option>Draft</option>
          </select>
        </label>
      </div>

      <section className="admin-table-panel" aria-label="Article library">
        {records.length ? (
          <>
            <div className="admin-table-head admin-article-columns">
              <span>Story</span>
              <span>Status</span>
              <span>Updated</span>
              <span>Action</span>
            </div>
            {records.map((article) => (
              <article className="admin-table-row admin-article-columns" key={article.slug}>
                <div className="admin-story-cell">
                  <div className="admin-row-thumb">
                    <Image src={article.image} alt="" fill sizes="80px" />
                  </div>
                  <div>
                    <span>{article.category}</span>
                    <h2>{article.title}</h2>
                    <small>
                      {article.readingTime} · {article.author}
                    </small>
                  </div>
                </div>
                <div>
                  <StatusPill tone={article.status === "Published" ? "success" : "warning"}>
                    {article.status}
                  </StatusPill>
                </div>
                <time>{article.updated}</time>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button className="admin-edit-link" type="button" onClick={() => onEdit(article)}>
                    <FilePenLine aria-hidden="true" />
                    Edit
                  </button>
                  <button
                    className="admin-edit-link"
                    type="button"
                    onClick={() => onDuplicate(article)}
                    title="Duplicate article"
                  >
                    <Copy aria-hidden="true" />
                  </button>
                  <button
                    className="admin-edit-link"
                    style={{ color: "#a83232" }}
                    type="button"
                    onClick={() => onDelete(article.slug)}
                    title="Delete article"
                  >
                    <Trash2 aria-hidden="true" />
                  </button>
                </div>
              </article>
            ))}
          </>
        ) : (
          <EmptyMessage title="No articles found" copy="Try a broader search or choose another status." />
        )}
      </section>
    </>
  )
}

function ArticleEditor({
  article,
  setArticle,
  onBack,
  onSave,
  onPreview,
}: {
  article: EditableArticle
  setArticle: (article: EditableArticle) => void
  onBack: () => void
  onSave: () => void
  onPreview: () => void
}) {
  const update = (field: keyof EditableArticle, value: string) =>
    setArticle({ ...article, [field]: value })

  // Insert helper into body
  function insertFormat(snippet: string) {
    setArticle({ ...article, body: `${article.body}\n\n${snippet}` })
  }

  const wordCount = article.body.trim().split(/\s+/).filter(Boolean).length

  return (
    <>
      <div className="admin-editor-heading">
        <button type="button" onClick={onBack}>
          <ArrowLeft aria-hidden="true" />
          Article library
        </button>
        <div className="admin-editor-actions">
          <button className="admin-button admin-button-quiet" type="button" onClick={onPreview}>
            <Eye aria-hidden="true" />
            Preview
          </button>
          <button className="admin-button admin-button-primary" type="button" onClick={onSave}>
            <Save aria-hidden="true" />
            Save changes
          </button>
        </div>
      </div>

      <div className="admin-editor-title">
        <span className="admin-kicker">Editorial canvas</span>
        <h1>{article.title || "Untitled article"}</h1>
        <p>Last saved {article.updated.toLowerCase()} · Approx. {wordCount} words</p>
      </div>

      <div className="admin-editor-layout">
        <section className="admin-editor-canvas" aria-label="Article content">
          <div className="admin-form-grid">
            <label className="admin-field-wide admin-title-field">
              <span>Article title</span>
              <textarea
                rows={2}
                value={article.title}
                onChange={(event) => update("title", event.target.value)}
              />
            </label>

            <label>
              <span>Category</span>
              <select
                value={article.category}
                onChange={(event) => update("category", event.target.value)}
              >
                <option value="Settling in">Settling in</option>
                <option value="How to choose">How to choose</option>
                <option value="Algarve guide">Algarve guide</option>
                <option value="Family guide">Family guide</option>
                <option value="Interviews">Interviews</option>
              </select>
            </label>

            <label>
              <span>Author</span>
              <input
                value={article.author}
                onChange={(event) => update("author", event.target.value)}
              />
            </label>

            <label className="admin-field-wide">
              <span>Excerpt (Lead paragraph)</span>
              <textarea
                rows={3}
                value={article.excerpt}
                onChange={(event) => update("excerpt", event.target.value)}
              />
            </label>
          </div>

          <div className="admin-hero-field">
            <div>
              <span>Hero image</span>
              <strong>Story photography</strong>
            </div>
            <div className="admin-editor-image">
              <Image src={article.image} alt="Article hero preview" fill sizes="(max-width: 900px) 100vw, 700px" />
              <button
                type="button"
                onClick={() => {
                  const presets = [
                    "/education/article-moving-schools.webp",
                    "/education/international-sharing-school.webp",
                    "/education/ips-cascais.webp",
                  ]
                  const nextImage = presets[(presets.indexOf(article.image) + 1) % presets.length]
                  update("image", nextImage)
                }}
              >
                <ImagePlus aria-hidden="true" />
                Cycle preset image
              </button>
            </div>
          </div>

          {/* Formatting Toolbar */}
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <button
              type="button"
              className="admin-button admin-button-quiet"
              style={{ minHeight: "36px", padding: "0.3rem 0.6rem" }}
              onClick={() => insertFormat("## Key Considerations")}
            >
              + Heading
            </button>
            <button
              type="button"
              className="admin-button admin-button-quiet"
              style={{ minHeight: "36px", padding: "0.3rem 0.6rem" }}
              onClick={() => insertFormat("> \"A trusted school environment builds confidence for the whole family.\"")}
            >
              + Quote
            </button>
            <button
              type="button"
              className="admin-button admin-button-quiet"
              style={{ minHeight: "36px", padding: "0.3rem 0.6rem" }}
              onClick={() => insertFormat("- Primary language instruction\n- Student wellbeing support\n- Admissions availability")}
            >
              + List
            </button>
          </div>

          <label className="admin-body-field">
            <span>Body copy</span>
            <textarea
              rows={12}
              value={article.body}
              onChange={(event) => update("body", event.target.value)}
            />
          </label>
        </section>

        {/* Article Controls Sidebar */}
        <aside className="admin-editor-controls">
          <div className="admin-control-card">
            <h2>Publishing controls</h2>
            <label>
              <span>Status</span>
              <select
                value={article.status}
                onChange={(event) => update("status", event.target.value as ArticleStatus)}
              >
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </label>
            <label>
              <span>Reading time</span>
              <input
                value={article.readingTime}
                onChange={(event) => update("readingTime", event.target.value)}
              />
            </label>
          </div>

          <div className="admin-control-card">
            <h2>Search details (SEO)</h2>
            <label>
              <span>SEO Title ({article.seoTitle.length}/60)</span>
              <input
                value={article.seoTitle}
                onChange={(event) => update("seoTitle", event.target.value)}
              />
            </label>
            <label>
              <span>Meta Description ({article.seoDescription.length}/160)</span>
              <textarea
                rows={3}
                value={article.seoDescription}
                onChange={(event) => update("seoDescription", event.target.value)}
              />
            </label>
          </div>
        </aside>
      </div>
    </>
  )
}

function DirectoryView({
  records,
  search,
  regionFilter,
  onSearch,
  onRegionChange,
  onAdd,
  onEdit,
  onToggleVerified,
  onDelete,
}: {
  records: SchoolListing[]
  search: string
  regionFilter: string
  onSearch: (value: string) => void
  onRegionChange: (value: string) => void
  onAdd: () => void
  onEdit: (school: SchoolListing) => void
  onToggleVerified: (slug: string) => void
  onDelete: (slug: string) => void
}) {
  return (
    <>
      <PageHeading
        eyebrow="Education network"
        title="Directory"
        copy="Maintain trusted profiles for schools, tutors and learning providers."
        action={
          <button className="admin-button admin-button-primary" type="button" onClick={onAdd}>
            <Plus aria-hidden="true" />
            Add listing
          </button>
        }
      />

      <div className="admin-toolbar">
        <label className="admin-search">
          <Search aria-hidden="true" />
          <span className="sr-only">Search directory</span>
          <input
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search provider name, location or type"
          />
        </label>

        <label className="admin-filter">
          <span>Region</span>
          <select value={regionFilter} onChange={(e) => onRegionChange(e.target.value)}>
            <option value="All">All regions</option>
            <option value="Lisbon">Lisbon</option>
            <option value="Cascais">Cascais</option>
            <option value="Algarve">Algarve</option>
            <option value="Porto & North">Porto & North</option>
          </select>
        </label>

        <StatusPill tone="success">{records.length} verified profiles</StatusPill>
      </div>

      <section className="admin-table-panel">
        {records.length ? (
          <>
            <div className="admin-table-head admin-directory-columns">
              <span>Provider</span>
              <span>Type</span>
              <span>Region</span>
              <span>Status</span>
              <span>Action</span>
            </div>
            {records.map((school) => (
              <article className="admin-table-row admin-directory-columns" key={school.slug}>
                <div className="admin-story-cell">
                  {school.image ? (
                    <div className="admin-row-thumb">
                      <Image src={school.image} alt="" fill sizes="80px" />
                    </div>
                  ) : (
                    <div className="admin-row-thumb admin-thumb-empty">
                      <UsersRound aria-hidden="true" />
                    </div>
                  )}
                  <div>
                    <h2>{school.name}</h2>
                    <small>{school.location}</small>
                  </div>
                </div>
                <span>{school.type}</span>
                <span>{school.region}</span>
                <button
                  type="button"
                  onClick={() => onToggleVerified(school.slug)}
                  style={{ border: 0, background: "transparent", padding: 0 }}
                  title="Click to toggle verification status"
                >
                  <StatusPill tone={school.verified ? "success" : "neutral"}>
                    <Check aria-hidden="true" />
                    {school.verified ? "Verified" : "Unverified"}
                  </StatusPill>
                </button>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button className="admin-edit-link" type="button" onClick={() => onEdit(school)}>
                    <FilePenLine aria-hidden="true" />
                    Edit
                  </button>
                  <button
                    className="admin-edit-link"
                    style={{ color: "#a83232" }}
                    type="button"
                    onClick={() => onDelete(school.slug)}
                    title="Delete listing"
                  >
                    <Trash2 aria-hidden="true" />
                  </button>
                </div>
              </article>
            ))}
          </>
        ) : (
          <EmptyMessage title="No listings found" copy="Try another name, region or provider type." />
        )}
      </section>
    </>
  )
}

function JobsView({
  records,
  search,
  roleFilter,
  onSearch,
  onRoleChange,
  onAdd,
  onEdit,
  onDelete,
}: {
  records: EducationJob[]
  search: string
  roleFilter: string
  onSearch: (value: string) => void
  onRoleChange: (value: string) => void
  onAdd: () => void
  onEdit: (job: EducationJob) => void
  onDelete: (id: string) => void
}) {
  return (
    <>
      <PageHeading
        eyebrow="Recruitment desk"
        title="Jobs"
        copy="Manage opportunities from education employers across Portugal."
        action={
          <button className="admin-button admin-button-primary" type="button" onClick={onAdd}>
            <Plus aria-hidden="true" />
            Add job
          </button>
        }
      />

      <div className="admin-toolbar">
        <label className="admin-search">
          <Search aria-hidden="true" />
          <span className="sr-only">Search jobs</span>
          <input
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search role, institution or location"
          />
        </label>

        <label className="admin-filter">
          <span>Role type</span>
          <select value={roleFilter} onChange={(e) => onRoleChange(e.target.value)}>
            <option value="All">All roles</option>
            <option value="Teaching">Teaching</option>
            <option value="Leadership">Leadership</option>
            <option value="Support">Support & Operations</option>
          </select>
        </label>

        <StatusPill tone="success">{records.length} live roles</StatusPill>
      </div>

      <section className="admin-table-panel">
        {records.length ? (
          <>
            <div className="admin-table-head admin-job-columns">
              <span>Role</span>
              <span>Location</span>
              <span>Closes</span>
              <span>Status</span>
              <span>Action</span>
            </div>
            {records.map((job, index) => (
              <article className="admin-table-row admin-job-columns" key={job.id}>
                <div>
                  <span className="admin-cell-kicker">{job.role}</span>
                  <h2>{job.title}</h2>
                  <small>{job.institution}</small>
                </div>
                <span>{job.location}</span>
                <time>{job.closes}</time>
                <StatusPill tone={index % 2 === 0 ? "success" : "warning"}>
                  {index % 2 === 0 ? "Live" : "Closing soon"}
                </StatusPill>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button className="admin-edit-link" type="button" onClick={() => onEdit(job)}>
                    <FilePenLine aria-hidden="true" />
                    Edit
                  </button>
                  <button
                    className="admin-edit-link"
                    style={{ color: "#a83232" }}
                    type="button"
                    onClick={() => onDelete(job.id)}
                    title="Delete vacancy"
                  >
                    <Trash2 aria-hidden="true" />
                  </button>
                </div>
              </article>
            ))}
          </>
        ) : (
          <EmptyMessage title="No roles found" copy="Try another role, institution or location." />
        )}
      </section>
    </>
  )
}

function AdvertisingView({
  placements,
  setPlacements,
  onAdd,
  onNotify,
}: {
  placements: AdPlacement[]
  setPlacements: React.Dispatch<React.SetStateAction<AdPlacement[]>>
  onAdd: () => void
  onNotify: (value: string) => void
}) {
  function toggleStatus(id: string) {
    setPlacements((current) =>
      current.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "Active" ? "Paused" : "Active" }
          : p
      )
    )
    onNotify("Campaign placement status updated")
  }

  return (
    <>
      <PageHeading
        eyebrow="Partnerships"
        title="Advertising"
        copy="Review the placements currently shaping the digital magazine and discovery tools."
        action={
          <button className="admin-button admin-button-primary" type="button" onClick={onAdd}>
            <Plus aria-hidden="true" />
            New placement
          </button>
        }
      />

      <section className="admin-ad-feature">
        <div>
          <span className="admin-kicker">Placement 01</span>
          <h2>Homepage leader banner</h2>
          <p>A premium message placed after the school discovery section. Designed for broad campaign visibility.</p>
          <StatusPill tone="success">Active</StatusPill>
        </div>
        <div className="admin-leader-preview">
          <span>Partner message</span>
          <strong>Help families find their next chapter.</strong>
          <small>Homepage · Full width</small>
        </div>
      </section>

      <div className="admin-ad-grid">
        {placements.map((placement) => (
          <article className="admin-ad-card" key={placement.id}>
            <div className="admin-square-preview">
              <Image src="/education/magazine-edition-2.png" alt="Campaign artwork" fill sizes="320px" />
            </div>
            <div>
              <span className="admin-kicker">{placement.type}</span>
              <h2>{placement.title}</h2>
              <p>Partner: <strong>{placement.partner}</strong></p>
              <p>{placement.placementSlot}</p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginTop: "1rem" }}>
                <StatusPill tone={placement.status === "Active" ? "success" : "warning"}>
                  {placement.status}
                </StatusPill>
                <button
                  type="button"
                  className="admin-edit-link"
                  onClick={() => toggleStatus(placement.id)}
                >
                  Toggle Status
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}

function EnquiriesView({
  enquiries,
  selected,
  search,
  filter,
  replyText,
  onSearch,
  onFilter,
  onSelect,
  onReplyTextChange,
  onSendReply,
  onToggleStar,
  onToggleUnread,
  onCompose,
}: {
  enquiries: Enquiry[]
  selected: Enquiry
  search: string
  filter: string
  replyText: string
  onSearch: (v: string) => void
  onFilter: (v: string) => void
  onSelect: (item: Enquiry) => void
  onReplyTextChange: (v: string) => void
  onSendReply: () => void
  onToggleStar: (id: number) => void
  onToggleUnread: (id: number) => void
  onCompose: () => void
}) {
  return (
    <>
      <PageHeading
        eyebrow="Reader care"
        title="Enquiries"
        copy="A calm shared inbox for families, schools and education partners."
        action={
          <button className="admin-button admin-button-primary" type="button" onClick={onCompose}>
            <Send aria-hidden="true" />
            Compose message
          </button>
        }
      />

      <div className="admin-toolbar" style={{ marginBottom: "1rem" }}>
        <label className="admin-search">
          <Search aria-hidden="true" />
          <span className="sr-only">Search enquiries</span>
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search by sender name, subject or message..."
          />
        </label>

        <label className="admin-filter">
          <span>Filter</span>
          <select value={filter} onChange={(e) => onFilter(e.target.value)}>
            <option value="All">All messages</option>
            <option value="Unread">Unread</option>
            <option value="Starred">Starred</option>
            <option value="Family enquiry">Family enquiry</option>
            <option value="Partnership">Partnership</option>
            <option value="Recruitment">Recruitment</option>
          </select>
        </label>
      </div>

      <div className="admin-inbox-layout">
        <section className="admin-inbox-list" aria-label="Enquiry list">
          <div className="admin-inbox-head">
            <strong>All enquiries</strong>
            <StatusPill>{enquiries.filter((e) => e.unread).length} unread</StatusPill>
          </div>
          {enquiries.length ? (
            enquiries.map((item) => (
              <button
                className={`${selected?.id === item.id ? "selected" : ""} ${
                  item.unread ? "unread" : ""
                }`}
                type="button"
                key={item.id}
                onClick={() => onSelect(item)}
              >
                <span className="admin-initials">
                  {item.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </span>
                <span>
                  <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>{item.type}</span>
                    <button
                      type="button"
                      style={{ border: 0, background: "transparent" }}
                      onClick={(e) => {
                        e.stopPropagation()
                        onToggleStar(item.id)
                      }}
                    >
                      <Star
                        size={14}
                        style={{ fill: item.starred ? "#e77c64" : "none", color: item.starred ? "#e77c64" : "#a89b91" }}
                      />
                    </button>
                  </span>
                  <strong>{item.subject}</strong>
                  <small>{item.name}</small>
                </span>
                <time>{item.time}</time>
              </button>
            ))
          ) : (
            <div style={{ padding: "2rem", textAlign: "center", color: "#6c635d" }}>
              No enquiries match filters.
            </div>
          )}
        </section>

        {selected ? (
          <article className="admin-message-detail">
            <div className="admin-message-meta">
              <span className="admin-initials">
                {selected.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")}
              </span>
              <div style={{ flex: 1 }}>
                <span className="admin-kicker">{selected.type}</span>
                <h2>{selected.subject}</h2>
                <p>
                  From <strong>{selected.name}</strong> ({selected.email}) · {selected.time}
                </p>
              </div>
              <div>
                <button
                  className="admin-button admin-button-quiet"
                  type="button"
                  style={{ minHeight: "36px", padding: "0.4rem 0.6rem" }}
                  onClick={() => onToggleUnread(selected.id)}
                >
                  {selected.unread ? "Mark read" : "Mark unread"}
                </button>
              </div>
            </div>

            <div style={{ margin: "1.5rem 0", padding: "1.2rem", background: "#fcfaf7", border: "1px solid #ded5cb" }}>
              <p className="admin-message-copy" style={{ margin: 0 }}>
                {selected.message}
              </p>
            </div>

            {/* Previous Replies Thread */}
            {selected.replies.length > 0 ? (
              <div style={{ margin: "1.5rem 0" }}>
                <h4 style={{ color: "#721d2b", fontSize: "0.75rem", textTransform: uppercaseText("Replies sent") }}>
                  Sent Replies ({selected.replies.length})
                </h4>
                {selected.replies.map((reply, idx) => (
                  <div
                    key={idx}
                    style={{
                      margin: "0.75rem 0",
                      padding: "1rem",
                      background: "#eef1e9",
                      border: "1px solid #b6c0ad",
                      borderRadius: "4px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                      <strong style={{ color: "#496441", fontSize: "0.75rem" }}>{reply.author}</strong>
                      <small style={{ color: "#6c635d", fontSize: "0.68rem" }}>{reply.time}</small>
                    </div>
                    <p style={{ margin: 0, color: "#2b2522", fontSize: "0.82rem" }}>{reply.message}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {/* Quick Reply Form */}
            <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid #ded5cb" }}>
              <span className="admin-kicker">Respond to reader</span>
              <textarea
                rows={4}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  marginTop: "0.5rem",
                  border: "1px solid #c8bdb2",
                  background: "#fffdf9",
                }}
                placeholder={`Write a thoughtful response to ${selected.name}...`}
                value={replyText}
                onChange={(e) => onReplyTextChange(e.target.value)}
              />
              <div className="admin-message-actions">
                <button
                  className="admin-button admin-button-primary"
                  type="button"
                  onClick={onSendReply}
                  disabled={!replyText.trim()}
                >
                  <Send aria-hidden="true" />
                  Dispatch reply
                </button>
              </div>
            </div>
          </article>
        ) : null}
      </div>
    </>
  )
}

function uppercaseText(str: string) {
  return str.toUpperCase()
}

function SettingsView({
  settings,
  setSettings,
  onSave,
  onExport,
  onReset,
}: {
  settings: {
    name: string
    email: string
    timezone: string
    currency: string
    notifyEnquiries: boolean
    notifyJobs: boolean
    weeklyDigest: boolean
  }
  setSettings: React.Dispatch<React.SetStateAction<typeof settings>>
  onSave: () => void
  onExport: () => void
  onReset: () => void
}) {
  return (
    <>
      <PageHeading
        eyebrow="Publication controls"
        title="Settings"
        copy="Keep the publication identity, language roadmap, notification choices and data snapshot clear."
        action={
          <button className="admin-button admin-button-quiet" type="button" onClick={onExport}>
            <Download aria-hidden="true" />
            Export workspace (JSON)
          </button>
        }
      />

      <div className="admin-settings-grid">
        <section className="admin-settings-card">
          <div className="admin-panel-title">
            <div>
              <span className="admin-kicker">Identity</span>
              <h2>Publication Profile</h2>
            </div>
            <BrandMark />
          </div>
          <label>
            <span>Publication Name</span>
            <input
              value={settings.name}
              onChange={(e) => setSettings({ ...settings, name: e.target.value })}
            />
          </label>
          <label>
            <span>Editorial Desk Email</span>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
            />
          </label>
          <label>
            <span>Timezone</span>
            <input
              value={settings.timezone}
              onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
            />
          </label>
          <button className="admin-button admin-button-primary" type="button" onClick={onSave}>
            <Save aria-hidden="true" />
            Save publication identity
          </button>
        </section>

        <section className="admin-settings-card">
          <div className="admin-panel-title">
            <div>
              <span className="admin-kicker">Alerts & Notifications</span>
              <h2>Editorial Preferences</h2>
            </div>
            <Bell aria-hidden="true" />
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={settings.notifyEnquiries}
              onChange={(e) => setSettings({ ...settings, notifyEnquiries: e.target.checked })}
              style={{ width: "18px", height: "18px" }}
            />
            <span style={{ textTransform: "none", fontSize: "0.8rem", color: "#2b2522" }}>
              Email alert on new family enquiry
            </span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer", marginTop: "1rem" }}>
            <input
              type="checkbox"
              checked={settings.notifyJobs}
              onChange={(e) => setSettings({ ...settings, notifyJobs: e.target.checked })}
              style={{ width: "18px", height: "18px" }}
            />
            <span style={{ textTransform: "none", fontSize: "0.8rem", color: "#2b2522" }}>
              Email alert on new vacancy submission
            </span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer", marginTop: "1rem" }}>
            <input
              type="checkbox"
              checked={settings.weeklyDigest}
              onChange={(e) => setSettings({ ...settings, weeklyDigest: e.target.checked })}
              style={{ width: "18px", height: "18px" }}
            />
            <span style={{ textTransform: "none", fontSize: "0.8rem", color: "#2b2522" }}>
              Weekly publishing analytics summary
            </span>
          </label>
        </section>

        <section className="admin-settings-card admin-field-wide">
          <div className="admin-panel-title">
            <div>
              <span className="admin-kicker">Connections</span>
              <h2>Integrations</h2>
            </div>
            <BarChart3 aria-hidden="true" />
          </div>
          <div className="admin-integrations">
            <div>
              <Globe2 aria-hidden="true" />
              <span>
                <strong>Website analytics</strong>
                <small>Vercel Analytics connected</small>
              </span>
              <StatusPill tone="success">Connected</StatusPill>
            </div>
            <div>
              <Inbox aria-hidden="true" />
              <span>
                <strong>Newsletter platform</strong>
                <small>Ready for email dispatch provider</small>
              </span>
              <StatusPill>Configured</StatusPill>
            </div>
          </div>
          <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "flex-end" }}>
            <button className="admin-button admin-button-quiet" type="button" onClick={onReset}>
              <RotateCcw aria-hidden="true" />
              Reset demo data to defaults
            </button>
          </div>
        </section>
      </div>
    </>
  )
}
