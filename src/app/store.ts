import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import topicSearchReducer from '../features/TopicSearch/topicSearchSlice';
import topicReducer from './screens/Topic/topicSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    topic: topicReducer,
    topicSearch: topicSearchReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
