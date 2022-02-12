import React  from 'react';

const TextField = ({ type='text', placeholder='', value='', icon=null, ability=null, onClickAbility=()=>{}, onChange=()=>{}, onKeyDown=()=>{}, nativeRef, className='' }) => {
  return (
    <div className={`input border-b-2 border-gray-300 transition-all py-3 w-full${className.length > 0 ? ` ${className}` : ''}`}>
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
          onChange={event => onChange(event)}
          ref={nativeRef}
          className={`${icon ? 'ml-2 ' : ''}${ability ? 'mr-2 ' : ''}text-text-default w-full placeholder-text-default focus:border-text-default`}
          onKeyDown={event => onKeyDown(event)}
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