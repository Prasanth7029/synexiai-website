import Parser from 'rss-parser';

const CATEGORY_FEEDS = {
  ai: 'https://www.artificialintelligence-news.com/feed/',
  database: 'https://www.databasestar.com/feed/',  // Direct feed URL
  renewable: 'https://cleantechnica.com/feed/',
  innovation: 'https://techcrunch.com/feed/'
};


export async function handler(event) {
  try {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), 10000)
    );

    const { category } = event.queryStringParameters;
    const feedUrl = CATEGORY_FEEDS[category] || CATEGORY_FEEDS.innovation;

    const parser = new Parser({
      timeout: 8000,  // Increase timeout
      headers: { 'User-Agent': 'Mozilla/5.0' },
      requestOptions: { rejectUnauthorized: false }  // Bypass SSL issues
    });

    const feed = await Promise.race([
      parser.parseURL(feedUrl),
      timeoutPromise
    ]);

    const items = (feed.items || []).slice(0, 5).map((item, i) => ({
      id: `rss-${category}-${i}-${Date.now()}`,
      title: item.title || 'Untitled',
      description: item.contentSnippet ||
                  (item.content && item.content.substring(0, 200) + '...') ||
                  'No description available',
      url: item.link || '#',
      imageUrl: item.enclosure?.url || extractFirstImage(item.content) || '/fallback-image.jpg',
      date: item.isoDate || item.pubDate || new Date().toISOString(),
      source: feed.title || 'Unknown source',
      category,
      type: 'blog'
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(items)
    };
  } catch (error) {
    console.error('RSS proxy error:', error);
    return {
      statusCode: 200,
      body: JSON.stringify([])
    };
  }
}

function extractFirstImage(content) {
  if (!content) return null;
  try {
    const imgRegex = /<img[^>]+src="?([^"\s]+)"?[^>]*>/i;
    const match = content.match(imgRegex);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}