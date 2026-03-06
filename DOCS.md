# @study-lenses/create — Architecture & Decisions

## Why this package exists

Every new `@study-lenses` package starts from the same template (`sl-starter`). Previously
this meant forking the repo and manually replacing ~15 placeholder tokens across 8+ files —
tedious, error-prone, and a known source of bugs (missed placeholders in `sl-utils-deep`
proved the need). This CLI automates that: same output as `sl-starter`, zero manual
placeholder replacement.

## Architecture

```text
User input → deriveVariables() → generate()
                                    ├── walk templates/ directory
                                    ├── replaceTokens() on marked files
                                    ├── writeFileSync each file
                                    ├── chmodSync for executable files
                                    ├── git init
                                    └── npm install
```

- **Templates as files, not strings**: The `templates/` directory contains the actual
  template files shipped with the package. This avoids maintaining multi-thousand-line
  string literals (AGENTS.md alone is ~576 lines).

- **Token replacement, not a template engine**: `replaceTokens()` uses
  `String.prototype.replaceAll()` with 8 ordered replacements. No Handlebars, no EJS,
  no regex. The ordering prevents substring collisions.

- **Only 6 files need token replacement**: The other ~25 files are copied verbatim.
  `FILES_WITH_TOKENS` set in `generate.ts` controls which files get processed.

## Key decisions

### Token replacement ordering

Compound tokens must be replaced before their substrings:

1. `PACKAGE_DESCRIPTION` → description (before any other match)
2. `@study-lenses/CHANGEME` → scoped name (before bare CHANGEME)
3. `CHANGEME` → package suffix
4. `OWNER/REPO` → GitHub owner/repo (before bare OWNER or REPO)
5. `OWNER` → GitHub org (for `OWNER.github.io` URLs)
6. `REPO` → repo directory name
7. `[YEAR]` → copyright year
8. `[NAME]` → author name

### No template engine

`replaceAll` is simpler, has zero dependencies, and the token set is fixed and small.
A template engine would add complexity for no benefit at this scale.

### `deriveVariables` as a separate module

Pure function with no I/O, separated from the readline collect-input module. This makes it
independently testable and satisfies the project's `import/no-named-export` rule
(each module has exactly one default export).

## What this package deliberately does NOT do

- **No `--update` mode**: Re-generating templates in existing packages requires diffing
  and conflict resolution. Deferred to a future version. Notes in
  `scaffolder-update-mode-notes.md`.

- **No programmatic API**: This is a CLI tool, not a library. The `generate()` function
  is exported for testing but not documented as a public API.

- **No custom templates**: Only the standard `@study-lenses` template is supported.
  If we need multiple templates, the architecture supports it (different `templates/`
  directories), but it's not built until needed.
