const GOAL_VALUES = new Set(["seo", "aeo", "localization", "full-platform"]);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_PATTERN = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/i;

const validatePayload = (body) => {
  const errors = [];

  if (!body.fullName?.trim() || body.fullName.trim().length < 2) {
    errors.push("fullName");
  }

  if (!body.workEmail?.trim() || !EMAIL_PATTERN.test(body.workEmail.trim())) {
    errors.push("workEmail");
  }

  if (!body.company?.trim() || body.company.trim().length < 2) {
    errors.push("company");
  }

  if (body.website?.trim() && !URL_PATTERN.test(body.website.trim())) {
    errors.push("website");
  }

  if (!body.primaryGoal || !GOAL_VALUES.has(body.primaryGoal)) {
    errors.push("primaryGoal");
  }

  const message = body.message?.trim() ?? "";
  if (message.length < 20 || message.length > 2000) {
    errors.push("message");
  }

  return errors;
};

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed." });
  }

  let body = {};
  try {
    body = typeof request.body === "string" ? JSON.parse(request.body) : request.body ?? {};
  } catch {
    return response.status(400).json({ error: "Invalid JSON payload." });
  }

  const invalidFields = validatePayload(body);
  if (invalidFields.length > 0) {
    return response.status(422).json({
      error: "Some fields are invalid. Please review the form and try again.",
      fields: invalidFields,
    });
  }

  console.info("[FlyRankAI] New growth request:", {
    fullName: body.fullName.trim(),
    workEmail: body.workEmail.trim(),
    company: body.company.trim(),
    website: body.website?.trim() || null,
    primaryGoal: body.primaryGoal,
    messageLength: body.message.trim().length,
    receivedAt: new Date().toISOString(),
  });

  return response.status(201).json({
    ok: true,
    message: "Thanks — your request was received. We will respond within one business day.",
  });
}
