export default function GlobalLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <div className="border-brand-600 h-10 w-10 animate-spin rounded-full border-4 border-t-transparent" />
        <p className="text-sm font-medium text-gray-500">Chargement...</p>
      </div>
    </div>
  )
}
