import type { ReactNode } from 'react';

type Variant = 'error' | 'success' | 'info' | 'warning';

const variantClasses: Record<Variant, string> = {
  error: 'bg-red-50 text-red-700 border-red-200',
  success: 'bg-green-50 text-green-700 border-green-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
};

interface AlertProps {
  variant?: Variant;
  children: ReactNode;
}

export function Alert({ variant = 'info', children }: AlertProps) {
  return (
    <div role="alert" className={`rounded-lg border px-4 py-3 text-sm ${variantClasses[variant]}`}>
      {children}
    </div>
  );
}
