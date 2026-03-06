/**
 * Variables derived from user prompts, used by template functions
 * to replace placeholders in generated files.
 */
type TemplateVariables = {
  /** Package suffix — e.g., "utils-normalize" */
  readonly name: string;
  /** Scoped package name — e.g., "@study-lenses/utils-normalize" */
  readonly fullName: string;
  /** Repository directory name — e.g., "sl-utils-normalize" */
  readonly repoName: string;
  /** GitHub org — e.g., "codeschoolinabox" */
  readonly githubOrg: string;
  /** GitHub owner/repo — e.g., "codeschoolinabox/sl-utils-normalize" */
  readonly repoPath: string;
  /** One-line package description */
  readonly description: string;
  /** Package author — e.g., "@codeschoolinabox" */
  readonly author: string;
  /** Copyright year — e.g., "2026" */
  readonly year: string;
};

export default TemplateVariables;
