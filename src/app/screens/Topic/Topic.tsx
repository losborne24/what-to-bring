import { IconButton, Button, Typography, Link } from '@mui/material';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  selectMoreOptions,
  selectTopicAndOptions,
  topicAndOptionsAsync,
} from './topicSlice';
import styles from './Topic.module.scss';
import { TopicSearch } from '../../../features/TopicSearch/TopicSearch';
import { ArrowDownward, ArrowUpward } from '@mui/icons-material';
import { AuthButton } from '../../../features/AuthButton/AuthButton';
export function Topic(props: any) {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const topicData = useAppSelector(selectTopicAndOptions);
  const optionsData = useAppSelector(selectMoreOptions);

  useEffect(() => {
    dispatch(topicAndOptionsAsync(location.pathname.substr(1)));
  }, []);
  return (
    <div>
      <div className={styles.container}>
        <div className={styles.topicSearchContainer}>
          <Typography variant="h5"> What to bring...</Typography>{' '}
          <TopicSearch />
          <AuthButton user={props.user} />
        </div>
        <div className={styles.heading}>
          <Typography variant="h2">
            {topicData?.topicTextGeneric} {topicData?.topicText}?
          </Typography>
        </div>
        <div className={styles.contentsContainer}>
          <div className={styles.optionListContainer}>
            {optionsData?.map((options, i) => {
              return (
                <div className={styles.optionContainer}>
                  <div className={styles.innerOptionsContainer}>
                    <Typography variant="h3">{i + 1}.</Typography>
                    <div className={styles.voteContainer}>
                      <div className={styles.upvotesContainer}>
                        <IconButton color="inherit">
                          <ArrowUpward fontSize="inherit" />
                        </IconButton>
                        <Typography variant="body2">0</Typography>
                      </div>
                      <div className={styles.downvotesContainer}>
                        <IconButton color="inherit">
                          <ArrowDownward fontSize="inherit" />
                        </IconButton>
                        <Typography variant="body2">0</Typography>
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
