import React, { useCallback } from 'react';

const Input = ({ type='text', placeholder='', value='', onChange=()=>{}, nativeRef, className='' }) => {
  const handleOnChange = useCallback(onChange, []);

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(event) => { handleOnChange(event); }}
      ref={nativeRef}
      className={`border-b-2 border-gray-300 transition-all py-3 text-text-default my-3 w-full placeholder-text-default focus:border-text-default${className.length > 0 && ` ${className}`}`}
    />
  )
};

export default Input;