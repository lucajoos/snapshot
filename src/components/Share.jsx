import { useNavigate, useParams } from 'react-router-dom';
import { Header } from './Base';
import { useCallback, useEffect, useState } from 'react';

const Share = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [isExtensionInstalled, setIsExtensionInstalled] = useState(false);

  const handleOnClickWeb = useCallback(() => {
    navigate(`/?id=${params.id}`);
  }, []);

  const handleOnClickExtension = useCallback(() => {
    window.postMessage({ 
      type: 'snapshot:load', 
      data: params.id
    }, '*');
  }, []);

  useEffect(() => {
    window.addEventListener('message', event => {
      if (event.source !== window) {
        return false;
      }

      const { type } = event.data;
      if(type === 'snapshot:pong') {
        setIsExtensionInstalled(true);
      }
    });

    window.postMessage({type: 'snapshot:ping'}, '*');
  }, []);

  return (
    <div className={'flex justify-center gap-6 items-center h-full'}>
      <div className={'p-10 bg-gray-200 rounded cursor-pointer'} onClick={() => handleOnClickWeb()}>
        <Header>Open Here</Header>
      </div>
      {
        isExtensionInstalled && (
          <div className={'p-10 bg-gray-200 rounded cursor-pointer'} onClick={() => handleOnClickExtension()}>
            <Header>Extension</Header>
          </div>
        )
      }
    </div>
  )
};

export default Share;