import { useContext } from 'react';
import Youtube from 'react-youtube';
import { removeVideo } from '../../actions';
import { VideoContext } from '../../App';

const MainVideo = ({ height }: { height: string }) => {
  const [ { selectedVideo }, dispatch ] = useContext(VideoContext);

  if (!selectedVideo) return (
    <div className='empty-video' style={{ height, boxShadow: '0 25px 7px 0 rgb(0 0 0 / 6%), 0 2px 20px 0 rgb(0 0 0 / 10%)' }}/>
  );

  const handleVideoEnd = () => {
    dispatch(removeVideo(selectedVideo.index));
  }
  
  return (
    <Youtube 
      onEnd={handleVideoEnd} 
      videoId={selectedVideo.youtubeVideoId} 
      opts={{ height, playerVars: { autoplay: 1 }  }}
    />
  );
}

export default MainVideo;
