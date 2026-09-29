import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import ImportExportPage from './ImportExportPage';
import { importRules } from '@/utils/ruleTransfer';
import { clearRules } from '@/utils/ruleStorage';
import { clearGroups } from '@/utils/groupsStorage';

const mockNavigate = vi.fn();

vi.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('@/utils/ruleTransfer', () => ({
  exportRules: vi.fn(),
  importRules: vi.fn(),
}));

vi.mock('@/utils/ruleStorage', () => ({
  clearRules: vi.fn(),
}));

vi.mock('@/utils/groupsStorage', () => ({
  clearGroups: vi.fn(),
}));

function uploadJsonFile() {
  const input = screen.getByLabelText('Upload a file') as HTMLInputElement;
  const file = new File(['{"rules":[]}'], 'rules.json', { type: 'application/json' });
  fireEvent.change(input, { target: { files: [file] } });
  return file;
}

describe('ImportExportPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(importRules).mockResolvedValue({ imported: [], errors: [] });
    vi.mocked(clearRules).mockResolvedValue(undefined);
    vi.mocked(clearGroups).mockResolvedValue(undefined);
  });

  it('renders override toggle as disabled by default', () => {
    render(<ImportExportPage />);

    const overrideToggle = screen.getByRole('checkbox', { name: /override everything/i }) as HTMLInputElement;
    expect(overrideToggle.checked).toBe(false);
  });

  it('imports directly when override toggle is disabled', async () => {
    render(<ImportExportPage />);

    const file = uploadJsonFile();
    fireEvent.click(screen.getByRole('button', { name: 'Import Rules' }));

    await waitFor(() => expect(importRules).toHaveBeenCalledWith(file));
    expect(clearRules).not.toHaveBeenCalled();
    expect(clearGroups).not.toHaveBeenCalled();
  });

  it('asks for confirmation first when override toggle is enabled', async () => {
    render(<ImportExportPage />);

    const file = uploadJsonFile();
    fireEvent.click(screen.getByRole('checkbox', { name: /override everything/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Import Rules' }));

    expect(screen.getByRole('heading', { name: 'Confirm override import' })).toBeTruthy();
    expect(importRules).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Delete everything and import' }));

    await waitFor(() => expect(importRules).toHaveBeenCalledWith(file));
  });

  it('clears all existing rules and groups before import after override confirmation', async () => {
    render(<ImportExportPage />);

    uploadJsonFile();
    fireEvent.click(screen.getByRole('checkbox', { name: /override everything/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Import Rules' }));
    fireEvent.click(screen.getByRole('button', { name: 'Delete everything and import' }));

    await waitFor(() => {
      expect(clearRules).toHaveBeenCalledTimes(1);
      expect(clearGroups).toHaveBeenCalledTimes(1);
      expect(importRules).toHaveBeenCalledTimes(1);
    });
  });
});
