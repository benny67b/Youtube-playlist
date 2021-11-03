import { google } from 'googleapis';
import config from 'config';
import moment from 'moment';

export async function videoById(id: string) {
  try {
    const response = await google.youtube('v3').videos.list({ 
      id: [ id ], 
      key: config.youtubeApiKey, 
      part: [ 'contentDetails', 'snippet' ] 
    });
  
    const video = response.data.items[0];
    const duration = moment.duration(video?.contentDetails?.duration);
    
    return {
      duration: `${duration.minutes()}:${duration.seconds()}`,
      name: video?.snippet?.title,
    };
  }
  catch (error) {
    console.error(error);
    return {};
  }
  
}
