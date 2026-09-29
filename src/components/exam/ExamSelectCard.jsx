import { formatDurationLabel } from '../../utils/duration'
import Spinner from '../ui/Spinner'

export default function ExamSelectCard({
  exams,
  chapterId,
  examId,
  exam,
  onExamChange,
  isLoadingExams,
}) {
  var selectDisabled = !chapterId || isLoadingExams || exams.length === 0

  return (
    <section className="surface space-y-4">
      <h2 className="section-title">
        <span className="section-step">2</span>
        Examen
      </h2>

      <label className="block space-y-1.5">
        <span className="field-label inline-flex items-center gap-1.5">
          Examen
          {isLoadingExams ? <Spinner size={12} className="text-pen" /> : null}
        </span>
        <select
          value={examId}
          onChange={function (e) {
            onExamChange(e.target.value)
          }}
          disabled={selectDisabled}
          className="field-input"
        >
          <option value="">
            {isLoadingExams ? 'Chargement des examens…' : 'Sélectionner un examen'}
          </option>
          {!isLoadingExams &&
            exams.map(function (item) {
              return (
                <option key={item.id} value={item.id}>
                  {item.title} ({item.totalQuestions} question{item.totalQuestions > 1 ? 's' : ''})
                </option>
              )
            })}
        </select>
      </label>

      {!chapterId && (
        <p className="text-xs text-ink-600/60">
          Choisissez d&apos;abord un cours et un chapitre pour voir les examens disponibles.
        </p>
      )}

      {chapterId && isLoadingExams && (
        <p className="text-xs text-ink-600/60">Récupération des examens…</p>
      )}

      {chapterId && !isLoadingExams && exams.length === 0 && (
        <p className="text-xs text-ink-600/60">Aucun examen disponible pour cette sélection.</p>
      )}

      {exam && !isLoadingExams && (
        <div className="rounded-xl border border-ink-900/[0.07] bg-paper-50 p-4">
          <p className="font-mono text-[11px] uppercase tracking-widest text-pen">Sélectionné</p>
          <p className="mt-1 font-display text-base font-semibold text-ink-900">{exam.title}</p>
          <p className="mt-2 text-xs text-ink-600">
            {exam.totalQuestions} question(s) · {formatDurationLabel(exam.durationMinutes)} ·{' '}
            {exam.difficultyLevel}
          </p>
        </div>
      )}
    </section>
  )
}
