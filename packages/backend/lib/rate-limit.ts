export class InMemoryRateLimiter {
  private buckets = new Map<string, number[]>();

  constructor(private opts: { windowMs: number; max: number }) {}

  allow(key: string): boolean {
    const now = Date.now();
    const windowStart = now - this.opts.windowMs;
    const timestamps = (this.buckets.get(key) ?? []).filter((t) => t > windowStart);
    if (timestamps.length >= this.opts.max) {
      this.buckets.set(key, timestamps);
      return false;
    }
    timestamps.push(now);
    this.buckets.set(key, timestamps);
    return true;
  }
}
