import { AlertTriangle } from 'react-feather';
import React from 'react';

const Alert = ({ children, color='pink-default', icon=<AlertTriangle size={18}/> }) => {
  return (
    <div className={`mb-6 rounded p-3 flex items-center bg-${color}`}>
      <div className={'mx-2'}>{icon}</div>
      <span>{children}</span>
    </div>
  )
};

export default Alert;