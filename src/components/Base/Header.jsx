import React from 'react';

const Header = ({children, size, className}) => {
  return (
    <h1 className={`font-bold my-2 flex items-center gap-2 ${size ? size : 'text-2xl'}${className ? ` ${className}` : ''}`}>{children}</h1>
  )
};

export default Header;