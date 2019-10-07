import {useStore} from 'outstated';
import React, {useState} from 'react';
import {store} from '../store';
import ModalWrapper from './modal';

const Channel = ({channel, close}) => {
  const {addChannel} = useStore(store);

  const addSelectedChannel = ch => {
    addChannel(channel);
  };

  return (
    <div className="flex flex-wrap shadow border rounded-lg  m-2">
      <div className="flex w-full">
        <div className="flex items-center">
          {channel.thumbnail ? (
            <img src={channel.thumbnail} className="h-16 w-16 rounded-lg m-2" />
          ) : (
            <div className="h-16 w-16 rounded-lg m-2 border-gray-600 border-solid border-2 bg-gray-600" />
          )}
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

export default ({close, allChannels}) => {
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
