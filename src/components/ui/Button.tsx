import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'danger';

const BASE =
  'inline-flex items-center justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold cursor-pointer ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 ' +
  'disabled:opacity-50 disabled:cursor-not-allowed';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-purple-500 text-white hover:bg-purple-400',
  secondary: 'bg-white/10 text-white hover:bg-white/20',
  danger: 'bg-red-500 text-white hover:bg-red-400',
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export default function Button({ variant = 'primary', type = 'button', className = '', ...props }: ButtonProps) {
  return <button type={type} className={`${BASE} ${VARIANTS[variant]} ${className}`} {...props} />;
}
