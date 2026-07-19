import {
  GOAL_OPTIONS,
  SERVICES,
  serializeForm,
  submitRequest,
  validateField,
  validateForm,
} from "./form.js";

const form = document.getElementById("growth-request-form");
const submitButton = document.getElementById("submit-button");
const formStatus = document.getElementById("form-status");
const messageField = document.getElementById("message");
const messageCounter = document.getElementById("message-counter");
const goalSelect = document.getElementById("primary-goal");
const serviceList = document.getElementById("service-list");

const fieldMap = {
  fullName: "full-name",
  workEmail: "work-email",
  company: "company",
  website: "website",
  primaryGoal: "primary-goal",
  message: "message",
};

const renderGoalOptions = () => {
  const options = GOAL_OPTIONS.map(
    ({ value, label }) => `<option value="${value}">${label}</option>`
  ).join("");

  goalSelect.insertAdjacentHTML("beforeend", options);
};

const renderServices = () => {
  serviceList.innerHTML = SERVICES.map(
    ({ title, description }) => `
      <li>
        <strong>${title}</strong>
        <p>${description}</p>
      </li>
    `
  ).join("");
};

const setFieldError = (fieldName, message) => {
  const inputId = fieldMap[fieldName];
  const label = document.querySelector(`label[for="${inputId}"]`);
  const errorEl = document.getElementById(`${inputId}-error`);

  if (message) {
    label?.classList.add("field--invalid");
    if (errorEl) errorEl.textContent = message;
  } else {
    label?.classList.remove("field--invalid");
    if (errorEl) errorEl.textContent = "";
  }
};

const clearFormErrors = () => {
  Object.keys(fieldMap).forEach((fieldName) => setFieldError(fieldName, ""));
};

const showFormStatus = (message, type) => {
  formStatus.hidden = false;
  formStatus.textContent = message;
  formStatus.className = `form-status form-status--${type}`;
};

const hideFormStatus = () => {
  formStatus.hidden = true;
  formStatus.textContent = "";
  formStatus.className = "form-status";
};

const updateMessageCounter = () => {
  const { length } = messageField.value;
  messageCounter.textContent = `${length} / 2000`;
};

const handleFieldValidation = (event) => {
  const { name, value } = event.target;
  if (!Object.prototype.hasOwnProperty.call(fieldMap, name)) return;

  const error = validateField(name, value);
  setFieldError(name, error);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  hideFormStatus();

  const formData = new FormData(form);
  const errors = validateForm(formData);

  clearFormErrors();

  const errorEntries = Object.entries(errors);
  if (errorEntries.length > 0) {
    errorEntries.forEach(([fieldName, message]) => setFieldError(fieldName, message));
    showFormStatus("Please fix the highlighted fields before submitting.", "error");
    document.getElementById(fieldMap[errorEntries[0][0]])?.focus();
    return;
  }

  const payload = serializeForm(formData);

  submitButton.disabled = true;
  submitButton.textContent = "Sending…";

  try {
    const result = await submitRequest(payload);
    form.reset();
    updateMessageCounter();
    clearFormErrors();
    showFormStatus(
      result.message ?? "Thanks — your request was sent. We will be in touch soon.",
      "success"
    );
  } catch (error) {
    showFormStatus(
      error instanceof Error ? error.message : "Something went wrong. Please try again.",
      "error"
    );
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Send request";
  }
};

renderGoalOptions();
renderServices();
updateMessageCounter();

form.addEventListener("submit", handleSubmit);
form.addEventListener("input", handleFieldValidation);
form.addEventListener("blur", handleFieldValidation, true);
messageField.addEventListener("input", updateMessageCounter);
