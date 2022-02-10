import React, { useCallback, useRef, useState } from 'react';
import { X as Times } from 'react-feather';

const Tags = ({
  className = '',
  title = '',
  tags = [],
  onChange = () => {},
  onKeyDown = () => {},
  onDone = () => {},
  isOnlyAllowingUniqueTags = false,
  isSpellChecking = false,
  regex = (/(.*?)/g),
  pasteDataType = null,
  separators = [],
  maxTags=-1
}) => {
  const [ value, setValue ] = useState('');
  const [ selection, setSelection ] = useState(-1);

  const spanRef = useRef();

  const handleOnInput = useCallback(event => {
    const content = event.currentTarget.textContent.trim().replace('\n', '');

    if(separators.length > 0 ? separators.filter(separator => content.endsWith(separator)).length > 0 : false) {
      if(maxTags > -1 ? tags.length < maxTags : true) {
        onChange([ ...tags, value ]);
        setValue('');
        spanRef.current.textContent = '';
      }
    } else {
      setValue(content);
    }
  }, [separators, value]);

  const handleOnPaste = useCallback(event => {
    if (typeof pasteDataType === 'string') {
      // Over-write default paste event
      event.preventDefault();
      document.execCommand('insertHTML', false, (event.originalEvent || event).clipboardData.getData(pasteDataType));
    }
  }, [ pasteDataType ]);

  const handleOnKeyDown = useCallback(event => {
    if (event.key === 'Enter') {
      event.preventDefault();

      if (
        (isOnlyAllowingUniqueTags ? tags.indexOf(value) === -1 : true) &&
        regex.test(value)
      ) {
        if(value.length > 0 && (maxTags > -1 ? tags.length < maxTags : true)) {
          // Add tag
          onChange([ ...tags, value ]);
          setValue('');
          spanRef.current.textContent = '';
        } else {
          onDone(tags);
        }
      }
    } else if (event.key === 'Backspace' && value.length === 0) {
      // Delete last tag
      event.preventDefault();
      handleOnRemove(tags.length - 1);
    } else if(event.key === 'Delete') {
      if(selection > -1) {
        // Delete selected tag
        handleOnRemove(selection);

        if(selection !== 0 || tags.length === 1) {
          setSelection(selection - 1);
        }
      }
    } else if(event.key === 'Tab') {
      if(tags.length > 0) {
        if(event.shiftKey && selection > -1) {
          setSelection(selection - 1);
          event.preventDefault();
        } else if(!event.shiftKey && selection < tags.length) {
          setSelection(selection + 1);
          event.preventDefault();
        }
      }
    }

    onKeyDown(event);
  }, [ value, selection, tags, isOnlyAllowingUniqueTags ]);

  const handleOnRemove = useCallback(index => {
    const updatedTags = Array.from(tags);
    updatedTags.splice(index, 1);

    onChange(updatedTags);
  }, [ tags ]);

  return (
    <div className={ `input relative${className ? ` ${className}` : ''}` }>
      <div
        className={ 'flex border-b-2 border-gray-300 py-3 px-1 w-input flex-wrap relative items-center cursor-text' }
        onClick={ () => spanRef.current?.focus() }>
        {
          tags.length === 0 && value.length === 0 && (
            <span className={'absolute left-1'}>{ title }</span>
          )
        }
        {
          tags.map((tag, index) => (
            <div key={ index }
                 className={ `flex rounded items-center py-1 mr-1 px-2 cursor-pointer ${index !== selection ? 'bg-gray-200' : 'bg-text-default text-background-default'}` }>
              <span>{ tag }</span>
              <div className={ 'ml-1 cursor-pointer self-center' } onClick={ () => handleOnRemove(index) }>
                <Times size={ 14 } />
              </div>
            </div>
          ))
        }

        <span
          className={'py-1'}

          onKeyDown={ event => handleOnKeyDown(event) }
          onInput={ event => handleOnInput(event) }
          onPaste={ event => handleOnPaste(event) }

          ref={ spanRef }

          contentEditable={ true }
          spellCheck={ isSpellChecking }
          suppressContentEditableWarning={ true }
        />
      </div>
    </div>
  );
};

export default Tags;