import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import { fetchFilterTopics } from './topicSearchAPI';
import { API } from 'aws-amplify';
export interface TopicSearchState {
  filterTopics: {
    topicId: string;
    topicTextGeneric: string;
    topicText: string;
  }[];
  status: 'idle' | 'loading' | 'failed';
}

const initialState: TopicSearchState = {
  filterTopics: [],
  status: 'idle',
};

export const filterTopicAsync = createAsyncThunk(
  'topicSearch/fetchFilterTopics',
  async (topicId: string) => {
    const response = await API.get('whatToBringApi', '/topic/filter', {
      queryStringParameters: { filterText: topicId },
    });
    return response;
  }
);

export const topicSearchSlice = createSlice({
  name: 'topicSearch',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(filterTopicAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(filterTopicAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.filterTopics = action.payload;
      });
  },
});

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.topic.value)`
export const selectFilterTopics = (state: RootState) =>
  state.topicSearch.filterTopics;

export const selectStatus = (state: RootState) => state.topicSearch.status;

export default topicSearchSlice.reducer;
