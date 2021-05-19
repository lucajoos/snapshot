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
    />
  )
};

export default Input;