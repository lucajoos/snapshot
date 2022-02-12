import React from 'react';
import { ExternalLink } from 'react-feather';

const Link = ({ children, external=false, onClick=()=>{},}) => {
  return (
    <div
      className={'cursor-pointer text-text-default underline flex items-center gap-1'}
      onClick={() => onClick()}
    >
      {children}
      {external && <ExternalLink size={18}/>}
    </div>
  )
};

export default Link;