import { AuthButton } from '../../../features/AuthButton/AuthButton';
import styles from './TopicSubmitted.module.scss';
import { Button, styled, Typography } from '@mui/material';
import { useHistory, useLocation } from 'react-router-dom';

const CssButton = styled(Button)({
  backgroundColor: '#040403',
  marginBottom: '1rem',
  '&:hover': { backgroundColor: '#040403' },
});
export function TopicSubmitted(props: any) {
  const history = useHistory();
  const location = useLocation();
  return (
    <div>
      <div className={styles.authContainer}>
        <AuthButton user={props.user} />
      </div>
      <div className={styles.container}>
        <Typography variant="h3" className={styles.heading}>
          Thank you for your topic suggestion!
        </Typography>
        <Typography variant="h4" className={styles.heading}>
          It will be reviewed shortly.
        </Typography>
        <CssButton
          variant="contained"
          className={styles.button}
          onClick={() => history.push('/suggest-a-topic')}
        >
          Suggest Another Topic
        </CssButton>
        <Typography variant="body1" className={styles.body}>
          OR{' '}
        </Typography>{' '}
        <CssButton
          variant="contained"
          className={styles.button}
          onClick={() => history.push('/')}
        >
          Return Home
        </CssButton>
      </div>
    </div>
  );
}
