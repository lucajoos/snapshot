import React, { useCallback, useEffect, useRef } from 'react';
import { useSnapshot } from 'valtio';
import mousetrap from 'mousetrap';
import { AlertTriangle, Save, Server, Share, SkipBack } from 'react-feather';

import Store from '../Store';

import { Button, Header, Link } from './Base';

const Dialogue = () => {
  const snap = useSnapshot(Store);

  const iconsRef = useRef({
    Reset: <SkipBack size={18} />,
    Connect: <Server size={18} />,
    Share: <Share size={18} />,
    Save: <Save size={18} />
  });

  const handleOnClose = useCallback(() => {
    Store.dialogue.isVisible = false;
  }, []);

  const resolve = useCallback(isAccepted => {
    snap.dialogue.resolve(isAccepted);
  }, [snap.dialogue.resolve]);

  useEffect(() => {
    mousetrap.unbind('enter');
    mousetrap.bind('enter', () => {
      if(snap.dialogue.isVisible) {
        snap.dialogue.resolve(true);
      }
    });
  }, [snap.dialogue.resolve, snap.dialogue.isVisible])

  return (
    <div className={`fixed top-0 right-0 left-0 bottom-0 z-30 grid transition-all ${snap.dialogue.isVisible ? 'opacity-100 pointer-events-auto' : 'pointer-events-none opacity-0'}`}>
      <div className={`transition-all absolute top-0 right-0 left-0 bottom-0 bg-black ${snap.modal.isVisible ? 'opacity-30' : 'opacity-60'}`} onClick={() => handleOnClose()} onContextMenu={() => handleOnClose()}/>

      <div className={`absolute z-40 rounded-md bg-background-default justify-self-center self-center p-10 ${snap.environment === 'extension' && !snap.isFullscreen ? 'w-[calc(430px-6rem)]' : 'w-[455px] max-w-full'}`}>
        <div className={'flex flex-col gap-6'}>
          <Header className={'mb-2'}><AlertTriangle /> Confirm</Header>

          <p className={'wrap'}>{snap.dialogue.text}</p>

          <div className={'flex gap-4 justify-end'}>
            <Link onClick={() => resolve(false)}>Cancel</Link>
            <Button onClick={() => resolve(true)}>
              <span>{snap.dialogue.type}</span>
              {iconsRef.current[snap.dialogue.type]}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Dialogue;