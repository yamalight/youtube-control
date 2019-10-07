import React from 'react';

export default ({message = 'Loading..'} = {}) => (
  <div className="main-modal fixed w-full h-100 inset-0 z-50 overflow-hidden flex justify-center items-center animated fadeIn faster modal-bg">
    <div className="border border-teal-500 shadow-lg modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-hidden max-h-full">
      <div className="modal-content flex flex-col max-h-screen justify-center items-center">
        <div className="loader flex justify-center items-center">
          <div className="ball-spin-fade-loader">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        <h2 className="text-2xl p-4">{message}</h2>
      </div>
    </div>
  </div>
);
