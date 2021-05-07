import React, { useRef } from 'react';

const Button = ({ children, boring = true, onClick=() => {}}) => {
  const palette = ['yellow', 'orange', 'pink', 'violet', 'blue'];
  const color = useRef(palette[Math.floor(Math.random() * palette.length)]);

  return (
    <div
      onClick={() => onClick()}
      className={`p-4 cursor-pointer shadow-lg w-full rounded-lg ${boring ? 'text-text-default bg-background-accent' : `text-background-default bg-${color.current}-default`}`}>
      {children}
    </div>
  );
};

export default Button;