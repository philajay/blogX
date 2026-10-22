#!/bin/sh
# Structural verification for the rfp-workflow skill.
# Each check maps to a test case in test-cases.md.

set -u

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/../.." && pwd)
SKILL="$ROOT/.opencode/skills/rfp-workflow/SKILL.md"
pass=0
fail=0

check() {
  id=$1
  desc=$2
  shift 2
  if "$@" >/dev/null 2>&1; then
    printf 'PASS %s %s\n' "$id" "$desc"
    pass=$((pass + 1))
  else
    printf 'FAIL %s %s\n' "$id" "$desc"
    fail=$((fail + 1))
  fi
}

has() { grep -qiE "$1" "$SKILL"; }
hasall() {
  for pattern in "$@"; do
    grep -qiE "$pattern" "$SKILL" || return 1
  done
}

[ -f "$SKILL" ] || { printf 'FAIL skill file missing: %s\n' "$SKILL"; exit 1; }

check TC1 "requirement discovery" hasall 'clarifying question' 'non-goals' 'edge case' 'definition of done'
check TC2 "requirements artifact" hasall 'requirements\.md' 'acceptance criteria' 'R1' 'R#'
check TC3 "test-case artifact" hasall 'test-cases\.md' 'TC#' 'happy' 'edge' 'error' 'run command'
check TC4 "approval gate" hasall 'approval gate' 'explicit' 'no branch' 'before'
check TC5 "branch and docs" hasall 'feature/<feature-name>' 'git switch -c' 'already exist|exists locally' 'RFP/<feature-name>'
check TC6 "style inference" hasall 'AGENTS\.md' 'manifest' 'lint' 'neighboring|nearest' 'typecheck'
check TC7 "autonomous loop" hasall '10 iterations' 'targeted tests' 'full test suite' 'build'
check TC8 "guardrails" hasall 'never delete|never deleting' 'skip' 'secrets' 'unrelated'
check TC9 "completion report" hasall 'all agreed' 'Iterations' 'Files changed' 'Do not commit'
check TC10 "blocked state" hasall 'blocked' 'ambiguous' 'report' '10 iterations'
check TC11 "frontmatter validity" sh -c "
  head -n 4 '$SKILL' | grep -q '^name: rfp-workflow$' &&
  head -n 6 '$SKILL' | grep -q '^description: .*Use when' &&
  grep -q '^description: .*RFP' '$SKILL' &&
  test \"\$(basename \"\$(dirname '$SKILL')\")\" = rfp-workflow
"
check TC12 "no style invention" hasall 'insufficient style signal' 'ask the user' 'representative files'

printf '\n%d passed, %d failed\n' "$pass" "$fail"
[ "$fail" -eq 0 ]
