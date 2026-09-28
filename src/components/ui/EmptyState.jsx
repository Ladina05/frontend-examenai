export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex w-full flex-col items-center gap-3 rounded-2xl border border-dashed border-ink-900/15 bg-white px-6 py-14 text-center sm:px-8 sm:py-16">
      {Icon && (
        <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-pen-tint text-pen sm:h-14 sm:w-14">
          <Icon size={22} strokeWidth={1.8} />
        </div>
      )}
      <h3 className="text-lg font-semibold tracking-tight text-ink-900">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm leading-relaxed text-ink-600">{description}</p>
      )}
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  )
}
