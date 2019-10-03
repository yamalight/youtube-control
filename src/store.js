import {useRef, useState} from 'react';
import {getStorage, loadChannel, loadChannels} from './api.js';

// force auto-update if opened after 4h
const RELOAD_EVERY_HOURS = 4;

const initFromCache = async () => {
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

let locallyViewed = [];

export const store = () => {
  const [loadingMessage, setLoadingMessage] = useState('Initializing..');
  const [hideWatched, setHideWatched] = useState(true);
  const [channels, setChannels] = useState([]);
  const [channelData, setChannelData] = useState({});
  const [allChannels, setAllChannels] = useState([]);
  const [undoAlertVisible, setUndoAlertVisible] = useState(false);
  const loadingRef = useRef();
  const undoRef = useRef();

  // throttle loading message by 300ms to evade flashing loader
  const setLoading = msg => {
    if (loadingRef.current) {
      clearTimeout(loadingRef.current);
    }
    loadingRef.current = setTimeout(() => {
      setLoadingMessage(msg);
    }, 300);
  };

  // show undo alert for 10s
  const showUndoAlert = () => {
    setUndoAlertVisible(true);
    setTimeout(() => setUndoAlertVisible(false), 10000);
  };

  const init = async () => {
    const lastInit = await getStorage('initDate');
    const initDiffMs = Date.now() - lastInit;
    const initDiffHours = Math.floor(initDiffMs / 1000 / 60 / 60);
    const forceUpdate = initDiffHours >= RELOAD_EVERY_HOURS;
    // load cached data
    const cache = await initFromCache();
    if (cache.channels) {
      setChannels(cache.channels);
    }
    if (cache.locallyViewed) {
      locallyViewed = cache.locallyViewed;
    }
    // reload videos too
    await refresh({givenChannels: cache.channels, forceUpdate});
    // load all channels list
    await loadAllChannels({forceUpdate});
    // save new init datetime
    chrome.storage.local.set({initDate: Date.now()});
  };

  const loadAllChannels = async ({forceUpdate}) => {
    setLoading('Loading channels list..');
    const chs = await loadChannels({forceUpdate});
    setAllChannels(chs);
    setLoading('');
  };

  const addLocallyViewed = vid => {
    locallyViewed = [...locallyViewed, vid.id];
    chrome.storage.local.set({locallyViewed: locallyViewed});
  };
  const removeLocallyViewed = vid => {
    locallyViewed = locallyViewed.filter(v => v !== vid.id);
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
    loadChannelData(channel, {forceLoad: true});
    updateChannels(newChannels);
  };

  const loadChannelData = async (ch, {forceLoad} = {}) => {
    setLoading(`Loading videos for ${ch.name}..`);
    const data = await loadChannel(ch, {ignoreCache: forceLoad});
    const newChannelData = {
      ...channelData,
      [ch.name]: data.map(vid => {
        const viewed = locallyViewed.find(v => v === vid.id);
        if (viewed) {
          return {...vid, watched: 100};
        }
        return vid;
      }),
    };
    setChannelData(newChannelData);
    setLoading('');
  };

  const toggleWatched = () => setHideWatched(!hideWatched);

  const setViewed = ({channel, video, watched = 100}) => {
    const newChannelData = {
      ...channelData,
      [channel.name]: channelData[channel.name].map(vid => {
        if (vid.title === video.title) {
          const newVid = {...vid, watched};
          if (watched === 100) {
            addLocallyViewed(newVid);
          } else {
            removeLocallyViewed(newVid);
          }
          undoRef.current = () => setViewed({channel, video, watched: 0});
          showUndoAlert();
          return newVid;
        }
        return vid;
      }),
    };
    chrome.storage.local.set({[channel.name]: newChannelData[channel.name]});
    setChannelData(newChannelData);
  };

  const setAllViewed = (channel, watched = 100) => {
    const newChannelData = {
      ...channelData,
      [channel.name]: channelData[channel.name]
        .filter(vid => (watched === 100 ? vid.watched < 85 : true))
        .map(vid => {
          const newVid = {...vid, watched};
          if (watched === 100) {
            addLocallyViewed(newVid);
          } else {
            removeLocallyViewed(newVid);
          }
          undoRef.current = () => setAllViewed(channel, 0);
          showUndoAlert();
          return newVid;
        }),
    };
    chrome.storage.local.set({[channel.name]: newChannelData[channel.name]});
    setChannelData(newChannelData);
  };

  const refresh = async ({givenChannels, forceUpdate = true} = {}) => {
    const chans = givenChannels || channels;
    let loaded = 0;
    setLoading(`Loading videos: ${loaded}/${chans.length} channels`);
    const newChannelData = {};
    for (const channel of chans) {
      const res = await loadChannel(channel, {ignoreCache: forceUpdate});
      newChannelData[channel.name] = res.map(vid => {
        const viewed = locallyViewed.find(v => v === vid.id);
        if (viewed) {
          return {...vid, watched: 100};
        }
        return vid;
      });
      setLoading(`Loading videos: ${++loaded}/${chans.length} channels`);
    }
    setChannelData(newChannelData);
    setLoading('');
  };

  const removeChannel = channel => {
    const newChannels = channels.filter(ch => ch.name !== channel.name);
    updateChannels(newChannels);
  };

  const undo = () => {
    if (!undoRef.current) {
      setUndoAlertVisible(false);
      return;
    }

    undoRef.current();
    setUndoAlertVisible(false);
  };

  return {
    init,
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
    removeChannel,
    undo,
    undoAlertVisible,
  };
};
