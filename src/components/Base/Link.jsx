import React from 'react';
import { ExternalLink } from 'react-feather';

const Link = ({ children, external=false, onClick=()=>{}, isUnderlined=true, className=''}) => {
  return (
    <div
      className={`cursor-pointer text-text-default flex items-center gap-1 ${isUnderlined ? 'underline' : ''}${className.length > 0 ? ` ${className}` : ''}`}
      onClick={() => onClick()}
    >
      {children}
      {external && <ExternalLink size={18}/>}
    </div>
  )
};

export default Link;