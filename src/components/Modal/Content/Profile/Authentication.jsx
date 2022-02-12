import React, { useCallback } from 'react';
import { useSnapshot } from 'valtio';
import { AlertTriangle, Archive, Inbox, Loader, Lock, LogIn, Search, User } from 'react-feather';

import { Button, Header, Link } from '../../../Base';
import { TextField } from '../../../Input';

import Store from '../../../../Store';
import supabase from '../../../../modules/supabase';

const Authentication = () => {
  const snap = useSnapshot(Store);

  const handleOnChangeEmail = useCallback(event => {
    Store.modal.data.profile.email = event.target.value;
  }, []);

  const handleOnChangePassword = useCallback(event => {
    Store.modal.data.profile.password = event.target.value;
  }, []);

  const handleOnClickAuthenticate = useCallback(async () => {
    if(snap.modal.data.profile.error) {
      Store.modal.data.profile.error = null;
    }

    if(
      (snap.modal.data.profile.email ? snap.modal.data.profile.email.length > 0 : false) &&
      (snap.modal.data.profile.password ? snap.modal.data.profile.password.length > 0 : false)
    ) {
      try {
        Store.modal.data.profile.isLoading = true;

        const { error } = await supabase.auth[snap.modal.data.profile.isSigningIn ? 'signIn' : 'signUp']({
          email: snap.modal.data.profile.email,
          password: snap.modal.data.profile.password
        });

        if(error) {
          Store.modal.data.profile.error = `${error.message}!` || '';
        }
      } catch(e) {
        console.error(e);
      } finally {
        if(snap.modal.data.profile.isSigningIn) {
          Store.modal.data.profile.isLoading = false;
        }
      }
    } else {
      Store.modal.data.profile.error = 'Empty login credentials!'
    }
  }, [snap.modal.data.profile.error, snap.modal.data.profile.email, snap.modal.data.profile.password, snap.modal.data.profile.isSigningIn]);

  const handleOnClickChangeMode = useCallback(async () => {
    if(snap.modal.data.profile.error) {
      Store.modal.data.profile.error = null;
    }

    Store.modal.data.profile.isSigningIn = !snap.modal.data.profile.isSigningIn;
  }, [snap.modal.data.profile.isSigningIn, snap.modal.data.profile.error]);

  return (
    snap.modal.data.profile.isLoading ? (
      <div className={'h-full flex flex-col justify-center text-center items-center mt-2 mb-20'}>
        <div className={`justify-self-center${snap.modal.data.profile.isSigningIn ? ' animate-spin-slow' : ''}`}>
          {snap.modal.data.profile.isSigningIn ? (
            <Loader size={32} />
          ) : (
            <Inbox size={32} />
          )}
        </div>
        <p className={'mt-4'}>{!snap.modal.data.profile.isSigningIn ? `We've sent you a confirmation email!` : `This will only take a moment`}</p>
      </div>
    ) : (
      <>
        <div className={'flex my-6'}>
          <span>{snap.modal.data.profile.isSigningIn ? `Don't have an account?` : `Already have an account?`}&nbsp;</span>
          <Link onClick={() => handleOnClickChangeMode()}>{snap.modal.data.profile.mode === 'signIn' ? `Sign-in` : `Sign-up`}</Link>
        </div>

        {snap.modal.data.profile.error ? (
          <div className={'mb-6 rounded p-3 bg-pink-default flex items-center'}>
            <div className={'mx-2'}><AlertTriangle size={18}/></div>
            <span>{snap.modal.data.profile.error}</span>
          </div>
        ) : ''}

        <TextField
          type={'email'}
          value={snap.modal.data.profile.email}
          placeholder={'Email address'}
          onChange={event => handleOnChangeEmail(event)}
          icon={<User size={18} />}
        />

        <TextField
          type={'password'}
          value={snap.modal.data.profile.password}
          placeholder={'Password'}
          onChange={event => handleOnChangePassword(event)}
          className={'mt-4'}
          icon={<Lock size={18} />}
        />

        <Button className={'mt-6'} onClick={() => handleOnClickAuthenticate()}>
          <span className={'mx-2'}>{snap.modal.data.profile.isSigningIn ? `Sign-in` : `Sign-up`}</span>
          <LogIn size={18} />
        </Button>
      </>
    )
  );
};

export default Authentication;