import React, { useCallback, useState } from 'react';
import { Menu } from 'react-feather';

import Icon from '../../Icon';

const Sort = ({ title='', className='', favicon='', fallback=null, icons=[], isEditing=true, onClick=()=>{}, onClickIcon=()=>{} }) => {
  const [isFailedFavicon, setIsFailedFavicon] = useState(false);

  const onErrorFavicon = useCallback(() => {
    setIsFailedFavicon(true);
  }, [])
  return (
    <div
      className={`option flex items-center width-full rounded pl-4 pr-2 py-3 justify-between${className.length > 0 ? ` ${className}` : ''}`} onClick={() => onClick()}>
        <div className={'flex gap-2 items-center'}>
            {(favicon ? favicon.length > 0 : false) && !isFailedFavicon ? (
              <Icon src={favicon} onError={() => onErrorFavicon()} />
            ) : fallback}
            <p>{title}</p>
        </div>

        <div className={'flex gap-2 mr-2 text-gray-400'}>
            {icons.map((icon, index) => (
                <div className={'cursor-pointer pointer-events-auto'} key={index} onClick={() => onClickIcon(index)}>{icon}</div>
            ))}

            { isEditing && <div className={'cursor-grab pointer-events-auto'}><Menu size={18} /></div> }
        </div>
    </div>
  )
};

export default Sort;