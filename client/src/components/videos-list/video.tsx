import React, { useContext, useState } from 'react';
import { Video } from '../../types/video';
import { VideoContext } from '../../App';
import './index.scss';
import { removeVideo, selectVideo } from '../../actions';
import { Icon } from 'semantic-ui-react';
import config from '../../config';

interface VideoProps {
  video?: Video;
  height: string;
}

const VideoListItem = ({ video, height }: VideoProps) => {
  const [_, dispatch ] = useContext(VideoContext);
  const [ isActionsVisible, setActionsVisible ] = useState(false);

  const showActions = () => {
    setActionsVisible(true);
  }

  const hideActions = () => {
    setActionsVisible(false);
  }

  const removeItem = () => {
    fetch(config.videosEndpoint, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      method: 'DELETE',
      body: JSON.stringify({ id: video?.id })
    });
    dispatch(removeVideo(video!.index));
  }

  let [ mins, secs ] = video!.duration.split(':');
  mins = mins.length === 1 ? `0${mins}` : mins;
  secs = secs.length === 1 ? `0${secs}` : secs;

  return (
    <div onMouseEnter={showActions} onMouseLeave={hideActions} style={{ display: 'flex', flexDirection: 'column' }}>
      <img onClick={() => dispatch(selectVideo(video!.index))} style={{ objectFit: 'cover' }} height={height} src={`https://img.youtube.com/vi/${video!.youtubeVideoId}/hqdefault.jpg`} alt=''/>
      <p style={{ fontFamily: 'Roboto, Arial, sans-serif', padding: '10px 0px 0px 10px' }} >{video!.title}</p>
      <p style={{ fontFamily: 'Roboto, Arial, sans-serif', alignSelf: 'flex-end', padding: '0 10px 10px' }} >{`${mins}:${secs}`}
        {isActionsVisible && <Icon name='trash' link color='blue' style={{ cursor: 'pointer', position: 'relative'  }} onClick={removeItem} />}
      </p>
    </div>
  )
}

export default VideoListItem;
