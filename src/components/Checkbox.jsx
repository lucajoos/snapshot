import React from 'react';
import { Check } from 'react-feather';

const Checkbox = ({ value=true, onChange=()=>{} }) => {
  return (
    <label>
      <input type={'checkbox'} onChange={e => onChange(e)} value={value} className={'hidden'} />

      <div
        className={`w-6 h-6 mr-1 cursor-pointer transition-all rounded border-2 border-gray-300`}
      >
        <div className={`text-text-default grid justify-center items-center h-full duration-50 transition-all opacity-${value ? '100' : '0'}`}>
          <Check size={20} />
        </div>
      </div>
    </label>
  )
};

export default Checkbox;