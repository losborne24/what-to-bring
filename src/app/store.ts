import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import topicReducer from './screens/Topic/topicSlice';
import homeReducer from './screens/Home/homeSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    topic: topicReducer,
    home: homeReducer,
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
