import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../store';
import { fetchFilterTopics } from './homeAPI';

export interface HomeState {
  filterTopics: {
    topicId: string;
    topicTextGeneric: string;
    topicTextBold: string;
  }[];
  status: 'idle' | 'loading' | 'failed';
}

const initialState: HomeState = {
  filterTopics: [],
  status: 'idle',
};

export const filterTopicAsync = createAsyncThunk(
  'home/fetchFilterTopics',
  async (topicId: string) => {
    const response = await fetchFilterTopics(topicId);
    console.log(response.data);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const homeSlice = createSlice({
  name: 'home',
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
export const selectFilterTopics = (state: RootState) => state.home.filterTopics;

export default homeSlice.reducer;
