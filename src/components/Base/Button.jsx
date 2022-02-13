import React from 'react';

const Button = ({children, onClick=()=>{}, className=''}) => {
  return (
    <div
      onClick={event => onClick(event)}
      className={`my-2 px-10 py-3 inline-block rounded bg-text-default transition-all text-background-default hover:bg-text-accent cursor-pointer${className ? ` ${className}` : ''}`}
    >
      <div className={'flex gap-2 items-center'}>
        {children}
      </div>
    </div>
  )
};

export default Button;