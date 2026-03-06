import { describe, it, expect } from 'vitest';

import deriveVariables from '../derive-variables.js';

describe('deriveVariables', () => {
  it('derives all template variables from user input', () => {
    const variables = deriveVariables('utils-normalize', 'Config normalization', '@codeschoolinabox');

    expect(variables.name).toBe('utils-normalize');
    expect(variables.fullName).toBe('@study-lenses/utils-normalize');
    expect(variables.repoName).toBe('sl-utils-normalize');
    expect(variables.githubOrg).toBe('codeschoolinabox');
    expect(variables.repoPath).toBe('codeschoolinabox/sl-utils-normalize');
    expect(variables.description).toBe('Config normalization');
    expect(variables.author).toBe('@codeschoolinabox');
    expect(variables.year).toBe(String(new Date().getFullYear()));
  });

  it('preserves custom author', () => {
    const variables = deriveVariables('error-base', 'Shared base error', 'Custom Author');

    expect(variables.author).toBe('Custom Author');
  });

  it('handles single-character name', () => {
    const variables = deriveVariables('a', 'Minimal package', 'Author');

    expect(variables.fullName).toBe('@study-lenses/a');
    expect(variables.repoName).toBe('sl-a');
    expect(variables.repoPath).toBe('codeschoolinabox/sl-a');
  });

  it('handles name with numbers', () => {
    const variables = deriveVariables('deep-merge-2', 'Deep merge v2', 'Author');

    expect(variables.repoName).toBe('sl-deep-merge-2');
  });

  it('does not validate inputs (validation happens in collect-input)', () => {
    // deriveVariables is a pure derivation function — it does not validate.
    // Empty strings produce structurally valid but semantically wrong output.
    const variables = deriveVariables('', '', '');

    expect(variables.fullName).toBe('@study-lenses/');
    expect(variables.repoName).toBe('sl-');
  });
});
