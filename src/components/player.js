import { useStore } from 'outstated';
import React, { useEffect, useRef } from 'react';
import YouTubePlayer from 'youtube-player';
import { store } from '../store';

const Player = () => {
  const {
    currentVideo: { video, channel },
    setCurrentVideo,
    setViewed,
  } = useStore(store);
  const playerRef = useRef();
  const playerObjectRef = useRef();

  const close = () => setCurrentVideo({ video: undefined, channel: undefined });

  useEffect(() => {
    if (!video) {
      return;
    }

    console.log(video);

    if (!playerObjectRef.current) {
      playerObjectRef.current = new YouTubePlayer(playerRef.current, {
        width: '100%',
        height: '100%',
      });
    }

    playerObjectRef.current.loadVideoById(video.id);
    playerObjectRef.current.on('ready', event =>
      playerObjectRef.current.playVideo()
    );
    playerObjectRef.current.on('stateChange', event => {
      // if video has ended - mark it watched locally
      if (event.data === 0) {
        setViewed({ channel, video });
      }
    });
  }, [video]);

  return (
    <div className="main-modal fixed w-full h-100 inset-0 z-50 overflow-hidden flex justify-center items-center animated fadeIn faster modal-bg p-12">
      <div className="border border-teal-500 shadow-lg modal-container bg-white mx-auto rounded shadow-lg z-50 overflow-hidden max-h-full w-full h-full">
        <div className="modal-content py-4 text-left px-6 flex flex-col max-h-screen h-full">
          <div className="flex justify-between items-center pb-3">
            <p className="text-2xl font-bold">{video.title}</p>
            <div className="modal-close cursor-pointer z-50" onClick={close}>
              <svg
                className="fill-current text-black"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
              >
                <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
              </svg>
            </div>
          </div>
          <div className="my-5 overflow-auto" ref={playerRef} />
        </div>
      </div>
    </div>
  );
};

export default Player;
