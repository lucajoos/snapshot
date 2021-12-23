import React, { useEffect, useState } from 'react';

const Icon = ({ src='#', alt='', isVisible=true, onLoad=()=>{}, onError=()=>{}}) => {
  const [isRendered, setIsRendered] = useState(true);

  useEffect(() => {
    if(src.length === 0) {
      setIsRendered(false);
      onError(new Error('No source string provided'));
    }
  }, [ src ]);


  return isRendered ? (
    <div className={`inline-block rounded ${!isVisible && 'hidden'}`}>
      <img className={'h-4'} src={src} alt={alt} onLoad={e => onLoad(e)} onError={e => onError(e)} />
    </div>
  ) : null;
};

export default Icon;