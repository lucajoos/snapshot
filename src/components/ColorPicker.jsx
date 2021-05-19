import React, { useCallback } from 'react';
import { Check } from 'react-feather';

const ColorPicker = ({ palette = [], value={color: '', index: -1}, onPick = () => {} }) => {
  const handleOnClick = useCallback(index => {
    onPick({
      color: palette[index],
      index: index
    });
  }, [palette]);

  return (
    <div className={'flex my-2'}>
      {
        palette.map((color, index) => {
          return (
            <div
              className={`w-6 h-6 mr-1 rounded-full bg-${color}-default`}
              onClick={() => handleOnClick(index)}
              key={color}
            >
              <div className={`text-text-default grid justify-center items-center h-full transition-all opacity-${value.index === index ? '100' : '0'}`}>
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