import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import RuleForm from './RuleForm';
import type { Rule } from '@/types/rule';

function renderForm() {
  const onSave = vi.fn();
  const onCancel = vi.fn();

  render(<RuleForm onSave={onSave} onCancel={onCancel} />);

  return { onSave, onCancel };
}

describe('RuleForm', () => {
  test('shows required field validation errors', () => {
    renderForm();

    fireEvent.click(screen.getByRole('button', { name: 'Save rule' }));
    expect(screen.getByText('Rule name is required')).toBeTruthy();

    fireEvent.change(screen.getByLabelText('Rule Name'), { target: { value: 'My rule' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save rule' }));

    expect(screen.getByText('URL match is required.')).toBeTruthy();
  });

  test('validates status code range', () => {
    renderForm();

    fireEvent.change(screen.getByLabelText('Rule Name'), { target: { value: 'My rule' } });
    fireEvent.change(screen.getByLabelText('URL contains'), { target: { value: '/cart' } });
    fireEvent.change(screen.getByLabelText('Status code'), { target: { value: '200.5' } });

    const form = screen.getByRole('button', { name: 'Save rule' }).closest('form');
    if (!form) throw new Error('Expected RuleForm submit form to exist');
    fireEvent.submit(form);

    expect(screen.getByText('Status code must be an integer between 100 and 599.')).toBeTruthy();
  });

  test('submits trimmed data when valid', () => {
    const { onSave } = renderForm();

    fireEvent.change(screen.getByLabelText('Rule Name'), { target: { value: '  Mock cart  ' } });
    fireEvent.change(screen.getByLabelText('URL contains'), { target: { value: '/cart' } });
    fireEvent.change(screen.getByLabelText('Status code'), { target: { value: '201' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save rule' }));

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

  test('formats valid JSON in response body', () => {
    renderForm();

    const responseBody = screen.getByLabelText('Response body') as HTMLTextAreaElement;
    fireEvent.change(responseBody, { target: { value: '{"ok":true,"items":[1,2]}' } });
    fireEvent.click(screen.getByRole('button', { name: 'Format JSON' }));

    expect(responseBody.value).toBe(JSON.stringify({ ok: true, items: [1, 2] }, null, 2));
  });

  test('shows warning when response body is invalid JSON', () => {
    renderForm();

    fireEvent.change(screen.getByLabelText('Response body'), { target: { value: '{oops' } });
    fireEvent.click(screen.getByRole('button', { name: 'Format JSON' }));

    expect(screen.getByText('Response body is not valid JSON, so it will be sent as plain text.')).toBeTruthy();
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

    render(<RuleForm initialRule={initialRule} onSave={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByText('Edit rule')).toBeTruthy();
    expect((screen.getByLabelText('Rule Name') as HTMLInputElement).value).toBe('Existing rule');
  });
});
