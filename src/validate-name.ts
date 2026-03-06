/**
 * Validates a package name suffix against npm naming rules.
 *
 * Must be lowercase, start with a letter, and contain only letters,
 * numbers, and hyphens. This is the only guard preventing generation
 * of broken package names.
 *
 * @throws Error if name is invalid
 */

/** npm package name suffix pattern: lowercase, hyphens, no leading dot/underscore */
const VALID_NAME_PATTERN = /^[a-z][a-z0-9-]*$/;

function validateName(name: string): void {
  if (!VALID_NAME_PATTERN.test(name)) {
    throw new Error(
      `Invalid package name "${name}". ` +
      'Must be lowercase, start with a letter, and contain only letters, numbers, and hyphens.',
    );
  }
}

export default validateName;
