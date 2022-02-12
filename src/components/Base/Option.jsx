import { ChevronRight } from 'react-feather';

const Option = ({ title='', icon=null, onClick=()=>{}}) => {
  return (
    <div className={'flex items-center cursor-pointer bg-gray-200 rounded width-full px-6 py-4 justify-between'} onClick={() => onClick(title)}>
      <div className={'flex gap-4 items-center'}>
        <div>
          {icon}
        </div>
        <p className={'font-xl'}>{title}</p>
      </div>
      <div>
        <ChevronRight />
      </div>
    </div>
  )
};

export default Option;