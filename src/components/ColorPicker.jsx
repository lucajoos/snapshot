import React, { useCallback } from 'react';
import { Check, PenTool } from 'react-feather';

const ColorPicker = ({ palette = [], value={color: '', index: -1}, onPick = () => {} }) => {
  const handleOnClick = useCallback(index => {
    onPick({
      color: palette[index],
      index: index
    });
  }, [palette]);

  return (
    <div className={'flex justify-start items-center my-2'}>
      <span>Color</span>

      <div className={'ml-3 flex'}>
        {
          palette.map((color, index) => {
            return (
              <div
                className={`w-6 h-6 mr-1 cursor-pointer transition-all rounded bg-${color}-default`}
                onClick={() => handleOnClick(index)}
                key={color}
              >
                <div className={`text-text-default grid justify-center items-center h-full duration-50 transition-all opacity-${value.index === index ? '100' : '0'}`}>
                  <Check size={20} />
                </div>
              </div>
            );
          })
        }
      </div>
    </div>
  );
};

export default ColorPicker;