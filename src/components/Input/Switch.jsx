import React from 'react';

const Switch = ({ value=true, onChange=()=>{}}) => {
  return (
    <div className={'relative flex items-center cursor-pointer'} onClick={event => onChange(event)}>
      <div className={'absolute w-8 h-2 rounded-full bg-gray-200 mx-2 relative'} />
      <div className={`absolute content-[''] w-4 h-4 rounded-full bg-text-default transition-all duration-200`} style={{ left: value ? '2rem' : '0'}} />
    </div>
  )
};

export default Switch;