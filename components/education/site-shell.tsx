"use client"

import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import { PageTransition } from "@/components/education/page-transition"
import { SiteFooter } from "@/components/education/site-footer"
import { SiteHeader } from "@/components/education/site-header"

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/admin")

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader />
      <PageTransition>{children}</PageTransition>
      <SiteFooter />
    </>
  )
}
