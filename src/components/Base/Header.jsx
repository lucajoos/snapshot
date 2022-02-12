import React from 'react';

const Header = ({children}) => {
  return (
    <h1 className={'font-bold text-2xl my-2 flex items-center gap-2'}>{children}</h1>
  )
};

export default Header;