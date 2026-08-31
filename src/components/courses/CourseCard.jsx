import { Link } from 'react-router-dom'
import { Trash2, ArrowUpRight, Layers } from 'lucide-react'
import FileTypeBadge from './FileTypeBadge'

function formatDate(value) {
  if (!value) return null
  try {
    return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }).format(
      new Date(value),
    )
  } catch {
    return null
  }
}

export default function CourseCard({ course, onDelete, isDeleting }) {
  var chapterCount = course.chapters?.length
  var date = formatDate(course.createdAt)

  return (
    <div className="index-card group flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <FileTypeBadge fileType={course.fileType} />
        <button
          type="button"
          onClick={function () {
            onDelete(course)
          }}
          disabled={isDeleting}
          aria-label={`Supprimer ${course.title}`}
          className="rounded-lg p-1.5 text-ink-600/50 transition-colors duration-150 hover:bg-pen-tint hover:text-pen disabled:opacity-40"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <h3 className="mt-4 font-display text-lg font-semibold leading-snug text-ink-900">
        {course.title}
      </h3>

      <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-relaxed text-ink-600">
        {course.description || 'Aucune description fournie pour ce cours.'}
      </p>

      <div className="mt-4 flex items-center justify-between border-t border-dashed border-ink-900/10 pt-3">
        <div className="flex items-center gap-3 font-mono text-[11px] text-ink-600/70">
          {date && <span>{date}</span>}
          {typeof chapterCount === 'number' && (
            <span className="flex items-center gap-1">
              <Layers size={12} />
              {chapterCount} ch.
            </span>
          )}
        </div>
        <Link
          to={`/courses/${course.id}`}
          className="flex items-center gap-1 text-sm font-semibold text-pen transition-transform duration-150 group-hover:translate-x-0.5"
        >
          Ouvrir
          <ArrowUpRight size={15} />
        </Link>
      </div>
    </div>
  )
}
