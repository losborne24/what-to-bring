import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../store';
import {
  fetchMoreOptions,
  fetchTopicAndOptions,
  fetchUserVotes,
  setUserDownvote,
  setUserUpvote,
} from './topicAPI';

export interface TopicState {
  topicData: {
    topicId: string;
    topicTextGeneric: string;
    topicText: string;
  };
  optionsData: {
    optionId: number;
    topicId: string;
    optionText: string;
    upvotes: number;
    downvotes: number;
    rank: number;
    link?: string;
  }[];
  userVotes: {
    upvotes: number[];
    downvotes: number[];
  };
  status: 'idle' | 'loading' | 'failed';
  offset: number;
}

const initialState: TopicState = {
  topicData: {
    topicId: '',
    topicTextGeneric: '',
    topicText: '',
  },
  optionsData: [],
  status: 'idle',
  offset: 0,
  userVotes: { upvotes: [], downvotes: [] },
};

export const topicAndOptionsAsync = createAsyncThunk(
  'topic/fetchTopicAndOptions',
  async (topicId: string) => {
    const response = await fetchTopicAndOptions(topicId);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);
export const moreOptionsAsync = createAsyncThunk(
  'topic/fetchMoreOptions',
  async (payload: { topicId: string; offset: number }) => {
    const response = await fetchMoreOptions(payload.topicId, payload.offset);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const userVotesAsync = createAsyncThunk(
  'topic/fetchUserVotes',
  async (payload: { topicId: string; offset: number }) => {
    const response = await fetchUserVotes(payload.topicId, payload.offset);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);
export const userDownvoteAsync = createAsyncThunk(
  'topic/setUserDownvote',
  async (optionId: number) => {
    const response = await setUserDownvote(optionId);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);
export const userUpvoteAsync = createAsyncThunk(
  'topic/setUserUpvote',
  async (optionId: number) => {
    const response = await setUserUpvote(optionId);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const topicSlice = createSlice({
  name: 'topic',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(topicAndOptionsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(topicAndOptionsAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.topicData = action.payload.topic;
        state.optionsData = action.payload.options;
      })
      .addCase(userVotesAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(userVotesAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.userVotes = action.payload;
      })
      .addCase(userDownvoteAsync.pending, (state, { meta }) => {
        state.status = 'loading';
        if (state.userVotes.upvotes.includes(meta.arg)) {
          state.userVotes.upvotes = state.userVotes.upvotes.filter(
            (id) => id !== meta.arg
          );
          let _option = state.optionsData.find(
            (option) => option.optionId === meta.arg
          );
          if (_option) _option.upvotes -= 1;
        }
        if (!state.userVotes.downvotes.includes(meta.arg)) {
          state.userVotes.downvotes.push(meta.arg);
          let _option = state.optionsData.find(
            (option) => option.optionId === meta.arg
          );
          if (_option) _option.downvotes += 1;
        }
      })
      .addCase(userDownvoteAsync.fulfilled, (state, action) => {
        state.status = 'idle';
      })
      .addCase(userUpvoteAsync.pending, (state, { meta }) => {
        state.status = 'loading';
        if (state.userVotes.downvotes.includes(meta.arg)) {
          state.userVotes.downvotes = state.userVotes.downvotes.filter(
            (id) => id !== meta.arg
          );
          let _option = state.optionsData.find(
            (option) => option.optionId === meta.arg
          );
          if (_option) _option.downvotes -= 1;
        }
        if (!state.userVotes.upvotes.includes(meta.arg)) {
          state.userVotes.upvotes.push(meta.arg);
          let _option = state.optionsData.find(
            (option) => option.optionId === meta.arg
          );
          if (_option) _option.upvotes += 1;
        }
      })
      .addCase(userUpvoteAsync.fulfilled, (state, action) => {
        state.status = 'idle';
      });
  },
});

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.topic.value)`
export const selectTopicAndOptions = (state: RootState) =>
  state.topic.topicData;

export const selectMoreOptions = (state: RootState) => state.topic.optionsData;

export const userVotes = (state: RootState) => state.topic.userVotes;

export default topicSlice.reducer;
