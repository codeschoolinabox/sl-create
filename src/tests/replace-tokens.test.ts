import { describe, it, expect } from 'vitest';

import replaceTokens from '../replace-tokens.js';
import type TemplateVariables from '../types.js';

const testVariables: TemplateVariables = {
  name: 'utils-normalize',
  fullName: '@study-lenses/utils-normalize',
  repoName: 'sl-utils-normalize',
  githubOrg: 'codeschoolinabox',
  repoPath: 'codeschoolinabox/sl-utils-normalize',
  description: 'Config normalization utilities',
  author: '@codeschoolinabox',
  year: '2026',
};

describe('replaceTokens', () => {
  it('replaces scoped package name', () => {
    const result = replaceTokens('npm install @study-lenses/CHANGEME', testVariables);
    expect(result).toBe('npm install @study-lenses/utils-normalize');
  });

  it('replaces bare CHANGEME', () => {
    const result = replaceTokens('name: "CHANGEME"', testVariables);
    expect(result).toBe('name: "utils-normalize"');
  });

  it('replaces PACKAGE_DESCRIPTION', () => {
    const result = replaceTokens('"description": "PACKAGE_DESCRIPTION"', testVariables);
    expect(result).toBe('"description": "Config normalization utilities"');
  });

  it('replaces OWNER/REPO compound token', () => {
    const result = replaceTokens('https://github.com/OWNER/REPO', testVariables);
    expect(result).toBe('https://github.com/codeschoolinabox/sl-utils-normalize');
  });

  it('replaces OWNER.github.io/REPO URL', () => {
    const result = replaceTokens('https://OWNER.github.io/REPO/', testVariables);
    expect(result).toBe('https://codeschoolinabox.github.io/sl-utils-normalize/');
  });

  it('replaces [YEAR]', () => {
    const result = replaceTokens('Copyright (c) [YEAR]', testVariables);
    expect(result).toBe('Copyright (c) 2026');
  });

  it('replaces [NAME]', () => {
    const result = replaceTokens('MIT © [YEAR] [NAME]', testVariables);
    expect(result).toBe('MIT © 2026 @codeschoolinabox');
  });

  it('replaces all tokens in a single string', () => {
    const input = [
      '# @study-lenses/CHANGEME',
      '"description": "PACKAGE_DESCRIPTION"',
      'https://github.com/OWNER/REPO',
      'https://OWNER.github.io/REPO/',
      'MIT © [YEAR] [NAME]',
    ].join('\n');
    const result = replaceTokens(input, testVariables);
    expect(result).not.toContain('CHANGEME');
    expect(result).not.toContain('PACKAGE_DESCRIPTION');
    expect(result).not.toMatch(/\bOWNER\b/);
    expect(result).not.toMatch(/\bREPO\b/);
    expect(result).not.toContain('[YEAR]');
    expect(result).not.toContain('[NAME]');
  });

  it('does not replace scoped name partially when bare CHANGEME also exists', () => {
    const input = '@study-lenses/CHANGEME and also CHANGEME';
    const result = replaceTokens(input, testVariables);
    expect(result).toBe('@study-lenses/utils-normalize and also utils-normalize');
  });

  it('replaces compound OWNER/REPO before bare OWNER and bare REPO', () => {
    const input = 'https://github.com/OWNER/REPO OWNER.github.io/REPO REPO-only';
    const result = replaceTokens(input, testVariables);
    expect(result).toBe(
      'https://github.com/codeschoolinabox/sl-utils-normalize ' +
      'codeschoolinabox.github.io/sl-utils-normalize ' +
      'sl-utils-normalize-only',
    );
  });

  it('returns content unchanged when no tokens are present', () => {
    const input = 'No tokens here, just plain text.';
    const result = replaceTokens(input, testVariables);
    expect(result).toBe(input);
  });
});
