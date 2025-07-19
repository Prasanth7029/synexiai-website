import axios from 'axios';

export async function handler(event) {

  try {
    const { category } = event.queryStringParameters;

    let query = '';
    switch(category) {
      case 'ai': query = 'AI OR "artificial intelligence"'; break;
      case 'database': query = 'database OR "data management" OR SQL OR NoSQL'; break;
      case 'renewable': query = '"renewable energy" OR solar OR wind OR "green tech"'; break;
      case 'innovation': query = 'innovation OR "emerging technology"'; break;
      default: query = 'technology';
    }

    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: query,
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: 10,
        apiKey: process.env.NEWSAPI_KEY
      }
    });

    // Add ID to each article and map to expected format
    const articles = response.data.articles.map((article, index) => ({
      id: `${category}-${index}-${Date.now()}`,
      title: article.title,
      description: article.description,
      category,
      date: article.publishedAt,
      source: article.source.name,
      url: article.url
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(articles)
    };
  } catch (error) {
    console.error('News API error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
        message: "Failed to fetch news data"
      })
    };
  }
}