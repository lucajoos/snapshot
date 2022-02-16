import { Header } from './index';

const Box = ({ children, icon=null, onClick=()=>{} }) => {
  return (
    <div className={'p-10 border-4 border-gray-200 rounded cursor-pointer w-[250px]'} onClick={() => onClick()}>
      <div className={'flex flex-col gap-2 items-center'}>
        {icon}
        <Header>{children}</Header>
      </div>
    </div>
  )
};

export default Box;