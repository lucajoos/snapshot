import React, { useCallback } from 'react';

const Button = ({children, onClick=()=>{}, isDisabled=false, className=''}) => {
  const handleOnClick = useCallback(event => {
    if(!isDisabled) {
      onClick(event);
    }
  }, [isDisabled]);

  return (
    <div
      onClick={event => handleOnClick(event)}
      className={`px-10 py-3 inline-block rounded transition-all text-background-default cursor-pointer bg-text-default ${isDisabled ? 'cursor-not-allowed opacity-40' : 'hover:bg-text-accent'}${className ? ` ${className}` : ''}`}
    >
      <div className={'flex gap-2 items-center'}>
        {children}
      </div>
    </div>
  )
};

export default Button;