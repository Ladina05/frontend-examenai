import { CircleHelp } from 'lucide-react'

export default function FieldHint({ text }) {
  if (!text) return null

  return (
    <span
      className="ml-1 inline-flex align-middle text-ink-400"
      title={text}
      tabIndex={0}
      role="img"
      aria-label={text}
    >
      <CircleHelp size={13} strokeWidth={2.2} aria-hidden="true" />
    </span>
  )
}
