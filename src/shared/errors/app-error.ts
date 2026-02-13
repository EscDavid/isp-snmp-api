export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export class OidBlockedError extends AppError {
  constructor(oid: string) {
    super(`OID is blocked by policy: ${oid}`, 403, 'OID_BLOCKED');
  }
}

export class UnsupportedVendorError extends AppError {
  constructor(vendor: string) {
    super(`Unsupported vendor: ${vendor}`, 422, 'UNSUPPORTED_VENDOR');
  }
}
