import React, { useEffect, useRef, useState } from 'react';

const TextField = ({ type='text', placeholder='', value='', icon=null, ability=null, isSpellChecking=false, onClickAbility=()=>{}, onChange=()=>{}, onKeyDown=()=>{}, nativeRef=useRef(null), className='' }) => {
    const [cursor, setCursor] = useState(null);

    useEffect(() => {
        if(nativeRef.current) {
            nativeRef.current.setSelectionRange(cursor, cursor);
        }
    }, [nativeRef, cursor, value]);

    return (
    <div className={`input border-b border-gray-300 transition-all py-3 w-full${className.length > 0 ? ` ${className}` : ''}`}>
      <label className={'flex items-center mx-1'}>
        {icon && (
          <div className={'text-gray-500'}>
            {icon}
          </div>
        )}
        <input
          type={type || 'text'}
          placeholder={placeholder || ''}
          value={value || ''}
          onChange={event => {
              setCursor(event.target.selectionStart);
              onChange(event);
          }}
          ref={nativeRef}
          className={`${icon ? 'ml-2 ' : ''}${ability ? 'mr-2 ' : ''}text-text-default w-full placeholder-text-default focus:border-text-default`}
          onKeyDown={event => onKeyDown(event)}
          spellCheck={isSpellChecking}
        />
        {ability && (
          <div className={'text-gray-500 cursor-pointer mr-2'} onClick={() => onClickAbility()}>
            {ability}
          </div>
        )}
      </label>
    </div>
  )
};

export default TextField;