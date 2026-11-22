type AdminPaginationProps = {
  safePage: number
  totalPages: number
  updatePage: (page: number) => void
}

export function AdminPagination({
  safePage,
  totalPages,
  updatePage,
}: AdminPaginationProps) {
  if (totalPages === 0) return null

  return (
    <div className="mt-4 flex items-center justify-between">
      <button
        type="button"
        onClick={() => updatePage(safePage - 1)}
        disabled={safePage === 1}
        className="rounded-md border border-slate-300 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Previous
      </button>
      <label className="flex items-center gap-2">
        Page
        <select
          value={safePage}
          onChange={(event) => updatePage(Number(event.target.value))}
          className="rounded-md border border-slate-300 px-2 py-1"
        >
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (pageNumber) => (
              <option key={pageNumber} value={pageNumber}>
                {pageNumber}
              </option>
            ),
          )}
        </select>
        <span>of {totalPages}</span>
      </label>
      <button
        type="button"
        onClick={() => updatePage(safePage + 1)}
        disabled={safePage === totalPages}
        className="rounded-md border border-slate-300 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </div>
  )
}
