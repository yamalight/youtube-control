import html from './html.js';
import {useStore} from './store.js';
import React from '/libs/react.js';

const Video = ({data, channel}) => {
  const [displayViewed, setDisplayViewed] = React.useState(false);
  const store = useStore();

  return html`
    <div
      class="flex flex-wrap"
      onMouseEnter=${() => setDisplayViewed(true)}
      onMouseLeave=${() => setDisplayViewed(false)}
      style=${{opacity: data.watched > 90 ? '0.5' : '1'}}
    >
      <div class="flex w-full m-2 mt-4 mb-4">
        <div class="flex items-center">
          <div class="w-1/4">
            <img src="${data.thumbnail}" class="w-full" />
            <div class="border-b border-4 border-red-600 shadow-lg rounded" style=${{width: data.watched + '%'}} />
            ${displayViewed && data.watched < 95
              ? html`
                  <a
                    href="#"
                    class="bg-white hover:bg-gray-100 text-gray-800 py-2 px-2 inline-flex items-center"
                    onClick=${() => store.setViewed({channel, video: data})}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      viewBox="0 0 32 32"
                      version="1.1"
                      class="fill-current w-4 h-4 mr-2"
                    >
                      <g id="surface1">
                        <path
                          d="M 28.28125 6.28125 L 11 23.5625 L 3.71875 16.28125 L 2.28125 17.71875 L 10.28125 25.71875 L 11 26.40625 L 11.71875 25.71875 L 29.71875 7.71875 Z "
                        />
                      </g>
                    </svg>
                    Mark watched
                  </a>
                `
              : ''}
          </div>

          <div class="flex flex-col flex-1 p-4">
            <h2 class="font-bold text-lg text-tial-400"><a href="${data.url}">${data.title}</a></h2>
            <span class="font-light text-sm">Published ${data.publishedTime}</span>
          </div>
        </div>
      </div>
    </div>
  `;
};

export default ({channel}) => {
  const store = useStore();

  React.useEffect(() => {
    store.loadChannelData(channel);
  }, [channel.url]);

  const episodes = (store.channelData[channel.name] || []).filter(ep => (store.hideWatched ? ep.watched < 90 : true));

  if (!episodes.length) {
    return html`
      <div />
    `;
  }

  return html`
    <div class="flex flex-col shadow border rounded lg:m-2 w-full sm:w-1/2 md:w-1/2 lg:w-1/4 max-h-view overflow-auto">
      <div class="flex flex-wrap shadow border rounded-lg h-20">
        <div class="flex w-full h-20  ">
          <div class="flex flex-1 items-center">
            <img src="${channel.thumbnail}" class="h-16 rounded-lg m-2" />
            <div class="flex flex-col flex-1 p-4">
              <h2 class="font-bold text-lg text-tial-400">
                <a href=${channel.url}>${channel.name}</a>
              </h2>
            </div>
            <a
              href="#"
              class="bg-white hover:bg-gray-100 text-gray-800 py-2 px-2 inline-flex items-center mr-4"
              onClick=${() => store.setAllViewed(channel)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 32 32"
                version="1.1"
                class="fill-current w-4 h-4 mr-2"
              >
                <g id="surface1">
                  <path
                    d="M 28.28125 6.28125 L 11 23.5625 L 3.71875 16.28125 L 2.28125 17.71875 L 10.28125 25.71875 L 11 26.40625 L 11.71875 25.71875 L 29.71875 7.71875 Z "
                  />
                </g>
              </svg>
              Mark all watched
            </a>
          </div>
        </div>
      </div>
      ${episodes.map(
        ep => html`
          <${Video} channel=${channel} data=${ep} />
        `
      )}
    </div>
  `;
};
