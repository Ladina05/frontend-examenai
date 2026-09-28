export default function ChapterListItem({ chapter, isActive, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`grid w-full grid-cols-[2rem_1fr_auto] items-center gap-2 rounded-lg px-2.5 py-2.5 text-left transition-colors duration-150 ${
        isActive ? 'bg-pen-tint' : 'hover:bg-paper-100'
      }`}
    >
      <span
        className={`font-mono text-xs font-semibold tabular-nums ${
          isActive ? 'text-pen-dark' : 'text-ink-600/55'
        }`}
      >
        {String(chapter.chapterNumber).padStart(2, '0')}
      </span>
      <span
        className={`min-w-0 truncate text-sm font-medium ${
          isActive ? 'text-pen-dark' : 'text-ink-800'
        }`}
      >
        {chapter.title}
      </span>
      {chapter.pageStart ? (
        <span className="shrink-0 font-mono text-[10px] text-ink-600/45">p.{chapter.pageStart}</span>
      ) : (
        <span />
      )}
    </button>
  )
}
