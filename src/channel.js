import {useStore} from 'outstated';
import React, {useState} from 'react';
import {store} from './store.js';

const WATCHED_THRESHOLD = 85;

const Video = ({data, channel}) => {
  const [displayViewed, setDisplayViewed] = useState(false);
  const {setViewed} = useStore(store);

  return (
    <div
      className="flex flex-wrap"
      onMouseEnter={() => setDisplayViewed(true)}
      onMouseLeave={() => setDisplayViewed(false)}
      style={{opacity: data.watched > 90 ? '0.5' : '1'}}>
      <div className="flex w-full m-2 mt-4 mb-4">
        <div className="flex items-center">
          <div className="w-1/4">
            <img src={data.thumbnail} className="w-full" />
            <div className="border-b border-4 border-red-600 shadow-lg rounded" style={{width: data.watched + '%'}} />
            {displayViewed && data.watched < WATCHED_THRESHOLD ? (
              <a
                href="#"
                className="bg-white hover:bg-gray-100 text-gray-800 py-2 px-2 inline-flex items-center"
                onClick={() => setViewed({channel, video: data})}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  version="1.1"
                  className="fill-current w-4 h-4 mr-2">
                  <g id="surface1">
                    <path d="M 28.28125 6.28125 L 11 23.5625 L 3.71875 16.28125 L 2.28125 17.71875 L 10.28125 25.71875 L 11 26.40625 L 11.71875 25.71875 L 29.71875 7.71875 Z " />
                  </g>
                </svg>
                Mark watched
              </a>
            ) : (
              ''
            )}
          </div>

          <div className="flex flex-col flex-1 p-4">
            <h2 className="font-bold text-lg text-tial-400">
              <a href={data.url}>{data.title}</a>
            </h2>
            <span className="font-light text-sm">Published {data.publishedTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ({channel}) => {
  const {channelData, hideWatched, removeChannel, setAllViewed} = useStore(store);
  const [showRemove, setShowRemove] = useState(false);

  const episodes = (channelData[channel.name] || []).filter(ep =>
    hideWatched ? ep.watched < WATCHED_THRESHOLD : true
  );

  return (
    <div className="flex flex-col shadow border rounded lg:m-2 w-full sm:w-1/2 md:w-1/2 lg:w-1/4 max-h-view overflow-auto">
      <div className="flex flex-wrap shadow border rounded-lg h-20">
        <div className="flex w-full h-20  ">
          <div
            className="flex flex-1 items-center"
            onMouseEnter={() => setShowRemove(true)}
            onMouseLeave={() => setShowRemove(false)}>
            <img src={channel.thumbnail} className="h-16 rounded-lg m-2" />
            {showRemove && (
              <div
                className="rounded-lg bg-black static w-16 h-16 rm-channel text-2xl text-white items-center flex justify-center"
                onClick={() => removeChannel(channel)}>
                X
              </div>
            )}

            <div className="flex flex-col flex-1 p-4">
              <h2 className="font-bold text-lg text-tial-400">
                <a href={channel.url}>{channel.name}</a>
              </h2>
            </div>
            <a
              href="#"
              className="bg-white hover:bg-gray-100 text-gray-800 py-2 px-2 inline-flex items-center mr-4"
              onClick={() => setAllViewed(channel)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                version="1.1"
                className="fill-current w-4 h-4 mr-2">
                <g id="surface1">
                  <path d="M 28.28125 6.28125 L 11 23.5625 L 3.71875 16.28125 L 2.28125 17.71875 L 10.28125 25.71875 L 11 26.40625 L 11.71875 25.71875 L 29.71875 7.71875 Z " />
                </g>
              </svg>
              Mark all watched
            </a>
          </div>
        </div>
      </div>
      {episodes.length > 0 && episodes.map(ep => <Video key={ep.url} channel={channel} data={ep} />)}
    </div>
  );
};
