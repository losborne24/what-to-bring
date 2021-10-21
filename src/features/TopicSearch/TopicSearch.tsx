import { Search } from '@mui/icons-material';
import { TextField, Autocomplete, InputAdornment } from '@mui/material';
import { useState } from 'react';
import { alpha, styled } from '@mui/material/styles';
import styles from './TopicSearch.module.scss';
import { filterTopicAsync, selectFilterTopics } from './topicSearchSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Redirect, useHistory } from 'react-router';

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
  '& .MuiSvgIcon-root': {
    color: '#040403',
    zIndex: 10,
  },
});

export function TopicSearch() {
  const [value, setValue] = useState<any>(null);
  const [inputValue, setInputValue] = useState('');
  const dispatch = useAppDispatch();
  const filterTopics = useAppSelector(selectFilterTopics);
  const history = useHistory();

  return (
    <Autocomplete
      value={value}
      onChange={(event: any, newValue: any) => {
        if (newValue) {
          history.push(`/${newValue.topicId}`);
        }
      }}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        dispatch(filterTopicAsync(newInputValue));
        setInputValue(newInputValue);
      }}
      filterOptions={(options, state) => options}
      freeSolo
      options={filterTopics}
      getOptionLabel={(option) => option.topicText}
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
  );
}
