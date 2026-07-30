"use client"

import Image from "next/image"
import { BookOpen, MessagesSquare, Search } from "lucide-react"
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion"
import { useRef } from "react"

const steps = [
  {
    title: "Discover",
    text: "Search trusted profiles by region, curriculum and the support your child needs.",
    icon: Search,
  },
  {
    title: "Understand",
    text: "Read the practical detail, editorial context and questions worth taking to a visit.",
    icon: BookOpen,
  },
  {
    title: "Enquire",
    text: "Send one considered enquiry and see whether delivery to admissions was confirmed.",
    icon: MessagesSquare,
  },
]

const ease = [0.16, 1, 0.3, 1] as const

export function HomeProcessStory() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 78%", "end 30%"],
  })
  const lineScale = useTransform(scrollYProgress, [0.06, 0.88], [0, 1])
  const imageY = useTransform(scrollYProgress, [0, 1], [18, -18])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.025, 1])

  return (
    <section
      ref={sectionRef}
      className="section process-section process-story"
      id="about"
      aria-labelledby="process-title"
    >
      <div className="shell process-story-grid">
        <div className="process-story-intro">
          <h2 id="process-title">From first thought to first visit.</h2>
          <p>
            We make the practical path clearer while keeping your family, not
            an algorithm, at the centre of every choice.
          </p>
          <figure className="process-story-image">
            <motion.div
              className="process-story-image-stage"
              style={{
                y: reduceMotion ? 0 : imageY,
                scale: reduceMotion ? 1 : imageScale,
              }}
            >
              <Image
                src="/education/ips-cascais.webp"
                alt="A student enjoying school life in Portugal"
                fill
                sizes="(max-width: 800px) 100vw, 42vw"
              />
            </motion.div>
            <figcaption>
              A shortlist should make sense in the classroom and in daily life.
            </figcaption>
          </figure>
        </div>

        <div className="process-story-steps">
          <span className="process-story-line" aria-hidden="true">
            <motion.span
              style={{ scaleY: reduceMotion ? 1 : lineScale }}
            />
          </span>
          <ol>
            {steps.map((step, index) => (
              <motion.li
                key={step.title}
                initial={reduceMotion ? false : { opacity: 1, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.48 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.62,
                  delay: reduceMotion ? 0 : index * 0.06,
                  ease,
                }}
              >
                <span className="process-step-marker" aria-hidden="true">
                  <step.icon />
                </span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
