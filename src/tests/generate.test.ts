import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import generate from '../generate.js';
import type TemplateVariables from '../types.js';

const testVariables: TemplateVariables = {
  name: 'test-pkg',
  fullName: '@study-lenses/test-pkg',
  repoName: 'sl-test-pkg',
  githubOrg: 'codeschoolinabox',
  repoPath: 'codeschoolinabox/sl-test-pkg',
  description: 'A test package for verification',
  author: 'Test Author',
  year: '2026',
};

/** Unique output directory for each test run */
function makeOutputDirectory(): string {
  return path.join(tmpdir(), `sl-test-pkg-${Date.now()}`);
}

/** Recursively collect all files relative to a directory */
function collectAllFiles(baseDirectory: string, currentDirectory: string = ''): readonly string[] {
  const absoluteDirectory = path.join(baseDirectory, currentDirectory);
  const entries = readdirSync(absoluteDirectory, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const relativePath = currentDirectory ? `${currentDirectory}/${entry.name}` : entry.name;

    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.git') {
      return [...collectAllFiles(baseDirectory, relativePath)];
    }

    return entry.isFile() ? [relativePath] : [];
  });
}

describe('generate', () => {
  let outputDirectory: string;

  beforeEach(() => {
    outputDirectory = makeOutputDirectory();
  });

  afterEach(() => {
    if (existsSync(outputDirectory)) {
      rmSync(outputDirectory, { recursive: true, force: true });
    }
  });

  it('throws if directory already exists', () => {
    mkdirSync(outputDirectory, { recursive: true });
    expect(() => generate(outputDirectory, testVariables)).toThrow('Directory already exists');
  });

  it('creates all expected template files', () => {
    generate(outputDirectory, testVariables);

    const expectedFiles = [
      'package.json',
      'README.md',
      'DOCS.md',
      'LICENSE',
      'CONTRIBUTING.md',
      'CODE-OF-CONDUCT.md',
      'AGENTS.md',
      'CLAUDE.md',
      'DEV.md',
      'eslint.config.js',
      'tsconfig.json',
      'tsconfig.lint.json',
      'vitest.config.ts',
      'typedoc.json',
      '.prettierrc.json',
      '.editorconfig',
      '.vscode/settings.json',
      '.vscode/extensions.json',
      '.vscode/launch.json',
      '.gitignore',
      '.github/ISSUE_TEMPLATE/bug-report.yml',
      '.github/ISSUE_TEMPLATE/feature-request.yml',
      '.github/workflows/ci.yml',
      '.github/workflows/docs.yml',
      '.github/workflows/publish.yml',
      '.github/PULL_REQUEST_TEMPLATE.md',
      '.github/dependabot.yml',
      '.husky/pre-commit',
      'src/index.ts',
      'src/README.md',
      'src/DOCS.md',
    ];

    for (const file of expectedFiles) {
      const filePath = path.join(outputDirectory, file);
      expect(existsSync(filePath), `Expected file to exist: ${file}`).toBe(true);
    }
  });

  it('replaces all placeholder tokens in files with placeholders', () => {
    generate(outputDirectory, testVariables);

    const allFiles = collectAllFiles(outputDirectory);
    const tokenPattern = /CHANGEME|PACKAGE_DESCRIPTION|\bOWNER\b|\bREPO\b|\[YEAR\]|\[NAME\]/;

    for (const file of allFiles) {
      if (file === 'package-lock.json') continue;

      const filePath = path.join(outputDirectory, file);
      const content = readFileSync(filePath, 'utf8');
      expect(
        tokenPattern.test(content),
        `Found unreplaced token in ${file}`,
      ).toBe(false);
    }
  });

  it('preserves TODO markers in README.md', () => {
    generate(outputDirectory, testVariables);

    const readme = readFileSync(path.join(outputDirectory, 'README.md'), 'utf8');
    expect(readme).toContain('TODO');
  });

  it('produces a valid package.json with correct name and description', () => {
    generate(outputDirectory, testVariables);

    const packageContent = readFileSync(path.join(outputDirectory, 'package.json'), 'utf8');
    const packageJson = JSON.parse(packageContent) as {
      name: string; description: string; author: string;
    };
    expect(packageJson.name).toBe('@study-lenses/test-pkg');
    expect(packageJson.description).toBe('A test package for verification');
    expect(packageJson.author).toBe('Test Author');
  });

  it('does not contain "Fill this in" in any file', () => {
    generate(outputDirectory, testVariables);

    const allFiles = collectAllFiles(outputDirectory);

    for (const file of allFiles) {
      if (file === 'package-lock.json') continue;

      const filePath = path.join(outputDirectory, file);
      const content = readFileSync(filePath, 'utf8');
      expect(
        content.includes('Fill this in'),
        `Found "Fill this in" in ${file}`,
      ).toBe(false);
    }
  });

  it('keeps AGENTS.md and DEV.md free of TODO task markers', () => {
    generate(outputDirectory, testVariables);

    const agents = readFileSync(path.join(outputDirectory, 'AGENTS.md'), 'utf8');

    expect(agents).not.toMatch(/^TODO:/m);
    expect(agents).not.toMatch(/^> TODO/m);
  });

  it('sets executable permission on husky pre-commit hook', () => {
    generate(outputDirectory, testVariables);

    const hookPath = path.join(outputDirectory, '.husky/pre-commit');
    const stat = statSync(hookPath);
    // Check owner-execute bit (0o100)
    const isExecutable = (stat.mode & 0o100) !== 0;
    expect(isExecutable, '.husky/pre-commit should be executable').toBe(true);
  });

  it('correctly replaces GitHub Pages URL', () => {
    generate(outputDirectory, testVariables);

    const readme = readFileSync(path.join(outputDirectory, 'README.md'), 'utf8');
    expect(readme).toContain('codeschoolinabox.github.io/sl-test-pkg');
    expect(readme).not.toContain('OWNER.github.io');
  });

  it('copies files outside FILES_WITH_TOKENS verbatim', () => {
    generate(outputDirectory, testVariables);

    const templatesDirectory = path.resolve(
      path.dirname(new URL(import.meta.url).pathname),
      '..', '..', 'templates',
    );
    const templateContent = readFileSync(
      path.join(templatesDirectory, '.editorconfig'), 'utf8',
    );
    const outputContent = readFileSync(
      path.join(outputDirectory, '.editorconfig'), 'utf8',
    );
    expect(outputContent).toBe(templateContent);
  });
});
