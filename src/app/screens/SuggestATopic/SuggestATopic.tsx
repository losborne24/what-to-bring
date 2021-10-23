import { AuthButton } from '../../../features/AuthButton/AuthButton';
import styles from './SuggestATopic.module.scss';
import {
  Button,
  IconButton,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import { useHistory, useLocation } from 'react-router-dom';
import { AddCircle } from '@mui/icons-material';
import { useState } from 'react';

const CssButton = styled(Button)({
  backgroundColor: '#040403',
  marginBottom: '1rem',
  '&:hover': { backgroundColor: '#040403' },
});

const CssTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#040403',
  },

  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: '#040403',
      //  background: 'white',
    },
  },
  '& .MuiInputBase-root': {
    color: '#040403',
  },
});
const CssIconButton = styled(IconButton)({
  backgroundColor: '#ffcb77',
  fontSize: 32,
  '&:hover': { backgroundColor: '#ffcb77' },
  marginBottom: '1rem',
});
const placeHolderOptions = [
  'Sandals',
  'Sunglasses',
  'Bucket',
  'Spade',
  'Swimming Trunks',
];
export function SuggestATopic(props: any) {
  const history = useHistory();
  const [extraOptionCount, setExtraOptionCount] = useState(0);
  const extraOptions = () => {
    const extraOptionsList = [];
    for (let i = 0; i < extraOptionCount; i++) {
      extraOptionsList.push(
        <div className={styles.optionContainer} key={i}>
          <Typography variant="subtitle1" className={styles.topicText}>
            Option {i + 6}:
          </Typography>
          <CssTextField
            focused
            variant="outlined"
            inputProps={{ maxLength: 32 }}
          />
        </div>
      );
    }
    return extraOptionsList;
  };
  return (
    <div className={styles.outerContainer}>
      <div className={styles.authContainer}>
        <AuthButton user={props.user} />
      </div>
      <div className={styles.container}>
        <Typography variant="h3" className={styles.heading}>
          Suggest A Topic
        </Typography>
        <div className={styles.topicContainer}>
          <Typography variant="h4" className={styles.topicText}>
            What to bring:
          </Typography>
          <CssTextField
            focused
            placeholder="to the beach"
            variant="outlined"
            inputProps={{ maxLength: 32 }}
          />
        </div>
      </div>
      <div className={styles.optionListContainer}>
        {placeHolderOptions.map((option, i) => (
          <div className={styles.optionContainer} key={`${option}-${i}`}>
            <Typography variant="subtitle1" className={styles.topicText}>
              Option {i + 1}:
            </Typography>
            <CssTextField
              focused
              placeholder={option}
              variant="outlined"
              inputProps={{ maxLength: 32 }}
            />
          </div>
        ))}
        {extraOptions()}
        {extraOptionCount < 10 && (
          <CssIconButton
            color="inherit"
            onClick={() => {
              setExtraOptionCount(extraOptionCount + 1);
            }}
          >
            <AddCircle fontSize="inherit" />
          </CssIconButton>
        )}
        <CssButton
          variant="contained"
          className={styles.button}
          onClick={() => history.push('/')}
        >
          Submit
        </CssButton>
      </div>
    </div>
  );
}
