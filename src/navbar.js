import {useStore} from 'outstated';
import React, {useState} from 'react';
import ModalWrapper from './modal';
import {store} from './store.js';

const Channel = ({channel, close}) => {
  const {addChannel} = useStore(store);

  const addSelectedChannel = ch => {
    addChannel(channel);
    close();
  };

  return (
    <div className="flex flex-wrap shadow border rounded-lg  m-2">
      <div className="flex w-full">
        <div className="flex items-center">
          <img src={channel.thumbnail} className="h-16 w-16 rounded-lg m-2" />
          <div className="flex flex-col p-4">
            <h2 className="font-bold text-lg text-tial-400">
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
  const [filter, setFilter] = useState('');

  return (
    <ModalWrapper header="Add channel column" close={close}>
      <div className="w-full p-2">
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="Search channel.."
          value={filter}
          onChange={e => setFilter(e.target.value.toLowerCase())}
        />
      </div>
      {allChannels
        .filter(ch => !channels.find(storeCh => storeCh.name === ch.name))
        .filter(ch => ch.name.toLowerCase().includes(filter))
        .map(channel => (
          <Channel key={channel.url} channel={channel} close={close} />
        ))}
    </ModalWrapper>
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
