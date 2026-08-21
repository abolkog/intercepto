import { Rule } from '@/types/rule';

type RulesTableProps = {
  rules?: Rule[];
  onSelectRule: (rule: Rule) => void;
  onDeleteRule: (id: string) => void;
};

export default function RulesTable({ rules, onSelectRule, onDeleteRule }: RulesTableProps) {
  return (
    <table className="relative min-w-full divide-y divide-white/15">
      <thead>
        <tr>
          <th scope="col" className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-white sm:pl-0">
            Rule
          </th>
          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
            Status
          </th>
          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
            Created
          </th>
          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
            Updated
          </th>
          <th scope="col" className="py-3.5 pr-4 pl-3 sm:pr-0">
            <span className="sr-only">Delete</span>
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/10">
        {rules?.map(rule => (
          <tr key={rule.id}>
            <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-white sm:pl-0">
              <button
                className="text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
                onClick={() => onSelectRule(rule)}
              >
                {rule.name}
              </button>
            </td>
            <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-400">{rule.enabled}</td>
            <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-400">{rule.createdAt}</td>
            <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-400">{rule.updatedAt}</td>
            <td className="py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-0">
              <button onClick={() => onDeleteRule(rule.id)} className="text-red-400 hover:text-red-300 cursor-pointer">
                Delete<span className="sr-only">, {rule.name}</span>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
