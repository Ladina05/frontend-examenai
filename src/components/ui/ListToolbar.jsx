import { Search, ChevronLeft, ChevronRight } from 'lucide-react'

var PAGE_SIZES = [5, 10, 20]

export default function ListToolbar({
  search,
  onSearchChange,
  searchPlaceholder = 'Rechercher…',
  pageSize,
  onPageSizeChange,
  page,
  totalPages,
  totalItems,
  onPageChange,
}) {
  var from = totalItems === 0 ? 0 : (page - 1) * pageSize + 1
  var to = Math.min(page * pageSize, totalItems)

  return (
    <div className="flex flex-col gap-3 border-b border-ink-900/10 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
      <div className="relative min-w-0 w-full sm:max-w-xs sm:flex-1">
        <Search
          size={15}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
        />
        <input
          type="search"
          value={search}
          onChange={function (e) {
            onSearchChange(e.target.value)
          }}
          placeholder={searchPlaceholder}
          className="field-input w-full py-2 pl-9 text-sm"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 sm:justify-end sm:gap-3">
        <label className="flex items-center gap-2 text-xs text-ink-600">
          <span className="whitespace-nowrap">Par page</span>
          <select
            value={pageSize}
            onChange={function (e) {
              onPageSizeChange(e.target.value)
            }}
            className="field-select-sm rounded-lg border border-ink-900/10 bg-white py-1.5 pl-2 text-xs font-semibold text-ink-800"
          >
            {PAGE_SIZES.map(function (size) {
              return (
                <option key={size} value={size}>
                  {size}
                </option>
              )
            })}
          </select>
        </label>

        <div className="flex items-center gap-1.5">
          <p className="text-xs text-ink-600/70">
            {from}–{to}/{totalItems}
          </p>
          <button
            type="button"
            className="icon-btn"
            disabled={page <= 1}
            aria-label="Page précédente"
            onClick={function () {
              onPageChange(page - 1)
            }}
          >
            <ChevronLeft size={16} />
          </button>
          <span className="min-w-[3rem] text-center text-xs font-semibold text-ink-700">
            {page}/{totalPages}
          </span>
          <button
            type="button"
            className="icon-btn"
            disabled={page >= totalPages}
            aria-label="Page suivante"
            onClick={function () {
              onPageChange(page + 1)
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
