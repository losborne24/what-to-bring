import { AuthButton } from '../../../features/AuthButton/AuthButton';
import styles from './PageNotFound.module.scss';
import { Button, styled, Typography } from '@mui/material';
import { useHistory, useLocation } from 'react-router-dom';

const CssButton = styled(Button)({
  backgroundColor: 'black',
  marginBottom: '1rem',
  '&:hover': { backgroundColor: 'black' },
});
export function PageNotFound(props: any) {
  const history = useHistory();
  const location = useLocation();
  return (
    <div>
      <div className={styles.authContainer}>
        <AuthButton user={props.user} />
      </div>
      <div className={styles.container}>
        <Typography variant="h1" className={styles.heading}>
          404
        </Typography>
        <Typography variant="h2" className={styles.heading}>
          Page Not Found
        </Typography>
        <CssButton
          variant="contained"
          className={styles.button}
          onClick={() => history.push('/')}
        >
          Return Home
        </CssButton>
        <CssButton
          variant="contained"
          className={styles.button}
          onClick={() => history.push('/')}
        >
          Suggest {location.pathname.substr(5)} as a topic
        </CssButton>
      </div>
    </div>
  );
}
