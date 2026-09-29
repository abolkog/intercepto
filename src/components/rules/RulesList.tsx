import RulesGroupSection from '@/components/rules/RulesGroupSection';
import type { Rule, Group } from '@/types/rule';

type RulesListProps = {
  rules?: Rule[];
  groups?: Group[];
  onRenameGroup?: (groupName: string) => void;
  onMoveGroupRules?: (groupName: string) => void;
  onDeleteGroup?: (groupName: string) => void;
  onToggleGroupEnabled?: (groupName: string, enabled: boolean) => void;
  onToggleGroupNotifications?: (groupName: string, showNotifications: boolean) => void;
  onSelectRule: (rule: Rule) => void;
  onToggleRule: (rule: Rule, status: boolean) => void;
  onDeleteRule?: (id: string) => void;
  onDuplicateRule?: (rule: Rule) => void;
  showMenu?: boolean;
};

const UNGROUPED_KEY = '__ungrouped__';

export default function RulesList({
  rules,
  groups,
  onRenameGroup,
  onMoveGroupRules,
  onDeleteGroup,
  onToggleGroupEnabled,
  onToggleGroupNotifications,
  onSelectRule,
  onDeleteRule,
  onToggleRule,
  onDuplicateRule,
  showMenu = true,
}: RulesListProps) {
  const resolvedRules = rules ?? [];
  const resolvedGroups = groups ?? [];

  const groupDescriptions = new Map<string, string>();
  const groupedRules = resolvedRules.reduce<Record<string, Rule[]>>((grouped, rule) => {
    const groupName = rule.group?.trim() || UNGROUPED_KEY;
    grouped[groupName] ??= [];
    grouped[groupName].push(rule);
    return grouped;
  }, {});

  for (const group of resolvedGroups) {
    const normalizedName = group.name.trim();
    if (!normalizedName) continue;

    groupedRules[normalizedName] ??= [];
    if (group.description?.trim()) {
      groupDescriptions.set(normalizedName, group.description.trim());
    }
  }

  const groupNames = Object.keys(groupedRules).sort((a, b) => {
    if (a === UNGROUPED_KEY) return 1;
    if (b === UNGROUPED_KEY) return -1;
    return a.localeCompare(b);
  });

  return (
    <div>
      {groupNames.map(groupName => {
        return (
          <RulesGroupSection
            key={groupName}
            groupName={groupName}
            isUngrouped={groupName === UNGROUPED_KEY}
            description={groupDescriptions.get(groupName)}
            rules={groupedRules[groupName]}
            showMenu={showMenu}
            onSelectRule={onSelectRule}
            onToggleRule={onToggleRule}
            onDeleteRule={onDeleteRule}
            onDuplicateRule={onDuplicateRule}
            onRenameGroup={onRenameGroup}
            onMoveGroupRules={onMoveGroupRules}
            onDeleteGroup={onDeleteGroup}
            onToggleGroupEnabled={onToggleGroupEnabled}
            onToggleGroupNotifications={onToggleGroupNotifications}
          />
        );
      })}
    </div>
  );
}
