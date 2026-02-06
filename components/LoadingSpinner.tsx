import clsx from "clsx"

interface LoadingSpinnerProps {
  className?: string
}

export default function LoadingSpinner({ className }: LoadingSpinnerProps) {
  return (
    <div
      className={clsx(
        "animate-spin rounded-full border-4 border-blue-600 border-t-transparent",
        className
      )}
      aria-label="Laden"
      role="status"
    />
  )
}
