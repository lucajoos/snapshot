import React, { useCallback } from 'react';

const Input = ({ type='text', placeholder='', value='', onChange=()=>{}, nativeRef }) => {
  const handleOnChange = useCallback(onChange, []);

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(event) => { handleOnChange(event); }}
      ref={nativeRef}
      className={'border-2 border-text-default rounded px-2 py-3 text-text-default my-2 w-full'}
    />
  )
};

export default Input;