import React from 'react';

const Icon = ({ src='#', alt=''}) => {
  return (
    <div className={`inline-block rounded-full mr-1`}>
      <img className={'h-5'} src={src} alt={alt} />
    </div>
  )
};

export default Icon;