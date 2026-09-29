type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  name?: string;
  ariaLabel?: string;
};

export default function Toggle({ checked, onChange, name = 'toggle', ariaLabel = 'Toggle' }: ToggleProps) {
  return (
    <div className="group relative inline-flex w-11 shrink-0 rounded-full bg-white/5 p-0.5 inset-ring inset-ring-white/10 outline-offset-2 outline-purple-500 transition-colors duration-200 ease-in-out has-checked:bg-purple-500 has-focus-visible:outline-2">
      <span className="size-5 rounded-full bg-white shadow-xs ring-1 ring-gray-900/5 transition-transform duration-200 ease-in-out group-has-checked:translate-x-5"></span>
      <input
        type="checkbox"
        name={name}
        aria-label={ariaLabel}
        className="absolute inset-0 size-full appearance-none focus:outline-hidden"
        checked={checked}
        onChange={event => onChange(event.target.checked)}
      />
    </div>
  );
}
