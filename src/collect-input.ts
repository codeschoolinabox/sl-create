/**
 * Collects user input via readline prompts.
 *
 * Asks three questions: package name, description, and author.
 * Delegates validation to validate-name.ts and derivation to derive-variables.ts.
 */

import { createInterface } from 'node:readline';

import deriveVariables from './derive-variables.js';
import type TemplateVariables from './types.js';
import validateName from './validate-name.js';

/**
 * Asks a single question via readline and returns the answer.
 * Returns the default value if the user presses Enter without typing.
 */
function ask(
  rl: ReturnType<typeof createInterface>,
  question: string,
  defaultValue: string = '',
): Promise<string> {
  const prompt = defaultValue ? `${question} (${defaultValue}): ` : `${question}: `;

  return new Promise((resolve) =>
    rl.question(prompt, (answer) => resolve(answer.trim() || defaultValue)),
  );
}

/**
 * Runs the interactive prompts and returns derived template variables.
 */
async function collectInput(): Promise<TemplateVariables> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    console.log('\nCreate a new @study-lenses package\n');

    const name = await ask(rl, 'Package name (e.g., utils-normalize)');
    if (!name) {
      throw new Error('Package name is required');
    }
    validateName(name);

    const description = await ask(rl, 'Description');
    if (!description) {
      throw new Error('Description is required');
    }
    if (description.includes('"') || description.includes('\n')) {
      throw new Error('Description must not contain double quotes or newlines.');
    }

    const author = await ask(rl, 'Author', '@codeschoolinabox');
    if (author.includes('"') || author.includes('\n')) {
      throw new Error('Author must not contain double quotes or newlines.');
    }

    return deriveVariables(name, description, author);
  } finally {
    rl.close();
  }
}

export default collectInput;
