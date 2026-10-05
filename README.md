# rubik-claude

**Plan-mode rigor without the approval prompts.** One command makes your agent plan, build in verified steps, get attacked by a fresh reviewer, and fix what holds up. It only interrupts you for a real decision.

```
/rubik-claude add rate limiting to the API and update the tests
```

## Why
A single fast pass is where most agent mistakes come from:

| Without it | With rubik-claude |
|---|---|
| Starts editing before the goal is clear | Restates the goal, constraints and unknowns first |
| "Done" means "I think it works" | Success criteria are written down before work starts and checked after |
| Bugs from step 2 surface at step 6 | Each slice is verified before the next one builds on it |
| The author reviews their own work | A fresh reviewer who didn't write it tries to break it |
| Plan mode asks you to approve every step | The plan is written where you can read it, but never blocks |

The idea: spend extra passes on planning and independent review so a mid-tier model gets closer to the quality of a larger one.

## Install
One line (Claude Code, personal skills):
```bash
git clone https://github.com/gmflaubert/rubik-claude ~/.claude/skills/rubik-claude
```
Per project: clone into `<repo>/.claude/skills/rubik-claude/` instead. For other agents that read `SKILL.md`, put the folder wherever that agent loads skills from.

Then run `/rubik-claude <task>`.

## How it works
1. **Scramble**: restate the goal, constraints and unknowns.
2. **Plan**: written down with checkable success criteria; never waits for approval.
3. **Rotate**: execute one slice at a time and verify each before moving on.
4. **Inspect**: a fresh reviewer (subagent, or a separate in-context pass) tries to break the result.
5. **Adjust**: verify each finding, fix the real ones, re-inspect what changed.
6. **Solved or ask**: stop when criteria pass and review is clean; otherwise ask you one targeted question.

## Usage
```
/rubik-claude <task>
/rubik-claude <task> depth=3
```
Without `depth` the skill scores the task and picks a tier:

| Tier | For | Max rotations |
|---|---|---|
| 1 Light | small, clear | 2 |
| 2 Standard | multi-step | 3 |
| 3 Deep | ambiguous or risky | 4 |
| 4 Max | high stakes | 5 |

Higher tiers add a pre-mortem, then a comparison of two candidate approaches, then a final audit. The rotation cap keeps cost bounded.

It only runs when you invoke it. The description says so, which is portable across agents. In Claude Code you can make that a hard guarantee by adding `disable-model-invocation: true` to the frontmatter (the portable spec doesn't allow that key, so it isn't in the repo copy).

## Portability
The skill uses no tool names specific to one product. Where subagents exist, the reviewer runs in a fresh context. Where they don't, the review runs as a separate in-context pass and the report says so.

## Layout
- `SKILL.md`: the workflow
- `references/tiers.md`: tier scoring and budgets
- `references/review-prompts.md`: reviewer, pre-mortem and approach-comparison templates
- `evals/evals.json`: test prompts and assertions

## Contributing
Issues and PRs welcome, especially failing cases where the review missed a real bug. Add the case to `evals/` so it stays fixed.

## License
MIT
