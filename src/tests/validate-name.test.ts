import { describe, it, expect } from 'vitest';

import validateName from '../validate-name.js';

describe('validateName', () => {
  it('accepts a valid hyphenated name', () => {
    expect(() => validateName('utils-normalize')).not.toThrow();
  });

  it('accepts a single letter', () => {
    expect(() => validateName('a')).not.toThrow();
  });

  it('accepts letters with numbers', () => {
    expect(() => validateName('deep-merge-2')).not.toThrow();
  });

  it('rejects empty string', () => {
    expect(() => validateName('')).toThrow('Invalid package name');
  });

  it('rejects leading underscore', () => {
    expect(() => validateName('_leading')).toThrow('Invalid package name');
  });

  it('rejects leading dot', () => {
    expect(() => validateName('.dot')).toThrow('Invalid package name');
  });

  it('rejects uppercase letters', () => {
    expect(() => validateName('UPPER')).toThrow('Invalid package name');
  });

  it('rejects mixed case', () => {
    expect(() => validateName('camelCase')).toThrow('Invalid package name');
  });

  it('rejects spaces', () => {
    expect(() => validateName('has spaces')).toThrow('Invalid package name');
  });

  it('rejects leading number', () => {
    expect(() => validateName('123numeric')).toThrow('Invalid package name');
  });

  it('rejects leading hyphen', () => {
    expect(() => validateName('-leading-hyphen')).toThrow('Invalid package name');
  });

  it('rejects special characters', () => {
    expect(() => validateName('special$char')).toThrow('Invalid package name');
  });

  it('includes the invalid name in the error message', () => {
    expect(() => validateName('BAD')).toThrow('"BAD"');
  });
});
