/**
 * Derives all template variables from user-provided input.
 *
 * No file or network I/O. Takes the three user answers and returns
 * a complete TemplateVariables object used by the generator.
 * Reads the system clock for the copyright year.
 */

import type TemplateVariables from './types.js';

/** GitHub org that owns all @study-lenses repos */
const GITHUB_ORG = 'codeschoolinabox';

function deriveVariables(name: string, description: string, author: string): TemplateVariables {
  return {
    name,
    fullName: `@study-lenses/${name}`,
    repoName: `sl-${name}`,
    githubOrg: GITHUB_ORG,
    repoPath: `${GITHUB_ORG}/sl-${name}`,
    description,
    author,
    year: String(new Date().getFullYear()),
  };
}

export default deriveVariables;
