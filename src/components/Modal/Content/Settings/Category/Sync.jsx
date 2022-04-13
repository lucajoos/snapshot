import React, { useCallback, useEffect } from 'react';
import { useSnapshot } from 'valtio';
import { Cloud, GitPullRequest, Key, Link2, Save, Server } from 'react-feather';

import Store from '../../../../../Store';

import { Button, Link, Option, Section } from '../../../../Base';
import { TextField } from '../../../../Input';

import helpers from '../../../../../modules/helpers';

const Sync = () => {
  const snap = useSnapshot(Store);

  const handleOnChangeIsSynchronizing = useCallback(() => {
    Store.settings.sync.isSynchronizing = !snap.settings.sync.isSynchronizing;
    helpers.settings.save();
  }, [snap.settings.sync.isSynchronizing]);

  const handleOnChangeIsRealtime = useCallback(() => {
    Store.settings.sync.isRealtime = !snap.settings.sync.isRealtime;
    helpers.settings.save();
  }, [snap.settings.sync.isRealtime]);

  const handleOnChangeSupabaseUrl = useCallback(event => {
    Store.modal.data.settings.sync.supabase.supabaseUrl = event.target.value;
  }, []);

  const handleOnChangeSupabaseAnonKey = useCallback(event => {
    Store.modal.data.settings.sync.supabase.supabaseAnonKey = event.target.value;
  }, []);

  const handleOnChangeApplicationUrl = useCallback(event => {
    Store.modal.data.settings.sync.advanced.applicationUrl = event.target.value;
  }, []);

  const handleOnClickApplicationUrlSave = useCallback(async () => {
    if(
      snap.modal.data.settings.sync.advanced.applicationUrl.length > 0
    ) {
      Store.dialogue.text = 'A connection to this third-party server will be established.';
      Store.dialogue.type = 'Save';
      Store.dialogue.isVisible = true;

      Store.dialogue.resolve = (async isAccepted => {
        if(isAccepted) {
          Store.settings.sync.advanced.applicationUrl = snap.modal.data.settings.sync.advanced.applicationUrl;

          helpers.settings.save();

          if(snap.environment === 'extension') {
            await helpers.api.do('window.close');
          } else {
            location.reload();
          }
        } else {
          Store.dialogue.isVisible = false;
        }
      });
    }
  }, [snap.modal.data.settings.sync.advanced.applicationUrl, snap.environment]);

  const handleOnClickApplicationUrlReset = useCallback(async () => {
    if(
      snap.settings.sync.advanced.applicationUrl.length > 0
    ) {
      Store.dialogue.text = 'The connection to the official server will be re-established.';
      Store.dialogue.type = 'Connect';
      Store.dialogue.isVisible = true;

      Store.dialogue.resolve = (async isAccepted => {
        if(isAccepted) {
          Store.settings.sync.advanced.applicationUrl = '';

          helpers.settings.save();

          if(snap.environment === 'extension') {
            await helpers.api.do('window.close');
          } else {
            location.reload();
          }
        } else {
          Store.dialogue.isVisible = false;
        }
      });
    }
  }, [snap.settings.sync.advanced.applicationUrl, snap.environment]);

  const handleOnClickSupabaseSave = useCallback(async () => {
    if(
      snap.modal.data.settings.sync.supabase.supabaseUrl.length > 0 &&
      snap.modal.data.settings.sync.supabase.supabaseAnonKey.length > 0
    ) {
      Store.dialogue.text = 'A connection to this third-party server will be established.';
      Store.dialogue.type = 'Connect';
      Store.dialogue.isVisible = true;

      Store.dialogue.resolve = (async isAccepted => {
        if(isAccepted) {
          Store.settings.sync.supabase.supabaseUrl = snap.modal.data.settings.sync.supabase.supabaseUrl;
          Store.settings.sync.supabase.supabaseAnonKey = snap.modal.data.settings.sync.supabase.supabaseAnonKey;

          helpers.settings.save();

          if(snap.environment === 'extension') {
            await helpers.api.do('window.close');
          } else {
            location.reload();
          }
        } else {
          Store.dialogue.isVisible = false;
        }
      });
    }
  }, [snap.modal.data.settings.sync.supabase.supabaseUrl, snap.modal.data.settings.sync.supabase.supabaseAnonKey, snap.environment]);

  const handleOnClickSupabaseReset = useCallback(async () => {
    if(
      snap.settings.sync.supabase.supabaseUrl.length > 0 &&
      snap.settings.sync.supabase.supabaseAnonKey.length > 0
    ) {
      Store.dialogue.text = 'The connection to the official server will be re-established.';
      Store.dialogue.type = 'Connect';
      Store.dialogue.isVisible = true;

      Store.dialogue.resolve = (async isAccepted => {
        if(isAccepted) {
          Store.settings.sync.supabase.supabaseUrl = '';
          Store.settings.sync.supabase.supabaseAnonKey = '';

          helpers.settings.save();

          if(snap.environment === 'extension') {
            await helpers.api.do('window.close');
          } else {
            location.reload();
          }
        } else {
          Store.dialogue.isVisible = false;
        }
      });
    }
  }, [snap.settings.sync.supabase.supabaseUrl, snap.settings.sync.supabase.supabaseAnonKey, snap.environment]);

  useEffect(() => {
    if(snap.modal.isVisible && snap.modal.content === 'Settings' && snap.modal.data.settings.category === 'Sync') {
      Store.modal.data.settings.sync.advanced.applicationUrl = snap.settings.sync.advanced.applicationUrl;
      Store.modal.data.settings.sync.supabase.supabaseUrl = snap.settings.sync.supabase.supabaseUrl;
      Store.modal.data.settings.sync.supabase.supabaseAnonKey = snap.settings.sync.supabase.supabaseAnonKey;
    }
  }, [snap.modal.isVisible, snap.modal.content, snap.modal.data.settings.category, snap.settings.sync.advanced.applicationUrl, snap.settings.sync.supabase.supabaseUrl, snap.settings.sync.supabase.supabaseAnonKey]);

  return (
    <div className={'flex flex-col gap-6'}>
      <div className={'flex flex-col gap-2'}>
        {snap.environment === 'extension' && (
            <Option.Switch
                title={'Synchronize'}
                icon={<Cloud />}
                value={snap.settings.sync.isSynchronizing}
                onChange={() => handleOnChangeIsSynchronizing()}
            />
        )}

        <Option.Switch
          title={'Realtime'}
          icon={<GitPullRequest />}
          value={snap.settings.sync.isRealtime}
          onChange={() => handleOnChangeIsRealtime()}
        />
      </div>

      <Section title={'Advanced'}>
        <div className={'flex flex-col gap-4'}>
          <TextField
              value={snap.modal.data.settings.sync.advanced.applicationUrl}
              placeholder={'Application URL'}
              onChange={event => handleOnChangeApplicationUrl(event)}
              icon={<Link2 size={18} />}
          />

          <div className={'flex mt-2 gap-4 justify-end'}>
            <Link onClick={() => handleOnClickApplicationUrlReset()}>Reset</Link>
            <Button onClick={() => handleOnClickApplicationUrlSave()}>
              <span>Save</span>
              <Save size={18} />
            </Button>
          </div>
        </div>
      </Section>

      <Section title={'Supabase'}>
        <div className={'flex flex-col gap-4'}>
          <TextField
              value={snap.modal.data.settings.sync.supabase.supabaseUrl}
              placeholder={'Supabase URL'}
              onChange={event => handleOnChangeSupabaseUrl(event)}
              icon={<Link2 size={18} />}
          />

          <TextField
              value={snap.modal.data.settings.sync.supabase.supabaseAnonKey}
              placeholder={'Supabase Anon Key'}
              onChange={event => handleOnChangeSupabaseAnonKey(event)}
              icon={<Key size={18} />}
              type={'password'}
          />

          <div className={'flex mt-2 gap-4 justify-end'}>
            <Link onClick={() => handleOnClickSupabaseReset()}>Reset</Link>
            <Button onClick={() => handleOnClickSupabaseSave()}>
              <span>Connect</span>
              <Server size={18} />
            </Button>
          </div>
        </div>
      </Section>
    </div>
  )
};

export default Sync;