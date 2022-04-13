import React, { useCallback, useEffect, useRef } from 'react';
import { useSnapshot } from 'valtio';
import mousetrap from 'mousetrap';
import { AlertTriangle, ArrowRight, Check, Coffee, Info, Save, Server, Share, Shield, SkipBack } from 'react-feather';

import Store from '../Store';

import { Button, Header, Link } from './Base';

const Dialogue = () => {
  const snap = useSnapshot(Store);

  const resolve = useCallback(isAccepted => {
    snap.privacy.resolve(isAccepted);
  }, [snap.privacy]);

  return (
    <div className={`fixed top-0 right-0 left-0 bottom-0 z-40 grid transition-all ${snap.privacy.isVisible ? 'opacity-100 pointer-events-auto' : 'pointer-events-none opacity-0'}`}>
      <div className={`transition-all absolute top-0 right-0 left-0 bottom-0 bg-black ${snap.privacy.isVisible ? 'opacity-30' : 'opacity-60'}`} />

      <div className={`absolute z-50 rounded-md bg-background-default justify-self-center self-center p-10 ${snap.environment === 'extension' && !snap.isFullscreen ? 'w-[calc(450px-6rem)]' : 'w-[570px] max-w-full'}`}>
        <div className={'flex flex-col gap-6'}>
          <Header className={'mb-2'}><Shield /> Privacy Preferences</Header>

          <p className={'wrap text-sm'}>
            <span>We and selected third parties use essential cookies or similar technologies on this website to personalize content & services.</span><br />
            <span>You can freely give, deny, or withdraw your consent at any time.</span><br />
            <span>More information can be found in our <a href={'/privacy.html'} target={'_blank'} className={'underline'}>Privacy Statement</a>/<a href={'/imprint.html'} target={'_blank'} className={'underline'}>Imprint</a>.</span><br />
            <span>By clicking 'Accept', you consent to the use of said technologies.</span><br />
          </p>

          <div className={'flex gap-4 justify-end'}>
            <Link onClick={() => resolve(false)}>Reject</Link>
            <Button onClick={() => resolve(true)}>
              <span>Accept</span>
              <Check size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Dialogue;