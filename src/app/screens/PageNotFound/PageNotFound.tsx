import { AuthButton } from '../../../features/AuthButton/AuthButton';
import styles from './PageNotFound.module.scss';
import { Button, styled, Typography } from '@mui/material';
import { useHistory, useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';
import { useEffect } from 'react';

const CssButton = styled(Button)({
  backgroundColor: '#040403',
  marginBottom: '1rem',
  '&:hover': { backgroundColor: '#040403' },
});
export function PageNotFound(props: any) {
  const history = useHistory();
  const location = useLocation();
  useEffect(() => {
    ReactGA.send('/pageNotFound');
  }, []);
  return (
    <div>
      <div className={styles.authContainer}>
        <AuthButton user={props.user} />
      </div>
      <div className={styles.container}>
        <Typography variant="h1" className={styles.heading}>
          404
        </Typography>
        <Typography variant="h3" className={styles.heading}>
          Sorry, we couldn't find the topic:{' '}
          <b>{location.pathname.substr(5)}</b>
        </Typography>
        <CssButton
          variant="contained"
          className={styles.button}
          onClick={() => history.push('/suggest-a-topic')}
        >
          Suggest A Topic
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
