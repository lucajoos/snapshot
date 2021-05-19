import React from 'react';

const Button = ({children, onClick=()=>{}}) => {
  return (
    <div
      onClick={event => onClick(event)}
      className={`px-10 py-3 inline-block rounded bg-text-default transition-all text-background-default hover:bg-text-accent cursor-pointer`}
    >
      {children}
    </div>
  )
};

export default Button;