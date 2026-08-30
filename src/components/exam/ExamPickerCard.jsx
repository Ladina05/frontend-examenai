export default function ExamPickerCard({
  courses,
  chapters,
  exams,
  courseId,
  chapterId,
  examId,
  exam,
  onCourseChange,
  onChapterChange,
  onExamChange,
}) {
  return (
    <section className="index-card space-y-5 border-solid p-6">
      <h2 className="font-display text-lg font-semibold text-ink-900">Examen</h2>

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
          {chapters.map((chapter) => (
            <option key={chapter.id} value={chapter.id}>
              {String(chapter.chapterNumber).padStart(2, '0')} — {chapter.title}
            </option>
          ))}
        </select>
      </label>

      <label className="block space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-600">Examen</span>
        <select
          value={examId}
          onChange={(e) => onExamChange(e.target.value)}
          disabled={!chapterId || exams.length === 0}
          className="w-full rounded-xl border border-ink-900/15 bg-white px-3 py-2.5 text-sm disabled:bg-paper-100"
        >
          <option value="">Sélectionner un examen</option>
          {exams.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title} ({item.totalQuestions} question{item.totalQuestions > 1 ? 's' : ''})
            </option>
          ))}
        </select>
      </label>

      {exam && (
        <div className="rounded-xl border border-dashed border-ink-900/12 bg-paper-50 p-4">
          <p className="font-mono text-[11px] uppercase tracking-widest text-pen">Sélectionné</p>
          <p className="mt-1 font-display text-base font-semibold text-ink-900">{exam.title}</p>
          <p className="mt-2 text-xs text-ink-600">
            {exam.totalQuestions} question(s) · {exam.durationMinutes} min · {exam.difficultyLevel}
          </p>
        </div>
      )}
    </section>
  )
}
