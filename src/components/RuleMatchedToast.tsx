type RuleMatchedToastProps = {
  ruleName: string;
  method: string;
  logoUrl: string;
};

export default function RuleMatchedToast({ ruleName, method, logoUrl }: RuleMatchedToastProps) {
  return (
    <div className="flex flex-col w-full">
      <h3 className="text-sm font-semibold flex items-center gap-2">
        <img src={logoUrl} alt="Intercepto" className="h-8 w-8" />
        <span className="ml-2 font-bold">Intercepto</span>
      </h3>

      <div className="pl-5 mt-2">
        <p className="text-sm">Rule matched</p>
        <div className="mt-2">
          <p className="mt-0.5 truncate text-sm font-semibold text-white">Rule Name: {ruleName}</p>
          <p className="mt-0.5 truncate text-sm font-semibold text-white">Http Method: {method}</p>
        </div>
      </div>
    </div>
  );
}
