import {getStorage, loadChannel} from './api.js';
import html from './html.js';
import React from '/libs/react.js';

const StoreContext = React.createContext();

const init = async () => {
  const channels = await getStorage('subscribedChannels');
  console.log('loaded store:', channels);
  if (channels) {
    return {channels};
  }
  return {};
};

let channelDataTemp = {};

const useSetupStore = () => {
  const [hideWatched, setHideWatched] = React.useState(true);
  const [channels, setChannels] = React.useState([]);
  const [channelData, setChannelData] = React.useState({});

  React.useEffect(() => {
    init().then(store => {
      if (store.channels) {
        setChannels(store.channels);
      }
    });
  }, []);

  const updateChannels = channels => {
    setChannels(channels);
    chrome.storage.local.set({subscribedChannels: channels});
  };
  const addChannel = channel => {
    // do not add dups
    if (channels.find(ch => ch.name === 'ch')) {
      return;
    }
    const newChannels = [...channels, channel];
    console.log('adding channel:', newChannels);
    updateChannels(newChannels);
  };

  const loadChannelData = async ch => {
    const data = await loadChannel(ch);
    console.log('loaded data for', ch.name, channelDataTemp);
    const newChannelData = {...channelDataTemp, [ch.name]: data};
    console.log('got new channel data:', newChannelData);
    channelDataTemp = newChannelData;
    setChannelData(channelDataTemp);
  };

  const toggleWatched = () => setHideWatched(!hideWatched);

  const setViewed = ({channel, video}) => {
    const newChannelData = {
      ...channelData,
      [channel.name]: channelData[channel.name].map(vid => {
        if (vid.title === video.title) {
          return {...vid, watched: 100};
        }
        return vid;
      }),
    };
    chrome.storage.local.set({[channel.name]: newChannelData[channel.name]});
    setChannelData(newChannelData);
  };

  const setAllViewed = channel => {
    const newChannelData = {
      ...channelData,
      [channel.name]: channelData[channel.name].map(vid => {
        return {...vid, watched: 100};
      }),
    };
    chrome.storage.local.set({[channel.name]: newChannelData[channel.name]});
    setChannelData(newChannelData);
  };

  return {channels, channelData, hideWatched, addChannel, loadChannelData, toggleWatched, setViewed, setAllViewed};
};

export function useStore(storeInit) {
  const store = React.useContext(StoreContext);
  return store;
}

export const StoreProvider = ({children}) => {
  const store = useSetupStore();

  return html`
    <${StoreContext.Provider} value=${store}>${children}</${StoreContext.Provider}>
  `;
};
