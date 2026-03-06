#!/usr/bin/env node

/**
 * CLI entry point for @study-lenses/create.
 *
 * Usage: npm create @study-lenses
 *    or: npx @study-lenses/create
 */

import path from 'node:path';

import collectInput from './collect-input.js';
import generate from './generate.js';

try {
  const variables = await collectInput();
  const outputDirectory = path.resolve(process.cwd(), variables.repoName);

  console.log(`\nCreating ${variables.fullName} in ${outputDirectory}...\n`);

  generate(outputDirectory, variables);

  console.log(`\nDone! Created ${variables.repoName}/`);
  console.log('\nNext steps:');
  console.log(`  cd ${variables.repoName}`);
  console.log('  npm run validate');
  console.log('  # Fill in TODO markers in README.md, DOCS.md, src/README.md, src/DOCS.md');
} catch (error: unknown) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
