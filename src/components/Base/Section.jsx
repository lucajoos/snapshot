import React from 'react';

const Section = ({children, className=''}) => {
  return (
    <div className={`mb-2 ${className ? ` ${className}` : ''}`}>
      <p className={'font-bold text-md mt-2 mb-1'}>{children.toUpperCase()}</p>
      <hr />
    </div>
  )
};

export default Section;