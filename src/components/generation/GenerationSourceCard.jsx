import { ALL_CHAPTERS_VALUE } from '../../hooks/useExamGeneration'

export default function GenerationSourceCard({
  courses,
  chapters,
  courseId,
  chapterId,
  chapter,
  onCourseChange,
  onChapterChange,
}) {
  var isAllChapters = chapterId === ALL_CHAPTERS_VALUE
  var selectedCourse = courses.find(function (c) {
    return String(c.id) === String(courseId)
  })

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-lg font-semibold text-ink-900">Choisir la source</h2>
        <p className="mt-1 text-sm text-ink-600">
          Sélectionnez le cours et le chapitre à partir desquels générer l&apos;examen.
        </p>
      </div>

      <label className="block space-y-1.5">
        <span className="field-label">Cours</span>
        <select
          value={courseId}
          onChange={function (e) {
            onCourseChange(e.target.value)
          }}
          className="field-input"
        >
          <option value="">Sélectionner un cours</option>
          {courses.map(function (course) {
            return (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            )
          })}
        </select>
      </label>

      <label className="block space-y-1.5">
        <span className="field-label">Chapitre</span>
        <select
          value={chapterId}
          onChange={function (e) {
            onChapterChange(e.target.value)
          }}
          disabled={!courseId}
          className="field-input"
        >
          <option value="">Sélectionner un chapitre</option>
          {courseId && <option value={ALL_CHAPTERS_VALUE}>Toutes les chapitres</option>}
          {chapters.map(function (ch) {
            return (
              <option key={ch.id} value={ch.id}>
                {String(ch.chapterNumber).padStart(2, '0')} — {ch.title}
              </option>
            )
          })}
        </select>
        {!courseId && (
          <p className="text-xs text-ink-600/60">Choisissez d’abord un cours pour voir ses chapitres.</p>
        )}
      </label>

      {isAllChapters && selectedCourse && (
        <div className="rounded-xl border border-sage/20 bg-sage-tint/60 p-4">
          <p className="text-xs font-semibold text-sage">Source sélectionnée</p>
          <p className="mt-1 text-sm font-semibold text-ink-900">
            {selectedCourse.title} — Tous les chapitres
          </p>
          <p className="mt-1 text-xs leading-relaxed text-ink-600">
            L’IA utilisera le contenu combiné de {selectedCourse.chapters?.length ?? 'tous les'}{' '}
            chapitre(s).
          </p>
        </div>
      )}

      {!isAllChapters && chapter && (
        <div className="rounded-xl border border-pen/15 bg-pen-tint/40 p-4">
          <p className="text-xs font-semibold text-pen-dark">Source sélectionnée</p>
          <p className="mt-1 text-sm font-semibold text-ink-900">{chapter.title}</p>
          <p className="mt-1 max-h-28 overflow-auto whitespace-pre-wrap text-xs leading-relaxed text-ink-600">
            {chapter.content?.slice(0, 420) || 'Pas de contenu texte détecté pour ce chapitre.'}
            {chapter.content?.length > 420 ? '…' : ''}
          </p>
        </div>
      )}
    </div>
  )
}
