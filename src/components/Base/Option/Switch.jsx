import { ChevronRight } from 'react-feather';
import React from 'react';
import { Switch } from '../../Input';

const Category = ({ title, icon=null, value=true, onChange=()=>{}, className=''}) => {
  return (
    <div
      className={`option flex items-center width-full rounded pl-4 pr-2 py-3 justify-between${className.length > 0 ? ` ${className}` : ''}`}>
      <div className={'flex gap-4 items-center'}>
        {icon}
        <p>{title}</p>
      </div>
      <Switch value={value} onChange={() => onChange()} />
    </div>
  )
};

export default Category;