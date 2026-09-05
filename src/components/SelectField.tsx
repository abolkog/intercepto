import { type SelectHTMLAttributes } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

type SelectOption = {
  label: string;
  value: string;
};

interface SelectFieldProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id' | 'onChange'> {
  id: string;
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
}

export function SelectField({ id, label, value, options, onChange, className, ...selectProps }: SelectFieldProps) {
  return (
    <div className="space-y-2 py-4 ">
      <label htmlFor={id} className="block text-sm font-medium text-gray-400">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          name={id}
          value={value}
          onChange={e => onChange(e.target.value)}
          className={`block appearance-none w-full rounded-md bg-white/5 px-4 py-3 text-base text-white outline-1 -outline-offset-1 outline-white/10 focus:outline-purple-500 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-purple-600 ${className ?? ''}`}
          {...selectProps}
        >
          {options.map(option => (
            <option key={option.value} value={option.value} className="bg-gray-900 text-white">
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-gray-500"
        />
      </div>
    </div>
  );
}
