---
name: rubik-claude
description: Solve a complex task automatically with plan-mode-style rigor but no approval prompts. Runs a structured cycle of scramble (understand), plan, rotate (execute in verified slices), inspect (adversarial review by a fresh reviewer) and adjust, so a mid-tier model can reach the quality of a larger one. Invoke explicitly with /rubik-claude <task> and optionally depth=1..4. Does not run unless the user asks for it.
disable-model-invocation: true
argument-hint: "<task> [depth=1|2|3|4]"
---

# rubik-claude

A cube is solved by small turns, each followed by a look at what changed. This skill applies the same idea to hard tasks. Plan mode gets its quality from deliberate planning and review, but it makes the user approve each step. Here the planning and review still happen, and they are written down where the user can read them afterwards. The user is only interrupted for a real decision.

The extra quality comes from three habits that a single fast pass skips: stating success criteria before working, checking each slice before building on it, and having someone with fresh eyes attack the result. A reviewer who didn't write the work is the main thing that lets a mid-tier model catch mistakes it would otherwise ship.

## Inputs
- The task, from the user's message.
- Optional `depth=1..4` to force a tier. If absent, score the task and pick (see below).

## Tiers
Score the task, or take the user's `depth`. Details and scoring rubric are in `references/tiers.md`; read it when you pick a tier.

| Tier | Use for | Plan | Reviews | Max rotations |
|---|---|---|---|---|
| 1 Light | Clear, small, low risk | 3-5 line plan | 1 | 2 |
| 2 Standard | Multi-step or multi-file | Plan with criteria per step | 1-2 | 3 |
| 3 Deep | Ambiguous, risky, or hard to undo | Plan + pre-mortem | 2 independent | 4 |
| 4 Max | Architecture, security, or high stakes | Plan + pre-mortem + two candidate approaches compared | 2 independent + final audit | 5 |

A rotation is one execute-inspect-adjust loop. The cap exists so cost stays bounded and the cycle can't loop forever.

## The cycle

### 1. Scramble: understand before acting
Restate the goal in your own words. List constraints, unknowns, and what "done" means. Read the files, data, or docs that matter. Do not start changing things yet. Most expensive mistakes come from solving a slightly different problem than the one asked.

If an unknown can only be answered by the user and changes the approach, ask now, once, with a concrete question and a recommended default.

### 2. Plan: record, don't block
Write the plan in the chat so it is visible. Each step gets:
- what changes
- a success criterion that can be checked
- how it will be verified (test, command, re-read, rendered output)

At tier 3+, add a short pre-mortem: assume the plan failed and list the three most likely reasons, then adjust the plan to guard against them. At tier 4, sketch two candidate approaches and say why one wins.

Do not wait for approval. The point of auto mode is that the plan is a working document, not a gate.

### 3. Rotate: execute in slices
Do one slice, then run its verification before moving on. A slice is the smallest piece that can be checked on its own. Building on an unchecked slice hides bugs until they are expensive to find. If verification fails, fix it in place before continuing.

### 4. Inspect: independent review
After the slices are done, review the whole result against the success criteria from step 2, not against your memory of what you meant.

Use a fresh reviewer so it does not share your blind spots:
- If the environment supports subagents, spawn one using the template in `references/review-prompts.md`. Give it the task, the criteria, and the changed files. Do not give it your reasoning; it should judge the result, not your intent.
- If subagents are not available, do the review yourself as a separate pass: re-read the original request first, then the output, and try to break it. Say clearly in the report that the review was in-context.

Ask the reviewer for concrete findings only: what is wrong, where, how to reproduce or see it. Vague style opinions are not findings.

### 5. Adjust
Check each finding yourself before acting. Reviewers can be wrong, and obeying a false finding is as bad as ignoring a true one. Fix confirmed findings, drop false ones with a one-line reason, then re-inspect only what changed. Count this as one rotation.

Re-inspecting means a fresh look at the fixes, not just re-running tests. Tests only prove the cases someone thought to write, and a fix is new, unreviewed code that can introduce its own bug. Skip the re-review only for trivial fixes (typos, renames, a one-line change a test already pins down), and say that you skipped it.

### 6. Solved, or ask
Stop when all criteria are met and the latest review is clean.

If the rotation cap is reached with unresolved findings, or you hit a decision that only the user can make, ask the user one targeted question using the environment's question tool (or plain chat if none exists). State what you tried, what is still wrong, and your recommended option. Then continue with their answer. Do not silently ship something known to be broken, and do not keep rotating past the cap.

## Hard rules
- No destructive or outward-facing actions (deleting data, pushing, sending messages, publishing) without the user's explicit say-so. Auto mode removes approval for planning, not for risk.
- Never claim a check passed unless you ran it. If something could not be verified, say so.
- Keep the review in the loop even when the task feels easy. The skill is invoked on purpose, so the user wants the extra pass.

## Final report
End with a short report, not a transcript:
1. **Result**: what was done, in two or three sentences.
2. **Criteria**: each success criterion with pass/fail and how it was checked.
3. **Review**: how many rotations ran, what the reviewer found, what was fixed or dismissed.
4. **Open items**: anything unverified, assumed, or left for the user.
