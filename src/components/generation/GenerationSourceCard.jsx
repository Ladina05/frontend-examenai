export default function GenerationSourceCard({
  courses,
  chapters,
  courseId,
  chapterId,
  chapter,
  onCourseChange,
  onChapterChange,
}) {
  return (
    <section className="index-card space-y-5 border-solid p-6">
      <h2 className="font-display text-lg font-semibold text-ink-900">Source</h2>

      <label className="block space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-600">Cours</span>
        <select
          value={courseId}
          onChange={(e) => onCourseChange(e.target.value)}
          className="w-full rounded-xl border border-ink-900/15 bg-white px-3 py-2.5 text-sm"
        >
          <option value="">Sélectionner un cours</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
      </label>

      <label className="block space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-600">Chapitre</span>
        <select
          value={chapterId}
          onChange={(e) => onChapterChange(e.target.value)}
          disabled={!courseId || chapters.length === 0}
          className="w-full rounded-xl border border-ink-900/15 bg-white px-3 py-2.5 text-sm disabled:bg-paper-100"
        >
          <option value="">Sélectionner un chapitre</option>
          {chapters.map((ch) => (
            <option key={ch.id} value={ch.id}>
              {String(ch.chapterNumber).padStart(2, '0')} — {ch.title}
            </option>
          ))}
        </select>
      </label>

      {chapter && (
        <div className="rounded-xl border border-dashed border-ink-900/12 bg-paper-50 p-4">
          <p className="font-mono text-[11px] uppercase tracking-widest text-pen">Aperçu</p>
          <p className="mt-1 font-display text-base font-semibold text-ink-900">{chapter.title}</p>
          <p className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap text-xs leading-relaxed text-ink-600">
            {chapter.content?.slice(0, 600) || 'Contenu vide'}
            {chapter.content?.length > 600 ? '…' : ''}
          </p>
        </div>
      )}
    </section>
  )
}
