import Header from '@/components/Header';
import RulesTable from '@/components/RulesTable';
import useGetRules from '@/hooks/useGetRules';

export default function OptionsPage() {
  const { rules } = useGetRules();
  return (
    <div className="min-h-screen bg-ink text-slate-100">
      <Header />
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-base font-semibold text-white">Rules</h1>
              <p className="mt-2 text-sm text-gray-300">Manage existing rules or create a new one.</p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <button
                type="button"
                className="block rounded-md bg-indigo-500 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                New Rule
              </button>
            </div>
          </div>
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <RulesTable rules={rules} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
