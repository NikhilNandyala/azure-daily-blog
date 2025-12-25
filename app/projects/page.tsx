import projectsData from '@/data/projectsData'
import Card from '@/components/Card'
import Link from '@/components/Link'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Projects' })

export default function Projects() {
  return (
    <>
      <div className="divide-y divide-white/6">
        <div className="mb-6 pt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-blue-400 transition-colors hover:text-blue-300"
            aria-label="Back to home page"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        </div>
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-body text-3xl leading-9 font-extrabold tracking-tight sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Projects
          </h1>
          <p className="text-muted text-lg leading-7">
            Showcase your projects with a hero image (16 x 9)
          </p>
        </div>
        <div className="container py-12">
          <div className="-m-4 flex flex-wrap">
            {projectsData.map((d) => (
              <Card
                key={d.title}
                title={d.title}
                description={d.description}
                imgSrc={d.imgSrc}
                href={d.href}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
