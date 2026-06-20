interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
}

const variants = {
  primary:
    'bg-sky-500 text-white hover:bg-sky-400 disabled:bg-slate-600 disabled:cursor-not-allowed',
  secondary:
    'border border-slate-600 text-slate-200 hover:border-sky-400 hover:text-sky-300 disabled:opacity-50',
}

export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
