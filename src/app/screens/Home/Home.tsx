import React, { useState, useEffect } from 'react';
import {
  Autocomplete,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { AuthButton } from '../../../features/AuthButton/AuthButton';
import styles from './Home.module.scss';
import { alpha, styled } from '@mui/material/styles';

const options = ['Option 1', 'Option 2'];

const CssTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#040403',
  },
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: '#040403',
    },
  },
  '& .MuiInputBase-root': {
    color: '#040403',
  },
  '& .MuiSvgIcon-root': {
    color: '#040403',
  },
});

export function Home(props: any) {
  const [value, setValue] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  return (
    <div>
      <div className={styles.authContainer}>
        <AuthButton user={props.user} />
      </div>
      <div className={styles.container}>
        <Autocomplete
          value={value}
          onChange={(event: any, newValue: string | null) => {
            setValue(newValue);
          }}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          freeSolo
          options={options}
          className={styles.autocomplete}
          renderInput={(params) => (
            <CssTextField
              focused
              {...params}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      </div>
    </div>
  );
}
