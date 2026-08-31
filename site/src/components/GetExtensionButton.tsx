import { CHROME_URl } from '@/constants';
import { ArrowRightIcon } from '@heroicons/react/24/solid';

type GetExtensionButtonProps = {
  label: string;
  showIcon?: boolean;
};

export default function GetExtensionButton({ label, showIcon = false }: GetExtensionButtonProps) {
  return (
    <a
      href={CHROME_URl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-2 rounded-lg bg-[#a855f7] px-4 py-2.5 text-[13px] font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#b66afa]"
    >
      {label}
      {showIcon && <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" />}
    </a>
  );
}
