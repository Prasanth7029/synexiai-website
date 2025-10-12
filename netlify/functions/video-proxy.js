import axios from "axios";

const CATEGORY_QUERIES = {
  ai: "artificial intelligence latest news",
  database: "database technology tutorials 2025",
  renewable: "renewable energy innovations 2025",
  innovation: "emerging tech innovations 2025",
};

export async function handler(event) {
  try {
    const { category } = event.queryStringParameters || {};
    const query = CATEGORY_QUERIES[category] || "technology";
    const apiKey = process.env.YOUTUBE_API_KEY;

    // Timeout control
    const source = axios.CancelToken.source();
    const timeout = setTimeout(() => source.cancel("Request timeout"), 9000);

    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          maxResults: 8,
          q: query,
          type: "video",
          order: "viewCount", // 🆕 sort by newest first
          publishedAfter: new Date(
            Date.now() - 1000 * 60 * 60 * 24 * 60 // last 60 days
          ).toISOString(),
          key: apiKey,
        },
        cancelToken: source.token,
        timeout: 8000,
      }
    );

    clearTimeout(timeout);

    const videos = (response.data.items || []).map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      url: `https://www.youtube.com/embed/${item.id.videoId}`,
      imageUrl: item.snippet.thumbnails?.high?.url || "/fallback-thumbnail.jpg",
      date: item.snippet.publishedAt,
      source: "YouTube",
      category,
      type: "video",
    }));

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(videos),
    };
  } catch (error) {
    console.error("YouTube proxy error:", error);
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify([]),
    };
  }
}
