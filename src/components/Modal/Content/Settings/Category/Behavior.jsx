import { Option, Section } from '../../../../Base';
import React, { useCallback } from 'react';
import { useSnapshot } from 'valtio';
import Store from '../../../../../Store';
import { ExternalLink, Maximize, Play, Trash } from 'react-feather';
import helpers from '../../../../../modules/helpers';

const Behavior = () => {
  const snap = useSnapshot(Store);

  const handleOnChangeDeletePermanently = useCallback(() => {
    Store.settings.behavior.cards.isDeletingPermanently = !snap.settings.behavior.cards.isDeletingPermanently;
    helpers.settings.save();
  }, [snap.settings.behavior.cards.isDeletingPermanently]);

  const handleOnChangeOpenInWindow = useCallback(() => {
    Store.settings.behavior.cards.isOpeningInWindow = !snap.settings.behavior.cards.isOpeningInWindow;
    helpers.settings.save();
  }, [snap.settings.behavior.cards.isOpeningInWindow]);

  const handleOnChangeEffects = useCallback(() => {
    Store.settings.behavior.isRenderingEffects = !snap.settings.behavior.isRenderingEffects;
    helpers.settings.save();
    window.location.reload();
  }, [snap.settings.behavior.isRenderingEffects]);

  const handleOnChangeFullscreen = useCallback(async () => {
    Store.settings.behavior.isFullscreen = !snap.settings.behavior.isFullscreen;
    helpers.settings.save();

    if(!snap.settings.behavior.isFullscreen && !snap.isFullscreen) {
      await helpers.api.do('tabs.create', {
        url: await helpers.api.do('runtime.getURL', 'app.html?fullscreen=true')
      }, { isWaiting: false });
    }
  }, [snap.settings.behavior.isFullscreen, snap.isFullscreen]);

  return (
    <>
      <div className={'flex flex-col gap-6'}>
        <div>
          {
              snap.environment === 'extension' && (
                  <Option.Switch
                      title={'Always Fullscreen'}
                      icon={<Maximize />}
                      onChange={() => handleOnChangeFullscreen()}
                      value={snap.settings.behavior.isFullscreen}
                  />
              )
          }

          <Option.Switch
              title={'Render Effects'}
              icon={<Play />}
              onChange={() => handleOnChangeEffects()}
              value={snap.settings.behavior.isRenderingEffects}
          />
        </div>

        <Section title={'Cards'}>
          <div className={'flex flex-col gap-2'}>
            {
                snap.environment === 'extension' && (
                    <Option.Switch
                        title={'Open in Window'}
                        icon={<ExternalLink />}
                        onChange={() => handleOnChangeOpenInWindow()}
                        value={snap.settings.behavior.cards.isOpeningInWindow}
                    />
                )
            }
            <Option.Switch
                title={'Delete Permanently'}
                icon={<Trash />}
                onChange={() => handleOnChangeDeletePermanently()}
                value={snap.settings.behavior.cards.isDeletingPermanently}
            />
          </div>
        </Section>
      </div>
    </>
  )
};

export default Behavior;