# Choosing a tier

Score the task on each factor from 0 to 2, then add up. Use the user's `depth=` if they gave one.

| Factor | 0 | 1 | 2 |
|---|---|---|---|
| Size | One file or one answer | A few files or steps | Many files, systems or phases |
| Ambiguity | Requirements are clear | Some gaps, defaults are obvious | Conflicting or missing requirements |
| Reversibility | Easy to undo | Some cleanup if wrong | Hard to undo (data, money, prod, security) |
| Novelty | Familiar pattern | Mostly familiar | Unfamiliar domain or tricky constraints |

- 0-2: Tier 1
- 3-4: Tier 2
- 5-6: Tier 3
- 7-8: Tier 4

When unsure between two tiers, pick the lower one and let the reviewer's findings justify going up. Tell the user which tier you picked and why, in one line.

## Budgets
- Rotation = one execute, inspect, adjust loop.
- Tier 1: max 2 rotations, 1 reviewer.
- Tier 2: max 3, up to 2 reviewers over the run.
- Tier 3: max 4, two independent reviewers with different focus (correctness vs. requirements and edge cases).
- Tier 4: max 5, adds a final audit by a reviewer who sees only the task and the result.

If a tier's cap is reached with open findings, ask the user instead of continuing.
