import {
  ErrorComponent,
  ErrorComponentProps,
  Link,
  rootRouteId,
} from '@tanstack/react-router'

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const isProd = import.meta.env.PROD
      const message = error instanceof Error ? error.message : undefined

  console.error(error)

  return (
    <div className="min-h-full flex items-center justify-center bg-gray-950 text-gray-200 p-6">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-400">Something went wrong</h1>
        <p className="text-gray-400 mb-6">
          {isProd
            ? 'An unexpected error occurred.'
            : message || 'Unknown error'}
        </p>
        <Link
          to="/"
          className="inline-block px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
        >
          Go back home
        </Link>
      </div>
    </div>
  )
}
