import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryRateLimiter } from '../lib/rate-limit.js';

describe('InMemoryRateLimiter', () => {
  let limiter: InMemoryRateLimiter;

  beforeEach(() => {
    limiter = new InMemoryRateLimiter({ windowMs: 60_000, max: 3 });
  });

  it('allows requests under the limit', () => {
    expect(limiter.allow('user-1')).toBe(true);
    expect(limiter.allow('user-1')).toBe(true);
    expect(limiter.allow('user-1')).toBe(true);
  });

  it('blocks requests over the limit', () => {
    limiter.allow('user-1');
    limiter.allow('user-1');
    limiter.allow('user-1');
    expect(limiter.allow('user-1')).toBe(false);
  });

  it('tracks different users independently', () => {
    limiter.allow('user-1');
    limiter.allow('user-1');
    limiter.allow('user-1');
    expect(limiter.allow('user-1')).toBe(false);
    expect(limiter.allow('user-2')).toBe(true);
  });
});
