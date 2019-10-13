import { useStore } from 'outstated';
import React, { useState } from 'react';
import { store } from '../store';
import Video from './video';

export default ({ channel }) => {
  const { channelData, hideWatched, removeChannel, setAllViewed, watchedThreshold, useHorizontalLayout } = useStore(
    store
  );
  const [showRemove, setShowRemove] = useState(false);

  const episodes = (channelData[channel.name] || []).filter(ep => (hideWatched ? ep.watched < watchedThreshold : true));

  if (!episodes.length && hideWatched) {
    return <div />;
  }

  const wrapperClasses = useHorizontalLayout
    ? 'flex flex-col shadow border rounded lg:m-2 min-w-3 max-h-view overflow-auto'
    : 'flex flex-col shadow border rounded lg:m-2 w-full sm:w-1/2 md:w-1/2 lg:w-1/4 max-h-view overflow-auto';

  return (
    <div className={wrapperClasses}>
      <div className="flex flex-wrap shadow border rounded-lg h-20">
        <div className="flex w-full h-20  ">
          <div
            className="flex flex-1 items-center"
            onMouseEnter={() => setShowRemove(true)}
            onMouseLeave={() => setShowRemove(false)}>
            {channel.thumbnail ? (
              <img src={channel.thumbnail} className="h-16 w-16 rounded-lg m-2" />
            ) : (
              <div className="h-16 w-16 rounded-lg m-2 border-gray-600 border-solid border-2 bg-gray-600" />
            )}
            {showRemove && (
              <div
                className="rounded-lg bg-black static w-16 h-16 rm-channel text-2xl text-white items-center flex justify-center"
                onClick={e => {
                  e.preventDefault();
                  removeChannel(channel);
                }}>
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
              onClick={e => {
                e.preventDefault();
                setAllViewed(channel);
              }}>
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
