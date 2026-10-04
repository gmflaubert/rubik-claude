# rubik-claude

An automatic, plan-mode-style workflow for hard tasks. It plans, works in verified slices, has a fresh reviewer attack the result, fixes what holds up, and only interrupts you for a real decision.

The goal is to let a mid-tier model get closer to the quality of a larger one by spending extra passes on planning and independent review.

## How it works
1. **Scramble**: restate the goal, constraints and unknowns.
2. **Plan**: written down with checkable success criteria, but it never waits for approval.
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

It is meant to run only when you invoke it. The description says so, which is portable across agents. In Claude Code you can make that a hard guarantee by adding `disable-model-invocation: true` to the frontmatter (the portable spec doesn't allow that key, so it isn't in the repo copy).

## Install
Copy this folder into your agent's skills directory.
- Claude Code (personal): `~/.claude/skills/rubik-claude/`
- Claude Code (project): `<repo>/.claude/skills/rubik-claude/`
- Other agents that read `SKILL.md`: place it wherever that agent loads skills from.

## Portability
The skill uses no tool names specific to one product. Where subagents exist, the reviewer runs in a fresh context. Where they don't, the review runs as a separate in-context pass and the report says so.

## Layout
- `SKILL.md`: the workflow
- `references/tiers.md`: tier scoring and budgets
- `references/review-prompts.md`: reviewer, pre-mortem and approach-comparison templates
- `evals/evals.json`: test prompts

## License
MIT
