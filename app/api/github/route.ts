// Next.js App Router API Route: app/api/github/route.ts
// Queries GitHub GraphQL API for user contribution calendar, recent commits, and language distributions with 3600s ISR revalidation.

export const revalidate = 3600; // Edge ISR cache duration in seconds

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

export async function GET() {
  const username = process.env.GITHUB_USERNAME || 'OttoJoe1128';
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return new Response(
      JSON.stringify({
        error: 'CONFIGURATION_ERROR',
        message: 'GITHUB_TOKEN ortam değişkeni tanımlanmamış.',
        fallback: true,
      }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'User-Agent': 'Engineering-Living-Systems-Edge/1.0',
      },
      body: JSON.stringify({
        query: GITHUB_QUERY,
        variables: { username },
      }),
      // @ts-ignore - Next.js App Router revalidation configuration
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(
        JSON.stringify({
          error: `GITHUB_API_HTTP_${response.status}`,
          message: 'GitHub API isteği başarısız oldu.',
          status: response.status,
          details: errorText,
        }),
        {
          status: response.status,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const json = await response.json();

    if (json.errors && json.errors.length > 0) {
      return new Response(
        JSON.stringify({
          error: 'GRAPHQL_QUERY_ERROR',
          message: json.errors[0]?.message || 'GraphQL sorgu hatası.',
          errors: json.errors,
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const userData = json.data?.user;
    if (!userData) {
      return new Response(
        JSON.stringify({
          error: 'USER_NOT_FOUND',
          message: `Kullanıcı bulunamadı: ${username}`,
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Flatten recent commits across all repositories
    const recentCommits: Array<{
      sha: string;
      shortSha: string;
      repo: string;
      message: string;
      date: string;
      url: string;
    }> = [];

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

    // Sort commits newest first
    recentCommits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Aggregate languages distribution
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
        if (existing) {
          existing.size += langSize;
        } else {
          languageMap.set(langName, { size: langSize, color: langColor });
        }
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

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: 'INTERNAL_EXCEPTION',
        message: error?.message || 'Sunucu hatası meydana geldi.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
