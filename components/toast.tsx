"use client"
import { X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { memo } from "react"

// Memoize the individual toast component
const Toast = memo(
  ({
    toast,
    onDismiss,
  }: {
    toast: { id: string; title: string; description?: string; variant?: string }
    onDismiss: (id: string) => void
  }) => (
    <div
      className={cn(
        "flex items-center justify-between w-full max-w-sm px-4 py-3 rounded-lg shadow-lg",
        "bg-white dark:bg-slate-800 border",
        toast.variant === "destructive"
          ? "border-red-500 dark:border-red-600"
          : "border-slate-200 dark:border-slate-700",
      )}
    >
      <div className="flex-1 mr-2">
        <h3
          className={cn(
            "font-medium",
            toast.variant === "destructive" ? "text-red-600 dark:text-red-400" : "text-slate-900 dark:text-slate-100",
          )}
        >
          {toast.title}
        </h3>
        {toast.description && <p className="text-sm text-slate-500 dark:text-slate-400">{toast.description}</p>}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
      >
        <X className="w-4 h-4 text-slate-500" />
      </button>
    </div>
  ),
)

Toast.displayName = "Toast"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  // Use a more efficient rendering approach
  return (
    <div className="fixed top-0 right-0 z-50 flex flex-col items-end p-4 space-y-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex items-center justify-between w-full max-w-sm px-4 py-3 rounded-lg shadow-lg",
            "bg-white dark:bg-slate-800 border",
            toast.variant === "destructive"
              ? "border-red-500 dark:border-red-600"
              : "border-slate-200 dark:border-slate-700",
          )}
        >
          <div className="flex-1 mr-2">
            <h3
              className={cn(
                "font-medium",
                toast.variant === "destructive"
                  ? "text-red-600 dark:text-red-400"
                  : "text-slate-900 dark:text-slate-100",
              )}
            >
              {toast.title}
            </h3>
            {toast.description && <p className="text-sm text-slate-500 dark:text-slate-400">{toast.description}</p>}
          </div>
          <button
            onClick={() => dismiss(toast.id)}
            className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      ))}
    </div>
  )
}
