import React from 'react';

const Warning = ({ children, title }) => (
  <div className="m-2" role="alert">
    <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2 text-xl">{title}</div>
    <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700 text-xl">
      {children}
    </div>
  </div>
);

export default Warning;
