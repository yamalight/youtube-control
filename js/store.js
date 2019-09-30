import {getStorage} from './api.js';
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

const useSetupStore = () => {
  const [channels, setChannels] = React.useState([]);

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

  return {channels, addChannel, updateChannels};
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
