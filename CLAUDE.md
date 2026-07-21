@"
# CLAUDE.md

## Stack
- Frontend: HTML, CSS, JavaScript (vanilla); Node.js + npm for tooling

## Conventions
- Commit format: Conventional Commits (feat:, fix:, docs:, chore:)
- Component naming: [PascalCase components, etc. — fill in your preference]

## Notes for Claude Code
- Prefer small, focused commits
- Ask before installing new dependencies
- Follow existing component/folder structure when adding new files
"@ | Out-File -Encoding utf8 CLAUDE.md

## Project Rules (learned from FE-05 workflow drill)

1. **Never remove existing build/dev tooling without being asked.** Before finishing
   any task, confirm `npm run dev`, `npm run build`, and `npm test` all still work —
   don't let a request to "add tests" silently strip Vite (or any existing tooling)
   out of package.json.

2. **Validation rules live in exactly one shared module**, imported by both the
   client-side form and the API handler. Never write two separate copies of the same
   field rules (min length, patterns, required fields) — if they can drift apart,
   that's a bug waiting to happen.

3. **Field-level validation errors use `role="alert"`, not `aria-live="polite"`
   alone.** A rejected form submission should interrupt a screen reader immediately —
   `polite` waits for a pause, which can delay or skip the announcement entirely.