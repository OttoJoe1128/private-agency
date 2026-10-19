export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  }

  try {
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
      return res.status(response.status).json({
        error: 'GitHub GraphQL request failed',
        detail: data,
      });
    }

    return res.status(200).json(data);
  } catch (error: any) {
    console.error('api/github error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
