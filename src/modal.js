import React from 'react';

const Modal = ({close, header, children}) => {
  return (
    <div className="main-modal fixed w-full h-100 inset-0 z-50 overflow-hidden flex justify-center items-center animated fadeIn faster modal-bg">
      <div className="border border-teal-500 shadow-lg modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-hidden max-h-full">
        <div className="modal-content py-4 text-left px-6 flex flex-col max-h-screen">
          <div className="flex justify-between items-center pb-3">
            <p className="text-2xl font-bold">{header}</p>
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
          <div className="my-5 overflow-auto">{children}</div>
          <div className="flex justify-end pt-2">
            <button
              className="focus:outline-none modal-close px-4 bg-gray-400 p-3 rounded-lg text-black hover:bg-gray-300"
              onClick={close}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
