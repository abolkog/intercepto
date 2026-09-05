import { type InputHTMLAttributes } from 'react';

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'onChange'> {
  id: string;
  label: string;
  value: string | number;
  variant?: 'default' | 'secondary';
  onChange: (value: string) => void;
}

export function TextField({
  id,
  label,
  value,
  onChange,
  className,
  variant = 'default',
  ...inputProps
}: TextFieldProps) {
  const textColor = variant === 'default' ? 'text-white' : 'text-purple-300';
  return (
    <div className="space-y-2 py-4 ">
      <label htmlFor={id} className="block text-sm font-medium text-gray-400">
        {label}
      </label>
      <input
        id={id}
        name={id}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`block w-full rounded-md bg-white/5 px-4 py-3 text-base ${textColor} outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-purple-500 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-purple-600 ${className ?? ''}`}
        {...inputProps}
      />
    </div>
  );
}
