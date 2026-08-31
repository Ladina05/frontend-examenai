import { Link } from 'react-router-dom'
import { ArrowRight, FileOutput, ListChecks } from 'lucide-react'
import GeneratedQuestionCard from './GeneratedQuestionCard'

export default function GeneratedExamResult({ exam }) {
  return (
    <section className="space-y-5">
      <div className="index-card border-solid px-5 py-4">
        <p className="text-sm font-medium text-ink-800">
          Examen prêt : <span className="font-display text-ink-900">{exam.title}</span>
          {' · '}
          {exam.totalQuestions} question(s)
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to={`/questions?examId=${exam.id}`} className="btn-secondary">
          <ListChecks size={16} />
          Éditer les questions
          <ArrowRight size={14} />
        </Link>
        <Link to={`/export?examId=${exam.id}`} className="btn-secondary">
          <FileOutput size={16} />
          Exporter
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="space-y-4">
        {(exam.questions || []).map(function (question, index) {
          return (
            <GeneratedQuestionCard
              key={question.id || index}
              question={question}
              index={index}
            />
          )
        })}
      </div>
    </section>
  )
}
