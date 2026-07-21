## Round 1 — Vague Prompt
Prompt: "Build a demo request form for FlyRankAI."

**Correctness:** Surprisingly solid. Semantic HTML, explicit `response.ok` checks,
`:disabled` during submission, `box-sizing: border-box` — Copilot picked most of this
up from CLAUDE.md automatically, not from the prompt itself.

**Accessibility:** Good — `role="alert"` on field errors, `:focus-visible` used
correctly, no `outline: none`.

**Edge cases:** No tests written or run. Validation logic was duplicated between the
client (`form.js`) and the API handler (`api/request.js`) — a maintenance risk if the
rules ever drift apart. `vercel.json` included a rewrite rule that maps `/api/(.*)` to
itself, which does nothing; Vercel already routes `/api/*` without it.

**Review effort:** Low upfront (one sentence), but I'd need to manually check both
validators stayed in sync over time, and there's no test suite to catch a mismatch.

## Round 2 — Precise Prompt + Verification
Prompt specified: shared validation source (no duplication), explicit status checks,
no unnecessary Vercel config, tests written and run before finishing.

**Correctness:** Fixed the duplication — one `validation.js` module imported by both
client and API. Tests written with Vitest, all 5 passing.

**Accessibility:** Slight regression — switched field-error announcements from
`role="alert"` to `aria-live="polite"` only, which is less immediate for screen
readers on validation errors.

**Edge cases:** Message length validation (20–2000 chars in round 1) was dropped
entirely in round 2 — a one-character message now passes.

**The AI mistake I caught:** Round 2's `package.json` dropped Vite (`dev`/`build`/
`preview` scripts and the `vite` dependency) entirely, replacing them with only
`vitest`. The AI was so focused on "write tests" that it silently broke the ability
to run or build the site at all — `npm run dev` no longer exists on this branch.

**Review effort:** Higher upfront (writing the constrained prompt took real thought),
but the actual code review was faster — I was checking against my own stated
constraints instead of guessing what might be wrong.

## Time Comparison
[Fill in: how long did each round actually take you, prompt to committed code?]

## Verdict
Round 2's prompt took longer to write, but caught structural issues (duplicated
validation) that round 1's fast output hid. Neither round was perfect — round 2
traded a build-tooling regression and a minor accessibility regression for better
architecture and real test coverage. The lesson: a detailed prompt doesn't guarantee
a better result on every axis, it guarantees you're validating against constraints
you chose instead of ones the model chose for you.