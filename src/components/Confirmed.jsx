import { Header } from './Base';
import { Mail } from 'react-feather';

const Confirmed = () => {
  return (
    <div className={'flex flex-col h-full'}>
      <Header className={'ml-10 mt-10 pointer-events-none'}>
        <img src='../icons/png/128x128.png' className={'h-12'}  alt={'Icon'}/>
        <span>Snapshot</span>
      </Header>
      <div className={'flex flex-col justify-center items-center h-full mb-16 gap-4'}>
        <Mail size={32}/>
        <p className={'text-xl'}>Your email has been successfully dialogueed.</p>
      </div>
    </div>
  )
};

export default Confirmed;