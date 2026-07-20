import { describe, expect, it } from 'vitest';
import { validateGrowthRequest, primaryGoalOptions } from './validation.js';

describe('validateGrowthRequest', () => {
  it('rejects missing required fields', () => {
    const { valid, errors } = validateGrowthRequest({});

    expect(valid).toBe(false);
    expect(errors).toEqual({
      name: 'Name is required.',
      email: 'Work email is required.',
      company: 'Company is required.',
      primaryGoal: 'Select a primary goal.',
      message: 'Message is required.'
    });
  });

  it('rejects invalid email addresses', () => {
    const { valid, errors } = validateGrowthRequest({
      name: 'Alyssa',
      email: 'alyssa@invalid',
      company: 'FlyRank',
      website: 'https://flyrank.ai',
      primaryGoal: primaryGoalOptions[0].value,
      message: 'Help me grow.'
    });

    expect(valid).toBe(false);
    expect(errors.email).toBe('Enter a valid work email.');
  });
});
