# @study-lenses/create-package

[![npm version](https://img.shields.io/npm/v/@study-lenses/create-package.svg)](https://www.npmjs.com/package/@study-lenses/create-package)
[![CI](https://github.com/codeschoolinabox/sl-create-package/actions/workflows/ci.yml/badge.svg)](https://github.com/codeschoolinabox/sl-create-package/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

> CLI scaffolder that generates new `@study-lenses` packages from the standard template,
> replacing all placeholders with user-provided values.

## Pedagogical Purpose

**Neutral infrastructure:** This package generates the boilerplate for new `@study-lenses`
packages. It makes no pedagogical decisions — those belong in the packages it creates.

## Who Is This For

**Primary — Educational tool developers:** Creating new `@study-lenses` packages. Instead
of forking `sl-starter` and manually finding/replacing ~15 placeholders across 8+ files,
run one command and get a correct package on first try.

## Install

Not installed as a dependency. Run directly:

```bash
npm create @study-lenses
# or
npx @study-lenses/create-package
```

## Quick Start

```bash
npm create @study-lenses
# Package name (e.g., utils-normalize): utils-normalize
# Description: Config normalization utilities
# Author (@codeschoolinabox):
#
# Creating @study-lenses/utils-normalize in /path/to/sl-utils-normalize...
# Done!
```

The CLI asks three questions, then generates `sl-{name}/` with all files from the
standard template, all placeholders replaced, git initialized, and dependencies installed.

## Design Principles

### What this package provides

- Generates a complete `@study-lenses` package directory from the standard template
- Replaces all placeholder tokens (CHANGEME, @study-lenses/CHANGEME, OWNER/REPO, OWNER, REPO, PACKAGE_DESCRIPTION, [YEAR], [NAME])
- Initializes git and runs `npm install`
- Validates package name against npm naming rules

### What this package does NOT do

- No `--update` mode (re-generating templates in existing packages is deferred)
- No interactive file selection (all template files are always generated)
- No custom template support (uses the single standard template)

## API Reference

Generated from TSDoc comments in source. Run `npm run docs` locally, or see the
[hosted API docs](https://codeschoolinabox.github.io/sl-create-package/).

## Architecture

The CLI is a three-step pipeline:

1. **Collect Input** (`collect-input.ts`) — collects package name, description, author via readline
2. **Derive** (`derive-variables.ts`) — computes all template variables from the three answers
3. **Generate** (`generate.ts`) — walks `templates/` directory, replaces tokens, writes files

Templates are shipped as real files in the `templates/` directory (not embedded strings).
Token replacement uses `String.prototype.replaceAll()` in a specific order to avoid
substring collisions (e.g., `@study-lenses/CHANGEME` before bare `CHANGEME`).

See [DEV.md](./DEV.md) for full architecture, conventions, and the TDD workflow.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) and [DEV.md](./DEV.md).

## License

MIT © 2026 @codeschoolinabox
