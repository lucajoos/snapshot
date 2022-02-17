import React, { useCallback, useState } from 'react';
import { Menu } from 'react-feather';

import Icon from '../../Icon';

const Sort = ({ title='', className='', favicon='', fallback=null, icon=null, onClick=()=>{} }) => {
  const [isFailedFavicon, setIsFailedFavicon] = useState(false);

  const onErrorFavicon = useCallback(() => {
    setIsFailedFavicon(true);
  }, [])
  return (
    <div
      className={`option flex items-center width-full rounded pl-4 pr-2 py-3 justify-between${className.length > 0 ? ` ${className}` : ''}`}>
      <div className={'flex gap-2 items-center'}>
        {favicon.length > 0 && !isFailedFavicon ? (
          <Icon src={favicon} onError={() => onErrorFavicon()} />
        ) : fallback}
        <p>{title}</p>
      </div>
      <div className={'flex gap-2 mr-2 text-gray-400'}>
        <div className={'cursor-pointer pointer-events-auto'} onClick={() => onClick()}>{icon}</div>
        <div className={'cursor-grab pointer-events-auto'}><Menu size={18} /></div>
      </div>
    </div>
  )
};

export default Sort;