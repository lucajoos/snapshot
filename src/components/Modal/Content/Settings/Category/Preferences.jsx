import { Option, Section } from '../../../../Base';
import React, { useCallback } from 'react';
import { useSnapshot } from 'valtio';
import Store from '../../../../../Store';
import { ExternalLink, Maximize, Trash } from 'react-feather';
import helpers from '../../../../../modules/helpers';

const Preferences = () => {
  const snap = useSnapshot(Store);

  const handleOnChangeDeletePermanently = useCallback(() => {
    Store.settings.behaviour.cards.isDeletingPermanently = !snap.settings.behaviour.cards.isDeletingPermanently;
    helpers.settings.save();
  }, [snap.settings.behaviour.cards.isDeletingPermanently]);

  const handleOnChangeOpenInWindow = useCallback(() => {
    Store.settings.behaviour.cards.isOpeningInWindow = !snap.settings.behaviour.cards.isOpeningInWindow;
    helpers.settings.save();
  }, [snap.settings.behaviour.cards.isOpeningInWindow]);

  const handleOnChangeFullscreen = useCallback(async () => {
    Store.settings.behaviour.isFullscreen = !snap.settings.behaviour.isFullscreen;
    helpers.settings.save();

    if(!snap.settings.behaviour.isFullscreen && !snap.isFullscreen) {
      await helpers.api.do('tabs.create', {
        url: await helpers.api.do('runtime.getURL', 'app.html?fullscreen=true')
      }, { isWaiting: false });
    }
  }, [snap.settings.behaviour.isFullscreen, snap.isFullscreen]);

  return (
    <>
      <div className={'flex flex-col gap-6'}>
        <Option.Switch
          title={'Always Fullscreen'}
          icon={<Maximize />}
          onChange={() => handleOnChangeFullscreen()}
          value={snap.settings.behaviour.isFullscreen}
        />

        <div>
          <Section>Cards</Section>
          <div className={'flex flex-col gap-2'}>
            <Option.Switch
              title={'Open in Window'}
              icon={<ExternalLink />}
              onChange={() => handleOnChangeOpenInWindow()}
              value={snap.settings.behaviour.cards.isOpeningInWindow}
            />
            <Option.Switch
              title={'Delete Permanently'}
              icon={<Trash />}
              onChange={() => handleOnChangeDeletePermanently()}
              value={snap.settings.behaviour.cards.isDeletingPermanently}
            />
          </div>
        </div>
      </div>
    </>
  )
};

export default Preferences;