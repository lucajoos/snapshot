import React from 'react';

const ContextMenuOption = ({ onClick=()=>{}, color='text-text-default', icon=null, title=''}) => {
  return (
    <div className={`flex w-full hover:bg-gray-100 transition-all items-center rounded cursor-pointer p-2 ${color}`} onClick={() => onClick()}>
      <div className={'mr-3'}>
        {icon}
      </div>
      <span>{title}</span>
    </div>
  )
};

export default ContextMenuOption;