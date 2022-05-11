import React, { useCallback, useEffect, useRef } from 'react';
import { useSnapshot } from 'valtio';
import { Clipboard, Link2, Share as ShareIcon } from 'react-feather';

import Store from '../../../Store';

import { Button, Header, Link } from '../../Base';
import { TextField } from '../../Input';


const Share = () => {
  const snap = useSnapshot(Store);
  const urlRef = useRef();

  const handleOnClickCancel = useCallback(() => {
    Store.modal.isVisible = false;
  }, []);

  const handleOnClickCopy = useCallback(() => {
    urlRef.current?.focus();
    urlRef.current?.select();

    document.execCommand('copy');

    Store.modal.isVisible = false;
  }, []);

  useEffect(() => {
    if(snap.modal.isVisible && snap.modal.content === 'Share') {
      urlRef.current?.focus();
      urlRef.current?.setSelectionRange(0, 0);
    }
  }, [snap.modal.isVisible, snap.modal.content])

  return (
    <div className={'flex flex-col gap-6'}>
      <Header><ShareIcon /> Share</Header>

      <p>Anyone with this link will be able to access this card.</p>

      <div className={'flex flex-col gap-2'}>
        <TextField nativeRef={urlRef} placeholder={'Share URL'} icon={<Link2 />} value={`${snap.settings.sync.advanced.applicationUrl.length === 0 ? import.meta.env.VITE_APP_APPLICATION_URL : snap.settings.sync.advanced.applicationUrl}/s/${snap.modal.data.share.id}`}/>
      </div>

      <div className={'flex gap-4 justify-end'}>
        <Link onClick={() => handleOnClickCancel()}>Cancel</Link>
        <Button onClick={() => handleOnClickCopy()}>
          <span>Copy</span>
          <Clipboard size={18} />
        </Button>
      </div>
    </div>
  )
};

export default Share;