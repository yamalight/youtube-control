import {useEffect, useState} from 'react';
import {getStorage, loadChannel, loadChannels} from './api.js';

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

export const store = () => {
  const [loadingMessage, setLoading] = useState('');
  const [hideWatched, setHideWatched] = useState(true);
  const [channels, setChannels] = useState([]);
  const [channelData, setChannelData] = useState({});
  const [allChannels, setAllChannels] = useState([]);

  useEffect(() => {
    init().then(store => {
      if (store.channels) {
        setChannels(store.channels);
      }
      if (store.locallyViewed) {
        locallyViewed = store.locallyViewed;
      }
    });
  }, []);

  const loadAllChannels = async () => {
    setLoading('Loading channels list..');
    const chs = await loadChannels();
    setAllChannels(chs);
    setLoading('');
  };

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
    setLoading(`Loading videos for ${ch.name}`);
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
    setLoading('');
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
    let loaded = 0;
    setLoading(`Loading videos: ${loaded}/${channels.length} channels`);
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
      setLoading(`Loading videos: ${++loaded}/${channels.length} channels`);
    }
    setChannelData(newChannelData);
    setLoading('');
  };

  return {
    loadingMessage,
    allChannels,
    loadAllChannels,
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
