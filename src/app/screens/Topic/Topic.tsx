import {
  IconButton,
  Button,
  Typography,
  Link,
  styled,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  selectOptions,
  selectTopic,
  topicAsync,
  selectUserVotes,
  userVotesAsync,
  userDownvoteAsync,
  userUpvoteAsync,
  selectTotal,
  selectOffset,
  moreOptionsAsync,
} from './topicSlice';
import styles from './Topic.module.scss';
import { TopicSearch } from '../../../features/TopicSearch/TopicSearch';
import { ArrowDownward, ArrowUpward } from '@mui/icons-material';
import { AuthButton } from '../../../features/AuthButton/AuthButton';
import { API, Auth } from 'aws-amplify';
import InfiniteScroll from 'react-infinite-scroll-component';
import ReactGA from 'react-ga4';

const CssIconButton = styled(IconButton)({
  backgroundColor: '#ffcb77',
  '&:hover': { backgroundColor: '#ffcb77' },
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
const CssButton = styled(Button)({
  backgroundColor: '#040403',
  '&:hover': { backgroundColor: '#040403' },
});
export function Topic(props: any) {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const topicData = useAppSelector(selectTopic);
  const optionsData = useAppSelector(selectOptions);
  const userVotesData = useAppSelector(selectUserVotes);
  const totalOptions = useAppSelector(selectTotal);
  const offset = useAppSelector(selectOffset);
  const [hasMore, setHasMore] = useState(true);
  const [suggestOptionText, setSuggestOptionText] = useState('');

  const fetchMoreData = () => {
    if (offset > totalOptions) {
      setHasMore(false);
      return;
    }
    dispatch(
      moreOptionsAsync({ topicId: location.pathname.substr(1), offset: offset })
    );
  };
  useEffect(() => {
    ReactGA.send(location.pathname);
  }, []);
  useEffect(() => {
    if (props.user !== null) {
      dispatch(topicAsync(location.pathname.substr(1)));
      dispatch(
        moreOptionsAsync({ topicId: location.pathname.substr(1), offset: 0 })
      );
      if (props.user) {
        dispatch(userVotesAsync(location.pathname.substr(1)));
      }
    }
  }, [props.user]);

  return (
    <div>
      <div className={styles.container} id="container">
        <div className={styles.navContainer}>
          <div className={styles.topicSearchContainer}>
            <Typography variant="h5" className={styles.txtWhatToBring}>
              What to bring...
            </Typography>
            <TopicSearch />
          </div>
          <div className={styles.authButton}>
            <AuthButton user={props.user} />
          </div>
        </div>
        <div className={styles.heading}>
          {topicData?.topicText && (
            <Typography variant="h2" className={styles.title}>
              What to bring {topicData.topicText}?
            </Typography>
          )}
          {props.user ? (
            <div className={styles.suggestAnOptionContainer}>
              <Typography variant="body1">Suggest an option:</Typography>{' '}
              <CssTextField
                sx={{ margin: '0 1rem' }}
                value={suggestOptionText}
                onChange={(e) => setSuggestOptionText(e.target.value)}
                focused
                placeholder=""
                variant="outlined"
                inputProps={{ maxLength: 32 }}
              />
              <CssButton
                variant="contained"
                onClick={async () => {
                  setSuggestOptionText('');
                  const myInit = {
                    headers: {
                      Authorization: `Bearer ${(await Auth.currentSession())
                        .getIdToken()
                        .getJwtToken()}`,
                    },
                    body: {
                      topicId: topicData.topicId,
                      optionText: suggestOptionText,
                    },
                  };
                  API.post('whatToBringApi', '/suggestOption', myInit);
                }}
              >
                Submit
              </CssButton>
            </div>
          ) : (
            <div className={styles.suggestAnOptionContainer}></div>
          )}
        </div>
        <div className={styles.contentsContainer}>
          <div className={styles.optionListContainer}>
            <InfiniteScroll
              dataLength={offset}
              next={fetchMoreData}
              hasMore={hasMore}
              loader={<h4>Loading...</h4>}
              endMessage={
                <p style={{ textAlign: 'center' }}>
                  <b>Fin.</b>
                </p>
              }
              scrollableTarget="container"
            >
              {optionsData?.map((options, i) => {
                return (
                  <div
                    className={styles.optionContainer}
                    key={options.optionId + '+' + i}
                  >
                    <div className={styles.innerOptionsContainer}>
                      <Typography variant="h3">{i + 1}.</Typography>
                      <div className={styles.voteContainer}>
                        <div className={styles.upvotesContainer}>
                          {userVotesData.upvotes?.includes(options.optionId) ? (
                            <CssIconButton color="inherit">
                              <ArrowUpward fontSize="inherit" />
                            </CssIconButton>
                          ) : (
                            <IconButton
                              color="inherit"
                              onClick={() => {
                                props.user
                                  ? dispatch(
                                      userUpvoteAsync({
                                        topicId: topicData.topicId,
                                        optionId: options.optionId,
                                      })
                                    )
                                  : Auth.federatedSignIn();
                              }}
                            >
                              <ArrowUpward fontSize="inherit" />
                            </IconButton>
                          )}
                          <Typography variant="body2">
                            {options.upvotes}
                          </Typography>
                        </div>
                        <div className={styles.downvotesContainer}>
                          {userVotesData.downvotes?.includes(
                            options.optionId
                          ) ? (
                            <CssIconButton color="inherit">
                              <ArrowDownward fontSize="inherit" />
                            </CssIconButton>
                          ) : (
                            <IconButton
                              color="inherit"
                              onClick={() => {
                                props.user
                                  ? dispatch(
                                      userDownvoteAsync({
                                        topicId: topicData.topicId,
                                        optionId: options.optionId,
                                      })
                                    )
                                  : Auth.federatedSignIn();
                              }}
                            >
                              <ArrowDownward fontSize="inherit" />
                            </IconButton>
                          )}
                          <Typography variant="body2">
                            {options.downvotes}
                          </Typography>
                        </div>
                      </div>
                      <Typography variant="body1">
                        {options.optionText}
                      </Typography>
                    </div>

                    {options.link && (
                      <Link
                        href="#"
                        underline="none"
                        color="white"
                        className={styles.linkAmazon}
                      >
                        <Typography variant="body2">SHOP NOW</Typography>
                      </Link>
                    )}
                  </div>
                );
              })}
            </InfiniteScroll>
          </div>
        </div>
      </div>
    </div>
  );
}
