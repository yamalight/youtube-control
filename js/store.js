import {getStorage, loadChannel} from './api.js';
import html from './html.js';
import React from '/libs/react.js';

const StoreContext = React.createContext();

const init = async () => {
  const result = {};

  const channels = await getStorage('subscribedChannels');
  if (channels) {
    result.channels = channels;
  }

  const locallyViewed = await getStorage('locallyViewed');
  if (locallyViewed) {
    result.locallyViewed = locallyViewed;
  }

  return result;
};

let channelDataTemp = {};
let locallyViewed = [];

const useSetupStore = () => {
  const [hideWatched, setHideWatched] = React.useState(true);
  const [channels, setChannels] = React.useState([]);
  const [channelData, setChannelData] = React.useState({});

  React.useEffect(() => {
    init().then(store => {
      if (store.channels) {
        setChannels(store.channels);
      }
      if (store.locallyViewed) {
        locallyViewed = store.locallyViewed;
      }
    });
  }, []);

  const addLocallyViewed = vid => {
    locallyViewed = [...locallyViewed, vid];
    chrome.storage.local.set({locallyViewed: locallyViewed});
  };

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
    const newChannelData = {
      ...channelDataTemp,
      [ch.name]: data.map(vid => {
        const viewed = locallyViewed.find(v => v.title === vid.title);
        if (viewed) {
          return viewed;
        }
        return vid;
      }),
    };
    channelDataTemp = newChannelData;
    setChannelData(channelDataTemp);
  };

  const toggleWatched = () => setHideWatched(!hideWatched);

  const setViewed = ({channel, video}) => {
    const newChannelData = {
      ...channelData,
      [channel.name]: channelData[channel.name].map(vid => {
        if (vid.title === video.title) {
          const newVid = {...vid, watched: 100};
          addLocallyViewed(newVid);
          return newVid;
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
        const newVid = {...vid, watched: 100};
        addLocallyViewed(newVid);
        return newVid;
      }),
    };
    chrome.storage.local.set({[channel.name]: newChannelData[channel.name]});
    setChannelData(newChannelData);
  };

  const refresh = async () => {
    const newChannelData = {};
    for (const channel of channels) {
      const res = await loadChannel(channel, {ignoreCache: true});
      newChannelData[channel.name] = res.map(vid => {
        const viewed = locallyViewed.find(v => v.title === vid.title);
        if (viewed) {
          return viewed;
        }
        return vid;
      });
    }
    setChannelData(newChannelData);
  };

  return {
    channels,
    channelData,
    hideWatched,
    addChannel,
    loadChannelData,
    toggleWatched,
    setViewed,
    setAllViewed,
    refresh,
  };
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
