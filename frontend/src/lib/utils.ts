import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { AuthUser } from '@/lib/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function decodeJwt(token: string): AuthUser | null {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return {
      sub: decoded.sub,
      email: decoded.email,
      role: decoded.role,
      orgId: decoded.orgId,
    };
  } catch {
    return null;
  }
}

/**
 * Mongo `_id` can arrive in several shapes depending on how the server
 * serialized it (plain string, Extended-JSON `{ $oid }`, or a BSON ObjectId
 * whose internal byte buffer leaked through ClassSerializerInterceptor).
 * This always returns a usable 24-char hex string.
 */
export function extractId(value: unknown): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    const v = value as Record<string, unknown>;

    if (typeof v.$oid === 'string') return v.$oid;

    const asStr = (v as { toString?: () => string }).toString?.();
    if (asStr && asStr !== '[object Object]') return asStr;

    // BSON ObjectId byte buffer: { buffer: {0:..,1:..} } or { id: Uint8Array }
    const raw =
      (v.buffer && typeof v.buffer === 'object' ? v.buffer : null) ??
      (v.id && typeof v.id === 'object' ? v.id : null);
    if (raw) {
      const bytes = Object.values(raw as Record<string, number>);
      if (bytes.length === 12) {
        return bytes.map(b => (b & 0xff).toString(16).padStart(2, '0')).join('');
      }
    }
  }
  return String(value);
}

export function getApiErrorMessage(error: unknown): string {
  if (
    error &&
    typeof error === 'object' &&
    'response' in error
  ) {
    const res = (error as { response: { data: { message: unknown } } }).response;
    const msg = res?.data?.message;
    if (Array.isArray(msg)) return msg.join(', ');
    if (typeof msg === 'string') return msg;
  }
  return 'Something went wrong. Please try again.';
}
