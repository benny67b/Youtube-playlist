import React, { useContext, useEffect, useReducer } from 'react';
import { Action, addVideo, DispatchedAction } from './actions';
import './App.scss';
import MainVideo from './components/main-video';
import SearchableVideo from './components/searchable';
import VideosList from './components/videos-list';
import { Video } from './types/video';
import 'semantic-ui-css/semantic.min.css';
import config from './config';

interface AppState {
  selectedVideo?: Video;
  videos: Video[];
}


function reducer(state: AppState, action: DispatchedAction): AppState {
  switch(action.type) {
    case Action.SELECT_VIDEO:
      return { ...state, selectedVideo: state.videos[action.videoIdx] };
    case Action.UPDATE_VIDEOS: {
        const videos = action.videos.map((video, index) => ({ ...video, index }));
        return { 
          ...state,
          videos,
          selectedVideo: videos[0],
        }
      }
      case Action.REMOVE_VIDEO: {
        state.videos.splice(action.videoIdx, 1);
        for (let i = action.videoIdx; i < state.videos.length; i++) {
          state.videos[i].index -= 1;
        }
        return { 
          ...state,
          selectedVideo: action.videoIdx === state.videos.length - 1 ? state.videos[action.videoIdx] : state.videos[0]
        };
      }
    case Action.ADD_VIDEO: {
      if (state.videos.find(v => v.id === action.video.id)) return state;
      action.video.index = state.videos.length;
      state.videos.push(action.video);
      return { 
        ...state,
        selectedVideo: state.videos.length === 1 ? state.videos[0] : state.selectedVideo,
        videos: [ ...state.videos ]
      }
    }
    case Action.REORDER: {
      const [ removed ] = state.videos.splice(action.startIndex, 1);
      state.videos.splice(action.endIndex, 0, removed);
      return {
        ...state,
        videos: state.videos.map((v, index) => ({ ...v, index }))
      }
    }
    default:
      return state;
  }
}

const initialState = {
  videos: [],
}

export const VideoContext = React.createContext<[ AppState, (action: DispatchedAction) => void ]>([ initialState, console.log ]);

const AppProvider: React.FunctionComponent = props => {

  const [ state, dispatch ] = useReducer(reducer, initialState);

  const appState: AppState = {
    selectedVideo: state.selectedVideo,
    videos: state.videos
  }

  return (
    <VideoContext.Provider value={[ appState, dispatch ]}>
      {props.children}
    </VideoContext.Provider>
  )
}

function App() {

  return (
    <AppProvider>
      <div className='App'>
        <div className='main' style={{  }}>
          <div style={{ width: '30%' }}>
            <SearchableVideo />
            <VideosList />
          </div>
          <div style={{ width: '70%' }}>
            <MainVideo height='600px' />
          </div>
        </div>
      </div>
    </AppProvider>
  );
}

export default App;
