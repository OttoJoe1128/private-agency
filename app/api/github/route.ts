// Deprecated: Vite + React on Vercel does not use Next.js App Router API routes.
// The active Serverless Function is in /api/github.ts.
// This file is intentionally left as a no-op to avoid routing confusion.
export const runtime = 'edge';

export async function GET() {
  return new Response(JSON.stringify({
    message: 'Deprecated route. Use /api/github on the Vercel root.',
    correctPath: '/api/github',
  }), {
    status: 410,
    headers: { 'Content-Type': 'application/json' },
  });
}
