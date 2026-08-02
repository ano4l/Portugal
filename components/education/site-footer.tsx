import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { NewsletterForm } from "./newsletter-form"

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-top">
        <div className="footer-intro">
          <p className="eyebrow eyebrow-light">A clearer way to choose</p>
          <h2>Make Portugal feel like home, starting with school.</h2>
          <p>
            Independent profiles, grounded local guidance and a human enquiry
            service for families making an important move.
          </p>
          <Link className="text-link text-link-light" href="/directory">
            Begin your search <ArrowUpRight aria-hidden="true" size={17} />
          </Link>
        </div>

        <div className="footer-magazine">
          <Image
            src="/education/magazine-edition-2.png"
            alt="Latest Education in Portugal magazine cover"
            width={330}
            height={465}
            sizes="(max-width: 700px) 145px, 180px"
          />
          <div>
            <span>Latest issue</span>
            <strong>Education in Portugal, Issue 2</strong>
            <Link href="/magazine">Read the digital edition</Link>
          </div>
        </div>
      </div>

      <div className="shell footer-grid">
        <div>
          <span className="footer-label">Keep in touch</span>
          <p>Monthly school insight and family guidance, thoughtfully edited.</p>
          <NewsletterForm compact />
        </div>
        <div>
          <span className="footer-label">Discover</span>
          <Link href="/directory">Find a school</Link>
          <Link href="/tutors">Tutors & learning support</Link>
          <Link href="/jobs">Education jobs</Link>
          <Link href="/magazine">Articles & insights</Link>
        </div>
        <div>
          <span className="footer-label">For partners</span>
          <Link href="/advertise">List your institution</Link>
          <Link href="/jobs">Recruit educators</Link>
          <Link href="/advertise">Advertise with us</Link>
          <Link href="/about">About the guide</Link>
        </div>
        <div>
          <span className="footer-label">Talk to us</span>
          <a href="tel:+351282341100">+351 282 341 100</a>
          <a href="mailto:info@educationinportugal.com">
            info@educationinportugal.com
          </a>
          <Link href="/contact">Contact page</Link>
          <p>Portugal<br />Monday-Friday</p>
        </div>
      </div>

      <div className="shell footer-bottom">
        <p>© 2026 Education in Portugal</p>
        <div>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/accessibility">Accessibility</Link>
          <Link href="/admin">Editorial Studio</Link>
        </div>
        <p>Independent. Useful. Made in Portugal.</p>
      </div>
    </footer>
  )
}
