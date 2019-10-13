import { Provider, useStore } from 'outstated';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Channel, Loader, Navbar, Player, UndoAlert, Warning } from './components';
import './main.css';
import { store } from './store';

const App = () => {
  const { currentVideo, loadingMessage, undoAlertVisible, channels, allChannels, init, useHorizontalLayout } = useStore(
    store
  );

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="flex flex-col">
      {loadingMessage && <Loader message={loadingMessage} />}
      <Navbar channels={allChannels} />
      {undoAlertVisible && <UndoAlert />}
      {currentVideo.video && <Player />}
      <div className={`flex ${useHorizontalLayout ? 'overflow-auto' : 'flex-wrap justify-center'}`}>
        {allChannels.length > 0 && !channels.length && <h1 className="text-2xl p-6">Start by adding some channels!</h1>}
        {!loadingMessage && allChannels.length === 0 && (
          <Warning title="Couldn't load channels list!">
            <p>Looks like we couldn't load your channels list!</p>
            <p>Please make sure:</p>
            <div className="px-6">
              <ol className="list-decimal">
                <li>You are logged in to Youtube</li>
                <li>You are using modern Youtube layout</li>
              </ol>
            </div>
          </Warning>
        )}
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
