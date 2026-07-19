const GOAL_VALUES = new Set(["seo", "aeo", "localization", "full-platform"]);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_PATTERN = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/i;

const validatePayload = (body) => {
  const errors = [];

  if (!body.fullName?.trim() || body.fullName.trim().length < 2) errors.push("fullName");
  if (!body.workEmail?.trim() || !EMAIL_PATTERN.test(body.workEmail.trim())) errors.push("workEmail");
  if (!body.company?.trim() || body.company.trim().length < 2) errors.push("company");
  if (body.website?.trim() && !URL_PATTERN.test(body.website.trim())) errors.push("website");
  if (!body.primaryGoal || !GOAL_VALUES.has(body.primaryGoal)) errors.push("primaryGoal");

  const message = body.message?.trim() ?? "";
  if (message.length < 20 || message.length > 2000) errors.push("message");

  return errors;
};

const handleRequest = (body) => {
  const invalidFields = validatePayload(body);

  if (invalidFields.length > 0) {
    return {
      status: 422,
      body: {
        error: "Some fields are invalid. Please review the form and try again.",
        fields: invalidFields,
      },
    };
  }

  return {
    status: 201,
    body: {
      ok: true,
      message: "Thanks — your request was received. We will respond within one business day.",
    },
  };
};

const readJsonBody = (request) =>
  new Promise((resolve, reject) => {
    let raw = "";

    request.on("data", (chunk) => {
      raw += chunk;
    });

    request.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(new Error("Invalid JSON payload."));
      }
    });

    request.on("error", reject);
  });

export const devApiPlugin = () => ({
  name: "flyrankai-dev-api",
  configureServer(server) {
    server.middlewares.use("/api/request", async (request, response, next) => {
      if (request.method !== "POST") {
        response.statusCode = 405;
        response.setHeader("Allow", "POST");
        response.setHeader("Content-Type", "application/json");
        response.end(JSON.stringify({ error: "Method not allowed." }));
        return;
      }

      try {
        const body = await readJsonBody(request);
        const result = handleRequest(body);

        response.statusCode = result.status;
        response.setHeader("Content-Type", "application/json");
        response.end(JSON.stringify(result.body));
      } catch {
        response.statusCode = 400;
        response.setHeader("Content-Type", "application/json");
        response.end(JSON.stringify({ error: "Invalid JSON payload." }));
      }
    });

    server.middlewares.use("/api", (_request, _response, next) => next());
  },
});
