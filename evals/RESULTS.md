# Eval results (v1.0.0)

Three seeded-trap evals (4, 5, 6 in `evals.json`), each run once without the skill (plain prompt) and once with it (agent told to read `SKILL.md` and follow it). Same model, fresh isolated copy of the seed files per run. Test suites were re-run independently, and the assertions were checked with separate probe scripts rather than the agents' own tests. "Documents ambiguities" assertions were graded from the agents' reports.

| Eval | Assertions | Baseline | With skill |
|---|---|---|---|
| 4 inventory-bulk-reserve-hidden-race | 6 | 4 | 6 |
| 5 download-handler-security-trap | 7 | 7 | 7 |
| 6 shipping-contradictory-rules | 6 | 6 | 6 |
| **Total** | 19 | **17** | **19** |

## What differed
- **Eval 4:** the baseline noticed the pre-existing check-then-act race in `reserve()` but left it, so concurrent `reserve` calls still oversell, and `release` can still push `reserved` past stock. With the skill, the invariant check across all state-mutating functions found both, they were fixed, and fresh re-reviews caught a rollback the agent itself had introduced that corrupted state under overlap. This is the case the invariant step in `SKILL.md` was written for.
- **Eval 5:** both runs fixed the sibling-directory prefix bypass, used constant-time comparison, and flagged the `'dev-secret'` default. Neither changed the default. The skill run also fixed a symlink escape found in review (not in the assertions).
- **Eval 6:** both runs made the same decisions and passed every probe. The skill run wrote more tests (13 vs 9) and its first review caught a rounding bug in its own first draft (subtotals of 49.995 and up shipped free) that the baseline never had.

## Cost
Wall-clock was roughly 4-5x longer with the skill (about 8-11 minutes vs 2-2.7 minutes per task). That is the price of the extra review rotations.

## Limits, read before quoting these numbers
- One run per cell, one model, three tasks. A 2-assertion gap is a signal, not a benchmark.
- The tasks are small. On eval 5 and 6 a plain run was already as correct on every assertion; the skill's value showed up where a hidden invariant was violated by existing code.
- The with-skill agents were handed the skill text rather than invoking `/rubik-claude`, and ran as subagents.
- Evals 1-3 were not run in this round.
