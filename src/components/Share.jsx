import { useNavigate, useParams } from 'react-router-dom';
import { Header } from './Base';
import { useCallback, useEffect } from 'react';

const Share = () => {
  const params = useParams();
  const navigate = useNavigate();

  const handleOnClickWeb = useCallback(() => {
    navigate(`/?id=${params.id}`);
  }, []);

  useEffect(() => {
    console.log(params.id)
  }, []);

  return (
    <div className={'flex justify-center gap-6 items-center h-full'}>
      <div className={'p-10 bg-gray-200 rounded cursor-pointer'} onClick={() => handleOnClickWeb()}>
        <Header>Open Here</Header>
      </div>
      <div className={'p-10 bg-gray-200 rounded cursor-pointer'}>
        <Header>Extension</Header>
      </div>
    </div>
  )
};

export default Share;