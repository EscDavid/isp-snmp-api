import { env } from '../../shared/config/env.validator.js';
import { OidBlockedError } from '../../shared/errors/app-error.js';

export interface OidPolicyConfig {
  allowPrefixes: string[];
  denyPrefixes: string[];
}

function parsePrefixList(rawValue: string): string[] {
  return rawValue
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
}

export class OidPolicyService {
  private readonly config: OidPolicyConfig;

  constructor(config?: Partial<OidPolicyConfig>) {
    this.config = {
      allowPrefixes: config?.allowPrefixes ?? parsePrefixList(env.OID_ALLOWLIST),
      denyPrefixes: config?.denyPrefixes ?? parsePrefixList(env.OID_DENYLIST),
    };
  }

  assertAllowed(oid: string): void {
    const isDenied = this.config.denyPrefixes.some((prefix) => oid === prefix || oid.startsWith(`${prefix}.`));
    if (isDenied) {
      throw new OidBlockedError(oid);
    }

    if (this.config.allowPrefixes.length === 0) {
      return;
    }

    const isAllowed = this.config.allowPrefixes.some((prefix) => oid === prefix || oid.startsWith(`${prefix}.`));
    if (!isAllowed) {
      throw new OidBlockedError(oid);
    }
  }
}
