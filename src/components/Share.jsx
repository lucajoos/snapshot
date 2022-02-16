import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Box, Header } from './Base';
import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, Globe, Info, Layers } from 'react-feather';

const Share = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [isExtensionInstalled, setIsExtensionInstalled] = useState(false);
  const [isCardImported, setIsCardImported] = useState(false);

  const handleOnClickBrowser = useCallback(() => {
    navigate(`/?id=${params.id}`);
  }, []);

  const handleOnClickReturn = useCallback(() => {
    navigate('/');
  }, []);

  const handleOnClickExtension = useCallback(() => {
    window.postMessage({ 
      type: 'snapshot:load', 
      data: params.id
    }, '*');

    setIsCardImported(true);
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

    window.addEventListener('load', () => {
      window.postMessage({type: 'snapshot:ping'}, '*');
    });
  }, []);

  return (
    <div className={'flex flex-col h-full'}>
      <div className={'m-10 flex gap-4 items-center cursor-pointer'} onClick={() => handleOnClickReturn()}>
        <ChevronLeft />
        <Header>
          <img src='../icons/png/128x128.png' className={'h-12'} alt={'Icon'} />
          <span>Snapshot</span>
        </Header>
      </div>
      <div className={'flex flex-col justify-center items-center gap-8 h-full mb-24'}>
        <p className={'text-xl'}>Choose Application</p>
        <div>
          {isCardImported && <Alert icon={<Info size={18} />} color={'green-default'}>Successfully imported card!</Alert>}
          <div className={'flex flex-wrap justify-center gap-8'}>
            <Box icon={<Globe size={32}/>} onClick={() => handleOnClickBrowser()}>Browser</Box>
            {
              isExtensionInstalled && (
                <Box icon={<Layers size={32}/>} onClick={() => handleOnClickExtension()}>Extension</Box>
              )
            }
          </div>
        </div>
      </div>
    </div>
  )
};

export default Share;