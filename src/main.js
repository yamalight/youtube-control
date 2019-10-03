import {Provider, useStore} from 'outstated';
import React, {useEffect} from 'react';
import ReactDOM from 'react-dom';
import Channel from './channel';
import Loader from './loader';
import './main.css';
import Navbar from './navbar';
import {store} from './store';

const App = () => {
  const {loadingMessage, channels, allChannels, init} = useStore(store);

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="flex flex-col">
      <Navbar channels={allChannels} />
      {loadingMessage && <Loader message={loadingMessage} />}
      <div className="flex flex-wrap justify-center">
        {!channels.length && <h1 className="text-2xl p-6">Start by adding some channels!</h1>}
        {channels.length > 0 && channels.map(ch => <Channel key={ch.url} channel={ch} />)}
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
