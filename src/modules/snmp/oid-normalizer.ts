const OID_PATTERN = /^\.?(\d+)(\.\d+)*$/;

export function normalizeOid(oid: string): string {
  const cleanedOid = oid.trim();

  if (!cleanedOid) {
    throw new Error('OID is required');
  }

  if (!OID_PATTERN.test(cleanedOid)) {
    throw new Error('OID format is invalid');
  }

  return cleanedOid.startsWith('.') ? cleanedOid.slice(1) : cleanedOid;
}
