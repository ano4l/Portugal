"use client"

import * as Dialog from "@radix-ui/react-dialog"
import { Menu, Phone, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

const primaryNavigation = [
  { href: "/directory", label: "Schools" },
  { href: "/tutors", label: "Tutors & support" },
  { href: "/jobs", label: "Jobs" },
  { href: "/magazine", label: "Articles" },
  { href: "/about", label: "About" },
]

const mobileNavigation = [
  { href: "/", label: "Home" },
  ...primaryNavigation,
  { href: "/advertise", label: "Advertise with us" },
  { href: "/contact", label: "Contact" },
]

function Wordmark() {
  return (
    <span className="wordmark" aria-label="Education in Portugal">
      <span>Education</span>
      <span className="wordmark-small">in</span>
      <span>Portugal</span>
    </span>
  )
}

export function SiteHeader() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [language, setLanguage] = useState<"en" | "pt">("en")

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("education-in-portugal-language")
    if (savedLanguage === "en" || savedLanguage === "pt") {
      setLanguage(savedLanguage)
    }
  }, [])

  function changeLanguage(nextLanguage: "en" | "pt") {
    setLanguage(nextLanguage)
    window.localStorage.setItem("education-in-portugal-language", nextLanguage)
  }

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href)
  }

  return (
    <header className="site-header">
      <div className="utility-bar">
        <div className="shell utility-inner">
          <p>Independent guidance for families across Portugal</p>
          <div className="utility-links">
            <Link href="/advertise">Advertise with us</Link>
            <Link href="/contact">Contact</Link>
            <a href="tel:+351282341100">
              <Phone aria-hidden="true" size={14} />
              +351 282 341 100
            </a>
            <label className="language-indicator">
              <span className="sr-only">Website language</span>
              <select
                aria-label="Website language"
                value={language}
                onChange={(event) => changeLanguage(event.target.value as "en" | "pt")}
              >
                <option value="en">English</option>
                <option value="pt">Português</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      <div className="shell main-navigation">
        <Link className="wordmark-link" href="/" aria-label="Education in Portugal home">
          <Wordmark />
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {primaryNavigation.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                className={active ? "nav-link active" : "nav-link"}
                href={item.href}
                key={item.label}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="desktop-header-action">
          <Link className="button button-primary button-compact" href="/directory">
            Find a school
          </Link>
        </div>

        <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
          <Dialog.Trigger asChild>
            <button className="mobile-menu-trigger" type="button" aria-label="Open navigation">
              <Menu aria-hidden="true" />
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="dialog-overlay" />
            <Dialog.Content className="mobile-nav-panel">
              <div className="mobile-nav-head">
                <Dialog.Title asChild>
                  <div>
                    <Wordmark />
                  </div>
                </Dialog.Title>
                <Dialog.Description className="sr-only">
                  Primary site navigation and contact options.
                </Dialog.Description>
                <Dialog.Close asChild>
                  <button className="icon-button" type="button" aria-label="Close navigation">
                    <X aria-hidden="true" />
                  </button>
                </Dialog.Close>
              </div>
              <nav className="mobile-nav" aria-label="Mobile navigation">
                {mobileNavigation.map((item) => {
                  const active = isActive(item.href)
                  return (
                    <Dialog.Close asChild key={item.label}>
                      <Link
                        className={active ? "active" : undefined}
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                      >
                        {item.label}
                      </Link>
                    </Dialog.Close>
                  )
                })}
              </nav>
              <div className="mobile-nav-foot">
                <label className="mobile-language-select">
                  <span>Language</span>
                  <select
                    value={language}
                    onChange={(event) => changeLanguage(event.target.value as "en" | "pt")}
                  >
                    <option value="en">English</option>
                    <option value="pt">Português</option>
                  </select>
                </label>
                <Dialog.Close asChild>
                  <Link className="button button-coral" href="/directory">
                    Start your school search
                  </Link>
                </Dialog.Close>
                <a href="tel:+351282341100">Call +351 282 341 100</a>
                <p>English-language support, Monday-Friday</p>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </header>
  )
}
