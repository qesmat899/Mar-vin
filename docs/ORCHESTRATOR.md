# Azizam Agent Orchestrator — Bootstrap

## Status

**DISABLED by default.** The file `orchestrator/STOP` is present. The builder and independent AI reviewer check the STOP state on the target/base branch before any model call. The builder also requires the manual `confirm_run=true` input.

This is not a connection to the current ChatGPT conversation. The independent reviewer uses a separate OpenAI API call and requires a separately configured API key.

## Workflows

- `.github/workflows/agent-orchestrator.yml`: manual Claude Code builder; task branch and draft PR only.
- `.github/workflows/independent-ai-review.yml`: PR-triggered, read-only model review; checks STOP against the PR's base SHA, sends a bounded diff to the OpenAI Responses API, and posts its review as a PR comment. It does not edit code, approve, or merge.
- `.github/workflows/tests.yml`: runs the repository's Python unit tests on pull requests targeting `Azizam`. It does not call a model and remains available while the AI STOP gate is active.

## Intended flow

1. Mar reviews and merges the setup PR only after inspecting its changes.
2. For normal development, a task is run manually and Claude Code works on a dedicated branch.
3. Tests run on the pull request. The independent reviewer runs only if the STOP file is absent from the target branch and the API secret is configured.
4. Mar reviews all changes, test results, and reviewer findings. Mar alone decides whether to merge.

No agent may merge to `Azizam`, publish products, place orders, send external messages, or make commercial decisions. A reviewer result never overrides a Compliance `BLOCK` or grants CEO approval.

## Activation checklist — requires Mar's explicit decision

- [ ] Review this draft PR and the workflow diffs.
- [ ] Confirm GitHub Actions permissions and branch protection on `Azizam`.
- [ ] Add `ANTHROPIC_API_KEY` as a GitHub Actions secret if/when the builder should be enabled.
- [ ] Add `OPENAI_API_KEY` as a GitHub Actions secret if/when the independent reviewer should be enabled. Never commit either key.
- [ ] Optionally define the repository variable `OPENAI_REVIEW_MODEL`; otherwise the workflow defaults to `gpt-5.5`.
- [ ] Verify the action versions and required permissions against official documentation.
- [ ] Keep `orchestrator/STOP` in place until explicitly deciding to enable model calls.
- [ ] After approval, test with a harmless task on a disposable branch; confirm tests, review output, STOP behavior, and no automatic merge.

## Emergency stop

Re-add `orchestrator/STOP` on the target branch to block future model calls. The reviewer checks the PR base commit, not the PR's proposed file changes, so a PR cannot disable its own STOP gate. Cancel any currently running GitHub Actions job in the Actions UI too; a file gate cannot retroactively stop a job that already passed it.

## Scope and safeguards

- Builder is manual-only; no schedule and no automatic run on every push.
- Default STOP file; builder also requires explicit start confirmation.
- Reviewer is limited to a bounded diff and only comments on the PR; it cannot edit code or merge.
- Unit tests run without any model call.
- No secrets, customer data, credentials, or unnecessary personal data in prompts or repository files.
- Model output is untrusted and must be checked against repository evidence.
- Mar is the final decision-maker. Compliance BLOCK remains a hard stop.
- The workflows have been added to a draft PR but have not been executed or validated by GitHub Actions yet.
