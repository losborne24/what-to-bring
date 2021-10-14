import { IconButton, Button, Typography, Link, styled } from '@mui/material';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  selectMoreOptions,
  selectTopicAndOptions,
  topicAndOptionsAsync,
  userVotes,
  userVotesAsync,
  userDownvoteAsync,
  userUpvoteAsync,
} from './topicSlice';
import styles from './Topic.module.scss';
import { TopicSearch } from '../../../features/TopicSearch/TopicSearch';
import { ArrowDownward, ArrowUpward } from '@mui/icons-material';
import { AuthButton } from '../../../features/AuthButton/AuthButton';

const CssIconButton = styled(IconButton)({
  backgroundColor: '#ffcb77',
  '&:hover': { backgroundColor: '#ffcb77' },
});

export function Topic(props: any) {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const topicData = useAppSelector(selectTopicAndOptions);
  const optionsData = useAppSelector(selectMoreOptions);
  const userVotesData = useAppSelector(userVotes);

  useEffect(() => {
    dispatch(topicAndOptionsAsync(location.pathname.substr(1)));
    if (props.user) {
      dispatch(
        userVotesAsync({ topicId: location.pathname.substr(1), offset: 0 })
      );
    }
  }, []);
  return (
    <div>
      <div className={styles.container}>
        <div className={styles.navContainer}>
          <div className={styles.topicSearchContainer}>
            <Typography variant="h5" className={styles.txtWhatToBring}>
              What to bring...
            </Typography>
            <TopicSearch />
          </div>
          <div>
            <AuthButton user={props.user} />
          </div>
        </div>
        <div className={styles.heading}>
          {topicData?.topicTextGeneric && (
            <Typography variant="h2">
              {topicData.topicTextGeneric} {topicData.topicText}?
            </Typography>
          )}
        </div>
        <div className={styles.contentsContainer}>
          <div className={styles.optionListContainer}>
            {optionsData?.map((options, i) => {
              return (
                <div className={styles.optionContainer} key={options.optionId}>
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
                              dispatch(userUpvoteAsync(options.optionId));
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
                        {userVotesData.downvotes?.includes(options.optionId) ? (
                          <CssIconButton color="inherit">
                            <ArrowDownward fontSize="inherit" />
                          </CssIconButton>
                        ) : (
                          <IconButton
                            color="inherit"
                            onClick={() => {
                              dispatch(userDownvoteAsync(options.optionId));
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
          </div>
        </div>
      </div>
    </div>
  );
}
