---
name: rfp-workflow
description: Use when the user requests a new feature or change and wants requirements-first delivery, mentions RFP, asks to discuss requirements and create test cases before coding, wants code to mimic their style, wants an approval gate, or wants autonomous implementation until tests pass. Runs requirement discovery, test-case design, explicit approval, a feature/<name> branch with RFP/<name> docs, then a bounded code-and-test loop.
---

# RFP Workflow

Deliver features the way the user works: understand first, agree on tests, get approval, record the RFP on a branch, then implement autonomously until every agreed test passes.

This skill controls the process. The repository controls the style. Never invent either.

## Non-negotiable gates

1. **No code before understanding.** Ask questions until goal, scope, non-goals, constraints, edge cases, and definition of done are clear.
2. **No branch, no RFP files, no implementation before explicit approval.** Discussion and drafts stay in chat.
3. **Approval covers both documents.** Requirements and test cases are approved together. Any later change to either needs new approval.
4. **Tests are the contract.** Never delete, skip, weaken, or rewrite an agreed test to manufacture green.
5. **Bounded autonomy.** After approval, do not ask routine questions. Loop test -> fix -> rerun at most 10 iterations. Stop and report if blocked.
6. **No commits or pushes** unless the user explicitly asks.

## Phase 0: Style reconnaissance

Do this before proposing code, ideally while exploring for Phase 1. Build a short internal style card; do not write it to disk unless asked.

Read, in order, whichever exist:

1. `AGENTS.md`, `CLAUDE.md`, `CONTRIBUTING.md`, `README.md`.
2. Manifests: `package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, `pom.xml`, `build.gradle`, `Gemfile`, `composer.json`, `*.csproj`.
3. Lint/format/type config: ESLint, Prettier, Biome, Ruff, Black, mypy, `tsconfig.json`, golangci-lint, rustfmt, EditorConfig.
4. CI workflows and Makefile/justfile/task runner scripts, especially test and lint commands.
5. The nearest 2-3 existing files of the same kind you are about to change: naming, folder structure, import ordering, exports, typing strictness, async style, error handling, logging, comments, dependency choices.
6. Existing tests: location, file naming, framework, fixtures, assertion style, mocking approach.

Rules:

- `AGENTS.md` wins over inferred conventions.
- Reuse existing libraries and utilities. Do not add a dependency without approval.
- Match the repo's formatter and linter output exactly.
- If the repository has insufficient style signal (empty repo, unrelated language, no examples), ask the user for 2-3 representative files or a short style sample. Never fabricate a style.
- State the style card briefly to the user before coding (5-8 bullets), so drift is visible early.

## Phase 1: Requirement discovery

Ask clarifying questions in small batches (use the `question` tool when available). Cover:

- Goal and user-visible outcome.
- Users and primary flow.
- Scope and explicit non-goals.
- Constraints: compatibility, performance, security, data, accessibility, dependencies.
- Edge cases, empty/error/loading states, concurrency, permissions.
- Existing behavior that must not regress.
- Definition of done and how the user will verify it.
- Anything ambiguous in the request; restate your interpretation and confirm it.

Then propose an enhanced version: point out missing cases, simpler alternatives, and risks. Summarize the agreed requirement in chat as numbered acceptance criteria (`R1`, `R2`, ...). Iterate until the user confirms the substance.

Do not write `requirements.md` yet.

## Phase 2: Test-case design

Derive test cases directly from the numbered requirements. For each case capture:

- `TC#` and the `R#` it validates.
- Type: happy path, edge case, or error path.
- Preconditions and steps.
- Expected result (observable, not implementation detail).
- Whether it is a new test or an existing test that must stay green.

Rules:

- Every `R#` has at least one `TC#`. Every `TC#` maps to an `R#`.
- Include at least one happy, one edge, and one error case when the feature can fail.
- Prefer the repository's existing test framework, file layout, and naming.
- Identify the exact command to run the targeted tests and the full suite. If the command is unclear, confirm it with the user.
- Check the tests are actually executable: no pseudo-tests, no assertions on nothing.
- Note the baseline: run the relevant existing tests before changes when feasible and record the starting state.

Present the test table in chat. Call out gaps and any case that is expensive or risky to automate.

## Phase 3: Approval gate

Ask for explicit approval of both the requirements and the test cases.

- Approval must be unambiguous ("approved", "go ahead", "yes"). Silence or a comment is not approval.
- If the user changes anything, update both artifacts in chat and ask again.
- Until approval: no branch creation, no `RFP/` files, no implementation, no dependency installs.

## Phase 4: Branch and RFP documents

Only after approval:

1. Derive `<feature-name>`: lowercase kebab-case, ASCII, 2-5 words, at most 50 characters.
2. Check the worktree with `git status --porcelain`. Do not stash, reset, or discard unrelated changes.
3. Create the branch:
   - If `feature/<feature-name>` does not exist: `git switch -c feature/<feature-name>`.
   - If it exists locally: `git switch feature/<feature-name>` and continue on it; never force or reset.
   - If switching would overwrite local changes, stop and report.
4. Create `RFP/<feature-name>/`.
   - If the folder or files already exist, read them first. Merge only with user approval; never silently overwrite approved content.
5. Write `requirements.md` with the approved content and status `Approved`.
6. Write `test-cases.md` with the approved cases, mapping, baseline, and exact run command.
7. Show `git status` and the paths created, then start implementation.

### requirements.md template

```markdown
# RFP: <feature-name>

Status: Approved
Date: <YYYY-MM-DD>
Branch: feature/<feature-name>

## Goal

## Users

## Scope

## Non-goals

## Constraints

## Acceptance criteria

- R1. ...
- R2. ...

## Risks
```

### test-cases.md template

```markdown
# Test cases: <feature-name>

Run command: `<exact command>`
Baseline: `<result before changes>`

| ID | Requirement | Type | Case | Expected |
|---|---|---|---|---|
| TC1 | R1 | happy | ... | ... |
| TC2 | R1 | edge | ... | ... |
| TC3 | R1 | error | ... | ... |

## Out of scope
```

## Phase 5: Autonomous implementation

After the documents are written, proceed without routine questions. Use a todo list and keep it current.

1. Confirm the baseline test command runs.
2. Write or update the agreed tests first when the repository supports it, and watch them fail for the right reason.
3. Implement the smallest coherent change that satisfies the requirements in repository style.
4. Run the targeted tests. On failure, read the failure, fix the cause, rerun.
5. When targeted tests pass, run the full test suite plus the repository's lint, format check, typecheck, and build commands where they exist.
6. If a formatter rewrites files, rerun the tests.
7. Count iterations. One iteration is one test-run/fix cycle. Hard cap: **10 iterations**.

Style rules during implementation:

- Follow the Phase 0 style card; when in doubt, copy the closest existing pattern.
- Keep the diff focused on the feature. No drive-by refactors, renames, or formatting of unrelated files.
- Prefer existing helpers, types, error handling, and logging.
- Add comments only where the repository already uses them for that kind of code.
- Never introduce secrets, credentials, tokens, or debug logging of sensitive data.

Testing rules:

- Never delete, skip, weaken, or change an agreed test to force green.
- Never change an agreed requirement to match the implementation.
- If a test itself is wrong, stop and report the defect with evidence; get approval before changing it.
- Do not treat "tests pass" as done if lint, typecheck, or build still fails.

Stop immediately and report when:

- A requirement is ambiguous or contradictory.
- A blocker needs user input (credentials, external service, product decision, dependency approval).
- The change would require touching unrelated or sensitive areas.
- Tests are still red after 10 iterations.

## Phase 6: Deploy and merge

After every agreed test and build check passes:

1. Deploy using the repository's deployment skill. For this blog, `blog-stack` deploys to Firebase Hosting.
2. Verify the live URL and at least one direct SPA route in a headed browser. Do not merge on a failed deploy.
3. Switch to `main` and merge the feature branch with `git merge --no-ff feature/<feature-name>` so the feature history stays visible.
4. If `main` does not exist, create it from the repository's initial commit before merging.
5. Keep `feature/<feature-name>` alive after the merge. Never delete the local or remote feature branch unless the user explicitly asks.
6. Push `main` and `feature/<feature-name>` to the configured remote when the user asks to publish. Keep both branches on the remote.
7. Do not push unless the user asks.

## Completion

Report only when all agreed `TC#` pass and applicable repository checks pass. Use this shape:

```markdown
Status: complete | blocked
Branch: feature/<feature-name>
RFP: RFP/<feature-name>/requirements.md, RFP/<feature-name>/test-cases.md
Iterations: <n>/10
Files changed: <list>
Test command: <command>
Result: <X passed, Y failed>
Checks: tests <pass/fail>, lint <pass/fail/na>, typecheck <pass/fail/na>, build <pass/fail/na>
Deployed: <url or na>
Merged: main (feature/<feature-name> kept) | not requested

Notes: <deviations, risks, follow-ups>
```

Do not commit or push unless the user asks. If they do, follow the repository's commit message style and keep secrets and unrelated files out of the commit.
