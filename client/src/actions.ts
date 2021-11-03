import { Video } from './types/video';

type SelectVideoAction = { type: Action.SELECT_VIDEO, videoIdx: number };
type UpdateVideosAction = { type: Action.UPDATE_VIDEOS, videos: Video[] };
type AddVideoAction = { type: Action.ADD_VIDEO, video: Video };
type RemoveVideo = { type: Action.REMOVE_VIDEO, videoIdx: number };
type ReorderAction = { type: Action.REORDER, startIndex: number, endIndex: number };
type AddVideosAction = { type: Action.ADD_VIDEOS, videos: Video[] };

export type DispatchedAction = 
  | SelectVideoAction 
  | UpdateVideosAction 
  | AddVideoAction 
  | RemoveVideo 
  | ReorderAction 
  | AddVideosAction;

export enum Action {
  SELECT_VIDEO,
  UPDATE_VIDEOS,
  ADD_VIDEO,
  REMOVE_VIDEO,
  REORDER,
  ADD_VIDEOS
}

export const updateVideos = (videos: Video[]): UpdateVideosAction  => ({
  type: Action.UPDATE_VIDEOS,
  videos
});

export const selectVideo = (videoIdx: number): SelectVideoAction  => ({
  type: Action.SELECT_VIDEO,
  videoIdx
});

export const addVideo = (video: Video): AddVideoAction  => ({
  type: Action.ADD_VIDEO,
  video
});

export const removeVideo = (videoIdx: number): RemoveVideo  => ({
  type: Action.REMOVE_VIDEO,
  videoIdx
});

export const reorder = (startIndex: number, endIndex: number): ReorderAction  => ({
  type: Action.REORDER,
  startIndex,
  endIndex
});

export const addVideos = (videos: Video[]): AddVideosAction => ({
  type: Action.ADD_VIDEOS,
  videos
});
