import { ChevronRight } from 'react-feather';
import React from 'react';
import { Switch } from '../../Input';

const Category = ({ title, icon=null, onClick=()=>{}, className=''}) => {
  return (
    <div
      className={`option cursor-pointer flex items-center width-full rounded pl-4 pr-2 py-3 justify-between${className.length > 0 ? ` ${className}` : ''}`}
      onClick={() => onClick(title)}>
      <div className={'flex gap-4 items-center'}>
        {icon}
        <p>{title}</p>
      </div>
      <Switch />
    </div>
  )
};

export default Category;