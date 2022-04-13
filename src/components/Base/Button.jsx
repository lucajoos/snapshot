import React from 'react';

const Button = ({children, onClick=()=>{}, isDisabled=false, className=''}) => {
  return (
    <div
      onClick={event => !isDisabled ? onClick(event) : () => {}}
      className={`px-10 py-3 inline-block rounded transition-all text-background-default cursor-pointer bg-text-default ${isDisabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-text-accent'}${className ? ` ${className}` : ''}`}
    >
      <div className={'flex gap-2 items-center'}>
        {children}
      </div>
    </div>
  )
};

export default Button;