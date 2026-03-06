/**
 * Replaces placeholder tokens in template content with actual values.
 *
 * Ordering matters — compound tokens must be replaced before their substrings:
 * 1. `PACKAGE_DESCRIPTION` → description (before CHANGEME could match)
 * 2. `@study-lenses/CHANGEME` → scoped package name (before bare CHANGEME)
 * 3. `CHANGEME` → package suffix
 * 4. `OWNER/REPO` → GitHub owner/repo path (before bare OWNER or REPO)
 * 5. `OWNER` → GitHub org (for OWNER.github.io URLs)
 * 6. `REPO` → repo directory name (for remaining REPO references)
 * 7. `[YEAR]` → copyright year
 * 8. `[NAME]` → author name
 */

import type TemplateVariables from './types.js';

function replaceTokens(content: string, variables: TemplateVariables): string {
  return content
    .replaceAll('PACKAGE_DESCRIPTION', variables.description)
    .replaceAll('@study-lenses/CHANGEME', variables.fullName)
    .replaceAll('CHANGEME', variables.name)
    .replaceAll('OWNER/REPO', variables.repoPath)
    .replaceAll('OWNER', variables.githubOrg)
    .replaceAll('REPO', variables.repoName)
    .replaceAll('[YEAR]', variables.year)
    .replaceAll('[NAME]', variables.author);
}

export default replaceTokens;
