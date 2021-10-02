import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectTopic, topicAsync } from './topicSlice';

export function Topic(props: any) {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const topicData = useAppSelector(selectTopic);

  useEffect(() => {
    dispatch(topicAsync(location.pathname.substr(1)));
  }, []);
  return <div>{topicData?.topicId}</div>;
}
