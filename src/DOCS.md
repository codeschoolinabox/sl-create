# src — Architecture & Decisions

The source has a linear flow: `index.ts` → `collect-input.ts` → `derive-variables.ts` →
`generate.ts` → `replace-tokens.ts`. Each module has a single responsibility.

- `index.ts` orchestrates the CLI (top-level await, error handling, user messages)
- `collect-input.ts` handles I/O (readline) — the only module that touches stdin/stdout
- `validate-name.ts` is a pure validation function (regex check, throws on invalid input)
- `derive-variables.ts` is a pure derivation function (no I/O, fully testable in isolation)
- `generate.ts` handles filesystem operations (read templates, write output, chmod, git, npm)
- `replace-tokens.ts` is a pure string transformation (no I/O, fully testable)

## Module boundaries

The ESLint `boundaries` plugin enforces a DAG between modules. See `eslint.config.js`
for the full dependency graph. In short:

- `index.ts` depends on `collect-input.ts` and `generate.ts`
- `collect-input.ts` depends on `derive-variables.ts`, `validate-name.ts`, and `types.ts`
- `validate-name.ts` depends on nothing
- `derive-variables.ts` depends on `types.ts`
- `generate.ts` depends on `replace-tokens.ts` and `types.ts`
- `replace-tokens.ts` depends on `types.ts`
- `types.ts` depends on nothing

## Why no barrel files?

Importing directly from source files (no `index.ts` re-exports except at package entry)
keeps the dependency graph explicit and prevents accidental coupling. The `boundaries`
plugin enforces this.
