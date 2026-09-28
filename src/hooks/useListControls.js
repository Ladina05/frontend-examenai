import { useMemo, useState } from 'react'

export default function useListControls(items, options) {
  var getSearchText = (options && options.getSearchText) || function (item) {
    return String(item)
  }

  var [search, setSearch] = useState('')
  var [pageSize, setPageSize] = useState(10)
  var [page, setPage] = useState(1)

  var filtered = useMemo(
    function () {
      var query = search.trim().toLowerCase()
      if (!query) return items || []
      return (items || []).filter(function (item) {
        return getSearchText(item).toLowerCase().includes(query)
      })
    },
    [items, search, getSearchText],
  )

  var totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  var safePage = Math.min(page, totalPages)

  var pageItems = useMemo(
    function () {
      var start = (safePage - 1) * pageSize
      return filtered.slice(start, start + pageSize)
    },
    [filtered, safePage, pageSize],
  )

  function updateSearch(value) {
    setSearch(value)
    setPage(1)
  }

  function updatePageSize(value) {
    setPageSize(Number(value) || 10)
    setPage(1)
  }

  return {
    search: search,
    setSearch: updateSearch,
    pageSize: pageSize,
    setPageSize: updatePageSize,
    page: safePage,
    setPage: setPage,
    totalPages: totalPages,
    totalItems: filtered.length,
    pageItems: pageItems,
  }
}
