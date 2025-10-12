import axios from "axios";

export async function handler(event) {
  try {
    const { category } = event.queryStringParameters || {};

    // Define category-based query
    let query = "";
    switch (category) {
      case "ai":
        query = 'AI OR "artificial intelligence"';
        break;
      case "database":
        query = 'database OR "data management" OR SQL OR NoSQL';
        break;
      case "renewable":
        query = '"renewable energy" OR solar OR wind OR "green tech"';
        break;
      case "innovation":
        query = 'innovation OR "emerging technology"';
        break;
      default:
        query = "technology";
    }

    // Fetch from NewsAPI
    const response = await axios.get("https://newsapi.org/v2/everything", {
      params: {
        q: query,
        language: "en",
        sortBy: "publishedAt",
        pageSize: 10,
        apiKey: process.env.NEWSAPI_KEY,
      },
      timeout: 8000, // prevent hanging requests
    });

    // Helper: Extract image from HTML content
    function extractFirstImage(content) {
      if (!content) return null;
      const imgRegex = /<img[^>]+src="([^">]+)"/i;
      const match = content.match(imgRegex);
      return match ? match[1] : null;
    }

    // Map to uniform article structure
    const articles = (response.data.articles || []).map((article, index) => ({
      id: `${category || "general"}-${index}-${Date.now()}`,
      title: article.title || "Untitled",
      description: article.description || "No description available",
      category: category || "general",
      date: article.publishedAt || new Date().toISOString(),
      source: article.source?.name || "Unknown source",
      url: article.url,
      imageUrl:
        article.urlToImage ||
        extractFirstImage(article.content) ||
        "/fallback-image.jpg",
      type: "article",
    }));

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(articles),
    };
  } catch (error) {
    console.error("News API error:", error.message);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: error.message,
        message: "Failed to fetch news data",
      }),
    };
  }
}
