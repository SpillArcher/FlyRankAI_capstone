const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const websitePattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/i;

export const primaryGoalOptions = [
  { value: 'increase-traffic', label: 'Increase organic traffic' },
  { value: 'expand-localization', label: 'Expand localization efforts' },
  { value: 'improve-ranking', label: 'Improve SERP ranking' }
];

export function validateGrowthRequest(formData) {
  const errors = {};
  const value = (field) => {
    const raw = formData?.[field];
    return typeof raw === 'string' ? raw.trim() : '';
  };

  const name = value('name');
  if (!name) {
    errors.name = 'Name is required.';
  }

  const email = value('email');
  if (!email) {
    errors.email = 'Work email is required.';
  } else if (!emailPattern.test(email)) {
    errors.email = 'Enter a valid work email.';
  }

  const company = value('company');
  if (!company) {
    errors.company = 'Company is required.';
  }

  const website = value('website');
  if (website && !websitePattern.test(website)) {
    errors.website = 'Enter a valid website.';
  }

  const primaryGoal = value('primaryGoal');
  if (!primaryGoal || !primaryGoalOptions.some((option) => option.value === primaryGoal)) {
    errors.primaryGoal = 'Select a primary goal.';
  }

  const message = value('message');
  if (!message) {
    errors.message = 'Message is required.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}
