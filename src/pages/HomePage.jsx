import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  UploadCloud,
  Layers,
  Bot,
  ListChecks,
  FileOutput,
  ArrowRight,
} from 'lucide-react'
import { fetchCourses } from '../api/courses'

var pipeline = [
  {
    n: '01',
    to: '/courses',
    icon: UploadCloud,
    title: 'Déposer',
    description: 'Uploadez PDF, Word ou texte.',
  },
  {
    n: '02',
    to: '/courses',
    icon: Layers,
    title: 'Découper',
    description: 'Chapitres extraits auto.',
  },
  {
    n: '03',
    to: '/generation',
    icon: Bot,
    title: 'Générer',
    description: 'Questions via IA.',
  },
  {
    n: '04',
    to: '/questions',
    icon: ListChecks,
    title: 'Éditer',
    description: 'Relisez et corrigez.',
  },
  {
    n: '05',
    to: '/export',
    icon: FileOutput,
    title: 'Exporter',
    description: 'PDF ou Word prêts.',
  },
]

export default function HomePage() {
  var [courseCount, setCourseCount] = useState(null)

  useEffect(function () {
    var isCancelled = false
    fetchCourses()
      .then(function (data) {
        if (!isCancelled) setCourseCount(data.length)
      })
      .catch(function () {})
    return function () {
      isCancelled = true
    }
  }, [])

  var hasCourses = courseCount !== null && courseCount > 0

  return (
    <div className="w-full space-y-8 sm:space-y-10">
      <section className="w-full overflow-hidden rounded-2xl border border-ink-900/10 bg-white px-5 py-10 sm:rounded-3xl sm:px-10 sm:py-14 lg:px-14 lg:py-16">
        <p className="page-header-kicker">ExamGenAI</p>
        <h1 className="mt-4 max-w-4xl font-display text-3xl font-semibold leading-[1.12] tracking-tight text-ink-900 sm:text-4xl lg:text-5xl">
          Des examens <span className="text-pen">prêts à imprimer</span>, depuis vos{' '}
          <span className="text-pen">cours</span>.
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-ink-600 sm:text-base">
          Un parcours simple : déposez, générez, ajustez, exportez. L&apos;IA s&apos;occupe du
          brouillon.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to={hasCourses ? '/generation' : '/courses'} className="btn-primary">
            <Bot size={16} />
            {hasCourses ? 'Générer un examen' : 'Commencer'}
          </Link>
          <Link to="/courses" className="btn-secondary">
            Mes cours
            <ArrowRight size={15} />
          </Link>
        </div>
        {courseCount !== null && (
          <p className="mt-6 text-xs text-ink-600/70">
            {courseCount === 0
              ? 'Aucun cours encore — commencez par un dépôt.'
              : `${courseCount} cours disponible${courseCount > 1 ? 's' : ''} — prêt à générer.`}
          </p>
        )}
      </section>

      <section className="surface w-full">
        <div className="mb-5">
          <h2 className="font-display text-xl font-semibold text-ink-900">Comment ça marche</h2>
          <p className="mt-1 text-sm text-ink-600">Cliquez une étape pour y aller directement.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {pipeline.map(function ({ n, to, icon: Icon, title, description }) {
            return (
              <Link
                key={n}
                to={to}
                className="rounded-2xl border border-ink-900/10 bg-paper-50 p-4 transition-colors hover:border-pen/30 hover:bg-pen-tint/40"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-pen">{n}</span>
                  <Icon size={16} className="text-ink-600" />
                </div>
                <h3 className="text-sm font-semibold text-ink-900">{title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-ink-600">{description}</p>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
