import {Provider, useStore} from 'outstated';
import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import {loadChannels} from './api';
import Channel from './channel';
import './main.css';
import Navbar from './navbar';
import {store} from './store';

const App = () => {
  const [allChannels, setAllChannels] = useState([]);
  const {channels} = useStore(store);

  useEffect(() => {
    loadChannels().then(chs => setAllChannels(chs));
  }, []);

  return (
    <div class="flex flex-col">
      <Navbar channels={allChannels} />
      <div class="flex flex-wrap justify-center">
        {channels.map(ch => (
          <Channel channel={ch} />
        ))}
      </div>
    </div>
  );
};

ReactDOM.render(
  <Provider stores={[store]}>
    <App />
  </Provider>,
  document.getElementById('container')
);
