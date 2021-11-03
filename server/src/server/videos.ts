import express, { Request, Response } from 'express';
import { isVideoCursor, PaginationArgs } from 'models/utils';
import { addVideo, deleteVideo, getVideosByCursor, getVideosByOffsetLimit, Video } from 'models/video';
import { URL } from 'url';
import { videoById } from './youtube';
import _ from 'lodash';
import { DocumentType } from '@typegoose/typegoose';
import { sseHub, Hub, ISseHubResponse } from '@toverux/expresse'

const videoRouter = express.Router();
const hub = new Hub();

interface AddVideoParams {
  youtubeVideoUrl: string;
}

interface DeleteVideoParams {
  id: string;
}

let sse;

videoRouter.get('/subscribe', sseHub({ hub }), (_, res: ISseHubResponse) => {
  sse = res.sse.broadcast;
});


videoRouter.delete('/', async (req: Request<{}, {} , DeleteVideoParams>, res: Response) => {
  const deleted = await deleteVideo(req.body.id);
  res.json(deleted);
});


videoRouter.post('/', async (req: Request<{}, {} , AddVideoParams>, res: Response) => {
  try {
    const parsedUrl = new URL(req.body.youtubeVideoUrl);
    const videoId = parsedUrl.searchParams.get('v');

    if (!videoId) {
      res.status(400).json({ errorMessage: 'could not process video-id' });
      return;
    }
    
    const { duration, name } = await videoById(videoId);
    const addedVideo = await addVideo({ 
      youtubeVideoId: videoId,
      duration: duration,
      title: name
    });
    
    res.json(addedVideo);
    sse.data(addedVideo);
  }
  catch (error) {
    console.error(error);
    res.status(404).json(error);
  }
  
});


videoRouter.get('/', async (req: Request<{}, {} , PaginationArgs>, res: Response) => {
  let videos: DocumentType<Video>[] = [];
  if (isVideoCursor(req.body)) {
    videos = await getVideosByCursor(req.body);
  }
  else {
    videos = await getVideosByOffsetLimit(req.body);
  }
  
  res.json(videos);
})

export default videoRouter;
