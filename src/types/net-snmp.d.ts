declare module 'net-snmp' {
  export interface Varbind {
    oid: string;
    type: number;
    value: unknown;
  }

  export interface Options {
    port?: number;
    retries?: number;
    timeout?: number;
    transport?: 'udp4' | 'udp6';
    version?: number;
  }

  export interface Session {
    get(oids: string[], callback: (error: Error | null, varbinds: Varbind[]) => void): void;
    close(): void;
  }

  export const Version2c: number;
  export const ObjectType: Record<number, string>;

  export function createSession(target: string, community: string, options?: Options): Session;
  export function isVarbindError(varbind: Varbind): boolean;
  export function varbindError(varbind: Varbind): string;

  const netSnmp: {
    createSession: typeof createSession;
    isVarbindError: typeof isVarbindError;
    varbindError: typeof varbindError;
    ObjectType: typeof ObjectType;
    Version2c: typeof Version2c;
  };

  export default netSnmp;
}
