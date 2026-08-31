import GithubIcon from '@/assets/github_white.svg';
import { GITHUB_REPO } from '@/constants';

type GithubButtonProps = {
  label: string;
};

export default function GithubButton({ label }: GithubButtonProps) {
  return (
    <a
      href={GITHUB_REPO}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 rounded-lg border border-white/[.14] px-4 py-2.5 text-[13px] font-semibold text-slate-300 transition hover:bg-white/.06"
    >
      <img src={GithubIcon} alt="Github Repo" className="h-4 w-auto " />
      {label}
    </a>
  );
}
