"use client"

import * as Dialog from "@radix-ui/react-dialog"
import { useReducedMotion } from "framer-motion"
import { Menu, Phone, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

const navigation = [
  { href: "/", label: "Discover" },
  { href: "/directory", label: "Schools & activities" },
  { href: "/jobs", label: "Jobs" },
  { href: "/magazine", label: "Magazine" },
  { href: "/#about", label: "About" },
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
  const reduceMotion = useReducedMotion()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [aboutActive, setAboutActive] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    if (pathname !== "/") {
      setAboutActive(false)
      return
    }

    const about = document.getElementById("about")
    if (!about) return

    const observer = new IntersectionObserver(
      ([entry]) => setAboutActive(entry.isIntersecting),
      { rootMargin: "-22% 0px -54% 0px", threshold: 0.08 },
    )

    observer.observe(about)
    return () => observer.disconnect()
  }, [pathname])

  function handleAboutClick(event: React.MouseEvent<HTMLAnchorElement>) {
    setMobileOpen(false)
    if (pathname !== "/") return

    const about = document.getElementById("about")
    if (!about) return

    event.preventDefault()
    window.history.replaceState(null, "", "/#about")
    about.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    })
  }

  return (
    <header className="site-header">
      <div className="utility-bar">
        <div className="shell utility-inner">
          <p>Independent guidance for families across Portugal</p>
          <div className="utility-links">
            <a href="tel:+351282341100">
              <Phone aria-hidden="true" size={14} />
              +351 282 341 100
            </a>
            <span aria-hidden="true">•</span>
            <span className="language-indicator" aria-label="Language: English">
              EN
            </span>
          </div>
        </div>
      </div>

      <div className="shell main-navigation">
        <Link className="wordmark-link" href="/" aria-label="Education in Portugal home">
          <Wordmark />
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/" && !aboutActive
                : item.href.startsWith("/#")
                  ? pathname === "/" && aboutActive
                  : pathname.startsWith(item.href)
            return (
              <Link
                className={active ? "nav-link active" : "nav-link"}
                href={item.href}
                key={item.label}
                onClick={item.href === "/#about" ? handleAboutClick : undefined}
                aria-current={
                  active ? (item.href === "/#about" ? "location" : "page") : undefined
                }
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
                {navigation.map((item) => {
                  const active =
                    item.href === "/"
                      ? pathname === "/" && !aboutActive
                      : item.href === "/#about"
                        ? pathname === "/" && aboutActive
                        : pathname.startsWith(item.href)

                  return (
                    <Dialog.Close asChild key={item.label}>
                      <Link
                        className={active ? "active" : undefined}
                        href={item.href}
                        onClick={
                          item.href === "/#about" ? handleAboutClick : undefined
                        }
                        aria-current={
                          active
                            ? item.href === "/#about"
                              ? "location"
                              : "page"
                            : undefined
                        }
                      >
                        {item.label}
                      </Link>
                    </Dialog.Close>
                  )
                })}
              </nav>
              <div className="mobile-nav-foot">
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
