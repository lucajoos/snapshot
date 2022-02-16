import React, { useCallback, useEffect, useRef } from 'react';
import { useSnapshot } from 'valtio';
import { AlertTriangle, Eye, EyeOff, Inbox, Loader, Lock, LogIn, Mail, Phone, User } from 'react-feather';

import { Alert, Button, Link } from '../../../Base';
import { TextField } from '../../../Input';

import Store from '../../../../Store';
import supabase from '../../../../modules/supabase';

const Authentication = () => {
  const snap = useSnapshot(Store);
  const emailRef = useRef(null);

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

        const { data, error } = await supabase.auth[snap.modal.data.profile.isSignIn ? 'signIn' : 'signUp']({
          email: snap.modal.data.profile.email,
          password: snap.modal.data.profile.password
        }, {
          redirectTo: `${snap.settings.sync.advanced.applicationUrl.length === 0 ? import.meta.env.VITE_APP_APPLICATION_URL : snap.settings.sync.advanced.applicationUrl}/confirmed`
        });

        if(error) {
          Store.modal.data.profile.error = `${error.message}!` || '';
        } else if(data?.user?.role === 'authenticated') {
          snap.modal.data.profile.done();
        }
      } catch(e) {
        console.error(e);
      } finally {
        if(snap.modal.data.profile.isSignIn) {
          Store.modal.data.profile.isLoading = false;
        }
      }
    } else {
      Store.modal.data.profile.error = 'Empty login credentials!'
    }
  }, [snap.settings.sync.advanced.applicationUrl, snap.modal.data.profile.error, snap.modal.data.profile.done, snap.modal.data.profile.email, snap.modal.data.profile.password, snap.modal.data.profile.isSignIn]);

  const handleOnClickChangeMode = useCallback(async () => {
    if(snap.modal.data.profile.error) {
      Store.modal.data.profile.error = null;
    }

    Store.modal.data.profile.isSignIn = !snap.modal.data.profile.isSignIn;
  }, [snap.modal.data.profile.isSignIn, snap.modal.data.profile.error]);

  const handleOnClickAbility = useCallback(() => {
    Store.modal.data.profile.isPasswordVisible = !snap.modal.data.profile.isPasswordVisible;
  }, [snap.modal.data.profile.isPasswordVisible]);

  // Effects
  useEffect(() => {
    if(snap.modal.isVisible && snap.modal.content === 'Profile') {
      emailRef.current?.focus();
    }
  }, [snap.modal.isVisible, snap.modal.content]);

  return (
    snap.modal.data.profile.isLoading ? (
      <div className={'h-full flex flex-col justify-center text-center items-center mt-2'}>
        <div className={`justify-self-center${snap.modal.data.profile.isSignIn ? ' animate-spin-slow' : ''}`}>
          {snap.modal.data.profile.isSignIn ? (
            <Loader size={32} />
          ) : (
            <Inbox size={32} />
          )}
        </div>
        <p className={'mt-4'}>{!snap.modal.data.profile.isSignIn ? `We've sent you a confirm email!` : `This will only take a moment`}</p>
      </div>
    ) : (
      <>
        <div className={'flex mb-6'}>
          <span>{snap.modal.data.profile.isSignIn ? `Don't have an account?` : `Already have an account?`}&nbsp;</span>
          <Link onClick={() => handleOnClickChangeMode()} hasUnderline={true}>{snap.modal.data.profile.isSignIn ? `Sign-up` : `Sign-in`}</Link>
        </div>

        {snap.modal.data.profile.error ? (
          <Alert>{snap.modal.data.profile.error}</Alert>
        ) : ''}

        <div className={'flex flex-col gap-4'}>
          <TextField
            type={'email'}
            value={snap.modal.data.profile.email}
            placeholder={'Email address'}
            onChange={event => handleOnChangeEmail(event)}
            icon={<Mail size={18} />}
            onKeyDown={async event => { if(event.keyCode === 13) await handleOnClickAuthenticate() }}
            nativeRef={emailRef}
          />

          <TextField
            type={snap.modal.data.profile.isPasswordVisible ? 'text' : 'password'}
            value={snap.modal.data.profile.password}
            placeholder={'Password'}
            onChange={event => handleOnChangePassword(event)}
            icon={<Lock size={18} />}
            onKeyDown={async event => { if(event.keyCode === 13) await handleOnClickAuthenticate() }}
            ability={snap.modal.data.profile.isPasswordVisible ? <Eye size={18}/> : <EyeOff size={18}/>}
            onClickAbility={() => handleOnClickAbility()}
          />
        </div>

        <Button className={'mt-6 self-end'} onClick={() => handleOnClickAuthenticate()}>
          <span>{snap.modal.data.profile.isSignIn ? `Sign-in` : `Sign-up`}</span>
          <LogIn size={18} />
        </Button>
      </>
    )
  );
};

export default Authentication;