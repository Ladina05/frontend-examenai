export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="index-card flex flex-col items-center gap-3 px-8 py-14 text-center">
      {Icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-paper-100 text-ink-600">
          <Icon size={22} strokeWidth={1.8} />
        </div>
      )}
      <h3 className="font-display text-lg font-semibold text-ink-900">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm leading-relaxed text-ink-600">{description}</p>
      )}
      {action}
    </div>
  )
}
