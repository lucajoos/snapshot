import React, { useRef } from 'react';

const Button = ({ children, color='random', onClick=() => {}}) => {
  const palette = ['orange', 'pink', 'green', 'violet', 'blue'];
  const theme = useRef(color === 'random' ? palette[Math.floor(Math.random() * (palette.length - 1))] : color);

  return (
    <div
      onClick={() => onClick()}
      className={`p-5 my-4 cursor-pointer shadow-lg w-full rounded-lg text-text-default grid gap-1 bg-${theme.current}-default`}>
      {children}
    </div>
  );
};

export default Button;