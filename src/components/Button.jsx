import React from 'react';

const Button = ({children, onClick=()=>{}}) => {
  return (
    <div className={'grid justify-end'}>
      <div
        onClick={event => onClick(event)}
        className={`my-2 px-10 py-3 inline-block rounded bg-text-default transition-all text-background-default hover:bg-text-accent cursor-pointer flex items-center`}
      >
        {children}
      </div>
    </div>
  )
};

export default Button;