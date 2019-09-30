/* global chrome */
import {loadChannels} from './api.js';
import Channel from './channel.js';
import html from './html.js';
import Navbar from './navbar.js';
import {StoreProvider, useStore} from './store.js';
import ReactDOM from '/libs/react-dom.js';

const App = ({allChannels}) => {
  const store = useStore();

  return html`
    <div class="flex flex-col">
      <${Navbar} channels=${allChannels} />
      <div class="flex flex-wrap justify-center">
        ${store.channels.map(
          ch =>
            html`
              <${Channel} channel=${ch} />
            `
        )}
      </div>
    </div>
  `;
};

const renderApp = ({allChannels}) => {
  ReactDOM.render(
    html`
      <${StoreProvider}>
        <${App} allChannels=${allChannels} />
      </${StoreProvider}>
    `,
    document.getElementById('container')
  );
};

const main = async () => {
  const allChannels = await loadChannels();
  renderApp({allChannels});
};

main();
