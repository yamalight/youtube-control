/* global chrome */
import {loadChannels, loadData} from './api.js';
import html from './html.js';
import Navbar from './navbar.js';
import {StoreProvider} from './store.js';
import ReactDOM from '/libs/react-dom.js';

const App = ({channels}) => html`
  <div class="flex flex-col">
    <${Navbar} channels=${channels} />
  </div>
`;

const renderApp = ({channels, data}) => {
  ReactDOM.render(
    html`
      <${StoreProvider}>
        <${App} channels=${channels} />
      </${StoreProvider}>
    `,
    document.getElementById('container')
  );
};

const main = async () => {
  const channels = await loadChannels();
  const data = await loadData();

  renderApp({channels, data});
  return;

  let html = `
<h1>Videos:</h1>
<div class="flex flex-col w-full flex-wrap">
`;
  html += data
    .filter(it => it.watched < 90)
    .map(
      it => html`
        <div class="flex flex-wrap">
          <div class="flex w-full m-4">
            <div class="flex items-center">
              <img src="${it.thumbnail}" class="h-20 w-32" />
              <div class="flex flex-col p-4">
                <h2 class="font-bold text-lg text-tial-400"><a href="${it.url}">${it.title}</a></h2>
                <span class="font-light text-sm">Published ${it.publishedTime}</span>
                <span class="font-light text-sm">Watched: ${it.watched}%</span>
              </div>
            </div>
          </div>
        </div>
      `
    )
    .join('');
  // html += `<div><pre>${JSON.stringify(d, null, 2)}</pre></div>`;
  html += `</div>`;
  container.innerHTML = html;
};

main();
