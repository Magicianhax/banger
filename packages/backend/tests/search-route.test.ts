import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/giphy', () => ({
  searchGiphy: vi.fn(async () => [
    { id: 'g1', url: 'https://g/1.gif', preview_url: 'https://g/1p.gif', title: 'g', tags: [], source: 'giphy', width: 1, height: 1 },
  ]),
}));
vi.mock('@/lib/tenor', () => ({
  searchTenor: vi.fn(async () => [
    { id: 't1', url: 'https://t/1.gif', preview_url: 'https://t/1p.gif', title: 't', tags: [], source: 'tenor', width: 1, height: 1 },
  ]),
}));

import { POST } from '../app/api/search/route.js';

describe('POST /api/search', () => {
  beforeEach(() => {
    process.env.GIPHY_API_KEY = 'k';
    process.env.TENOR_API_KEY = 'k';
  });

  it('returns merged candidates from both sources', async () => {
    const req = new Request('http://localhost/api/search', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-install-id': 'user-1' },
      body: JSON.stringify({ queries: ['laugh'], limit: 5 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.candidates).toHaveLength(2);
  });

  it('rejects requests without install id', async () => {
    const req = new Request('http://localhost/api/search', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ queries: ['laugh'], limit: 5 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('rejects invalid payload', async () => {
    const req = new Request('http://localhost/api/search', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-install-id': 'u1' },
      body: JSON.stringify({ wrong: true }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
