/**
 * Generates a new @study-lenses package directory from templates.
 *
 * Walks the templates/ directory, replaces placeholder tokens in each file,
 * and writes the result to the output directory. Then runs git init + npm install.
 */

import { execSync } from 'node:child_process';
import { chmodSync, existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import replaceTokens from './replace-tokens.js';
import type TemplateVariables from './types.js';

/** Files that contain placeholder tokens and need replacement */
const FILES_WITH_TOKENS = new Set([
  'package.json',
  'README.md',
  'DOCS.md',
  'LICENSE',
  'src/README.md',
  '.github/ISSUE_TEMPLATE/bug-report.yml',
]);

/** Files that need executable permission */
const EXECUTABLE_FILES = new Set([
  '.husky/pre-commit',
]);

/**
 * Files that must be renamed from template name to output name.
 * npm strips dotfiles like .gitignore from published packages,
 * so we ship them without the dot and rename during generation.
 */
const FILE_RENAMES = new Map([
  ['gitignore', '.gitignore'],
]);

/**
 * Resolves the path to the templates/ directory shipped with the package.
 * Works both in development (src/) and after build (dist/).
 */
function getTemplatesDirectory(): string {
  const thisFile = fileURLToPath(import.meta.url);
  const thisDirectory = path.dirname(thisFile);
  // In dist/: dist/generate.js → project root → templates/
  // In src/:  src/generate.ts → project root → templates/
  return path.resolve(thisDirectory, '..', 'templates');
}

/**
 * Recursively collects all file paths relative to a base directory.
 */
function collectFiles(
  baseDirectory: string,
  currentDirectory: string = '',
): readonly string[] {
  const absoluteDirectory = path.join(baseDirectory, currentDirectory);
  const entries = readdirSync(absoluteDirectory);

  return entries.flatMap((entry) =>
    statSync(path.join(absoluteDirectory, entry)).isDirectory()
      ? [
          ...collectFiles(
            baseDirectory,
            currentDirectory ? `${currentDirectory}/${entry}` : entry,
          ),
        ]
      : [currentDirectory ? `${currentDirectory}/${entry}` : entry],
  );
}

/**
 * Generates a new package directory with all templates processed.
 *
 * @param outputDirectory - Absolute path to the output directory
 * @param variables - Template variables for placeholder replacement
 */
function generate(outputDirectory: string, variables: TemplateVariables): void {
  if (existsSync(outputDirectory)) {
    throw new Error(`Directory already exists: ${outputDirectory}`);
  }

  const templatesDirectory = getTemplatesDirectory();
  const templateFiles = collectFiles(templatesDirectory);

  for (const relativePath of templateFiles) {
    const sourcePath = path.join(templatesDirectory, relativePath);
    const outputRelativePath = FILE_RENAMES.get(relativePath) ?? relativePath;
    const targetPath = path.join(outputDirectory, outputRelativePath);

    // Ensure target directory exists
    const targetDirectory = path.dirname(targetPath);
    mkdirSync(targetDirectory, { recursive: true });

    const content = readFileSync(sourcePath, 'utf8');
    const processed = FILES_WITH_TOKENS.has(relativePath)
      ? replaceTokens(content, variables)
      : content;

    writeFileSync(targetPath, processed, 'utf8');

    // Set executable permission where needed (husky hooks)
    if (EXECUTABLE_FILES.has(relativePath)) {
      chmodSync(targetPath, 0o755);
    }
  }

  // Initialize git repo and install dependencies
  console.log('\nInitializing git repository...');
  // eslint-disable-next-line sonarjs/no-os-command-from-path
  execSync('git init', { cwd: outputDirectory, stdio: 'ignore', timeout: 30_000 });

  console.log('Installing dependencies (this may take a moment)...');
  // eslint-disable-next-line sonarjs/no-os-command-from-path
  execSync('npm install', { cwd: outputDirectory, stdio: 'inherit', timeout: 120_000 });
}

export default generate;
