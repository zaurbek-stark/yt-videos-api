const dotenv = require("dotenv");
const axios = require("axios");
dotenv.config();

const youtubeApi = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3/',
  headers: {
    'Content-TYpe': 'application/json',
    'Accept-Encoding': 'application/json',
  },
  params: {
    'key': process.env.API_KEY
  }
});

const getVideoTitles = async (id) => {
  try {
    const { data: channelData } = await youtubeApi.get('channels', { params: {
      'id': id, 'part': 'contentDetails'
    }});
    const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;
    let nextPageToken;
    for (let i=0; i<4; i++) {
      const { data: videosData } = await youtubeApi.get('playlistItems', { params: {
        'playlistId': uploadsPlaylistId, 'part': 'snippet', 'maxResults': 50, 'order': 'date', 'type': 'video', 'pageToken': nextPageToken
      }});
      nextPageToken = videosData.nextPageToken;
      for (let item of videosData.items) {
        console.log(`${item.snippet.title}`);
      }
    }
  } catch (e) {
    console.log(e);
  }
}

// To obtain the channel id you can view the source code of the channel page 
// and find either "externalId":<channel_id> or data-channel-external-id=<channel_id>
const channels = {
  'Airrack': 'UCyps-v4WNjWDnYRKmZ4BUGw',
  'Joma Tech': 'UCV0qA-eDDICsRR9rPcnG7tw',
  'Mark Rober': 'UCY1kMZp36IQSyNx_9h4mpCg', 
  'Ryan Trahan': 'UCnmGIkw-KdI0W5siakKPKog',
  'Gabriel St-Germain': 'UCqw27ZfS4aWdNhP1MDOldPA',

}

getVideoTitles(channels["Gabriel St-Germain"]).then();
