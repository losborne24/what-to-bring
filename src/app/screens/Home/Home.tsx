import { AuthButton } from '../../../features/AuthButton/AuthButton';
import styles from './Home.module.scss';
import { TopicSearch } from '../../../features/TopicSearch/TopicSearch';
import { Typography } from '@mui/material';
import { useEffect } from 'react';
import ReactGA from 'react-ga4';

export function Home(props: any) {
  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: '/home' });
  }, []);

  return (
    <div>
      <div className={styles.authContainer}>
        <AuthButton user={props.user} />
      </div>
      <div className={styles.container}>
        <Typography variant="h2" className={styles.heading}>
          What to bring...
        </Typography>
        <div className={styles.topicSearchContainer}>
          <TopicSearch />
        </div>
      </div>
    </div>
  );
}
