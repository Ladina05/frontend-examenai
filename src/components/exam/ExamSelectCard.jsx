export default function ExamSelectCard({ exams, chapterId, examId, exam, onExamChange }) {
    return (
      <section className="index-card space-y-5 border-solid p-6">
        <h2 className="font-display text-lg font-semibold text-ink-900">Examen</h2>
  
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
  
        {!chapterId && (
          <p className="text-xs text-ink-600/60">
            Choisissez d&apos;abord un cours et un chapitre pour voir les examens disponibles.
          </p>
        )}
  
        {chapterId && exams.length === 0 && (
          <p className="text-xs text-ink-600/60">Aucun examen disponible pour cette sélection.</p>
        )}
  
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