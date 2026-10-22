# RFP: rfp-workflow skill

## Goal

Create an opencode skill that reproduces the user's requirements-first delivery style: discuss the requirement, agree on test cases, get explicit approval, record both under `RFP/<feature-name>/` on a dedicated branch, then implement autonomously until all agreed tests pass.

## Users

- The repository owner, when starting a new feature or non-trivial change.
- Any agent that loads the `rfp-workflow` skill.

## Scope

- A single project skill at `.opencode/skills/rfp-workflow/SKILL.md`.
- A structural verification harness at `RFP/rfp-workflow/verify.sh` that executes the acceptance test cases.
- Style is inferred per repository from `AGENTS.md`, project manifests, lint/format/type configuration, CI configuration, and neighboring code.
- Delivery is a five-phase workflow: requirement discovery, test-case design, approval gate, branch + RFP docs, autonomous implementation.
- Branch convention: `feature/<feature-name>`.
- RFP convention: `RFP/<feature-name>/requirements.md` and `RFP/<feature-name>/test-cases.md`.
- Autonomous loop: run tests, fix failures, repeat; hard cap of 10 iterations.
- No slash command and no RFP artifacts beyond the two documents and the verification harness.

## Non-goals

- Hardcoding one language or framework's style.
- Replacing the repository's own lint, format, or test tooling.
- Committing or pushing without an explicit user request.
- Product code or feature implementation in this RFP (the deliverable is the skill).
- Weakening, deleting, or skipping tests to reach green.

## Constraints

- The skill must be discoverable and valid for opencode: folder name matches the `name` in frontmatter.
- Requirements and test cases may be discussed in chat but must not be written to disk before approval.
- No branch is created before approval.
- The workflow must stop and report when requirements are ambiguous, when a blocker requires user input, or after 10 failed fix iterations.
- Existing tests must be preserved; new tests must map to numbered requirements.

## Acceptance criteria

- R1. The skill asks clarifying questions covering goal, scope, non-goals, constraints, edge cases, and completion criteria before proposing an implementation.
- R2. The agreed requirements are expressed as numbered acceptance criteria (`R#`) in `RFP/<feature-name>/requirements.md`.
- R3. Test cases are numbered (`TC#`), cover happy paths, edge cases, and error paths, map to `R#`, and include the exact command used to run them.
- R4. An explicit approval gate blocks branch creation, file writes, and implementation until the user approves both the requirements and the test cases.
- R5. After approval the skill creates `feature/<feature-name>` and writes `RFP/<feature-name>/requirements.md` and `RFP/<feature-name>/test-cases.md`, safely handling an existing branch or folder.
- R6. The skill inspects repository conventions and mirrors existing naming, structure, imports, typing, error handling, and test patterns, preferring an explicit `AGENTS.md` when present.
- R7. The skill implements in an autonomous loop: run tests, fix failures, rerun, up to 10 iterations, then run applicable lint, format, typecheck, and build checks.
- R8. The skill never deletes or weakens tests, never silently changes agreed requirements, never introduces secrets, and never edits unrelated files.
- R9. Completion is reported only after every agreed test passes, with iteration count, files changed, the test command, and final output; no commit or push happens unless requested.
- R10. If blocked, ambiguous, or still failing after 10 iterations, the skill stops and reports the blocker instead of guessing or declaring success.

## Risks

- Repositories without `AGENTS.md` or existing code give weak style signals; the skill must ask for reference examples rather than inventing a style.
- Test commands vary by stack; detection can fail, so the skill must confirm the command before the autonomous loop.
- Long autonomous runs can drift from scope; the RFP documents and the 10-iteration cap are the control.
