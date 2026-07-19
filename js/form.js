export const GOAL_OPTIONS = [
  { value: "seo", label: "SEO & organic traffic growth" },
  { value: "aeo", label: "AEO / AI search visibility" },
  { value: "localization", label: "Multilingual localization" },
  { value: "full-platform", label: "Full organic growth platform" },
];

export const SERVICES = [
  {
    title: "SEO execution",
    description: "Strategy, content, and on-page optimization that compounds month over month.",
  },
  {
    title: "AEO visibility",
    description: "Structured data and answer-engine optimization for ChatGPT, Perplexity, and Claude.",
  },
  {
    title: "Localization",
    description: "Scale content across markets with multilingual workflows built for search.",
  },
];

export const FIELD_RULES = {
  fullName: {
    required: true,
    minLength: 2,
    message: "Enter your full name (at least 2 characters).",
  },
  workEmail: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Enter a valid work email address.",
  },
  company: {
    required: true,
    minLength: 2,
    message: "Enter your company name.",
  },
  website: {
    required: false,
    pattern: /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/i,
    message: "Enter a valid URL (e.g. https://example.com).",
  },
  primaryGoal: {
    required: true,
    message: "Select your primary growth focus.",
  },
  message: {
    required: true,
    minLength: 20,
    maxLength: 2000,
    message: "Tell us a bit more about your goals (at least 20 characters).",
  },
};

export const validateField = (name, value) => {
  const rules = FIELD_RULES[name];
  if (!rules) return "";

  const trimmed = typeof value === "string" ? value.trim() : value;

  if (rules.required && !trimmed) {
    return rules.message;
  }

  if (!trimmed && !rules.required) {
    return "";
  }

  if (rules.minLength && trimmed.length < rules.minLength) {
    return rules.message;
  }

  if (rules.maxLength && trimmed.length > rules.maxLength) {
    return rules.message;
  }

  if (rules.pattern && !rules.pattern.test(trimmed)) {
    return rules.message;
  }

  return "";
};

export const validateForm = (formData) =>
  Object.keys(FIELD_RULES).reduce((errors, fieldName) => {
    const error = validateField(fieldName, formData.get(fieldName) ?? "");
    if (error) {
      errors[fieldName] = error;
    }
    return errors;
  }, {});

export const serializeForm = (formData) => ({
  fullName: formData.get("fullName")?.trim() ?? "",
  workEmail: formData.get("workEmail")?.trim() ?? "",
  company: formData.get("company")?.trim() ?? "",
  website: formData.get("website")?.trim() ?? "",
  primaryGoal: formData.get("primaryGoal") ?? "",
  message: formData.get("message")?.trim() ?? "",
});

export const submitRequest = async (payload) => {
  const response = await fetch("/api/request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  let data = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    const message = data.error ?? `Request failed (${response.status}). Please try again.`;
    throw new Error(message);
  }

  return data;
};
