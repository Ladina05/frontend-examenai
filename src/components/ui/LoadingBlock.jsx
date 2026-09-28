export default function LoadingBlock({ label = 'Chargement…' }) {
  return (
    <div className="surface flex flex-col items-center gap-4 py-14">
      <div className="flex w-full max-w-sm flex-col gap-2.5 px-4">
        <div className="h-3 animate-pulse rounded-full bg-paper-200" />
        <div className="h-3 w-4/5 animate-pulse rounded-full bg-paper-200" />
        <div className="h-3 w-3/5 animate-pulse rounded-full bg-paper-200" />
      </div>
      <p className="text-sm text-ink-600">{label}</p>
    </div>
  )
}
