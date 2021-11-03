import { AuthButton } from '../../../features/AuthButton/AuthButton';
import styles from './SuggestATopic.module.scss';
import {
  Button,
  FormControl,
  IconButton,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import { useHistory, useLocation } from 'react-router-dom';
import { AddCircle, Delete, Home } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { API, Auth } from 'aws-amplify';

const CssButton = styled(Button)({
  backgroundColor: '#040403',
  marginBottom: '1rem',
  '&:hover': { backgroundColor: '#040403' },
});

const CssTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: '#040403',
      //  background: 'white',
    },
    '&.Mui-error fieldset': {
      borderColor: 'red',
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
  const [extraOptionValues, setExtraOptionValues] = useState<string[]>([]);
  const [optionValues, setOptionValues] = useState<string[]>([
    '',
    '',
    '',
    '',
    '',
  ]);
  const [topicValue, setTopicValue] = useState<string>('');
  const [isSubmitTriggered, setSubmitTriggered] = useState<boolean>(false);

  return (
    <div className={styles.outerContainer}>
      <div className={styles.homeContainer}>
        <CssIconButton
          color="inherit"
          onClick={() => {
            history.push('/');
          }}
        >
          <Home fontSize="inherit" />
        </CssIconButton>{' '}
      </div>
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
            error={topicValue === '' && isSubmitTriggered}
            placeholder="to the beach"
            variant="outlined"
            inputProps={{ maxLength: 32 }}
            onChange={(event) => {
              setTopicValue(event.target.value);
            }}
          />
        </div>
      </div>
      <div className={styles.optionListContainer}>
        {optionValues.map((option, i) => (
          <div className={styles.optionContainer} key={`option-${i}`}>
            <Typography variant="subtitle1" className={styles.optionText}>
              Option {i + 1}:
            </Typography>
            <CssTextField
              error={option === '' && isSubmitTriggered}
              focused
              variant="outlined"
              inputProps={{ maxLength: 32 }}
              placeholder={placeHolderOptions[i]}
              value={option}
              onChange={(event) => {
                const _optionValues = [...optionValues];
                _optionValues[i] = event.target.value;
                setOptionValues(_optionValues);
              }}
            />
            <div className={styles.extraSpacing}></div>
          </div>
        ))}
        {extraOptionValues.map((option, i) => (
          <div className={styles.optionContainer} key={`extra-option-${i}`}>
            <Typography variant="subtitle1" className={styles.optionText}>
              Option {i + 6}:
            </Typography>
            <CssTextField
              error={option === '' && isSubmitTriggered}
              focused
              variant="outlined"
              value={option}
              onChange={(event) => {
                const _extraOptions = [...extraOptionValues];
                _extraOptions[i] = event.target.value;
                setExtraOptionValues(_extraOptions);
              }}
              inputProps={{ maxLength: 32 }}
            />
            <CssIconButton
              color="inherit"
              onClick={() => {
                const _extraOptions = [...extraOptionValues];
                _extraOptions.splice(i, 1);
                setExtraOptionValues(_extraOptions);
              }}
            >
              <Delete fontSize="inherit" />
            </CssIconButton>
          </div>
        ))}{' '}
        {extraOptionValues.length < 10 && (
          <CssIconButton
            color="inherit"
            onClick={() => {
              setExtraOptionValues([...extraOptionValues, '']);
            }}
            sx={{
              marginBottom: '1rem',
            }}
          >
            <AddCircle fontSize="inherit" />
          </CssIconButton>
        )}
        <CssButton
          variant="contained"
          className={styles.button}
          onClick={async () => {
            setSubmitTriggered(true);
            if (
              !optionValues.includes('') &&
              !extraOptionValues.includes('') &&
              topicValue !== ''
            ) {
              const myInit = {
                headers: {
                  Authorization: `Bearer ${(await Auth.currentSession())
                    .getIdToken()
                    .getJwtToken()}`,
                },
                body: {
                  topicText: topicValue,
                  options: [...optionValues, ...extraOptionValues],
                },
              };
              API.post('whatToBringApi', '/suggestTopic', myInit);
              history.push('/topic-submitted');
            }
          }}
        >
          Submit
        </CssButton>
      </div>
    </div>
  );
}
