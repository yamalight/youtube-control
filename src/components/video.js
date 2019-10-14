import { useStore } from 'outstated';
import React, { useState } from 'react';
import { store } from '../store';

const formatTime = data => {
  if (data.publishedTime) {
    return `Published ${data.publishedTime}`;
  }

  if (data.isLivestream) {
    return 'Livestream';
  }

  if (data.premierTime) {
    return `Premiers at ${new Date(data.premierTime).toLocaleString()}`;
  }
};

export default ({ data, channel }) => {
  const [displayViewed, setDisplayViewed] = useState(false);
  const {
    setViewed,
    setCurrentVideo,
    watchedThreshold,
    openLinksInNewTab,
  } = useStore(store);

  const openVideo = e => {
    if (openLinksInNewTab) {
      return;
    }
    e.preventDefault();
    setCurrentVideo({ video: data, channel });
  };

  return (
    <div
      className="flex flex-wrap"
      onMouseEnter={() => setDisplayViewed(true)}
      onMouseLeave={() => setDisplayViewed(false)}
      style={{ opacity: data.watched > 90 ? '0.5' : '1' }}
    >
      <div className="flex w-full m-2 mt-4 mb-4">
        <div className="flex items-center">
          <div className="w-1/4 min-w-1/4">
            <div className="w-full relative">
              <img src={data.thumbnail} className="w-full" />
              {displayViewed && data.watched < watchedThreshold ? (
                <a
                  href="#"
                  className="bg-gray-800 border border-gray-700 py-2 px-2 inline-flex items-center absolute top-0 w-full h-full"
                  onClick={e => {
                    e.preventDefault();
                    setViewed({ channel, video: data });
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    version="1.1"
                    className="fill-current w-4 h-4 mr-2"
                  >
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
            {data.watched > 0 && (
              <div
                className="border-b border-4 border-red-600 shadow-lg rounded"
                style={{ width: data.watched + '%' }}
              />
            )}
          </div>

          <a href={data.url} target="_blank" onClick={e => openVideo(e)}>
            <div className="flex flex-col flex-1 p-4">
              <h2 className="font-bold text-lg text-tial-400">{data.title}</h2>
              <span className="font-light text-sm">{formatTime(data)}</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};
