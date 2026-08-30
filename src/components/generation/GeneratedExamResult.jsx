import { Link } from 'react-router-dom'
import { ArrowRight, FileOutput, ListChecks } from 'lucide-react'
import StatusBanner from '../StatusBanner'
import GeneratedQuestionCard from './GeneratedQuestionCard'

export default function GeneratedExamResult({ exam }) {
  return (
    <section className="space-y-5">
      <StatusBanner
        type="success"
        message={`Examen « ${exam.title} » généré — ${exam.totalQuestions} question(s).`}
      />

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
        {(exam.questions || []).map((question, index) => (
          <GeneratedQuestionCard
            key={question.id || index}
            question={question}
            index={index}
          />
        ))}
      </div>
    </section>
  )
}
