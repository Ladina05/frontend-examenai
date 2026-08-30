export default function ChapterListItem({ chapter, isActive, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`toc-row w-full rounded-lg px-3 py-2.5 text-left transition-colors duration-150 ${
        isActive ? 'bg-pen-tint' : 'hover:bg-paper-100'
      }`}
    >
      <span
        className={`font-mono text-xs font-semibold ${isActive ? 'text-pen-dark' : 'text-ink-600/60'}`}
      >
        {String(chapter.chapterNumber).padStart(2, '0')}
      </span>
      <span
        className={`min-w-0 max-w-[70%] truncate text-sm font-medium ${
          isActive ? 'text-pen-dark' : 'text-ink-800'
        }`}
      >
        {chapter.title}
      </span>
      <span className="toc-dots" />
      {chapter.pageStart && (
        <span className="shrink-0 font-mono text-xs text-ink-600/50">p.{chapter.pageStart}</span>
      )}
    </button>
  )
}
