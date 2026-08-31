const STYLES = {
  PDF: 'bg-pen-tint text-pen-dark',
  WORD: 'bg-sage-tint text-sage',
  TEXT: 'bg-ink-900/5 text-ink-700',
}

const LABELS = {
  PDF: 'PDF',
  WORD: 'WORD',
  TEXT: 'TXT',
}

export default function FileTypeBadge({ fileType }) {
  var style = STYLES[fileType] || STYLES.TEXT
  var label = LABELS[fileType] || fileType || '?'

  return <span className={`badge ${style}`}>{label}</span>
}
