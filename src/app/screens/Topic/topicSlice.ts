import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../store';
import { fetchMoreOptions, fetchTopicAndOptions } from './topicAPI';

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
        console.log(action.payload);
        state.topicData = action.payload.topic;
        state.optionsData = action.payload.options;
      });
  },
});

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.topic.value)`
export const selectTopicAndOptions = (state: RootState) =>
  state.topic.topicData;

export const selectMoreOptions = (state: RootState) => state.topic.optionsData;

export default topicSlice.reducer;
