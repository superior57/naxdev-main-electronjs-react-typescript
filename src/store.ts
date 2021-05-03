import { configureStore } from '@reduxjs/toolkit';
import accessPointReducer from '@/reducers/accessPoint';
import noticeReducer from '@/reducers/notice';
import subscribeReducer from '@/reducers/subscribe';
import referralReducer from '@/reducers/referrral';

export default configureStore({
  reducer: {
    accessPoint: accessPointReducer,
    notice: noticeReducer,
    subscribe: subscribeReducer,
    referral: referralReducer,
  },
});
