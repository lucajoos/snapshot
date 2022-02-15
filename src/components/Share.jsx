import { useNavigate, useParams } from 'react-router-dom';
import { Header } from './Base';
import { useCallback, useEffect, useState } from 'react';
import { Briefcase, Globe, Home, Layers } from 'react-feather';

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
    <div className={'flex flex-col h-full'}>
      <Header className={'ml-10 mt-10'}>
        <img src='../icons/png/128x128.png' className={'h-12'} />
        <span>Snapshot</span>
      </Header>
      <div className={'flex flex-col justify-center items-center gap-8 h-full mb-16'}>
        <p className={'text-xl'}>Choose Application</p>
        <div className={'flex gap-10'}>
          <div className={'p-10 border-4 border-gray-200 rounded cursor-pointer w-[250px] max-w-[30vw]'} onClick={() => handleOnClickWeb()}>
            <div className={'flex flex-col gap-2 items-center'}>
              <Globe size={32}/>
              <Header>Browser</Header>
            </div>
          </div>
          {
            isExtensionInstalled && (
              <div className={'p-10 border-4 border-gray-200 rounded cursor-pointer w-[250px] max-w-[30vw]'} onClick={() => handleOnClickExtension()}>
                <div className={'flex flex-col gap-2 items-center'}>
                  <Layers size={32}/>
                  <Header>Extension</Header>
                </div>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
};

export default Share;