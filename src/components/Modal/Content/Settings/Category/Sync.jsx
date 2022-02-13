import React, { useCallback, useEffect } from 'react';
import { useSnapshot } from 'valtio';
import Store from '../../../../../Store';
import { Button, Option, Section } from '../../../../Base';
import { Cloud, GitPullRequest, Key, Link2, Save } from 'react-feather';
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
    Store.modal.data.settings.sync.advanced.supabaseUrl = event.target.value;
  }, []);

  const handleOnChangeSupabaseAnonKey = useCallback(event => {
    Store.modal.data.settings.sync.advanced.supabaseAnonKey = event.target.value;
  }, []);

  const handleOnClickSupabaseSave = useCallback(async () => {
    Store.settings.sync.advanced.supabaseUrl = snap.modal.data.settings.sync.advanced.supabaseUrl;
    Store.settings.sync.advanced.supabaseAnonKey = snap.modal.data.settings.sync.advanced.supabaseAnonKey;

    helpers.settings.save();
    await helpers.api.do('window.close');
  }, [snap.modal.data.settings.sync.advanced.supabaseUrl, snap.modal.data.settings.sync.advanced.supabaseAnonKey]);

  useEffect(() => {
    if(snap.modal.isVisible && snap.modal.content === 'Settings' && snap.modal.data.settings.category === 'Sync') {
       Store.modal.data.settings.sync.advanced.supabaseUrl = snap.settings.sync.advanced.supabaseUrl;
       Store.modal.data.settings.sync.advanced.supabaseAnonKey = snap.settings.sync.advanced.supabaseAnonKey;
    }
  }, [snap.modal.isVisible, snap.modal.content, snap.modal.data.settings.category, snap.settings.sync.advanced.supabaseUrl, snap.settings.sync.advanced.supabaseAnonKey]);

  return (
    <div className={'flex flex-col gap-6'}>
      <div className={'flex flex-col gap-2'}>
        <Option.Switch
          title={'Synchronize'}
          icon={<Cloud />}
          value={snap.settings.sync.isSynchronizing}
          onChange={() => handleOnChangeIsSynchronizing()}
        />

        <Option.Switch
          title={'Realtime'}
          icon={<GitPullRequest />}
          value={snap.settings.sync.isRealtime}
          onChange={() => handleOnChangeIsRealtime()}
        />
      </div>

      <div>
        <Section>Supabase</Section>
        <div className={'flex flex-col gap-4'}>
          <TextField
            value={snap.modal.data.settings.sync.advanced.supabaseUrl}
            placeholder={'Supabase Url'}
            onChange={event => handleOnChangeSupabaseUrl(event)}
            icon={<Link2 size={18} />}
          />
          <TextField
            value={snap.modal.data.settings.sync.advanced.supabaseAnonKey}
            placeholder={'Supabase Anon Key'}
            onChange={event => handleOnChangeSupabaseAnonKey(event)}
            icon={<Key size={18} />}
            type={'password'}
          />

          <Button className={'self-end'} onClick={() => handleOnClickSupabaseSave()}>
            <span>Save</span>
            <Save size={18} />
          </Button>
        </div>
      </div>
    </div>
  )
};

export default Sync;