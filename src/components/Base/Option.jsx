import { ChevronRight } from 'react-feather';

const Option = ({ title='', icon=null, onClick=()=>{}}) => {
  return (
    <div className={'option flex items-center cursor-pointer width-full bg-gray-200 rounded pl-4 pr-2 py-4 justify-between'} onClick={() => onClick(title)}>
      <div className={'flex gap-4 items-center'}>
        <div>
          {icon}
        </div>
        <p>{title}</p>
      </div>
      <div className={'mr-2'}>
        <ChevronRight />
      </div>
    </div>
  )
};

export default Option;