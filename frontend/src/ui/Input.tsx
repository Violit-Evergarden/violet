import { forwardRef } from 'react'
import { cn } from '../lib/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        'w-full rounded-xl border border-app bg-surface px-4 py-2.5 text-sm text-[var(--color-text)] placeholder:text-subtle transition',
        'focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-brand)_25%,transparent)] focus:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        invalid && 'border-[var(--color-error)] focus:border-[var(--color-error)]',
        className,
      )}
      aria-invalid={invalid || undefined}
      {...props}
    />
  )
})

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean
}

export function Textarea({ className, invalid, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        'w-full resize-y rounded-xl border border-app bg-surface px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-subtle transition',
        'focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-brand)_25%,transparent)] focus:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        invalid && 'border-[var(--color-error)]',
        className,
      )}
      aria-invalid={invalid || undefined}
      {...props}
    />
  )
}

interface SearchInputProps extends Omit<InputProps, 'type'> {
  onShortcutHint?: boolean
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput({ className, onShortcutHint, ...props }, ref) {
    return (
      <div className="relative">
        <Input
          ref={ref}
          type="search"
          autoComplete="off"
          className={cn('pr-12', className)}
          {...props}
        />
        {onShortcutHint && (
          <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-app bg-[var(--color-border-subtle)] px-1.5 py-0.5 text-xs text-subtle">
            /
          </kbd>
        )}
      </div>
    )
  },
)
