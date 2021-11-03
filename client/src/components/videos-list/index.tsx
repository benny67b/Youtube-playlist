import React, { useCallback, useContext, useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult, DraggingStyle, NotDraggingStyle } from 'react-beautiful-dnd';
import { updateVideos, reorder as reorderAction } from '../../actions';
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

  const fetchVideos = useCallback(async () => {
    const videosResponse = await fetch(config.videosEndpoint);
    const videos = await videosResponse.json();
    dispatch(updateVideos(videos));
  }, [ dispatch ]);

  useEffect(() => {
    fetchVideos();
  }, [ fetchVideos ]);

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
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default VideosList;