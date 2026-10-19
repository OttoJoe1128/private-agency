// api/github.ts
// Vercel Node Serverless Function for /api/github
// Place this file at repository root under "api/"

const GITHUB_GRAPHQL_ENDPOINT = 'https://api.github.com/graphql';

const GITHUB_QUERY = `
  query($username: String!) {
    user(login: $username) {
      name
      login
      avatarUrl
      bio
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
              weekday
              color
            }
          }
        }
      }
      repositories(first: 6, orderBy: {field: PUSHED_AT, direction: DESC}, privacy: PUBLIC) {
        nodes {
          name
          description
          url
          pushedAt
          stargazerCount
          forkCount
          primaryLanguage {
            name
            color
          }
          languages(first: 5, orderBy: {field: SIZE, direction: DESC}) {
            edges {
              size
              node {
                name
                color
              }
            }
          }
          defaultBranchRef {
            target {
              ... on Commit {
                history(first: 5) {
                  nodes {
                    oid
                    messageHeadline
                    committedDate
                    url
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  }

  const username = process.env.GITHUB_USERNAME || 'OttoJoe1128';
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return res.status(401).json({
      error: 'CONFIGURATION_ERROR',
      message: 'GITHUB_TOKEN ortam değişkeni tanımlanmamış.',
      fallback: true,
    });
  }

  try {
    const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'User-Agent': 'private-agency/1.0',
      },
      body: JSON.stringify({
        query: GITHUB_QUERY,
        variables: { username },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `GITHUB_API_HTTP_${response.status}`,
        message: 'GitHub API isteği başarısız oldu.',
        status: response.status,
        details: errorText,
      });
    }

    const json = await response.json();

    if (json.errors && json.errors.length > 0) {
      return res.status(400).json({
        error: 'GRAPHQL_QUERY_ERROR',
        message: json.errors[0]?.message || 'GraphQL sorgu hatası.',
        errors: json.errors,
      });
    }

    const userData = json.data?.user;
    if (!userData) {
      return res.status(404).json({
        error: 'USER_NOT_FOUND',
        message: `Kullanıcı bulunamadı: ${username}`,
      });
    }

    const recentCommits: Array<any> = [];
    const repos = userData.repositories?.nodes || [];
    for (const repo of repos) {
      const commits = repo.defaultBranchRef?.target?.history?.nodes || [];
      for (const c of commits) {
        recentCommits.push({
          sha: c.oid,
          shortSha: c.oid.substring(0, 7),
          repo: repo.name,
          message: c.messageHeadline,
          date: c.committedDate,
          url: c.url,
        });
      }
    }
    recentCommits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const languageMap = new Map<string, { size: number; color: string }>();
    let totalLanguageBytes = 0;
    for (const repo of repos) {
      const edges = repo.languages?.edges || [];
      for (const edge of edges) {
        const langName = edge.node.name;
        const langColor = edge.node.color || '#38bdf8';
        const langSize = edge.size;
        totalLanguageBytes += langSize;
        const existing = languageMap.get(langName);
        if (existing) existing.size += langSize;
        else languageMap.set(langName, { size: langSize, color: langColor });
      }
    }

    const languagesBreakdown = Array.from(languageMap.entries())
      .map(([name, data]) => ({
        name,
        color: data.color,
        percentage: Number(((data.size / (totalLanguageBytes || 1)) * 100).toFixed(1)),
      }))
      .sort((a, b) => b.percentage - a.percentage);

    const result = {
      username: userData.login,
      name: userData.name || userData.login,
      avatarUrl: userData.avatarUrl,
      bio: userData.bio,
      totalContributions: userData.contributionsCollection?.contributionCalendar?.totalContributions || 0,
      weeks: userData.contributionsCollection?.contributionCalendar?.weeks || [],
      recentCommits: recentCommits.slice(0, 10),
      languages: languagesBreakdown,
      cachedAt: new Date().toISOString(),
      revalidateSeconds: 3600,
    };

    res.setHeader('Content-Type', 'application/json');
    // Vercel caching header (optional)
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200');
    return res.status(200).json(result);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      error: 'INTERNAL_EXCEPTION',
      message: error?.message || 'Sunucu hatası meydana geldi.',
    });
  }
}
