import React from 'react';

const Link = ({ children, onClick=()=>{} }) => {
  return (
    <div
      className={'cursor-pointer text-text-default underline'}
      onClick={() => onClick()}
    >
      {children}
    </div>
  )
};

export default Link;