import { IconButton, Button, Typography, Link, styled } from '@mui/material';
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
import { Auth } from 'aws-amplify';
import InfiniteScroll from 'react-infinite-scroll-component';
import { selectStatus } from '../../../features/TopicSearch/topicSearchSlice';

const CssIconButton = styled(IconButton)({
  backgroundColor: '#ffcb77',
  '&:hover': { backgroundColor: '#ffcb77' },
});

export function Topic(props: any) {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const topicData = useAppSelector(selectTopic);
  const optionsData = useAppSelector(selectOptions);
  const userVotesData = useAppSelector(selectUserVotes);
  const totalOptions = useAppSelector(selectTotal);
  const status = useAppSelector(selectStatus);
  const offset = useAppSelector(selectOffset);
  const [hasMore, setHasMore] = useState(true);

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
            <Typography variant="h2">
              What to bring {topicData.topicText}?
            </Typography>
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
                              disabled={status === 'loading'}
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
                              disabled={status === 'loading'}
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
