import { beforeEach, describe, expect, it, vi } from 'vitest';
import { submitGrowthRequest } from './form.js';

function buildForm() {
  const form = document.createElement('form');

  const mapField = (tag, name, value) => {
    const field = document.createElement(tag);
    field.name = name;
    field.value = value;
    form.appendChild(field);
    return field;
  };

  mapField('input', 'name', 'Alyssa');
  mapField('input', 'email', 'alyssa@example.com');
  mapField('input', 'company', 'FlyRank');
  mapField('input', 'website', 'https://flyrank.ai');

  const primaryGoal = document.createElement('select');
  primaryGoal.name = 'primaryGoal';
  const option = document.createElement('option');
  option.value = 'increase-traffic';
  option.textContent = 'Increase organic traffic';
  primaryGoal.appendChild(option);
  primaryGoal.value = 'increase-traffic';
  form.appendChild(primaryGoal);

  const message = document.createElement('textarea');
  message.name = 'message';
  message.value = 'Grow my organic traffic.';
  form.appendChild(message);

  ['name', 'email', 'company', 'website', 'primaryGoal', 'message'].forEach((field) => {
    const errorNode = document.createElement('p');
    errorNode.className = 'field-error';
    errorNode.id = `error-${field}`;
    form.appendChild(errorNode);
  });

  return form;
}

function createStatusElement() {
  const status = document.createElement('p');
  status.id = 'form-status';
  return status;
}

describe('submitGrowthRequest', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('shows invalid email rejection from validation', async () => {
    const form = buildForm();
    form.querySelector('[name="email"]').value = 'bad-email';
    const submitButton = document.createElement('button');
    const statusElement = createStatusElement();

    const result = await submitGrowthRequest(form, submitButton, statusElement);

    expect(result).toBe(false);
    expect(statusElement.textContent).toBe('');
    expect(form.querySelector('#error-email')?.textContent).toBe('Enter a valid work email.');
  });

  it('disables submit button during async submission', async () => {
    const form = buildForm();
    const submitButton = document.createElement('button');
    const statusElement = createStatusElement();
    const pendingResponse = new Promise((resolve) => {
      setTimeout(() => resolve({ ok: true, json: async () => ({ message: 'Request received.' }) }), 10);
    });

    global.fetch = vi.fn(() => pendingResponse);

    const promise = submitGrowthRequest(form, submitButton, statusElement);

    expect(submitButton.disabled).toBe(true);

    const success = await promise;
    expect(success).toBe(true);
    expect(submitButton.disabled).toBe(false);
  });

  it('submits successfully and resets the form', async () => {
    const form = buildForm();
    const submitButton = document.createElement('button');
    const statusElement = createStatusElement();

    const response = { ok: true, json: async () => ({ message: 'Request received.' }) };
    global.fetch = vi.fn(() => Promise.resolve(response));
    const resetSpy = vi.spyOn(form, 'reset');

    const result = await submitGrowthRequest(form, submitButton, statusElement);

    expect(result).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith('/api/contact', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }));
    expect(statusElement.textContent).toBe('Request received.');
    expect(resetSpy).toHaveBeenCalled();
  });
});
