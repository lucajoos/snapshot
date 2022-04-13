import React, { useCallback, useRef, useState } from 'react';
import { ChevronDown } from 'react-feather';

const Section = ({ title = '', children, isExtendable=false, className }) => {
    const wrapperRef = useRef(null);

    const [isExtended, setIsExtended] = useState(!isExtendable);
    const [height, setHeight] = useState(isExtendable ? 0 : 'auto');

    const handleOnClickExtend = useCallback(() => {
        setIsExtended(!isExtended);

        if(isExtended) {
            setHeight(0);
        } else {
            setHeight(wrapperRef.current.clientHeight)
        }
    }, [isExtended]);

    return (
        <div className={ `mb-2${ className ? ` ${ className }` : '' }` }>
            {(title ? title.length > 0 : false) && (
                <>
                    <div
                        className={`flex justify-between items-center ${isExtendable ? 'cursor-pointer' : 'cursor-default'}`}
                        onClick={() => handleOnClickExtend()}
                    >
                        <p className={ 'font-bold text-md mt-2 mb-1' }>{ title?.toUpperCase() }</p>
                        {isExtendable && (
                            <div className={`mr-5 transition-transform text-gray-400${isExtended ?  ' rotate-180' : ''}`}>
                                <ChevronDown size={18} />
                            </div>
                        )}
                    </div>
                    <hr/>
                </>
            )}
            <div
                className={'mt-2 overflow-hidden duration-700 transition-all'}
                style={{ height: height }}
            >
                <div ref={wrapperRef}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Section;