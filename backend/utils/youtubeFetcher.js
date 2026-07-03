const axios = require('axios');
const { google } = require('googleapis');

const extractVideoId = (url) => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : false;
};

const parseDuration = (duration) => {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return '00:00';
  
  const hours = (parseInt(match[1]) || 0);
  const minutes = (parseInt(match[2]) || 0);
  const seconds = (parseInt(match[3]) || 0);
  
  let result = '';
  if (hours > 0) result += `${hours}:`;
  result += `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  return result;
};

const fetchVideoData = async (url) => {
  const videoId = extractVideoId(url);
  if (!videoId) throw new Error('Invalid YouTube URL');

  const apiKey = process.env.YOUTUBE_API_KEY;
  
  if (apiKey && apiKey !== 'your_youtube_api_key_here') {
    // Use YouTube API v3
    try {
      const youtube = google.youtube({ version: 'v3', auth: apiKey });
      const response = await youtube.videos.list({
        part: 'snippet,contentDetails',
        id: videoId
      });

      if (response.data.items.length === 0) throw new Error('Video not found');

      const videoInfo = response.data.items[0];
      return {
        youtubeId: videoId,
        title: videoInfo.snippet.title,
        thumbnail: videoInfo.snippet.thumbnails.high?.url || videoInfo.snippet.thumbnails.default?.url,
        duration: parseDuration(videoInfo.contentDetails.duration)
      };
    } catch (err) {
      console.error('YouTube API v3 failed, falling back to OEmbed', err.message);
      // Fall through to OEmbed on failure
    }
  }

  // Fallback to OEmbed (no API key needed, but no duration)
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const response = await axios.get(oembedUrl);
    
    return {
      youtubeId: videoId,
      title: response.data.title,
      thumbnail: response.data.thumbnail_url,
      duration: '00:00' // Duration not available via OEmbed
    };
  } catch (err) {
    throw new Error('Could not fetch video data. Check URL or API key.');
  }
};

module.exports = { fetchVideoData, extractVideoId };
