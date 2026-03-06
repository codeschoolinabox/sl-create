# src/

CLI scaffolder that generates new `@study-lenses` packages from the standard template,
replacing all placeholders with user-provided values.

## Structure

| Module                | Purpose                                               |
| --------------------- | ----------------------------------------------------- |
| `index.ts`            | CLI entry point — top-level await, collect → generate |
| `collect-input.ts`    | Collects name, description, author via readline       |
| `validate-name.ts`    | Validates package name against npm naming rules       |
| `derive-variables.ts` | Pure function: three answers → TemplateVariables      |
| `generate.ts`         | Creates directory, writes files, runs npm install     |
| `replace-tokens.ts`   | Ordered token replacement in template content         |
| `types.ts`            | TemplateVariables type definition                     |

## Conventions

- One default export per file; no barrel imports
- Types in `types.ts` per module
- Tests in `tests/` subdirectory
