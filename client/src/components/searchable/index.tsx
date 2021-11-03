import { useCallback, useContext, useEffect, useState } from 'react';
import { Input, Icon } from 'semantic-ui-react'
import { VideoContext } from '../../App';
import config from '../../config';
import { addVideo } from '../../actions';

const SearchableVideo = () => {
  const [ isLoading, setLoading ] = useState(false);
  const [ text, setText ] = useState<string>('');
  const [ isValidUrl, setIsValidUrl ] = useState(true);

  const [_, dispatch ] = useContext(VideoContext);


  useEffect(() => {
    const eventSource = new EventSource(config.videosSubscriptionEndpoint);
    eventSource.onopen = () => {
      console.log('connection to stream has been opened');
    };
    eventSource.onerror = (error) => {
      console.error('An error has occurred while receiving stream', error);
    };
    eventSource.onmessage = (stream) => {
      console.log('received stream', stream);
      const video = JSON.parse(stream.data);
      dispatch(addVideo(video));
    };
  }, [ dispatch ])

  const onSearch = async () => {
    setLoading(true);
    const addedVideoResponse = await fetch(config.videosEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ youtubeVideoUrl: text })
    });

    const addedVideo = await addedVideoResponse.json();
    setLoading(false);
    dispatch(addVideo(addedVideo));
  }

  const validateTextCallback = useCallback(() => {
    try {
      new URL(text);
      setIsValidUrl(true);
    }
    catch (error) {
      setIsValidUrl(false);
    }
  }, [ text ])

  useEffect(() => {
    validateTextCallback();
  }, [ text, validateTextCallback ]);

  const onUpdateText = (text: string) => {
    setText(text);
  }
  
  return(
    <Input
      onBlur={validateTextCallback}
      error={!isValidUrl}
      style={{ paddingBottom: 15, maxWidth: 250 }}
      value={text}
      icon={<Icon onClick={onSearch} color={isValidUrl ? 'green' : 'grey' } disabled={!isValidUrl && text !== ''} loading={isLoading} name='search' inverted circular link />}
      onChange={({ target }) => onUpdateText(target.value)} 
      loading={isLoading} 
      size='big' 
      placeholder='Paste Youtube video!...' 
      onKeyPress={(event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
          onSearch();
        }
      }}
    />
  );
}

export default SearchableVideo;
