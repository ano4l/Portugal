"use client"

import Image from "next/image"
import { BadgeCheck } from "lucide-react"
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion"
import { useRef } from "react"
import { HomeSearch } from "./home-search"

const ease = [0.16, 1, 0.3, 1] as const

export function HomeHero() {
  const heroRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 28])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.025, 1])
  const frameY = useTransform(scrollYProgress, [0, 1], [0, -12])

  return (
    <section
      ref={heroRef}
      className="home-hero"
      aria-labelledby="home-title"
    >
      <div className="shell hero-spread">
        <motion.div
          className="hero-copy"
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.09, delayChildren: 0.08 },
            },
          }}
        >
          <motion.p
            className="eyebrow"
            variants={{
              hidden: { opacity: 0, y: 14 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.56, ease } },
            }}
          >
            The independent guide to education in Portugal
          </motion.p>
          <motion.h1
            id="home-title"
            variants={{
              hidden: { opacity: 0, y: 22 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.72, ease } },
            }}
          >
            <span className="hero-title-line">Find the school.</span>
            <span className="hero-title-line hero-title-flourish">
              Picture the life.
            </span>
          </motion.h1>
          <motion.p
            className="hero-intro"
            variants={{
              hidden: { opacity: 0, y: 18 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.64, ease } },
            }}
          >
            Considered profiles and frank local guidance for families choosing
            where and how to learn in Portugal.
          </motion.p>
          <motion.div
            className="hero-proof"
            variants={{
              hidden: { opacity: 0, y: 14 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.56, ease } },
            }}
          >
            <BadgeCheck aria-hidden="true" />
            <p>
              <strong>Curated independently.</strong>
              Profiles checked by people, with human help when you need it.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-image-wrap"
          initial={reduceMotion ? false : { opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.78, delay: 0.12, ease }}
          style={{ y: reduceMotion ? 0 : frameY }}
        >
          <motion.div
            className="hero-image-stage"
            style={{
              y: reduceMotion ? 0 : imageY,
              scale: reduceMotion ? 1 : imageScale,
            }}
          >
            <Image
              className="hero-image"
              src="/education/international-sharing-school.webp"
              alt="Students learning in a bright, collaborative school space"
              fill
              priority
              sizes="(max-width: 800px) 100vw, 55vw"
            />
          </motion.div>
          <div className="hero-frame-mark" aria-hidden="true" />
          <div className="hero-image-caption">
            <span>School life</span>
            <p>International Sharing School, Greater Lisbon</p>
          </div>
        </motion.div>

        <motion.div
          className="hero-search-wrap"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.68, delay: 0.42, ease }}
        >
          <HomeSearch />
        </motion.div>
      </div>
    </section>
  )
}
