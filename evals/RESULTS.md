# Eval results

Eight evals, each run once without the skill (plain prompt) and once with it (agent told to read `SKILL.md` and follow it). Same model, fresh isolated copy of seed files per run. Test suites were re-run independently. Evals 4, 5, 7 and 8 were checked with separate probe scripts; for evals 1, 2, 3 and 6 the assertions were graded from the code, the tests and the agents' reports.

| # | Eval | Assertions | Plain | With skill |
|---|---|---|---|---|
| 1 | multi-file refactor to integer cents | 6 | 6 | 6 |
| 2 | ambiguous CSV merge bug hunt | 6 | 6 | 6 |
| 3 | token-bucket rate limiter design | 6 | 6 | 6 |
| 4 | inventory `reserveAll` with hidden race | 6 | 4 | 6 |
| 5 | download links with path-prefix bug | 7 | 7 | 7 |
| 6 | shipping from contradictory rules | 6 | 6 | 6 |
| 7 | CSV export with escaping and formula-injection traps | 7 | 7 | 7 |
| 8 | cache `getOrCompute` with falsy-value trap | 6 | 5 | 5 |
| | **Total** | 50 | **47** | **49** |

## Reading this honestly
- **The assertion gap comes from one eval (4).** On the other seven the plain run satisfied the same assertions. Eval 8 is a tie where both missed the same one (neither flagged or fixed expired entries never being evicted).
- **Where the skill won:** eval 4. The plain run noticed the existing `reserve()` race and left it, so concurrent calls still oversell, and `release` can still over-release. The skill's invariant check across all state-mutating functions found both, they were fixed, and a fresh re-review caught a rollback the agent had added itself that corrupted state under overlapping calls.
- **What the assertions don't capture:** with the skill the suites were larger (about 1.5-3x the tests) and review found real defects in the agent's own drafts: subtotals of 49.995 shipping free (6), a symlink escape in the download handler (5), a fractional-quantity regression and `-0` totals (1), unmerged duplicates when an email moved onto an id-less record (2), and float retry-timing misses in the limiter (3). The plain runs never produced those defects, so these are cost saved rather than bugs shipped; no plain run was shown to ship a worse result on them.
- **Eval 1 is weak.** The prompt asks to refactor duplicated code but supplies none, so "keep existing exports working" is vacuous. It should be rebuilt with seeded duplicated code.

## Cost
Wall-clock with the skill was about the same to roughly 6x longer than a plain run, typically 2-5x (for example 146s vs 874s on eval 1, 154s vs 595s on eval 8, 394s vs 388s on eval 7).

## Skill-adherence gaps seen
The agents did not always follow `SKILL.md`:
- Eval 7, depth=3: the pre-mortem was skipped.
- Eval 1: logic-changing fixes were re-checked by the author instead of a fresh reviewer.
- Eval 7: both reviewers wrongly said an existing function was unchanged because they were given the changed files but not the original.
- Evals 4 and 8: reviewers could see the plain run's output in the shared directory (isolation leak; the agents report they did not use it).

## Limits, read before quoting these numbers
- One run per cell, one model, eight small tasks. A 2-assertion gap is a signal, not a benchmark.
- On small tasks a plain run is often already correct. The evidence supports "helps when existing code quietly breaks an invariant", not "makes every result better".
- The with-skill agents were handed the skill text and ran as subagents, not via `/rubik-claude`.
- The isolation leak above means evals 4 and 8 with-skill results could have been influenced; a rerun with fully separate directories would be cleaner.
