import { addGroup, getGroups, onGroupsChanged, removeGroup, renameGroup } from './groupsStorage';
import { chromeMock } from '../test-utils/chromeMock';

beforeEach(() => {
  chromeMock.__reset();
});

describe('ruleGroupsStorage', () => {
  it('returns an empty list by default', async () => {
    expect(await getGroups()).toEqual([]);
  });

  it('adds and deduplicates groups by name (case-insensitive)', async () => {
    await addGroup('Checkout');
    await addGroup('checkout');

    expect(await getGroups()).toEqual([{ name: 'Checkout', description: undefined }]);
  });

  it('renames groups and preserves description when provided', async () => {
    await addGroup('Checkout', 'Checkout APIs');
    await renameGroup('Checkout', 'Payments', 'Payment APIs');

    expect(await getGroups()).toEqual([{ name: 'Payments', description: 'Payment APIs' }]);
  });

  it('removes groups', async () => {
    await addGroup('Catalog');
    await removeGroup('Catalog');

    expect(await getGroups()).toEqual([]);
  });

  it('notifies subscribers when groups change', async () => {
    const callback = vi.fn();
    const unsubscribe = onGroupsChanged(callback);

    await addGroup('Checkout');

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback.mock.calls[0][0]).toEqual([{ name: 'Checkout', description: undefined }]);

    unsubscribe();
    await addGroup('Catalog');
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
