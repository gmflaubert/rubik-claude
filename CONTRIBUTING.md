# Contributing

Thanks for helping. The most valuable contribution is a **failing case**: a task where rubik-claude shipped a bug that its review should have caught, or stopped to ask when it shouldn't have.

## Adding an eval
1. Add an entry to `evals/evals.json` with a `prompt`, an `expected_output`, and objective `assertions` (things you can check by running code or reading the report).
2. If the task needs seeded input, put it in `evals/files/<name>/`.
3. Prefer cases with a hidden trap (a pre-existing bug, contradictory rules, a security gap) over plain feature work, since those are what separate a careful run from a careless one.

## Changing the skill
- Keep `SKILL.md` spec-valid and free of product-specific tool names, so it stays portable across agents.
- If a change alters the workflow's logic, re-run the evals and note the before/after in the PR.
- Keep the tier table in `SKILL.md`, `references/tiers.md` and `README.md` consistent.

## Pull requests
Small and focused. Say what failure the change addresses and how you checked it.
