import { Link } from '@tanstack/react-router'

export function NotFound({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-full flex items-center justify-center bg-gray-950 text-gray-200 p-6">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4 text-yellow-400">404 Not Found</h1>
        <p className="text-gray-400 mb-6">
          {children || 'The page you are looking for does not exist.'}
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
