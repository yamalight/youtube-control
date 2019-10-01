import {useStore} from 'outstated';
import React, {useState} from 'react';
import {store} from './store.js';

const Channel = ({channel, close}) => {
  const {addChannel} = useStore(store);

  const addSelectedChannel = ch => {
    store.addChannel(channel);
    close();
  };

  return (
    <div class="flex flex-wrap shadow border rounded-lg  m-2">
      <div class="flex w-full">
        <div class="flex items-center">
          <img src={channel.thumbnail} class="h-16 w-16 rounded-lg m-2" />
          <div class="flex flex-col p-4">
            <h2 class="font-bold text-lg text-tial-400">
              <a href="#" onClick={() => addSelectedChannel(channel)}>
                {channel.name}
              </a>
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

const Modal = ({close, allChannels}) => {
  const {channels} = useStore(store);

  return (
    <div className="main-modal fixed w-full h-100 inset-0 z-50 overflow-hidden flex justify-center items-center animated fadeIn faster modal-bg">
      <div className="border border-teal-500 shadow-lg modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-hidden max-h-full">
        <div className="modal-content py-4 text-left px-6 flex flex-col max-h-screen">
          <div className="flex justify-between items-center pb-3">
            <p className="text-2xl font-bold">Add channel column</p>
            <div className="modal-close cursor-pointer z-50" onClick={close}>
              <svg
                className="fill-current text-black"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18">
                <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
              </svg>
            </div>
          </div>
          <div className="my-5 overflow-auto">
            {allChannels
              .filter(ch => !channels.find(storeCh => storeCh.name === ch.name))
              .map(channel => (
                <Channel channel={channel} close={close} />
              ))}
          </div>
          <div className="flex justify-end pt-2">
            <button
              className="focus:outline-none modal-close px-4 bg-gray-400 p-3 rounded-lg text-black hover:bg-gray-300"
              onClick={close}>
              Cancel
            </button>
            <button className="focus:outline-none px-4 bg-teal-500 p-3 ml-3 rounded-lg text-white hover:bg-teal-400">
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ({channels}) => {
  const [showModal, setModal] = useState(false);
  const {toggleWatched, hideWatched, refresh} = useStore(store);

  return (
    <>
      <nav className="flex items-center justify-between flex-wrap bg-gray-800 p-4">
        <div className="flex items-center flex-shrink-0 text-white mr-6">
          <span className="font-semibold text-xl tracking-tight">Youtube Control</span>
        </div>
        <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
          <div className="text-sm lg:flex-grow">
            <a
              href="#"
              className="block mt-4 lg:inline-block lg:mt-0 text-gray-200 hover:text-white mr-4"
              onClick={() => setModal(!showModal)}>
              Add channel
            </a>
            <a
              href="#"
              className="block mt-4 lg:inline-block lg:mt-0 text-gray-200 hover:text-white mr-4"
              onClick={() => toggleWatched()}>
              {hideWatched ? 'Show watched' : 'Hide watched'}
            </a>
          </div>
          <div>
            <a
              href="#"
              className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-gray-600 hover:bg-white mt-4 lg:mt-0"
              onClick={() => refresh()}>
              Refresh
            </a>
          </div>
        </div>
      </nav>
      {showModal ? <Modal close={() => setModal(false)} allChannels={channels} /> : ''}
    </>
  );
};
