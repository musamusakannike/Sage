import { describe, it, expect } from 'vitest';
import { decodeJwt, getApiErrorMessage } from '../utils';

function makeJwt(payload: object): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body   = btoa(JSON.stringify(payload));
  return `${header}.${body}.fakesignature`;
}

describe('decodeJwt', () => {
  it('extracts sub, email, role, orgId from a valid JWT', () => {
    const token = makeJwt({ sub: 'u1', email: 'a@b.com', role: 'hr_admin', orgId: 'org1' });
    const result = decodeJwt(token);
    expect(result).toEqual({ sub: 'u1', email: 'a@b.com', role: 'hr_admin', orgId: 'org1' });
  });

  it('returns null for a malformed token', () => {
    expect(decodeJwt('not.a.jwt')).toBeNull();
  });

  it('returns null for an empty string', () => {
    expect(decodeJwt('')).toBeNull();
  });
});

describe('getApiErrorMessage', () => {
  it('extracts a string message from an axios error response', () => {
    const err = { response: { data: { message: 'Invalid credentials' } } };
    expect(getApiErrorMessage(err)).toBe('Invalid credentials');
  });

  it('joins array messages with commas', () => {
    const err = { response: { data: { message: ['email must be valid', 'password too short'] } } };
    expect(getApiErrorMessage(err)).toBe('email must be valid, password too short');
  });

  it('returns fallback for unknown error shapes', () => {
    expect(getApiErrorMessage(new Error('Network error'))).toBe('Something went wrong. Please try again.');
    expect(getApiErrorMessage(null)).toBe('Something went wrong. Please try again.');
  });
});
