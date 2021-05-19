import React, { useCallback, useState } from 'react';
import { Check } from 'react-feather';

const ColorPicker = ({ palette = [], onPick = () => {}, }) => {
  const [picked, setPicked] = useState(-1);

  const handleOnClick = useCallback(index => {
    setPicked(index);
    onPick(palette[index]);
  }, [palette]);

  return (
    <div className={'flex'}>
      {
        palette.map((color, index) => {
          return (
            <div
              className={`w-6 h-6 mr-1 rounded-full bg-${color}-default`}
              onClick={() => handleOnClick(index)}
              key={color}
            >
              <div className={`text-text-default grid justify-center items-center h-full transition-all opacity-${picked === index ? '100' : '0'}`}>
                <Check size={20} />
              </div>
            </div>
          );
        })
        }
        </div>
        );
      };

      export default ColorPicker;