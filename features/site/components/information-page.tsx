import type { ReactNode } from "react"

export function InformationPage({
  title,
  introduction,
  children,
}: {
  title: string
  introduction: string
  children: ReactNode
}) {
  return (
    <main id="main-content" className="information-page">
      <header>
        <div className="shell">
          <p>Education in Portugal</p>
          <h1>{title}</h1>
          <p>{introduction}</p>
        </div>
      </header>
      <article className="shell information-content">{children}</article>
    </main>
  )
}
