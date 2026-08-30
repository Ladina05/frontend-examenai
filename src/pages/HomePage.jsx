import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  UploadCloud,
  Layers,
  Sparkles,
  ListChecks,
  FileOutput,
  ArrowRight,
  BookOpen,
} from 'lucide-react'
import { fetchCourses } from '../api/courses'

const pipeline = [
  {
    n: '01',
    to: '/courses',
    icon: UploadCloud,
    title: 'Déposer un cours',
    description: 'PDF, Word ou texte — votre support tel quel.',
  },
  {
    n: '02',
    to: '/courses',
    icon: Layers,
    title: 'Extraire les chapitres',
    description: 'Le texte est découpé chapitre par chapitre.',
  },
  {
    n: '03',
    to: '/generation',
    icon: Sparkles,
    title: 'Générer avec l\u2019IA',
    description: 'Un chapitre choisi devient une série de questions.',
  },
  {
    n: '04',
    to: '/questions',
    icon: ListChecks,
    title: 'Ajuster les questions',
    description: 'Relire, corriger, compléter avant impression.',
  },
  {
    n: '05',
    to: '/export',
    icon: FileOutput,
    title: 'Exporter l\u2019examen',
    description: 'PDF ou Word, avec ou sans le corrigé.',
  },
]

export default function HomePage() {
  const [courseCount, setCourseCount] = useState(null)

  useEffect(() => {
    let isCancelled = false
    fetchCourses()
      .then((data) => {
        if (!isCancelled) setCourseCount(data.length)
      })
      .catch(() => {
        // Le backend n'est peut-être pas encore démarré : on reste discret sur l'accueil.
      })
    return () => {
      isCancelled = true
    }
  }, [])

  return (
    <div className="space-y-14">
      <section className="relative overflow-hidden rounded-3xl border border-ink-900/8 bg-hero-blob px-8 py-14 sm:px-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 animate-float-slow rounded-full bg-violet/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 left-1/3 h-64 w-64 animate-float-slow rounded-full bg-pen/10 blur-3xl"
          style={{ animationDelay: '-4s' }}
        />

        <div className="relative max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-widest text-pen">ExamGenAI</p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-ink-900 sm:text-5xl">
            Vos cours deviennent des examens.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-ink-600">
            Déposez un support de cours, laissez ExamGenAI en extraire les chapitres,
            puis générez des questions prêtes à corriger — sans repartir d'une page blanche.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/courses" className="btn-primary">
              <UploadCloud size={16} />
              Téléverser un cours
            </Link>
            <Link to="/courses" className="btn-secondary">
              <BookOpen size={16} />
              Voir mes cours
            </Link>
          </div>

          {courseCount !== null && (
            <p className="mt-6 font-mono text-xs text-ink-600/60">
              {courseCount === 0
                ? 'Aucun cours déposé pour l\u2019instant.'
                : `${courseCount} cours déjà déposé${courseCount > 1 ? 's' : ''}.`}
            </p>
          )}
        </div>
      </section>

      <section>
        <h2 className="mb-6 font-display text-lg font-semibold text-ink-900">Le parcours, en 5 étapes</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {pipeline.map(({ n, to, icon: Icon, title, description }) => (
            <Link
              key={n}
              to={to}
              className="index-card group flex flex-col gap-3 p-5 border-solid"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-ink-600/50">{n}</span>
                <Icon
                  size={18}
                  className="text-ink-600 transition-colors duration-150 group-hover:text-pen"
                />
              </div>
              <div>
                <h3 className="font-display text-base font-semibold text-ink-900">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-600">{description}</p>
              </div>
              <span className="mt-auto flex items-center gap-1 text-xs font-semibold text-pen opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                Ouvrir
                <ArrowRight size={13} />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
