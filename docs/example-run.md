# Example run: inventory `reserveAll`

Task (`depth=3`): *the inventory module works today. Add `reserveAll(items)` that reserves everything or nothing. Existing tests and exports must keep working.*

Condensed from the actual run in `evals/RESULTS.md` (eval 4).

**Scramble / plan.** Success criteria written before coding: `reserveAll` is all-or-nothing and returns a boolean; existing tests and exports unchanged; new tests added and run; invariant `0 <= reserved <= qty` holds in every function that mutates stock, not just the new one.

**Rotate.** `reserveAll` added with validation, duplicate-SKU summing, and an atomic check-then-reserve. Tests run after the slice.

**Inspect, round 1** (two reviewers in parallel, given the task, criteria and invariants, not the author's reasoning):
- Adversarial reviewer: `addStock` accepts any value, and `release` has no rollback if persistence fails.
- Requirements reviewer: `reserve` and `release` had changed behaviour and that needed disclosing.
- Also surfaced by the invariant check: the original `reserve()` checks stock, awaits, then increments, so two concurrent calls oversell; `release()` can push `reserved` negative.

**Adjust.** Fixes were logic changes, so each got a fresh re-review instead of being trusted.

**Inspect, round 2.** A fresh reviewer showed the rollbacks added in round 1 could leave `reserved` at -3 or above stock when calls overlap. The agent replaced them with a serialized check → persist → mutate design.

**Inspect, round 3.** Another fresh reviewer re-checked the rewrite with a failing persist stub: no deadlock, no mutation on failure. Clean.

**Report.** 15/15 tests (3 original, 12 new), behaviour changes to existing functions listed explicitly for the user to veto, and two minor open items stated, not hidden.

The plain-prompt baseline on the same task passed 9/9 of its own tests, noticed the `reserve()` race, and left it unfixed.
