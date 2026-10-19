export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  }

  try {
    // Simple in-memory ISR cache (3600s)
    // Stored at module-level so it survives warm lambdas in many serverless environments.
    // NOTE: This is intentionally lightweight — for stronger caching use Redis or similar.
    if (!(global as any).__github_cache) {
      (global as any).__github_cache = { data: null, timestamp: 0 };
    }
    const CACHE = (global as any).__github_cache as { data: any; timestamp: number };
    const CACHE_TTL_MS = 3600 * 1000;

    const now = Date.now();
    if (CACHE.data && now - CACHE.timestamp < CACHE_TTL_MS) {
      return res.status(200).json({ ok: true, cached: true, data: CACHE.data });
    }

    const token = process.env.GITHUB_TOKEN;
    const username = process.env.GITHUB_USERNAME || 'OttoJoe1128';

    if (!token) {
      return res.status(401).json({ error: 'GITHUB_TOKEN missing in environment' });
    }

    const query = `
      query($username: String!) {
        user(login: $username) {
          login
          name
          bio
          avatarUrl
          contributionsCollection {
            totalCommitContributions
            totalPullRequestContributions
            totalIssueContributions
          }
          repositories(first: 50, orderBy: { field: PUSHED_AT, direction: DESC }) {
            totalCount
            nodes {
              name
              description
              stargazerCount
              pushedAt
              primaryLanguage { name color }
              languages(first: 5) { nodes { name } }
            }
          }
        }
      }
    `;

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Sanitize error detail in production
      const safeDetail = process.env.NODE_ENV === 'production' ? undefined : data;
      return res.status(response.status).json({
        error: 'github_graphql_error',
        status: response.status,
        detail: safeDetail,
      });
    }

    // Cache the useful payload (keep small)
    const payload = data.data || data;
    CACHE.data = payload;
    CACHE.timestamp = Date.now();

    return res.status(200).json({ ok: true, cached: false, data: payload });
  } catch (error: any) {
    console.error('api/github error:', error);
    return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
  }
}
