import { ALL_CHAPTERS_VALUE } from '../../hooks/useExamPicker'

export default function ExamSourceCard({
  courses,
  chapters,
  courseId,
  chapterId,
  onCourseChange,
  onChapterChange,
  chapterIdsWithExams,
  hasAnyCourseExam,
}) {
  var examMap = chapterIdsWithExams || {}

  return (
    <section className="surface space-y-4">
      <h2 className="section-title">
        <span className="section-step">1</span>
        Source
      </h2>

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
          {courseId && (
            <option value={ALL_CHAPTERS_VALUE} disabled={!hasAnyCourseExam}>
              {hasAnyCourseExam
                ? 'Toutes les chapitres'
                : 'Toutes les chapitres (aucun examen)'}
            </option>
          )}
          {chapters.map(function (chapter) {
            var hasExam = Boolean(examMap[String(chapter.id)])
            return (
              <option key={chapter.id} value={chapter.id} disabled={!hasExam}>
                {String(chapter.chapterNumber).padStart(2, '0')} — {chapter.title}
                {hasExam ? '' : ' (aucun examen)'}
              </option>
            )
          })}
        </select>
        {courseId && (
          <p className="text-xs text-ink-600/70">
            Les chapitres sans examen généré sont grisés et non sélectionnables.
          </p>
        )}
      </label>
    </section>
  )
}
