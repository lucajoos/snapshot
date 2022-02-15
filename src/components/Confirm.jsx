import React, { useCallback, useEffect, useRef } from 'react';
import { useSnapshot } from 'valtio';
import Store from '../Store';
import { Button, Header, Link } from './Base';
import { AlertTriangle, Server, SkipBack } from 'react-feather';
import mousetrap from 'mousetrap';

const Confirm = () => {
  const snap = useSnapshot(Store);

  const iconsRef = useRef({
    Reset: <SkipBack size={18} />,
    Connect: <Server size={18} />
  });

  const handleOnClose = useCallback(() => {
    Store.confirm.isVisible = false;
  }, []);

  const resolve = useCallback(isAccepted => {
    snap.confirm.resolve(isAccepted);
  }, [snap.confirm.resolve]);

  useEffect(() => {
    mousetrap.unbind('enter');
    mousetrap.bind('enter', () => {
      if(snap.confirm.isVisible) {
        snap.confirm.resolve(true);
      }
    });
  }, [snap.confirm.resolve, snap.confirm.isVisible])

  return (
    <div className={`fixed top-0 right-0 left-0 bottom-0 z-30 grid transition-all ${snap.confirm.isVisible ? 'opacity-100 pointer-events-auto' : 'pointer-events-none opacity-0'}`}>
      <div className={`transition-all absolute top-0 right-0 left-0 bottom-0 bg-black ${snap.modal.isVisible ? 'opacity-30' : 'opacity-60'}`} onClick={() => handleOnClose()} onContextMenu={() => handleOnClose()}/>

      <div className={'absolute z-40 rounded-md bg-background-default justify-self-center self-center p-10 w-[calc(450px-8rem)] max-w-[calc(450px-8rem)]'}>
        <div className={'flex flex-col gap-6'}>
          <Header className={'mb-2'}><AlertTriangle /> Confirm</Header>

          <p className={'wrap'}>{snap.confirm.text}</p>

          <div className={'flex gap-4 justify-end'}>
            <Link isUnderlined={false} onClick={() => resolve(false)}>Cancel</Link>
            <Button onClick={() => resolve(true)}>
              <span>{snap.confirm.type}</span>
              {iconsRef.current[snap.confirm.type]}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Confirm;