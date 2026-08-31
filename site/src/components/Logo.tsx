import appLogo from '@/assets/logo.svg';

export default function Logo({ compact = true }) {
  return (
    <div className="flex items-center gap-2">
      <img src={appLogo} alt="Intercepto" className="h-8 w-auto" />
      {!compact && <span className="font-display text-2xl text-white font-semibold tracking-[-.02em]">Intercepto</span>}
    </div>
  );
}
