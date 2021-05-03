import { createSlice } from '@reduxjs/toolkit';
import { SubscribeInfo } from '@/type';
import { getSubscribeInfo } from '@/api';

type SubscribeState = {
  loading: boolean;
  info: SubscribeInfo;
};
export const subscribeSlice = createSlice({
  name: 'subscribe',
  initialState: {
    loading: false,
    info: null,
  },
  reducers: {
    request: (state) => {
      state.loading = true;
    },
    response: (state, action) => {
      state.loading = false;
      state.info = action.payload;
    },
  },
});

const { request, response } = subscribeSlice.actions;

export const fetchSubscribe = () => async (dispatch: any) => {
  dispatch(request());
  const info = await getSubscribeInfo();
  dispatch(response(info));
};

export const selectSubscribe = (state: { subscribe: SubscribeState }) => state.subscribe.info;

export default subscribeSlice.reducer;
