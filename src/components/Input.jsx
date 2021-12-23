import React, { useCallback } from 'react';

const Input = ({ type='text', placeholder='', value='', icon=null, onChange=()=>{}, onKeyDown=()=>{}, nativeRef, className='' }) => {
  const handleOnChange = useCallback(onChange, []);

  return (
    <div className={`border-b-2 border-gray-300 transition-all py-3 mt-3 w-full${className.length > 0 ? ` ${className}` : ''}`}>
      <label className={'flex items-center mx-1'}>
        {icon && (
          <div className={'text-gray-500'}>
            {icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(event) => { handleOnChange(event); }}
          ref={nativeRef}
          className={`${icon ? 'ml-2 ' : ''}text-text-default w-full placeholder-text-default focus:border-text-default`}
          onKeyDown={event => onKeyDown(event)}
        />
      </label>
    </div>
  )
};

export default Input;