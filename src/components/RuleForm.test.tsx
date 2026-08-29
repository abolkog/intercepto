import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import RuleForm from './RuleForm';
import type { Rule } from '@/types/rule';
import { Dialog } from '@headlessui/react';

function renderForm(initialRule?: Rule) {
  const onSave = vi.fn();
  const onCancel = vi.fn();

  render(
    <Dialog open onClose={vi.fn()}>
      <RuleForm initialRule={initialRule} onSave={onSave} onCancel={onCancel} />
    </Dialog>,
  );

  return { onSave, onCancel };
}
const getSaveButton = () => screen.getByRole('button', { name: 'Save Rule' });

describe('RuleForm', () => {
  test('shows required field validation errors', () => {
    renderForm();

    fireEvent.click(getSaveButton());
    expect(screen.getByText('Rule name is required')).toBeTruthy();

    fireEvent.change(screen.getByLabelText('Rule Name'), { target: { value: 'My rule' } });
    fireEvent.click(getSaveButton());

    expect(screen.getByText('There was error processing your submission')).toBeTruthy();
    expect(screen.getByText('URL match is required')).toBeTruthy();
  });

  test('validates status code range', () => {
    renderForm();

    fireEvent.change(screen.getByLabelText('Rule Name'), { target: { value: 'My rule' } });
    fireEvent.change(screen.getByLabelText('URL Contains'), { target: { value: '/cart' } });
    fireEvent.change(screen.getByLabelText('Status Code'), { target: { value: '200.5' } });

    const form = getSaveButton().closest('form');
    if (!form) throw new Error('Expected RuleForm submit form to exist');
    fireEvent.submit(form);

    expect(screen.getByText('Status code must be an integer between 100 and 599.')).toBeTruthy();
  });

  test('submits trimmed data when valid', () => {
    const { onSave } = renderForm();

    fireEvent.change(screen.getByLabelText('Rule Name'), { target: { value: '  Mock cart  ' } });
    fireEvent.change(screen.getByLabelText('URL Contains'), { target: { value: '/cart' } });
    fireEvent.change(screen.getByLabelText('Status Code'), { target: { value: '201' } });
    fireEvent.click(getSaveButton());

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Mock cart',
        urlMatch: '/cart',
        statusCode: 201,
      }),
    );
  });

  test('calls onCancel when Cancel is clicked', () => {
    const { onCancel } = renderForm();

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  test('renders in edit mode when initialRule is provided', () => {
    const initialRule: Rule = {
      id: 'r-1',
      name: 'Existing rule',
      enabled: true,
      showNotifications: true,
      urlMatch: '/orders',
      method: 'GET',
      statusCode: 200,
      responseBody: '{}',
      createdAt: 1,
      updatedAt: 1,
    };

    renderForm(initialRule);

    expect(screen.getByText('Edit rule')).toBeTruthy();
    expect((screen.getByLabelText('Rule Name') as HTMLInputElement).value).toBe('Existing rule');
  });
});
