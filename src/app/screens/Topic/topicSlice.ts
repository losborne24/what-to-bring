import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../store';
import { fetchTopic } from './topicAPI';

export interface TopicState {
  topicData: {
    topicId: string;
    topicTextGeneric: string;
    topicTextBold: string;
  };
  status: 'idle' | 'loading' | 'failed';
}

const initialState: TopicState = {
  topicData: {
    topicId: '',
    topicTextGeneric: '',
    topicTextBold: '',
  },
  status: 'idle',
};

export const topicAsync = createAsyncThunk(
  'topic/fetchTopic',
  async (topicId: string) => {
    const response = await fetchTopic(topicId);
    console.log(response.data);
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
      .addCase(topicAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(topicAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.topicData = action.payload;
      });
  },
});

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.topic.value)`
export const selectTopic = (state: RootState) => state.topic.topicData;

export default topicSlice.reducer;
