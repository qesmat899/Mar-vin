# Azizam Agent Orchestrator — Bootstrap

## Status

**DISABLED.** The file `orchestrator/STOP` is present by default. The workflow exits before calling any model while that file exists. The workflow also requires an explicit `confirm_run=true` input.

This is a staged bootstrap, not a connection to the current ChatGPT conversation. The reviewer planned for a later stage would use the OpenAI API and would be a separate model/API call.

## Intended flow

1. Mar starts a run manually from GitHub Actions and supplies one bounded task.
2. The workflow checks the STOP file and explicit confirmation before invoking Claude.
3. Claude Code works on a dedicated task branch and may open a **draft pull request**.
4. Tests and an independent AI review are added as a later stage.
5. Mar reviews the result and decides whether to merge. No agent may merge to `Azizam`, publish, order, send messages, or make commercial decisions.

## Activation checklist — requires Mar's explicit decision

- [ ] Review this draft PR.
- [ ] Confirm the repository's GitHub Actions permissions and branch protections.
- [ ] Add `ANTHROPIC_API_KEY` as a GitHub Actions secret (never commit it).
- [ ] Confirm the Claude Code Action version and permissions against the official action documentation.
- [ ] Remove `orchestrator/STOP` only after deciding to enable the builder.
- [ ] Run a harmless test task on a disposable branch.
- [ ] Add the independent OpenAI API reviewer as a separate, read-only workflow; store its key only as `OPENAI_API_KEY` in GitHub Actions secrets.
- [ ] Test STOP behavior and verify that no workflow can merge to `Azizam`.

## Emergency stop

Re-add `orchestrator/STOP` on the default branch to prevent new runs from invoking a model. Also cancel any currently running GitHub Actions run in the Actions UI; a file gate cannot retroactively stop a job that already passed the gate.

## Scope and safeguards

- Manual trigger only; no schedule and no automatic run on every push.
- Default STOP file and a second explicit confirmation input.
- Dedicated task branch and draft PR only.
- No automatic merge.
- No secrets, customer data, credentials, or unnecessary personal data in prompts or repository files.
- Model output is untrusted and must be reviewed.
- Mar is the final decision-maker. Compliance BLOCK remains a hard stop.
