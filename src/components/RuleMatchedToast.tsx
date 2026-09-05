type RuleMatchedToastProps = {
  ruleName: string;
  method: string;
  logoUrl: string;
  url: string;
};

export default function RuleMatchedToast({ ruleName, method, url, logoUrl }: RuleMatchedToastProps) {
  return (
    <div className="flex flex-col w-full ">
      <h3 className="text-sm flex items-center gap-2">
        <img src={logoUrl} alt="Intercepto" className="h-8 w-8" />
        <span className="ml-2 font-bold">Intercepto</span>
      </h3>

      <div className="pl-5 mt-2">
        <p className="mt-0.5 truncate text-sm  text-white">Rule Name: {ruleName}</p>
        <p className="mt-0.5 truncate text-sm  text-white">
          {method} {url}
        </p>
      </div>
    </div>
  );
}
