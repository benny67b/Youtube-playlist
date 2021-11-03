import { getModelForClass, prop } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Types } from 'mongoose';
import { CursorPaginationArgs, DEFAULT_LIMIT, InitialPaginationArgs, } from './utils';

export class Video extends TimeStamps  {

  @prop({ required: true })
  public youtubeVideoId: string;

  @prop()
  public addedByUserId?: string;

  @prop()
  public duration: string;

  @prop()
  public title: string;

}

const VideoModel = getModelForClass(Video);

export async function addVideo(video: Exclude<Video, 'url'>) {
  return await VideoModel.create(video);
}

export async function getVideosByOffsetLimit({ offset = 0, limit = DEFAULT_LIMIT }: InitialPaginationArgs) {
  return await VideoModel.find()
                .sort({ _id: 1 })
                .skip(offset)
                .limit(limit);
}

export async function getVideosByCursor({ lastId, limit = DEFAULT_LIMIT }: CursorPaginationArgs) {
  const objectId = new Types.ObjectId(lastId);
  return await VideoModel
                .find({ $and: [ { _id: { $gt: objectId } }, { _id: { $ne: objectId }} ] })
                .sort({ _id: 1 })
                .limit(limit);
}

export async function deleteVideo(id: string) {
  return await VideoModel.deleteOne({ _id: new Types.ObjectId(id) });
}
