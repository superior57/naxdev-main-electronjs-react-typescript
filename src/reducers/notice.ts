import { createSlice } from '@reduxjs/toolkit';
import { Notice } from '@/type';
import { fetchNotices as fetchListApi, markAsRead as markAsReadApi } from '@/api';

type NoticeState = {
  loading: boolean;
  list: Notice[];
};
export const noticeSlice = createSlice({
  name: 'notice',
  initialState: {
    loading: false,
    list: [],
  },
  reducers: {
    request: (state) => {
      state.loading = true;
    },
    response: (state, action) => {
      state.loading = false;
      state.list = action.payload;
    },
    read: (state, action) => {
      state.list = state.list.map((item: Notice) => {
        if (item.id === action.payload) {
          return {
            ...item,
            read: true,
          };
        }
        return item;
      }) as any;
    },
  },
});

const { request, response, read } = noticeSlice.actions;

export const fetchNotices = () => async (dispatch: any) => {
  dispatch(request());
  const list = await fetchListApi();
  dispatch(response(list));
};

export const markNoticeAsRead = (id: number) => async (dispatch: any) => {
  await markAsReadApi(id);
  dispatch(read(id));
};

export const selectNotices = (state: { notice: NoticeState }) => state.notice.list;

export default noticeSlice.reducer;
