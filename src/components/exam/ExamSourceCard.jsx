import { ALL_CHAPTERS_VALUE } from '../../hooks/useExamPicker'

export default function ExamSourceCard({
  courses,
  chapters,
  courseId,
  chapterId,
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
          disabled={!courseId}
          className="w-full rounded-xl border border-ink-900/15 bg-white px-3 py-2.5 text-sm disabled:bg-paper-100"
        >
          <option value="">Sélectionner un chapitre</option>
          {courseId && <option value={ALL_CHAPTERS_VALUE}>Toutes les chapitres</option>}
          {chapters.map((chapter) => (
            <option key={chapter.id} value={chapter.id}>
              {String(chapter.chapterNumber).padStart(2, '0')} — {chapter.title}
            </option>
          ))}
        </select>
      </label>
    </section>
  )
}