import { validateGrowthRequest } from './validation.js';

function getFormData(form) {
  const getFieldValue = (fieldName) => {
    const field = form.querySelector(`[name="${fieldName}"]`);
    return field?.value || '';
  };

  return {
    name: getFieldValue('name'),
    email: getFieldValue('email'),
    company: getFieldValue('company'),
    website: getFieldValue('website'),
    primaryGoal: getFieldValue('primaryGoal'),
    message: getFieldValue('message')
  };
}

function clearErrors(form) {
  form.querySelectorAll('.field-error').forEach((errorNode) => {
    errorNode.textContent = '';
  });
}

function renderErrors(form, errors) {
  clearErrors(form);
  Object.entries(errors).forEach(([field, message]) => {
    const errorNode = form.querySelector(`#error-${field}`);
    if (errorNode) {
      errorNode.textContent = message;
    }
  });
}

function renderStatus(statusElement, message, isError = false) {
  statusElement.textContent = message;
  statusElement.style.color = isError ? '#b91c1c' : '#111827';
}

export async function submitGrowthRequest(form, submitButton, statusElement) {
  const formData = getFormData(form);
  const { valid, errors } = validateGrowthRequest(formData);

  clearErrors(form);
  renderStatus(statusElement, '', false);

  if (!valid) {
    renderErrors(form, errors);
    return false;
  }

  submitButton.disabled = true;

  let response;
  try {
    response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
  } catch (error) {
    renderStatus(statusElement, 'Network error sending request.', true);
    submitButton.disabled = false;
    return false;
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const message = payload.error || payload.message || 'Submission failed. Please try again.';
    renderStatus(statusElement, message, true);
    submitButton.disabled = false;
    return false;
  }

  const payload = await response.json().catch(() => ({}));
  renderStatus(statusElement, payload.message || 'Your request has been sent.', false);
  form.reset();
  submitButton.disabled = false;
  return true;
}

export function setupGrowthRequestForm() {
  const form = document.getElementById('growth-request-form');
  const submitButton = document.getElementById('submit-button');
  const statusElement = document.getElementById('form-status');

  if (!form || !submitButton || !statusElement) {
    return;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    submitGrowthRequest(form, submitButton, statusElement);
  });
}

setupGrowthRequestForm();
