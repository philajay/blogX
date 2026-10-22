# Test cases: rfp-workflow skill

Target: `.opencode/skills/rfp-workflow/SKILL.md`

Run command (structural checks; executed from repository root):

```sh
sh RFP/rfp-workflow/verify.sh
```

The verification script asserts the contract below against the skill file. Each case maps to an acceptance criterion in `requirements.md`.

| ID | Requirement | Case | Expected |
|---|---|---|---|
| TC1 | R1 | Requirement discovery | Skill instructs the agent to ask clarifying questions about goal, scope, non-goals, constraints, edge cases, and done criteria before any implementation. |
| TC2 | R2 | Requirements artifact | Skill defines `RFP/<feature-name>/requirements.md` with numbered `R#` acceptance criteria and the agreed sections. |
| TC3 | R3 | Test-case artifact | Skill defines `test-cases.md` with numbered `TC#`, happy/edge/error coverage, `R#` mapping, and the exact run command. |
| TC4 | R4 | Approval gate | Skill forbids branches, RFP file writes, and coding until explicit user approval of both documents. |
| TC5 | R5 | Branch and docs | Skill creates `feature/<feature-name>` and both RFP files after approval, and specifies safe behavior when the branch or folder already exists. |
| TC6 | R6 | Style inference | Skill lists repository style sources (`AGENTS.md`, manifests, lint/format/type/CI config, neighboring code) and mirrors them. |
| TC7 | R7 | Autonomous loop | Skill loops test -> fix -> rerun with a hard cap of 10 iterations, then runs lint/format/typecheck/build where applicable. |
| TC8 | R8 | Guardrails | Skill forbids deleting/weakening/skipping tests, silent requirement changes, secrets, and unrelated edits. |
| TC9 | R9 | Completion report | Skill reports only after all tests pass and includes iterations, files changed, command, and final output; no commit unless asked. |
| TC10 | R10 | Blocked state | Skill stops and reports when ambiguous, blocked, or still red after 10 iterations. |
| TC11 | R5 | Frontmatter validity | `name` is `rfp-workflow`, matches the folder, and `description` states both what it does and when to use it. |
| TC12 | R6 | No style invention | Skill tells the agent to ask for reference code when the repository has insufficient style signal. |

## Out of scope

- End-to-end execution of a real feature via the skill (covered manually in future use).
- Runtime behavior of opencode's skill loader beyond file placement and frontmatter.
