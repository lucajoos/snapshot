import React from 'react';

const Icon = ({ src='#', alt='', onLoad=()=>{}}) => {
  return (
    <div className={`inline-block rounded-full mr-1`}>
      <img className={'h-5'} src={src} alt={alt} onLoad={e => onLoad(e)} />
    </div>
  )
};

export default Icon;