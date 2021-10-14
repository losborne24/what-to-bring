import { AuthButton } from '../../../features/AuthButton/AuthButton';
import styles from './Home.module.scss';
import { TopicSearch } from '../../../features/TopicSearch/TopicSearch';
import { Typography } from '@mui/material';

export function Home(props: any) {
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
