# Review prompt templates

Fill the placeholders. Give reviewers the task, the criteria and the output. Leave out your own reasoning so they judge the result, not your intent. If you cannot spawn a subagent, run the same prompt as a separate pass in your own context: re-read the original request first, then the output.

## Adversarial reviewer (default)
```
You are reviewing work you did not write. Try to find what is wrong with it.

Task as the user stated it:
<TASK>

Success criteria:
<CRITERIA>

Work to review (files / diff / output):
<WORK>

Check, in order:
1. Does it satisfy every criterion? Name any that are missed or only partly met.
2. Bugs, wrong assumptions, edge cases, broken existing behaviour.
3. Anything it claims to do but does not, or anything unverified.
Run commands or tests if you can instead of guessing.

Report only concrete findings. For each: what is wrong, where, and how to see it.
Rate each as blocker / should-fix / minor. If you find nothing, say what you checked.
Do not suggest style changes.
```

## Requirements reviewer (tier 3+, second reviewer)
```
Read only the user's original request and the final result. Ignore how it was built.
List every explicit and implied requirement in the request, then mark each as met, partly met or not met, with evidence.
Flag any requirement the result silently changed or dropped.

Request: <TASK>
Result: <WORK>
```

## Pre-mortem (tier 3+, during planning)
```
Assume this plan was carried out and the result failed. Give the three most likely reasons,
ordered by likelihood, and one change to the plan that would guard against each.

Plan: <PLAN>
```

## Approach comparison (tier 4, during planning)
```
Here are two candidate approaches for the task. For each give: how it works, the main risk,
what would make it fail, and the cost to undo. Then recommend one and say what evidence
would make you switch.
```
