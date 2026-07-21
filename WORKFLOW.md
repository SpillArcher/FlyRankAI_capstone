## Round 1 - Vague Prompt
Prompt: "Build a request form for FlyRankAI."

**What happened:** The model produced a working-looking form fast. It used
semantic HTML, handled `response.ok`, disabled the button during submission, and
applied `box-sizing: border-box`.

**What was good:** Accessibility was solid. Field errors used `role="alert"`,
`focus-visible` styles were preserved, and no `outline: none` was used.

**What was missing:** There were no tests. Validation logic was duplicated between
the client (`form.js`) and the API handler (`api/request.js`), which leaves room
for drift. `vercel.json` also contained a useless rewrite from `/api/(.*)` to itself.

**How hard it was to review:** Easy at first, because the prompt was simple. The
catch is that I still had to check validator sync manually, since there was no test
suite to catch regressions.

## Round 2 - Precise Prompt + Verification
Prompt: "Build the same FlyRankAI growth request form (name, work email, company, website, primary goal select, message) as a fresh implementation.

Constraints:

Semantic HTML only, matching CLAUDE.md conventions (header/main/footer, :focus-visible never outline: none, :disabled during submit, box-sizing: border-box)
Client and server must share ONE validation source — do not duplicate field rules between the client-side validator and the API handler. Import/reuse the same rules module in both places.
The API handler must check response status explicitly (equivalent of response.ok), not rely on try/catch alone
Do not add Vercel rewrite rules unless they change actual routing behavior — Vercel's /api folder convention doesn't need one for this case

Write it, then write unit tests covering: required-field validation, invalid email rejection, the disabled-submit state, and a successful submission. Run the tests and fix any failures before finishing."

**What happened:** The model followed the tighter instructions. A single
`validation.js` module is shared between client and API, and Vitest tests were added.

**What was good:** The architecture is stronger now. The shared validation module
eliminates the duplicate-rule problem, and test coverage is in place.

**What was worse:** Accessibility got slightly worse. Error announcements changed
from `role="alert"` to `aria-live="polite"` only, which is less immediate for
screen reader users.

**What still needs work:** The round dropped message length validation. Round 1 had
a 20–2000 character rule, but round 2 now accepts a one-character message.

**The big AI mistake:** The model removed Vite from `package.json`, leaving only
`vitest`. That means the site can no longer run or build, even though tests were
present.

**How hard it was to review:** Harder to write the prompt, clearer to audit. Because
I stated the constraints up front, I was checking against them instead of guessing.

## Time Comparison
Round 1: about 4 minutes from prompt to committed code.
Round 2: about 12 minutes from prompt to committed code.

## Verdict
Round 2 took longer to write, but it caught meaningful architectural issues that the
fast Round 1 output hid. It also introduced its own flaws, a slight accessibility downgrade and a broken build setup.

The lesson: a detailed prompt does not automatically make the result better in every
way. It does make the result easier to evaluate, because you are checking the model
against the constraints you chose instead of the ones it guessed for you.
