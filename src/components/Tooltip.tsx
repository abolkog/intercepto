type TooltipProps = React.PropsWithChildren & {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
};

export default function Tooltip({ content, position = 'top', children }: TooltipProps) {
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative group inline-block">
      {children}

      <div
        className={`absolute z-50 pointer-events-none scale-95 opacity-0 
          group-hover:scale-100 group-hover:opacity-100 
          transition-all duration-200 ease-out
          bg-gray-800 text-white text-xs px-2.5 py-1.5 rounded shadow-lg whitespace-nowrap
          ${positionClasses[position]}`}
      >
        {content}
      </div>
    </div>
  );
}
