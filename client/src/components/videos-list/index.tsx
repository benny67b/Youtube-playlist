import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult, DraggingStyle, NotDraggingStyle } from 'react-beautiful-dnd';
import { updateVideos, reorder as reorderAction, addVideos } from '../../actions';
import { VideoContext } from '../../App';
import { Video } from '../../types/video';
import VideoListItem from './video';
import config from '../../config';

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? 'lightblue' : 'transparent',
  padding: 8,
  width: 250,
  overflow: 'scroll',
  border: '1px solid darkseagreen',
  maxHeight: 600,
  minHeight: 600
});

const getItemStyle = (isDragging: boolean, isSelected: boolean, draggableStyle?: DraggingStyle | NotDraggingStyle) => ({
  userSelect: 'none' as const,
  margin: `0 0 8px 0`,
  background: isDragging ? 'lightgreen' : 'lightgrey',
  border: isSelected ? '1px solid darkgrey' : '5px solid blue',
  ...draggableStyle
});


const VideosList = () => {

  const [ videos, setVideos ] = useState<Video[]>([]);
  const [ { videos: propsVideos, selectedVideo }, dispatch ] = useContext(VideoContext);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect( () => {
    async function fetchVideos() {
      const videosResponse = await fetch(config.videosEndpoint);
      const videos = await videosResponse.json();
      dispatch(updateVideos(videos));
    }
    
    fetchVideos();
  }, [ dispatch ]);

  const reorder = (startIndex: number, endIndex: number) => {
    const result = Array.from(videos!);
    const [ removed ] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
  
    dispatch(reorderAction(startIndex, endIndex));
    return result;
  };

  const onDragEnd = (result: DropResult) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(result.source.index, result.destination.index);

    setVideos(items);
  }

  useEffect(() => {
    setVideos(propsVideos);
  }, [ propsVideos, propsVideos.length, selectedVideo ]);


  const handleLoadMore = useCallback( async (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
    const target = entries[0];
    if (target.isIntersecting && videos.length >= 5) {
      if (loaderRef.current) {
        observer.disconnect();
      }
      const endpointWithParams = config.videosEndpoint + '?' + new URLSearchParams({ 
        lastId: videos[videos.length - 1].id,  
        limit: '5'
      }).toString();
      const response = await fetch(endpointWithParams, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      const fetchedVideos = await response.json();
      dispatch(addVideos(fetchedVideos));
    }
  }, [ dispatch, videos ])

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: '20px',
      threshold: 0
    };
    const observer = new IntersectionObserver(handleLoadMore, option);
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [ handleLoadMore ]);


  return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='droppable'>
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {videos.map((video, index) => (
                <div key={video.id}>
                <Draggable key={video.id} draggableId={video.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(snapshot.isDragging, selectedVideo?.index !== index, provided.draggableProps.style)}
                    >
                      <VideoListItem video={video} height='100px'/>
                    </div>
                  )}
                </Draggable>
                <div style={{ background: 'blue' }} ref={loaderRef} />
                </div>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
  );
}

export default VideosList;