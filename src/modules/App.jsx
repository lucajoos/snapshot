import React, { useEffect } from 'react';
import Button from './Button';

const App = () => {
    return (
        <div className={'p-5'}>
          <div className={''}>

          </div>
          <Button color={'blue'}>
            <span className={'text-lg font-bold'}>Hello world</span>
            <span className={'text-xs'}>Created yesterday, 19 PM</span>
          </Button>

          <Button>
            <span className={'text-lg font-bold'}>Hello world</span>
            <span className={'text-xs'}>Created yesterday, 19 PM</span>
          </Button>
        </div>
    );
};

export default App;
