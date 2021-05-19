import React from 'react';

const Button = ({children, enabled=true, onClick=()=>{}}) => {
  return (
    <div
      onClick={event => onClick(event)}
    >
      {children}
    </div>
  )
};

export default Button;