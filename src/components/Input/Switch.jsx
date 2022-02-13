import React from 'react';

const Switch = ({ value=true, onChange=()=>{}, children}) => {
  return (
    <div className={'flex justify-between items-center'}>
      <span>{children}</span>

      <div className={'relative flex items-center cursor-pointer'} onClick={event => onChange(event)}>
        <div className={'absolute w-8 h-2 rounded-full bg-gray-200 mx-2 relative'} />
        <div className={`absolute content-[''] w-4 h-4 rounded-full bg-text-default transition-all duration-200 left-${value ? '8' : '0'}`} />
      </div>
    </div>
  )
};

export default Switch;