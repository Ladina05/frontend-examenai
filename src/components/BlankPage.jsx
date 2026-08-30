export default function BlankPage({ icon: Icon, eyebrow, title }) {
  return (
    <div className="space-y-10">
      <header>
        <p className="font-mono text-xs uppercase tracking-widest text-pen">{eyebrow}</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900">{title}</h1>
      </header>

      <div className="flex min-h-[50vh] items-center justify-center rounded-2xl border border-dashed border-ink-900/15">
        <Icon size={40} strokeWidth={1.2} className="text-ink-900/15" />
      </div>
    </div>
  )
}
