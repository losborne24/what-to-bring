import API from '@aws-amplify/api';
import Auth from '@aws-amplify/auth';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../store';
import { fetchUserVotes, setUserDownvote, setUserUpvote } from './topicAPI';

export interface TopicState {
  topicData: {
    topicId: string;
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
  total: number;
}

const initialState: TopicState = {
  topicData: {
    topicId: '',
    topicText: '',
  },
  optionsData: [],
  status: 'idle',
  offset: 0,
  total: 0,
  userVotes: { upvotes: [], downvotes: [] },
};

export const topicAsync = createAsyncThunk(
  'topic/fetchTopic',
  async (topicId: string) => {
    const response = await API.get(
      'whatToBringApi',
      `/topic/object/${topicId}`,
      {}
    );
    return response;
  }
);

export const moreOptionsAsync = createAsyncThunk(
  'topic/fetchMoreOptions',
  async (payload: { topicId: string; offset: number }) => {
    //const response = await fetchMoreOptions(payload.topicId, payload.offset);
    // The value we return becomes the `fulfilled` action payload
    const response = await API.get('whatToBringApi', '/option', {
      queryStringParameters: {
        topicId: payload.topicId,
        offset: payload.offset,
      },
    });
    return {
      options: response.Items,
      total: response.Count,
    };
  }
);

export const userVotesAsync = createAsyncThunk(
  'topic/fetchUserVotes',
  async (topicId: string) => {
    const myInit = {
      headers: {
        Authorization: `Bearer ${(await Auth.currentSession())
          .getIdToken()
          .getJwtToken()}`,
      },
    };
    const response = await API.get(
      'whatToBringApi',
      `/vote/${topicId}`,
      myInit
    );
    return {
      upvotes: response.upvotes || [],
      downvotes: response.downvotes || [],
    };
  }
);
export const userDownvoteAsync = createAsyncThunk(
  'topic/setUserDownvote',
  async (payload: { topicId: string; optionId: number }) => {
    const myInit = {
      headers: {
        Authorization: `Bearer ${(await Auth.currentSession())
          .getIdToken()
          .getJwtToken()}`,
      },
      body: {
        topicId: payload.topicId,
        optionId: payload.optionId,
      },
    };
    const response = await API.post('whatToBringApi', '/vote/downvote', myInit);
    // const response = await setUserDownvote(payload.optionId);
    // The value we return becomes the `fulfilled` action payload
    return { isChange: response.data, optionId: payload.optionId };
  }
);
export const userUpvoteAsync = createAsyncThunk(
  'topic/setUserUpvote',
  async (payload: { topicId: string; optionId: number }) => {
    const myInit = {
      headers: {
        Authorization: `Bearer ${(await Auth.currentSession())
          .getIdToken()
          .getJwtToken()}`,
      },
      body: {
        topicId: payload.topicId,
        optionId: payload.optionId,
      },
    };
    const response = await API.post('whatToBringApi', '/vote/upvote', myInit);
    // The value we return becomes the `fulfilled` action payload
    return { isChange: response.data, optionId: payload.optionId };
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
      })
      .addCase(moreOptionsAsync.pending, (state, { meta }) => {
        state.status = 'loading';
        if (meta.arg.offset === 0) {
          state.offset = 0;
          state.optionsData = [];
        }
      })
      .addCase(moreOptionsAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.optionsData.push.apply(state.optionsData, action.payload.options);
        state.total = action.payload.total;
        state.offset += 25;
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
        if (state.userVotes.upvotes.includes(meta.arg.optionId)) {
          state.userVotes.upvotes = state.userVotes.upvotes.filter(
            (id) => id !== meta.arg.optionId
          );
          const _option = state.optionsData.find(
            (option) => option.optionId === meta.arg.optionId
          );
          if (_option) _option.upvotes -= 1;
        }
        if (!state.userVotes.downvotes.includes(meta.arg.optionId)) {
          state.userVotes.downvotes.push(meta.arg.optionId);
          const _option = state.optionsData.find(
            (option) => option.optionId === meta.arg.optionId
          );
          if (_option) _option.downvotes += 1;
        }
      })
      .addCase(userDownvoteAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        if (action.payload.isChange === true) {
          const _option = state.optionsData.find(
            (option) => option.optionId === action.payload.optionId
          );
          if (_option) {
            _option.rank += 1;
            const index = state.optionsData.indexOf(_option);
            state.optionsData.splice(
              index + 1,
              0,
              state.optionsData.splice(index, 1)[0]
            );
          }
        }
      })
      .addCase(userUpvoteAsync.pending, (state, { meta }) => {
        state.status = 'loading';
        if (state.userVotes.downvotes.includes(meta.arg.optionId)) {
          state.userVotes.downvotes = state.userVotes.downvotes.filter(
            (id) => id !== meta.arg.optionId
          );
          const _option = state.optionsData.find(
            (option) => option.optionId === meta.arg.optionId
          );
          if (_option) _option.downvotes -= 1;
        }
        if (!state.userVotes.upvotes.includes(meta.arg.optionId)) {
          state.userVotes.upvotes.push(meta.arg.optionId);
          const _option = state.optionsData.find(
            (option) => option.optionId === meta.arg.optionId
          );
          if (_option) _option.upvotes += 1;
        }
      })
      .addCase(userUpvoteAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        if (action.payload.isChange === true) {
          const _option = state.optionsData.find(
            (option) => option.optionId === action.payload.optionId
          );
          if (_option) {
            _option.rank += 1;
            const index = state.optionsData.indexOf(_option);
            state.optionsData.splice(
              index - 1,
              0,
              state.optionsData.splice(index, 1)[0]
            );
          }
        }
      });
  },
});

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.topic.value)`
export const selectTopic = (state: RootState) => state.topic.topicData;
export const selectOptions = (state: RootState) => state.topic.optionsData;
export const selectTotal = (state: RootState) => state.topic.total;
export const selectOffset = (state: RootState) => state.topic.offset;

export const selectUserVotes = (state: RootState) => state.topic.userVotes;
export const selectStatus = (state: RootState) => state.topic.status;

export default topicSlice.reducer;
