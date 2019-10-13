import { useStore } from 'outstated';
import React from 'react';
import { store } from '../store';
import ModalWrapper from './modal';

export default ({ close }) => {
  const {
    watchedThreshold,
    setWatchedThreshold,
    openLinksInNewTab,
    setOpenLinksInNewTab,
    useHorizontalLayout,
    setUseHorizontalLayout,
  } = useStore(store);

  return (
    <ModalWrapper header="Settings" close={close}>
      <div className="w-full p-2">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="watchThreshold"
          >
            Consider watched after (%)
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="watchThreshold"
            type="text"
            placeholder="Watched after %"
            value={watchedThreshold}
            onChange={e => setWatchedThreshold(e.target.value)}
          />
        </div>

        <div className="md:flex md:items-center mb-4">
          <label className="block text-gray-700 font-bold">
            <input
              className="mr-2 leading-tight"
              type="checkbox"
              checked={openLinksInNewTab}
              onChange={e => setOpenLinksInNewTab(e.target.checked)}
            />
            <span className="text-sm">Open links in new window</span>
          </label>
        </div>

        <div className="md:flex md:items-center mb-4">
          <label className="block text-gray-700 font-bold">
            <input
              className="mr-2 leading-tight"
              type="checkbox"
              checked={useHorizontalLayout}
              onChange={e => setUseHorizontalLayout(e.target.checked)}
            />
            <span className="text-sm">Use horizontal layout</span>
          </label>
        </div>
      </div>
    </ModalWrapper>
  );
};
