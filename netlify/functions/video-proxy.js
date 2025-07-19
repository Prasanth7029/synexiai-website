import axios from 'axios';

const CATEGORY_QUERIES = {
  ai: 'artificial intelligence technology',
  database: 'database technology tutorials',
  renewable: 'renewable energy innovations',
  innovation: 'tech innovation latest'
};

export async function handler(event) {
  try {
    const { category } = event.queryStringParameters;
    const query = CATEGORY_QUERIES[category] || 'technology';
    const apiKey = process.env.YOUTUBE_API_KEY;

    // Create a cancel token for timeout
    const source = axios.CancelToken.source();
    const timeout = setTimeout(() => {
      source.cancel('Request timeout');
    }, 9000);  // 9 second timeout

    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        maxResults: 5,
        q: query,
        type: 'video',
        key: apiKey
      },
      cancelToken: source.token,
      timeout: 8000  // Additional axios timeout
    });

    clearTimeout(timeout);

    const videos = response.data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      url: `https://www.youtube.com/embed/${item.id.videoId}`,
      imageUrl: item.snippet.thumbnails?.high?.url || '/fallback-thumbnail.jpg',
      date: item.snippet.publishedAt,
      source: 'YouTube',
      category,
      type: 'video'
    }));

    return { statusCode: 200, body: JSON.stringify(videos) };
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('YouTube request canceled:', error.message);
    } else {
      console.error('YouTube proxy error:', error);
    }
    return {
      statusCode: 200,
      body: JSON.stringify([])
    };
  }
}