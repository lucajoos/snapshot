import React, { useRef } from 'react';
import { X } from 'react-feather';

const Button = ({ children, color='random', onClick=() => {}, innerRef=null }) => {
  const palette = ['orange', 'pink', 'green', 'violet', 'blue'];
  const theme = useRef(color === 'random' ? palette[Math.floor(Math.random() * (palette.length - 1))] : color);

  return (
    <div
      className={'my-4'}
    >
      <div
        onClick={() => onClick()}
        className={`button p-5 cursor-pointer select-none w-full rounded-lg text-text-default relative bg-${theme.current}-default`}
        ref={innerRef}
      >
        <div className={'grid gap-1'}>
          {children}
        </div>

        <div className={'absolute top-0 bottom-0 m-auto right-5 grid items-center cursor-pointer'}>
          <X />
        </div>
      </div>
    </div>
  );
};

export default Button;