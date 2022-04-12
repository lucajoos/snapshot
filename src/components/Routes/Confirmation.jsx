import { Mail } from 'react-feather';
import { Header } from '../Base/index.js';

const Confirmation = () => {
  return (
    <div className={'flex flex-col h-full'}>
      <Header className={'ml-10 mt-10 pointer-events-none'}>
        <img src='../../icons/png/128x128.png' className={'h-12'}  alt={'Icon'}/>
        <span>Snapshot</span>
      </Header>
      <div className={'flex flex-col justify-center items-center h-full mb-16 gap-4'}>
        <Mail size={32}/>
        <p className={'text-xl'}>Your email has been successfully confirmed.</p>
      </div>
    </div>
  )
};

export default Confirmation;